# Nina private workspace schema

Applied to the existing Supabase project on 26 October 2026. This additive migration creates only private workspace tables and a bounded authenticated-by-secret RPC; it does not change agency records or the public model UI.

The server implementation and 98-test suite live in `gaegiordano78-cpu/nina-peacock-agent` (PR #27). It derives a separate-purpose credential from the existing private connector key. The database stores only its hash, configured through a trusted administrative process. No production hash or secret belongs in this migration.

RLS is enabled and direct table/sequence access is revoked for public, anon and authenticated roles. The exposed RPC requires the derived secret and only accesses memories, projects, tasks and their change history. Its intentional SECURITY DEFINER status is limited to this boundary; it does not accept arbitrary SQL or touch agency/account records.

Transactionally verified: invalid credential denied, memory update and archive, project/task creation, scope inheritance, task completion, change history, and denied direct table access. Test records were rolled back. No old chats or personal facts are imported automatically.

Task deadlines are stored timestamps, not scheduled notifications. Existing ChatGPT Google/automation connections remain separate. Refresh the installed Nina connector after backend deployment to discover the nine new tools.
