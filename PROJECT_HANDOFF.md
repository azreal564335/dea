# 🚀 數位小探險家學院 (Digital Explorer Academy) — Agent Master Handoff & Project Tracker

> [!IMPORTANT]
> **TO EVERY AI AGENT PICKING UP THIS PROJECT:**
> 1. **Read this entire file first** before making any changes.
> 2. **Follow the Checkpoint-First Rule:** Update the **Current Status** and **Changelog** sections of this file *immediately after completing each milestone* (and always before ending your turn or if running low on context/quota). Never wait until the very end to update status!
> 3. **Re-upload updated artifacts** to Google Drive (`G-Agent-folder`) whenever you modify code or docs, and run `npm run build && npm test` to verify 100% pass rate before shipping.

---

## 1. 🎯 Project Identity & Core Constraints

* **Project Name:** 數位小探險家學院 (Digital Explorer Academy)
* **Target Learners:** Two kids, **ages 8 and 10**, each with their own **Windows 11 laptop**.
* **Language & Localization:**
  * Primary UI & instructions: **Traditional Chinese (繁體中文 / Taiwan)**.
  * Bilingual support: Essential **English tech/internet/AI vocabulary** (`Click`, `Tab`, `Prompt`, `Scroll`, etc.) with Web Speech API pronunciation (`🔊 發音`) and a toggleable `中+EN` helper mode.
  * Typing Input Method: **English Touch-Typing + Microsoft Bopomofo (微軟注音 / Zhuyin)** with `Shift` / `Win + Space` language switching.
* **Important Brand Rule:** **Do NOT include any laptop hardware brand names** (e.g., no `ASUS` or `華碩`). Keep all laptop instructions generic to **Windows 11** laptops.
* **Hosting & Delivery:**
  * **Offline Single-File Mode:** `digital_explorer_academy.html` (100% self-contained, zero external dependencies required at runtime, works in sandboxed iframes and offline browsers).
  * **Online Free Hosting Mode:** Modular static site ready for **GitHub + Vercel / Cloudflare Pages**.

---

## 2. 📂 Google Drive Folder Structure (`G-Agent-folder`)

* **Root Folder (`G-Agent-folder`):** `1j3Vyy8QhwHEW2fev9I-3VLKwY8lJzjlx`
  * Link: https://drive.google.com/drive/folders/1j3Vyy8QhwHEW2fev9I-3VLKwY8lJzjlx

| Subfolder / File | Google Drive ID | Purpose |
| :--- | :--- | :--- |
| **`PROJECT_HANDOFF.md`** | *(Root of G-Agent-folder)* | This master tracker. Read first, update at every milestone! |
| **`01_Kids_App_Latest/`** | `1Xhiusxzcl8K0jTSN8ZWrqlOOkCISqg3-` | Always holds the latest `digital_explorer_academy.html` for kids to download & double-click. |
| ↳ `digital_explorer_academy.html` | `1Fmy0eDXyoFilQ70nkaLi3fFWztbP5DPh` | Current latest standalone HTML app. |
| **`02_Source_Code_&_Releases/`** | `1Oc6w0cT3MBSwUNgxrr8hbvets6INrETB` | Holds the latest full modular source `.zip` (`digital-explorer-academy.zip`) & changelogs. |
| ↳ `digital-explorer-academy.zip` | `1eyUYme8tCAwytYePqqrwU8X0p-HTIadm` | Full project repo archive (code, `data/`, `scripts/`, `tests/`). |
| **`03_Lesson_Modules_&_Ideas/`** | `1IkZ-5RcNXY-W9fF6puSkHa7a_YD0Atg3` | Parent's lesson ideas, drafts, and future World expansions (`World_1`..`World_4`). |
| **`04_Parent_Guides_&_Checklists/`** | `1vqdEsUzcObUFaf2T7XXOR4r-ULkv7ByH` | `Curriculum_Plan_&_Parent_Guide.md` & Windows 11 parent setup checklists. |
| **`05_Kids_Work_&_Certificates/`** | `1YHZClEFVO0mf8vC11yB5yG7nVVsocHHc` | `10yo_Explorer/` & `8yo_Explorer/` folders for saving kids' certificates & creations. |

---

## 3. 🧩 Codebase Architecture (Modular & Easy to Extend)

```text
digital-explorer-academy/
├── index.html               # Modular entry point (for GitHub / Vercel / Cloudflare Pages)
├── vercel.json              # Zero-config static deployment config
├── package.json             # `npm run build` and `npm test` scripts
├── PROJECT_HANDOFF.md       # Copy of this master handoff file inside the repo
├── README.md                # Free hosting & curriculum expansion guide
├── css/styles.css           # Kid-friendly UI, modal/toast styles & Taiwan Zhuyin keyboard CSS
├── data/
│   ├── typing-drills.js     # ⭐ Add new typing stages/drills here
│   └── curriculum.js        # ⭐ Add new Worlds & Lessons here
├── js/
│   ├── ui-modal.js          # Custom in-page Modal & Toast (replaces blocked alert/prompt/confirm)
│   ├── typing-dojo.js       # Non-destructive DOM + IME-safe Typing Dojo engine
│   ├── simulators.js        # Interactive labs (Win11, Shortcuts, Browser, Search, Scam, AI Studios)
│   └── app.js               # Multi-kid profiles, World Map, Vocab audio, Certificate, Parent Guide
├── scripts/build-bundle.js  # Bundles everything into standalone `digital_explorer_academy.html`
└── tests/run-all-tests.js   # Automated JSDOM test suite (378 assertions)
```

---

## 4. 🗺️ Implementation Plan & Roadmap

### ✅ Phase 1: Core Platform & Worlds 1–3 (COMPLETED)
- [x] **World 1 (`筆電小達人` — 4 Lessons):** Laptop Care & Power, Touchpad & Windows 11 Controls, 19-Stage Touch Typing Dojo (Home Row `fff jjj` / `as asd`, Top Row, Bottom Row `aaa bbb ccc...zzz`, Zhuyin layout & 5 tones, `Shift` 中/英 switching), Folders & `Ctrl+C/V/Z/S`.
- [x] **World 2 (`網路探險家` — 4 Lessons):** Browser Cockpit (Tabs, URL, Bookmarks), Search Detective (Golden Keyword Formula for local food & school research + spotting "贊助/Ad"), Online Safety & Anti-Scam Shield, Netiquette & 20-20-20 Eye Rule.
- [x] **World 3 (`AI 魔法師` — 6 Lessons):** What AI Is & Hallucinations, 4-Part Prompt Formula + English Buddy, **Ask AI to Teach Any Skill Step-by-Step**, **5-Ingredient AI Image Prompt Studio**, Homework Ethics (Coach Not Cheater), AI Fact-Checking & Privacy.
- [x] **Platform Features:** Dual kid profiles (`kid-10`, `kid-8`) with working in-page Rename (`✏️ 改名`), Export/Import progress codes, custom `UIModal` (iframe-safe), IME-safe Typing Dojo, Graduation Certificate, and 378-assertion automated test suite.
- [x] **Google Drive Workspace:** `G-Agent-folder` structured with `01`–`05` subfolders and `PROJECT_HANDOFF.md`.

### ✅ Phase 2: MVP Completion (COMPLETED)
- [x] **More Typing Drills (`data/typing-drills.js`):** Added Stage 6 (`phase2-stories`) with Number Row drill (`nr-1`), Everyday English conversation (`en-1`), and Zhuyin short-story typing (`zy-5`), bringing total drills to 22.
- [x] **World 2 Expansion:** Lesson `2.5` — *Using Google Maps for Family Trips* (directions, Street View, checking reviews) with `maps-navigator` simulator.
- [x] **World 4 (`數位創作與程式入門` — Future World):**
  - [x] Lesson `4.1` — *Presentation Magic* (Google Slides / Canva basics for school reports) with `slide-studio` messy slide rescue.
  - [x] Lesson `4.2` — *Scratch Coding Playground* (events, loops, making a simple catch-the-apple game) with `scratch-blocks` simulator.
  - [x] Lesson `4.3` — *Audio & Visual Storytelling* (combining AI story + AI image prompts + TTS) with `story-studio` simulator.
- [x] **Live Cloud Deployment (GitHub Repo Ready):** Pushed clean modular codebase to `https://github.com/azreal564335/dea` (`main` branch), ready to connect to Vercel or Cloudflare Pages.

### ✅ Phase 3: World 5 — Roblox 3D 遊戲工坊 (COMPLETED)
- [x] **Lesson `5.1` (`w5-l1`):** *Roblox Studio Basics* (`roblox-studio-basics` interactive workbench: 3D Viewport camera, Explorer, Properties, Move/Scale/Rotate, and `Anchored` gravity playtest).
- [x] **Lesson `5.2` (`w5-l2`):** *Obby Stage Builder* (`roblox-obby-builder` grid editor + live HTML5 Canvas playtester with SpawnLocation, Lava KillBrick, Moving Platforms, Checkpoints, and Goal).
- [x] **Lesson `5.3` (`w5-l3`):** *Luau Scripting Lab* (`roblox-lua-lab` block-assembly Luau script lab for Coins, Speed Pad, Bounce Pad, and Auto Door with `Touched` events and `Humanoid`).
- [x] **Lesson `5.4` (`w5-l4`):** *Multi-Genre Game Architect & Safe Publishing* (`roblox-game-architect` simulator covering Tycoon, Simulator, Racing, and Hide & Seek game loops + Toolbox & Privacy checklist).

### ✅ Phase 4: World 6 — 熱門 Roblox 地圖拆解 (COMPLETED)
- [x] **Lesson `6.1` (`w6-l1`):** *Natural Disaster Survival & Timed Obby* (`roblox-disaster-lab` simulator: Lobby, Teleport, Random Event, dynamic `Anchored` physics).
- [x] **Lesson `6.2` (`w6-l2`):** *Grow a Garden & Collection Simulators* (`roblox-garden-sim` simulator: Plant, Water, `[E] ProximityPrompt` harvest, Coin upgrades).
- [x] **Lesson `6.3` (`w6-l3`):** *Brookhaven RP & Dress to Impress* (`roblox-rp-stage` simulator: `ClickDetector` doors/lamps, theme draw, outfit & runway voting).
- [x] **Lesson `6.4` (`w6-l4`):** *Build a Boat for Treasure* (`roblox-boat-builder` simulator: `WeldConstraint` + `Unanchored` + `VehicleSeat` physics vessel).

---

## 5. 📊 Current Status & Changelog

* **Last Updated:** 2026-11-16
* **Latest Build Status:** ✅ `npm run build` succeeded (`dist/digital_explorer_academy.html`) | ✅ `npm test` **597 / 597 PASS (100%)**
* **GitHub Repository:** https://github.com/azreal564335/dea (`main` branch)
* **Recent Changes:**
  * **Annotated Screenshot-Style UI Location Guides (World 5 & World 6):**
    * Added `renderCardVisual(visualType)` in `js/app.js` and `.slide-visual-diagram` styling in `css/styles.css` rendering 11 self-contained annotated SVG UI mockups with numbered callout badges (`① ② ③ ④`) and bilingual captions inside `data/curriculum.js` lesson cards (`w5-l1`..`w5-l4`, `w6-l1`..`w6-l4`).
    * Covers Roblox Studio 3D Viewport & `F` focus, `Home` Ribbon (`Part`/`Move`/`Scale`/`Rotate`), `Explorer` + `Properties` `Anchored ✅`, `Obby` parts & `Toolbox` Checkpoints, `Explorer` `+` ➔ `Script` & `Debounce`, `File` ➔ `Publish to Roblox` ➔ `Private`/`Friends`, `Lobby`/Unanchor, `ProximityPrompt`, `ClickDetector`, and `Model` ➔ `Create` ➔ `Weld` + `VehicleSeat`.
    * Expanded `tests/run-all-tests.js` to **597 assertions (100% pass)**.
  * **World 6 Launch (`熱門 Roblox 地圖拆解` — 6 Worlds, 26 Lessons, 22 Typing Drills):**
    * Deconstructed top kid-friendly Roblox hits (*Natural Disaster Survival*, *Grow a Garden* / *Bee Swarm Simulator*, *Brookhaven RP* / *Dress to Impress*, *Build a Boat for Treasure*) into 4 bite-sized lessons (`w6-l1`..`w6-l4`) with 4 interactive simulators.
    * Added Island 6 (`world-6`) to `js/island-scene.js` with 5th treasure chest, quick-jump chip, and 6-world `travelToWorld` routing.
    * Expanded `tests/run-all-tests.js` to **565 assertions (100% pass)**.
  * **World 5 Launch (`Roblox 3D 遊戲工坊` — 5 Worlds, 22 Lessons, 22 Typing Drills):**
    * Added Lesson 5.1 (`w5-l1`) with `roblox-studio-basics` simulator (Part spawning, Explorer/Properties, Move/Scale/Rotate, `Anchored` gravity test).
    * Added Lesson 5.2 (`w5-l2`) with `roblox-obby-builder` simulator (grid Obby map builder + playable Canvas playtester).
    * Added Lesson 5.3 (`w5-l3`) with `roblox-lua-lab` simulator (Luau `Touched` scripting for Coins, Speed Pad, Bounce Pad, and Auto Door).
    * Added Lesson 5.4 (`w5-l4`) with `roblox-game-architect` simulator (Tycoon, Simulator, Racing, Hide & Seek blueprints + Toolbox & Safe Publishing checklist).
    * Added Island 5 (`world-5`) to `js/island-scene.js` with Roblox blocky steps, goal flag, 4th treasure chest, quick-jump chip, and dynamic 5-world `travelToWorld` routing.
    * Expanded `tests/run-all-tests.js` to **521 assertions (100% pass)**.
  * **Complete 4-World, 18-Lesson, 22-Drill MVP Delivered:**
    * **World 2 Expansion:** Added Lesson 2.5 (`w2-l5`: 用 Google 地圖規劃家庭小旅行) with interactive `maps-navigator` simulator (transit/walk/drive route calculations, Street View Pegman 360 preview, and real vs. fake review discrimination).
    * **World 4 Launch (`數位創作與程式入門`):**
      * Lesson 4.1 (`w4-l1`: 學校報告的簡報魔法) with `slide-studio` messy-slide rescue applying the Rule of 3, high-contrast themes, and hero visuals.
      * Lesson 4.2 (`w4-l2`: Scratch 積木遊戲工坊) with `scratch-blocks` event/loop/score block assembly and live playable catch-the-apple game.
      * Lesson 4.3 (`w4-l3`: 圖文冒險故事工坊) with `story-studio` 3-act story builder combining AI hero/setting/plot-twist prompts, dynamic SVG scene visuals, and Web Speech API audio narration.
    * **3D Island Map Expansion:** Added World 4 3D Creative Studio Island with glowing creative crystal, orbiting code blocks, rocket prop, and multi-modal navigation waypoints (`travelToWorld('world-4', true)`).
    * **Comprehensive Automated Test Suite:** Expanded `tests/run-all-tests.js` to 473 assertions covering all 18 lessons, 4 worlds, 4 new simulators (including Scratch nav-away lifecycle timer safety and Story Studio TTS speech synthesis error resilience), and Three.js World 4 waypoints.
    * **Google Drive & Git Synchronization:** In-place updates pushed to `G-Agent-folder` (`digital_explorer_academy.html`, `digital-explorer-academy.zip`, `PROJECT_HANDOFF.md`) and GitHub repository `azreal564335/dea` on `main`.
  * **GitHub Repository & Build Portability:** Created `azreal564335/digital-explorer-academy` on GitHub, added `.gitignore` (excluding `node_modules/` and `dist/`), updated `scripts/build-bundle.js` and `tests/run-all-tests.js` to use portable relative `dist/` paths instead of hardcoded sandbox paths, and pushed all code to `main`.
  * **Phase 2 Typing Expansion (Stage 6):** Added 3 new drills (`nr-1` Number Row, `en-1` Everyday English, `zy-5` Zhuyin Short Story) to `data/typing-drills.js` (22 drills total) and made the Certificate total drill count dynamic in `js/app.js`.
  * Upgraded `js/island-scene.js` & `js/app.js` into a **3D Gamified Avatar Adventure Map** (Clash Quest / One Piece Skypiea style):
    * **3D Explorer Avatar (`🦁` / `🦊`)** matching the active kid profile, starting on their furthest unlocked world.
    * **Multi-Modal Pathing (`travelToWorld`):** Hops across 3D stepping stones, swims across open ocean with expanding splash rings, and performs a **super high jump** with star sparkles up into the clouds to reach the floating **World 3 AI Sky Island** (`y = 2.35`).
    * **Treasure Chests** between worlds that glow gold upon world completion, plus animated ocean waves and drifting clouds.
  * Added **Three.js 3D Floating Islands** (`js/island-scene.js` + bundled `js/vendor/three.min.js`) on the World Map, where each of the 4 Worlds has its own lively 3D animations and click-to-jump navigation.
  * Added a **Dynamic Island (`💊 靈動探險島`)** status pill in the hero header.
  * Replaced all `alert()` / `prompt()` / `confirm()` with custom `window.UIModal` so renaming (`✏️ 改名`) and progress import/export work in sandboxed iframes.
  * Fixed `TypingDojo` IME composition (`compositionstart`/`compositionend`) so Microsoft Bopomofo candidate selection is never interrupted.
  * Maintained strict generic laptop rules (zero hardware brand names).
  * Organized `G-Agent-folder` into `01`–`05` subfolders and initialized `PROJECT_HANDOFF.md`.
* **Latest Update (Full Improvement Plan + Bopomofo Font + 8yo Simpler Mode):**
  * **Test Gate:** `npm run build && npm test` passed **661 / 661** assertions (**0 failures**).
  * **P0 Security & Hygiene:** Added `escapeHtml()` XSS protection across header/certificate, schema validation (`sanitizeProfile`) in `importProgress()`, and excluded `.agents/` & `PROJECT.md` via `.gitignore`.
  * **P1 Learning Quality & 8yo Support:** Expanded all 26 lessons to have `>= 2` cards and `>= 3` quiz questions; added deterministic quiz option shuffling (`getShuffledQuizOrder`), 1–3 star calculation based on mistakes (`quizMistakes`), Daily Quest banner (`getDailyQuest`), Typing Dojo SVG progress chart (`drillHistory`) + `0.75x` CPM scaling for 8yo, real-world Roblox Studio checklists (`studioChecklist`), `simpleBody` for 8yo, and **Bopomofo/Zhuyin companion font (`Bpmf Iansui`)** auto-enabled for `kid-8` and toggleable in the header.
  * **P2 Platform & Parent Dashboard:** Added Vercel Redis cloud sync endpoint (`api/progress.js`) + Parent Dashboard comparison grid (`renderParentGuide`), PWA (`manifest.json`, `sw.js`), GitHub Actions CI (`.github/workflows/ci.yml`), accessibility `:focus-visible`, mobile responsive rules, and deferred/reduced-motion 3D Island initialization.
  * **P3 Worlds 1–4 Visual Guides:** Added annotated inline SVG UI diagrams (`win11-taskbar`, `chrome-tabs-search`, `ai-prompt-box`, `scratch-blocks-ui`) to `w1-l2`, `w2-l1`, `w3-l2`, `w4-l2`.
* **World 7: Scratch 積木遊戲創意島 (Scratch Game Creator Island):**
  * **Test Gate:** `npm run build && npm test` passed **709 / 709** assertions (**0 failures**).
  * **Added 3D Island 7** in `js/island-scene.js` with quick-jump chip (`🐱 7. Scratch 創意島`) and 8-segment scenic waypoint routing.
  * **Added 3 Interactive Scratch Lessons (`w7-l1`–`w7-l3`)** in `data/curriculum.js`, `js/simulators.js`, and `js/app.js` (X/Y Coordinates Space Dodge, Collision & Score/HP Variables, Clones & Timer + annotated SVG diagrams & 8yo `simpleBody`).
  * **CI & Node Pinning:** Added `.nvmrc` (`24`), `"engines": { "node": ">=22.19.0" }`, and `node-version-file: '.nvmrc'` in `.github/workflows/ci.yml`.

---

## 6. 🤖 Agent Handoff Protocol (MANDATORY)

1. **Before Starting Work:**
   * Read `PROJECT_HANDOFF.md` and check `03_Lesson_Modules_&_Ideas/` on Google Drive for any new parent notes or requests.
2. **During Work (Checkpoint-First Rule):**
   * After **each** completed feature or lesson, update Section 4 (Roadmap checkboxes) and Section 5 (Current Status & Changelog) in `PROJECT_HANDOFF.md` right away. Do not wait until the end of the conversation in case quota runs out!
3. **Before Ending Any Job:**
   * Run `npm run build && npm test` in `/home/antigravity/digital-explorer-academy` and confirm **0 failures**.
   * Update `digital_explorer_academy.html` in `01_Kids_App_Latest/` (`gdrive mutate update 1Fmy0eDXyoFilQ70nkaLi3fFWztbP5DPh ...`).
   * Re-zip and update `digital-explorer-academy.zip` in `02_Source_Code_&_Releases/` (`gdrive mutate update 1eyUYme8tCAwytYePqqrwU8X0p-HTIadm ...`).
   * Update `PROJECT_HANDOFF.md` in `G-Agent-folder` (`gdrive mutate update ...`) with the latest status, test counts, and next steps.
