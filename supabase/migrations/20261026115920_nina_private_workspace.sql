-- Gae's private workspace. Public chat webhooks do not expose these operations.
create table if not exists private.nina_workspace_config (
  singleton boolean primary key default true check (singleton),
  secret_hash text not null check (length(secret_hash) = 64)
);
create table if not exists private.nina_memories (
  id uuid primary key default gen_random_uuid(),
  ambito text not null check (ambito in ('personale','peacock')),
  chiave text not null check (length(chiave) between 1 and 150),
  contenuto text not null check (length(contenuto) between 1 and 3000),
  stato text not null default 'attiva' check (stato in ('attiva','archiviata')),
  fonte text not null default 'Istruzione esplicita di Gae',
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique (ambito,chiave)
);
create table if not exists private.nina_projects (
  id uuid primary key default gen_random_uuid(),
  ambito text not null check (ambito in ('personale','peacock')),
  titolo text not null check (length(titolo) between 1 and 200),
  descrizione text not null default '' check (length(descrizione) <= 3000),
  stato text not null default 'attivo' check (stato in ('attivo','completato','archiviato')),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique (ambito,titolo)
);
create table if not exists private.nina_tasks (
  id uuid primary key default gen_random_uuid(),
  ambito text not null check (ambito in ('personale','peacock')),
  progetto_id uuid references private.nina_projects(id),
  titolo text not null check (length(titolo) between 1 and 200),
  note text not null default '' check (length(note) <= 3000),
  scadenza timestamptz,
  stato text not null default 'aperta' check (stato in ('aperta','completata','annullata')),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists private.nina_workspace_events (
  id bigint generated always as identity primary key,
  operazione text not null, entity_id uuid not null,
  precedente jsonb, corrente jsonb,
  created_at timestamptz not null default now()
);
alter table private.nina_workspace_config enable row level security;
alter table private.nina_memories enable row level security;
alter table private.nina_projects enable row level security;
alter table private.nina_tasks enable row level security;
alter table private.nina_workspace_events enable row level security;
revoke all on private.nina_workspace_config,private.nina_memories,private.nina_projects,private.nina_tasks,private.nina_workspace_events from public,anon,authenticated;
revoke all on sequence private.nina_workspace_events_id_seq from public,anon,authenticated;

create or replace function public.nina_workspace_request(p_secret text,p_operazione text,p_dati jsonb default '{}'::jsonb)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_expected text; v_scope text; v_limit integer; v_id uuid; v_project uuid;
  v_before jsonb; v_result jsonb; v_search text;
begin
  select secret_hash into v_expected from private.nina_workspace_config where singleton;
  if p_secret is null or v_expected is null or
     encode(extensions.digest(p_secret,'sha256'),'hex') is distinct from v_expected then
    raise exception 'Accesso privato Nina non autorizzato' using errcode='42501';
  end if;
  if jsonb_typeof(p_dati) is distinct from 'object' then raise exception 'Parametri non validi'; end if;
  v_scope := coalesce(p_dati->>'ambito','personale');
  if v_scope not in ('personale','peacock') then raise exception 'Ambito non valido'; end if;
  v_limit := least(20,greatest(1,coalesce((p_dati->>'limite')::integer,10)));
  v_search := coalesce(p_dati->>'cerca','');
  case p_operazione
    when 'memoria_cerca' then
      select coalesce(jsonb_agg(x),'[]'::jsonb) into v_result from (
        select id,ambito,chiave,contenuto,fonte,updated_at from private.nina_memories
        where stato='attiva' and (not(p_dati ? 'ambito') or ambito=v_scope)
          and (v_search='' or chiave ilike '%'||v_search||'%' or contenuto ilike '%'||v_search||'%')
        order by updated_at desc limit v_limit
      ) x; return v_result;
    when 'memoria_salva' then
      if nullif(trim(p_dati->>'chiave'),'') is null or nullif(trim(p_dati->>'contenuto'),'') is null then raise exception 'Chiave e contenuto richiesti'; end if;
      select to_jsonb(m) into v_before from private.nina_memories m where ambito=v_scope and chiave=trim(p_dati->>'chiave') for update;
      insert into private.nina_memories(ambito,chiave,contenuto)
        values(v_scope,trim(p_dati->>'chiave'),trim(p_dati->>'contenuto'))
        on conflict(ambito,chiave) do update set contenuto=excluded.contenuto,stato='attiva',updated_at=now()
        returning id,to_jsonb(nina_memories.*) into v_id,v_result;
    when 'memoria_archivia' then
      v_id := (p_dati->>'id')::uuid;
      select to_jsonb(m) into v_before from private.nina_memories m where id=v_id for update;
      update private.nina_memories set stato='archiviata',updated_at=now() where id=v_id returning to_jsonb(nina_memories.*) into v_result;
    when 'progetti_elenca' then
      select coalesce(jsonb_agg(x),'[]'::jsonb) into v_result from (
        select * from private.nina_projects where (not(p_dati ? 'ambito') or ambito=v_scope)
          and stato=coalesce(p_dati->>'stato','attivo')
          and (v_search='' or titolo ilike '%'||v_search||'%' or descrizione ilike '%'||v_search||'%')
        order by updated_at desc limit v_limit
      ) x; return v_result;
    when 'progetto_crea' then
      if nullif(trim(p_dati->>'titolo'),'') is null then raise exception 'Titolo richiesto'; end if;
      insert into private.nina_projects(ambito,titolo,descrizione) values(v_scope,trim(p_dati->>'titolo'),coalesce(p_dati->>'descrizione',''))
        returning id,to_jsonb(nina_projects.*) into v_id,v_result;
    when 'progetto_aggiorna' then
      v_id := (p_dati->>'id')::uuid;
      select to_jsonb(p) into v_before from private.nina_projects p where id=v_id for update;
      update private.nina_projects set titolo=coalesce(p_dati->>'titolo',titolo),descrizione=coalesce(p_dati->>'descrizione',descrizione),
        stato=coalesce(p_dati->>'stato',stato),updated_at=now() where id=v_id returning to_jsonb(nina_projects.*) into v_result;
    when 'attivita_elenca' then
      select coalesce(jsonb_agg(x),'[]'::jsonb) into v_result from (
        select * from private.nina_tasks where (not(p_dati ? 'ambito') or ambito=v_scope)
          and stato=coalesce(p_dati->>'stato','aperta')
          and (not(p_dati ? 'progetto_id') or progetto_id=(p_dati->>'progetto_id')::uuid)
          and (v_search='' or titolo ilike '%'||v_search||'%' or note ilike '%'||v_search||'%')
        order by scadenza asc nulls last,updated_at desc limit v_limit
      ) x; return v_result;
    when 'attivita_crea' then
      if nullif(trim(p_dati->>'titolo'),'') is null then raise exception 'Titolo richiesto'; end if;
      v_project := (p_dati->>'progetto_id')::uuid;
      if v_project is not null then
        select ambito into v_scope from private.nina_projects where id=v_project and stato='attivo';
        if not found then raise exception 'Progetto attivo non trovato'; end if;
      end if;
      insert into private.nina_tasks(ambito,progetto_id,titolo,note,scadenza)
        values(v_scope,v_project,trim(p_dati->>'titolo'),coalesce(p_dati->>'note',''),nullif(p_dati->>'scadenza','')::timestamptz)
        returning id,to_jsonb(nina_tasks.*) into v_id,v_result;
    when 'attivita_aggiorna' then
      v_id := (p_dati->>'id')::uuid;
      select to_jsonb(t) into v_before from private.nina_tasks t where id=v_id for update;
      update private.nina_tasks set titolo=coalesce(p_dati->>'titolo',titolo),note=coalesce(p_dati->>'note',note),
        stato=coalesce(p_dati->>'stato',stato),
        scadenza=case when p_dati ? 'scadenza' then nullif(p_dati->>'scadenza','')::timestamptz else scadenza end,
        updated_at=now() where id=v_id returning to_jsonb(nina_tasks.*) into v_result;
    else raise exception 'Operazione non supportata';
  end case;
  if v_result is null then raise exception 'Elemento non trovato'; end if;
  insert into private.nina_workspace_events(operazione,entity_id,precedente,corrente) values(p_operazione,v_id,v_before,v_result);
  return v_result;
end $$;
revoke all on function public.nina_workspace_request(text,text,jsonb) from public;
grant execute on function public.nina_workspace_request(text,text,jsonb) to anon,authenticated;
comment on function public.nina_workspace_request(text,text,jsonb) is
  'Private owner-only workspace API. Requires a purpose-derived backend secret; never expose through public Telegram/WhatsApp tools. No access to other agency tables or arbitrary SQL. Missing configuration denies all access.';
