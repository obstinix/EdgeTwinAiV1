# motion.md
### Motion & animation spec for EdgeTwinAI — companion to `MASTER_AGENT_EXECUTION.md`

Scope note, stated once: this is a data-dense operational dashboard, not a marketing page. The landing-page motion vocabulary (scroll-hijacked sections, pinned sticky-stacks, horizontal-pan reveals, magnetic hover physics) does not apply here and should not be reached for. If a separate public/marketing page for the hackathon submission is ever built, that page can borrow more liberally from that vocabulary — but the dashboard itself should not.

Every rule below exists to serve one goal: motion that tells the user something changed, without ever making a 9-tab telemetry dashboard feel busier or slower than it already is.

---

## 1. Target Motion Intensity: 4-7 ("Fluid CSS"), not 8-10

Using the intensity scale from the taste reference this project already draws on:

- **1-3 (Static)** is too flat for a live telemetry product — state changes (a machine going critical, a task completing) need to be felt, not just noticed on a re-render.
- **8-10 (Advanced choreography)** — scroll-triggered reveals, parallax, pinned sections — is explicitly wrong for this surface. A control-room dashboard should never make the user wait for an animation to resolve before they can read a number.
- **Target band: 4-7.** CSS transitions and short, purposeful transforms on real state changes. No scroll-driven animation anywhere in the app.

If you ever catch yourself reaching for GSAP `ScrollTrigger`, a pinned section, or a parallax layer in this codebase, stop — that's the wrong tool for this product, not just a stylistic preference.

---

## 2. Library & Stack

- **Default: plain CSS transitions via Tailwind (`transition`, `duration-*`, `ease-*`) or native CSS.** This covers the large majority of what this dashboard needs (hover/press feedback, tab switches, status color changes) with zero new dependencies — the right call under hackathon time pressure.
- **If richer choreography is genuinely needed** (coordinated multi-element transitions, spring physics on a live value, staggered list entrance for a telemetry feed), add a single library rather than hand-rolling it: `motion` (the library formerly known as Framer Motion), imported as `motion/react`. Verify it isn't already installed under a different name before adding it.
- **Do not add GSAP or Three.js to this project.** Neither scroll-hijacking nor 3D scenes serve a telemetry dashboard, and mixing animation libraries in the same component tree causes real bugs (they fight over the same frames).
- **Never drive continuous values (a live gauge needle, a WebSocket-fed number ticking up) through `useState`.** That re-renders the React tree on every tick. If you adopt `motion/react`, use `useMotionValue`/`useTransform` for anything that updates faster than user-triggered state should. If you stay CSS-only, drive it through a CSS custom property updated imperatively, not through component re-render.

---

## 3. Core Interaction Patterns

Concrete defaults for the moments that actually occur in this product. Treat these as starting points, not exact pixel law — the point is the *category* of motion for each moment, not the specific millisecond count.

| Moment | Motion | Why |
|---|---|---|
| **Tab switch** (dashboard → analytics → planner, etc.) | Instant content swap or a ≤150ms crossfade. No slide/wipe transitions between tabs. | Users tab-switch constantly while monitoring; a slow transition becomes friction, not polish. |
| **Machine/task status change** (healthy → warning → critical) | A brief (200-300ms) color transition plus a single, non-repeating pulse or scale-flash on the status indicator at the moment it changes — not a looping pulse while it stays in that state. | Draws attention to the *transition*, not to the ongoing state. A permanently pulsing badge is noise within a minute of looking at the screen. |
| **Live telemetry number ticking** (temperature, RPM, ROI figures updating from the WebSocket feed) | Smooth numeric interpolation over ~200-400ms rather than a hard jump-cut, OR a plain instant update if the tick rate is fast enough that animating it would just create visual noise. | Avoid re-render-driven layout thrash; pick whichever reads calmer at the real update frequency. |
| **Chart data updates** (Recharts series refreshing) | Let Recharts' own transition props handle the redraw; keep it short (≤300ms) and don't layer a second animation library on top of it. | Recharts already animates; adding motion on top of motion is the kind of over-animation this section is warning against. |
| **Loading** (any panel waiting on backend/WebSocket data) | A skeleton shaped like the real layout (cards, chart axes, table rows), not a generic spinner. | Matches the "interactive states" rule from the master doc — a skeleton tells the user what's coming, a spinner doesn't. |
| **Error / fallback-to-local state** (e.g., Copilot falling back to local analysis) | The state itself should appear via a simple fade-in banner or inline text change, not a shake, flash, or attention-grabbing animation. | This is a normal degraded state in this app's own design, not an alarming failure — the motion shouldn't editorialize it as one. |
| **Button / row press feedback** | `active:scale-[0.98]` or a 1px `-translate-y` on `:active`. | Cheap, real, tactile feedback with no new dependency. |
| **Modal / drawer open** (e.g., machine detail, share/export dialog) | Short fade + slight scale-in (≤200ms) for the panel; a plain fade for the backdrop. Respect the existing z-index scale — don't invent a new stacking layer per modal. | Consistency across every overlay in the app; see Section 5. |
| **Toast / transient notification** | Slide-or-fade in, auto-dismiss, no bounce/elastic easing. | Keep the tone matter-of-fact — this is an industrial tool, not a consumer app celebrating every action. |
| **WebSocket connect / reconnect indicator** | A small, persistent, non-animated (or single-pulse-on-change) connection-state indicator — never an infinite spinner implying "still trying" when it's actually connected, and never silent when it's actually disconnected. | Directly tied to the master doc's "offline/degraded state must be visible" rule — this is a truthfulness requirement, not just a style choice. |

---

## 4. Accessibility & Performance Guardrails

- **Animate only `transform` and `opacity`.** Never animate `top`, `left`, `width`, `height`, or anything that forces layout recalculation on a page that's already re-rendering from live data.
- **`prefers-reduced-motion` is mandatory for anything above simple hover/active feedback.** Status-change pulses, number-tick interpolation, and modal transitions must collapse to an instant state change under reduced motion — not just play slower.
- **`will-change: transform`** only on elements that are actually about to animate; don't apply it globally or "just in case."
- **Z-index is a fixed, documented scale**, not ad hoc `z-10`/`z-50` sprinkled per component. Reserve layers for: sticky nav, dropdowns/popovers, toasts, modals/drawers — in that order — and reuse the same constants everywhere an overlay appears.
- **`useEffect`-driven animations need real cleanup functions.** A telemetry dashboard mounts and unmounts panels constantly as the user switches tabs; a leaked animation frame or interval here compounds fast.
- **No `window.addEventListener('scroll')` anywhere.** This app has no scroll-driven motion to begin with, so this should never come up — if it does, that's a sign a landing-page pattern has leaked into the wrong surface.

---

## 5. What Not to Do

- Don't add a looping/pulsing animation to a status badge that isn't currently changing state. Motion marks a transition, not a resting state.
- Don't animate every card's entrance on every tab switch "for polish." If it's not new data and not a state change, it shouldn't move.
- Don't use bounce/elastic/spring-overshoot easing on error states, disconnect indicators, or anything communicating a problem — it reads as a strange tonal mismatch on an industrial tool.
- Don't introduce a second animation library once one is chosen (Section 2). Mixing `motion/react` with hand-rolled CSS keyframes for the *same kind* of interaction produces inconsistent easing and timing across the app.
- Don't claim motion you haven't shipped, and don't ship half-finished motion (a transition that's cut off, a skeleton that doesn't match the real layout, a modal that pops instead of fading because the transition class got dropped). Either it's finished, or the dial should be lower for that surface.

---

## 6. Pre-Ship Checklist (motion-specific)

- [ ] Every animation can be justified in one sentence: hierarchy, feedback, or state transition — never "it looked cool."
- [ ] Nothing loops indefinitely on a status/badge that isn't actively changing.
- [ ] `prefers-reduced-motion` degrades every non-trivial animation to instant.
- [ ] Only `transform`/`opacity` are animated; no layout-triggering properties.
- [ ] One animation library in use across the whole app — no GSAP, no Three.js, no mixed Motion + hand-rolled keyframes for the same interaction type.
- [ ] Z-index values for any new overlay come from the existing documented scale.
- [ ] Connection/offline state motion is honest — never spinning "connecting" while actually connected, never silent while actually disconnected.
