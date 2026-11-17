# Project: Digital Explorer Academy — Phase 2 / MVP Completion

## Architecture
Modular static web app (`index.html`, `css/styles.css`, `data/*.js`, `js/*.js`) bundled into a single-file offline HTML (`dist/digital_explorer_academy.html`) and `dist/index.html` via `scripts/build-bundle.js`. Tested via JSDOM in `tests/run-all-tests.js`.

## Feature Inventory
Every remaining Phase 2 / MVP feature from `ORIGINAL_REQUEST.md` and `PROJECT_HANDOFF.md`:
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Lesson 2.5 (Google Maps) | Family trip planning: directions (walk/transit/drive), Street View Pegman, fake vs real review detection (`w2-l5`, `maps-navigator`) | M1 | ORIGINAL_REQUEST / PROJECT_HANDOFF |
| 2 | World 4 Definition | `world-4` (`數位創作與程式入門` — Future World), purple theme `#7c3aed`, badge `數位創意大師勳章` | M1 | ORIGINAL_REQUEST / PROJECT_HANDOFF |
| 3 | Lesson 4.1 (Presentation Magic) | Google Slides / Canva basics for school reports (`w4-l1`, `slide-studio` interactive messy-slide rescue) | M1 | ORIGINAL_REQUEST / PROJECT_HANDOFF |
| 4 | Lesson 4.2 (Scratch Coding Playground) | Events, loops, conditions, variables + live catch-the-apple game (`w4-l2`, `scratch-blocks`) | M1 | ORIGINAL_REQUEST / PROJECT_HANDOFF |
| 5 | Lesson 4.3 (Audio & Visual Storytelling) | Combining AI story + AI image prompts + TTS audio narration (`w4-l3`, `story-studio`) | M1 | ORIGINAL_REQUEST / PROJECT_HANDOFF |
| 6 | 3D Island Map World 4 | Add Island 4 3D model, Chip 4, Chest 3, `w4Done/w4Total`, `travelToWorld` waypoints for `world-4`, update fallback text (`四個世界`) | M2 | Survey Explorer 2 |
| 7 | Dynamic Typing Drill Counts | Replace legacy hardcoded `19` drill counts in `js/app.js` with dynamic `totalDrills` (22) | M2 | Survey Explorer 2 |
| 8 | Expanded Test Suite & Build | Update `tests/run-all-tests.js` for 4 worlds, 18 lessons, 4 new simulators, dynamic certificate count; pass `npm run build && npm test` 100% | M3 | ORIGINAL_REQUEST / Survey Explorer 3 |
| 9 | Docs, Git Push & Drive Upload | Update `PROJECT_HANDOFF.md` & `README.md`, commit & push to `azreal564335/dea` `main` (excluding `.agents/`), update HTML/ZIP/HANDOFF on Google Drive | M3 | ORIGINAL_REQUEST / PROJECT_HANDOFF |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Curriculum & Interactive Labs | `data/curriculum.js`, `js/simulators.js`, `css/styles.css` (Lesson 2.5 + World 4 Lessons 4.1–4.3 + 4 simulators + CSS) | none | DONE |
| M2 | 3D Island Scene & UI Polish | `js/island-scene.js`, `js/app.js` (Island 4 3D model & routing + dynamic drill counts) | none | DONE |
| M3 | Tests, Build, Docs & Delivery | `tests/run-all-tests.js`, `PROJECT_HANDOFF.md`, `README.md`, `npm run build && npm test`, git push, Google Drive upload | M1, M2 | DONE |

## Interface Contracts
### `data/curriculum.js` ↔ `js/simulators.js`
- `w2-l5` uses `simulator.type = 'maps-navigator'`
- `w4-l1` uses `simulator.type = 'slide-studio'`
- `w4-l2` uses `simulator.type = 'scratch-blocks'`
- `w4-l3` uses `simulator.type = 'story-studio'`
- `Simulators.render(simConfig, containerId)` dispatches all 4 types.

### `data/curriculum.js` ↔ `js/island-scene.js`
- `world-1`, `world-2`, `world-3`, `world-4` IDs match `IslandScene.travelToWorld(worldId, scrollToSection)`.
- `w1Total`..`w4Total` read dynamically from `window.CURRICULUM_LESSONS`.

## Code Layout
- `data/curriculum.js` — World & Lesson definitions (M1)
- `js/simulators.js` — Interactive lab simulators (M1)
- `css/styles.css` — Styling for worlds, chips, and simulators (M1)
- `js/island-scene.js` — Three.js 3D floating island map (M2)
- `js/app.js` — Main app state, navigation, Dojo header, certificate (M2)
- `tests/run-all-tests.js` — Automated JSDOM test suite (M3)
- `PROJECT_HANDOFF.md`, `README.md` — Documentation (M3)
