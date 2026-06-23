# Shadow Boxing Lab

A local-only first-person boxing reaction trainer built with HTML, CSS, JavaScript, and Three.js. It is a visual coach for real-life shadowboxing practice. There is no device input scoring, webcam, body tracking, account system, backend, database, or multiplayer.

## File Structure

- `index.html` - game shell, HUD, start screen, pause menu, end summary, and settings controls.
- `style.css` - full-screen visual styling and responsive UI.
- `main.js` - requestAnimationFrame loop, round flow, practice stats, pause, and countdown.
- `scene.js` - Three.js renderer, camera bob, screen shake, and environment loading.
- `environments.js` - primitive-built gym, living room, backyard, and garage scenes.
- `cues.js` - cue models, timing windows, combo generation, and input resolution.
- `playerGloves.js` - first-person gloves and punch/defense animations.
- `settings.js` - central `gameSettings`, presets, intensity profiles, and normalization.
- `ui.js` - settings reads, HUD updates, overlay screens, and summaries.
- `audio.js` - small browser-generated tones for bell, hits, misses, and cues.

## Setup

```bash
npm install
npm run dev
```

Open the localhost URL printed by Vite, usually `http://127.0.0.1:5173/`.

## GitHub Pages

This repo includes a GitHub Actions workflow at `.github/workflows/deploy.yml`. After you push the project to GitHub, enable Pages with GitHub Actions as the source. Every push to `main` will build the static game and publish the `dist` output.

The Vite config uses relative asset paths, so the game works from a GitHub Pages repo URL like `https://YOUR_USER.github.io/YOUR_REPO/`.

## Controls

- Use the on-screen buttons to start, pause, resume, replay, or change rooms.
- Follow the coach calls, pads, incoming punches, bars, and glove demonstrations with real-life shadowboxing.
- Defensive cues include straight blocks, side head/body blocks, slips, ducks, and left/right rolls under angled bars.

## Adding Drills

Add or tune move definitions in `MOVES` inside `cues.js`. To add a new focus style, extend the `focusTemplates` and `nextPadworkFragment` logic, then add the option in `index.html` and keep the value consistent with `ui.js`.

## Adding Environments

Create a new builder function in `environments.js`, add its key to `ENVIRONMENTS` in `settings.js`, and add the matching option to the environment dropdown in `index.html`. Environments are plain Three.js primitives, so props can be copied from the existing room helpers.

## Training Settings

The start screen settings are read into the central `gameSettings` object, normalized before each round, and used directly by the combo generator and cue scheduler. Manual slider/number changes switch their preset to Custom automatically. Cue speed, rhythm, telegraph time, defensive frequency, body frequency, rest timing, intensity, training focus, and coach glove demo all affect gameplay.

Use `Offense Mode` and `Defense Mode` to filter the workout. Offense-only shows pad targets without defensive cues. Defense-only shows blocks, slips, ducks, rolls, and side punches without offensive pad targets. At least one mode stays enabled.
