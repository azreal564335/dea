# 3D Island Scene, UI, Navigation, Certificates, and Entry Point Survey Report

## 1. Observation

Direct code observations from inspecting the codebase:

### A. `js/island-scene.js`
1. **Scene Mount & Fallback Banner (`js/island-scene.js:95-99`):**
   ```html
   <div class="island-fallback-banner">
     <span>🏝️ 3D 浮空島嶼冒險地圖已就緒（點選下方三個世界開始闖關！）</span>
   </div>
   ```
   Mentions hardcoded text `點選下方三個世界開始闖關！`.

2. **Progress & Lesson Counting in Mount (`js/island-scene.js:103-108`):**
   ```javascript
   const w1Done = (window.CURRICULUM_LESSONS || []).filter(l => l.worldId === 'world-1' && profile.completedLessons[l.id]).length;
   const w1Total = (window.CURRICULUM_LESSONS || []).filter(l => l.worldId === 'world-1').length || 4;
   const w2Done = (window.CURRICULUM_LESSONS || []).filter(l => l.worldId === 'world-2' && profile.completedLessons[l.id]).length;
   const w2Total = (window.CURRICULUM_LESSONS || []).filter(l => l.worldId === 'world-2').length || 4;
   const w3Done = (window.CURRICULUM_LESSONS || []).filter(l => l.worldId === 'world-3' && profile.completedLessons[l.id]).length;
   const w3Total = (window.CURRICULUM_LESSONS || []).filter(l => l.worldId === 'world-3').length || 6;
   ```
   Only computes `w1Done/w1Total`, `w2Done/w2Total`, and `w3Done/w3Total`. Does not calculate `w4Done/w4Total`.

3. **HUD Quick Chips (`js/island-scene.js:116-126`):**
   ```html
   <div class="three-island-labels">
     <button class="island-quick-chip w1" onclick="window.IslandScene.travelToWorld('world-1', true)">
       💻 1. 筆電島 (⭐${w1Done}/${w1Total})
     </button>
     <button class="island-quick-chip w2" onclick="window.IslandScene.travelToWorld('world-2', true)">
       🌐 2. 網路島・游泳+跳石 (⭐${w2Done}/${w2Total})
     </button>
     <button class="island-quick-chip w3" onclick="window.IslandScene.travelToWorld('world-3', true)">
       ☁️ 3. AI 天空島・超級大跳躍! (⭐${w3Done}/${w3Total})
     </button>
   </div>
   ```
   Only 3 hardcoded quick chips.

4. **Island Models and Layout (`js/island-scene.js:231-364`):**
   - **Ocean Plane**: width 36, height 20 (`new THREE.PlaneGeometry(36, 20, 24, 14)`).
   - **Island 1 (Sea Island)**: `position.set(-4.8, 0, 0.6)`. `standPos: Vector3(-4.8, 0.42, 1.35)`. Laptop base, animated screen pivot, orbiting keycaps.
   - **Island 2 (Sea Island)**: `position.set(0, 0, -0.3)`. `standPos: Vector3(0, 0.42, 0.75)`. Spinning globe, globe wireframe, shield ring, orbiting packets.
   - **Island 3 (Sky Island)**: `position.set(4.8, 2.35, -0.1)`. `standPos: Vector3(4.8, 2.77, 0.75)`. Floating sky cylinder with inverted cone rock base and cloud puffs underneath. AI crystal + magic tetrahedron orbit.
   - `this.islands = [island1, island2, island3];`

5. **Stepping Stones & Chests (`js/island-scene.js:367-410`):**
   - **Stones**: Two stones positioned at `(-3.0, -0.32, 1.05)` and `(-2.1, -0.32, 0.75)` between Island 1 and the swim channel to Island 2. Color lights up if `w1Done > idx`.
   - **Chests**:
     - Chest 1 between Island 1 and 2: `new THREE.Vector3(-2.45, -0.1, -0.5)`, unlocked when `w1Done >= w1Total`.
     - Chest 2 between Island 2 and 3: `new THREE.Vector3(2.4, -0.1, -0.5)`, unlocked when `w2Done >= w2Total`.
     - No chest between Island 3 and 4, or for completing World 3/4.

6. **Initial Avatar Placement (`js/island-scene.js:440-446`):**
   ```javascript
   let startWorld = 'world-1';
   if (w2Done > 0) startWorld = 'world-2';
   if (w3Done > 0) startWorld = 'world-3';
   this.currentWorldId = startWorld;
   ```
   Does not consider `w4Done`.

7. **Multi-Modal Waypoint Routing in `travelToWorld` (`js/island-scene.js:724-756`):**
   Waypoints currently only handle combinations of `world-1`, `world-2`, and `world-3`:
   - `world-1 <-> world-2`: Hop on s1, s2 -> swim to p2.
   - `world-2 <-> world-3`: `superjump` arc (y arc +3.2) between p2 and p3.
   - `world-1 <-> world-3`: Hop -> swim -> superjump.
   If targetWorldId is not handled, waypoints is empty and it just falls back to scrolling.

---

### B. `js/app.js`
1. **Header & Navigation (`js/app.js:166-222`):**
   - `totalLessons = window.CURRICULUM_LESSONS.length` is dynamic (shows `completedCount / totalLessons`).
   - Line 189: `<button class="nav-tab ...">🎹 中英打字道館 (19關)</button>` — Hardcoded `(19關)` in top nav bar!
2. **Hero Banner & Dynamic Island (`js/app.js:250-282`):**
   - Line 261-266:
     ```html
     <div class="dynamic-island-bar">
       <span class="dynamic-island-dot"></span>
       <span>💊 靈動探險島：${p.avatar} ${p.name} 連線中</span>
       <span>｜</span>
       <span>👀 20-20-20 護眼提醒：每 20 分鐘看遠方 20 秒！</span>
     </div>
     ```
   - Line 274: `<div class="stat-num">${completedDrillsCount} / 19</div>` — Hardcoded `/ 19` in hero stats! (Should be dynamic or match `window.TYPING_DATA` total drills = 22).
3. **World Sections Rendering (`js/app.js:287-336`):**
   - Dynamically iterates over `window.CURRICULUM_WORLDS.map(world => ...)`.
   - Dynamically filters `window.CURRICULUM_LESSONS.filter(l => l.worldId === world.id)`.
   - Computes `wDoneCount / wLessons.length`.
   - Automatically supports any number of worlds added to `window.CURRICULUM_WORLDS`!
4. **Standalone Dojo View (`js/app.js:549`):**
   - Hardcoded `共 19 關` in title: `🎹 老鷹變獵鷹：中英盲打與注音特訓道館 (共 19 關)`.
5. **Certificate & Graduation Requirements (`js/app.js:599-632`):**
   - `doneLessons` vs `totalLessons` (`window.CURRICULUM_LESSONS.length`) is dynamic.
   - Drill count uses dynamic calculation: `window.TYPING_DATA.categories.reduce((sum, c) => sum + c.drills.length, 0)` (evaluated to 22).
   - Certification tier at line 629:
     ```javascript
     <span>🏅 認證等級：${doneLessons >= totalLessons ? '👑 傳奇數位魔法師' : doneLessons >= 6 ? '🌟 進階數位探險家' : '🌱 見習數位小達人'}</span>
     ```
     `doneLessons >= totalLessons` automatically scales with the new total lesson count.
6. **Parent Guide & Extensibility Docs (`js/app.js:686-690`):**
   - Section 4 explicitly advises parents:
     `想新增更多單元或第 4 個世界（例如：Scratch 程式設計、Canva 簡報設計、進階英文）：打開 data/curriculum.js，複製任一單元的格式貼上，主地圖與進度系統就會自動長出新課程！`

---

### C. `index.html` & `js/ui-modal.js` & `css/styles.css`
1. **`index.html`**:
   - Clean, lightweight modular container.
   - Zero hardcoded world numbers or lesson lists.
   - Scripts are loaded cleanly in sequence:
     ```html
     <script src="js/vendor/three.min.js"></script>
     <script src="js/island-scene.js"></script>
     <script src="js/ui-modal.js"></script>
     <script src="data/typing-drills.js"></script>
     <script src="data/curriculum.js"></script>
     <script src="js/typing-dojo.js"></script>
     <script src="js/simulators.js"></script>
     <script src="js/app.js"></script>
     ```
2. **`js/ui-modal.js`**:
   - Pure UI modal & toast dialog system (alert, confirm, prompt, toast).
   - Completely agnostic of world count or curriculum structure.
3. **`css/styles.css`**:
   - Lines 18-24: CSS variables define `--w1-color`, `--w2-color`, `--w3-color`, but no `--w4-color`.
   - Lines 1213-1215:
     ```css
     .island-quick-chip.w1 { color: #0369a1; }
     .island-quick-chip.w2 { color: #047857; }
     .island-quick-chip.w3 { color: #b45309; }
     ```
     Missing `.island-quick-chip.w4` styling (e.g. purple/violet `#7c3aed`).

---

### D. `tests/run-all-tests.js`
- Line 100: `assert(Array.isArray(window.CURRICULUM_LESSONS) && window.CURRICULUM_LESSONS.length === 14, 'All 14 curriculum lessons are loaded');`
- Line 344: `assert(certEl.textContent.includes('14 / 14 堂數位課程'), 'All 14/14 lessons reflected on Certificate');`
- Currently tests exactly 14 lessons. When World 4 is added (e.g. +3 lessons: 4.1, 4.2, 4.3) and World 2 expanded (+1 lesson: 2.5), total lessons will become 18 (14 + 1 + 3 = 18). Test runner expectations will need to be updated.

---

## 2. Logic Chain

1. **Scalability of `app.js` Architecture**:
   - `AppState.renderWorldMap` is already data-driven using `window.CURRICULUM_WORLDS.map(...)` and `window.CURRICULUM_LESSONS.filter(...)`.
   - Therefore, adding World 4 to `window.CURRICULUM_WORLDS` in `data/curriculum.js` will immediately render the 4th world section on the page without modifying the HTML structure of `app.js`.
   - However, the 3D canvas overlay (`IslandScene`) and top HUD buttons do NOT dynamically generate islands from `window.CURRICULUM_WORLDS`; they are manually hardcoded in `js/island-scene.js`.

2. **3D Island Scene Layout for 4 Worlds**:
   - Currently, island positions are arranged horizontally:
     - Island 1: `x = -4.8, y = 0, z = 0.6` (Sea)
     - Island 2: `x = 0, y = 0, z = -0.3` (Sea)
     - Island 3: `x = 4.8, y = 2.35, z = -0.1` (Sky)
   - To accommodate World 4 (數位創作與程式入門 — Future World / Cyber Creative World):
     - **Layout Strategy**:
       - Either expand the horizontal span and adjust camera framing/ocean plane:
         - Ocean plane is 36 units wide (`PlaneGeometry(36, 20)`), so it easily accommodates a wider span or a multi-elevation arc.
         - For example: Island 1 (`x = -6.5`), Island 2 (`x = -2.2`), Island 3 (`x = 2.2`, Sky), Island 4 (`x = 6.5`, Future Cyber Island / Floating Crystal Stage at `y = 1.2` or futuristic space station).
         - OR a scenic adventure archipelago: Island 1 at `(-5.2, 0, 0.8)`, Island 2 at `(-1.6, 0, -0.4)`, Island 3 at `(1.8, 2.35, -0.2)`, Island 4 at `(5.4, 0.4, 0.6)` or high-tech creative launchpad.
     - **World 4 Themed 3D Model**:
       - Theme: Creative Coding & Scratch & Multimedia (Future World: 數位創作與程式入門).
       - Visual props: Cyber neon stage, Scratch cat / coding block brackets `{ }`, glowing creative rainbow palette / magic canvas or interactive rocket.
     - **Connecting Path & Stepping Elements**:
       - Stepping stones or cloud jump pads between Island 3 and Island 4, or rainbow bridge / light bridge.
       - A 3rd Treasure Chest between Island 3 and Island 4, or at the goal of World 4, unlocking when World 3 or 4 is mastered.
     - **Avatar Animation State Machine**:
       - Add routes in `travelToWorld` for all combinations involving `world-4`:
         - `world-3 -> world-4`: gliding / rainbow leap / cloud-slide to World 4.
         - `world-4 -> world-3`: reverse leap.
         - Paths between `world-1`, `world-2`, and `world-4` daisy-chaining through the existing waypoints.
     - **Quick Chips HUD**:
       - Add Chip 4: `🎨 4. 創作島・程式與畫布 (⭐${w4Done}/${w4Total})`.

3. **Hardcoded World & Drill Numbers**:
   - `index.html`: completely clean.
   - `css/styles.css`: needs `--w4-color` (e.g. `#7c3aed`) and `.island-quick-chip.w4`.
   - `js/app.js`:
     - Line 189: `🎹 中英打字道館 (19關)` should be dynamic: `(${totalDrills}關)` or match current count.
     - Line 274: `<div class="stat-num">${completedDrillsCount} / 19</div>` should be dynamic: `/${totalDrills}`.
     - Line 549: title should reflect actual total drills dynamically.
     - Graduation Certificate tier thresholds and lessons total are already dynamic (`window.CURRICULUM_LESSONS.length`), but test runner expects 14 and will need updating when lessons are added.

---

## 3. Caveats

1. **WebGL Canvas Rendering in JSDOM / Test Environment**:
   - `jsdom` does not support WebGL; `IslandScene.mount` already gracefully detects `hasWebGL = false` and falls back to `.island-fallback-banner`.
   - Any Three.js additions must maintain this fallback safety so `npm test` continues to run cleanly in headless environments.
2. **Camera Aspect Ratio & Width**:
   - Camera aspect is updated dynamically on window resize, but camera Z is currently `13.8` with FOV `42`. If adding World 4 spreads islands from `x = -6.5` to `+6.5`, camera position Z may benefit from slight adjustment (e.g. `z = 14.8 - 15.2` or slightly wider FOV `44`) so all 4 islands and chips are comfortably visible on laptop screens (1366x768 / 1920x1080).

---

## 4. Conclusion & Required Changes for World 4

To support World 4 (**數位創作與程式入門 — Future World**):

### 1. `js/island-scene.js` Changes Required:
- Calculate `w4Done` and `w4Total`:
  ```javascript
  const w4Done = (window.CURRICULUM_LESSONS || []).filter(l => l.worldId === 'world-4' && profile.completedLessons[l.id]).length;
  const w4Total = (window.CURRICULUM_LESSONS || []).filter(l => l.worldId === 'world-4').length || 3;
  ```
- Update fallback banner text from `點選下方三個世界` to `點選下方四個世界`.
- Add Chip 4 to `.three-island-labels`:
  ```html
  <button class="island-quick-chip w4" onclick="window.IslandScene.travelToWorld('world-4', true)">
    🎨 4. 創意程式島 (⭐${w4Done}/${w4Total})
  </button>
  ```
- Adjust Island 1–3 positions slightly and add Island 4:
  - Island 1: `x = -5.4`
  - Island 2: `x = -1.8`
  - Island 3 (Sky): `x = 1.8`
  - Island 4 (Creative/Cyber): `x = 5.4, y = 0.8, z = 0.2`
  - Island 4 Visual Props: Futuristic floating platform with glowing coding glyphs (`{ }`), spinning holographic paintbrush/palette, or neon energy pylons.
  - Add Island 4 to `this.islands = [island1, island2, island3, island4]`.
- Add Chest 3 between Island 3 & 4 (unlocked when `w3Done >= w3Total`).
- Update Avatar start position logic:
  ```javascript
  if (w4Done > 0) startWorld = 'world-4';
  ```
- Update `travelToWorld` with transitions between `world-4` and other worlds (using `'hop'`, `'swim'`, `'superjump'`, or a new `'glide'` / `'hyperjump'`).

### 2. `js/app.js` Changes Required:
- Replace hardcoded `19` in top nav (`🎹 中英打字道館 (19關)` -> dynamic `(${window.TYPING_DATA.categories.reduce((s, c) => s + c.drills.length, 0)}關)`).
- Replace hardcoded `19` in hero stats (`completedDrillsCount / 19` -> `/${totalDrills}`).
- Replace hardcoded `共 19 關` in standalone Dojo title.

### 3. `css/styles.css` Changes Required:
- Add `--w4-color: #7c3aed;` and `--w4-light: #ede9fe;`.
- Add `.island-quick-chip.w4 { color: #7c3aed; }`.

### 4. `tests/run-all-tests.js` Changes Required:
- Update expected lesson count assertion from 14 to new total (e.g. 18 when 2.5 + 4.1 + 4.2 + 4.3 are added).
- Update certificate text assertion (`14 / 14` -> `18 / 18`).

---

## 5. Verification Method

1. **Verify Source Files**:
   - Inspect lines in `js/island-scene.js`, `js/app.js`, `css/styles.css`, and `tests/run-all-tests.js`.
2. **Build and Automated Test Verification**:
   - Run `npm run build && npm test`
   - Observe that current suite passes 405/405 tests.
   - When modifications for World 4 are made, all tests must pass with updated assertions.
