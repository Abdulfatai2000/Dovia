# Master Phase 1 — Marketing UI

The server-rendered marketing routes `/`, `/features`, `/pricing`, and `/about` share a branded header/footer and a single main landmark. Page metadata is defined locally; root favicon metadata remains intact.

The landing page includes a component-built product preview, value cards, seven-step workflow, meeting-to-execution sequence, use cases, illustrative follow-up metrics/progress/activity, planned integrations, and signup/signin calls to action. No screenshots, external imagery, fake testimonials, customer counts, or performance claims are used.

The features page explains preparation, capture, planned AI intelligence, human review, ownership, planned follow-up/reporting, and carry-over. Pricing lists Starter, Team, and Organization as Coming soon, with no invented prices or entitlements. The about page explains the problem, mission, and human-review principle without invented company history.

Integration providers are marked Planned. Signup and early-access buttons link to the existing frontend signup preview; notices explain that accounts, subscriptions, and registration are not connected. Illustrative metrics are labeled sample UI data.

Shared files live under `src/components/marketing/`; `src/data/marketing.ts` holds the repeated content. MarketingHeader is a client boundary for the existing accessible Modal mobile menu. Navigation uses native links, current-page labels, and visible focus. Layouts stack on mobile and use responsive grids on wider screens.

Per quota-saving instructions, no browser or screenshot QA was run. The user will perform visual QA.
