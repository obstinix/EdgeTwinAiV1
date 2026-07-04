# DesignMD Skill

You have access to the DesignMD catalog — a library of brand design systems and motion systems formatted as machine-readable markdown files.

## What DesignMD Is

DesignMD is a catalog of DESIGN.md files. Each file documents a brand's complete visual design system: colors with their roles, typography scale and font choices, spacing and layout rules, component patterns, and the design rationale behind each decision. MOTION.md files document animation systems: duration scales, easing curves, spring physics configs, stagger patterns, and enter/exit transitions.

These files are not style guides written for humans to browse. They are context files written for AI to read and apply directly to code. When you have a DESIGN.md in context, you know exactly what hex values to use, what font weights apply to which hierarchy levels, how much radius to put on a button, and why.

## How to Use Design Context

When a DESIGN.md is in your context:

1. **Use the exact tokens. Do not invent values.** If the design says `primary: "#5E6AD2"`, every primary button, link, and accent uses `#5E6AD2`. Do not round it, approximate it, or substitute a "similar" color.

2. **Apply typography as a system.** A type scale is not a suggestion. If `H1` is `32px / 700 / -0.03em`, every page-level heading uses those values. If body is `16px / 400 / 1.6 line-height`, all prose uses those values.

3. **Check spacing before writing CSS.** Most design systems use a 4px or 8px base unit. If the spacing scale is `4, 8, 12, 16, 24, 32, 48, 64`, do not use `20px` or `28px`. Stay on the scale.

4. **Read the rationale.** The philosophy section of a DESIGN.md explains what the design is trying to achieve. If it says "trust comes from restraint, never use more than 2 colors on a surface," that is a constraint you must apply to every component you build.

5. **Respect the dark/light split.** If the design documents dark mode and light mode tokens separately, apply them using CSS custom properties or Tailwind's dark: variant — not separate stylesheets.

## How to Use Motion Context

When a MOTION.md is in your context:

1. **Use the duration tokens.** `fast`, `default`, `slow` are named for a reason. Hover states use `fast`. Modal entrances use `default`. Page transitions use `slow`.

2. **Use the easing curves exactly.** `cubic-bezier(0.16, 1, 0.3, 1)` is not the same as `ease-out`. Copy the curve verbatim.

3. **Use spring configs for interactive elements.** If the motion system documents Framer Motion spring configs, use them for any element the user directly drags, taps, or interacts with. Use easing curves for state changes the user triggers but does not directly manipulate.

4. **Apply stagger patterns to lists.** If the motion system says list items stagger at 30ms, add `delay: index * 0.03` in Framer Motion or `animation-delay: calc(var(--i) * 30ms)` in CSS.

5. **Respect enter/exit patterns.** Elements should enter by fading in and moving toward their resting position (e.g., `translateY: 8px → 0`). They should exit by moving away (e.g., `translateY: 0 → -4px`). Never exit in the same direction you entered.

## MCP Tools Available

If the DesignMD MCP server is connected:

- `search_designs(query)` — find designs by brand name, aesthetic, or mood
- `get_design(slug)` — retrieve the full DESIGN.md for a brand
- `get_motion(slug)` — retrieve the full MOTION.md for a brand
- `get_full_system(slug)` — retrieve DESIGN.md + MOTION.md in one call
- `list_motion_systems()` — see which brands have motion systems
- `list_categories()` — browse by category
- `compare_designs(slug_a, slug_b)` — compare two brands side by side

## Common Workflows

**"Build a dashboard that looks like Linear"**
1. Call `get_full_system("linear.app")` or `get_design("linear.app")`
2. Apply the color tokens to your CSS variables or Tailwind config
3. Use the typography scale for all heading and body text
4. Apply motion tokens to any transitions or animations

**"I want a dark fintech look"**
1. Call `search_designs("dark fintech")` — returns Stripe, Brex, Plaid, etc.
2. Pick the one that matches the project's personality
3. Call `get_design(slug)` for the full system

**"Make this component animate like Vercel"**
1. Call `get_motion("vercel")` 
2. Apply the duration, easing, and enter/exit patterns to the component

## Rules for Applying Design Systems

- Never combine tokens from two different design systems in the same component. Pick one and stay consistent.
- When a design system documents "do not use X" (e.g., "never use more than one saturated color"), treat that as a hard constraint.
- When in doubt about spacing, round down to the next step on the scale.
- When in doubt about color, use the muted or neutral variant rather than the primary.
- Motion should be invisible when it works — if you notice the animation, it is probably too slow or too large.
