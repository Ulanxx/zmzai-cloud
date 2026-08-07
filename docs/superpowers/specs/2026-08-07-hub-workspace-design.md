# zmzai.cloud Hub Workspace Design

## Context

`zmzai.cloud` currently presents an editorial product index. The product
direction has shifted toward a usable AI product system: visitors should
understand the product matrix, then sign in once and choose a product from a
shared workspace. The hub must remain the brand and navigation layer; product
business data stays in each child application.

## Goals

- Make the public home page explain both the `z·m·z·a·i` product matrix and the
  immediate next action.
- Send every sign-in action to the shared authentication flow, with UI copy
  that only says `登录`.
- Return a successful sign-in to `https://zmzai.cloud/workspace`.
- Give authenticated users one workspace showing recently clicked hub products,
  currently available products, and products under construction.
- Keep the workspace extensible for a later unified usage-event feed without
  pretending that child-product usage is already available.
- Preserve the locked warm paper, warm ink, seal red, serif + mono brand system.

## Non-goals

- Do not move relay, muzhi, sandbox, agent, or workos business data into the
  hub.
- Do not merge real usage records before child products emit a shared event.
- Do not add a payment flow, product-specific account controls, or a second
  authentication system to the hub.
- Do not present the hub as a generic SaaS dashboard or a card grid.

## User Flows

### Visitor

1. Visitor lands on `/` and sees a left-aligned editorial introduction,
   available products, and the `开始使用` action.
2. `开始使用` and all public `登录` links redirect to the canonical auth URL
   `https://auth.zmzai.cloud/login?next=<encoded https://zmzai.cloud/workspace>`.
3. Copy never tells the visitor to log in at `muzhi.zmzai.cloud`; the visible
   label is always `登录`.

### Authenticated user

1. `/workspace` validates the shared parent-domain session.
2. The page shows the user's name and a `退出登录` action.
3. `最近使用` initially means products clicked from the hub for the current
   user. This is a lightweight navigation signal, not a claim about API or
   product usage.
4. `当前可用` lists live products. Each entry links to the product's existing
   domain using the catalog's explicit URL and return-URL capability.
5. `正在建设` lists planned products as non-actionable status entries.
6. The full `z·m·z·a·i` matrix remains available below the operational section.

## Architecture

### Shared authentication

The hub adds the same shared database dependency and session validation contract
used by relay: `SESSION_COOKIE_NAME`, `SESSION_COOKIE_DOMAIN`, `AUTH_SECRET`,
and `MONGODB_URI`. Normal hub routes only read the session and user identity;
the intentional write exception is `POST /api/logout`, which invalidates the
shared session. The hub does not create a second session or duplicate user
records.

The hub exposes a local `POST /api/logout` endpoint that deletes the shared
session record and clears the parent-domain Cookie, matching the relay logout
contract. Unauthenticated access to `/workspace` redirects to the auth center.
A child product remains responsible for its own route-level authorization.

### Product catalog

The existing `lib/projects.ts` remains the single source for product metadata:
an immutable unique `id`, letter, Chinese seal character, name, tagline,
description, status, URL, and return-URL capability. The duplicate `z` letters
are intentional brand marks, so `letter` is never used as a data key or React
key. The `m` / 中转驿 entry is updated to `live` because it is deployed.
The workspace derives three views from this catalog:

- `recent`: client-side hub click history, limited to 5 items per user;
- `available`: products with `status=live`;
- `building`: products with `status=building|planned`.

No usage-event collection is added in this phase. A future event adapter can
replace the `recent` source without changing the workspace presentation model.

### Navigation event storage

The first version records hub clicks in browser storage only. The storage key is
scoped to the authenticated user's immutable user ID, so a shared browser cannot
leak one user's history to another. Each record contains the stable product ID
and an ISO timestamp. The list is capped at 5 records, newest first; malformed
records are discarded during read and logout clears the active user's key. This
data is not used for billing, authorization, or analytics claims. When child
products later emit a shared event, the workspace can merge server events with
this local signal behind one repository interface.

The catalog's return-URL capability is explicit: products that support a
post-login or back-navigation target declare `supportsReturnUrl=true`, and the
hub appends the encoded absolute target as `?next=<url>`. Products without that
capability receive a direct URL without query parameters.

## Page Structure

### Public home `/`

- Header: wordmark, `项目`, `GitHub`, `登录`.
- Hero: editorial statement of the AI product system, with `开始使用` and
  `查看产品矩阵` actions.
- Available products: direct entries for live products, led by relay and muzhi.
- Matrix index: the complete `z·m·z·a·i` list with statuses.
- Footer: seal signature and product matrix link.

### Authenticated workspace `/workspace`

- Header: wordmark, user name, `退出登录`.
- Intro: short statement that this is the user's entry point to the matrix.
- Recent clicks: only shown when local history exists; otherwise show a quiet
  empty state rather than fake activity.
- Available now: live products with direct entry links.
- In progress: planned/building products with clear non-clickable status.
- Full matrix: editorial list for orientation and discovery.

## Copy Rules

- Use `登录`, never `去 muzhi.zmzai.cloud 登录` or a child product name as the
  destination instruction.
- Use short, factual first-person brand voice: `牧之正在搭建...` where an
  author voice is useful.
- Do not promise unified usage history until the event contract exists.
- Keep status labels explicit: `可用`, `建设中`, `计划中`.

## Error and Empty States

- Missing/expired session on `/workspace`: redirect to
  `https://auth.zmzai.cloud/login?next=<encoded absolute workspace URL>`.
- Missing Mongo configuration: fail the server build/runtime through the
  existing env validation, not with a fake logged-out workspace.
- Empty recent clicks: explain that recently opened products will appear here;
  do not fabricate timestamps.
- Unavailable product: show its status and keep the entry non-actionable.
- Invalid local history: clear only the malformed records and continue rendering.

## Verification

- Typecheck and production build for `zmzai-cloud`.
- Logged-out `/workspace` redirects to the canonical auth URL with an encoded
  absolute `next=https://zmzai.cloud/workspace` callback.
- Logged-in workspace renders user identity and live/building sections.
- Public pages expose only the `登录` label for sign-in.
- Clicking a product records bounded local history and navigates to its URL.
- Logout calls the hub endpoint and clears the active user's local-storage key
  before navigating to the public home.
- Refresh preserves recent hub clicks; malformed local data does not break the
  page.
- Mobile and desktop layouts keep the editorial left alignment and avoid card
  grids, overflow, and overlapping text.
