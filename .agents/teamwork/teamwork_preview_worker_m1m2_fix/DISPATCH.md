## 2026-11-13T06:21:59Z
You are the M1/M2 Fix Worker (Iteration 2).
Your working directory is: /home/antigravity/digital-explorer-academy/.agents/teamwork/teamwork_preview_worker_m1m2_fix

MANDATORY: First read `/home/antigravity/digital-explorer-academy/.agents/teamwork/ORIGINAL_REQUEST.md`, `/home/antigravity/digital-explorer-academy/PROJECT.md`, and `/home/antigravity/digital-explorer-academy/.agents/teamwork/teamwork_preview_challenger_m1m2_2/handoff.md`.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Your task: Fix the 2 confirmed bugs reported by Reviewer 2 and Challenger 2:
1. In `/home/antigravity/digital-explorer-academy/js/simulators.js`:
   - **Fix 1 (`scratch-blocks` lifecycle & null guard)**:
     - In `renderScratchBlocks(el, cid)`: add `if (!el) return;` at the very top.
     - In `startScratchGameLoop(cid)`: inside the `setInterval` callback, check `const el = document.getElementById(cid); if (!el) { clearInterval(this._scratchTimer); this._scratchTimer = null; return; }`, and also clear `this._scratchTimer` if `!s.scratchGamePlaying || s.scratchWin`.
     - In `checkScratchCollision(cid)`: guard `const el = document.getElementById(cid); if (el) this.renderScratchBlocks(el, cid);`.
   - **Fix 2 (`story-studio` Chinese TTS)**:
     - In `speakStoryScene(sceneIdx, cid)`: do NOT route Chinese story text through `AppState.speakEnglish()`. Instead, use `window.speechSynthesis` directly with `u.lang = 'zh-TW'`, `u.rate = 0.9`, wrapped in `try/catch` so if `speechSynthesis` is undefined or throws, it degrades gracefully without uncaught exceptions, and show the toast `🔊 正在為你朗讀第 ${sceneIdx + 1} 幕故事有聲書...`.
2. In `/home/antigravity/digital-explorer-academy/js/app.js`:
   - In `speakEnglish(text)`: wrap `window.speechSynthesis.cancel()` and `window.speechSynthesis.speak(utter)` in a `try/catch` block so audio device errors never cause uncaught exceptions.
3. Verification:
   - Run `npm run build`.
   - Run BOTH empirical reproduction scripts from Challenger 2's handoff (`scratch-blocks` nav-away lifecycle test AND `story-studio` throwing `speechSynthesis` test) and confirm both pass with 0 uncaught exceptions.
   - Verify zero hardware brand names (`ASUS` / `華碩`).

Write your complete handoff report to `/home/antigravity/digital-explorer-academy/.agents/teamwork/teamwork_preview_worker_m1m2_fix/handoff.md` and send a concise summary via `send_message` to `a8df60e8f027b775b7b708930ce5f68f`.
