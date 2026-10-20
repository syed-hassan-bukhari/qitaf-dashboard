# Qitaf branding + HR/IT chart

Read CLAUDE.md first. Keep the current layout, pages, metrics and privacy rules.
This is a visual update only. Commit before you start (`git commit -am "Before branding"`).

The four logo files are in this folder. Copy them to `public/brand/`:
- `qitaf-logo-main-white.svg`  (stacked "qitaf / from stc", white) → dark theme
- `qitaf-logo-main-purple.svg` (stacked, purple)                   → light theme
- `qitaf-logo-secondary-white.svg` / `-purple.svg` (bilingual "qitaf قطاف / from stc")

## 1. Logo (Qitaf guidelines, section 01.1)

- Header, top left: replace the current square brand mark with the **main** logo
  (white on the dark theme, purple on the light theme). Keep "Insights" and the role label
  as small text to the right of the logo, separated by a thin divider.
- Login card: the **secondary** (bilingual) logo above "Sign in", centred.
- Rules from the guidelines:
  - Never recolour, stretch, rotate, add effects, outlines or put the logo inside a shape.
    Use the SVG files exactly as provided.
  - Minimum height **50px** on screen.
  - Clear space around the logo at least the height of the letter "a" in "qitaf"
    (about 25% of the logo height). Nothing may touch that area.
  - On phones keep 50px height; hide "Insights" text if space is short, never shrink the logo.
- Add `alt="qitaf from stc"`.

## 2. Brand colours (guidelines section 01.2)

Primary: air `#FFFFFF`, purple `#4F008C`, coral `#FF375E` (accent only).
Secondary: silver `#8E9AA0`, light silver `#DDDFE2`, moon light `#A54EE1`,
dark purple `#3A1066`, light purple `#7333A3`, onyx `#1D252D`.
Tertiary (charts only): sun light `#FFDD40`, sunset light `#FF6A39`,
oasis light `#00C48C`, sea light `#1DCED8` (plus 50% and 20% tints).

Replace the current teal/navy tokens. The whole UI should feel like it belongs with the
purple logo: same layout and components, only the colour system changes.

Dark theme (deep purple, built from dark purple #3A1066 and onyx)
```
--bg: #120A1F          page background (very dark purple)
--panel: #1C1230       cards
--panel-2: #251940     inner blocks, table rows, inputs
--line: #34264F        borders and gridlines
--text: #FFFFFF
--muted: #C9C0D8       secondary text (check AA on --panel)
--accent: #A54EE1      moon light: active nav, primary button, focus ring, CSAT ring
--accent-ink: #FFFFFF
--brand: #4F008C       purple: header strip, selected states, chart highest shade
--alert: #FF375E       coral: overdue, review queue only
```
Extra touches (subtle, keep it professional):
- Header: a thin bottom border in `--brand`, or a very soft gradient from `#1C1230` to `#2A0F4A`.
- Hero KPI card (CSAT ring): soft radial glow of `--accent` at 8–10% opacity behind the ring.
- Cards: 1px `--line` border, no heavy shadows; on hover a 1px `--accent` border at 40% opacity.
- Keep plenty of empty space; the purple should come from accents, not from filling every card.
Light theme (the guidelines prefer purple on white)
```
--bg: #F6F6F8   --panel: #FFFFFF   --panel-2: #F1F2F4   --line: #DDDFE2 (light silver)
--text: #1D252D (onyx)   --muted: #5F6A70   --accent: #4F008C (purple)   --accent-ink: #FFFFFF
--brand: #4F008C   --alert: #FF375E
```
- Active nav item, primary buttons, focus ring: `--accent`.
- "Fictional demo data" badge: sun light `#FFDD40` with onyx text.
- Status chips: Reportable/Submitted → oasis light tint; Hidden/Not submitted → sun light tint;
  Overdue → coral tint; Not applicable → silver tint. Text must pass WCAG AA on each.
- Coral only for alerts (overdue, review queue). Never as a decorative colour.

**Score scale (keep neutral, approved by Amer):** replace the blue-teal scale with a
single purple scale, light purple → purple → dark purple (darker = higher),
always showing the number. Check text contrast on every shade.

Funnel bars: silver → light purple → purple. CSAT ring: moon light on the dark theme,
purple on the light theme.

## 3. Font (guidelines section 01.3)

The brand font is **STC Forward** (Latin and Arabic). It's licensed, so it is NOT on Google Fonts.
- Add `@font-face` rules that load `public/fonts/STCForward-{Light,Regular,Medium}.woff2`
  if those files exist; otherwise fall back to the current Sora.
- Use Regular and Medium for headings and KPI numbers, Light/Regular for body.
  The guidelines say to avoid Bold/ExtraBold for headlines, so cap headings at weight 500–600.
- Do not download STC Forward from any third-party site.

## 4. HR and IT assessment as a chart

Keep the status chips (HR / IT / Finance) at the top of the section.
Replace the tile grid with a **horizontal bar chart**, grouped:
- Group headings "HR assessment" and "IT assessment".
- One row per scored item (label left, bar on a fixed 1–5 axis, value "4 / 5" at the end).
  Axis ticks 1–5, light gridlines. Same purple scale as the other scores.
- Keep the original question order inside each group.
- Below the chart, show the categorical answers as small labelled pills in two columns
  (HR | IT), e.g. "Admin time: Somewhat less time", "Technical issues: None",
  instead of the plain text block.
- Note under the chart: "Answers from one authorised HR and one IT respondent."
- Tooltip/popover per bar with the full question.
- Animate bars on load (respect `prefers-reduced-motion`).
- Responsive: on phones labels sit above each bar; no horizontal page scroll.
- If HR or IT is not submitted, show that group as an empty state, not zero bars.

## 5. Finish

`npm run build`, `npm run test:access`, and check all three logins on laptop and phone,
in both themes. Send screenshots of: header with logo, company page HR/IT chart, portfolio heatmap.
