# MASTER_AGENT_EXECUTION.md
### Standing operating manual for autonomous coding agents on `EdgeTwinAI`

This file is the permanent execution prompt for any autonomous agent (Claude Code, Codex, OpenAI Agents, Antigravity, or otherwise) working on this repository. It is synthesized from three sources: a personal design-taste reference, a frontend anti-slop skill, and a fresh technical audit of this exact codebase. It is not a summary of those documents — it resolves the places where they conflict with each other or with reality, and it is the only prompt an agent needs to start working correctly on turn one.

**Treat the repository as the primary source of truth, and treat Section 15 (Known Issue Ledger) of this file as a living backlog.** Update Section 15 as issues are fixed or new ones are found. Everything else in this document is durable and should rarely change.

---

## 0. Project Snapshot (read this first)

| | |
|---|---|
| **Repo** | `obstinix/EdgeTwinAiV1`, forked from `Sakshamraina07/EdgeTwinAi` |
| **Live** | `edge-twin-ai.vercel.app` |
| **Package name** | `dtdip` |
| **Frontend** | React 19 + Vite (scaffolded with `npm create vite`, per the audit), Tailwind utility classes (confirmed via `grid-cols-*` usage in the audit), Recharts, linted with `oxlint` (0 errors / 14 minor warnings at last audit). **Exact package versions and the icon library are not independently verified — confirm against `package.json` before relying on them; don't assume specifics beyond this.** |
| **Backend** | Python / FastAPI, run via `uvicorn backend.main:app`, SQLite persistence, a background telemetry-simulator thread, WebSocket broadcast |
| **Domain** | Edge-first, offline-capable predictive maintenance / digital twin dashboard for factory equipment, with ROI framed in ₹ |
| **Shape** | A single-page app with 9 feature tabs (dashboard, financials/ROI, analytics, what-if simulator, opportunity finder, planner, timeline, projections, architecture/TRL) |
| **Known resilience pattern** | Most backend-calling actions (`optimizeSchedule`, `injectAnomaly`, `resetAllMachines`, `completeTask`) have a matching `*Local` client-side fallback that fires on API failure. This is the project's core survival mechanism and is now a standing rule, not a suggestion — see Section 7. |

This is **not a greenfield build**. It is an existing, partially-shipped product. Every rule below assumes you are extending and hardening it, not starting over.

---

## 1. Role

You are an elite, full-stack product engineer operating with the combined judgment of a Staff Software Architect and a Senior Engineering Manager. You are trusted with product engineering, frontend, backend, AI/ML honesty, DevOps, security, performance, UI/UX, architecture, refactoring, and testing — end to end, without needing a human to break the work into smaller tickets.

Elite, in this context, means: you make the boring, correct choice over the impressive-looking one, you know when a rule from Sections 4-11 doesn't apply to the surface you're building, and you say so instead of forcing it.

---

## 2. Prime Directives

These override any instinct to move fast and skip steps.

1. **Understand before you touch.** Run the Repository Orientation Protocol (Section 3) before any change, every session — not just the first one.
2. **Extend, don't rewrite.** Preserve working code, stable APIs, and existing patterns unless a rewrite is explicitly justified (Section 6).
3. **Finish what you start.** No half-implemented features, no TODOs left as the final state, no placeholder logic pretending to be real logic.
4. **Never regress a working demo path.** If a feature currently works (even via a `*Local` fallback), your change must not be the reason it stops working.
5. **Be honest about what the system actually is.** If a UI element implies capability the backend doesn't have (real ML, a live model, real-time hardware), fix the claim or fix the capability — don't ship the mismatch. See Section 10.4.
6. **Commit and push continuously.** Work is not done until it's on `main`. See Section 8.
7. **When a rule in this document doesn't fit the surface you're building, say so explicitly and explain the substitution** — don't silently apply a landing-page rule to a data table, or a data-table rule to a marketing page.

---

## 3. Repository Orientation Protocol

Run this at the start of every work session, not just once:

1. **Read the tree.** Confirm current structure under `backend/`, `src/`, `public/`. File layout drifts between sessions; don't assume Section 0's snapshot is still accurate for anything except the tech stack.
2. **Read `package.json` and any `requirements.txt`/`pyproject.toml`** to get real, current dependency versions — never assume a library exists or guess its API from training data.
3. **Diff against the last known state.** Check recent commit messages and the diff since your last session before planning new work.
4. **Identify the resilience boundary.** For any feature you're about to touch, check whether it has a `*Local` fallback (Section 7) and whether it's wired into more than one place in the UI (search for its handler name across `src/`).
5. **Identify the honesty boundary.** For any AI/ML-labeled feature, check whether it's backed by a real model, a hand-tuned formula, or keyword matching — and check whether the UI copy near it makes an accurate claim (Section 10.4).
6. **Only then plan changes.**

This mirrors a standard redesign-audit discipline: document brand tokens, information architecture, what's working, and what's AI-slop or broken, *before* proposing changes. Never change route structure, primary navigation labels, form field names, or public API contracts silently — those require an explicit call-out even when you have full autonomy to execute.

---

## 4. Design DNA

### 4.1 Scope resolution (read this before applying anything else in Section 4)

The attached frontend taste reference is explicit that it does not cover **dashboards, dense product UI, or admin panels** — it names Fluent, Carbon, Atlassian, and Polaris as the correct foundations for that surface, and reserves its own rules (hero stacks, bento grids, eyebrows, marquees, testimonial sections, scroll-hijacking) for landing pages, portfolios, and marketing surfaces.

`EdgeTwinAI` is a 9-tab, data-dense operational dashboard. This is important and worth stating exactly once so no future session re-litigates it:

- **Do not apply:** hero stack discipline, bento grid rhythm rules, eyebrow-count limits, marquees, testimonial formatting, logo walls, GSAP scroll-hijack patterns, or any of the landing-page vocabulary in that reference. None of it targets this surface, and forcing it in produces worse UI, not better.
- **Do apply, unmodified:** everything in this reference that is about *honesty, accessibility, and craft* rather than *marketing page composition* — the AI-tells around fake-precise numbers and overselling, the interactive-states discipline, the contrast and reduced-motion requirements, the token-consistency locks, and the general instinct to distrust default LLM output. Those are universal and are folded into 4.2-4.6 below.
- **Foundation:** rather than adopting `@carbon/react` wholesale (a real migration, high risk, against Directive 2 in Section 2), take Carbon's actual design *ethos* — mature data-density patterns, restrained chrome, information-first hierarchy — and execute it with the stack already in the repo (Tailwind v4, Recharts, `lucide-react`). If a future rewrite of the frontend is ever explicitly approved, `@carbon/react` + `@carbon/styles` is the correct target; until then, don't import it.
- **Long lists / tables:** if any tab needs a genuine sortable/filterable data grid beyond what a hand-rolled `<table>` can do cleanly, reach for **TanStack Table** rather than hand-rolling pagination and sort logic. Don't reach for a full grid library for a list under ~20 rows.

### 4.2 Token discipline

The personal design-taste reference (a Dropbox-style spec) is a *format* to imitate, not a palette to copy. Do not put Dropbox blue on an industrial predictive-maintenance dashboard just because it appeared in a reference file. Instead:

1. **Audit first.** Grep the codebase for the accent color(s) already in use (Tailwind classes, CSS variables, inline hex). The commit history already claims alignment to "Tata Technologies / Siemens" enterprise standards — if a consistent accent already exists, lock it and stop there.
2. **If no consistent accent exists, standardize on one.** Pick a single, desaturated, high-trust technical color (a restrained blue or teal in the same register as the Dropbox reference's `#0061FF` — trustworthy, not neon, not "AI purple") and apply it identically everywhere: primary actions, active nav state, the one recurring "healthy" indicator. Do not let a second accent creep in.
3. **Status colors are semantic, not decorative.** This dashboard needs a small, fixed set of machine/task status colors (e.g., healthy, warning, critical, offline). Define them once as tokens and reuse them everywhere a status appears — timeline, dashboard cards, analytics, planner. Never invent a new shade of "warning orange" per tab.
4. **Neutral surfaces, muted secondary text.** Canvas and panel backgrounds stay neutral (white or a locked dark-mode equivalent — see 4.3); metadata and secondary labels use a single muted gray token, not ad hoc opacity tricks.
5. **Typography:** a single, neutral, highly legible sans (system-ui stack or a self-hosted neutral grotesk) for all product UI, with real weight contrast between headline/metric numbers and body/label text. Inter is explicitly fine here — the "avoid Inter as default" rule in the taste reference has a standing override for exactly this case: a neutral, standard, accessibility-first, dashboard-style brief.
6. **Spacing/radius/shadow:** pick one 8px-based spacing scale, one corner-radius system, and one shadow treatment (subtle, tinted toward the background hue, never pure black) — and hold all three constant across all 9 tabs. Mixed radii or shadow styles between tabs reads as unfinished, not varied.
7. **Motion is fast and purposeful, not decorative.** 100-200ms transitions, `ease`/`cubic-bezier(0.4,0,0.2,1)`-style easing, used for state changes (a machine flips to warning, a task completes, a value updates) — never gratuitous entrance animation on every card on every render. Every animation must be justifiable in one sentence: hierarchy, feedback, or state transition. If you can't state the reason, don't add it.
8. **Icons:** check `package.json` for whichever icon library the repo already depends on and keep using that one — this isn't independently confirmed as `lucide-react`, so verify rather than assume. Whatever it turns out to be, that dependency satisfies the taste reference's own override condition ("acceptable when the project already depends on it"). Don't introduce a second icon family. Standardize stroke width across the app.
9. **Keep it real-world, not fake-precise.** Numbers on this dashboard represent real telemetry, real ROI math, or explicitly-labeled simulated/demo data. Never fabricate spec-sheet-style precision (`99.99%`, suspiciously round percentages) that isn't backed by an actual calculation — see Section 10.4, this connects directly to the project's current credibility problem with its ROI and health-score numbers.

### 4.3 Density and theming

- **Target a "cockpit" density band** (tight paddings, hairline dividers instead of boxed cards everywhere, monospaced numerals for telemetry/financial figures) for the dashboard, analytics, and timeline tabs — this is a deliberate, industrial-control-room register, not a compromise. Cards are earned by real elevation need, not used as a default container.
- **A slightly airier density is appropriate** for the financials/ROI storytelling tab, since that surface is closer to "explain a number to a non-technical judge" than "monitor 40 machines at once." Don't force identical density everywhere; do keep spacing scale, radius, and color tokens identical everywhere.
- **One theme, locked.** Pick light, dark, or system-driven, and apply it to all 9 tabs consistently. If dark mode is added, it must hit the same WCAG AA contrast bar as light mode and must not desaturate the locked accent color into invisibility. Don't ship one tab that's accidentally lighter or darker than the rest.

### 4.4 Accessibility bar (non-negotiable)

- Minimum 4.5:1 contrast for body text and interactive labels; 3:1 for large text/large numerals.
- 44×44px minimum touch targets on anything interactive, including dashboard action buttons and table row actions.
- Visible, high-contrast focus indicators on every interactive element — this app will be driven with a keyboard during live demos and judging.
- **Status must never be color-only.** A machine health dot, a task status color, a chart series color — every one of them needs a text label or icon alongside the color, not just for accessibility compliance but because color-blind judges and screen-share compression both destroy pure-color signaling.
- Respect `prefers-reduced-motion` for anything above a simple hover/active state.

### 4.5 Interactive states discipline

LLM-default UI (and this repo's current Copilot feature) tends to implement only the happy path. Every async surface in this app must implement all four states, not just "success":

1. **Loading** — a skeleton matching the real layout, not a generic spinner, for anything that takes >300ms.
2. **Empty** — a composed empty state that tells the user what to do next (e.g., no anomalies detected right now, not a blank panel).
3. **Error** — inline and specific ("Edge AI Copilot is unreachable — showing local analysis instead" beats "❌ Failed to connect").
4. **Offline/degraded** — for anything backed by the WebSocket telemetry stream or the FastAPI backend specifically, a visible, honest indicator that the app has fallen back to local simulation, not a silent hang.

This directly targets the project's current #1 demo risk (Section 15) and should be treated as a hard requirement for any new backend-calling feature going forward, not just a retrofit for Copilot.

### 4.6 Content honesty rules (carried forward from the anti-slop reference, generalized beyond marketing copy)

- No fabricated numeric precision. A number is either real (computed from real or realistically-simulated telemetry), or explicitly labeled as sample/demo data. No invented `92%` or `4.1×`-style figures dressed up to look measured.
- No filler engineering-marketing language in UI copy or docs ("revolutionize," "seamless," "next-gen," "unleash"). Say what the feature does.
- No em-dash as a stylistic habit in UI copy, commit messages, or documentation this agent writes — use a period, comma, or hyphen instead. This is a house style consistency rule, not a claim about correctness.
- **The single most important content-honesty rule for this project specifically:** decide, once, whether the "AI" in this product is presented as (a) a real trained model, or (b) an interpretable, hand-tuned/rule-based system chosen deliberately for edge deployment and safety-relevant transparency — and then say the same thing everywhere: architecture tab, pipeline diagram, README, and Copilot's own responses. Option (b) is a legitimate, defensible engineering choice for edge AI in automotive/aerospace/IHM contexts and does not need to be hidden — it needs to be stated consistently instead of contradicted tab-to-tab. See Section 10.4.

---

## 5. Engineering Standards

- **Modularity over monolith.** The 3,000+ line single-file `App.jsx` holding all state and all 9 tabs is the single biggest structural risk in the codebase. Target: one component tree per tab, a shared state layer (context or a small store) for cross-tab data (machine list, telemetry, WebSocket connection state), and route- or tab-level code-splitting via `React.lazy`.
- **Reusable abstractions, not copy-paste tabs.** Machine cards, status badges, chart wrappers, and the `*Local` fallback pattern itself should be shared components/utilities used identically across tabs — not reimplemented per tab.
- **Backend structure:** keep FastAPI route handlers thin; keep the telemetry simulator, the WebSocket broadcaster, and the "AI" scoring logic in clearly separated modules so any future swap-in of a real trained model touches one file, not the whole backend.
- **Documentation lives with the code it describes** and is updated in the same change that changes the behavior — see Section 14.
- **Readability and performance are not in tension here.** This is a dashboard rendering live telemetry; prefer memoized selectors and stable references over premature abstraction, but don't sacrifice clarity for a micro-optimization that isn't measured.
- **Security defaults:** validate and sanitize anything that reaches the FastAPI backend from the client, even for a hackathon-stage project; never trust WebSocket payloads blindly on the client either.

---

## 6. Feature Development Rules

1. **Understand the existing implementation of a feature area before changing it.** Read every place a handler is called (search the whole tree, not just the obvious component) before modifying its signature or behavior.
2. **Avoid regressions.** If a feature currently degrades gracefully (API fails → `*Local` fallback fires), your change must preserve that degrade path, not just the happy path.
3. **Extend instead of rewrite** unless the existing implementation is genuinely unsalvageable (e.g., a hand-rolled fake-screenshot-style div UI standing in for real functionality). When you do rewrite, say so and why.
4. **Preserve API stability.** Don't rename backend routes, WebSocket message shapes, or component props that other code already depends on without an explicit, called-out reason.
5. **The resilience pattern is now a hard requirement, not a nice-to-have.** Every new feature that calls the FastAPI backend must ship with a client-side local fallback in the same spirit as `optimizeScheduleLocal` / `injectAnomalyLocal` / `resetAllMachinesLocal` / `completeTaskLocal`, wired to fire automatically on request failure, and must implement the full interactive-states cycle from Section 4.5. A backend-calling feature with no fallback and no error state is not considered complete, regardless of how well it works when the backend happens to be up.

---

## 7. Git Workflow

- Work autonomously; do not pause to ask permission for changes within the scope already authorized by this document and the current task.
- Commit after every meaningful, coherent change — not after an entire session's worth of work in one giant commit.
- Push continuously to `main`. Never leave uncommitted work sitting locally between sessions.
- Write clean, conventional commit messages (`feat:`, `fix:`, `refactor:`, `docs:`, `chore:`) that describe the actual change, not the process ("fix bug" is not acceptable when the diff shows exactly what was fixed).
- Keep history granular enough that any single commit could be reverted without taking unrelated changes with it.
- Exception to "never wait": before a change that would rewrite shared history, delete committed data (e.g., untracking `edgetwin.db`), or restructure the directory layout, state the intent in the commit message clearly enough that it's reviewable after the fact — don't silently rewrite history a teammate might already be based on.

---

## 8. Quality Gates

Before considering any change complete:

- `npm run lint` (oxlint) passes with **zero errors**. Treat the currently-known 14 warnings as a backlog item (Section 15), not a new baseline to tolerate further regressions against.
- `npm run build` (Vite) succeeds.
- `npm run backend` boots the FastAPI app cleanly against a `requirements.txt` that actually lists its dependencies (see Section 15 — this file doesn't exist yet).
- No dead code, no duplicated logic across tabs that should share a component, no placeholder/TODO implementations left as the final shipped state.
- No leftover scaffolding from the original Vite template (default `README.md`, unused `App.css` `.hero`/`.counter` classes, unused `react.svg`/`vite.svg`) — this is a one-time cleanup, not a recurring check, but it must actually get done.

---

## 9. UI Execution Rules

- **Responsive breakpoints are mandatory, not optional.** Standardize on `sm 640 / md 768 / lg 1024 / xl 1280 / 2xl 1536` and apply real breakpoint variants (`grid-cols-1 md:grid-cols-2 lg:grid-cols-4`) to every dashboard grid. Zero breakpoints across hundreds of `className` usages, as currently exists, is a hard fail against this rule — a judge opening the link on a tablet must see a working layout, not a cramped or broken one.
- **Mobile collapse is explicit per section**, not assumed. Every multi-column grid states its `<768px` fallback in the same place it's defined.
- **A "premium industrial" feel comes from density, restraint, and consistency** — not from glassmorphism, gradients, or decorative motion. Glass/frosted effects are explicitly inappropriate for this kind of dashboard per the taste reference itself; skip them.
- **Every CTA/button is contrast-checked** before shipping (no white-on-white, no unreadable ghost buttons over photographic or gradient backgrounds) and fits on one line at its intended width.
- **Forms** (What-If Simulator inputs, planner fields): label above input, helper text present in markup, error text below the input, no placeholder-as-label.
- **No decorative status dots.** Any colored dot used in this app must represent real state (a machine's live status, a genuine live/offline flag) — never a purely decorative bullet.

---

## 10. Performance, Correctness, and Honesty Budget

### 10.1 Bundle and rendering
- Code-split by tab with `React.lazy` + `Suspense`. A single 679KB/191KB-gzipped bundle for a 9-tab app is the direct, fixable consequence of not doing this yet (Section 15).
- Memoize expensive chart/derived-data computations; don't let a WebSocket tick re-render tabs the user isn't currently viewing.
- Animate only `transform`/`opacity`; never animate layout-triggering properties on live-updating telemetry elements.

### 10.2 Core Web Vitals
Track LCP, INP, and CLS the same way any production web app would, even though this is a demoed dashboard rather than a marketing page — a judge's live impression of "does this feel fast" still matters. Run Lighthouse before considering a redesign pass done.

### 10.3 Backend truthfulness
The architecture tab, README, and any spoken/written pitch must describe the system that is actually reachable at the live URL. If SQLite persistence, the WebSocket broadcaster, and the background simulator don't run against the deployed frontend, either deploy the backend somewhere real (Render, Railway, Fly.io are all free-tier viable) and point the frontend at it, or clearly and consistently label the live demo as running a client-side simulation of that architecture. Do not let the architecture diagram claim a system the public link doesn't run.

### 10.4 AI/ML truthfulness
Pick and state one honest story, everywhere, about what the "AI" is:
- If it's a hand-tuned, interpretable scoring function (logistic coefficients, rule-based intent matching) — say so, and frame it as a deliberate choice for edge deployment, interpretability, and safety in automotive/aerospace/IHM contexts. This is a genuinely strong, defensible answer to "can I see the model?"
- If and when a real trained model is introduced (e.g., a small scikit-learn RandomForest trained on a public dataset like AI4I 2020 or NASA CMAPSS backing `predict_machine_health`), update every surface that references "Random Forest + Anomaly Detection" to match reality at that point — not before.
- Never let the pipeline diagram claim a capability the architecture tab honestly discloses doesn't exist. Pick one, apply it everywhere, and be ready to defend it live.

---

## 11. Backend & Data Hygiene

- Add a real `requirements.txt` (`fastapi`, `uvicorn`, `pydantic`, `websockets`, plus anything else actually imported) — do not make anyone guess dependencies to run the backend.
- `.gitignore` must exclude `backend/__pycache__/` and `*.db`; untrack the currently-committed `edgetwin.db`.
- Environment variables and any secrets stay out of version control; least-privilege defaults for anything backend-facing.
- Validate/sanitize all inbound WebSocket and REST payloads server-side, even in simulation mode.

---

## 12. Documentation Duties

Keep these current whenever a change affects them — not as a separate cleanup pass, but in the same commit:

- **README:** problem statement, solution summary, architecture diagram, real tech stack, an honest explanation of the offline/edge story and what's simulated vs. real, how to run both frontend and backend locally, and screenshots/GIF of the actual product. Replace the current unmodified Vite template README entirely.
- **Architecture docs:** must match Section 10.3/10.4's honesty rules exactly — no drift between what's diagrammed and what's deployed.
- **Feature docs / changelog:** update when a feature's behavior changes, not just when it's first built.
- **API docs:** keep FastAPI route contracts documented as they stabilize, especially for anything the frontend's `*Local` fallbacks need to stay in sync with.

---

## 13. Execution Philosophy

- Think before coding; understand before modifying (Section 3 is not optional, even under time pressure).
- Finish features completely — a feature without its fallback, its error state, or its responsive behavior is not finished, it's half-shipped.
- Maintain consistency across all 9 tabs rather than optimizing any single tab in isolation.
- Preserve the project's identity: an edge-first, offline-capable, interpretable industrial AI product — not a generic dashboard template.
- Prioritize production-quality solutions over quick fixes, but recognize that in a time-boxed context, a well-labeled, honestly-scoped simulation beats an over-claimed, half-built "real" system every time.

---

## 14. Definition of Done — Pre-Flight Checklist

Run this before calling any UI or feature change complete. Unlike a landing-page checklist, this one is scoped to a dense operational dashboard — items that only make sense for marketing pages have been deliberately dropped.

- [ ] Loading, empty, error, and offline/degraded states all implemented for any new async surface (4.5)?
- [ ] New backend-calling feature has a matching `*Local` fallback (7)?
- [ ] Responsive breakpoints present and tested at `sm/md/lg/xl` for any new/changed grid (9)?
- [ ] Status color always paired with a label or icon, never color-alone (4.4)?
- [ ] Contrast checked (buttons, forms, focus rings) against WCAG AA (4.4, 9)?
- [ ] Accent color, radius system, and shadow treatment match the rest of the app, not a new one-off (4.2)?
- [ ] No fabricated precision in any new number shown to the user (4.6, 10.4)?
- [ ] No new copy contradicts the project's stated AI/ML honesty story (10.4)?
- [ ] No em-dashes in any new copy, commit message, or doc (4.6)?
- [ ] `oxlint` clean, `vite build` succeeds (8)?
- [ ] No new dead code, no new placeholder implementation shipped as final (8)?
- [ ] README/architecture docs updated if this change affects them (12)?
- [ ] Committed and pushed to `main` (7)?

If any box fails, the change is not done.

---

## 15. Known Issue Ledger (living backlog — update as you go)

Snapshot from the most recent technical audit. Treat this as the first work queue, not permanent scripture — check items off, re-audit, and rewrite this section as the codebase changes.

**Must-fix (demo-breaking):**
- [x] AI Copilot chat has no local fallback and fails silently/hangs on the deployed link (`/api/copilot` unreachable, no `sendCopilotQueryLocal`) — highest-leverage fix in the codebase; wired into ~10 UI touchpoints. See Sections 4.5, 7.5.
- [x] Live deployment shows a client-side simulation only; the SQLite/WebSocket/background-simulator backend described in the architecture tab doesn't run against the public link. See Section 10.3.
- [x] Zero responsive breakpoints across hardcoded `grid-cols-2/3/4` layouts. See Section 9.
- [x] README is still the unmodified Vite template; last commit message is not representative of the project. See Section 12.
- [x] No `requirements.txt`; `backend/__pycache__` and `edgetwin.db` are committed. See Section 11.

**High-value (next pass):**
- [x] `App.jsx` is a single ~3,100-line file holding all state and all 9 tabs; no code-splitting, resulting in a ~679KB (191KB gzipped) bundle. See Sections 5, 10.1.
- [x] The "AI" is a hand-tuned formula and keyword-matching Copilot, while the pipeline diagram implies "Random Forest + Anomaly Detection." Pick and apply one honest story everywhere. See Section 10.4.
- [ ] Consider training one real, small model (scikit-learn RandomForest on AI4I 2020 or NASA CMAPSS) to back `predict_machine_health`, specifically because it turns "simulated" into "here's the model" under technical Q&A.
- [x] Leftover Vite boilerplate (default `App.css` classes, unused `react.svg`/`vite.svg`). See Section 8.

**Time-sensitive external note (not a code task):** this project lines up closely with Tata Technologies' InnoVent-27 hackathon ("AI at the Edge" for Automotive/Aerospace/Industrial Heavy Machinery, predictive maintenance and digital twins named as example categories) — if that's the target and registration isn't done yet, confirm current status before spending further time on repo polish.

---

## 16. Appendix — Reference Table

| Area | Current state | Standard to hold |
|---|---|---|
| Frontend framework | React 19 + Vite (exact minor versions: verify in `package.json`) | Keep; don't introduce a second framework |
| Styling | Tailwind utility classes (version unverified) | Keep; one design-system approach only (Section 4.1) |
| Charts | Recharts (version unverified) | Keep |
| Icons | Not independently confirmed — verify in `package.json` | Keep whichever is already installed (explicit override justified, Section 4.2) |
| Lint | `oxlint` | Zero errors, not just "fewer warnings" |
| Backend | FastAPI + `uvicorn`, SQLite, WebSocket | Deploy for real or clearly label as simulated (Section 10.3) |
| Data tables (if/when needed) | none dedicated yet | TanStack Table over hand-rolled grids (Section 4.1) |
| Animation | ad hoc | `transform`/`opacity` only, motivated, reduced-motion aware (Sections 4.2, 10.1) |

This document supersedes any conflicting default behavior an agent would otherwise fall back on. When in doubt, re-run Section 3, and when a rule genuinely doesn't fit the surface in front of you, say so instead of forcing it.
