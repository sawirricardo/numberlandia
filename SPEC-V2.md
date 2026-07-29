# Numberlandia v2 — 3D Island Rescue

Remake of v1 (index.html) as a three.js hybrid: 3D island hub world + story +
sequential unlocks. The question mechanics, generators, number helpers, and
juice from v1 are PROVEN — reuse them as DOM overlays on top of the canvas.
Do not rebuild question UI in 3D.

## Files

- `index.html` — rewrite in place (v1 is in git? no — copy v1 to `v1.html`
  first so nothing is lost).
- `vendor/three.min.js` — already downloaded (r128 UMD, classic script tag).
  MUST use this local file; no CDN, no ES modules (file:// blocks module
  imports in Chrome). Everything must work by double-clicking index.html
  offline.
- `test.js` — keep passing unchanged (same core functions, same script
  id="core" block so extraction still works). Run it before finishing.

## Story

The Number Goblin has caged 5 animals across the floating islands of
Numberlandia. Clear each island's challenge to smash the cage and rescue its
animal. Rescued animals live free on your home island.

Animals (emoji-sprite billboards, always facing camera, bobbing):
- W1 Number Reader → 🐰 Bibi the Bunny
- W2 Place Value Machine → 🐢 Toto the Turtle
- W3 Compare & Order → 🐧 Pipo the Penguin
- W4 Pattern Detective → 🦊 Kiki the Fox
- Boss → 🦉 Momo the Owl (the goblin 👺 guards this one personally)

## Progression (sequential — this replaces v1's all-open home)

- Only World 1 unlocked at start. Finishing world N with ≥1 star unlocks N+1.
- Boss island unlocks after all 4 worlds cleared.
- Locked islands: darker, chained cage visible, padlock sprite; tapping one
  shakes it + shows "Clear <previous island> first!".
- Keep stars (replay for 3), trophy, mute, reset, localStorage key
  `numberlandia` (add a `v:2` field; migrate old saves by keeping stars but
  enforcing sequential lock = world N unlocked if N==1 or stars[N-1]>0).

## 3D hub (the centerpiece)

- Low-poly archipelago: 5 small islands (cone/cylinder/icosahedron
  primitives, flat-shaded MeshLambert/Phong), gently bobbing on an animated
  ocean plane (simple vertex sine waves), gradient sky, soft fog, floating
  clouds (white low-poly blobs), stars/sun. Each island tinted its world's
  accent color, with the animal's cage (bar cylinders) on top.
- Idle camera slowly orbits the archipelago. Tap/click an island (raycaster)
  → camera flies to it (smooth ease, ~1.2s) → DOM panel slides up with world
  name, stars, animal intro line, PLAY button.
- Home island in the center: rescued animals wander/hop on it, goblin 👺
  lurks on the boss island until defeated.
- HUD overlay (DOM): title, star total, mute. All question play happens in
  the existing v1 DOM screens over a dimmed canvas.

## WOW moments (the point of v2 — do not skimp)

1. **Intro (first launch only, skippable by tap):** camera swoops from high
   clouds down across all islands, goblin cackle text bubbles, "5 friends
   are trapped… can you save them?" Then lands on World 1.
2. **RESCUE CUTSCENE (the big one, on first clearing a world):** camera
   flies to the island → cage bars burst into a particle explosion
   (30–80 colored particles, gravity, fade) → animal sprite springs out,
   bounces, grows, hearts 💕 particles → fireworks (3–4 bursts) → banner
   "You rescued Bibi the Bunny!" with fanfare beeps → animal hops across the
   water to the home island. ~5s, tap to skip.
3. **Boss defeat finale:** sky animates dusk→sunrise, goblin shrinks and
   flees 💨, ALL rescued animals gather on home island jumping, big
   confetti + fireworks, trophy banner "Number Master!".
- Replays of already-cleared worlds skip cutscenes (short sparkle only).

## Performance & mobile

- renderer.setPixelRatio(min(devicePixelRatio,2)), no shadows, fog hides
  distance, keep it <30 draw calls. Must stay smooth on a mid-range tablet.
- Handle resize + orientation change. Touch and mouse both work.
- prefers-reduced-motion: skip camera flights (cut instantly), skip particle
  storms, keep the game fully playable.
- WebGL unavailable → fall back to v1-style flat home screen (keep it
  simple: message + world buttons; reuse existing renderHome).

## Keep from v1 (verbatim where possible)

- All generators, judge/teach loop, streak, cheers, confetti, WebAudio
  beeps, number pad, tiles, compare timer, order slots, pattern line,
  results screen, Indonesian dot formatting, British words style.

## Verify before finishing

- `node test.js` passes (all 27 checks).
- Headless Chrome --dump-dom loads index.html with no page JS errors (canvas
  won't render in dump-dom but boot must not throw; guard WebGL init).
- Report files changed + test output + anything simplified.
