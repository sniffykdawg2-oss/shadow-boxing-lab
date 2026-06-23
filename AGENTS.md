# Shadow Boxing Lab Agent Notes

## Project Summary

Shadow Boxing Lab is a local-first, static Three.js boxing reaction trainer. It runs in the browser through Vite and is intended for real-life shadowboxing practice, not webcam/body-tracking scoring.

## Common Commands

- Install dependencies: `npm install`
- Run locally: `npm run dev`
- Build: `npm run build`
- Smoke test: `npm run test:smoke`

The dev server is configured for `127.0.0.1`; Playwright expects `http://127.0.0.1:5173`.

## Architecture Map

- `index.html` contains the game shell, HUD, overlays, and settings controls.
- `main.js` owns the animation loop, round lifecycle, pause/resume, countdown, and stats.
- `scene.js` owns Three.js renderer setup, camera movement, shake, and environment loading.
- `environments.js` defines primitive-built rooms.
- `cues.js` owns cue definitions, timing windows, combo generation, and input resolution.
- `playerGloves.js` handles first-person glove visuals and punch/defense animations.
- `settings.js` contains central settings, presets, intensity profiles, and normalization.
- `ui.js` reads settings, updates HUD/overlays, and renders summaries.
- `audio.js` generates browser tones for cues, hits, misses, and bells.

## Important Notes

- Keep this cheap and static. There is no backend, account system, database, multiplayer, webcam, or body tracking.
- GitHub Pages support depends on `vite.config.js` using `base: "./"`.
- When adding drills, keep values coordinated across `cues.js`, `index.html`, and `ui.js`.
- When adding environments, add the builder in `environments.js`, the key in `settings.js`, and the option in `index.html`.
- For frontend changes, test the rendered app in the browser. This is a visual/gameplay project, so build success alone is not enough.
- Phone layouts need explicit HUD safe zones. The stat strip, coach cue, and pause button are absolutely positioned during gameplay, so mobile CSS changes should be checked at both tall-phone and short-phone viewports.
- `audioCueMode` uses browser speech synthesis to call full combos aloud. `realisticGloves` switches 3D cues from labeled arcade objects to focus mitts and incoming gloves while leaving the underlying combo logic unchanged.
