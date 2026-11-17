/**
 * ============================================================================
 * 🗺️ CURRICULUM DATA (data/curriculum.js)
 * ============================================================================
 * Modular, extensible lesson database for "數位小探險家學院 (Digital Explorer Academy)"
 *
 * HOW TO ADD NEW LESSONS OR WORLDS:
 * 1. Each World lives in `window.CURRICULUM_WORLDS`.
 * 2. Each Lesson lives in `window.CURRICULUM_LESSONS` with:
 *    - `id`: unique ID (e.g. 'w1-l5')
 *    - `worldId`: 'world-1' | 'world-2' | 'world-3' (or your own new world!)
 *    - `number`: display badge (e.g. '1.5')
 *    - `title`: Traditional Chinese title
 *    - `titleEn`: English subtitle
 *    - `icon`: emoji icon
 *    - `xp`: XP points awarded on completion
 *    - `vocab`: array of `{ en, zh, desc }` English tech keywords taught
 *    - `cards`: array of interactive learning slides (`{ title, titleEn, body, highlight, visualType }`)
 *    - `simulator`: interactive lab configuration (`type` can be 'win11-power', 'win11-window', 'typing-dojo', 'shortcut-rescue', 'browser-pilot', 'search-detective', 'scam-shield', 'quiz-challenge', 'ai-prompt-builder', 'ai-skill-coach', 'ai-image-studio')
 *    - `quiz`: array of multiple-choice questions to verify mastery and unlock stars!
 * ============================================================================
 */

window.CURRICULUM_WORLDS = [
  {
    id: 'world-1',
    number: 'World 1',
    title: '筆電小達人',
    titleEn: 'Windows 11 & Touch Typing',
    subtitle: '學會照顧筆電、視窗魔法、告別「老鷹一指神功」中英盲打與神級快捷鍵！',
    icon: '💻',
    themeColor: '#0284c7',
    badgeName: '筆電駕照勳章'
  },
  {
    id: 'world-2',
    number: 'World 2',
    title: '網路探險家',
    titleEn: 'Internet Explorer, Smart Search & Safety',
    subtitle: '掌握瀏覽器分頁、在地美食與作業黃金搜尋公式、識破廣告與防詐騙護盾！',
    icon: '🌐',
    themeColor: '#059669',
    badgeName: '網路領航員勳章'
  },
  {
    id: 'world-3',
    number: 'World 3',
    title: 'AI 魔法師',
    titleEn: 'AI Prompting, Skill Learning & Image Studio',
    subtitle: '駕馭 AI 提示詞公式、請 AI 一步步教你新技能、AI 繪圖五要素與安全守則！',
    icon: '🤖',
    themeColor: '#d97706',
    badgeName: 'AI 魔法師勳章'
  },
  {
    id: 'world-4',
    number: 'World 4',
    title: '數位創作與程式入門',
    titleEn: 'Digital Creativity & Coding Playground',
    subtitle: '掌握學校簡報魔法、Scratch 積木遊戲設計、打造結合 AI 的圖文冒險故事！',
    icon: '🚀',
    themeColor: '#7c3aed',
    badgeName: '數位創意大師勳章'
  },
  {
    id: 'world-5',
    number: 'World 5',
    title: 'Roblox 3D 遊戲工坊',
    titleEn: 'Roblox Studio 3D Map & Game Creator',
    subtitle: '從零學會 Roblox Studio 開發工具、親手打造 3D 跑酷 (Obby) 關卡、寫 Luau 腳本做金幣與機關，並解鎖多種遊戲類型！',
    icon: '🧱',
    themeColor: '#e11d48',
    badgeName: 'Roblox 建築大師勳章'
  }
];

window.CURRICULUM_LESSONS = [
  // ==========================================================================
  // WORLD 1: 筆電小達人 (WINDOWS 11 & TYPING)
  // ==========================================================================
  {
    id: 'w1-l1',
    worldId: 'world-1',
    number: '1.1',
    title: '保護筆電與正確開關機',
    titleEn: 'Laptop Care, Fn Keys & Safe Shut Down',
    icon: '🛡️',
    duration: '8 分鐘',
    xp: 100,
    summary: '學會保護你的全新 筆電、認識睡眠與關機的差別，以及音量與亮度調整！',
    vocab: [
      { en: 'Power', zh: '電源', desc: '開機與關機的電源標誌 (圓圈加一條直線)' },
      { en: 'Shut down', zh: '關機', desc: '今天不再用電腦時，把所有程式收好並完全關閉電源' },
      { en: 'Sleep', zh: '睡眠', desc: '只是去吃飯或上廁所，讓電腦暫時閉上眼睛休息省電' },
      { en: 'Restart', zh: '重新啟動', desc: '當電腦更新或怪怪的時候，關掉並自動重新開機' },
      { en: 'Battery', zh: '電池', desc: '右下角顯示還剩多少電量，低於 20% 就要插充電線囉！' }
    ],
    cards: [
      {
        title: '🎉 歡迎來到你的專屬 筆電！四個黃金保護守則',
        titleEn: '4 Golden Rules to Protect Your New Laptop',
        body: `恭喜你擁有了自己的專屬筆電！筆電就像精密的太空船，要讓它陪你很久，請記住這 **4 個超重要習慣**：
1. **雙手抱穩穩 (Two Hands Always)**：移動筆電時，先把螢幕蓋起來，用雙手像捧寶物一樣拿，絕對不單手抓螢幕！
2. **飲料離遠遠 (Drinks Far Away)**：水杯、珍奶、果汁一定要放在離筆電至少一個手臂遠的地方（鍵盤喝水就會生重病！）。
3. **蓋上螢幕前先檢查 (Check Before Closing)**：**這點超多人忘記！** 蓋螢幕前一定要確認鍵盤上沒有鉛筆、橡皮擦或耳機，不然一壓下去螢幕就會裂開！
4. **乾淨小手與散熱呼吸 (Clean Hands & Airflow)**：盡量在硬桌面上用筆電，不要放在厚棉被上擋住底部的散熱孔。`,
        highlight: '💡 小口訣：「雙手捧、水放遠、蓋前看一看、桌上好散熱！」'
      },
      {
        title: '🔆 認識 筆電鍵盤最上面一排：音量與亮度魔法鍵',
        titleEn: 'Function Row: Volume, Brightness & Wi-Fi',
        body: `看看你鍵盤最上面那排小按鍵（寫著 \`F1\` 到 \`F12\`）：
* 🔈 **喇叭圖案**：調整聲音大小（Volume Down / Up）或靜音（Mute）。
* ☀️ **太陽圖案**：調整螢幕暗一點或亮一點（Brightness）。
* 💬 **如果按了沒反應怎麼辦？** 看看鍵盤左下角有一顆 **\`Fn\` (Function 功能鍵)**！按住 \`Fn\` 再按上面的太陽或喇叭，或是按 \`Fn + Esc\` 切換模式就可以囉！
* 📶 **螢幕最右下角 (工作列 Taskbar)**：點一下右下角的 **Wi-Fi、喇叭、電池圖示**，也會跳出 Windows 11 的快速控制面板！`,
        highlight: '🔑 英文關鍵字：Volume (音量)、Brightness (亮度)、Battery (電池)'
      },
      {
        title: '⚡ 關機 (Shut down) vs. 睡眠 (Sleep) 差在哪裡？',
        titleEn: 'How to Properly Shut Down or Sleep in Windows 11',
        body: `**絕對不要直接長按電源鍵硬關機**（那樣就像別人正在寫作業時突然把他的本子搶走！）。
正確做法是：
1. 點擊螢幕下方正中間的 **田字號 Windows「開始 (Start)」按鈕**（或按鍵盤左下角的 \`Win\` 視窗鍵）。
2. 點擊右下角的 **電源圖示 (Power ⏻)**，你會看到三個選項：
   * 🌙 **睡眠 (Sleep)**：等一下還要回來用（例如去吃晚餐），電腦馬上睡著、一打開就能繼續。
   * 🛑 **關機 (Shut down)**：今天結束不用了、或要收進包包前，一定要選 **關機**，等燈號完全熄滅再收起來！
   * 🔄 **重新啟動 (Restart)**：電腦需要更新或變慢時使用。`,
        highlight: '⚠️ 重要提醒：要把筆電放進書包或保護套之前，一定要用「關機 (Shut down)」，不能只用睡眠，不然在包包裡會發燙沒電喔！'
      }
    ],
    simulator: {
      type: 'win11-power',
      title: '🎮 實戰模擬：桌面安全檢查與 Windows 11 正確關機任務',
      instruction: '步驟 1：先點選桌面上 3 個「會傷害筆電的危險物品」把它們移走！\n步驟 2：點選下方 Windows 11「開始按鈕 (田)」→「電源 ⏻」→ 選擇「關機 (Shut down)」完成任務！'
    },
    quiz: [
      {
        q: '今天已經做完所有功課準備睡覺，要把筆電收起來，應該在開始選單點哪一個？',
        options: [
          '關機 (Shut down)',
          '直接把電源線拔掉並用拳頭長按電源鍵',
          '把鉛筆夾在鍵盤中間直接用力蓋上螢幕'
        ],
        correct: 0,
        explain: '太棒了！今天不用電腦或要收進包包時，一定要選「關機 (Shut down)」。'
      },
      {
        q: '蓋上筆電螢幕之前，最重要的一個動作是什麼？',
        options: [
          '先把螢幕塗滿貼紙',
          '檢查鍵盤上有沒有放筆、橡皮擦或耳機，避免壓破螢幕',
          '把珍奶放在鍵盤正上方'
        ],
        correct: 1,
        explain: '完全正確！只要有一枝筆或耳機留在鍵盤上，蓋上螢幕就可能把液晶螢幕壓裂喔！'
      },
      {
        q: '英文單字「Battery」和「Shut down」分別是什麼意思？',
        options: [
          '電池 與 關機',
          '螢幕 與 放大',
          '遊戲 與 下載'
        ],
        correct: 0,
        explain: '答對了！Battery 是電池，Shut down 是關機！'
      }
    ]
  },

  {
    id: 'w1-l2',
    worldId: 'world-1',
    number: '1.2',
    title: '觸控板與 Windows 11 視窗魔法',
    titleEn: 'Touchpad Gestures, Right Click & Window Controls',
    icon: '🪟',
    duration: '10 分鐘',
    xp: 120,
    summary: '學會左鍵、右鍵秘密選單、雙指捲動，以及右上角三個視窗按鈕與左右分割畫面！',
    vocab: [
      { en: 'Click / Double Click', zh: '點一下 / 連點兩下', desc: '點一下是「選取」，快快連點兩下是「打開」！' },
      { en: 'Right Click', zh: '按右鍵', desc: '在觸控板右下角按一下（或兩指輕點），叫出「秘密功能選單」！' },
      { en: 'Scroll', zh: '捲動頁面', desc: '兩根手指一起在觸控板上往上或往下滑動看更多內容' },
      { en: 'Minimize (—)', zh: '最小化', desc: '把視窗暫時收進底下工作列，沒有關掉喔！' },
      { en: 'Maximize (□)', zh: '最大化', desc: '把視窗放大到填滿整個螢幕' }
    ],
    cards: [
      {
        title: '👆 觸控板 (Touchpad) 與滑鼠的三大絕招',
        titleEn: 'Left Click, Double Click, Right Click & 2-Finger Scroll',
        body: `鍵盤正下方那塊平滑的方塊叫做 **觸控板 (Touchpad)**，就算沒帶滑鼠也能超靈活操作：
1. **左鍵點一下 (Single Click)**：用一根手指輕點一下 = **「選取它」或「按按鈕」**。
2. **左鍵快快點兩下 (Double Click)**：在桌面圖示或資料夾上「噠噠」連點兩下 = **「打開它」**（如果點太慢會變成改名字喔！）。
3. **右鍵秘密選單 (Right Click)**：按觸控板右下角（或是**兩根手指同時輕點一下觸控板**）= **叫出「右鍵秘密選單」**！裡面有新增資料夾、複製、改名字等超多功能！
4. **雙指上下滑動 (Two-Finger Scroll)**：**兩根手指併攏**在觸控板上往上或往下滑，網頁就會乖乖上下捲動！`,
        highlight: '🎯 馬上試試看：現在用「兩根手指」在你的 觸控板上輕輕上下滑動，看看這個畫面會不會上下移動！'
      },
      {
        title: '🪟 每個視窗右上角的「三兄弟按鈕」(— □ ✕)',
        titleEn: 'The 3 Window Control Buttons: Minimize, Maximize, Close',
        body: `在 Windows 11 裡，你打開的每一個程式都住在一個「視窗 (Window)」裡。看看視窗**最右上角**永遠有三個按鈕：
* **\`—\` 最小化 (Minimize)**：把視窗暫時「縮到最底下工作列休息」，**東西不會不見**！再點一下底下的圖示就會彈回來。
* **\`□\` 最大化 / 還原 (Maximize / Restore)**：把視窗變大填滿整個螢幕；再按一次會變回原本大小。
* **\`✕\` 關閉 (Close)**：徹底把這個視窗關掉（關掉前記得先存檔！）。`,
        highlight: '✨ Windows 11 隱藏神技（分割畫面 Snap Layout）：把滑鼠移到右上角中間的「□ 最大化按鈕」上面停 1 秒（不要點下去），會跳出「左右分半」的格子！讓你左邊看教學、右邊打字練習！'
      },
      {
        title: '🔄 視窗被蓋住了怎麼辦？認識 Alt + Tab 切換術',
        titleEn: 'Switching Between Windows with Alt + Tab or Taskbar',
        body: `有時候你打開了瀏覽器，又打開了小畫家或記事本，結果原本的視窗被蓋在後面找不到了！不用慌張：
* **方法 1（看底下工作列）**：螢幕最下面一排叫做 **工作列 (Taskbar)**，底下有小橫線的圖示就是正在開著的程式，點它一下就會跳到最前面！
* **方法 2（鍵盤高手絕招 \`Alt + Tab\`）**：左手大拇指按住空白鍵旁邊的 **\`Alt\`** 不放，食指按一下 **\`Tab\`**，螢幕中間就會秀出所有打開的視窗讓你切換！`,
        highlight: '🔑 英文關鍵字：Window (視窗)、Minimize (最小化)、Maximize (最大化)、Close (關閉)'
      }
    ],
    simulator: {
      type: 'win11-window',
      title: '🎮 視窗忍者訓練場：練習右鍵選單、最小化與左右分割畫面！',
      instruction: '跟著模擬桌面上的任務提示：1) 在桌面空白處按「右鍵」打開秘密選單 2) 將「筆記本視窗」最大化 3) 使用「左右分割 (Snap Left/Right)」把兩個視窗並排！'
    },
    quiz: [
      {
        q: '在觸控板上想讓網頁上下捲動 (Scroll)，最棒的手勢是什麼？',
        options: [
          '用兩根手指併攏，在觸控板上輕輕上下滑動',
          '用拳頭敲觸控板',
          '把螢幕倒過來拿'
        ],
        correct: 0,
        explain: '太聰明了！兩指併攏上下滑動就是 Windows 11 觸控板的捲動手勢！'
      },
      {
        q: '視窗右上角的「— (一條橫線 Minimize)」按下去會發生什麼事？',
        options: [
          '電腦會直接爆炸',
          '視窗暫時縮小收到底下工作列，東西還在，點底下圖示就能叫回來',
          '把檔案永遠刪除'
        ],
        correct: 1,
        explain: '答對了！Minimize (最小化) 只是暫時收到底下工作列，不會刪除你的東西喔！'
      },
      {
        q: '想叫出「新增資料夾、重新命名」的秘密選單，應該怎麼點？',
        options: [
          '按右鍵 (Right Click) 或雙指輕點一下觸控板',
          '按電源鍵',
          '一直按空白鍵'
        ],
        correct: 0,
        explain: '沒錯！遇到不知道怎麼操作的地方，按一下「右鍵 (Right Click)」常常會有驚喜選單！'
      }
    ]
  },

  {
    id: 'w1-l3',
    worldId: 'world-1',
    number: '1.3',
    title: '告別老鷹一指神功：中英鍵盤與盲打道館',
    titleEn: 'Bye-Bye Eagle Typing! Home Row, Zhuyin & Shift的中/英 Switch',
    icon: '🦅',
    duration: '25 分鐘 (含 22 關打字道館)',
    xp: 250,
    summary: '找到 F 與 J 定位點、學會 10 指分工、一秒切換「中/英」輸入法、注音四聲與選字技巧！',
    vocab: [
      { en: 'Home Row', zh: '基準鍵排', desc: '手指平常休息的家：左手 A S D F、右手 J K L ;' },
      { en: 'Shift', zh: '切換鍵 / 大寫鍵', desc: '按一下切換「中/英」模式；按住不放加英文字母可打出大寫！' },
      { en: 'Space', zh: '空白鍵', desc: '最長的那顆鍵！用大拇指按，打英文空一格、打注音代表「一聲」！' },
      { en: 'Enter', zh: '確認 / 換行鍵', desc: '選好中文字後按 Enter 把底線消掉，或是換到下一行' },
      { en: 'Backspace', zh: '倒退刪除鍵', desc: '在右上角，打錯字時按一下可以把左邊的字擦掉' }
    ],
    cards: [
      {
        title: '🦅 為什麼我們要告別「老鷹一指神功 (Eagle Typing)」？',
        titleEn: 'From 1-Finger Eagle to 10-Finger Falcon!',
        body: `剛開始學電腦的人，常常低著頭、伸出兩根食指在鍵盤上東找西啄，就像老鷹抓小雞一樣，叫做 **「老鷹打字法」**！
但只要學會 **10 根手指住進自己的家 (Home Row 基準鍵)**：
1. **摸摸看神秘小凸點！** 現在伸出你的 **左手食指** 和 **右手食指**，摸摸鍵盤中間排的 **\`F\` (ㄑ)** 和 **\`J\` (ㄨ)**——上面是不是各有一條小小的凸起橫線？
2. **十指排排坐**：
   * 🖐️ **左手四指** 輕輕放在：**\`A\` (小指)、\`S\` (無名指)、\`D\` (中指)、\`F\` (食指)**
   * 🖐️ **右手四指** 輕輕放在：**\`J\` (食指)、\`K\` (中指)、\`L\` (無名指)、\`;\` (小指)**
   * 👍 **兩隻大拇指** 輕輕放在最長的 **\`Space\` (空白鍵)** 上！`,
        highlight: '🎯 神奇效果：只要食指摸到 F 和 J 的小凸點，眼睛不用低頭看鍵盤，十根手指就能自動找到所有按鍵！'
      },
      {
        title: '🔄 超重要！為什麼我想打中文，走出來的卻是英文字母？(中/英切換秘訣)',
        titleEn: 'How to Switch Between Chinese (中) and English (英) on Windows 11',
        body: `這是每個小朋友剛用 Windows 11 筆電最常卡住的地方！請記住這 **3 個通關密語**：
1. **看螢幕最右下角**：找到右下角時間旁邊，看它寫著 **\`中\`** 還是 **\`英\`**（旁邊通常還有一個 \`ㄅ\` 圖示）。
2. **按一下 \`Shift\` 鍵秒切換「中 / 英」**：
   * 當右下角是 **\`中\`** 時，打出來就是 **注音符號 (ㄅㄆㄇ)**。
   * 按一下鍵盤上的 **\`Shift\`** 鍵，右下角變成 **\`英\`**，打出來就是 **英文字母 (abc)**！再按一下 \`Shift\` 又變回 **\`中\`**！
3. **如果右下角完全沒有「中/英」只有「ENG」怎麼辦？**
   * 按住鍵盤左下角的 **\`Win\` (田字視窗鍵) + \`空白鍵 (Space)\`**（或是 \`Ctrl + Space\`），就能把「微軟注音 (中文繁體)」叫出來！
4. **為什麼打出來全是大寫英文 (ABCD) 且切不回注音？**
   * 檢查鍵盤最左邊的 **\`Caps Lock\` (大寫鎖定鍵)** 是不是亮燈了！再按一下 \`Caps Lock\` 把燈關掉就好囉！`,
        highlight: '⚡ 必背口訣：「右下角看中英，按一下 Shift 變中英；Win + 空白鍵換輸入法；Caps Lock 亮燈變大寫！」'
      },
      {
        title: '🇹🇼 微軟注音打字與「選字」四大神技',
        titleEn: 'Zhuyin Tone Keys (Space, 6, 3, 4, 7) & Choosing Words',
        body: `在 筆電鍵盤上打繁體中文超簡單：
1. **注音位置規律**：從最左邊一排往下看是 \`ㄅ ㄆ ㄇ ㄈ\`，第二排是 \`ㄉ ㄊ ㄋ ㄌ\`，由左到右非常有規律！
2. **五個聲調怎麼按？（打完注音一定要按聲調才會出字喔！）**
   * **一聲（陰平）**：按最長的 **\`空白鍵 (Space)\`**！（例如：媽 = \`ㄇ(A)\` + \`ㄚ(8)\` + \`空白鍵\`）
   * **二聲 \`ˊ\`**：按上排數字 **\`6\`**
   * **三聲 \`ˇ\`**：按上排數字 **\`3\`**
   * **四聲 \`ˋ\`**：按上排數字 **\`4\`**
   * **輕聲 \`˙\`**：按上排數字 **\`7\`**
3. **出現錯別字（同音字）怎麼選字？**
   * 當文字下面還有 **虛線 (底線)** 時，按一下鍵盤右下角的 **\`↓\` (往下方向鍵)** 或再按一下 **空白鍵**，就會跳出 **1. 2. 3. 選字清單**！
   * 按數字鍵選對的字，最後一定要按 **\`Enter\` 鍵**，把底線變不見才算真正打完喔！`,
        highlight: '🎹 接下來我們準備了 6 大階段、共 22 關循序漸進的「中英打字道館」（從 fff jjj、as asd、aaa bbb ccc 一路練到注音、數字排與短故事）！'
      }
    ],
    simulator: {
      type: 'typing-dojo',
      title: '🥋 老鷹變獵鷹：22 關中英盲打與注音特訓道館',
      instruction: '選擇下方的階段與關卡（建議從第 1 關 fff jjj 開始！），照著螢幕上的發光鍵盤與手指提示敲擊鍵盤。隨時可以點上方導覽列的「🎹 打字道館」回來練習！'
    },
    quiz: [
      {
        q: '雙手食指放在基準鍵排 (Home Row) 時，應該放在哪兩顆有「小凸點」的按鍵上？',
        options: [
          'F (ㄑ) 與 J (ㄨ)',
          'A 與 Z',
          '空白鍵 與 Enter 鍵'
        ],
        correct: 0,
        explain: '完全正確！左手食指放 F，右手食指放 J，摸到小凸點就不怕迷路！'
      },
      {
        q: '在微軟注音輸入法中，想在「中文注音 (中)」和「英文字母 (英)」之間快速切換，只要按一下哪顆鍵？',
        options: [
          '按一下 Shift 鍵 (或按 Win + 空白鍵切換輸入法)',
          '按電源鍵',
          '拔掉滑鼠'
        ],
        correct: 0,
        explain: '太棒了！按一下 Shift 就能在「中」和「英」之間秒速切換！'
      },
      {
        q: '打注音時，「一聲」要按空白鍵，那「三聲 ˇ」和「四聲 ˋ」分別在數字鍵幾號？',
        options: [
          '三聲是 3，四聲是 4（二聲是 6，輕聲是 7）！',
          '全部都按 Enter',
          '三聲是 9，四聲是 0'
        ],
        correct: 0,
        explain: '超好記對吧！三聲就是 3(ˇ)，四聲就是 4(ˋ)，二聲是 6(ˊ)，輕聲是 7(˙)！'
      }
    ]
  },

  {
    id: 'w1-l4',
    worldId: 'world-1',
    number: '1.4',
    title: '檔案管家與四大救命快捷鍵',
    titleEn: 'Files, Folders & Super Shortcuts (Ctrl+C, V, Z, S)',
    icon: '📁',
    duration: '10 分鐘',
    xp: 130,
    summary: '學會建立自己的專屬資料夾、幫檔案取好名字，以及 Ctrl+C 複製、Ctrl+V 貼上、Ctrl+Z 復原！',
    vocab: [
      { en: 'Folder', zh: '資料夾', desc: '黃色小夾子圖示，用來把檔案分類收整齊的抽屜' },
      { en: 'File', zh: '檔案', desc: '你寫的文章、畫的圖、拍的照片，都是一個個檔案' },
      { en: 'Copy (Ctrl + C)', zh: '複製', desc: '把選起來的字或圖「分身」記在電腦腦袋裡' },
      { en: 'Paste (Ctrl + V)', zh: '貼上', desc: '把剛剛複製的東西變出來貼到新地方' },
      { en: 'Undo (Ctrl + Z)', zh: '復原 (時光倒流)', desc: '不小心刪錯東西時，按 Ctrl + Z 馬上救回來！' }
    ],
    cards: [
      {
        title: '📁 資料夾 (Folder) 與檔案命名好習慣',
        titleEn: 'Organizing Folders & Naming Files Clearly',
        body: `想像你的電腦桌面就是你的書桌！如果把所有圖畫紙、作業全部亂丟在桌面上，很快就會找不到東西。
* **建立專屬資料夾 (New Folder)**：在桌面或「檔案總管 (File Explorer 黃色夾子圖示)」空白處 **按右鍵 → 新增 (New) → 資料夾 (Folder)**。
* **幫檔案取個好懂的名字**：
  * ❌ **壞名字**：\`未命名1.txt\`、\`aaaa.png\`、\`新建文件123\`（過三天你自己也忘記裡面是什麼！）
  * ✅ **好名字**：\`自然科_恐龍報告_小宇.docx\`、\`AI太空柴犬畫作.png\``,
        highlight: '💡 探險家任務：待會可以在筆電的「文件 (Documents)」裡建一個寫著自己名字的專屬資料夾喔！'
      },
      {
        title: '⚡ 電腦高手的四大「Ctrl 救命快捷鍵」',
        titleEn: 'The 4 Essential Ctrl Shortcuts Every Kid Must Know',
        body: `看看鍵盤最左下角那顆 **\`Ctrl\`** 鍵！左手小指或大拇指按住 \`Ctrl\` 不放，再按下面四個英文字母，就能施展電腦界最常使用的魔法：
1. **\`Ctrl + C\` = 複製 (Copy)**：先把一段文字反白選起來，按 \`Ctrl + C\`（記法：C 就是 Copy，也像複製分身）。
2. **\`Ctrl + V\` = 貼上 (Paste)**：點一下你想放的位置，按 \`Ctrl + V\`，剛剛複製的東西就貼上去了！（記法：V 就在 C 的正右邊，像個漏斗倒出來！）。
3. **\`Ctrl + Z\` = 復原時光機 (Undo)**：**最重要的一招！** 如果你打了一大篇字，不小心全刪掉了，千萬別哭！馬上按 **\`Ctrl + Z\`**，被刪掉的東西會像坐時光機一樣瞬間回來！
4. **\`Ctrl + S\` = 儲存 (Save)**：寫作業或畫圖時，隨時按 \`Ctrl + S\` 把心血存起來！`,
        highlight: '🦸‍♂️ 記住左下方三連星：Z (復原) → X (剪下) → C (複製) → V (貼上)，剛好在鍵盤左下角排成一排！'
      }
    ],
    simulator: {
      type: 'shortcut-rescue',
      title: '🎮 快捷鍵救援中心：用 Ctrl+Z、Ctrl+C、Ctrl+V 解救危機！',
      instruction: '完成三個救援任務：1) 小明不小心把整篇日記刪掉了，快幫他按復原！ 2) 把超長魔法咒語複製並貼上！ 3) 幫沒有名字的檔案取一個清楚的好名字並存檔！'
    },
    quiz: [
      {
        q: '如果你花了 20 分鐘打好一篇故事，結果手滑不小心把它全部刪光了！這時候第一件事該按什麼？',
        options: [
          '馬上按 Ctrl + Z (Undo 復原時光機) 把字救回來！',
          '把電腦關機重開',
          '大哭一場從頭重打'
        ],
        correct: 0,
        explain: '太棒了！Ctrl + Z 是電腦世界最偉大的時光機，不小心刪錯或畫錯時按它就能救回來！'
      },
      {
        q: '想把一段好用的 AI 提示詞「複製」起來，再到別的視窗「貼上」，要用哪兩個快捷鍵？',
        options: [
          '先按 Ctrl + C (複製)，再按 Ctrl + V (貼上)',
          '先按 Ctrl + P，再按 Ctrl + Q',
          '一直按空白鍵'
        ],
        correct: 0,
        explain: '完全正確！Ctrl + C 是 Copy (複製)，Ctrl + V 是 Paste (貼上)！'
      },
      {
        q: '下面哪一個檔案名稱最清楚，以後過了一個月還找得到？',
        options: [
          '2026_三年級自然科_火山報告.docx',
          'asdfghjkl.docx',
          '新檔案11111.docx'
        ],
        correct: 0,
        explain: '沒錯！寫清楚年份、科目與主題，以後一秒鐘就能找到檔案！'
      }
    ]
  },

  // ==========================================================================
  // WORLD 2: 網路探險家 (INTERNET EXPLORER, EFFECTIVE SEARCH & SAFETY)
  // ==========================================================================
  {
    id: 'w2-l1',
    worldId: 'world-2',
    number: '2.1',
    title: '瀏覽器駕駛員：分頁、網址與書籤',
    titleEn: 'Browser Cockpit: Tabs, URLs, Refresh & Bookmarks',
    icon: '🧭',
    duration: '10 分鐘',
    xp: 120,
    summary: '認識 Chrome / Edge 瀏覽器、管理分頁 (Tabs)、把常用網站加入最愛書籤 (Bookmark)！',
    vocab: [
      { en: 'Browser', zh: '瀏覽器', desc: '帶你去網路世界的太空船（例如 Google Chrome 或 Microsoft Edge）' },
      { en: 'Tab', zh: '分頁', desc: '瀏覽器最上面一格一格的標籤，讓你同時打開好幾個網頁' },
      { en: 'URL / Address Bar', zh: '網址列', desc: '網頁的門牌地址（例如 https://...）' },
      { en: 'Bookmark', zh: '書籤 (我的最愛)', desc: '網址列右邊的星星 ★，把常去的網站存起來一鍵打開' },
      { en: 'Refresh (↻)', zh: '重新整理', desc: '網頁卡住或沒顯示出來時，按轉圈圈箭頭重新載入一次' }
    ],
    cards: [
      {
        title: '🚀 認識你的網路太空船：瀏覽器 (Browser)',
        titleEn: 'Getting Around Chrome & Microsoft Edge',
        body: `要上網查資料或用我們的學習網站，首先要打開 **瀏覽器 (Browser)**，在 Windows 11 上最常見的是 **Google Chrome**（彩色圓圈）或 **Microsoft Edge**（藍綠波浪）。
看看瀏覽器最上面有兩排控制區：
1. **第一排：分頁列 (Tabs)**：
   * 點 **\`+\` 號**（或按 \`Ctrl + T\`）可以開一個 **新分頁 (New Tab)**，就像在書桌上多翻開一本書。
   * 點分頁上的 **\`✕\`**（或按 \`Ctrl + W\`）可以把看完的分頁關掉。
   * 💡 **好習慣**：不要一次開 50 個分頁都不關，筆電記憶體會被吃光變慢喔！
2. **第二排：導航按鈕與網址列 (URL Bar)**：
   * **\`←\` 上一頁 (Back)**：不小心點錯連結時，按左箭頭退回剛剛的頁面。
   * **\`↻\` 重新整理 (Refresh)**：網頁卡住時按一下重新載入。`,
        highlight: '⭐ 必學神技（加入書籤 Bookmark）：在網址列最右邊有一顆「星星 ★ 圖示」！點一下星星，就能把「數位小探險家學院」釘選在書籤列，以後打開瀏覽器點一下就進來了！'
      },
      {
        title: '🔒 網址列前面的「安全小鎖頭」與 https',
        titleEn: 'What is a URL and the HTTPS Safety Lock?',
        body: `每個網站都有獨一無二的門牌地址，叫做 **網址 (URL)**，例如：
* \`https://www.google.com\`
* \`https://zh.wikipedia.org\` (維基百科)
看看網址的結尾還能看出網站的身分喔：
* **\`.gov\` 或 \`.gov.tw\`**：政府機關網站（例如中央氣象署，資料最可靠！）
* **\`.edu\` 或 \`.edu.tw\`**：學校與教育機構網站
* **\`.org\`**：非營利組織（例如維基百科、科普基金會）
* **\`.com\`**：一般商業公司網站`,
        highlight: '🔑 英文關鍵字：Browser (瀏覽器)、Tab (分頁)、Bookmark (書籤)、Refresh (重新整理)'
      }
    ],
    simulator: {
      type: 'browser-pilot',
      title: '🎮 瀏覽器駕駛艙模擬器：整理分頁與加入書籤 ★',
      instruction: '在模擬瀏覽器中完成 3 個駕駛任務：1) 關掉 2 個沒在用的雜亂分頁 2) 點擊網址列右邊的「★ 星號」把數位學院加入書籤 3) 點擊「＋」開新分頁進入搜尋引擎！'
    },
    quiz: [
      {
        q: '想把常去的學習網站存起來，下次打開瀏覽器一秒就能點進去，要按網址列右邊的什麼圖示？',
        options: [
          '星星圖示 ★ 加入書籤 (Bookmark)',
          '右上角的紅叉叉 ✕',
          '電源關機鍵'
        ],
        correct: 0,
        explain: '完全正確！星星 ★ 就是書籤 (Bookmark)，把好網站收藏在書籤列超方便！'
      },
      {
        q: '如果在瀏覽器裡開了 80 個分頁 (Tabs) 都不關掉，電腦會發生什麼事？',
        options: [
          '筆電會變得很耗電、速度變慢，而且找不到真正要看的那一頁',
          '筆電會自己長出翅膀',
          '螢幕會變大兩倍'
        ],
        correct: 0,
        explain: '沒錯！看完的分頁隨手按 ✕ 關掉，保持 3～5 個分頁最清爽快速！'
      }
    ]
  },

  {
    id: 'w2-l2',
    worldId: 'world-2',
    number: '2.2',
    title: '搜尋小偵探：黃金關鍵字公式與找美食/查資料實戰',
    titleEn: 'Search Engine Mastery: Golden Keyword Formula & Spotting Ads',
    icon: '🔍',
    duration: '15 分鐘',
    xp: 180,
    summary: '學會如何精準下關鍵字！不管是「找某個地區好吃的餐廳」還是「查學校報告」，一眼看穿廣告與真評價！',
    vocab: [
      { en: 'Search Engine', zh: '搜尋引擎', desc: '幫你在幾十億個網頁中找資料的工具（如 Google）' },
      { en: 'Keyword', zh: '關鍵字', desc: '搜尋時輸入的「重點詞語」，用空白鍵隔開最有效！' },
      { en: 'Sponsored / Ad', zh: '贊助 / 廣告', desc: '搜尋結果最上面寫著「贊助」的連結，是花錢買的廣告喔！' },
      { en: 'Review / Rating', zh: '評價 / 評分', desc: '大家吃完或用完留下的星星分數與真實心得' },
      { en: 'Map', zh: '地圖', desc: 'Google Maps，用來找附近地點、看店面照片與路線' }
    ],
    cards: [
      {
        title: '🔑 為什麼有人一查就找到，有人卻什麼都找不到？「黃金關鍵字公式」！',
        titleEn: 'The Golden Keyword Formula: 2 to 4 Specific Words Separated by Spaces',
        body: `搜尋引擎（像是 Google）最喜歡 **「重點關鍵字 + 空白鍵」**，而不是超長又模糊的句子！
來看看三種搜尋方式的差別：
* ❌ **太模糊（只打 1 個字）**：輸入 \`好吃的\` 或 \`動物\`
  👉 電腦不知道你在哪個城市、想吃什麼，會跳出幾億個毫不相干的網頁！
* ❌ **太囉嗦（打整句碎碎念）**：輸入 \`請問電腦先生今天星期六我們全家想去台中玩有沒有什麼不會太貴又很好吃小朋友也喜歡的拉麵店呢謝謝\`
  👉 字太多反而把重點淹沒了！
* ✅ **黃金關鍵字公式（2～4 個精準詞，中間空一格）**：
  👉 **\`【地點 / 區域】 + 【想找的主題 / 食物】 + 【特別條件 / 推薦】\`**`,
        highlight: '🌟 黃金公式 = 「地點/主題」＋「具體項目」＋「條件詞（如：推薦、親子、菜單、兒童科普）」！'
      },
      {
        title: '🍜 生活實戰範例：想在某個地區找好吃的東西，關鍵字怎麼下最有效？',
        titleEn: 'Real-Life Example: Finding Great Food in a Specific Area!',
        body: `假設週末爸爸媽媽說：「今天由你來幫全家人查查看 **板橋車站附近** 有什麼好吃的 **早午餐** 或 **拉麵**！」這時候搜尋小偵探有 **3 招必殺技**：

1. **第一招：地點越精準越好（加上捷運站、商圈或行政區）**
   * 普通：\`台北 餐廳\`（範圍太大了！）
   * **超強關鍵字**：**\`板橋車站 拉麵 推薦\`** 或 **\`大安森林公園 親子餐廳 菜單\`**
2. **第二招：加上「時間或需求詞」過濾結果**
   * 想看有沒有位置或價錢：加上 **\`菜單 (Menu)\`**、**\`平價\`**、**\`必點\`**
   * 例如：**\`台中西區 義大利麵 平價 推薦\`**
3. **第三招：搭配 Google Maps 看「星星數 ＋ 評論則數 ＋ 最新照片」**
   * ⭐ **秘訣**：4.3 顆星而且有 **500 則以上評論** 的店，通常比「5.0 顆星但只有 2 個人評分」或「打卡送飲料洗出來的五星」更真實！還可以點開「最新評論」看看最近有沒有人說好吃！`,
        highlight: '🕵️‍♂️ 找美食萬用公式：【城市/捷運站/地標】＋【食物種類（拉麵/火鍋/早午餐）】＋【推薦 / 菜單 / 高評價】'
      },
      {
        title: '📚 功課查資料實戰 ＋ 小心「贊助 (Sponsored / Ad)」陷阱！',
        titleEn: 'Searching for School Topics & Spotting Paid Ads',
        body: `如果是要查學校自然科或社會科的知識呢？
* **功課搜尋公式**：**\`【主題名稱】 + 【你想知道的問題】 + 【兒童 / 科普 / 原理】\`**
  * 例如：想查為什麼會有地震，不要只打 \`地震\`（只會跑出今天的新聞），改打：**\`地震 成因 圖解 科普\`** 或英文 **\`how earthquakes happen for kids\`**！

⚠️ **搜尋結果最上面的「贊助 (Sponsored / Ad)」是什麼？**
* 當你在 Google 搜尋完，排在第 1、第 2 個的網站，左上角常常有一行小字寫著 **「贊助」** 或 **「Sponsored / Ad」**。
* 那代表 **「這家公司付錢給 Google 讓自己排在最上面」**，不代表它是最好的答案（有時候甚至是假冒網站！）。
* **聰明習慣**：往下滑一點，找沒有「贊助」標籤、而且來自可靠網站（如維基百科、科博館、公家機關、真實食記）的結果！`,
        highlight: '👀 眼睛放亮：點連結前先看兩眼——左上角有沒有寫「贊助 (Ad)」？網址正不正常？'
      }
    ],
    simulator: {
      type: 'search-detective',
      title: '🕵️‍♂️ 搜尋小偵探實戰：幫家人找在地美食 ＆ 查自然科報告！',
      instruction: '在下面 3 個真實任務中，挑選出「最有效的黃金關鍵字組合」，並在模擬 Google 搜尋結果中避開「贊助廣告陷阱」，點選最可靠的網站！'
    },
    quiz: [
      {
        q: '週末全家人去「台南安平」玩，你想上網找那邊好吃的豆花店，哪一組關鍵字最有效？',
        options: [
          '台南安平 豆花 推薦 菜單',
          '好吃的東西在哪裡',
          '請問台南有沒有賣甜的豆花謝謝你'
        ],
        correct: 0,
        explain: '太神啦！「地點 (台南安平) + 食物 (豆花) + 條件 (推薦 菜單)」一秒就能找到最棒的店！'
      },
      {
        q: '在 Google 搜尋結果的最上方，如果看到網址上面寫著「贊助 (Sponsored / Ad)」，代表什麼意思？',
        options: [
          '這是廠商花錢刊登的廣告，不一定是最客觀或最安全的結果，要多看下面幾則真結果',
          '代表政府保證這家世界第一名',
          '代表點進去電腦會送你獎學金'
        ],
        correct: 0,
        explain: '完全正確！「贊助 (Sponsored)」就是廣告，我們要學會跳過廣告看真正的優質內容！'
      },
      {
        q: '想查「獨角仙的一生」做自然課報告，但只打「獨角仙」卻跑出一堆賣甲蟲玩具的商店，怎麼改關鍵字最好？',
        options: [
          '獨角仙 一生 成長過程 科普',
          '甲蟲多少錢',
          '蟲蟲蟲蟲'
        ],
        correct: 0,
        explain: '答對了！加上「一生、成長過程、科普」就能精準找到教育知識，而不是購物網站！'
      }
    ]
  },

  {
    id: 'w2-l3',
    worldId: 'world-2',
    number: '2.3',
    title: '網路安全防護盾：保護隱私與識破詐騙視窗',
    titleEn: 'Online Safety Shield: Privacy Rules & Spotting Scams',
    icon: '🚨',
    duration: '12 分鐘',
    xp: 150,
    summary: '守住五個絕對不外洩的個人秘密，一眼看穿「恭喜中獎 iPad / 免費遊戲幣」假視窗！',
    vocab: [
      { en: 'Privacy', zh: '個人隱私', desc: '屬於你自己與家人的秘密資料，不能隨便告訴網友或網站' },
      { en: 'Password', zh: '密碼', desc: '保護帳號的鑰匙，要夠複雜而且只有自己和爸媽知道' },
      { en: 'Scam / Phishing', zh: '網路詐騙 / 釣魚', desc: '假裝送你禮物或嚇你電腦中毒，騙你點進去或輸入密碼的陷阱' },
      { en: 'Download', zh: '下載', desc: '把網路上的檔案存進電腦裡（下載前一定要先問爸媽！）' },
      { en: 'Block', zh: '封鎖', desc: '把不禮貌或奇怪的陌生人擋在門外' }
    ],
    cards: [
      {
        title: '🛡️ 絕對不告訴陌生網頁或網友的「五個秘密寶藏」',
        titleEn: 'The 5 Personal Secrets You Never Share Online',
        body: `在網路上，你看不到螢幕對面的人到底是誰。就算對方說他也是 9 歲的小朋友、或是說要送你免費寶物，也 **絕對不能說出這 5 個秘密**：
1. 📛 **真實全名 (Real Full Name)**（上網可以用可愛的暱稱，例如 ` + '`太空小柴`' + `）
2. 🏫 **讀哪一所學校、幾年幾班、或穿學校制服的照片**
3. 🏠 **家裡的地址與電話號碼**
4. 🔑 **任何帳號的密碼 (Passwords)**（除了爸爸媽媽以外，連最好的朋友也不能給！）
5. 👨‍👩‍👧 **爸爸媽媽的信用卡號碼或身分證字號**`,
        highlight: '🔒 安全鐵則：只要有任何網站或網友問你這 5 件事，馬上停下來去問爸爸媽媽！'
      },
      {
        title: '🎣 識破網路三大詐騙陷阱（千萬別點！）',
        titleEn: 'Spotting Fake Pop-Ups, Free Robux/iPad Scams & Virus Alerts',
        body: `上網時如果突然跳出下面這三種閃個不停的畫面，**100% 是騙人的陷阱 (Scam)**：
1. 🎁 **「恭喜你是今天第 10,000 名訪客！免費領取 iPhone 16 / 10,000 Robux / Minecraft 鑽石！」**
   👉 天下沒有白吃的午餐，點進去只會騙你的帳號或偷裝壞程式！
2. 🚨 **「警告！你的 Windows 電腦發現 18 個病毒！請立即點擊下載清理大師！」**
   👉 網頁根本不可能幫你掃描電腦病毒！這是假警報，用來騙你下載真正的病毒（\`.exe\` 檔案）！
3. 💬 **「我是遊戲官方管理員，請把你的帳號跟密碼傳給我，我幫你升級 VIP！」**
   👉 **真正的官方人員永遠不會跟你要密碼！**`,
        highlight: '🛑 遇到奇怪視窗怎麼辦？不要點畫面中間的大按鈕！直接按分頁上面的「✕ (Ctrl + W)」把那個分頁關掉，或請爸媽來看！'
      }
    ],
    simulator: {
      type: 'scam-shield',
      title: '🛡️ 防詐護盾特訓：這 5 個網路訊息是「安全」還是「詐騙陷阱」？',
      instruction: '仔細檢查每一個彈出視窗或訊息，判斷應該按下「🛑 識破詐騙並關閉分頁」還是「✅ 安全可靠的正常網頁」！'
    },
    quiz: [
      {
        q: '逛網頁時突然跳出一個閃亮亮的視窗：「恭喜你抽中免費 iPad！請在 3 分鐘內輸入爸媽的電話和地址領獎！」你應該怎麼做？',
        options: [
          '這是典型的網路詐騙 (Scam)！絕對不輸入資料，直接把這個分頁按 ✕ 關掉',
          '趕快把家裡地址、電話和爸媽名字全部填進去',
          '按照它說的下載不明程式'
        ],
        correct: 0,
        explain: '滿分！免費中獎倒數計時是最常見的網路釣魚陷阱，直接關掉分頁就對了！'
      },
      {
        q: '在網路遊戲或聊天室裡，有人說：「我也讀國小三年級！你讀哪一間國小？叫什麼名字？我們交換密碼吧！」你應該怎麼做？',
        options: [
          '拒絕透露真實姓名、學校和密碼，並馬上告訴爸爸媽媽',
          '把學校、班級、本名跟密碼全部告訴他',
          '拍一張穿學校制服有學號的照片傳給他'
        ],
        correct: 0,
        explain: '太棒了！保護自己的真實姓名、學校與密碼，才是真正的網路安全小達人！'
      }
    ]
  },

  {
    id: 'w2-l4',
    worldId: 'world-2',
    number: '2.4',
    title: '網路禮儀與 20-20-20 護眼超人',
    titleEn: 'Netiquette, Kindness Online & the 20-20-20 Eye Rule',
    icon: '👀',
    duration: '8 分鐘',
    xp: 110,
    summary: '當個溫暖有禮貌的數位公民、遇到怪事隨時找爸媽，並學會保護眼睛的 20-20-20 法則！',
    vocab: [
      { en: 'Netiquette', zh: '網路禮儀', desc: 'Internet + Etiquette，在網路上說話與互動的禮貌守則' },
      { en: 'Cyberbullying', zh: '網路霸凌', desc: '在網路上用難聽的話嘲笑、欺負別人（我們絕對不做！）' },
      { en: '20-20-20 Rule', zh: '20-20-20 護眼法則', desc: '每用電腦 20 分鐘，看 20 英尺(約 6 公尺)遠方 20 秒！' },
      { en: 'Posture', zh: '正確坐姿', desc: '眼睛離螢幕一隻手臂長，背部挺直不駝背' }
    ],
    cards: [
      {
        title: '💬 網路禮儀 (Netiquette)：螢幕背後都是真正的人',
        titleEn: 'Remember the Human Behind the Screen',
        body: `在網路上打字留言時，雖然看不到對方的臉，但螢幕另一端也是一個有感情的真人喔！
* **送出訊息前的「三秒鐘魔法問題」**：
  👉 *「如果現在這個人就站在我面前，我會微笑著對他說這句話嗎？」*
* **不做鍵盤刺蝟**：不嘲笑別人的作品、不用難聽的字眼吵架。
* **爸爸媽媽是你的無敵後盾**：如果在網路上看到任何讓你覺得 **不舒服、恐怖、奇怪、或有人兇你** 的畫面，**馬上告訴爸爸媽媽！你絕對不會因為誠實告訴爸媽而被罵！**`,
        highlight: '❤️ 家庭約定：遇到任何不確定的網站或訊息，第一時間找爸媽討論，爸媽永遠站在你這邊！'
      },
      {
        title: '👀 保護靈魂之窗：20-20-20 護眼法則與正確坐姿',
        titleEn: 'Healthy Screen Habits & the 20-20-20 Eye Care Rule',
        body: `電腦超好玩，但如果一直盯著螢幕不眨眼，眼睛肌肉會痠痛近視！全世界的眼科醫生都推薦 **「20-20-20 護眼法則」**：
* ⏱️ **每用電腦 20 分鐘**
* 🌳 **抬頭看窗外遠方（約 20 英尺 / 6 公尺遠的樹或天空）**
* 😌 **持續放鬆看遠方 20 秒，並用力眨眨眼睛 10 下！**
* 🪑 **神氣坐姿檢查**：眼睛距離筆電螢幕要有 **「一隻手臂長（約 45～50 公分）」**，腰桿挺直，腳踩平！`,
        highlight: '🧘‍♂️ 現在就試試看：把背挺直，伸出一隻手臂量量看你跟螢幕的距離，再抬頭看房間最遠的地方眨眨眼 5 下！'
      }
    ],
    simulator: {
      type: 'quiz-challenge',
      title: '🌟 網路公民與護眼小考驗',
      instruction: '完成下方的情境判斷題，獲得網路領航員勳章，準備進入最酷的「World 3：AI 魔法師世界」！'
    },
    quiz: [
      {
        q: '什麼是保護眼睛的「20-20-20 法則」？',
        options: [
          '每用電腦 20 分鐘，抬頭看遠方 (約 6 公尺外) 放鬆 20 秒',
          '連續玩 20 個小時電腦，喝 20 杯汽水',
          '把眼睛貼在距離螢幕 2 公分的地方看 20 分鐘'
        ],
        correct: 0,
        explain: '太棒了！每 20 分鐘看遠方 20 秒，能讓眼睛的睫狀肌好好放鬆，不怕近視！'
      },
      {
        q: '上網時如果不小心點到一個奇怪的網站，或是有人傳讓你覺得不舒服的訊息給你，最正確的做法是什麼？',
        options: [
          '馬上告訴爸爸媽媽，請爸媽一起來看怎麼處理',
          '因為怕被罵所以偷偷藏起來不敢說，自己亂點按鈕',
          '把自己的密碼傳給對方'
        ],
        correct: 0,
        explain: '完全正確！誠實告訴爸爸媽媽永遠是最安全、最聰明的決定！'
      }
    ]
  },

  {
    id: 'w2-l5',
    worldId: 'world-2',
    number: '2.5',
    title: '生活地圖小導遊：用 Google Maps 規劃全家出遊、街景小黃人與真實評價',
    titleEn: 'Google Maps Explorer: Family Trip Directions, Street View & Real Reviews',
    icon: '🗺️',
    duration: '12 分鐘',
    xp: 160,
    summary: '化身全家出遊小領航員！學會比較走路/大眾運輸/開車時間、拖曳街景小黃人 360° 踩點、識破洗星假評論找到真實美味餐廳！',
    vocab: [
      { en: 'Google Maps', zh: 'Google 地圖', desc: '全世界最厲害的數位地圖與生活導航夥伴' },
      { en: 'Directions', zh: '規劃路線 / 導航', desc: '比較步行 (Walking)、大眾運輸 (Transit) 與開車 (Driving) 的花費時間與路線' },
      { en: 'Street View', zh: '街景時光機', desc: '抓著黃色小人 (Pegman) 丟到地圖上，就能看到真實街道 360° 全景照片！' },
      { en: 'Reviews & Ratings', zh: '真實評價與星等', desc: '讀取其他探險家留下的真實心得與照片，避開灌水假評論' },
      { en: 'Saved Places', zh: '儲存喜愛地點 (圖釘 / 標籤)', desc: '把想去的景點點一下「儲存 ★ / 愛心 ❤️」，打造全家出遊藏寶圖！' }
    ],
    cards: [
      {
        title: '🧭 出遊第一步：路線導航 (Directions) 與交通方式大 PK',
        titleEn: 'Choosing the Best Route: Walking, Transit or Driving',
        body: `全家週末想去「台北市立動物園」或「兒童新樂園」，打開 Google Maps 輸入起點與終點，點擊 **「規劃路線 (Directions)」**：
* 🚶 **步行 (Walking)**：顯示走多久、步數，適合 15 分鐘以內的短距離探險！
* 🚌 **大眾運輸 (Transit)**：搭公車或捷運，Google Maps 會告訴你在哪一站轉車、幾點發車、票價多少！
* 🚗 **開車 (Driving)**：用顏色標示即時路況 —— **藍色 (一路順暢)**、**橘色 (車多慢行)**、**紅色 (塞車大排長龍)**！`,
        highlight: '💡 小探險家出任務：出門前先幫爸爸媽媽查「塞車即時路況」，選一條最順暢的路線！'
      },
      {
        title: '🚶‍♂️ 街景小黃人 (Pegman)：出發前先到現場 360° 踩點！',
        titleEn: 'Street View Magic: Explore the Entrance Before You Arrive',
        body: `到了陌生的地方常常找不到餐廳門口或停車場入口嗎？右下角有一隻 **「黃色街景小人 (Pegman)」**：
* 🤏 **抓起小人**：按住滑鼠把小黃人拖曳到地圖上的藍色道路。
* 🌐 **360° 環景視角**：畫面上會變成現場真實拍攝的高畫質街景照片！
* 🔍 **找地標不迷路**：先看清楚捷運幾號出口走出來有大樹、餐廳招牌長什麼顏色，到了現場就能一眼認出！`,
        highlight: '⭐ 神奇密技：街景左上角還有「查看更多日期 (Time Machine)」，可以看到街道 5 年、10 年前的模樣喔！'
      },
      {
        title: '⭐ 評論小偵探 (Review Detective)：五星好評一定好吃嗎？',
        titleEn: 'Spotting Real vs Fake Reviews: Trusting Honest Explorers',
        body: `想找一家好吃的義大利麵或冰淇淋店，看到 5.0 顆星就直接衝進去嗎？聰明的數位小偵探會這樣看：
* 🚨 **警惕「灌水五星」**：如果評論只有短短兩三天突然爆增、內容都只有「五星換飲料」、「送小菜」，或者每個人都只給一顆星說服務差，要小心！
* 🏆 **尋找「真實金牌評論」**：
  1. **星星約 4.2 ～ 4.7 顆星** 最真實（幾乎沒有完美零缺點的店）
  2. **評論數量多**（有數百則以上）
  3. **有探險家附上真實菜色照片**，並寫出「適合帶小朋友、座位很寬敞、濃湯超好喝」等具體細節！`,
        highlight: '🕵️ 偵探口訣：不只看星等數字，更要看「評論數量」與「附帶照片的詳細心得」！'
      }
    ],
    simulator: {
      type: 'maps-navigator',
      title: '🗺️ Google Maps 全家出遊小導遊實戰特訓',
      instruction: '完成三大出遊任務：1) 比較台北車站到兒童新樂園的三種路線 2) 拖曳小黃人開啟 360° 街景踩點 3) 幫全家揪出刷洗假五星餐廳、選出真實高分美食！'
    },
    quiz: [
      {
        q: '在 Google Maps 上規劃路線時，如果路段顯示為「深紅色」，代表這條路目前是什麼狀況？',
        options: [
          '嚴重大塞車，車子排長龍開很慢',
          '一路順暢，沒有任何車輛',
          '這條路只有腳踏車可以走'
        ],
        correct: 0,
        explain: '正確！深紅色代表嚴重大塞車，藍色才是一路順暢喔！'
      },
      {
        q: '如果想在還沒出發前，先看清楚捷運出口出來後的真實街道建築和店面招牌，要使用 Google Maps 的什麼功能？',
        options: [
          '把黃色小人 (Pegman) 拖曳到馬路上的「街景服務 (Street View)」',
          '把筆電電源關掉',
          '按鍵盤上的 Caps Lock'
        ],
        correct: 0,
        explain: '太棒了！街景服務 (Street View) 讓你出門前就能 360 度先逛逛街景，完全不怕迷路！'
      },
      {
        q: '小探險家要幫全家挑選好吃的披薩店，下面哪一家最值得信任？',
        options: [
          'B 店：4.5 顆星，有 850 則評論，許多人附上詳細披薩照片並分享「起司牽絲、小孩超愛」',
          'A 店：滿分 5.0 顆星，但只有 3 則評論，而且都是昨天留的「打卡送可樂」',
          '隨便閉著眼睛挑一間'
        ],
        correct: 0,
        explain: '完全正確！有大量真實探險家心得與照片的 4.5 顆星，遠比打卡洗出來的 5 星更有保障！'
      }
    ]
  },

  // ==========================================================================
  // WORLD 3: AI 魔法師 (MASTERING AI: PROMPTING, LEARNING SKILLS & IMAGE GEN)
  // ==========================================================================
  {
    id: 'w3-l1',
    worldId: 'world-3',
    number: '3.1',
    title: '認識 AI 小幫手：AI 是什麼？不是什麼？',
    titleEn: 'What AI Is (and Isn\'t): You Are the Captain!',
    icon: '🤖',
    duration: '10 分鐘',
    xp: 130,
    summary: '搞懂人工智慧 (AI) 為什麼會說話畫圖、認識「AI 幻覺 (Hallucination)」，當 AI 的聰明機長！',
    vocab: [
      { en: 'AI (Artificial Intelligence)', zh: '人工智慧', desc: '讀了無數書本與資料、能回答問題與創作的聰明電腦程式' },
      { en: 'Prompt', zh: '提示詞 / 指令', desc: '你輸入給 AI 的問題或要求（Prompt 寫得越好，AI 答得越棒！）' },
      { en: 'Generate', zh: '生成 / 創造', desc: 'AI 根據你的指令，現場寫出文章或畫出圖片' },
      { en: 'Hallucination', zh: 'AI 幻覺 (胡說八道)', desc: 'AI 有時候會「一本正經地自己編造假答案」，所以我們要查證！' }
    ],
    cards: [
      {
        title: '🤖 AI (人工智慧) 到底是怎麼學會說話的？',
        titleEn: 'How Does AI Work?',
        body: `你可能聽過 **ChatGPT、Google Gemini、Claude 或 Copilot**。它們都是 **生成式 AI (Generative AI)**！
* **AI 就像讀了幾十億本書的超級圖書館精靈**：科學家讓電腦閱讀了人類世界海量的書籍、百科全書、故事與程式碼，學會了文字與圖片之間的規律。
* 當你給它一句指令——在英文裡叫做 **\`Prompt\` (提示詞)**，它就會以超快的速度預測並組合出最適合的回答！`,
        highlight: '🔑 必學英文單字：Prompt (提示詞) —— 你對 AI 說的每一句指令，就叫做一個 Prompt！'
      },
      {
        title: '🧭 駕馭 AI 的三個黃金真相：你是機長，AI 是副駕駛！',
        titleEn: '3 Golden Truths About AI: You Are the Captain',
        body: `在使用任何 AI 之前，每個小小 AI 魔法師都要記住這 **3 個真相**：
1. **AI 是超強工具，但它不是真人 (Not a Real Person)**：AI 很有禮貌、很會聊天，但它沒有真正的心跳、沒有感情，也不是真的人類朋友。
2. **AI 有時候會「一本正經地胡說八道 (Hallucination 幻覺)」**！
   * 因為 AI 是靠「預測文字」來回答，當它遇到不確定的事時，有時候會**非常有自信地編造出一個假的故事或算錯數學**！
   * 所以，重要的事實一定要用我們在 World 2 學到的 **Google 搜尋** 檢查看看喔！
3. **你是飛機的機長 (Captain)，AI 只是副駕駛 (Co-pilot)**：AI 幫你找靈感、當家教，但動腦思考、做決定的永遠是你自己！`,
        highlight: '✨ 記住：「AI 很聰明，但也會出錯；我是小機長，凡事會查證！」'
      }
    ],
    simulator: {
      type: 'quiz-challenge',
      title: '🤖 AI 機長資格考驗',
      instruction: '回答下面 3 個問題，證明你已經了解 AI 的超能力與限制，解鎖下一關「提示詞魔法公式」！'
    },
    quiz: [
      {
        q: '我們輸入給 AI 的「指令或問題」，在電腦與 AI 世界裡叫做什麼英文單字？',
        options: [
          'Prompt (提示詞)',
          'Banana (香蕉)',
          'Battery (電池)'
        ],
        correct: 0,
        explain: '答對了！Prompt 就是「提示詞」，學會寫好 Prompt 就是駕馭 AI 最強的超能力！'
      },
      {
        q: 'AI 回答的每一個字都是 100% 絕對正確、永遠不會出錯的嗎？',
        options: [
          '不是！AI 有時候會產生「幻覺 (Hallucination)」，很有自信地編出錯誤答案，所以重要資訊要查證',
          '對，AI 比神仙還準，連看都不用看就可以照抄',
          'AI 裡面躲著一個真人老師在打字'
        ],
        correct: 0,
        explain: '太聰明了！知道 AI 也會出錯、懂得檢查答案的人，才是真正的 AI 高手！'
      }
    ]
  },

  {
    id: 'w3-l2',
    worldId: 'world-3',
    number: '3.2',
    title: '提示詞魔法公式 ＋ 用 AI 當你的雙語英文家教',
    titleEn: 'The 4-Part Magic Prompt Formula & Bilingual English Buddy',
    icon: '🪄',
    duration: '15 分鐘',
    xp: 200,
    summary: '學會「角色＋任務＋對象程度＋格式」四大提示詞公式，還能請 AI 用有趣故事教你學英文！',
    vocab: [
      { en: 'Role', zh: '角色設定', desc: '告訴 AI 扮演誰（例如：幽默的自然科學老師、英文故事大王）' },
      { en: 'Task', zh: '具體任務', desc: '清楚告訴 AI 你希望它幫你做什麼事' },
      { en: 'Context / Level', zh: '背景與程度', desc: '告訴 AI「我是 8歲/10歲小學生，請用簡單好懂的繁體中文」' },
      { en: 'Format', zh: '輸出格式', desc: '要求 AI「列成 3 個重點」、「用表格呈現」或「出 2 題小測驗」' }
    ],
    cards: [
      {
        title: '🪄 為什麼「懶惰提示詞」只能得到無聊答案？認識「四大魔法提示詞公式」！',
        titleEn: 'Lazy Prompts vs. The 4-Part Super Prompt Formula',
        body: `如果只對 AI 打兩個字：\`黑洞\`，AI 不知道你是大學教授還是小學生，可能會吐出一大堆看不懂的物理公式！
但只要套用 **【四大魔法提示詞公式 (4-Part Prompt Formula)】**，AI 的回答就會變得超級精彩又好懂：
1. 🎭 **第 1 塊：角色 (Role)** — *「你是一位幽默風趣的兒童天文學家...」*
2. 🎯 **第 2 塊：任務 (Task)** — *「請幫我解釋『黑洞是什麼』以及『掉進黑洞會怎樣』...」*
3. 👶 **第 3 塊：對象與程度 (Level)** — *「我是 9 歲的小學生，請用生活化的比喻和繁體中文解釋...」*
4. 📦 **第 4 塊：格式 (Format)** — *「請列成 3 個簡單重點，並在最後出 1 題有趣的選擇題考考我！」*`,
        highlight: '🌟 魔法公式口訣：【扮演誰 (Role)】＋【做什麼 (Task)】＋【講給幾歲聽 (Level)】＋【怎麼呈現 (Format)】！'
      },
      {
        title: '🔤 超實用秘技：怎麼請 AI 當你的「專屬英文小家教」？',
        titleEn: 'Using AI to Learn English Fun & Fast!',
        body: `既然你們正在學英文，AI 就是全世界最有耐心、24 小時陪你練習的雙語英文好夥伴！你可以這樣對 AI 說：
* **學主題單字**：
  👉 *「我是 8 歲/10 歲正在學基礎英文的小學生。請教我 **5 個跟『寶可夢 / 太空 / 恐龍 / 美食』有關的簡單英文單字**，附上 **繁體中文意思、發音諧音提示、還有一個超好笑的短例句**！」*
* **玩英文猜謎遊戲**：
  👉 *「請跟我玩簡單的英文猜動物遊戲！你用簡單的英文描述一個動物（附上中文提示），讓我用英文猜它是什麼動物！」*
* **查不懂的英文字**：
  👉 *「請問英文單字 **『Explorer』** 是什麼意思？請用小學生聽得懂的繁體中文解釋，並造 2 個簡單短句。」*`,
        highlight: '💡 在下方的「AI 提示詞實驗室」裡，你可以自由組合這 4 個積木，還可以一鍵「複製提示詞」去真正的 AI 試試看喔！'
      }
    ],
    simulator: {
      type: 'ai-prompt-builder',
      title: '🧪 AI 提示詞魔法實驗室 (4-Part Prompt Builder)',
      instruction: '挑選「角色、任務、程度、格式」四個魔法積木（或自己打字修改！），點擊「✨ 施展提示詞魔法」看看 AI 的回答有多棒，還能一鍵複製提示詞！'
    },
    quiz: [
      {
        q: '想請 AI 解釋「為什麼天空是藍色的」，哪一個提示詞 (Prompt) 能得到最適合你的回答？',
        options: [
          '「你是一位有趣的科學老師，請用 9 歲小學生聽得懂的繁體中文和生活比喻，分成 3 點解釋為什麼天空是藍色的，最後出 1 題小測驗考我！」',
          '「天空」',
          '「？？？？」'
        ],
        correct: 0,
        explain: '太強了！包含了「角色、任務、幾歲程度、格式」，AI 一定會給你最生動好懂的回答！'
      },
      {
        q: '想用 AI 幫助自己快樂學英文，可以怎麼下指令？',
        options: [
          '請 AI 根據我喜歡的興趣（例如恐龍、足球、畫畫），每次教我 5 個簡單英文單字並附上繁體中文解釋與小故事',
          '叫 AI 直接幫我把英文作業全部寫完，我自己連看都不看',
          '只打一個字母 A'
        ],
        correct: 0,
        explain: '沒錯！結合自己喜歡的主題來學英文單字與例句，學得最快最開心！'
      }
    ]
  },

  {
    id: 'w3-l3',
    worldId: 'world-3',
    number: '3.3',
    title: '請 AI 教我學新技能！打造你的專屬教練',
    titleEn: 'How to Ask AI to Teach You Any New Skill Step-by-Step',
    icon: '🥋',
    duration: '15 分鐘',
    xp: 220,
    summary: '不管想學摺紙、西洋棋、魔術方塊、英文會話還是寫程式，學會「一步一步互動教學法」讓 AI 教會你！',
    vocab: [
      { en: 'Step-by-Step', zh: '一步一步地', desc: '請 AI 把困難的技能拆成小小的步驟，一次只教一步' },
      { en: 'Skill', zh: '技能 / 本領', desc: '你想學會的新本領（例如下棋、畫漫畫、說英文、做科學實驗）' },
      { en: 'Coach / Tutor', zh: '教練 / 家教', desc: '不只給答案，而是陪你練習、問你問題、幫你進步的指導者' },
      { en: 'Beginner', zh: '初學者 (新手)', desc: '剛開始學習某樣新東西的人' }
    ],
    cards: [
      {
        title: '🚀 AI 最強大的隱藏用途：請它教你學會任何一項「新技能 (Skill)」！',
        titleEn: 'Turn AI Into Your Personal Coach for Any Hobby or Skill',
        body: `很多大人都只把 AI 拿來查資料，但其實 AI 是全世界最棒的 **「個人技能教練 (Personal Skill Coach)」**！
不管是什麼你想學的新本領，都可以請 AI 教你：
* 🎨 **藝術與手作**：怎麼一步步畫出可愛的 Q 版人物？怎麼摺出飛最遠的紙飛機？
* ♟️ **益智與桌遊**：西洋棋 (Chess) 或五子棋有哪些必勝開局技巧？魔術方塊怎麼轉？
* 🗣️ **語言與表達**：去餐廳點餐怎麼用英文對話？怎麼寫出一篇吸引人的探險故事？
* 💻 **科技與自然**：怎麼用 Scratch 做一個接蘋果小遊戲？怎麼在家做安全的火山爆發小實驗？`,
        highlight: '💡 重點秘訣：如果只叫 AI「教我下西洋棋」，它會一次貼給你 2,000 字的規則書，看得頭都暈了！那該怎麼問呢？看下一張卡！'
      },
      {
        title: '🏆 學技能黃金咒語：「拆成小步驟 ＋ 一次只教一步 ＋ 等我回答！」',
        titleEn: 'The Secret Interactive Coaching Prompt Formula',
        body: `想讓 AI 像真正的真人教練一樣帶著你學會新技能，請記住這 **3 個魔法句子**：
1. 🌱 **說明你的起點**：「我是 **零基礎的初學者 (Beginner)**，今年 8歲/10歲...」
2. 🪜 **要求拆解路線圖**：「請把學會『某項技能』分成 **5 個由淺入深的小關卡 (Step-by-Step)**...」
3. 💬 **最關鍵的一句（互動式教學）**：
   👉 **「現在請先只教我『第 1 關』，並給我一個馬上可以試試看的小練習。等我回答你、確認我學會了之後，你再教我第 2 關！」**

為什麼最後這句話這麼神？因為這樣 AI 就不會一次講太多，而是會像闖關遊戲一樣，一步一步陪你練會！`,
        highlight: '🌟 必背神句：「請分成 5 個小步驟，一次只教我第 1 步，並給我一個小練習，等我回答後再繼續下一步！」'
      }
    ],
    simulator: {
      type: 'ai-skill-coach',
      title: '🥋 AI 技能教練產生器：挑選你想學的新本領，體驗一步步闖關教學！',
      instruction: '1) 選擇一個你想學的技能（或自己輸入任何想學的本領！） 2) 選擇教學模式 3) 在模擬器中跟 AI 教練互動闖過第 1 步與第 2 步，並複製這組神級教練提示詞！'
    },
    quiz: [
      {
        q: '當你想請 AI 教你一項全新的技能（例如：怎麼畫漫畫人物、或怎麼學會基礎西洋棋），怎樣下指令最不會頭昏眼花？',
        options: [
          '請 AI 當我的專屬教練，把技能分成 5 個簡單小步驟，一次只教我第 1 步並給我小練習，等我學會回答後再教下一步！',
          '叫 AI 一次寫出 10,000 字的大學教科書給我背',
          '只打「教我」兩個字'
        ],
        correct: 0,
        explain: '太棒了！「分成小步驟 + 一次只教一步 + 等我回答再繼續」是全世界最有效的 AI 學習法！'
      },
      {
        q: '如果在跟 AI 教練學第 1 步的時候，覺得它講得還是有點難懂，你可以怎麼跟 AI 說？',
        options: [
          '「這一步我還是不太懂，請用更簡單的比喻再解釋一次，或是舉一個例子給我看！」',
          '生氣把電腦砸壞',
          '假裝自己懂了直接跳過'
        ],
        correct: 0,
        explain: '完全正確！AI 最有耐心了，隨時可以請它「換個更簡單的比喻」或「舉個例子」，直到你真的聽懂為止！'
      }
    ]
  },

  {
    id: 'w3-l4',
    worldId: 'world-3',
    number: '3.4',
    title: 'AI 繪圖設計師：五要素圖像提示詞魔法',
    titleEn: 'AI Image Prompting Studio: The 5-Ingredient Visual Recipe',
    icon: '🎨',
    duration: '15 分鐘',
    xp: 220,
    summary: '學會 AI 畫圖的「五大黃金要素（主角、動作、背景、藝術風格、光線色彩）」，中英雙語打造超酷畫作！',
    vocab: [
      { en: 'Image Prompt', zh: '繪圖提示詞', desc: '用文字把腦海中的畫面描繪出來，讓 AI 畫出圖片' },
      { en: 'Subject', zh: '主角 / 主體', desc: '畫面正中間最重要的角色或物品（例如：穿太空衣的橘貓）' },
      { en: 'Art Style', zh: '藝術風格', desc: '圖片的畫風：Pixar 3D (皮克斯動畫風)、Watercolor (水彩)、Pixel Art (像素風)' },
      { en: 'Background / Setting', zh: '背景與環境', desc: '主角身在什麼地方（例如：發光的魔法森林、未來的台北夜市）' },
      { en: 'Lighting', zh: '光線與氛圍', desc: '畫面的光影感覺（例如：溫暖陽光 Warm Sunlight、夢幻星空）' }
    ],
    cards: [
      {
        title: '🎨 為什麼別人的 AI 畫圖超精緻，只打「一隻狗」卻很普通？',
        titleEn: 'How AI Image Generators Turn Words Into Art',
        body: `AI 繪圖工具（像是 ChatGPT / DALL-E、Gemini Imagen、Bing Image Creator）就像一位蒙著眼睛但畫功超強的畫家——**你形容得越具體、越有畫面感，它畫出來的作品就越驚人！**
* ❌ **普通提示詞**：\`一隻小狗 (a dog)\`
  👉 AI 只能隨便畫一隻普通的狗坐在白紙上。
* ✅ **大師級繪圖提示詞（五大黃金要素）**：
  👉 *「一隻戴著透明太空頭盔的可愛柴犬（主角），正在月球表面開心滑著發光滑板（動作），背景有蔚藍的地球和彩色星雲（背景），皮克斯 3D 動畫電影風格（藝術風格），溫暖閃耀的奇幻光線（光線色彩）！」*`,
        highlight: '🖌️ AI 繪圖五要素公式：【1. 主角 Subject】＋【2. 動作 Action】＋【3. 背景 Setting】＋【4. 藝術風格 Art Style】＋【5. 光線氛圍 Lighting】！'
      },
      {
        title: '🌈 認識最受歡迎的 6 種「藝術風格 (Art Styles)」中英關鍵字！',
        titleEn: '6 Magical Art Styles in Chinese & English',
        body: `只要在繪圖提示詞最後面加上不同的 **「藝術風格 (Art Style)」**，同一隻柴犬就會變成完全不同的藝術品！快把這幾個中英雙語風格學起來：
1. 🎬 **皮克斯 3D 動畫風 (\`Pixar 3D animation style, cute, vivid\`)**：像玩具總動員一樣立體可愛！
2. 🍃 **吉卜力手繪動畫風 (\`Studio Ghibli anime style, hand-drawn\`)**：像龍貓、神隱少女一樣溫暖療癒！
3. 🎨 **夢幻水彩插畫風 (\`Soft watercolor children's book illustration\`)**：像繪本故事書一樣柔和美麗！
4. 👾 **復古像素遊戲風 (\`8-bit Pixel art style, retro game\`)**：像 Minecraft 或復古電玩一樣一格一格超酷！
5. 🧱 **樂高積木世界風 (\`Made of LEGO bricks, miniature toy photography\`)**：所有東西都變成樂高積木拼出來的！
6. Origami **立體摺紙藝術風 (\`3D colorful paper craft / origami art style\`)**：像精緻的立體紙雕藝術！`,
        highlight: '✨ 馬上在下面的「AI 繪圖設計工作坊」混搭這五大要素，即時預覽不同畫風，還可以複製中英文雙語 Prompt！'
      }
    ],
    simulator: {
      type: 'ai-image-studio',
      title: '🎨 AI 繪圖設計工作坊 (5-Ingredient Image Prompt Studio)',
      instruction: '自由挑選「主角、動作、背景、藝術風格、光線色彩」五大要素，點擊「🎨 生成 AI 畫作預覽」即時看畫風變化，並複製中英雙語繪圖提示詞！'
    },
    quiz: [
      {
        q: '想請 AI 畫出一張超酷的圖片，「AI 繪圖五要素」包含哪五個部分？',
        options: [
          '1.主角 (Subject) + 2.動作 (Action) + 3.背景 (Background) + 4.藝術風格 (Art Style) + 5.光線色彩 (Lighting)',
          '只要打一個句號「。」就好',
          '輸入自己的學校和密碼'
        ],
        correct: 0,
        explain: '太厲害了！掌握「主角、動作、背景、風格、光線」五要素，你就是小小 AI 藝術總監！'
      },
      {
        q: '如果你想讓 AI 畫出「像玩具總動員一樣立體可愛」或是「像繪本一樣的水彩畫」，應該在提示詞裡加入什麼？',
        options: [
          '加入「藝術風格 (Art Style)」，例如：皮克斯 3D 動畫風 (Pixar 3D style) 或 水彩插畫風 (Watercolor)',
          '把螢幕調暗',
          '按 Ctrl + Z'
        ],
        correct: 0,
        explain: '完全正確！Art Style (藝術風格) 是決定整張畫作感覺最神奇的魔法調味料！'
      }
    ]
  },

  {
    id: 'w3-l5',
    worldId: 'world-3',
    number: '3.5',
    title: 'AI 是教練，不是代寫槍手：聰明寫作業守則',
    titleEn: 'AI is a Coach, Not a Cheater: How Smart Kids Use AI for School',
    icon: '🧠',
    duration: '10 分鐘',
    xp: 150,
    summary: '分辨「讓大腦變強的 AI 用法」與「讓大腦退化的偷懶用法」，學會請 AI 給提示、幫你改作文！',
    vocab: [
      { en: 'Hint', zh: '提示 / 線索', desc: '不直接看答案，請 AI 給你一個小提示讓你自己想出來' },
      { en: 'Brainstorm', zh: '腦力激盪 (想點子)', desc: '寫故事或做報告前，跟 AI 一起討論有哪些有趣的點子' },
      { en: 'Feedback', zh: '回饋與建議', desc: '自己寫完作文後，請 AI 幫你檢查錯字並給改進建議' },
      { en: 'Original', zh: '原創的 (自己寫的)', desc: '真正經過你自己的大腦思考與創作的作品' }
    ],
    cards: [
      {
        title: '🏋️‍♂️ 運動員會叫機器人幫自己伏地挺身嗎？',
        titleEn: 'Why Copying AI Answers Makes Your Brain Weaker',
        body: `想像你想練出強壯的肌肉去參加比賽，結果你叫機器人幫你做 100 下伏地挺身，你自己躺在沙發上看電視——請問你的肌肉會變強壯嗎？**完全不會！**
寫學校作業也是一模一樣的道理：
* ❌ **大腦退化用法（當槍手代寫）**：把老師出的數學題或作文題目直接貼給 AI，然後不動腦筋照抄答案交出去。
  👉 結果：考試時沒有 AI 幫忙就完全不會寫，大腦越來越生鏽！
* ✅ **大腦升級用法（當隨身家教教練）**：
  1. **卡關時求「提示 (Hint)」**：*「這題數學應用題我看不懂，**請不要直接給我答案**，請給我一個小提示，一步步引導我自己算出來！」*
  2. **自己寫完請 AI「健檢 (Feedback)」**：*「這是我自己寫的短文，請幫我看看有沒有錯別字，並建議我可以怎麼把形容詞改得更生動？」*
  3. **考前請 AI「出練習題考我」**：*「我明天要考自然科第 3 單元，請出 5 題選擇題考我，等我作答後再幫我批改！」*`,
        highlight: '🏆 聰明學習者黃金咒語：「請不要直接給我答案，請給我一個提示 (Hint)，一步一步引導我自己想出來！」'
      }
    ],
    simulator: {
      type: 'quiz-challenge',
      title: '🧠 大腦升級 vs. 偷懶陷阱判斷賽',
      instruction: '看看下面幾位小朋友使用 AI 的方式，判斷誰才是真正讓大腦變強的「AI 聰明學習者」！'
    },
    quiz: [
      {
        q: '小華遇到一題很難的數學作業想不出來，怎樣用 AI 最能讓自己的頭腦變聰明？',
        options: [
          '對 AI 說：「這題我卡住了，請不要直接給我最後答案，請先給我第 1 步的思考提示 (Hint)，引導我自己算出來！」',
          '叫 AI 直接算出答案，自己連題目都不看就抄上去',
          '把作業本藏在床底下'
        ],
        correct: 0,
        explain: '給自己鼓掌！懂得要求 AI「不要直接給答案，給我提示引導我」，你的實力會突飛猛進！'
      },
      {
        q: '老師請大家寫一篇「我的夢想」短文，怎麼搭配 AI 最棒？',
        options: [
          '先自己動腦寫出初稿，寫完後再請 AI 幫我檢查有沒有錯字、或是討論哪裡可以描寫得更生動',
          '叫 AI 寫好整篇 300 字，自己一個字都沒想就直接照抄',
          '叫 AI 幫老師改考卷'
        ],
        correct: 0,
        explain: '完全正確！作品是自己的心血，AI 則是幫你挑錯字、給建議的貼心小助教！'
      }
    ]
  },

  {
    id: 'w3-l6',
    worldId: 'world-3',
    number: '3.6',
    title: 'AI 真假偵探與安全守則：畢業總測驗！',
    titleEn: 'AI Fact-Checking, Deepfakes & Privacy Rules (Graduation Quest!)',
    icon: '🎓',
    duration: '12 分鐘',
    xp: 250,
    summary: '學會抓出 AI 的錯誤幻覺、分辨 AI 合成圖片，守住 AI 隱私規則，領取「數位探險家畢業證書」！',
    vocab: [
      { en: 'Fact-Check', zh: '事實查核 (查證)', desc: '用可靠的網站或書本，檢查 AI 說的話是不是真的' },
      { en: 'Fake / AI-Generated', zh: 'AI 生成 / 合成的', desc: '看起來像真照片或真影片，但其實是 AI 畫出來的' },
      { en: 'Verify', zh: '驗證 / 確認', desc: '不隨便相信單一來源，多方確認真假' },
      { en: 'Digital Citizen', zh: '數位公民', desc: '懂得善用電腦、網路與 AI，同時保護自己與尊重他人的現代高手' }
    ],
    cards: [
      {
        title: '🕵️‍♀️ 結合 World 2 + World 3：怎麼抓出 AI 的「胡說八道 (Hallucination)」？',
        titleEn: 'How to Fact-Check AI Using Google Search',
        body: `還記得我們說過 AI 有時候會「一本正經地編故事」嗎？例如：
* 如果你問 AI：*「請介紹台灣玉山上的企鵝生態」*，有些粗心的 AI 可能會認真回答你：*「玉山企鵝喜歡吃高麗菜...」*（其實台灣玉山根本沒有野生企鵝！）。
* **真假偵探查證三部曲 (Fact-Check 1-2-3)**：
  1. 🤔 **保持好奇與懷疑**：當 AI 講到歷史年代、科學數據、新聞事件或某間餐廳地址時，先別急著 100% 相信。
  2. 🔍 **打開 Google 搜尋查證**：用我們在 World 2 學到的 **黃金關鍵字** 去可靠網站（維基百科、政府網站、Google Maps）核對一次！
  3. 🖼️ **小心網路上的假照片/假影片**：現在 AI 能畫出「鯊魚在馬路上游泳」或「名人說奇怪的話」，看到誇張的圖片先問問自己和爸媽：「這會不會是 AI 生成的？」`,
        highlight: '🛡️ AI 隱私最後一道防線：跟我們在網路安全學到的一樣——絕對不要把自己的「真實全名、學校、地址、電話、密碼、或家人朋友的私人照片」傳給公開的 AI 聊天室喔！'
      },
      {
        title: '🎓 恭喜你！準備領取「數位小探險家學院」榮譽畢業證書！',
        titleEn: 'Congratulations! You Are Ready for Graduation!',
        body: `太了不起了！你已經一路從：
* 💻 **World 1 筆電小達人**：學會照顧 筆電、視窗控制、中英盲打與注音切換、以及 ` + '`Ctrl+C/V/Z/S`' + ` 快捷鍵！
* 🌐 **World 2 網路探險家**：學會瀏覽器分頁書籤、找在地美食與查資料的黃金關鍵字、識破廣告與防詐騙護盾！
* 🤖 **World 3 AI 魔法師**：學會四大提示詞公式、用 AI 學英文、請 AI 一步步教你新技能、AI 繪圖五要素與安全查證！

現在完成最後的畢業小考驗，就能在上方開啟你的 **「🎓 數位小探險家榮譽畢業證書」** 喔！`,
        highlight: '🎉 快完成下方畢業考驗，叫爸爸媽媽一起來看你的成果吧！'
      }
    ],
    simulator: {
      type: 'quiz-challenge',
      title: '🎓 數位小探險家學院：榮譽畢業總考驗',
      instruction: '全部答對即可解鎖「AI 魔法師勳章」與你的專屬榮譽畢業證書！'
    },
    quiz: [
      {
        q: '當 AI 告訴你一個很驚人的科學事實或一家餐廳的地址時，最聰明的做法是什麼？',
        options: [
          '用 Google 搜尋或 Google Maps 關鍵字查證 (Fact-Check) 一下是不是真的，避免被 AI 幻覺誤導',
          '不用檢查，因為電腦說的話永遠是真的',
          '馬上傳給 100 個人'
        ],
        correct: 0,
        explain: '太棒了！懂得搭配搜尋引擎查證 AI 的答案，你已經超越大多數大人了！'
      },
      {
        q: '在使用公開的 AI 聊天機器人時，下面哪一件事「絕對不能做」？',
        options: [
          '把自己的真實姓名、學校班級、家裡地址、電話或密碼輸入給 AI',
          '請 AI 教我 5 個跟太空有關的英文單字',
          '請 AI 一步一步教我怎麼下西洋棋'
        ],
        correct: 0,
        explain: '完全正確！個人隱私五寶藏不管在一般網站還是 AI 聊天室，都要好好保護！'
      },
      {
        q: '當你在打字時突然發現打出來的全都是英文字母，想切換回「微軟注音 (中)」，只要按哪顆鍵？',
        options: [
          '按一下 Shift 鍵 (或按 Win + 空白鍵切換輸入法)，並確認右下角顯示「中」',
          '按關機鍵',
          '把螢幕蓋起來'
        ],
        correct: 0,
        explain: '恭喜你通過所有考驗！你已經是全方位的筆電、網路與 AI 數位小達人了！🎉'
      }
    ]
  },

  // ==========================================================================
  // WORLD 4: 數位創作與程式入門 (DIGITAL CREATIVITY & CODING PLAYGROUND)
  // ==========================================================================
  {
    id: 'w4-l1',
    worldId: 'world-4',
    number: '4.1',
    title: '簡報魔法秀：學校報告必學 Google Slides / Canva 設計心法',
    titleEn: 'Presentation Magic: Slide Layouts, Clean Fonts & Visual Impact',
    icon: '📊',
    duration: '12 分鐘',
    xp: 150,
    summary: '告別文字密密麻麻的「大魔王簡報」！學會三重點法則 (Rule of 3)、深淺高對比色彩搭配、大圖焦點排版與勇敢全螢幕放映！',
    vocab: [
      { en: 'Slide', zh: '投影片 / 簡報頁', desc: '上台報告時展示在投影幕上的每一頁畫面' },
      { en: 'Layout', zh: '版面配置', desc: '文字與圖片的位置安排，留適當空白才不會擁擠' },
      { en: 'Bullet Points', zh: '條列重點', desc: '用點點 (•) 濃縮精華關鍵句，絕對不要整篇作文直接貼上！' },
      { en: 'Contrast', zh: '顏色對比', desc: '淺色底配深色字、或深色底配超亮字，坐在最後一排的同學也看得清楚' },
      { en: 'Slideshow / Present', zh: '全螢幕放映模式', desc: '點擊播放按鈕進入全螢幕，自信大聲分享你的精彩報告！' }
    ],
    cards: [
      {
        title: '🎨 學校簡報三大魔法金律：少即是多！',
        titleEn: 'The Three Golden Rules for School Presentations',
        body: `做自然課、社會課或寒暑假生活分享簡報時，最常犯的錯誤就是把網路文章整段複製貼上，字又小又密！
* 1️⃣ **「三重點法則 (Rule of 3)」**：每一頁投影片，最多放 **3 個條列重點**！同學和老師一次只能記住 3 件事。
* 2️⃣ **「顏色高對比 (High Contrast)」**：淺底（白/米黃）就要配深字（黑/深藍）；深底就要配白字或亮黃字，千萬別把黑字放在深紫底上！
* 3️⃣ **「一張圖勝過千言萬語」**：每一頁挑一張清晰大圖當「視覺焦點 (Hero Image)」，台下目光瞬間被你吸引！`,
        highlight: '⭐ 簡報大師小秘密：投影片不是給你看著唸的課本，而是讓台下同學看懂核心重點的魔法畫布！'
      },
      {
        title: '🛠️ Google Slides 與 Canva 實戰工具箱',
        titleEn: 'Hands-on Tools: Google Slides & Canva',
        body: `* 🖥️ **Google Slides (Google 簡報)**：跟同學分工做報告超方便！點右上角「共用」就能大家一起在線上打字，還有版本紀錄不怕被不小心刪掉。
* 🎨 **Canva**：有上千種超可愛字體、插圖貼紙與動畫圖表，做出像雜誌一樣漂亮的報告封面！
* 🎯 **字體大小基本功**：
  - **大標題 (Title)**：40 ～ 60 pt（一眼就看清主題）
  - **條列內文 (Body)**：24 ～ 32 pt（絕不能小於 20 pt，否則坐在教室後面的同學看不見！）`,
        highlight: '🚀 神級快捷鍵：在 Google Slides 裡按 `Ctrl + M` 可以立刻新增一頁新投影片，按 `Ctrl + D` 能快速複製物件！'
      }
    ],
    simulator: {
      type: 'slide-studio',
      title: '📊 簡報魔法改造實驗室：拯救混亂大魔王投影片！',
      instruction: '這是一張滿滿黑字、顏色看不清楚的混亂投影片！透過三大改造步驟：1) 套用「三重點法則」濃縮文字 2) 切換「高對比清新主題」 3) 插入「焦點英雄大圖與圖說」，最後按下「▶️ 全螢幕放映」驗收成果！'
    },
    quiz: [
      {
        q: '製作學校報告的投影片時，每一頁投影片放多少文字最合適、最容易讓台下同學吸收？',
        options: [
          '掌握「三重點法則」，濃縮成 3 條清楚簡短的重點條列 (Bullet Points)',
          '整篇維基百科複製貼上，字體縮到 10 pt 塞滿整面',
          '完全不打任何字，只放一張鬼臉貼圖'
        ],
        correct: 0,
        explain: '完全正確！少即是多，三重點法則能讓你的簡報既專業又好讀！'
      },
      {
        q: '如果投影片背景是「深藍色或黑色」，上面的文字顏色應該選什麼才符合「高對比 (Contrast)」原則？',
        options: [
          '白色、亮黃色或青綠色等明亮顯眼的顏色',
          '深灰色或深紫色，讓字跟背景融合在一起看不見',
          '透明無色'
        ],
        correct: 0,
        explain: '答得好！深底亮字、淺底深字，高對比能確保教室最後一排的同學也能輕鬆閱讀！'
      }
    ]
  },

  {
    id: 'w4-l2',
    worldId: 'world-4',
    number: '4.2',
    title: 'Scratch 積木程式樂園：事件、迴圈與接蘋果小遊戲實戰',
    titleEn: 'Scratch Coding Playground: Events, Loops & Making a Catch Game',
    icon: '🐱',
    duration: '15 分鐘',
    xp: 220,
    summary: '從玩遊戲變成做遊戲的工程師！理解「事件 (當綠旗點擊)」、「迴圈 (無限重複)」、「條件判斷 (如果碰到)」與「計分變數」，在畫布上打造活生生的接蘋果小遊戲！',
    vocab: [
      { en: 'Event / When Clicked', zh: '事件 / 當綠旗被點擊時', desc: '觸發程式運行的起跑槍聲（例如按下按鈕、敲鍵盤或點擊滑鼠）' },
      { en: 'Loop / Forever', zh: '迴圈 / 重複無限次', desc: '讓電腦不厭其煩一直做同一件事，直到遊戲結束' },
      { en: 'Condition / If...Then', zh: '條件判斷 / 如果...那麼...', desc: '電腦做決定的智慧大腦（例如：如果碰到蘋果，得分就加 1）' },
      { en: 'Variable / Score', zh: '變數 / 計分板', desc: '用來儲存數字或文字的魔法盒子，分數會隨著接住蘋果一直變大！' },
      { en: 'Sprite', zh: '角色精靈', desc: '出現在舞台上的演員（例如接東西的小碗、掉下來的紅蘋果）' }
    ],
    cards: [
      {
        title: '🧩 積木程式就像拼圖：電腦看懂的四個魔法積木',
        titleEn: 'The 4 Core Blocks Every Coder Must Know',
        body: `寫程式不用背生澀難懂的英文字母，MIT 專為孩子設計的 Scratch 用彩色積木拼裝邏輯：
* 🚩 **黃色【事件積木 (Events)】**：\`當 綠旗 點擊\` —— 遊戲開始的總開關！
* 🔁 **橘色【控制迴圈 (Control/Loop)】**：\`重複無限次 (Forever)\` —— 讓遊戲每秒 60 次不斷更新、角色動個不停！
* ❓ **六角形【條件判斷 (If-Then)】**：\`如果 <碰到 碗?> 那麼\` —— 發生碰撞時該執行什麼動作！
* 📦 **橘紅色【變數積木 (Variables)】**：\`將 [得分] 改變 1\` —— 每次成功就讓分數向上加！`,
        highlight: '💡 工程師思維：程式不是魔法，是把一個大任務拆成一步一步的小積木命令！'
      },
      {
        title: '🍎 接蘋果小遊戲 (Catch the Apple) 的解題公式',
        titleEn: 'Game Logic: Bowl Movement, Falling Apple & Scoring',
        body: `怎麼做出經典的接蘋果遊戲？只要拆解成 3 大角色邏輯：
1. 🥣 **小碗角色**：當綠旗被點擊 ➔ 重複無限次 ➔ **將 X 座標設為 [滑鼠的 X 座標]**（碗就會跟隨滑鼠左右流暢移動！）。
2. 🍎 **紅蘋果角色**：當綠旗被點擊 ➔ 從天花板隨機位置出現 ➔ 重複無限次 **將 Y 座標改變 -5**（蘋果筆直往下掉！）。
3. 💥 **接住與計分**：如果蘋果 **<碰到 碗?>** ➔ **[得分 增加 1]** ➔ 播放清脆音效 ➔ **讓蘋果瞬間回到最上方** 重新落下！`,
        highlight: '🎉 恭喜你！只要搞懂這套邏輯，你就能做出接金幣、接星星、甚至躲避隕石的各種好玩遊戲！'
      }
    ],
    simulator: {
      type: 'scratch-blocks',
      title: '🐱 Scratch 積木程式實驗室：拼裝並試玩「接蘋果遊戲」！',
      instruction: '將左側的工作台積木拼入正確位置：1) 碗的移動迴圈 2) 蘋果下墜邏輯 3) 碰撞得分條件！拼裝完成後，右側畫布立刻啟動，用滑鼠左右移動小碗接住 10 顆蘋果破關！'
    },
    quiz: [
      {
        q: '在 Scratch 中，想讓遊戲一按上方綠旗就開始執行程式，必須使用哪種類別的積木當最頂端的第一塊？',
        options: [
          '黃色的「事件積木」：當 綠旗 被點擊 (When green flag clicked)',
          '紅色的「結束遊戲」積木',
          '直接按鍵盤上的 Enter'
        ],
        correct: 0,
        explain: '太棒了！事件 (Event) 是所有程式的發令槍，有了綠旗積木電腦才知道什麼時候開始跑！'
      },
      {
        q: '如果希望角色不斷檢查「有沒有碰到玩家」，而且在整個遊戲過程中都不停下來，應該把判斷積木放進哪種結構裡？',
        options: [
          '「重複無限次 (Forever)」迴圈積木裡面',
          '只執行 0 次的積木',
          '回收垃圾桶'
        ],
        correct: 0,
        explain: '完全正確！迴圈 (Loop) 能讓電腦以超快速度每分每秒不斷檢查條件，打造流暢的遊戲體驗！'
      },
      {
        q: '在遊戲中記錄「接住幾顆蘋果、目前拿了幾分」的魔法數字盒子，在程式設計裡叫做什麼？',
        options: [
          '變數 (Variable)',
          '瀏覽器書籤 (Bookmark)',
          '密碼鎖 (Password)'
        ],
        correct: 0,
        explain: '滿分！變數 (Variable) 就是儲存變動資料的百寶箱，分數、生命值、倒數計時通通靠它！'
      }
    ]
  },

  {
    id: 'w4-l3',
    worldId: 'world-4',
    number: '4.3',
    title: '影音與 AI 圖文故事家：打造你的第一本原創冒險繪本',
    titleEn: 'Audio & Visual Storytelling: Crafting Your First AI Adventure Book',
    icon: '🎬',
    duration: '15 分鐘',
    xp: 240,
    summary: '結合 AI 創意大腦與繪圖提示詞，編織包含起承轉合的三幕冒險繪本！啟動 Web Speech 雙語語音有聲書朗讀，完成全能數位畢業創作！',
    vocab: [
      { en: 'Story Arc', zh: '故事起承轉合 / 故事弧線', desc: '好看的故事包含：出發冒險 (Beginning)、遇到困難挑戰 (Climax)、用智慧化解收尾 (Ending)' },
      { en: 'Storyboard', zh: '分鏡腳本', desc: '像漫畫或電影一樣，把故事切成一幕一幕、一頁圖配一小段文字' },
      { en: 'Voiceover / Narration', zh: '語音朗讀 / 旁白配音', desc: '用電腦語音或自己的聲音把故事生動朗讀出來，變成有聲書！' },
      { en: 'Character Consistency', zh: '角色一致性', desc: '在每一頁繪本中，主角的特徵（例如穿黃色雨衣、戴紅色飛行眼鏡）都要保持相同' },
      { en: 'Digital Portfolio', zh: '數位作品集', desc: '把你親手創作的簡報、程式遊戲與 AI 繪本收藏起來，展現你的探險家成果！' }
    ],
    cards: [
      {
        title: '📖 三幕式繪本魔法：讓你的故事超級吸引人！',
        titleEn: 'The 3-Scene Story Formula: Beginning, Challenge & Victory',
        body: `全世界皮克斯動畫 (Pixar) 與知名童書都在用的故事黃金結構：
* 🌅 **第一幕：出發與遇見夥伴 (Scene 1)**：介紹主角、他的願望，以及他在神秘森林或星際太空遇見的小夥伴。
* ⚡ **第二幕：突如其來的難題挑戰 (Scene 2)**：遇到了迷路的水晶洞窟、或是受困在樹上的小松鼠，氣氛緊張又刺激！
* 🌈 **第三幕：發揮智慧與大團圓 (Scene 3)**：運用在數位探險家學會的勇氣與科學工具，成功化解危機，全場歡呼！`,
        highlight: '💡 創作心法：先想好結局是什麼，再往回設計主角會遇到什麼有趣的考驗！'
      },
      {
        title: '🤖 AI 圖文合一：用五要素打造分鏡插畫與有聲書',
        titleEn: 'Bringing Stories to Life with AI Prompts & Voice Narration',
        body: `怎麼把腦中的想法變成一本真正的圖文冒險書？
1. ✍️ **故事提詞 (Story Prompt)**：請 AI 扮演童書作家，根據你的 3 個情節寫出溫暖有趣的對話。
2. 🎨 **分鏡插畫提詞 (Illustration Prompt)**：運用 World 3 學會的 **「主體 + 動作 + 背景 + 藝術風格 (皮克斯 3D 渲染 / 溫暖水彩) + 光線」**，產生三張風格一致的插圖！
3. 🔊 **語音朗讀 (Text-to-Speech)**：啟動筆電的語音合成器，讓電腦用中英文雙語有聲朗讀，你就是全能的數位小導演！`,
        highlight: '🎉 數位小探險家終極榮耀：你已經學會了筆電、打字、網路、AI 與數位創作，快開啟實驗室完成屬於你的原創繪本！'
      }
    ],
    simulator: {
      type: 'story-studio',
      title: '🎬 AI 圖文與有聲故事實驗室：創作你的 3 幕冒險繪本！',
      instruction: '自由選擇主角、冒險同伴、場景舞台與考驗難題，系統現場產生 3 幕分鏡插圖與故事文案！點擊「🔊 聽有聲書朗讀」聆聽中文與英文旁白，完成你的原創繪本作品！'
    },
    quiz: [
      {
        q: '在創作吸引人的冒險故事時，所謂的「三幕式結構」通常包含哪三個階段？',
        options: [
          '出發介紹主角 ➔ 遇到挑戰與難關 ➔ 發揮智慧化解並歡樂結局',
          '開頭很無聊 ➔ 中間繼續睡覺 ➔ 結尾不知道發生什麼事',
          '從頭到尾只有一句話「好餓喔」'
        ],
        correct: 0,
        explain: '答得太棒了！起承轉合的三幕式結構是全世界最經典的故事魔法！'
      },
      {
        q: '為了讓 3 頁繪本插圖看起來像同一本精美童書，在輸入 AI 繪圖提示詞時，哪一項「要素」最需要維持一致？',
        options: [
          '藝術風格 (Art Style，例如一致保持 3D 皮克斯動畫風或溫暖童話水彩風) 與主角特徵',
          '每一頁都換完全不同的畫風，第一頁塗鴉第二頁抽象畫',
          '不要輸入任何風格關鍵字'
        ],
        correct: 0,
        explain: '非常專業！保持風格關鍵字與角色標誌特徵的一致性，就能做出高質感的專業繪本！'
      },
      {
        q: '完成一本結合文字、插圖與電腦雙語朗讀的數位繪本後，最佳的分享方式是什麼？',
        options: [
          '存入自己的數位作品集，放映給全家人和學校同學觀賞分享',
          '做完馬上丟進資源回收桶刪掉',
          '把筆電摔在地上'
        ],
        correct: 0,
        explain: '太棒了！自信分享、累積自己的作品集，你就是最閃耀的數位小探險家！🌟'
      }
    ]
  },

  // ==========================================================================
  // WORLD 5: ROBLOX 3D 遊戲工坊 (ROBLOX STUDIO MAP & GAME CREATOR)
  // ==========================================================================
  {
    id: 'w5-l1',
    worldId: 'world-5',
    number: '5.1',
    title: 'Roblox Studio 開發工具全攻略：3D 視角、Explorer 與 Anchored 錨定',
    titleEn: 'Roblox Studio Basics: Viewport, Explorer, Properties & Anchored',
    icon: '🧰',
    duration: '18 分鐘',
    xp: 220,
    summary: '認識 Roblox Studio 介面四大核心：3D 視窗飛翔移動、Explorer 物件樹、Properties 屬性面板、Move/Scale/Rotate 工具，以及最重要的 Anchored 固定鎖！',
    vocab: [
      { en: 'Roblox Studio', zh: 'Roblox 開發工作室', desc: '免費的 3D 遊戲與地圖製作軟體，可在 Windows 11 筆電上打造自己的世界' },
      { en: 'Explorer', zh: '檔案總管 / 物件層級樹', desc: '顯示地圖裡所有東西的清單，例如 Workspace、Parts、SpawnLocation' },
      { en: 'Properties', zh: '屬性面板', desc: '用來修改選中積木的顏色 (Color)、材質 (Material)、大小與物理設定' },
      { en: 'Part', zh: '3D 基礎積木', desc: '建造 Roblox 地圖的基本磚塊（方塊 Block、斜坡 Wedge、球體 Sphere 等）' },
      { en: 'Anchored', zh: '錨定 / 固定鎖', desc: '超重要開關！打開 Anchored 積木才會乖乖固定在空中，不會受重力掉下去！' }
    ],
    cards: [
      {
        title: '🚀 打開 Roblox Studio：從玩家變身「3D 世界建築師」！',
        titleEn: 'Installing & Navigating Roblox Studio on Windows 11',
        body: `平常玩 Roblox 是玩別人做的地圖，而 **Roblox Studio** 就是讓你當「遊戲設計師」的免費官方工具！
1. **建立第一張空白地圖**：在 Windows 11 打開 Roblox Studio，點選 **\`Baseplate\`**（經典灰色地板）或 **\`Obby\`** 範本。
2. **3D 視窗飛行秘訣（建議接滑鼠更好操作）**：
   * 按住 **\`W / A / S / D\`** 鍵：像玩遊戲一樣前後左右飛行。
   * 按住 **滑鼠右鍵** 拖曳：轉動攝影機視角看四面八方。
   * 按下鍵盤 **\`F\`** 鍵：攝影機瞬間飛到你選中的積木正前方！`,
        highlight: '🎮 小秘訣：按住 Shift + W/A/S/D 可以慢速精細移動，滾動滑鼠滾輪可以縮放！'
      },
      {
        title: '🧩 四大黃金工具：Part、Move、Scale、Rotate',
        titleEn: 'Building Blocks & Transform Tools',
        body: `上方工具列（Home / Model 分頁）有四個天天都會用到的魔法按鈕：
1. **\`Part\`（新增積木）**：點一下就能在地面生出方塊 (**Block**)、球體 (**Sphere**)、斜坡 (**Wedge**) 或圓柱 (**Cylinder**)。
2. **\`Move\`（移動 - 紅/綠/藍箭頭）**：拉動三個顏色的箭頭，把積木精準移到左邊、右邊或高空中。
3. **\`Scale\`（縮放 - 彩色圓點）**：拉長變成跑酷長橋，或拉寬變成大平台。
4. **\`Rotate\`（旋轉 - 彩色圓環）**：把積木轉成斜坡或帥氣的跳台！`,
        highlight: '🌈 顏色記憶法：X 軸是紅色（左右）、Y 軸是綠色（上下高度）、Z 軸是藍色（前後）！'
      },
      {
        title: '⚓ 新手第一大魔王：忘記按「Anchored (錨定)」！',
        titleEn: 'The #1 Beginner Rule: Always Check Anchored = true!',
        body: `很多小朋友花了一小時蓋好超帥的空中跑酷平台，結果一按 **\`Play\`（試玩）**……整個地圖竟然「碰！」一聲全部掉到地板上散開了！😱
* **為什麼？** 因為 Roblox 世界預設有「地心引力 (Gravity)」，沒有固定住的積木通通會往下掉！
* **解決方法**：點選你的積木 ➔ 到右邊 **\`Properties\`（屬性面板）** 往下滑 ➔ 把 **\`Anchored\`** 打勾（或是按工具列的 **⚓ Anchor** 按鈕）！`,
        highlight: '⚓ 必背口訣：「空中積木要聽話，Anchored 一定要打勾！」'
      }
    ],
    simulator: {
      type: 'roblox-studio-basics',
      title: '🧰 Roblox Studio 互動工作台：新增積木、調色並測試 Anchored 重力！',
      instruction: '1. 點選下方工具列新增「方塊 / 斜坡 / 球體」積木。\n2. 在右側 Properties 修改顏色與尺寸，試著把其中一塊的 Anchored 取消勾選，另一塊保持 Anchored ✅。\n3. 點擊「▶ Playtest 試玩重力」，親眼看看沒有錨定的積木會發生什麼事！'
    },
    quiz: [
      {
        q: '在 Roblox Studio 蓋好一個漂浮在空中的跑酷平台，但一按 Play 試玩平台就掉到地上，最可能忘記開哪個設定？',
        options: [
          '忘記把積木的 Anchored (錨定) 打開',
          '忘記把螢幕亮度調到最高',
          '忘記把平台塗成紅色'
        ],
        correct: 0,
        explain: '答對了！空中平台、牆壁、裝飾物都必須開啟 Anchored = true，才不會被地心引力吸下去！'
      },
      {
        q: '在 Roblox Studio 裡，如果想把選中的積木拉長、變寬或變扁，應該使用哪一個工具？',
        options: [
          'Scale (縮放工具)',
          'Rotate (旋轉工具)',
          'Delete (刪除鍵)'
        ],
        correct: 0,
        explain: '完全正確！Move 負責移動位置、Scale 負責縮放大小、Rotate 負責旋轉角度！'
      },
      {
        q: '當你在 3D 畫面迷路找不到剛新增的積木時，在 Explorer 點選該積木後按下鍵盤哪個鍵可以瞬間飛過去？',
        options: [
          'F 鍵 (Focus 聚焦)',
          'Esc 鍵',
          'Caps Lock 鍵'
        ],
        correct: 0,
        explain: '超專業！按下 F 鍵 (Focus) 就能讓攝影機一秒飛到選中物件的面前！'
      }
    ]
  },
  {
    id: 'w5-l2',
    worldId: 'world-5',
    number: '5.2',
    title: '打造你的第一關 3D 跑酷地圖 (Obby Stage Builder)',
    titleEn: 'Build Your First Obby Stage: Spawn, Checkpoints, Lava & Moving Platforms',
    icon: '🏃',
    duration: '20 分鐘',
    xp: 240,
    summary: '學會 Roblox 最受歡迎的 Obby（障礙跑酷）關卡設計！親手配置出生點、安全平台、岩漿陷阱 (KillBrick)、移動跳台與存檔旗幟 (Checkpoint)，並親自試玩過關！',
    vocab: [
      { en: 'Obby', zh: '障礙跑酷遊戲 (Obstacle Course)', desc: 'Roblox 最經典的遊戲類型：玩家透過跳躍躲避陷阱到達終點' },
      { en: 'SpawnLocation', zh: '玩家出生點', desc: '玩家進入遊戲或失敗重生時會站立的起點方塊' },
      { en: 'Checkpoint', zh: '存檔檢查點', desc: '踩到後就能紀錄進度！下次掉進岩漿不用從頭重來' },
      { en: 'KillBrick / Lava', zh: '扣血陷阱 / 岩漿磚', desc: '玩家一碰到就會立刻歸零重生的紅色發光障礙物' },
      { en: 'Playtest', zh: '親自試玩測試', desc: '好設計師一定會自己玩一遍！檢查跳躍距離是不是太遠、太難' }
    ],
    cards: [
      {
        title: '🏃 什麼是好玩的 跑酷 (Obby) 關卡？',
        titleEn: 'Secrets of Fun Obby Level Design',
        body: `設計跑酷地圖不是把方塊隨便亂放，而是像設計遊樂園一樣，讓玩家覺得「哇！差一點就掉下去，但好刺激！」
1. **起點要有 \`SpawnLocation\`**：如果地圖沒有出生點，玩家可能會從高空掉進無底洞！
2. **間距要公平**：新手關的跳躍距離大約 **6 ~ 10 Studs（Roblox 距離單位）**，太遠會跳不到、太近會覺得無聊。
3. **視覺顏色暗示**：
   * 🟩 **綠色 / 藍色**：安全平台，放心站上去！
   * 🟥 **紅色 / 橘色發光 (Neon)**：危險岩漿 **KillBrick**，千萬不能踩！
   * 🟨 **黃色旗幟**：**Checkpoint 存檔點**，踩到超安心！`,
        highlight: '🎯 設計師鐵則：「自己都能輕鬆跳過 3 次，才算合格的好關卡！」'
      },
      {
        title: '🚩 存檔點 (Checkpoint) 與移動平台 (Moving Platform)',
        titleEn: 'Checkpoints & Dynamic Obstacles',
        body: `為了讓朋友玩你的跑酷不會玩到生氣，記得加入這兩個設計：
* **每 4~5 個難關放一個 \`Checkpoint\`**：利用 \`Teams\` 或進度腳本，讓玩家死掉後從最近的 Checkpoint 重生，成就感大大提升！
* **加入會動的「移動平台」**：把單純的跳躍升級成「會左右滑動的浮空磚塊」，玩家必須抓準時機起跳！`,
        highlight: '💡 小技巧：在 Roblox Studio 可以直接搜尋官方內建的 Obby 範本，觀察它怎麼擺放 Checkpoint！'
      }
    ],
    simulator: {
      type: 'roblox-obby-builder',
      title: '🏃 3D 跑酷地圖工坊 (Obby Builder & Playtester)：蓋好馬上自己玩！',
      instruction: '1. 點選上方畫筆工具（安全平台 🟩、岩漿陷阱 🟥、移動平台 🟦、存檔點 🚩、終點獎盃 🏆），在網格上設計你的專屬跑酷關卡！\n2. 點擊「▶ Playtest 試玩跑酷」，用鍵盤 ← →（或 A / D）移動、空白鍵（或 ↑ / W）跳躍，挑戰從起點一路跳到終點！'
    },
    quiz: [
      {
        q: '設計 Roblox 跑酷 (Obby) 地圖時，每隔幾關放置「Checkpoint (存檔點)」最重要的目的是什麼？',
        options: [
          '讓玩家失敗後可以從最近的存檔點復活，不會因為一直從頭重來而放棄',
          '讓地圖看起來比較擁擠',
          '讓角色移動速度變慢'
        ],
        correct: 0,
        explain: '太棒了！合理的 Checkpoint 設計能讓玩家越玩越有挑戰動力！'
      },
      {
        q: '在跑酷關卡中，通常會用什麼顏色與材質來提示玩家「這是不能踩的岩漿陷阱 (KillBrick)」？',
        options: [
          '紅色或橘色加上發光 (Neon) 材質',
          '透明的空氣',
          '綠色草地材質'
        ],
        correct: 0,
        explain: '沒錯！清楚的視覺語言（紅/橘發光 = 危險）能讓玩家一眼看懂規則！'
      },
      {
        q: '每次蓋好一段新的跑酷跳台後，最負責任的遊戲設計師應該先做什麼？',
        options: [
          '按 Play 親自試玩，確認每個跳台距離都跳得過去',
          '直接關掉電腦去睡覺',
          '把跳台拉到 100 公尺遠讓人完全跳不到'
        ],
        correct: 0,
        explain: '完全正確！Playtest 親自試玩是做出高品質遊戲最重要的好習慣！'
      }
    ]
  },
  {
    id: 'w5-l3',
    worldId: 'world-5',
    number: '5.3',
    title: 'Luau 魔法腳本：讓金幣、加速板與感應門動起來！',
    titleEn: 'Roblox Luau Scripting: Touched Events, Coins, Speed Pads & Secret Doors',
    icon: '⚡',
    duration: '20 分鐘',
    xp: 260,
    summary: '不用怕寫程式！用最簡單的三行 Luau 積木邏輯認識 Script、Touched 觸碰事件與 Humanoid，親手寫出會加分的金幣、加速板與彈跳機關！',
    vocab: [
      { en: 'Luau Script', zh: 'Roblox 程式腳本', desc: 'Roblox 使用的程式語言（類似 Lua），就像給積木看的魔法說明書' },
      { en: 'Touched', zh: '觸碰事件', desc: '當玩家角色踩到或撞到某個積木時，自動觸發的機關感應器' },
      { en: 'Humanoid', zh: '角色核心控制器', desc: '控制玩家血量 (Health)、跑步速度 (WalkSpeed) 與跳躍高度 (JumpPower) 的元件' },
      { en: 'leaderstats', zh: '排行榜積分系統', desc: '顯示在畫面右上角的玩家分數、金幣 (Coins) 或關卡數！' }
    ],
    cards: [
      {
        title: '📜 什麼是 Luau Script？讓積木擁有超能力！',
        titleEn: 'Giving Parts Superpowers with Luau Scripts',
        body: `學會放積木後，只要在積木裡面按下 \`+\` 號加入一個 **\`Script\`**，它就會聽懂你的命令！
在 Roblox 的 **Luau** 程式語言裡，最常用到的魔法公式只有 3 步：
1. **找到自己**：\`local part = script.Parent\`（代表這個腳本所在的積木）
2. **裝上感應器**：\`part.Touched:Connect(function(hit)\`（有人踩到我時就啟動！）
3. **檢查是不是玩家**：看看撞到我的人身上有沒有 \`Humanoid\`，有的話就幫他 **加速**、**彈高** 或 **加金幣**！`,
        highlight: '⚡ 不用死背英文！看懂「觸碰 (Touched) ➔ 檢查玩家 (Humanoid) ➔ 執行魔法」的邏輯就超強了！'
      },
      {
        title: '🪙 經典三大實用機關程式碼',
        titleEn: '3 Must-Know Roblox Game Mechanics',
        body: `學會這三個機關，你的跑酷和冒險地圖立刻好玩 10 倍：
* **⚡ 加速板 (Speed Pad)**：把 \`humanoid.WalkSpeed\` 從預設的 \`16\` 變成 \`40\`，一踩就衝刺！
* **🦘 彈跳板 (Bounce Pad)**：把 \`humanoid.JumpPower\` 調高到 \`120\`（或給向上推力），一跳飛上屋頂！
* **🪙 旋轉金幣 (Collectible Coin)**：踩到後讓右上角 \`leaderstats.Coins.Value += 1\`，並把金幣暫時隱藏再重生！`,
        highlight: '🛡️ 防呆小常識：加金幣時要設一個 `debounce`（冷卻開關），才不會踩一下瞬間加 100 次！'
      }
    ],
    simulator: {
      type: 'roblox-lua-lab',
      title: '⚡ Luau 魔法腳本實驗室：組裝程式碼並派小探險家測試機關！',
      instruction: '1. 選擇你想製作的機關類型（🪙 金幣、⚡ 加速板、🦘 彈跳板、🚪 密碼感應門）。\n2. 依序點擊下方的 Luau 程式積木行，組裝出完整的腳本！\n3. 點擊「▶ Run Script 派角色踩上去」，觀察右上角金幣數、速度與機關動畫！'
    },
    quiz: [
      {
        q: '在 Roblox 的 Luau 腳本裡，當我們想做一個「玩家踩到就會觸發」的加速板或岩漿，要用哪一個事件？',
        options: [
          'part.Touched',
          'part.ColorChanged',
          'part.Sleep'
        ],
        correct: 0,
        explain: '答對了！Touched 就是「被觸碰」的意思，是 Roblox 互動機關最核心的感應器！'
      },
      {
        q: '如果想讓踩到加速板的玩家跑得像閃電一樣快，應該修改角色 Humanoid 的哪一個屬性？',
        options: [
          'WalkSpeed (例如從 16 改成 40)',
          'Part.Name',
          'Workspace.Gravity'
        ],
        correct: 0,
        explain: '超強！Humanoid.WalkSpeed 控制走路與跑步的速度（預設值為 16）！'
      },
      {
        q: '為什麼寫「撿金幣」腳本時，通常會加一個冷卻開關 (Debounce)？',
        options: [
          '避免玩家腳還沒離開金幣，一瞬間重複觸發加了幾十次分數',
          '讓金幣變成正方形',
          '把電腦關機'
        ],
        correct: 0,
        explain: '專業級觀念！Debounce（防連點冷卻）是每個 Roblox 工程師必學的技巧！'
      }
    ]
  },
  {
    id: 'w5-l4',
    worldId: 'world-5',
    number: '5.4',
    title: '解鎖多種 Roblox 遊戲類型與安全發佈作品！',
    titleEn: 'Build Multiple Game Genres (Tycoon, Simulator, Racing, Hide & Seek) & Publish Safely',
    icon: '🏆',
    duration: '20 分鐘',
    xp: 280,
    summary: '用學到的 Studio 工具與腳本邏輯，舉一反三打造大亨經營 (Tycoon)、寵物模擬器 (Simulator)、賽車競速、躲貓貓四種熱門遊戲，並學會安全檢查 Toolbox 與發佈地圖！',
    vocab: [
      { en: 'Tycoon', zh: '大亨經營遊戲', desc: '蓋工廠賺錢 ➔ 買機器升級 ➔ 蓋出超豪華基地的經典玩法' },
      { en: 'Simulator', zh: '模擬器遊戲', desc: '收集資源（點擊/挖礦）➔ 賣掉換金幣 ➔ 買更強背包與寵物的循環' },
      { en: 'Toolbox', zh: '免費素材工具箱', desc: '可以借用別人的 3D 模型，但要小心檢查裡面有沒有隱藏的壞腳本！' },
      { en: 'Publish to Roblox', zh: '發佈到 Roblox', desc: '把做好的遊戲上傳到雲端，還能設為 Private（私人）或 Friends（只限好友）一起玩！' }
    ],
    cards: [
      {
        title: '🎮 學會 Roblox Studio 後，你可以做出哪些超酷遊戲？',
        titleEn: 'One Toolset, Infinite Game Genres!',
        body: `你已經學會的 **3D 積木 + 屬性調整 + Touched 觸碰腳本**，其實就是所有熱門 Roblox 遊戲的共同積木！
1. **🏭 大亨經營 (Tycoon)**：自動掉磚塊的 \`Dropper\` ➔ 輸送帶 \`Conveyor\` ➔ 換錢機 \`Collector\` ➔ 踩按鈕解鎖新樓層！
2. **🐾 收集模擬器 (Simulator)**：點擊 / 收集寶石 ➔ 裝滿背包 \`Backpack\` ➔ 賣掉換金幣買可愛寵物！
3. **🏎️ 賽車競速 (Racing)**：用 Part 蓋跑道 + 放進 \`VehicleSeat\` 駕駛座 + 設好圈數 Checkpoint！
4. **👻 躲貓貓 (Hide & Seek)**：蓋一座大房子，設定倒數計時器把玩家分成「鬼 (Seeker)」與「躲藏者 (Hider)」！`,
        highlight: '🌟 舉一反三：先做出一個小小的「最小好玩版本 (MVP)」，再慢慢加新房間與新道具！'
      },
      {
        title: '🛡️ 工具箱 (Toolbox) 安全守則與安全發佈',
        titleEn: 'Toolbox Virus Check & Safe Publishing for Kids',
        body: `在發佈你的傑作給朋友玩之前，一定要做 **安全雙重檢查**：
1. **檢查 Toolbox 免費模型**：從 Toolbox 放進別人做的車子或房子時，記得打開 **Explorer** 檢查裡面有沒有名字怪怪的 \`Script\`（例如 \`Infection\`、\`Virus\`），有可疑腳本就立刻刪掉！
2. **安全發佈設定 (\`File → Publish to Roblox\`)**：
   * 建議小朋友一開始先設為 **\`Private\`（只有自己能玩）** 或 **\`Friends\`（只邀請家人和好朋友）**，安全又好玩！
   * 記得幫遊戲取一個響亮的名字，並截一張酷炫的封面圖！`,
        highlight: '🔒 安全第一：不隨便使用來源不明的腳本，並和爸媽一起確認隱私權限設定！'
      }
    ],
    simulator: {
      type: 'roblox-game-architect',
      title: '🏆 多元遊戲藍圖工坊：選擇 4 種遊戲類型，組裝核心循環並通過發佈檢查！',
      instruction: '1. 選擇你想挑戰的遊戲類型（🏭 大亨 Tycoon / 🐾 模擬器 Simulator / 🏎️ 賽車 Racing / 👻 躲貓貓 Hide & Seek）。\n2. 依序放入該遊戲必備的 4 個核心模組，點擊「▶ 模擬遊戲循環」看它怎麼運作！\n3. 完成底部的「安全發佈檢查清單」，領取你的 Roblox 建築大師認證！'
    },
    quiz: [
      {
        q: '在製作「大亨經營 (Tycoon)」遊戲時，最核心的賺錢循環是由哪幾個部件組成的？',
        options: [
          '生產機 (Dropper) ➔ 輸送帶 (Conveyor) ➔ 收銀台 (Collector) ➔ 踩按鈕升級',
          '只有一塊灰色地板什麼都沒有',
          '一直按關機鍵'
        ],
        correct: 0,
        explain: '完全正確！生產 ➔ 運送 ➔ 換錢 ➔ 升級擴建，就是所有 Tycoon 遊戲迷人的核心循環！'
      },
      {
        q: '從 Toolbox（免費素材庫）放入別人做的超帥跑車時，為了安全應該在 Explorer 做什麼檢查？',
        options: [
          '展開模型檢查裡面有沒有可疑或不明的 Script 腳本，若有就刪除',
          '把整個 Workspace 刪掉',
          '不用檢查，放越多來路不明的腳本越好'
        ],
        correct: 0,
        explain: '超棒的安全意識！清理不必要的未知腳本可以保護你的地圖不被惡搞或卡頓！'
      },
      {
        q: '當小朋友剛學會發佈自己的第一款 Roblox 地圖，想先和家人或認識的同學測試同樂，建議將遊戲權限設為什麼？',
        options: [
          'Private（私人）或 Friends（只限好友）',
          '把帳號密碼公開在網路上',
          '隨便讓全世界陌生人進來亂改設定'
        ],
        correct: 0,
        explain: '太棒了！設定為 Private 或 Friends 是最適合小小創作者的安全測試方式！🎉'
      }
    ]
  }
];
