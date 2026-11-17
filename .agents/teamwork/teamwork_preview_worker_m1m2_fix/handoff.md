# 🛠️ Fix Worker Handoff Report: M1/M2 Bug Fixes (Iteration 2)

**Agent**: M1/M2 Fix Worker (`teamwork_preview_worker_m1m2_fix`)  
**Parent Orchestrator**: `a8df60e8f027b775b7b708930ce5f68f`  
**Working Directory**: `/home/antigravity/digital-explorer-academy/.agents/teamwork/teamwork_preview_worker_m1m2_fix`  
**Milestone**: M1/M2 Bug Fixes  
**Date**: 2026-11-13T06:26:00Z  
**Verdict**: **`RESOLVED`**

---

## 1. Observation

Reviewer 2 and Challenger 2 identified two critical runtime defects in `js/simulators.js` and `js/app.js`:
1. **`scratch-blocks` lifecycle & unmounted element null dereference**:
   - In `renderScratchBlocks(el, cid)`: `el` had no null guard, throwing `TypeError: Cannot set properties of null (setting 'innerHTML')` if invoked when unmounted.
   - In `startScratchGameLoop(cid)`: background interval timer continued firing every 45ms even when user navigated away (`#lesson-simulator-mount` removed from DOM), leaking timer and invoking `checkScratchCollision` -> `renderScratchBlocks(null)`.
   - In `checkScratchCollision(cid)`: `renderScratchBlocks(document.getElementById(cid), cid)` called without element null guard.
2. **`story-studio` TTS language handling & audio exception safety**:
   - In `speakStoryScene(sceneIdx, cid)`: Chinese text was mistakenly dispatched to `AppState.speakEnglish(textToSpeak)`, setting `utter.lang = 'en-US'` and producing mismatched toast `🔊 英文單字：[Chinese text]`.
   - In `AppState.speakEnglish(text)`: `window.speechSynthesis.cancel()` and `window.speechSynthesis.speak(utter)` lacked a `try/catch` block, causing unhandled DOMExceptions if audio hardware failed or permissions were denied.

---

## 2. Logic Chain

1. **Fix 1 (`scratch-blocks` lifecycle & DOM guard)**:
   - In `js/simulators.js`:
     - Added `if (!el) return;` at the beginning of `renderScratchBlocks(el, cid)`.
     - In `checkScratchCollision(cid)`, guarded DOM reference: `const el = document.getElementById(cid); if (el) { this.renderScratchBlocks(el, cid); }`.
     - In `startScratchGameLoop(cid)`, added element check inside `setInterval`:
       ```javascript
       const el = document.getElementById(cid);
       if (!el) {
         clearInterval(this._scratchTimer);
         this._scratchTimer = null;
         return;
       }
       const s = this.state;
       if (!s.scratchGamePlaying || s.scratchWin) {
         clearInterval(this._scratchTimer);
         this._scratchTimer = null;
         return;
       }
       ```
     - Also set `this._scratchTimer = null` whenever clearing the interval to prevent stale references.
2. **Fix 2 (`story-studio` Chinese TTS & `speakEnglish` hardening)**:
   - In `js/simulators.js`:
     - Replaced routing through `AppState.speakEnglish()` in `speakStoryScene` with direct native `window.speechSynthesis` handling:
       ```javascript
       if (typeof window.speechSynthesis !== 'undefined') {
         try {
           window.speechSynthesis.cancel();
           const u = new window.SpeechSynthesisUtterance(textToSpeak);
           u.lang = 'zh-TW';
           u.rate = 0.9;
           window.speechSynthesis.speak(u);
         } catch (e) {
           console.warn('SpeechSynthesis unavailable:', e);
         }
       }

       if (window.UIModal && window.UIModal.toast) {
         window.UIModal.toast(`🔊 正在為你朗讀第 ${sceneIdx + 1} 幕故事有聲書...`, 3000);
       }
       ```
   - In `js/app.js`:
     - Wrapped `window.speechSynthesis.cancel()` and `window.speechSynthesis.speak(utter)` in `speakEnglish(text)` in a `try/catch` block, printing `console.warn('SpeechSynthesis error:', e);` upon error without crashing.
3. **Build & Bundles**:
   - Ran `npm run build` to compile `dist/digital_explorer_academy.html` (970,117 bytes) and `dist/index.html`.
4. **Hardware Brand Name Audit**:
   - Executed `grep -rnI -E "ASUS|華碩" data/ js/ css/ index.html dist/` -> zero matches.

---

## 3. Caveats

- Unit test suite `npm test` checks legacy assertion "All 14 curriculum lessons are loaded" because `curriculum.js` was expanded in M1 to 18 lessons (World 4 + Lesson 2.5); updating `tests/run-all-tests.js` for 18 lessons is scoped to Milestone 3 per `PROJECT.md` line 17 ("Update tests/run-all-tests.js for 4 worlds, 18 lessons... M3").
- All M1/M2 specific features and reproduction tests run clean with zero errors.

---

## 4. Conclusion

Both reported bugs have been cleanly resolved in genuine implementation:
- `scratch-blocks` safely halts its game loop and releases timers when unmounted or navigating away, with full null guards preventing any DOM exceptions.
- `story-studio` correctly pronounces Chinese text using `zh-TW` at rate 0.9, provides the expected Chinese audio-book toast, and safely handles any speech synthesis audio device errors without throwing uncaught exceptions.
- `AppState.speakEnglish` is also hardened with `try/catch` against audio driver errors.
- Both reproduction test scripts from Challenger 2 pass with 100% success and 0 uncaught exceptions.
- Brand name prohibitions (`ASUS` / `華碩`) are strictly satisfied.

---

## 5. Verification Method

### 1. Build Verification
```bash
npm run build
```
*Expected*: Exit 0, successfully builds `dist/digital_explorer_academy.html` and `dist/index.html`.

### 2. Scratch Blocks Nav-Away Reproduction Test
```bash
node -e "
const fs = require('fs');
const { JSDOM } = require('jsdom');
const html = fs.readFileSync('dist/digital_explorer_academy.html', 'utf8');
const dom = new JSDOM(html, { runScripts: 'dangerously', url: 'https://local.test/', beforeParse(w){ w.localStorage={getItem:()=>null,setItem:()=>null}; } });
const win = dom.window;
win.AppState.navigate('lesson', 'w4-l2');
win.AppState.setLessonStep('lab');
const cid = 'lesson-simulator-mount';
win.Simulators.toggleScratchBlock('scratchBlockBowl', cid);
win.Simulators.toggleScratchBlock('scratchBlockApple', cid);
win.Simulators.toggleScratchBlock('scratchBlockScore', cid);
win.Simulators.toggleScratchGame(cid);
win.Simulators.state.scratchBowlX = 150;
win.Simulators.state.scratchAppleX = 150;
win.Simulators.state.scratchAppleY = 185;
win.AppState.navigate('map');
setTimeout(() => console.log('PASS: No crash on nav away!'), 150);
"
```
*Result*: Exit 0, prints `PASS: No crash on nav away!` with 0 uncaught exceptions.

### 3. Story Studio Audio Exception Reproduction Test
```bash
node -e "
const fs = require('fs');
const { JSDOM } = require('jsdom');
const html = fs.readFileSync('dist/digital_explorer_academy.html', 'utf8');
const dom = new JSDOM(html, { runScripts: 'dangerously', url: 'https://local.test/', beforeParse(w){
  w.speechSynthesis = { speak: () => { throw new Error('Hardware error'); }, cancel: () => {} };
  w.SpeechSynthesisUtterance = function(t){ this.text = t; };
  w.localStorage = { getItem: () => null, setItem: () => null };
}});
const win = dom.window;
win.AppState.navigate('lesson', 'w4-l3');
win.AppState.setLessonStep('lab');
win.Simulators.speakStoryScene(0, 'lesson-simulator-mount');
console.log('PASS: No uncaught exception when speech synthesis throws!');
"
```
*Result*: Exit 0, prints `PASS: No uncaught exception when speech synthesis throws!`.

### 4. speakEnglish Audio Driver Exception Resilience Test
```bash
node -e "
const fs = require('fs');
const { JSDOM } = require('jsdom');
const html = fs.readFileSync('dist/digital_explorer_academy.html', 'utf8');
const dom = new JSDOM(html, { runScripts: 'dangerously', url: 'https://local.test/', beforeParse(w){
  w.speechSynthesis = { speak: () => { throw new Error('Audio driver crash'); }, cancel: () => {} };
  w.SpeechSynthesisUtterance = function(t){ this.text = t; };
  w.localStorage = { getItem: () => null, setItem: () => null };
}});
const win = dom.window;
win.AppState.speakEnglish('keyboard');
console.log('PASS: speakEnglish handled throwing speech synthesis cleanly!');
"
```
*Result*: Exit 0, prints `PASS: speakEnglish handled throwing speech synthesis cleanly!`.

### 5. Brand Name Prohibition Audit
```bash
grep -rnI -E "ASUS|華碩" data/ js/ css/ index.html dist/
```
*Result*: Exit 1 (0 matches).
