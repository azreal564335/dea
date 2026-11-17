## 2026-11-13T05:51:24Z
You are the M1 Worker (Curriculum & Interactive Labs).
Your working directory is: /home/antigravity/digital-explorer-academy/.agents/teamwork/teamwork_preview_worker_m1

MANDATORY: First read `/home/antigravity/digital-explorer-academy/.agents/teamwork/ORIGINAL_REQUEST.md`, `/home/antigravity/digital-explorer-academy/PROJECT.md`, and `/home/antigravity/digital-explorer-academy/.agents/teamwork/teamwork_preview_explorer_survey_1/handoff.md`.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

EXCLUSIVE FILE OWNERSHIP (do NOT modify any other files):
- `/home/antigravity/digital-explorer-academy/data/curriculum.js`
- `/home/antigravity/digital-explorer-academy/js/simulators.js`
- `/home/antigravity/digital-explorer-academy/css/styles.css`

Your tasks:
1. In `data/curriculum.js`:
   - Add `world-4` (`數位創作與程式入門` / `Digital Creativity & Coding Playground`, themeColor `#7c3aed`, icon `🚀`, badgeName `數位創意大師勳章`) to `window.CURRICULUM_WORLDS`.
   - Add Lesson `w2-l5` (`2.5` — Google Maps for Family Trips: directions, Street View, checking reviews) to `window.CURRICULUM_LESSONS`, right after `w2-l4`, with `simulator: { type: 'maps-navigator', ... }`, rich Traditional Chinese + EN vocab, learning cards, and quiz.
   - Add Lessons `w4-l1` (Presentation Magic: Google Slides / Canva basics for school reports, `simulator: { type: 'slide-studio', ... }`), `w4-l2` (Scratch Coding Playground: events, loops, conditions, variables, catch-the-apple game, `simulator: { type: 'scratch-blocks', ... }`), and `w4-l3` (Audio & Visual Storytelling: combining AI story + AI image prompts, `simulator: { type: 'story-studio', ... }`) to `window.CURRICULUM_LESSONS`.
2. In `js/simulators.js`:
   - Register and implement 4 genuinely interactive, kid-friendly simulators (ages 8 & 10, Traditional Chinese + EN):
     - `maps-navigator`: Interactive Google Maps family trip simulator with Directions (walk/transit/drive comparison), Street View Pegman 360° preview, and Review Detective (spotting fake 5-star reviews vs real detailed reviews).
     - `slide-studio`: Interactive Messy Slide Rescue (apply Rule of 3 bullet points, fix contrast/theme, add hero visual & caption, preview in Slideshow mode).
     - `scratch-blocks`: Interactive Scratch block-snapping bench + live playable HTML5 2D Canvas Catch-the-Apple game (snap Event, Loop, and Collision/Score blocks, then play with mouse/arrow keys or buttons, score counter, win/celebration state). Keep JSDOM-safe (guard `getContext('2d')` cleanly if canvas context is null in headless JSDOM).
     - `story-studio`: 3-Scene AI Audio & Visual Storytelling Studio (choose hero, companion, setting, plot twist; generates 3 storyboard scenes combining AI story text + 5-ingredient AI image prompt; supports Web Speech API `AppState.speakEnglish` / `speechSynthesis` narration with safe fallback).
3. In `css/styles.css`:
   - Add `--w4-color: #7c3aed;` and `--w4-light: #ede9fe;` and `.island-quick-chip.w4 { color: #7c3aed; }`.
   - Add clean, kid-friendly styles for the 4 new simulators.
4. Mandatory checks:
   - Ensure ZERO hardware brand names (`ASUS` / `華碩`). Always use generic `Windows 11 筆電` if mentioning a laptop.
   - Run `npm run build` and `node -e "global.window={}; require('./data/curriculum.js'); console.log(window.CURRICULUM_WORLDS.length, window.CURRICULUM_LESSONS.length)"` to verify syntax and bundle build succeed.
5. Write your complete handoff report (including build/command outputs) to `/home/antigravity/digital-explorer-academy/.agents/teamwork/teamwork_preview_worker_m1/handoff.md` and send a concise summary via `send_message` to `a8df60e8f027b775b7b708930ce5f68f`.
