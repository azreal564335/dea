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
    titleEn: 'ASUS Windows 11 & Touch Typing',
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
  }
];

window.CURRICULUM_LESSONS = [
  // ==========================================================================
  // WORLD 1: 筆電小達人 (ASUS WINDOWS 11 & TYPING)
  // ==========================================================================
  {
    id: 'w1-l1',
    worldId: 'world-1',
    number: '1.1',
    title: '保護筆電與正確開關機',
    titleEn: 'Laptop Care, ASUS Fn Keys & Safe Shut Down',
    icon: '🛡️',
    duration: '8 分鐘',
    xp: 100,
    summary: '學會保護你的全新 ASUS 筆電、認識睡眠與關機的差別，以及音量與亮度調整！',
    vocab: [
      { en: 'Power', zh: '電源', desc: '開機與關機的電源標誌 (圓圈加一條直線)' },
      { en: 'Shut down', zh: '關機', desc: '今天不再用電腦時，把所有程式收好並完全關閉電源' },
      { en: 'Sleep', zh: '睡眠', desc: '只是去吃飯或上廁所，讓電腦暫時閉上眼睛休息省電' },
      { en: 'Restart', zh: '重新啟動', desc: '當電腦更新或怪怪的時候，關掉並自動重新開機' },
      { en: 'Battery', zh: '電池', desc: '右下角顯示還剩多少電量，低於 20% 就要插充電線囉！' }
    ],
    cards: [
      {
        title: '🎉 歡迎來到你的專屬 ASUS 筆電！四個黃金保護守則',
        titleEn: '4 Golden Rules to Protect Your New ASUS Laptop',
        body: `恭喜你擁有了自己的專屬筆電！筆電就像精密的太空船，要讓它陪你很久，請記住這 **4 個超重要習慣**：
1. **雙手抱穩穩 (Two Hands Always)**：移動筆電時，先把螢幕蓋起來，用雙手像捧寶物一樣拿，絕對不單手抓螢幕！
2. **飲料離遠遠 (Drinks Far Away)**：水杯、珍奶、果汁一定要放在離筆電至少一個手臂遠的地方（鍵盤喝水就會生重病！）。
3. **蓋上螢幕前先檢查 (Check Before Closing)**：**這點超多人忘記！** 蓋螢幕前一定要確認鍵盤上沒有鉛筆、橡皮擦或耳機，不然一壓下去螢幕就會裂開！
4. **乾淨小手與散熱呼吸 (Clean Hands & Airflow)**：盡量在硬桌面上用筆電，不要放在厚棉被上擋住底部的散熱孔。`,
        highlight: '💡 小口訣：「雙手捧、水放遠、蓋前看一看、桌上好散熱！」'
      },
      {
        title: '🔆 認識 ASUS 鍵盤最上面一排：音量與亮度魔法鍵',
        titleEn: 'ASUS Function Row: Volume, Brightness & Wi-Fi',
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
        highlight: '🎯 馬上試試看：現在用「兩根手指」在你的 ASUS 觸控板上輕輕上下滑動，看看這個畫面會不會上下移動！'
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
        explain: '太聰明了！兩指併攏上下滑動就是 ASUS Windows 11 觸控板的捲動手勢！'
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
    duration: '20 分鐘 (含 19 關打字道館)',
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
        titleEn: 'How to Switch Between Chinese (中) and English (英) on ASUS Windows 11',
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
        body: `在 ASUS 鍵盤上打繁體中文超簡單：
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
        highlight: '🎹 接下來我們準備了 5 大階段、共 19 關循序漸進的「中英打字道館」（從 fff jjj、as asd、aaa bbb ccc 一路練到注音與中英切換）！'
      }
    ],
    simulator: {
      type: 'typing-dojo',
      title: '🥋 老鷹變獵鷹：19 關中英盲打與注音特訓道館',
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
* 💻 **World 1 筆電小達人**：學會照顧 ASUS 筆電、視窗控制、中英盲打與注音切換、以及 ` + '`Ctrl+C/V/Z/S`' + ` 快捷鍵！
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
  }
];
