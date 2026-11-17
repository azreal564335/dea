# Independent Review & Adversarial Challenge Report: Milestones M1 & M2

## Review Summary

**Verdict**: REQUEST_CHANGES

This independent review evaluates the implementations across:
- `data/curriculum.js` (M1: Lesson 2.5 + World 4 Lessons 4.1–4.3)
- `js/simulators.js` (M1: `maps-navigator`, `slide-studio`, `scratch-blocks`, `story-studio`)
- `css/styles.css` (M1: World 4 theme, chips, simulator step-tabs)
- `js/island-scene.js` (M2: 4-island layout, Chest 3, waypoints, banner)
- `js/app.js` (M2: dynamic typing drill counts)

---

## 1. Observation

### 1. Build & Compilation
- Command: `npm run build`
- Result: **SUCCESS** (bundled single-file HTML `dist/digital_explorer_academy.html` [969,783 bytes] and `dist/index.html` with zero syntax errors).

### 2. Curriculum & Simulator Integrity
- `data/curriculum.js`:
  - Authentic, non-dummy definitions for World 4 (`world-4`, `數位創作與程式入門`, theme `#7c3aed`, badge `數位創意大師勳章`).
  - Added Lesson 2.5 (`w2-l5`) with `maps-navigator` simulator.
  - Added Lessons 4.1 (`w4-l1`), 4.2 (`w4-l2`), 4.3 (`w4-l3`) with real concept cards, kid-friendly vocabulary, rich simulators, and 3-question quizzes.
  - No dummy or fake shortcuts detected.

### 3. Dynamic Typing Drill Counts (`js/app.js`)
- Observed in `js/app.js`:
  - Line 172-174, 258-260, 551-553:
    ```javascript
    const totalDrills = (window.TYPING_DATA && window.TYPING_DATA.categories)
      ? window.TYPING_DATA.categories.reduce((sum, c) => sum + c.drills.length, 0)
      : 22;
    ```
  - Replaced all legacy hardcoded `19` drill counts in the navigation bar (`🎹 中英打字道館 (${totalDrills}關)`), hero banner stat box (`${completedDrillsCount} / ${totalDrills}`), and standalone dojo header (`(共 ${totalDrills} 關)`).
  - Grep check for `19` in `js/app.js`: zero leftover hardcoded `19`.

### 4. 3D Island Scene (`js/island-scene.js`)
- Spacing:
  - Island 1: `x = -5.4`
  - Island 2: `x = -1.8` ($\Delta x = 3.6$)
  - Island 3: `x = 1.8` ($\Delta x = 3.6$)
  - Island 4: `x = 5.4` ($\Delta x = 3.6$)
  - Perfectly equidistant spacing of 3.6 units along the X-axis.
- Waypoints:
  - Comprehensive 12-route waypoints connecting all permutations among `world-1`, `world-2`, `world-3`, `world-4` (hop stones, swim channel, super jump up/down).
- Chests:
  - 3 chests at `x = -3.6` (w1 unlock), `x = 0.0` (w2 unlock), and `x = 3.6` (w3 unlock: `w3Done >= w3Total`).
- Fallback Banner:
  - Lines 95-97: `<span>🏝️ 3D 浮空島嶼冒險地圖已就緒（點選下方四個世界開始闖關！）</span>` (correctly references "四個世界").

### 5. Identified Defects in `js/simulators.js` & `css/styles.css`
- **Issue A: Story Studio TTS Language Mismatch (`js/simulators.js:2095-2096`)**
  ```javascript
  2093: const textToSpeak = texts[sceneIdx] || texts[0];
  2094: 
  2095: if (window.AppState && typeof window.AppState.speakEnglish === 'function') {
  2096:   window.AppState.speakEnglish(textToSpeak);
  ```
  `texts[sceneIdx]` contains Traditional Chinese storytelling (e.g. `在晴朗清晨，小探險家 Leo 背起探險背包...`).
  `window.AppState.speakEnglish` forces:
  ```javascript
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'en-US';
  ```
  When invoked, the browser's speech synthesis engine uses an English voice to read Chinese characters, resulting in either complete silence, garbled phonemes, or severe distortion on Windows/Chrome.
- **Issue B: Memory Leak & Null Element Crash in `scratch-blocks` (`js/simulators.js:1713, 1726, 1734, 1749, 1773, 1778-1794`)**
  1. When running the game loop:
     ```javascript
     this._scratchTimer = setInterval(() => {
       ...
       this.checkScratchCollision(cid);
       this.drawScratchCanvas(cid);
     }, 45);
     ```
     If the user navigates away to another tab (e.g. `map`, `dojo`, `certificate`) while the game is running, `_scratchTimer` continues ticking indefinitely at 45ms intervals in the background.
  2. Inside `checkScratchCollision(cid)`:
     ```javascript
     if (s.scratchScore >= 10) {
       s.scratchWin = true;
       s.scratchGamePlaying = false;
     }
     this.renderScratchBlocks(document.getElementById(cid), cid);
     ```
     In `renderScratchBlocks(el, cid)`:
     ```javascript
     renderScratchBlocks(el, cid) {
       const s = this.state;
       const allSnapped = s.scratchBlockBowl && s.scratchBlockApple && s.scratchBlockScore;
       el.innerHTML = `...`; // 💥 Uncaught TypeError: Cannot set properties of null (setting 'innerHTML')
     ```
     Notice there is NO guard `if (!el) return;` at line 1546 of `renderScratchBlocks`! If a user switches to another view while the game is running or when catching an apple, `document.getElementById(cid)` is `null`, throwing an unhandled `TypeError`. Furthermore, `Simulators` lacks a `destroy()` or unmount hook to clear `this._scratchTimer`.
- **Issue C: Slideshow ESC Key Handling (`js/simulators.js:1498-1521`)**
  The modal header text claims: `▶️ Google Slides 全螢幕放映中 (按 ESC 或右上角關閉)`, but there is no `keydown` listener registered for the `Escape` key.
- **Issue D: Hardware Brand Name in CSS Selector (`css/styles.css:670`)**
  `css/styles.css` contains `.asus-keyboard` (line 670), violating the rule: *"Do NOT include any laptop hardware brand names (e.g., no ASUS or 華碩)"*.

---

## 2. Logic Chain

1. **Safety & Robustness**:
   - `renderScratchBlocks(el, cid)` is the ONLY simulator method in `js/simulators.js` that lacks the defensive guard `if (!el) return;` (compare with `renderWin11Power`, `renderSlideStudio`, `renderStoryStudio`, all of which either check `el` or are dispatched via `render()`).
   - When the user clicks the green flag to run `startScratchGameLoop`, `setInterval` fires every 45ms. If the student switches back to the lesson concept card ("回去看知識卡") or clicks another nav tab, `cid` is removed from the DOM. When the timer or collision triggers `this.renderScratchBlocks(document.getElementById(cid), cid)`, it immediately crashes the page with a fatal `TypeError: Cannot set properties of null`.
2. **Audio/TTS Correctness**:
   - The story content in `story-studio` is written in Traditional Chinese.
   - Calling `window.AppState.speakEnglish` forces `utter.lang = 'en-US'`.
   - The fallback in `simulators.js:2099-2101` correctly creates an utterance with `u.lang = 'zh-TW'`, but because `window.AppState.speakEnglish` exists, the fallback is bypassed and the broken `en-US` path is always taken.
3. **Brand Constraint**:
   - While `.asus-keyboard` originated in an earlier commit for styling the keyboard, it contains a hardware vendor name in violation of the strict project prompt requirement.

---

## 3. Findings

### [Critical] Finding 1: Unhandled Null Check & `setInterval` Memory Leak in Scratch Blocks
- **Where**: `js/simulators.js:1545-1549`, `js/simulators.js:1778-1794`
- **Why**:
  - `renderScratchBlocks(el, cid)` directly sets `el.innerHTML` without verifying `if (!el) return;`.
  - If a user starts the game loop and navigates away, the timer keeps running in the background and crashes with `Cannot set properties of null (setting 'innerHTML')` when collision occurs or re-render is attempted.
- **Suggestion**:
  1. Add guard at top of `renderScratchBlocks`: `if (!el) return;`.
  2. In `startScratchGameLoop`, check if `!document.getElementById(cid)` and `clearInterval(this._scratchTimer)` if the container no longer exists in DOM.
  3. Export a `destroy()` or `stopScratchGame()` method on `Simulators` and call it from `AppState.setLessonStep` / `AppState.navigate`.

### [Major] Finding 2: Story Studio TTS Reads Chinese Text with `en-US` Voice
- **Where**: `js/simulators.js:2095-2096`
- **Why**:
  - `window.AppState.speakEnglish` forces `utter.lang = 'en-US'`.
  - `texts[sceneIdx]` is in Traditional Chinese. On Windows/Android/iOS/macOS, passing Chinese text to an `en-US` utterance either fails silently or sounds completely incomprehensible.
- **Suggestion**:
  - Create a dedicated `speakText(text, lang = 'zh-TW')` function or directly use `window.speechSynthesis` with `u.lang = 'zh-TW'` (or provide bilingual Chinese + English narration).

### [Minor] Finding 3: Missing Escape Key Listener for Slideshow
- **Where**: `js/simulators.js:1498-1521`
- **Why**:
  - UI text promises "按 ESC 或右上角關閉", but only the close button is wired up.
- **Suggestion**:
  - Add a temporary `window.addEventListener('keydown', onEsc)` while slideshow is active, or remove "(按 ESC 或右上角關閉)" from the title.

### [Minor] Finding 4: Hardware Brand Name in CSS Class
- **Where**: `css/styles.css:670`, `js/typing-dojo.js:200`
- **Why**:
  - Project rules explicitly forbid laptop brand names (`ASUS`, `華碩`).
- **Suggestion**:
  - Rename `.asus-keyboard` to `.tw-keyboard` or `.win11-keyboard`.

---

## 4. Caveats

- Unit tests in `tests/run-all-tests.js` currently fail on assertions expecting 14 lessons (because 4 new lessons were added, making 18 total) and certificate counts. This is planned for Milestone M3 and is outside the scope of M1/M2 implementation.
- 3D rendering in JSDOM falls back to the banner fallback as expected since JSDOM does not provide a native WebGL context.

---

## 5. Conclusion

**Verdict: REQUEST_CHANGES**

The additions in M1 & M2 are rich, highly creative, and adhere to the project scope and 3D architectural requirements. However, **Finding 1** (unhandled null reference and timer leak in `scratch-blocks`) and **Finding 2** (TTS language misconfiguration in `story-studio`) are functional defects that must be resolved before Milestones M1 & M2 can be approved for integration.

---

## 6. Verification Method

1. **Verify Build**:
   ```bash
   npm run build
   ```
2. **Verify Memory Leak & Null Crash**:
   - In browser or test harness: Navigate to Lesson 4.2 -> 🎮 互動實戰練習場 -> Click 3 blocks -> Click 🚩 點擊綠旗 (執行遊戲).
   - Immediately click "← 回去看知識卡" or "← 返回探險地圖".
   - Observe console logs. Verify whether `_scratchTimer` continues running and whether `TypeError` is thrown.
3. **Verify TTS Voice**:
   - Navigate to Lesson 4.3 -> 🎮 互動實戰練習場 -> Click "🔊 聽有聲書朗讀".
   - Inspect the `SpeechSynthesisUtterance.lang` attribute. Verify that it is set to `'zh-TW'` rather than `'en-US'`.
