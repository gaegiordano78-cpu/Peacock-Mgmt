-- Contract document links retain the permissions of their original Drive files.
alter table public.modelle
  add column if not exists contratto_inizio text,
  add column if not exists contratto_url text,
  add column if not exists contratto_rinnovo_automatico boolean,
  add column if not exists contratto_durata_mesi integer;
