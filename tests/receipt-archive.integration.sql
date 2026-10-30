-- Run within BEGIN/ROLLBACK. Fixtures reference existing identities without changing them.
create temp table receipt_test as
select m.id model_id, m.user_id actor, j.id job_id, j.netto_model net,
 (select p.id from public.profiles p where p.ruolo='admin' limit 1) admin,
 (select m2.user_id from public.modelle m2 where m2.user_id is not null and m2.user_id<>m.user_id limit 1) other_actor
from public.modelle m join public.jobs j on btrim(m.nome)=btrim(j.modella)
where m.user_id is not null and (select count(*) from public.modelle x where btrim(x.nome)=btrim(m.nome))=1 limit 1;
grant select on receipt_test to authenticated, anon;
create temp table receipt_result (body jsonb);
grant all on receipt_result to authenticated;
select set_config('request.jwt.claims',jsonb_build_object('sub',actor,'role','authenticated')::text,true) from receipt_test;
set local role authenticated;
insert into receipt_result select public.save_receipt(jsonb_build_object('model_id',model_id,'job_id',job_id,'net',net,'number','ARCHIVE-TEST','date','2026-10-30'),'<html>original test</html>',encode(convert_to('%PDF-1.4 original test','UTF8'),'base64')) from receipt_test;
do $$declare r jsonb; second jsonb; begin
 select body into strict r from receipt_result;
 select public.save_receipt(jsonb_build_object('model_id',model_id,'job_id',job_id,'net',net,'number','ARCHIVE-TEST','date','2026-10-30'),'<html>original test</html>',encode(convert_to('%PDF-1.4 different random metadata','UTF8'),'base64')) into second from receipt_test;
 if r is distinct from second then raise exception 'Retry overwrote original PDF'; end if;
 if public.get_receipt((r->>'id')::uuid) is distinct from r then raise exception 'Roundtrip mismatch'; end if;
 if (select count(*) from public.receipt_archive where id=(r->>'id')::uuid) <> 1 then raise exception 'Own index missing'; end if;
 begin perform * from private.receipt_files; raise exception 'Private files exposed'; exception when insufficient_privilege then null; end;
 begin update public.receipt_archive set brand='tampered' where id=(r->>'id')::uuid; raise exception 'Update allowed'; exception when insufficient_privilege then null; end;
 begin delete from public.receipt_archive where id=(r->>'id')::uuid; raise exception 'Delete allowed'; exception when insufficient_privilege then null; end;
end$$;
-- Edited receipt creates a new immutable version.
insert into receipt_result select public.save_receipt(jsonb_build_object('model_id',model_id,'job_id',job_id,'net',net,'number','ARCHIVE-TEST-2','date','2026-10-30'),'<html>edited test</html>',encode(convert_to('%PDF-1.4 edited test','UTF8'),'base64')) from receipt_test;
do $$begin if (select count(distinct body->>'id') from receipt_result)<>2 then raise exception 'Edited version missing'; end if; end$$;
select set_config('request.jwt.claims',jsonb_build_object('sub',other_actor,'role','authenticated')::text,true) from receipt_test;
do $$declare r uuid; begin
 select (body->>'id')::uuid into r from receipt_result limit 1;
 if exists(select 1 from public.receipt_archive where id=r) then raise exception 'Other model can list'; end if;
 begin perform public.get_receipt(r); raise exception 'Other model can download'; exception when insufficient_privilege then null; end;
 begin perform public.save_receipt(jsonb_build_object('model_id',model_id,'job_id',job_id,'net',net,'date','2026-10-30'),'<html>forged</html>',encode(convert_to('%PDF-1.4 forged test','UTF8'),'base64')) from receipt_test; raise exception 'Other model can generate'; exception when insufficient_privilege then null; end;
end$$;
select set_config('request.jwt.claims',jsonb_build_object('sub',admin,'role','authenticated')::text,true) from receipt_test;
do $$declare r jsonb; begin
 for r in select body from receipt_result loop
 if not exists(select 1 from public.receipt_archive where id=(r->>'id')::uuid) then raise exception 'Admin index missing'; end if;
 if public.get_receipt((r->>'id')::uuid) is distinct from r then raise exception 'Admin PDF mismatch'; end if;
 end loop;
end$$;
reset role;
set local role anon;
select set_config('request.jwt.claims','{}',true);
do $$begin
 begin perform * from public.receipt_archive; raise exception 'Anonymous index exposed'; exception when insufficient_privilege then null; end;
 begin perform public.get_receipt(gen_random_uuid()); raise exception 'Anonymous PDF exposed'; exception when insufficient_privilege then null; end;
 begin perform public.save_receipt('{}','x','x'); raise exception 'Anonymous save allowed'; exception when insufficient_privilege then null; end;
end$$;
reset role;
select 'PASS: atomic save, exact bytes, retry dedup, edited version, own/admin access, cross-user/anon denial, immutable archive' as result;
