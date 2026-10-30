-- Small generated PDFs are stored atomically with their index, so a successful
-- export can never leave an index without a file (or a file without an index).
create table public.receipt_archive (
  id uuid primary key default gen_random_uuid(),
  model_id text not null,
  job_id bigint not null,
  model_name text not null,
  brand text not null,
  receipt_number text not null,
  receipt_date date not null,
  gross numeric(12,2) not null,
  withholding numeric(12,2) not null,
  net numeric(12,2) not null,
  filename text not null,
  created_at timestamptz not null default now(),
  created_by uuid not null,
  source_hash text not null,
  pdf_sha256 text not null,
  unique(model_id, job_id, source_hash)
);
create index receipt_archive_created_idx on public.receipt_archive(created_at desc, id);
create index receipt_archive_model_idx on public.receipt_archive(model_id, created_at desc);
alter table public.receipt_archive enable row level security;
revoke all on public.receipt_archive from public, anon, authenticated;
grant select on public.receipt_archive to authenticated;
create policy receipt_archive_read on public.receipt_archive for select to authenticated using (
  public.is_admin() or exists (select 1 from public.modelle m where m.id = model_id and m.user_id = (select auth.uid()))
);
create table private.receipt_files (
  receipt_id uuid primary key references public.receipt_archive(id),
  pdf bytea not null check(octet_length(pdf) between 8 and 524288)
);
alter table private.receipt_files enable row level security;
revoke all on private.receipt_files from public, anon, authenticated;

create function private.save_receipt(p_data jsonb, p_source text, p_pdf text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  actor uuid := auth.uid();
  m public.modelle%rowtype;
  j public.jobs%rowtype;
  r public.receipt_archive%rowtype;
  bytes bytea;
  source_key text;
  safe_name text;
begin
  if actor is null then raise exception 'Accesso richiesto' using errcode='42501'; end if;
  select * into m from public.modelle where id = p_data->>'model_id';
  if not found or not (public.is_admin() or coalesce(m.user_id = actor,false)) then
    raise exception 'Profilo non autorizzato' using errcode='42501';
  end if;
  select * into j from public.jobs where id = (p_data->>'job_id')::bigint;
  if not found or btrim(j.modella) is distinct from btrim(m.nome) then
    raise exception 'Job non associato al profilo' using errcode='42501';
  end if;
  if not public.is_admin() and (select count(*) from public.modelle where btrim(nome)=btrim(j.modella)) <> 1 then
    raise exception 'Associazione job da verificare' using errcode='42501';
  end if;
  if p_source is null or length(p_source) not between 1 and 300000 or p_pdf is null or length(p_pdf)>710000 then
    raise exception 'Documento non valido';
  end if;
  if (p_data->>'net')::numeric is distinct from coalesce(j.netto_model,0)::numeric then
    raise exception 'Il compenso è cambiato: riapri il job prima di generare la ritenuta';
  end if;
  bytes := decode(p_pdf,'base64');
  if octet_length(bytes) not between 8 and 524288 or substring(bytes from 1 for 5) <> decode('255044462d','hex') then
    raise exception 'PDF non valido';
  end if;
  if length(coalesce(p_data->>'number','')) > 100 then raise exception 'Numero troppo lungo'; end if;
  source_key := encode(extensions.digest(convert_to(p_source,'UTF8'),'sha256'),'hex');
  safe_name := left(regexp_replace(btrim(m.nome), '[<>:"/\\|?*[:cntrl:]]','-','g'),90)
    || case when nullif(btrim(j.cliente),'') is null then '' else ' per ' || left(regexp_replace(btrim(j.cliente), '[<>:"/\\|?*[:cntrl:]]','-','g'),90) end || '.pdf';
  -- The conflict path returns the original bytes, never overwrites an earlier PDF.
  insert into public.receipt_archive(model_id,job_id,model_name,brand,receipt_number,receipt_date,gross,withholding,net,filename,created_by,source_hash,pdf_sha256)
  values(m.id,j.id,btrim(m.nome),coalesce(j.cliente,''),coalesce(p_data->>'number',''),
    (p_data->>'date')::date,round(coalesce(j.netto_model,0)::numeric/0.8,2),round(coalesce(j.netto_model,0)::numeric/0.8*0.2,2),coalesce(j.netto_model,0),safe_name,actor,source_key,
    encode(extensions.digest(bytes,'sha256'),'hex'))
  on conflict(model_id,job_id,source_hash) do nothing returning * into r;
  if r.id is not null then
    insert into private.receipt_files values(r.id,bytes);
  else
    select * into strict r from public.receipt_archive where model_id=m.id and job_id=j.id and source_hash=source_key;
    select pdf into strict bytes from private.receipt_files where receipt_id=r.id;
  end if;
  return jsonb_build_object('id',r.id,'filename',r.filename,'pdf',encode(bytes,'base64'));
end;
$$;
create function private.get_receipt(p_id uuid)
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare r public.receipt_archive%rowtype; bytes bytea;
begin
  if auth.uid() is null then raise exception 'Accesso richiesto' using errcode='42501'; end if;
  select * into r from public.receipt_archive where id=p_id;
  if not found or not (public.is_admin() or exists(select 1 from public.modelle m where m.id=r.model_id and m.user_id=auth.uid())) then
    raise exception 'Ritenuta non disponibile' using errcode='42501';
  end if;
  select pdf into strict bytes from private.receipt_files where receipt_id=r.id;
  return jsonb_build_object('id',r.id,'filename',r.filename,'pdf',encode(bytes,'base64'));
end;
$$;
create function public.save_receipt(p_data jsonb, p_source text, p_pdf text)
returns jsonb language sql security invoker set search_path = '' as $$select private.save_receipt(p_data,p_source,p_pdf)$$;
create function public.get_receipt(p_id uuid)
returns jsonb language sql stable security invoker set search_path = '' as $$select private.get_receipt(p_id)$$;
revoke all on function private.save_receipt(jsonb,text,text), private.get_receipt(uuid), public.save_receipt(jsonb,text,text), public.get_receipt(uuid) from public, anon, authenticated;
grant usage on schema private to authenticated;
grant execute on function private.save_receipt(jsonb,text,text), private.get_receipt(uuid), public.save_receipt(jsonb,text,text), public.get_receipt(uuid) to authenticated;
