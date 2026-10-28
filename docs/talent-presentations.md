# Talent Presentations — preview review

The existing PR #22 and branch `talent-presentations-2026` are extended, not replaced. No production release or database migration is required for this preview.

## Module

- `/talent-presentations`: public-roster selector, initially populated with Yile; single and multiple talent emails, ordering/removal, desktop/mobile preview and HTML download. It performs no sends, mailing-list writes, social actions or database writes.
- `/api/talent-presentations?roster=1`: paginates the official published WordPress model roster (111 profiles at review).
- `/api/talent-presentations?slug=yile`: retrieves the official model and its featured-media record; returns one original cover URL and its dimensions. It never guesses from gallery images or rewrites image filenames.
- `/api/talent-presentations?slug=yile&format=html`: standalone live preview, also failing closed when the official image is unavailable.

The logo is the existing official PNG at `https://peacockmodels.com/wp-content/uploads/2025/04/logo-peacock-.png`, visually checked against the supplied Peacock mark. Its transparent background renders on white. No generated/type-reconstructed logo, image substitution, photo generation or media upload is used. All exported image URLs point directly to the official public Peacock website, not the temporary or protected preview deployment.

## Image and URL checks

Server requests use fixed WordPress endpoints, bounded pagination/timeouts, no redirects and strict HTTPS Peacock profile/upload URLs. The featured image is fetched with GET; unsuccessful responses, incorrect MIME types, empty/invalid image signatures and oversized files fail with an error. Only JPEG/PNG are accepted for email compatibility. The UI additionally decodes the actual photo and logo before displaying a selection and rechecks decoding before export. A missing photo cannot create an incomplete exported layout.

A filename alone is not a reliable test of image provenance. The old filter excluded the actual published Yile cover because its filename contains `chatgpt-image`. This increment uses the website's authoritative featured-media assignment, without creating or substituting an image. It does not independently certify the production history of photographs already published on the website.

## Email construction

White backgrounds, one cover per talent, table-based layout, inline styles, system fonts, absolute public image URLs, explicit image dimensions and Outlook conditional fixed-width wrapper. Photos retain original proportions; no email `object-fit`, SVG, JavaScript, external stylesheets, grid or flexbox. The multi-talent layout uses table cells and stacks them on small viewports, with an odd-count empty cell hidden on mobile. Footer email and website are separate clickable lines.

## Verification on 26 October 2026

- Local optimized Next build: passed, including type checking.
- `node --test tests/talent-presentations.test.mjs tests/annual-income.test.mjs tests/contracts.test.mjs tests/admin-functions.test.cjs`: 34 passed; existing backend tests use mocks, no live email sends.
- Live source: 111 roster entries; Yile featured-media cover retrieved from WordPress, 1122×1402 JPEG.
- Browser: both logo and cover loaded and decoded inside the real email iframe; standalone desktop and 375px mobile newsletter visually inspected, mobile scroll width equals viewport width.
- Real UI HTML download: tested and saved for review, all images use public official URLs.
- Multi-select: Yile + Luigi P.; all three images (logo + two covers) decoded. At 375px, talent cells share x=16 and occupy separate rows, each 343px wide.
- Profile/photo/button links and clickable footer destinations inspected.
- Screenshots and downloaded HTML saved outside the source checkout in `Talent Presentations/` in the Peacock workspace.
- Vercel preview result is recorded in PR #22 after the feature-branch push; do not merge or promote without Gae's review.

Compatibility is designed for Gmail, Apple Mail and Outlook through conservative email markup. Browser previews and markup checks are not a certification of rendering in every actual mail-client version. No live Gmail/Apple Mail/Outlook send or paid inbox-render service was used. Remote-image blocking and client-controlled dark mode remain mail-client settings.
