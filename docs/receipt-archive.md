# Archivio ritenute

Both model and admin PDF export save the exact PDF before downloading it. Admins open **⋯ → Archivio ritenute**; models have an archive button on their home screen. Search by model/brand, inclusive receipt-date filters, paginated results and individual original-PDF downloads are available.

Small generated PDFs (limit 512 KiB, normally a few KiB) are stored as bytea in `private.receipt_files`, in the same transaction as `public.receipt_archive`. This deliberately avoids a distributed Storage upload/index operation and orphaned or missing files. The listing never loads PDF bytes. File bytes are returned as base64 only through an authorized RPC. There are no public file URLs or service credentials in the client.

Authenticated admin status is read from the existing profiles table. Models can access only archive entries whose model_id is linked to their current auth.uid(). Save also verifies the job/model relationship and current net amount. Private functions have an empty search_path and explicit authorization; public wrappers are SECURITY INVOKER. Anonymous execution and direct file access are revoked. Index access uses RLS; no client update/delete grants. No cascading foreign keys to models/jobs: historical files survive later job/profile deletion and remain available to admins.

Identical HTML for the same job/model returns the first saved PDF, avoiding duplicate retries and preserving its original bytes. A changed receipt creates another immutable version. The filename remains `Nome Cognome per Brand.pdf` and the existing renderer/layout is preserved. Browser download uses a blob anchor, never a popup/print dialog. Save errors stay visible and do not trigger an unsaved download; the user can retry. Preview and Copy text do not constitute a PDF export.

The archive starts at deployment. Earlier locally downloaded PDFs cannot be recovered automatically and are not fabricated or regenerated as historical records. No automatic import is performed.

## Validation (2026-10-30)

- Production build passed.
- Existing 28 unit/security tests passed.
- Pixel 7 browser regression: Android back/forward and blob PDF download passed.
- Browser integration for model and admin: failed save prevents download, retry succeeds, original-byte archive download, model/brand and date filters, reload persistence, no popup or page errors. These browser tests mock Supabase.
- SQL integration on the Peacock project within rollback: atomic save/get byte equality, duplicate retry returns original, edited version preserved, model/admin allowed, other users/anon denied, direct file/update/delete denied. No test receipts remain.
- Migration applied once: `20261030160526_receipt_archive`.
- Security advisor: no new warning for archive. Private file table intentionally has RLS and no policies, with no direct role grants; access is exclusively through the checked functions.

Run browser tests against a running build with `TEST_APP_URL=http://localhost:3097 node tests/receipt-archive.cjs` and `TEST_APP_URL=http://localhost:3097 CHROME_PATH='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' node tests/receipt-download.cjs`. SQL test file must be wrapped in BEGIN/ROLLBACK.
