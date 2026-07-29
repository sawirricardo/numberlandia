# Numberlandia — SPEC

Gamified version of a Grade 4 math handout: "Numbers to 100,000" (counting,
place value, comparing/ordering, number patterns). Audience: 9–10 year olds
on tablets/phones. Must be visually interesting and engaging — playful,
colorful, animated. Not a plain quiz form.

## Deliverable

- ONE self-contained file: `index.html` in this directory. No build step, no
  external CDN/fonts/images (must work offline, file:// double-click).
- Inline CSS + vanilla JS. Emoji for icons/mascots. CSS animations for juice.
- Touch-first: big tap targets (min 48px), works on phone portrait and
  desktop. No horizontal page scroll.

## Number formatting (critical)

Indonesian/school convention throughout: dot as thousands separator —
`12.830`, `100.000`. Never commas. Words in British English style:
"sixty-one thousand, four hundred and five" (comma after thousands, "and"
before tens/ones).

## Game structure

Home screen: title, mascot, 4 world buttons + locked boss round. Stars earned
per world shown on buttons. Progress persists in localStorage
(key `numberlandia`).

Each world = 10 questions, randomly GENERATED (never a fixed bank). After
each world: results screen with stars (3 = ≥9 correct, 2 = ≥7, 1 = ≥5),
"play again" and "home" buttons.

### World 1 — Number Reader
Alternate two modes:
- Words shown ("thirty-three thousand, two hundred and sixty") → type the
  numeral on a big on-screen number pad (digits 0-9, backspace, OK). Input
  display auto-formats with dot separators as they type.
- Numeral shown (`57.118`) → build the words by tapping word tiles in order
  from a shuffled tray (include 2–3 distractor tiles, e.g. "twelve" vs
  "twenty"). Tapping a placed tile returns it to the tray.

### World 2 — Place Value Machine
- Big number displayed as 5 colored digit cards labeled TTh/Th/H/T/O.
- Question types, mixed: "What is the value of the digit 6?" (4 choices:
  same digit at different place values — 6 / 600 / 6.000 / 60.000),
  "Which digit is in the thousands place?", "36.598 = 30.000 + ___ + 500 +
  90 + 8" style expanded-form gap.

### World 3 — Compare & Order
- Rounds 1–6: two numbers side by side, tap `<` `>` `=` buttons, 6-second
  animated timer bar. Difficulty escalates: 3-digit → 5-digit with near-miss
  pairs (only one digit differs, e.g. 88.694 vs 87.694). Timeout = wrong.
- Rounds 7–10: 5 numbers, tap them in order greatest→smallest (or
  smallest→greatest, stated per round). Tapped numbers fly into ordered
  slots; tap a slot to undo. No timer.

### World 4 — Pattern Detective
- Horizontal number line (SVG or flex) with 6 ticks, 1–2 boxed gaps. Step is
  ±100 / ±500 / ±1000 / ±2500. Early rounds show the step arrow label
  ("+1000"); later rounds hide it. Answer via the same number pad.

### Boss Round (locked until every world has ≥1 star)
10 mixed questions drawn from all four mechanics, slightly harder. Finishing
awards a trophy on the home screen.

## Feedback & juice (this is the point — don't skimp)

- Correct: green flash, confetti burst (CSS/JS particles), short cheer text
  ("Keren!" / "Nice!"), satisfying pop animation on the answer.
- Wrong: gentle shake, NO score penalty, then a teaching card: show the
  correct answer with the place-value chart highlighted (the relevant digit
  column lit up) before the next question. Never skip the teaching card.
- Streak: counter with flame emoji; at 5+ streak questions award +bonus and
  extra confetti. Wrong answer resets streak only.
- Progress bar of 10 questions always visible during play.
- Sound: tiny WebAudio beeps for correct/wrong (no audio files), with a
  mute toggle persisted in localStorage.
- Animated gradient or floating-shapes background; each world has its own
  accent color. Buttons have press states. Use CSS transitions everywhere
  state changes; respect prefers-reduced-motion.

## Correctness requirements

- One shared numberToWords(n) and formatID(n) (dot separators) used
  everywhere; wordsToNumber only if needed by tile checking (tiles can be
  checked by comparing tile sequence to generated correct sequence).
- Generators must never produce ambiguous or out-of-range numbers
  (range 100–99.999 depending on round; no leading zeros).
- Distractors must be plausible (same digits, swapped places) not random.

## Verify before finishing

- Write `test.html` OR a small node-runnable `test.js` asserting
  numberToWords + formatID against at least these: 90000 "ninety thousand",
  61400 "sixty-one thousand and four hundred" (accept with/without comma),
  6805, 33260, 7206, 12830, 57118, 30065, 36598. Run it (node) and show
  passing output.
- Open index.html check: no console errors on load (use `node --check` on
  extracted JS or at minimum ensure the file parses; if a headless browser
  is unavailable, state that manual open is needed).

## Non-goals

- No backend, no accounts, no i18n framework (English UI; a few Indonesian
  cheer words are fine), no frameworks, no npm deps, no build tooling.

## Output

Report: files created, test output, and anything intentionally simplified.
