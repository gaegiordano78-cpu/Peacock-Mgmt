-- Remove the legacy permissive SELECT that overrode the owner/admin policy.
-- Applied to the existing project on 2026-10-26; idempotent for subsequent deploys.
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'candidature'
      and policyname = 'candidature_select'
      and roles::text = '{authenticated}'
      and qual like '%is_admin()%'
      and qual like '%user_id = auth.uid()%'
  ) then
    raise exception 'Expected owner/admin policy is missing; refusing to change access';
  end if;
end $$;
drop policy if exists "Tutti leggono candidature" on public.candidature;
