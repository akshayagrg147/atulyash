# Atulyash Launch Experience implementation prompt

Implement the complete client requirement in `Atulyash Complimentary Packs.docx`: a complimentary one-time 1 kg Launch Experience for the first 2,000 eligible households in selected South Delhi and North Delhi areas, with website and mobile booking, campaign administration, availability counts, and delivery operations. Keep paid Weekly Subscription and Order Once working independently.

The source document is `/Users/akshay/Downloads/Atulyash Complimentary Packs.docx`. Read its final clarification as well as the main requirements. The source requirements below are mandatory. Model names, endpoint paths, status enums, and technical mechanisms described as proposed are implementation recommendations, not APIs that already exist or extra business rules approved by the client.

## Project context and implementation scope

- Customer website: `/Users/akshay/Downloads/atulyash/cloned-site`.
- Next.js admin project: `/Users/akshay/Downloads/atulyash/atulyash-web`.
- Deployed Django backend: `/home/ubuntu/server` on the existing AWS server.
- Existing API base URL: `https://api.atulyash.com`.
- Mobile application: obtain the correct repository before implementing its screens. Responsive website changes alone do not complete the app requirement.
- Inspect the current source and repository instructions before editing. Preserve unrelated work and identify the actual deployed changes; the last backend audit found modifications outside the recorded Git commit.
- Reuse existing customer identity, OTP, addresses, PIN/area/hub records, staff capabilities, audit logging, and appropriate delivery infrastructure. Add a focused campaign module; avoid unrelated subscription, wallet, or scheduling refactors.
- Implement migrations, backend APIs, customer website, admin screens, mobile integration, documentation, and tests. Report the implementation and deployment status of each separately.

## Client requirements and scope boundaries

1. Offer exactly one complimentary 1 kg ATULYASH Atta pack per eligible household, for the first 2,000 valid reservations across the selected South and North Delhi campaign areas combined.
2. Open reservations before deliveries begin. Complimentary milling and deliveries commence from 12 October. Do not promise every household delivery on 12 October.
3. Charge ₹0 for the reservation and complimentary delivery. Do not require a payment method, wallet balance, recharge, subscription purchase, or paid order.
4. Remove the current ₹100 first-order discount. Subsequent paid purchases retain the normal ₹120/kg base price.
5. Display the premium launch banner, availability counter, reservation form, and confirmation on both website and mobile app.
6. Provide campaign controls, reservation management, CSV/Excel export, and counts by South/North Delhi hub, PIN, and area.
7. Normal subscriptions remain continuous, with a fixed quantity from 2 to 10 kg per week, ₹120/kg, existing four-delivery funding policy, and existing modification, pause, cancellation, skip, vacation, and delivery rules.
8. Campaign reservations must not change paid-order delivery availability, delivery charges, cutoffs, blocked weekdays, wallet accounting, or payment behavior.
9. A customer who reserves the complimentary pack can immediately buy a paid subscription or Order Once for any normally available delivery date, including before 12 October. That purchase must not cancel or invalidate the already-reserved complimentary pack.
10. Restrict the October start date to the campaign. Do not change global `SubscriptionSettings`, set a global launch date, or block normal orders until October.

## Decisions to resolve without inventing client policy

Continue independent implementation while identifying these configuration or policy gaps:

- **Campaign year:** the document states 12 October without a year. The surrounding project context suggests 2026, but this is an assumption. Use a configurable business date, provisionally `2026-10-12` in tests/examples, and establish the year before activation. “Second Navratra” is supplied client copy, not a separately verified calendar claim.
- **Eligible geography:** the document does not enumerate the selected PIN/area IDs or actual South/North Delhi hub IDs. Provide configuration and require an explicit campaign allowlist. Do not include all globally serviceable locations or create guessed master data.
- **₹100 discount versus cashback:** inspected code treats `ATULYASH100` as subscription cashback in `subscription/utility/recharge_service.py` and `orders/utility/order_placement.py`; the website also recognizes it as cashback. The document explicitly removes a first-order discount. Identify whether the client intends to retire this same ₹100 welcome benefit in its cashback form. Prepare a targeted, configurable retirement of that benefit; do not infer removal of unrelated recharge bonuses or already-earned cashback. Resolve the policy before enabling changed financial behavior.
- **Operational policies:** the document does not specify a delivery end date, daily campaign quotas, campaign-specific excluded days, customer self-cancellation, retry limits, or whether capacity released after a sellout should reopen bookings automatically. Use the proposed conservative defaults below and document them for review. Do not silently alter normal hub or subscription policies.

## Campaign and reservation storage

Use dedicated campaign records rather than creating a ₹0 normal cart order, subscription, payment order, or wallet transaction. The existing normal order flow has payment and positive-amount assumptions.

Suggested entities, adapted to existing conventions:

**LaunchCampaign**

- Stable ID and slug, name, configured quantity `1.00 kg`, customer payable `0.00 INR`.
- Global quota `2000`, delivery start business date, timezone `Asia/Kolkata`.
- Lifecycle status, booking timestamps if needed, banner/confirmation text.
- Explicit allowed PIN/area/hub relationships.
- Configuration version and timestamps for safe concurrent updates.

**LaunchReservation**

- UUID or non-guessable reference, campaign, authenticated customer, normalized verified mobile.
- Full name; complete structured delivery address and immutable booking address snapshot.
- PIN, area, and resolved hub; store stable IDs and useful display snapshots for route exports.
- Monthly consumption band, household confirmation text/version and accepted timestamp.
- Reservation status and separate delivery status.
- Reserved timestamp, optional assigned delivery date, fulfillment reference, delivered timestamp.
- Source such as website, app, or recorded offline allocation; staff attribution when applicable.
- Idempotency key and normalized household matching key.

**Campaign adjustment and status history**

- Reuse the existing admin audit system where possible. Store any quota allocation/correction as an auditable event with reason, signed quantity if applicable, actor, timestamps, and before/after counts.
- Preserve reservation and delivery status transitions with actor, old/new values, and comment.
- Do not physically delete confirmed or delivered reservation history to correct the counter. Mark duplicates/cancellations explicitly.

The campaign quantity is not a new 1 kg weekly pack. The consumption question is a survey field, not a subscription selection or billing input.

## Customer reservation journey

1. Customer sees the banner and selects **RESERVE MY LAUNCH EXPERIENCE**.
2. Reuse `POST /users/otp/request/` and `POST /users/otp/verify/`. Existing authenticated customers should not need to register a second account. Resolve customer identity on the server from authentication; never trust a supplied customer ID or `otp_verified=true` flag.
3. Collect full name, PIN, area, complete delivery address, consumption band, and household confirmation.
4. Check global serviceability and campaign eligibility for the PIN. Populate only active, serviceable areas included in the campaign. Changing PIN clears a previously selected area and reruns validation.
5. Validate that the selected area belongs to the PIN, the mapping is active, and the resolved hub is eligible. Recheck at submission even if the browser previously checked serviceability.
6. Accept an existing address only if it belongs to this customer and is valid for the campaign. Do not modify the customer's other active-order or subscription address when taking a reservation snapshot.
7. On submission, perform duplicate, campaign-state, geography, and capacity checks in one database transaction. Confirm a slot only when those checks succeed.
8. Return a stable reservation reference and authoritative count/status. Show the success message only after the backend confirms the reservation.
9. Allow the customer to retrieve their reservation after login, refresh, or app restart. Keep normal paid shopping immediately accessible.

Use these five consumption options exactly in meaning, with stable API values:

| API value | Display label |
|---|---|
| `UP_TO_5_KG` | Up to 5 kg |
| `KG_6_TO_10` | 6–10 kg |
| `KG_11_TO_15` | 11–15 kg |
| `KG_16_TO_20` | 16–20 kg |
| `OVER_20_KG` | More than 20 kg |

Require this checkbox, unchecked by default:

> I confirm that this complimentary launch experience is being reserved for my household and that the above delivery details are correct.

Use this client confirmation copy, with the configured date:

> Your Atulyash Launch Experience is reserved. Deliveries commence from 12th October (second Navratra).

Return `scheduled_delivery_date: null` until operations assigns a date. Clearly distinguish the campaign start date from the customer's actual appointment.

## Household duplicate controls

- Normalize verified mobile numbers and match them within this campaign.
- Normalize address whitespace, case, punctuation, and standard abbreviations. Include flat/house number, tower/building, locality, and PIN in an exact household match. Different flats in one building are distinct households.
- Detect the same household trying to reserve with different mobile numbers. Do not use just PIN, locality, surname, or building name as a household key.
- Combine server-side checks with database constraints and transaction locks; two simultaneous requests must not bypass the checks.
- Enforce idempotency scoped to authenticated customer and campaign. The same key and payload returns the same reservation; reusing a key with changed payload returns a structured conflict.
- Existing confirmed or delivered reservations prevent another complimentary entitlement for that household. Cancellation must not erase the identity history; any authorized reinstatement must recheck quota and reuse the entitlement safely.
- Fuzzy address matches may enter an explicit review state rather than silently confirming a second pack or rejecting a different household. A review state must not display the reservation success message. Under the proposed default it consumes no confirmed slot until approved, and approval rechecks capacity.
- Rate-limit abusive OTP/reservation attempts. IP/device signals may support review but must not be the sole household identifier.
- Duplicate responses must not expose another household's identity or address. Reveal an existing reservation reference only to its owner or authorized staff.

## Quota and availability counter

Implement server-authoritative counts shared by website, app, and admin. Never hardcode displayed reservation counts.

Proposed accounting:

```text
used_slots = valid allocated reservations (including delivered)
           + offline allocations not yet represented by reservation rows
           + approved operational adjustments not already reflected in those records

remaining_slots = quota - used_slots
```

Enforce `0 <= used_slots <= quota` on each relevant transaction. A normal cancellation or duplicate invalidation releases a slot once; delivery completion continues consuming that household's slot. A failed delivery awaiting retry must not automatically free capacity for another household.

Provide admin views of each count component. A manually edited displayed total must be translated into a reasoned adjustment or a record correction. Reject corrections that conceal confirmed/delivered allocations, double-count cancellations, create negative totals, or exceed the quota. Do not fabricate customer reservation rows to make a displayed number look larger.

Prefer named offline reservations where details are available. For temporary bulk offline allocations, persist quantity and operational reference; converting them into individual reservations transfers allocation without increasing total used slots.

Lock the campaign row or use equivalent atomic capacity allocation. If 1 slot remains and 2 valid households submit concurrently, exactly 1 succeeds; the other receives `CAMPAIGN_FULL`. Redis/browser counters alone are insufficient. Coordinate allocation, duplicate checks, and idempotency in the same transaction.

Invalidate cached availability after commit. A stale banner cannot authorize a booking. Under the proposed lifecycle, an automatic sellout may return to open when a valid cancellation frees a slot; a manual pause, close, or completion remains in effect until an authorized admin changes it. Keep the exhaustion reason separate from the manually selected state.

## Campaign status and banner behavior

Provide admin actions to start, pause, close, and mark reservations complete. Suggested states are `DRAFT`, `OPEN`, `PAUSED`, `CLOSED`, and `COMPLETED`, plus a recorded reason for automatic quota exhaustion.

- Only open campaigns with capacity accept a new confirmed reservation.
- Pause/close/completion stops new bookings but preserves existing reservations and fulfillment.
- A retry for a reservation already confirmed returns that reservation even if the campaign has since closed; it allocates no additional slot.
- The backend returns status, `can_reserve`, count, start date, and banner message. UI action state follows those values.
- Manual completion before quota exhaustion is possible, but must not fabricate a claim that 2,000 actual households have booked. Show accurate counts with the generic completion text.
- During loading or an API failure, show a neutral/loading state rather than an invented remaining count.

Use the source's premium banner content:

> ATULYASH LAUNCH EXPERIENCE  
> For Our First 2,000 Families  
> Experience 1 kg of ATULYASH Atta with our compliments.  
> Single-Origin MP Sharbati | Natural Stone Slow Milling | Chokar Intact | Freshly Milled  
> Reservations Now Open  
> Deliveries commence from 12 October (second Navratra)  
> Available only in select South & North Delhi areas.  
> RESERVE MY LAUNCH EXPERIENCE

At completion show:

> Launch Experience Reservations Are Now Complete  
> You can still experience ATULYASH through our regular ordering/subscription options.

Show a live count such as `1,426 Launch Experiences Reserved — 574 Remaining`. Those numbers are examples only. Paused/draft states must not display “Reservations Now Open.” Retain visible access to normal paid shopping in all campaign states.

## Remove the retired welcome discount safely

- Identify the specific ₹100 first-order promotion and remove its availability, automatic application, and advertising across backend, website, and mobile.
- Revalidate stored cart coupons and pending preview responses so an old cached client cannot apply the retired discount. Preserve API compatibility for old clients: return ineligible/retired status and a clear error for direct attempts instead of deleting commonly used routes.
- Inspect legacy kit compatibility flags and `apply-kit`/`remove-kit`, coupon visibility/validation, cart serializers, recharge preview/initiate/verify, and order placement. The current code maps legacy kit behavior to `ATULYASH100` in several paths.
- Resolve the cashback distinction described above before changing issuance of that same benefit. Preserve existing earned wallet credits, successful payments, and valid ledger history. Decide how already-initiated promotional payments are honored at the transition; do not silently remove a benefit already promised in a successful transaction.
- Reserving or receiving the complimentary pack itself creates no wallet bonus, cashback, debit, hold, payment, or refund. Keep unrelated existing wallet operations unchanged.
- Do not delete historical coupon usage, balances, orders, or customer data as part of this feature.

## Admin dashboard and operations

Add a dedicated **Launch Experience** section to the existing admin navigation using backend-enforced permissions.

Reservation table and export must contain at least:

- Reservation reference, customer name, mobile number.
- PIN, area, full address, South Delhi/North Delhi hub.
- Reservation date/time, reservation status, delivery status.
- Include collected consumption band, assigned delivery date, and source as useful additional fields.

Provide search, pagination, and filters by hub, PIN, area, reservation date, reservation status, and delivery status. Support viewing a reservation, recording cancellation, invalidating a duplicate, resolving a duplicate review if implemented, and audited correction of operational data. Recheck eligibility and household uniqueness after address corrections.

Provide:

- Total valid reservations and remaining capacity.
- Total South Delhi and North Delhi reservations.
- PIN-wise and area-wise counts.
- Separate cancelled, duplicate, review, and offline-allocation counts so totals reconcile.
- Campaign start/pause/close/complete controls.
- Manual count/allocation corrections with mandatory reason and history.
- Authorized campaign area/hub configuration.
- Delivery assignment/status management suitable for the one-time October exercise.

Provide Excel-compatible CSV export at minimum; XLSX is an optional additional format because the document permits Excel/CSV. Export all matching records, not only the current table page. Keep mobile numbers and PINs as text, quote addresses correctly, preserve Unicode, and neutralize spreadsheet formula injection. Require export permission and audit access to these customer details.

Use separate capabilities for viewing, managing reservations, managing campaigns/counters, exporting, and confirming delivery. Reuse existing staff-role infrastructure; do not grant all staff every action. Customers may only access their own reservations.

## Complimentary delivery operations

- Keep reservation status separate from delivery status. Suggested reservation states: `CONFIRMED`, `PENDING_REVIEW`, `CANCELLED`, `INVALID_DUPLICATE`. Suggested delivery states: `UNSCHEDULED`, `SCHEDULED`, `ASSIGNED`, `OUT_FOR_DELIVERY`, `DELIVERED`, `FAILED`, `CANCELLED`.
- Allow operations to assign a specific campaign delivery date and record status/history, with hub/area exports for route planning.
- Enforce the configured campaign delivery start on assignment, dispatch, and completion. Customers may reserve earlier; complimentary milling/fulfillment must not commence earlier. Do not claim a precise customer delivery date before assignment.
- The document does not authorize changing paid delivery calendars or overriding global no-delivery days. Make any approved special campaign operational calendar local to this module.
- Do not create recurring weeks, subscription skip counters, or vacation postponements for the campaign pack.
- If existing rider/beat tooling is reused, identify campaign fulfillment explicitly and bypass all paid wallet capture, recharge, commission assumptions, and payment hooks for this source. Repeated campaign confirmation must never produce a debit or another delivery.
- Current paid delivery confirmation has wallet-related hooks. Do not route a promotional delivery through those hooks without an explicit source guard and regression tests. A dedicated campaign fulfillment record is the preferred starting point.
- A failure records a delivery attempt and retains the same household entitlement for a retry; an explicit cancellation/invalidation handles any capacity release.
- Keep promotional records distinguishable from paid customer order history and revenue/finance exports. Do not create a misleading paid invoice or a ₹0 normal one-time order just to store the reservation. Use a reservation confirmation or operational delivery note where needed.
- Combined physical routes, if operations uses them, must retain separate campaign and paid records, prices, and status events. Paid purchases never automatically consume the complimentary entitlement.
- Advanced route optimization, new SMS/WhatsApp campaigns, and an automated retry program are not stated requirements; do not expand the project into those systems without a separate request.

## API contract to implement and document

The following routes are **proposed additions**. Follow established project conventions if a suitable existing campaign API is found. Do not claim these routes are deployed until tested.

| Method and proposed path | Access and purpose |
|---|---|
| `GET /launch-experience/campaigns/current/` | Public campaign status, date, banner, quota and counts; no personal data |
| `GET /launch-experience/campaigns/{id}/serviceability/?pincode=...&area_id=...` | Public active campaign PIN/area validation and available areas |
| `POST /launch-experience/reservations/` | Authenticated booking with an idempotency key |
| `GET /launch-experience/reservations/` | Authenticated customer's own reservations |
| `GET /launch-experience/reservations/{id}/` | Owner's reservation, current delivery status and assigned date |
| `GET /launch-experience/admin/reservations/` | Permission-scoped search and filterable staff list |
| `GET/PATCH /launch-experience/admin/reservations/{id}/` | Staff detail and audited operational corrections |
| `POST /launch-experience/admin/reservations/{id}/cancel/` | Authorized cancellation with reason and single capacity release |
| `POST /launch-experience/admin/reservations/{id}/mark-duplicate/` | Authorized duplicate invalidation with audit trail |
| `POST /launch-experience/admin/reservations/{id}/schedule/` | Assign campaign delivery date and operational details |
| `POST /launch-experience/admin/reservations/{id}/delivery-status/` | Authorized, idempotent delivery update with zero wallet impact |
| `GET /launch-experience/admin/reservations/export/?format=csv` | Permission-protected export using the same filters as the list |
| `GET /launch-experience/admin/campaigns/{id}/stats/` | Totals grouped by hub, PIN, area and status |
| `PATCH /launch-experience/admin/campaigns/{id}/` | Controlled configuration including eligible geography |
| `POST /launch-experience/admin/campaigns/{id}/transition/` | Start, pause, close, complete or explicit reopen with a reason |
| `POST /launch-experience/admin/campaigns/{id}/adjustments/` | Audited operational count/offline-allocation correction |
| `GET /launch-experience/admin/campaigns/{id}/history/` | Campaign and adjustment history, or reuse existing audit API |

If `PENDING_REVIEW` is implemented, also supply an authorized approval/rejection action that rechecks capacity and uniqueness. Record the definitive role/capability matrix and documented state transitions.

Example reservation request, using synthetic identifiers:

```http
POST /launch-experience/reservations/
Content-Type: application/json
Idempotency-Key: <new UUID for this booking attempt>
```

```json
{
  "campaign_id": 1,
  "full_name": "Test Customer",
  "delivery_address": {
    "house_number": "A-12",
    "building": "Example Apartments",
    "address_line": "Example street",
    "landmark": "",
    "pincode": "110017",
    "area_id": 42
  },
  "monthly_consumption_band": "KG_6_TO_10",
  "household_confirmed": true
}
```

Resolve mobile, customer, hub, city/state, quantity, and price from verified identity and server-side master data. The illustrative area ID must be replaced with an actual eligible master record. Form fields can follow existing address naming, but document the final names consistently across clients.

Example successful response, **illustrative and not a live API result**:

```json
{
  "success": true,
  "reservation_id": "sample-uuid",
  "reservation_reference": "LX-000001",
  "reservation_status": "CONFIRMED",
  "delivery_status": "UNSCHEDULED",
  "quantity_kg": "1.00",
  "amount_payable": "0.00",
  "currency": "INR",
  "delivery_start_date": "2026-10-12",
  "scheduled_delivery_date": null,
  "message": "Your Atulyash Launch Experience is reserved. Deliveries commence from 12th October (second Navratra).",
  "campaign": {
    "status": "OPEN",
    "quota": 2000,
    "reserved_count": 1426,
    "remaining_count": 574,
    "can_reserve": true
  },
  "idempotent_replay": false
}
```

Return HTTP 201 for a new confirmation, HTTP 200 for a documented identical replay, HTTP 400 for validation errors, HTTP 401/403 for authentication/permission failures, HTTP 404 for unavailable resources, HTTP 409 for duplicate/state/quota conflicts, and HTTP 429 for throttling. Unexpected failures must return sanitized JSON with a request reference, not stack traces.

Use stable errors including `PINCODE_NOT_ELIGIBLE`, `AREA_NOT_ELIGIBLE`, `NO_ACTIVE_HUB`, `HOUSEHOLD_CONFIRMATION_REQUIRED`, `INVALID_CONSUMPTION_BAND`, `HOUSEHOLD_ALREADY_RESERVED`, `CAMPAIGN_PAUSED`, `CAMPAIGN_CLOSED`, `CAMPAIGN_FULL`, `IDEMPOTENCY_CONFLICT`, and `DELIVERY_BEFORE_CAMPAIGN_START`.

Example:

```json
{
  "code": "AREA_NOT_ELIGIBLE",
  "message": "The selected area is not included in this Launch Experience.",
  "field_errors": {
    "area_id": ["Choose an eligible area for the selected PIN code."]
  }
}
```

## Website and mobile integration

- Add the banner, status-aware CTA, live counter, authenticated reservation form, validation, and confirmation/retrieval view in both clients.
- Match the existing premium visual style. Use accessible labels, keyboard/focus behavior, inline errors, and usable small-screen layouts.
- Reuse OTP/login and preserve existing access/refresh token handling. Keep submitted form details through an OTP refresh where practical.
- Retry an uncertain submission using the same idempotency key; do not generate a new attempt simply because the network timed out. Verify the existing reservation before telling the customer to reserve again.
- Fetch geography, availability, status, and dates from the backend. Handle capacity exhaustion between opening the form and submitting it.
- Remove advertising and selection of the retired first-order discount in coordination with the resolved promotion policy. Continue displaying legitimate historical wallet balances.
- Preserve the customer’s cart. The campaign must not add/remove paid items, change subscription packs, change a paid delivery date, or force a payment screen.
- A successful reservation may offer links to Weekly Subscription and Order Once, with no obligation to buy either.
- Keep normal navigation usable if the campaign API fails, pauses, closes, or sells out.
- If the mobile repository is unavailable, deliver the exact mobile request/response contract, navigation instructions, and integration tests, and report the app work as pending rather than complete.

## Regression and acceptance tests

Use real PostgreSQL transaction tests for capacity and uniqueness races, plus integration tests for the APIs and critical UI journeys. At minimum verify:

1. A new OTP-verified customer in an allowed PIN/area can reserve exactly 1 kg for ₹0; name, complete address, consumption, and confirmation persist.
2. An existing authenticated customer uses the same customer identity and can reserve if eligible. Do not invent a new-customer-only rule absent from the document.
3. Each consumption option is accepted; omitted/invalid bands and an unchecked checkbox return field errors.
4. Inactive PINs/areas, mismatched PIN/area pairs, missing/inactive hubs, and globally serviceable locations outside the campaign allowlist are rejected.
5. A tampered customer/mobile/price/quantity/hub cannot bypass server-side identity or policy checks.
6. Same verified mobile cannot obtain two entitlements; same exact household with a different mobile is also controlled.
7. Different flats in the same building are not blocked as the same household; fuzzy review does not claim an unconfirmed slot.
8. Double-clicks, app/web parallel requests, network retries, and concurrent duplicate requests produce one confirmed reservation and one slot allocation.
9. With 1,999 slots used, two concurrent eligible requests allocate the final slot once. The 2,001st valid attempt cannot overbook.
10. Reservation failure rolls back both record and allocation. Counts always reconcile and never become negative or exceed 2,000.
11. Cancellation/duplicate invalidation releases capacity once; repeat actions do not release twice; delivery completion never releases a slot.
12. Offline allocation conversion does not double-count capacity. Manual corrections require permission and reason, and produce correct history.
13. Public counts, admin statistics, and filtered exports agree, including South/North hub, PIN, and area breakdowns.
14. Start/pause/close/complete and automatic quota exhaustion update API and banner behavior. Manual closure remains closed after a cancellation.
15. An identical successful retry still resolves after the campaign closes without allocating another slot.
16. Customers cannot read others' reservations or exports. Unauthorized staff cannot adjust quota, modify campaign configuration, or confirm delivery.
17. Complimentary assignment/dispatch/delivery before the configured start is rejected; a valid date on or after start works. Reservation creation itself works before that date.
18. Repeated complimentary delivery confirmation produces one fulfillment event and no wallet debit, hold, credit, cashback, Razorpay order, paid-order record, or paid invoice.
19. Paid rider confirmation still captures exactly one applicable delivery debit; campaign changes do not alter its accounting.
20. A customer can reserve, then immediately place a paid weekly subscription with a valid selected date before 12 October. The subscription starts normally and the complimentary reservation remains valid.
21. Repeat the previous test for Order Once. The campaign start date does not appear as a global minimum paid delivery date.
22. Paid purchase, pause, skip, vacation, plan change, cancellation, or recharge does not silently modify an independent campaign reservation.
23. For 2, 3, and 10 kg weekly plans, paid per-delivery prices remain ₹240, ₹360, and ₹1,200; four-delivery base cover remains ₹960, ₹1,440, and ₹4,800, subject to existing approved wallet rules.
24. Paid cutoff boundaries, blocked weekdays, hub scheduling, delivery fees, skip limits, vacation behavior, and protected deliveries remain as before.
25. The retired ₹100 discount is unavailable through both current and stale clients; the resolved cashback policy is enforced once without deleting previously earned credits or re-crediting bonuses.
26. A campaign reservation does not accidentally count as a paid first order or subscription for unrelated eligibility, revenue, or wallet reporting.
27. CSV exports include all required fields and all filtered rows; mobile/PIN formatting, Unicode, address quoting, and formula neutralization work.
28. Web and app show correct open/paused/full/closed, already-reserved, validation-error, loading, and network-retry states. Monthly survey values never change subscription quantity.

## Delivery and rollout evidence

Provide additive, repeatable migrations and a configurable campaign seed. Do not delete current customers, orders, subscriptions, invoices, coupons, or ledgers. Keep unconfigured geography from silently accepting reservations.

Prepare the release with a campaign feature flag and non-accepting initial state. Verify the year/date, area allowlist, hub mapping, and promotion retirement decision before opening bookings. Deploy using the established project workflow and preserve the existing service configuration; record any migrations and process restarts actually performed.

Deliver:

1. Changed files and rationale for backend, website, admin, and mobile separately.
2. Migrations, campaign configuration, permissions, and rollback instructions that preserve already-made reservations.
3. Final OpenAPI/Postman documentation with exact routes, request bodies, response examples, statuses, and idempotency behavior.
4. Automated test results, including real database concurrency tests and paid-flow regression coverage.
5. Test-environment URLs and genuine observed sample responses clearly separated from illustrative examples.
6. Admin and customer-flow screenshots or a recorded verification walkthrough, including the final-slot race result and a reservation followed by a paid purchase before the campaign start.
7. Deployment commit references and an explicit feature/deployment status for each client. Do not claim mobile completion from a web-only change.
8. A requirements-to-tests checklist covering every source section: Launch Offer; ₹100 Discount Removal; Website/App Banner; Customer Flow; One Pack Per Household; No Payment; Counter/Availability; Admin Dashboard; Hub/Area Counts; Normal Subscription Protection; Campaign Status; Final Paid-Order Independence Clarification.

Complete the feature within these boundaries. List unresolved client choices and any unavailable repository/environment explicitly; do not conceal them by substituting invented policy or mock production results.
