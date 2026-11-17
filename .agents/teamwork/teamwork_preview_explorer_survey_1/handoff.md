# 🔍 Codebase Architecture & Curriculum Survey Report

**Explorer**: Survey Explorer 1  
**Working Directory**: `/home/antigravity/digital-explorer-academy/.agents/teamwork/teamwork_preview_explorer_survey_1`  
**Target Files Analyzed**:
- `/home/antigravity/digital-explorer-academy/data/curriculum.js`
- `/home/antigravity/digital-explorer-academy/js/simulators.js`
- `/home/antigravity/digital-explorer-academy/js/app.js`
- `/home/antigravity/digital-explorer-academy/css/styles.css`
- `/home/antigravity/digital-explorer-academy/js/island-scene.js`
- `/home/antigravity/digital-explorer-academy/tests/run-all-tests.js`
- `/home/antigravity/digital-explorer-academy/scripts/build-bundle.js`

---

## 1. Observation

### 1.1 Curriculum Data Schema (`data/curriculum.js`)

`data/curriculum.js` exposes two primary globals on `window`:
- `window.CURRICULUM_WORLDS`: Array of World definitions (currently 3 worlds: `world-1`, `world-2`, `world-3`).
- `window.CURRICULUM_LESSONS`: Array of Lesson definitions (currently 14 lessons: 4 in World 1, 4 in World 2, 6 in World 3).

#### World Schema (`window.CURRICULUM_WORLDS[i]`)
Direct inspection of lines 24–55:
```javascript
{
  id: 'world-2',                 // String unique identifier ('world-1', 'world-2', 'world-3')
  number: 'World 2',             // Display badge string ('World 1', 'World 2', etc.)
  title: '網路探險家',            // Traditional Chinese title
  titleEn: 'Internet Explorer, Smart Search & Safety', // English subtitle
  subtitle: '掌握瀏覽器分頁、在地美食與作業黃金搜尋公式、識破廣告與防詐騙護盾！', // 1-sentence summary
  icon: '🌐',                    // Single emoji icon
  themeColor: '#059669',         // Hex color theme (used for cards, badges, buttons)
  badgeName: '網路領航員勳章'      // Badge awarded upon completing all lessons in this world
}
```

#### Lesson Schema (`window.CURRICULUM_LESSONS[i]`)
Direct inspection of lines 417–490 (`w2-l1`):
```javascript
{
  id: 'w2-l1',                   // String unique ID (format: 'w{worldNum}-l{lessonNum}')
  worldId: 'world-2',            // Matches parent World id
  number: '2.1',                 // Number badge string
  title: '瀏覽器駕駛員：分頁、網址與書籤', // Traditional Chinese title
  titleEn: 'Browser Cockpit: Tabs, URLs, Refresh & Bookmarks', // English subtitle
  icon: '🧭',                    // Single emoji icon
  duration: '10 分鐘',           // Estimated duration
  xp: 120,                       // XP points awarded on quiz mastery
  summary: '認識 Chrome / Edge 瀏覽器、管理分頁 (Tabs)、把常用網站加入最愛書籤 (Bookmark)！',
  vocab: [                       // Array of bilingual tech keywords (3–5 items)
    {
      en: 'Browser',             // English tech keyword (used in Web Speech API pronunciation)
      zh: '瀏覽器',               // Traditional Chinese translation
      desc: '帶你去網路世界的太空船（例如 Google Chrome 或 Microsoft Edge）' // Kid-friendly description
    }
  ],
  cards: [                       // Array of learning slides (1–3 cards)
    {
      title: '🚀 認識你的網路太空船：瀏覽器 (Browser)',
      titleEn: 'Getting Around Chrome & Microsoft Edge',
      body: `...Markdown formatted content with bolding, lists, and backticks...`,
      highlight: '⭐ 必學神技（加入書籤 Bookmark）：在網址列最右邊有一顆「星星 ★ 圖示」！...'
    }
  ],
  simulator: {                   // Interactive simulator configuration
    type: 'browser-pilot',       // Simulator type string dispatched in window.Simulators.render()
    title: '🎮 瀏覽器駕駛艙模擬器：整理分頁與加入書籤 ★',
    instruction: '在模擬瀏覽器中完成 3 個駕駛任務：1) 關掉 2 個沒在用的雜亂分頁 2) 點擊網址列右邊的「★ 星號」把數位學院加入書籤 3) 點擊「＋」開新分頁進入搜尋引擎！'
  },
  quiz: [                        // Array of multiple-choice mastery questions (2–3 questions)
    {
      q: '想把常去的學習網站存起來，下次打開瀏覽器一秒就能點進去，要按網址列右邊的什麼圖示？',
      options: [
        '星星圖示 ★ 加入書籤 (Bookmark)',
        '右上角的紅叉叉 ✕',
        '電源關機鍵'
      ],
      correct: 0,                // 0-based index of correct option
      explain: '完全正確！星星 ★ 就是書籤 (Bookmark)，把好網站收藏在書籤列超方便！'
    }
  ]
}
```

---

### 1.2 Interactive Lab Registration & Rendering Engine (`js/simulators.js` & `js/app.js`)

#### Registration in `js/simulators.js`
In `js/simulators.js`, `window.Simulators` has two core mechanisms:
1. **Central State (`Simulators.state`)**: Holds active reactive state for interactive tasks (e.g. `tabsClosed`, `searchScenarioIdx`, `selectedKeywordIdx`, `coachStep`, `imgSubjectIdx`, etc.).
2. **Dispatcher Method (`Simulators.render(simConfig, containerId)`)**:
   Lines 76–108 in `js/simulators.js`:
   ```javascript
   render(simConfig, containerId) {
     const el = document.getElementById(containerId);
     if (!el || !simConfig) return;

     switch (simConfig.type) {
       case 'win11-power': return this.renderWin11Power(el, containerId);
       case 'win11-window': return this.renderWin11Window(el, containerId);
       case 'typing-dojo': return window.TypingDojo.render(containerId);
       case 'shortcut-rescue': return this.renderShortcutRescue(el, containerId);
       case 'browser-pilot': return this.renderBrowserPilot(el, containerId);
       case 'search-detective': return this.renderSearchDetective(el, containerId);
       case 'scam-shield': return this.renderScamShield(el, containerId);
       case 'ai-prompt-builder': return this.renderAiPromptBuilder(el, containerId);
       case 'ai-skill-coach': return this.renderAiSkillCoach(el, containerId);
       case 'ai-image-studio': return this.renderAiImageStudio(el, containerId);
       default:
         el.innerHTML = `<div class="sim-box" style="text-align:center;">...fallback...</div>`;
     }
   }
   ```
3. **Interactive Handlers**: Each lab implements its own sub-methods (e.g. `Simulators.browserAction(action, cid)`, `Simulators.selectCoachSkill(idx, cid)`). When an action occurs, it modifies `Simulators.state` and re-invokes the simulator's render function on the element `cid`.
4. **Integration with `UIModal` & Web APIs**:
   - Uses `window.UIModal.toast()` and `window.UIModal.alert()` for notifications.
   - Uses `navigator.clipboard.writeText()` with fallback for copying prompts.
   - Uses `window.AppState.speakEnglish(text)` for Web Speech API text-to-speech pronunciation.

#### Invocation in `js/app.js`
In `js/app.js`, `renderLessonView(mainEl)` manages the 3-step lesson pipeline:
1. `this.lessonStep === 'learn'`: Renders `lesson.cards` with Markdown formatting + `lesson.vocab` chip grid with `🔊 發音` audio buttons.
2. `this.lessonStep === 'lab'`: Renders instruction banner and mount target:
   ```html
   <div id="lesson-simulator-mount"></div>
   ```
   Followed at line 524 by:
   ```javascript
   if (this.lessonStep === 'lab') {
     window.Simulators.render(lesson.simulator, 'lesson-simulator-mount');
   }
   ```
3. `this.lessonStep === 'quiz'`: Renders multiple-choice questions `lesson.quiz`. When all questions are answered correctly (`isQuizAllCorrect`), calls `this.completeLesson(lessonId, xp)`, awarding 3 stars and adding XP to the active kid's profile.

---

### 1.3 World 2 Structure & Fitting Lesson 2.5

#### Current Lessons in World 2
| ID | No. | Title | Sim Type | Vocab Count | Quiz Count |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `w2-l1` | 2.1 | 瀏覽器駕駛員：分頁、網址與書籤 | `browser-pilot` | 5 | 2 |
| `w2-l2` | 2.2 | 搜尋小偵探：黃金關鍵字公式與找美食/查資料實戰 | `search-detective` | 5 | 3 |
| `w2-l3` | 2.3 | 網路安全防護盾：保護隱私與識破詐騙視窗 | `scam-shield` | 5 | 2 |
| `w2-l4` | 2.4 | 網路禮儀與 20-20-20 護眼超人 | `quiz-challenge` | 4 | 2 |

#### Design for Lesson 2.5: Google Maps for Family Trips
- **ID**: `w2-l5`, `number: '2.5'`, `worldId: 'world-2'`, `xp: 160`, `duration: '12 分鐘'`
- **Title**: `生活地圖小導遊：用 Google Maps 規劃全家出遊、街景小黃人與真實評價`
- **TitleEn**: `Google Maps Explorer: Family Trip Directions, Street View & Real Reviews`
- **Icon**: `🗺️`
- **Vocab**:
  1. `Google Maps` (Google 地圖)
  2. `Directions` (路線導航 — 步行/公車捷運/開車)
  3. `Street View` (街景時光機 / 街景小黃人 Pegman)
  4. `Review & Rating` (星級與評論 — 認清真實評價 vs 刷洗的五星)
  5. `Save / Pin` (儲存地點與圖釘標籤)
- **Interactive Simulator (`maps-navigator`)**:
  - Interactive mock Google Maps interface with 3 mission tabs:
    1. **路線規劃 (Directions)**: Select starting point (台北車站) and destination (兒童新樂園 / 動物園), toggle between 🚶 步行, 🚌 大眾運輸, 🚗 開車, observing travel time, fare, and transfer steps.
    2. **街景探險家 (Street View)**: Drag or click the Pegman (街景小黃人 🚶‍♂️) onto the map to open a 360-degree interactive panorama view of the entrance and storefront, finding landmarks before arriving.
    3. **評論偵探 (Review Detective)**: Compare Restaurant A (5.0★ with 4 reviews created yesterday offering free drinks for 5 stars) vs Restaurant B (4.4★ with 1,280 detailed reviews with photos and honest kid-friendly mentions).

---

### 1.4 World 3 Structure & Designing World 4 (數位創作與程式入門 — Future World)

#### Current World 3 Structure
World 3 contains 6 lessons:
- 3.1: 認識 AI 小幫手：AI 是什麼？不是什麼？ (`quiz-challenge`)
- 3.2: 提示詞魔法公式 ＋ 用 AI 當你的雙語英文家教 (`ai-prompt-builder`)
- 3.3: 請 AI 教我學新技能！打造你的專屬教練 (`ai-skill-coach`)
- 3.4: AI 繪圖設計師：五要素圖像提示詞魔法 (`ai-image-studio`)
- 3.5: AI 是教練，不是代寫槍手：聰明寫作業守則 (`quiz-challenge`)
- 3.6: AI 真假偵探與安全守則：畢業總測驗！ (`quiz-challenge`)

#### World 4 Specification (`world-4`)
```javascript
{
  id: 'world-4',
  number: 'World 4',
  title: '數位創作與程式入門',
  titleEn: 'Digital Creativity & Coding Playground',
  subtitle: '掌握學校簡報魔法、Scratch 積木遊戲設計、打造結合 AI 的圖文冒險故事！',
  icon: '🚀',
  themeColor: '#7c3aed',         // Violet / Purple theme
  badgeName: '數位創意大師勳章'
}
```

#### Lesson 4.1: Presentation Magic (Google Slides / Canva Basics for School Reports)
- **ID**: `w4-l1`, `number: '4.1'`, `xp: 150`, `duration: '12 分鐘'`, `icon: '📊'`
- **Title**: `簡報魔法秀：學校報告必學 Google Slides / Canva 設計心法`
- **TitleEn**: `Presentation Magic: Slide Layouts, Clean Fonts & Visual Impact`
- **Vocab**:
  1. `Slide` (投影片 / 簡報頁)
  2. `Layout` (版面配置 — 圖文黃金比例)
  3. `Bullet Points` (條列重點 — 不放落落長的作文)
  4. `Contrast` (顏色對比 — 深底亮字/淺底深字好閱讀)
  5. `Present (Slideshow)` (全螢幕放映 — 勇敢上台分享)
- **Simulator (`slide-studio`)**:
  - Interactive "Messy Slide Rescue": An ugly, hard-to-read slide (black text on dark purple, 15 lines of dense paragraph text, overlapping images).
  - The student completes 3 interactive fixes:
    1. Apply "Rule of 3" bullet points (一鍵將長文濃縮成 3 大亮點).
    2. Adjust contrast & clean theme (切換高對比主題與舒適字體).
    3. Add a hero visual with caption (插入焦點大圖與圖說).
    4. Click `▶️ 放映模式` to preview the polished presentation.

#### Lesson 4.2: Scratch Coding Playground (Events, Loops, Catch-the-Apple Game)
- **ID**: `w4-l2`, `number: '4.2'`, `xp: 220`, `duration: '15 分鐘'`, `icon: '🐱'`
- **Title**: `Scratch 積木程式樂園：事件、迴圈與接蘋果小遊戲實戰`
- **TitleEn**: `Scratch Coding Playground: Events, Loops & Making a Catch Game`
- **Vocab**:
  1. `Event / When Clicked` (事件 / 當綠旗被點擊時)
  2. `Loop (Forever / Repeat)` (迴圈 / 重複無限次)
  3. `Condition (If...Then)` (條件判斷 / 如果碰到...就...)
  4. `Variable (Score)` (變數 / 計分板得分)
  5. `Sprite` (角色精靈 — 遊戲裡的碗與蘋果)
- **Simulator (`scratch-blocks`)**:
  - Interactive visual block-coding bench on the left, playable HTML5 2D canvas game on the right.
  - Students snap 3 core coding blocks into place:
    1. `當 綠旗 🚩 被點擊` -> `重複無限次` -> `X 座標設為 滑鼠 X` (碗跟隨滑鼠/方向鍵左右移動).
    2. `蘋果掉落迴圈`: `Y 座標改變 -5` -> `如果 Y < -150 那麼 回到上方隨機 X 重新落下`.
    3. `碰撞與計分`: `如果 碰到 [碗] 那麼 [播放接住音效] + [變數 得分 + 1]`.
  - Once blocks are placed, the mini-game runs live: kids can actually catch falling apples with the bowl, watch the score tick up from 0 to 10, with fireworks and celebratory sounds.

#### Lesson 4.3: Audio & Visual Storytelling (Combining AI Story + AI Image Prompts)
- **ID**: `w4-l3`, `number: '4.3'`, `xp: 240`, `duration: '15 分鐘'`, `icon: '🎬'`
- **Title**: `影音與 AI 圖文故事家：打造你的第一本原創冒險繪本`
- **TitleEn**: `Audio & Visual Storytelling: Crafting Your First AI Adventure Book`
- **Vocab**:
  1. `Story Arc` (故事曲線 — 開頭、冒險高潮、歡樂結局)
  2. `Storyboard` (分鏡腳本 — 一頁圖配一小段文字)
  3. `Voiceover / Narrator` (旁白配音 / 朗讀)
  4. `Caption` (圖說 — 圖片旁邊的文字解說)
  5. `Export` (匯出作品 — 下載給全家人看)
- **Simulator (`story-studio`)**:
  - 3-Scene Interactive Picture Book Builder (Scene 1: 出發冒險, Scene 2: 遇見挑戰, Scene 3: 智慧解題).
  - Student selects hero, companion, setting, and plot twist.
  - Combines the 4-part AI Story Prompt + 5-ingredient Image Prompt to generate 3 pages with illustrations and text.
  - Uses in-page Web Speech API (`window.speechSynthesis`) to read the story out loud in Traditional Chinese / English.
  - Includes a "Print / Save Storybook" button for kids to share their creation.

---

### 1.5 Hardware Brand Name Audit (`ASUS` / `華碩`)

Tool execution:
```bash
grep -rnI -E "ASUS|華碩" /home/antigravity/digital-explorer-academy/
```
Output results:
- `PROJECT_HANDOFF.md` line 19 & line 104 (documents the constraint: "Do NOT include any laptop hardware brand names (e.g., no ASUS or 華碩)").
- `.agents/teamwork/ORIGINAL_REQUEST.md` line 18 (prompt instruction).
- Agent dispatch and briefing files in `.agents/teamwork/`.

**Zero occurrences** found in:
- `data/curriculum.js`
- `data/typing-drills.js`
- `js/app.js`
- `js/simulators.js`
- `js/island-scene.js`
- `js/typing-dojo.js`
- `js/ui-modal.js`
- `css/styles.css`
- `index.html`
- `scripts/build-bundle.js`
- `tests/run-all-tests.js`

All references in UI and documentation are strictly generic: **Windows 11 筆電** or **筆電**.

---

## 2. Logic Chain

1. **State & Architecture Modularity**:
   - `data/curriculum.js` is pure data. Any new world or lesson added automatically flows into `js/app.js` via `window.CURRICULUM_WORLDS` and `window.CURRICULUM_LESSONS`.
   - `js/app.js` renders navigation, world sections, and lesson cards dynamically based on `filter(l => l.worldId === world.id)`.
   - `js/simulators.js` acts as a pure plugin renderer: given `simConfig.type`, it renders into `<div id="lesson-simulator-mount"></div>`.

2. **Impact on Test Suite (`tests/run-all-tests.js`)**:
   - Line 100 currently checks: `assert(Array.isArray(window.CURRICULUM_LESSONS) && window.CURRICULUM_LESSONS.length === 14, 'All 14 curriculum lessons are loaded');`
   - When Lesson 2.5 and World 4 (4.1, 4.2, 4.3) are added, the lesson count increases from 14 to 18.
   - The test script iterates `for (const lesson of window.CURRICULUM_LESSONS)` and tests learn -> lab -> quiz for every lesson.
   - Therefore, updating the test assertion count to 18 and adding test cases for the new simulator types (`maps-navigator`, `slide-studio`, `scratch-blocks`, `story-studio`) ensures 100% test coverage without breaking existing tests.

3. **Impact on 3D Adventure Island Scene (`js/island-scene.js`)**:
   - `js/island-scene.js` currently calculates progress for `world-1`, `world-2`, and `world-3` (lines 103–108).
   - Island 1 is a Sea Island (`createSeaIsland`), Island 2 is a Sea Island (`createSeaIsland`), Island 3 is a Sky Island (`createSkyIsland`).
   - For World 4, Island 4 can be a futuristic Cyber/Creative Island or Creative Cloud Academy, or `island-scene.js` can gracefully support 4 quick chips and progress tracking for `world-4`.

4. **Bundler Portability (`scripts/build-bundle.js`)**:
   - Bundles `css/styles.css`, `js/vendor/three.min.js`, `js/island-scene.js`, `js/ui-modal.js`, `data/typing-drills.js`, `data/curriculum.js`, `js/typing-dojo.js`, `js/simulators.js`, and `js/app.js` in exact dependency order into `dist/digital_explorer_academy.html`.
   - No external build tools (Webpack/Vite) needed; standard Node.js script.

---

## 3. Caveats

1. **Test Assertion Count in `tests/run-all-tests.js`**:
   `tests/run-all-tests.js` has hardcoded assertion counts (`14 curriculum lessons`). The test runner must be updated to expect 18 lessons and 4 worlds, and specific assertion blocks for the 4 new simulators should be added so the test suite validates them thoroughly.
2. **`island-scene.js` Total Count Helpers**:
   Lines 105–106 have `w2Total = ... || 4`. When Lesson 2.5 is added, `w2Total` becomes 5. World 4 needs its own total count (`w4Total = 3`) and quick-select chip.
3. **Brand Name Discipline**:
   Any new cards or instructions for Lesson 2.5 and World 4 must strictly adhere to the brand rule: never mention `ASUS` or `華碩`, only generic "Windows 11 筆電".
4. **Kid Accessibility for Ages 8 & 10**:
   All interactive labs must have generous click/touch targets (min 44px), visual feedback (color changes, emojis, progress bars), and bypass complex keyboard input where simple clickable blocks or choices can convey the concept without frustration.

---

## 4. Conclusion & Recommended Action Plan

### Structure Summary Table
| Item | World ID | Lesson ID | Lesson Title | Sim Type | Recommended Key Activities |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **New Lesson 2.5** | `world-2` | `w2-l5` | 2.5 生活地圖小導遊：用 Google Maps 規劃全家出遊、街景小黃人與真實評價 | `maps-navigator` | 1) 規劃開車 vs 捷運路線 2) 拖曳小黃人看街景 3) 識破洗星假評論 |
| **New World 4** | `world-4` | — | 數位創作與程式入門 (Future World) | — | 包含簡報魔法、Scratch 積木遊戲、AI 圖文冒險故事 |
| **New Lesson 4.1** | `world-4` | `w4-l1` | 4.1 簡報魔法秀：學校報告必學 Google Slides / Canva 設計心法 | `slide-studio` | 拯救混亂簡報：3 大條列要點、色調對比、插入圖片放映 |
| **New Lesson 4.2** | `world-4` | `w4-l2` | 4.2 Scratch 積木程式樂園：事件、迴圈與接蘋果小遊戲實戰 | `scratch-blocks` | 拼裝事件、迴圈與碰撞積木，在右側 Canvas 玩接蘋果遊戲 |
| **New Lesson 4.3** | `world-4` | `w4-l3` | 4.3 影音與 AI 圖文故事家：打造你的第一本原創冒險繪本 | `story-studio` | 選擇角色與情節，組合繪圖與故事 Prompt，用語音朗讀有聲書 |

### Files to Modify in Implementation Phase:
1. `data/curriculum.js`: Add `world-4` to `CURRICULUM_WORLDS`, add `w2-l5`, `w4-l1`, `w4-l2`, `w4-l3` to `CURRICULUM_LESSONS`.
2. `js/simulators.js`: Add cases and render methods for `maps-navigator`, `slide-studio`, `scratch-blocks`, `story-studio`.
3. `css/styles.css`: Add styles for `world-4` accent colors (`--w4-color: #7c3aed`), maps mockup, slide editor, scratch blocks, and story canvas.
4. `js/island-scene.js`: Add Island 4 / World 4 support and quick chip navigation.
5. `tests/run-all-tests.js`: Update test assertions from 14 to 18 lessons, adding automated tests for each new simulator.
6. `PROJECT_HANDOFF.md`: Update changelog and roadmap status.

---

## 5. Verification Method

To verify the findings independently:

1. **Verify Brand Name Absence**:
   ```bash
   grep -rnI -E "ASUS|華碩" /home/antigravity/digital-explorer-academy/data /home/antigravity/digital-explorer-academy/js /home/antigravity/digital-explorer-academy/css
   ```
   *Expected output: No matches.*

2. **Verify Curriculum Structure & Current Lessons via Node**:
   ```bash
   node -e "
     global.window = {};
     require('./data/curriculum.js');
     console.log('Worlds:', window.CURRICULUM_WORLDS.length);
     console.log('Lessons:', window.CURRICULUM_LESSONS.length);
   "
   ```
   *Expected output: 3 worlds, 14 lessons.*

3. **Verify Simulator Types**:
   ```bash
   node -e "
     global.window = {};
     require('./data/curriculum.js');
     const types = new Set(window.CURRICULUM_LESSONS.map(l => l.simulator.type));
     console.log('Registered Sim Types:', Array.from(types));
   "
   ```

4. **Verify Test Baseline**:
   ```bash
   npm test
   ```
   *Expected output: 405 / 405 PASS (100%).*
