# Nina: security consolidation, 26 October 2026

## Runtime and source of truth

- Public conversations and the private email MCP connector: `gaegiordano78-cpu/nina-peacock-agent`, hosted on Vercel.
- Peacock app and Supabase administrative functions: `gaegiordano78-cpu/Peacock-Mgmt`.
- The desktop `nina-telegram-agent` directory contains older casting/WordPress modules that are not deployed by the current Nina repository. Do not deploy that directory over production.
- Gae chose the existing pinned Nina ChatGPT chat as his primary personal-assistant entry point.

## Changes deployed

The `invite-user` and `notify-casting` functions validate the bearer token against Supabase Auth and require the caller's server-owned profile role to be `admin`. Public CORS does not grant access. Gateway JWT checking stays disabled because authentication is performed explicitly in the shared handler; never remove the internal checks.

Invitations use an individual Supabase Auth invitation link. Existing accounts receive an owner-controlled recovery link; their passwords and email confirmation status are not changed administratively. No shared password is generated, stored in source or returned by the service. Ambiguous, missing or conflicting model/account links are refused. Admin accounts cannot be reassigned or downgraded by the invitation endpoint.

Candidature access is limited to the model's own records and administrators by removing the legacy broad SELECT policy. Existing ownership INSERT/DELETE and admin policies remain in place.

## Verification

- 16 isolated security and behavior tests, with mocked Auth and email delivery.
- Both deployed endpoints return 401 for anonymous requests and invalid sessions, without sending messages or changing accounts.
- A model with a candidature sees its own row and no other models' rows; the admin retains access to all 40 rows present at verification.
- Nina backend's existing 91 tests remain green.

Run the function tests from the application repository with `node --test tests/admin-functions.test.cjs` after installing the repository's existing TypeScript dev dependency. Deploy each function with its entrypoint and the shared `_shared/admin.ts` dependency. Supabase functions use Deno and are excluded from the Next.js application's TypeScript compilation.

## Remaining work and boundaries

- Previously assigned passwords are NOT invalidated by these code fixes. Account recovery, session revocation and communication to affected users require a separate controlled remediation; do not reset or notify everyone automatically.
- No invitation or casting email was sent as a deployment test. Successful authenticated email delivery is covered by mocks, not a live outbound test.
- Vercel connector team access still returns 403. Do not rotate credentials or repeatedly reconnect unrelated Google/mail services to work around it.
- Public Nina must not gain access to Gae's personal memory, email or calendar through public conversation text.
- Telegram's existing webhook does not yet persist model-to-chat identity or provide scheduled model reminders. A verified registration and controlled outbound workflow remain to be implemented.
- Existing Google tools in ChatGPT do not automatically become tools of the public Nina backend.

Never roll back to an unauthenticated invitation or notification implementation. Keep secrets out of documentation, logs and source.
