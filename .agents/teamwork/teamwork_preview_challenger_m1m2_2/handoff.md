# 🛡️ Empirical Challenger 2 Handoff Report: Milestones M1 & M2

**Agent**: Empirical Challenger 2 (`teamwork_preview_challenger_m1m2_2`)  
**Parent Orchestrator**: `a8df60e8f027b775b7b708930ce5f68f`  
**Milestone**: M1 & M2 Stress-Testing & Verification  
**Date**: 2026-11-13T06:18:00Z  
**Verdict**: **`REQUEST_CHANGES`**

---

## 1. Observation

Empirical testing was executed on the four assigned criteria without modifying any repository source files.

### 1.1 Offline Bundle Loading & Execution in JSDOM (`dist/*.html`)
- **Command**:
  ```bash
  npm run build
  ```
  Result: Successfully generated `dist/digital_explorer_academy.html` (1,033,999 bytes) and `dist/index.html` (1,033,999 bytes).
- **JSDOM Verification**:
  Loaded both files in isolated JSDOM instances. Both files executed all inlined scripts cleanly:
  - `window.AppState`: initialized object
  - `window.UIModal`: initialized object
  - `window.Simulators`: initialized object
  - `window.CURRICULUM_WORLDS`: 4 worlds
  - `window.CURRICULUM_LESSONS`: 18 lessons
  - `window.TypingDojo`: initialized object
  - Zero runtime errors during DOM parsing and initial render.
- **Status**: **PASS**

---

### 1.2 Scratch Blocks Game Loop Lifecycle & Navigation Away
- **Observation**:
  - `renderScratchBlocks(el, cid)` at `js/simulators.js:1545–1549`:
    ```javascript
    renderScratchBlocks(el, cid) {
      const s = this.state;
      const allSnapped = s.scratchBlockBowl && s.scratchBlockApple && s.scratchBlockScore;

      el.innerHTML = `...`; // Line 1549: NO null guard for `el`!
    ```
  - `checkScratchCollision(cid)` at `js/simulators.js:1761–1775`:
    ```javascript
    checkScratchCollision(cid) {
      const s = this.state;
      if (s.scratchAppleY >= 190 && s.scratchAppleY <= 220) {
        if (Math.abs(s.scratchAppleX - s.scratchBowlX) < 35) {
          s.scratchScore += 1;
          s.scratchAppleY = 20;
          s.scratchAppleX = Math.floor(Math.random() * 260) + 40;
          if (s.scratchScore >= 10) {
            s.scratchWin = true;
            s.scratchGamePlaying = false;
          }
          this.renderScratchBlocks(document.getElementById(cid), cid); // Line 1773
        }
      }
    }
    ```
  - `startScratchGameLoop(cid)` at `js/simulators.js:1777–1794`:
    Does not check if the container element `document.getElementById(cid)` exists. If the user navigates away from the lab (`AppState.navigate('map')` or any other tab/lesson), the timer interval continues firing in the background every 45ms.
- **Empirical Failure Reproduction**:
  When `scratchGamePlaying` is true, navigating away (`AppState.navigate('map')`) removes `document.getElementById('lesson-simulator-mount')`. Within 100ms, as the falling apple hits collision coordinates (or when bowl catches an apple), `checkScratchCollision` invokes `this.renderScratchBlocks(document.getElementById(cid), cid)` where `document.getElementById(cid)` is `null`.
  
  **Verbatim Error Trace**:
  ```
  TypeError: Cannot set properties of null (setting 'innerHTML')
      at Object.renderScratchBlocks (https://local.test/:1549:18)
      at Object.checkScratchCollision (https://local.test/:1773:14)
      at https://local.test/:1791:12
      at Timeout.task [as _onTimeout] (Window.js:542:19)
  ```
- **Status**: **FAIL (CONFIRMED BUG)**

---

### 1.3 Story Studio Speech Synthesis Failure Modes & Language Handling
- **Observation**:
  - `speakStoryScene(sceneIdx, cid)` in `js/simulators.js:2095–2105`:
    ```javascript
    if (window.AppState && typeof window.AppState.speakEnglish === 'function') {
      window.AppState.speakEnglish(textToSpeak);
    } else if (typeof window.speechSynthesis !== 'undefined') {
      try {
        const u = new window.SpeechSynthesisUtterance(textToSpeak);
        u.lang = 'zh-TW';
        window.speechSynthesis.speak(u);
      } catch (e) {
        // Safe fallback
      }
    }
    ```
  - `AppState.speakEnglish(text)` in `js/app.js:751–768`:
    ```javascript
    speakEnglish(text) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = 'en-US';
        utter.rate = 0.88;
        window.speechSynthesis.speak(utter);
        if (window.UIModal && window.UIModal.toast) {
          window.UIModal.toast(`🔊 英文發音：${text}`);
        }
      } else {
        if (window.UIModal && window.UIModal.toast) {
          window.UIModal.toast(`🔊 英文單字：${text}`);
        } else {
          alert(`英文發音：${text}`);
        }
      }
    }
    ```
- **Empirical Failure Reproduction**:
  1. **Uncaught Exception on Speech Error**:
     When `window.speechSynthesis.speak()` or `cancel()` throws (e.g. browser blocks auto-audio with `NotAllowedError` or hardware device is busy), `AppState.speakEnglish` contains no `try/catch`. The exception uncaught bubbles up:
     ```
     UNCAUGHT EXCEPTION: DOMException [NotAllowedError]: Audio output error
         at Object.speakEnglish (js/app.js:757)
         at Object.speakStoryScene (js/simulators.js:2096)
     ```
  2. **Wrong Language & Toast Mismatch**:
     `speakStoryScene` provides full Chinese story paragraphs (e.g. `"在晴朗清晨，小探險家 Leo 背起探險背包..."`). Because `window.AppState.speakEnglish` is defined, `speakStoryScene` routes the Chinese story paragraph to `speakEnglish()`. This sets `utter.lang = 'en-US'` (English pronunciation engine reading Chinese characters) and pops up a confusing toast:
     `🔊 英文單字：在晴朗清晨，小探險家 Leo 背起探險背包...`
     immediately followed by:
     `🔊 正在為你朗讀第 1 幕故事有聲書...`
     The `try/catch` and `u.lang = 'zh-TW'` block in `simulators.js` (lines 2097–2105) is completely bypassed and dead code.
- **Status**: **FAIL (CONFIRMED BUG & USABILITY FLAW)**

---

### 1.4 Hardware Brand Audit (`ASUS` / `華碩`)
- **Commands Executed**:
  ```bash
  grep -rnI -E "ASUS|華碩" data/ js/ css/ index.html dist/
  ```
  Result: Exit code 1 (zero matches across all directories and bundles).
  ```bash
  grep -rnI -E "ASUS|華碩" . --exclude-dir=.git --exclude-dir=.agents
  ```
  Result: Matches only in historical documentation `PROJECT_HANDOFF.md` lines 19 and 104 explicitly stating the prohibition rule:
  - Line 19: `* **Important Brand Rule:** **Do NOT include any laptop hardware brand names** (e.g., no ASUS or 華碩).`
  - Line 104: `* Removed all laptop brand names (ASUS / 華碩) across all files.`
- **Status**: **PASS**

---

## 2. Logic Chain

1. **JSDOM Offline Bundling**: The single-file artifact `dist/digital_explorer_academy.html` was generated by `scripts/build-bundle.js`. Running it in JSDOM demonstrates that all inlined styles, Three.js, curriculum data, typing drills, modal system, and simulators execute without missing dependencies.
2. **Scratch Game Loop Crash**:
   - `startScratchGameLoop` registers an interval with `setInterval(..., 45)`.
   - When the user clicks away from the lab (e.g. clicking "🗺️ 返回探險地圖" or another tab), `AppState.navigate` replaces `app-main` inner HTML, destroying `#lesson-simulator-mount`.
   - The interval timer is not cleared when the DOM element is removed.
   - When the apple reaches `scratchAppleY >= 190 && <= 220`, `checkScratchCollision` runs and attempts `this.renderScratchBlocks(document.getElementById(cid), cid)`.
   - `renderScratchBlocks` assumes `el` is non-null and attempts `el.innerHTML = ...`.
   - This causes an immediate unhandled `TypeError: Cannot set properties of null (setting 'innerHTML')`, crashing the application context.
3. **Story Studio Audio Handling**:
   - `speakStoryScene` was intended to speak Chinese narration (`zh-TW`) with fallback.
   - However, the `if (window.AppState && typeof window.AppState.speakEnglish === 'function')` check captures the call and sends Chinese text to `speakEnglish()`.
   - `speakEnglish` hardcodes `utter.lang = 'en-US'`, lacks `try/catch` around `speechSynthesis.cancel()` / `speechSynthesis.speak()`, and generates an inappropriate toast `🔊 英文單字：[中文故事]`.
   - If audio permission is denied or device throws, the application crashes with an unhandled exception.

---

## 3. Caveats

- As an empirical challenger with review-only permissions, no changes were committed to repo files.
- The two bugs were reproduced with 100% determinism via independent Node/JSDOM test harnesses.
- Fixes are clean, small, and low-risk (adding null guards and `clearInterval` in `simulators.js`, and proper `zh-TW` utterance / `try-catch` handling).

---

## 4. Conclusion & Actionable Recommendations

**Verdict: `REQUEST_CHANGES`**

Before approving M1 & M2, Worker M1 must make the following 2 targeted fixes:

### Required Fix 1: Guard `scratch-blocks` Against Unmounted Elements & Clear Leaked Timer
In `js/simulators.js`:
1. In `renderScratchBlocks(el, cid)`:
   ```javascript
   renderScratchBlocks(el, cid) {
     if (!el) return;
     const s = this.state;
     ...
   ```
2. In `startScratchGameLoop(cid)`:
   ```javascript
   startScratchGameLoop(cid) {
     if (this._scratchTimer) clearInterval(this._scratchTimer);
     this._scratchTimer = setInterval(() => {
       const el = document.getElementById(cid);
       if (!el) {
         clearInterval(this._scratchTimer);
         return;
       }
       const s = this.state;
       if (!s.scratchGamePlaying || s.scratchWin) {
         clearInterval(this._scratchTimer);
         return;
       }
       ...
   ```
3. In `checkScratchCollision(cid)`:
   ```javascript
   const el = document.getElementById(cid);
   if (el) {
     this.renderScratchBlocks(el, cid);
   }
   ```

### Required Fix 2: Harden `story-studio` TTS & Use Proper Chinese Speech Utterance
In `js/simulators.js:speakStoryScene(sceneIdx, cid)`:
Do not call `AppState.speakEnglish(textToSpeak)` for Chinese story narration. Instead, handle Chinese narration directly with `zh-TW` and robust `try/catch`:
```javascript
  speakStoryScene(sceneIdx, cid) {
    ...
    const textToSpeak = texts[sceneIdx] || texts[0];

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
  }
```
And in `js/app.js:speakEnglish(text)`:
Wrap `window.speechSynthesis.cancel()` and `window.speechSynthesis.speak(utter)` in a `try/catch` block to guard against device errors.

---

## 5. Verification Method

Once Worker M1 applies the fixes, run:

1. **Verify Offline Bundles**:
   ```bash
   npm run build
   ```
2. **Verify Scratch Loop Lifecycle & Nav Away**:
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
3. **Verify Story Studio Speech Synthesis Resilience**:
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
4. **Verify Brand Name Prohibition**:
   ```bash
   grep -rnI -E "ASUS|華碩" data/ js/ css/ index.html dist/
   ```
   *Expected: Exit code 1 (0 matches).*
