# 🚀 數位小探險家學院 (Digital Explorer Academy)
**Complete Parent Guide, Free Cloud Deployment & Curriculum Expansion Manual**

---

## 📂 Project Structure (Designed for Easy Expansion!)

```text
digital-explorer-academy/
├── index.html               # Main entry point (loads data & modules)
├── package.json             # Build & automated test scripts (`npm test`, `npm run build`)
├── vercel.json              # Zero-config Vercel / Cloudflare Pages routing
├── css/
│   └── styles.css           # Kid-friendly UI, modal dialogs & keyboard styling
├── data/
│   ├── typing-drills.js     # ⭐ EDIT THIS to add new typing drills & stages!
│   └── curriculum.js        # ⭐ EDIT THIS to add new lessons or new Worlds!
├── js/
│   ├── ui-modal.js          # In-page custom modal dialogs & toasts (iframe/sandbox-safe)
│   ├── typing-dojo.js       # 22-drill Bopomofo + English Typing Dojo engine (IME-safe)
│   ├── simulators.js        # Interactive labs (Win 11, Search Detective, AI Studios, Maps, Slides, Scratch, Story)
│   ├── island-scene.js      # Three.js 3D Floating Islands & Avatar navigation across 4 Worlds
│   └── app.js               # Profile manager, World Map, Vocab voice, Certificate
├── scripts/
│   └── build-bundle.js      # Bundles modular project into self-contained HTML artifact
└── tests/
    └── run-all-tests.js     # Automated DOM & interaction test suite (473 assertions)
```

---

## ☁️ How to Host Online for FREE (GitHub + Vercel or Cloudflare Pages)

Because this app is built as a **100% static, zero-cost web application**, you can host it online for free in under 2 minutes so each of your kids (ages 8 & 10) can open it on their own laptop:

### Option A: GitHub + Vercel (Recommended — 60 Seconds)
1. Create a new repository on [GitHub](https://github.com/new) (e.g., `kids-digital-academy`) and push the files in `/home/antigravity/digital-explorer-academy`.
2. Go to [vercel.com](https://vercel.com) and sign in with your GitHub account.
3. Click **Add New... → Project** and import your `kids-digital-academy` repository.
4. Leave all build settings as default (Static) and click **Deploy**.
5. Every time you add a new lesson to `data/curriculum.js` or `data/typing-drills.js` and push to GitHub, Vercel will automatically update the live site in 10 seconds!

### Option B: GitHub + Cloudflare Pages (Also 100% Free & Unlimited Bandwidth)
1. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
2. Select your GitHub repository.
3. Leave **Build command** blank and set **Build output directory** to `/`.
4. Click **Save and Deploy**!

---

## 🧩 How to Add More Lessons & Typing Drills Later

You mentioned you have many more lessons to add over time. We separated **all content data** into two clean files inside `data/` so you never have to touch the core code:

### 1. Adding More Typing Drills (`data/typing-drills.js`)
Open `data/typing-drills.js`. Inside `window.TYPING_DATA.categories`, you can add a new drill object to any stage (or create Stage 6, Stage 7, etc.):

```javascript
{
  id: 'custom-drill-1',
  name: '第 20 關：常用英文句子練習',
  nameEn: 'Level 20: Everyday English Sentences',
  tip: '保持手指在 F 與 J 基準鍵上，注意空白鍵節奏！',
  mode: 'english', // 'english' | 'zhuyin-keys' | 'chinese-real'
  text: 'i love learning new skills on my laptop'
}
```
The visual keyboard, finger guide colors, WPM counter, and star tracker will automatically pick it up!

### 2. Adding a New Lesson or a Whole New World (`data/curriculum.js`)
Open `data/curriculum.js`:
* To add a new **World** (for example, `World 5: 3D 建模與虛擬世界` or `World 6: 機器人與物聯網探險`), append an item to `window.CURRICULUM_WORLDS`.
* To add a new **Lesson** to an existing or new World, append an object to `window.CURRICULUM_LESSONS`:

```javascript
{
  id: 'w2-l5',
  worldId: 'world-2',
  number: '2.5',
  title: '用 Google 地圖規劃家庭小旅行',
  titleEn: 'Planning a Family Trip with Google Maps',
  icon: '🗺️',
  duration: '10 分鐘',
  xp: 150,
  summary: '學會用 Google Maps 查路線、計算搭捷運或開車的時間，還有看街景小黃人！',
  vocab: [
    { en: 'Directions', zh: '路線規劃', desc: '計算從 A 點到 B 點怎麼走最快' },
    { en: 'Street View', zh: '街景服務', desc: '把右下角的小黃人拖到地圖上，看到真實街道照片！' }
  ],
  cards: [
    {
      title: '🗺️ 標題一...',
      titleEn: 'English Subtitle...',
      body: '在這裡寫入支援 **粗體** 與 `程式碼標籤` 的課文內容...',
      highlight: '💡 重點提示框內容...'
    }
  ],
  simulator: {
    type: 'quiz-challenge', // Or reuse 'search-detective', 'ai-prompt-builder', 'typing-dojo', etc.
    title: '🎮 練習標題',
    instruction: '練習說明...'
  },
  quiz: [
    {
      q: '想看真實街道長什麼樣子，可以把 Google Maps 右下角的什麼拖到地圖上？',
      options: ['街景小黃人 (Pegman)', '小精靈', '垃圾桶'],
      correct: 0,
      explain: '答對了！小黃人放下去就能 360 度看真實街景喔！'
    }
  ]
}
```
