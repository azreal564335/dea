/**
 * ============================================================================
 * 🎹 TYPING DRILLS DATA (data/typing-drills.js)
 * ============================================================================
 * How to add more typing drills in the future:
 * Simply add a new object to any category's `drills` array below, or create a
 * new category! The Typing Dojo engine automatically renders all categories,
 * finger guides, Zhuyin hints, and tracks WPM & stars per drill.
 * ============================================================================
 */

window.TYPING_DATA = {
  // Full Taiwan Keyboard Map (English Key -> Zhuyin Symbol + Finger Assignment)
  // Fingers: 'L5' (Left Pinky), 'L4' (Left Ring), 'L3' (Left Middle), 'L2' (Left Index),
  //          'R2' (Right Index), 'R3' (Right Middle), 'R4' (Right Ring), 'R5' (Right Pinky), 'THUMB' (Space)
  keyboardLayout: [
    [
      { key: '1', zhuyin: 'ㄅ', sub: '!', finger: 'L5', hand: '左手小指' },
      { key: '2', zhuyin: 'ㄉ', sub: '@', finger: 'L4', hand: '左手無名指' },
      { key: '3', zhuyin: 'ˇ', sub: '#', finger: 'L3', hand: '左手中指 (三聲ˇ)' },
      { key: '4', zhuyin: 'ˋ', sub: '$', finger: 'L2', hand: '左手食指 (四聲ˋ)' },
      { key: '5', zhuyin: 'ㄓ', sub: '%', finger: 'L2', hand: '左手食指' },
      { key: '6', zhuyin: 'ˊ', sub: '^', finger: 'R2', hand: '右手食指 (二聲ˊ)' },
      { key: '7', zhuyin: '˙', sub: '&', finger: 'R2', hand: '右手食指 (輕聲˙)' },
      { key: '8', zhuyin: 'ㄚ', sub: '*', finger: 'R3', hand: '右手中指' },
      { key: '9', zhuyin: 'ㄞ', sub: '(', finger: 'R4', hand: '右手無名指' },
      { key: '0', zhuyin: 'ㄢ', sub: ')', finger: 'R5', hand: '右手小指' },
      { key: '-', zhuyin: 'ㄦ', sub: '_', finger: 'R5', hand: '右手小指' }
    ],
    [
      { key: 'q', zhuyin: 'ㄆ', finger: 'L5', hand: '左手小指' },
      { key: 'w', zhuyin: 'ㄊ', finger: 'L4', hand: '左手無名指' },
      { key: 'e', zhuyin: 'ㄍ', finger: 'L3', hand: '左手中指' },
      { key: 'r', zhuyin: 'ㄐ', finger: 'L2', hand: '左手食指' },
      { key: 't', zhuyin: 'ㄔ', finger: 'L2', hand: '左手食指' },
      { key: 'y', zhuyin: 'ㄗ', finger: 'R2', hand: '右手食指' },
      { key: 'u', zhuyin: 'ㄧ', finger: 'R2', hand: '右手食指' },
      { key: 'i', zhuyin: 'ㄛ', finger: 'R3', hand: '右手中指' },
      { key: 'o', zhuyin: 'ㄟ', finger: 'R4', hand: '右手無名指' },
      { key: 'p', zhuyin: 'ㄣ', finger: 'R5', hand: '右手小指' }
    ],
    [
      { key: 'a', zhuyin: 'ㄇ', finger: 'L5', hand: '左手小指 (基準鍵)', home: true },
      { key: 's', zhuyin: 'ㄋ', finger: 'L4', hand: '左手無名指 (基準鍵)', home: true },
      { key: 'd', zhuyin: 'ㄎ', finger: 'L3', hand: '左手中指 (基準鍵)', home: true },
      { key: 'f', zhuyin: 'ㄑ', finger: 'L2', hand: '左手食指 (定位凸點!)', home: true, bump: true },
      { key: 'g', zhuyin: 'ㄕ', finger: 'L2', hand: '左手食指' },
      { key: 'h', zhuyin: 'ㄘ', finger: 'R2', hand: '右手食指' },
      { key: 'j', zhuyin: 'ㄨ', finger: 'R2', hand: '右手食指 (定位凸點!)', home: true, bump: true },
      { key: 'k', zhuyin: 'ㄜ', finger: 'R3', hand: '右手中指 (基準鍵)', home: true },
      { key: 'l', zhuyin: 'ㄠ', finger: 'R4', hand: '右手無名指 (基準鍵)', home: true },
      { key: ';', zhuyin: 'ㄤ', finger: 'R5', hand: '右手小指 (基準鍵)', home: true }
    ],
    [
      { key: 'z', zhuyin: 'ㄈ', finger: 'L5', hand: '左手小指' },
      { key: 'x', zhuyin: 'ㄌ', finger: 'L4', hand: '左手無名指' },
      { key: 'c', zhuyin: 'ㄏ', finger: 'L3', hand: '左手中指' },
      { key: 'v', zhuyin: 'ㄒ', finger: 'L2', hand: '左手食指' },
      { key: 'b', zhuyin: 'ㄖ', finger: 'L2', hand: '左手食指' },
      { key: 'n', zhuyin: 'ㄙ', finger: 'R2', hand: '右手食指' },
      { key: 'm', zhuyin: 'ㄩ', finger: 'R2', hand: '右手食指' },
      { key: ',', zhuyin: 'ㄝ', finger: 'R3', hand: '右手中指' },
      { key: '.', zhuyin: 'ㄡ', finger: 'R4', hand: '右手無名指' },
      { key: '/', zhuyin: 'ㄥ', finger: 'R5', hand: '右手小指' }
    ]
  ],

  categories: [
    {
      id: 'home-row',
      title: '階段 1：基準鍵單鍵與雙鍵 (Home Row: A S D F J K L ;)',
      titleEn: 'Stage 1: Home Row Foundations (F/J Bumps to A-S-D-F-J-K-L-;)',
      badge: '🏠 基礎必練',
      description: '把雙手食指放在有小凸點的 F 和 J 上！眼睛看螢幕，不當「一指神功老鷹」！',
      drills: [
        {
          id: 'hr-1',
          name: '第 1 關：食指雙胞胎 (f 與 j)',
          nameEn: 'Level 1: Index Finger Twins (f & j)',
          tip: '摸摸看 F 和 J 上面的小凸點！用左手食指按 f，右手食指按 j，大拇指按空白鍵 (Space)。',
          mode: 'english',
          text: 'fff jjj fff jjj fj fj jf jf fff jjj fjf jfj'
        },
        {
          id: 'hr-2',
          name: '第 2 關：中指加入戰局 (d 與 k)',
          nameEn: 'Level 2: Middle Fingers Join (d & k)',
          tip: '左手中指按 d，右手中指按 k！打完記得手指回到基準鍵休息喔。',
          mode: 'english',
          text: 'ddd kkk ddd kkk dk dk kd kd df jk fd kj dfjk'
        },
        {
          id: 'hr-3',
          name: '第 3 關：無名指與小指 (s, l, a, ;)',
          nameEn: 'Level 3: Ring & Pinky Fingers (s, l, a, ;)',
          tip: '無名指負責 s 和 l，小指負責 a 和 ;（分號）。像彈鋼琴一樣輕輕按！',
          mode: 'english',
          text: 'sss lll aaa ;;; sl sl as as asd asd jkl jkl; asdf jkl;'
        },
        {
          id: 'hr-4',
          name: '第 4 關：經典連打特訓 (as / asd / fgh / jkl)',
          nameEn: 'Level 4: Classic Combo Drills (as, asd, gh, jkl)',
          tip: '食指往中間伸一下可以按到 g 和 h，按完馬上縮回 f 和 j！',
          mode: 'english',
          text: 'as as as asd asd asd fg fg hj hj gh gh asdfg hjkl;'
        },
        {
          id: 'hr-5',
          name: '第 5 關：基準排英文真字大挑戰！',
          nameEn: 'Level 5: Real Words Using Only the Home Row!',
          tip: '只用中間這一排按鍵，你已經能打出好多真正的英文單字了！',
          mode: 'english',
          text: 'dad sad ask all fall salad half glad flask dash'
        }
      ]
    },
    {
      id: 'top-row',
      title: '階段 2：上排按鍵擴展 (Top Row: Q W E R T Y U I O P)',
      titleEn: 'Stage 2: Reaching Up to the Top Row',
      badge: '⬆️ 往上延伸',
      description: '手指從中間基準排往上伸一格，按完立刻回到 F 和 J 的家！',
      drills: [
        {
          id: 'tr-1',
          name: '第 6 關：食指往上跳 (r, t, y, u)',
          nameEn: 'Level 6: Index Fingers Reach Up (r, t, y, u)',
          tip: '左手食指從 f 往上按 r 和 t；右手食指從 j 往上按 y 和 u！',
          mode: 'english',
          text: 'rrr ttt yyy uuu frf ftf jyj juj rt yu trytry'
        },
        {
          id: 'tr-2',
          name: '第 7 關：中指與無名指往上跳 (e, i, w, o)',
          nameEn: 'Level 7: Middle & Ring Reach Up (e, i, w, o)',
          tip: '中指往上按 e 和 i（最常出現的母音！），無名指往上按 w 和 o。',
          mode: 'english',
          text: 'eee iii www ooo ded kik sws lol wewe ioio'
        },
        {
          id: 'tr-3',
          name: '第 8 關：小指守門員與上排全串連 (q, p & qwerty)',
          nameEn: 'Level 8: Pinky Reach & Full Top Row (q, p)',
          tip: '左手小指往上按 q，右手小指往上按 p！看看鍵盤左上角是不是寫著 qwerty？',
          mode: 'english',
          text: 'qqq ppp aqa ;p; qwe rty uio pppp qwerty uiop'
        },
        {
          id: 'tr-4',
          name: '第 9 關：上排＋中排超常用英文單字',
          nameEn: 'Level 9: High-Frequency Words (Top + Home Row)',
          tip: '這些都是日常與電腦最常見的英文單字，試著不看鍵盤打出來！',
          mode: 'english',
          text: 'tree water like play good look kid superhero'
        }
      ]
    },
    {
      id: 'bottom-row',
      title: '階段 3：下排與 A-Z 節奏大師 (Bottom Row & A-Z Rhythm)',
      titleEn: 'Stage 3: Bottom Row & Full A-Z Mastery',
      badge: '⬇️ 全鍵盤制霸',
      description: '征服最後一排 Z X C V B N M，完成 26 個英文字母盲打特訓！',
      drills: [
        {
          id: 'br-1',
          name: '第 10 關：下排食指與中指 (v, b, n, m, c)',
          nameEn: 'Level 10: Bottom Row Center (v, b, n, m, c)',
          tip: '左手食指往下按 v 和 b，左手中指按 c；右手食指往下按 n 和 m。',
          mode: 'english',
          text: 'vvv bbb nnn mmm ccc fvf jnjjm dcd cvb nm'
        },
        {
          id: 'br-2',
          name: '第 11 關：經典節奏連打 (aaa bbb ccc ... zzz)',
          nameEn: 'Level 11: Classic A-B-C Triple Rhythm',
          tip: '就像學打字最經典的暖身操！每個字母連打三下，感受每根手指的位置！',
          mode: 'english',
          text: 'aaa bbb ccc ddd eee fff ggg hhh iii jjj kkk lll mmm'
        },
        {
          id: 'br-3',
          name: '第 12 關：後半段字母三連打 (nnn ooo ppp ... zzz)',
          nameEn: 'Level 12: N-to-Z Triple Rhythm',
          tip: '繼續保持節奏！從 n 一路打到 z，注意 x 是無名指、z 是左手小指喔！',
          mode: 'english',
          text: 'nnn ooo ppp qqq rrr sss ttt uuu vvv www xxx yyy zzz'
        },
        {
          id: 'br-4',
          name: '第 13 關：全鍵盤英文神獸挑戰 (The Quick Brown Fox)',
          nameEn: 'Level 13: The Famous 26-Letter Sentence',
          tip: '這句著名的英文句子包含了全部 26 個英文字母！慢慢打，準確度最重要！',
          mode: 'english',
          text: 'the quick brown fox jumps over the lazy dog'
        }
      ]
    },
    {
      id: 'zhuyin-dojo',
      title: '階段 4：注音符號與四聲選字 (Zhuyin Bopomofo Dojo)',
      titleEn: 'Stage 4: Zhuyin (Bopomofo) & Tone Keys',
      badge: '🇹🇼 注音特訓',
      description: '標準注音鍵盤上的注音是由左到右排列的！學會「一聲空白鍵、二聲6、三聲3、四聲4、輕聲7」！',
      drills: [
        {
          id: 'zy-1',
          name: '第 14 關：聲母左半邊尋寶 (ㄅㄆㄇㄈ ㄉㄊㄋㄌ)',
          nameEn: 'Level 14: Left-Hand Zhuyin Consonants (ㄅㄆㄇㄈ ㄉㄊㄋㄌ)',
          tip: '看看鍵盤最左邊兩排！由上往下正好是：ㄅ(1) ㄆ(q) ㄇ(a) ㄈ(z)，右邊一排是：ㄉ(2) ㄊ(w) ㄋ(s) ㄌ(x)！本關用按鍵位置練習你的手指記憶！',
          mode: 'zhuyin-keys',
          zhuyinDisplay: 'ㄅ ㄆ ㄇ ㄈ   ㄉ ㄊ ㄋ ㄌ   ㄍ ㄎ ㄏ   ㄐ ㄑ ㄒ',
          text: '1 q a z 2 w s x e d c r f v',
          keyHintMap: {
            '1': 'ㄅ(1)', 'q': 'ㄆ(Q)', 'a': 'ㄇ(A)', 'z': 'ㄈ(Z)',
            '2': 'ㄉ(2)', 'w': 'ㄊ(W)', 's': 'ㄋ(S)', 'x': 'ㄌ(X)',
            'e': 'ㄍ(E)', 'd': 'ㄎ(D)', 'c': 'ㄏ(C)',
            'r': 'ㄐ(R)', 'f': 'ㄑ(F)', 'v': 'ㄒ(V)'
          }
        },
        {
          id: 'zy-2',
          name: '第 15 關：介音與韻母右半邊 (ㄧㄨㄩ ㄚㄛㄜㄝ ㄞㄟㄠㄡ)',
          nameEn: 'Level 15: Right-Hand Vowels (ㄧㄨㄩ ㄚㄛㄜㄝ)',
          tip: '右手食指管「ㄧ(u) ㄨ(j) ㄩ(m)」！再往右是「ㄚ(8) ㄛ(i) ㄜ(k) ㄝ(,)」和「ㄞ(9) ㄟ(o) ㄠ(l) ㄡ(.)」！',
          mode: 'zhuyin-keys',
          zhuyinDisplay: 'ㄧ ㄨ ㄩ   ㄚ ㄛ ㄜ   ㄞ ㄟ ㄠ ㄡ   ㄢ ㄣ ㄤ ㄥ',
          text: 'u j m 8 i k 9 o l . 0 p ; /',
          keyHintMap: {
            'u': 'ㄧ(U)', 'j': 'ㄨ(J)', 'm': 'ㄩ(M)',
            '8': 'ㄚ(8)', 'i': 'ㄛ(I)', 'k': 'ㄜ(K)',
            '9': 'ㄞ(9)', 'o': 'ㄟ(O)', 'l': 'ㄠ(L)', '.': 'ㄡ(.)',
            '0': 'ㄢ(0)', 'p': 'ㄣ(P)', ';': 'ㄤ(;)', '/': 'ㄥ(/)'
          }
        },
        {
          id: 'zy-3',
          name: '第 16 關：聲調魔法鍵 (二聲ˊ=6、三聲ˇ=3、四聲ˋ=4、輕聲˙=7)',
          nameEn: 'Level 16: The 5 Tone Keys + Spelling Words by Key',
          tip: '超重要口訣：一聲按「空白鍵」，二聲按 6(ˊ)，三聲按 3(ˇ)，四聲按 4(ˋ)，輕聲按 7(˙)！我們來拼出「你好 (su3 cl3)」、「電腦 (2u04 s03)」、「快樂 (dj94 xk4)」的按鍵！',
          mode: 'zhuyin-keys',
          zhuyinDisplay: '你好 (ㄋㄧˇ ㄏㄠˇ)   電腦 (ㄉㄧㄢˋ ㄋㄠˇ)   快樂 (ㄎㄨㄞˋ ㄌㄜˋ)',
          text: 'su3 cl3 2u04 s03 dj94 xk4',
          keyHintMap: {
            's': 'ㄋ(S)', 'u': 'ㄧ(U)', '3': 'ˇ(3)', 'c': 'ㄏ(C)', 'l': 'ㄠ(L)',
            '2': 'ㄉ(2)', '0': 'ㄢ(0)', '4': 'ˋ(4)', 'd': 'ㄎ(D)', 'j': 'ㄨ(J)',
            '9': 'ㄞ(9)', 'x': 'ㄌ(X)', 'k': 'ㄜ(K)'
          }
        },
        {
          id: 'zy-4',
          name: '第 17 關：切換真中文輸入法實戰！(打真正的繁體中文字)',
          nameEn: 'Level 17: Real Traditional Chinese Input Challenge!',
          tip: '現在請按鍵盤上的 Shift 或 Win + 空白鍵，把右下角切換成「中 (微軟注音)」！打出下面的中文字，遇到同音字按「↓方向鍵」選字，最後按 Enter 消掉底線！',
          mode: 'chinese-real',
          zhuyinBreakdown: [
            { char: '你好', py: 'ㄋㄧˇ ㄏㄠˇ (s-u-3 c-l-3)' },
            { char: '謝謝', py: 'ㄒㄧㄝˋ ㄒㄧㄝ˙ (v-u-,4 v-u-,7)' },
            { char: '台灣', py: 'ㄊㄞˊ ㄨㄢ (w-9-6 j-0-Space)' },
            { char: '電腦', py: 'ㄉㄧㄢˋ ㄋㄠˇ (2-u-0-4 s-l-3)' },
            { char: '小達人', py: 'ㄒㄧㄠˇ ㄉㄚˊ ㄖㄣˊ (v-u-l-3 2-8-6 b-p-6)' }
          ],
          text: '你好 謝謝 台灣 電腦 小達人'
        },
        {
          id: 'zy-6',
          name: '第 18 關：中排聲母特訓 (ㄓㄔㄕㄖ ㄗㄘㄙ)',
          nameEn: 'Level 18: Middle Column Zhuyin Consonants (ㄓㄔㄕㄖ ㄗㄘㄙ)',
          tip: '鍵盤正中間兩排食指區就是捲舌音「ㄓ(5) ㄔ(t) ㄕ(g) ㄖ(b)」與平舌音「ㄗ(y) ㄘ(h) ㄙ(n)」！用左右食指分別練習！',
          mode: 'zhuyin-keys',
          zhuyinDisplay: 'ㄓ ㄔ ㄕ ㄖ   ㄗ ㄘ ㄙ',
          text: '5 t g b y h n 5tgb yhn',
          keyHintMap: {
            '5': 'ㄓ(5)', 't': 'ㄔ(T)', 'g': 'ㄕ(G)', 'b': 'ㄖ(B)',
            'y': 'ㄗ(Y)', 'h': 'ㄘ(H)', 'n': 'ㄙ(N)'
          }
        },
        {
          id: 'zy-7',
          name: '第 19 關：結合韻母雙鍵連擊 (ㄧㄚ ㄨㄚ ㄩㄝ ㄧㄢ ㄨㄥ)',
          nameEn: 'Level 19: Combined Zhuyin Vowels Double-Key Combos',
          tip: '介音「ㄧ(u)、ㄨ(j)、ㄩ(m)」加上韻母只要連按兩鍵超順手！試試看：ㄧㄚ(u8)、ㄨㄚ(j8)、ㄩㄝ(m,)、ㄧㄢ(u0)、ㄨㄥ(j/)！',
          mode: 'zhuyin-keys',
          zhuyinDisplay: 'ㄧㄚ(u8) ㄨㄚ(j8) ㄩㄝ(m,) ㄧㄢ(u0) ㄨㄥ(j/)',
          text: 'u8 j8 m, u0 j/ u8 j8 u0 j/',
          keyHintMap: {
            'u': 'ㄧ(U)', '8': 'ㄚ(8)', 'j': 'ㄨ(J)', 'm': 'ㄩ(M)',
            ',': 'ㄝ(,)', '0': 'ㄢ(0)', '/': 'ㄥ(/)'
          }
        },
        {
          id: 'zy-8',
          name: '第 20 關：同音字選字小偵探 (在/再、的/得)',
          nameEn: 'Level 20: Homophone Selection Detective (在/再, 的/得)',
          tip: '注音相同但意思不同！打完注音遇到同音字時，按下鍵盤的「↓方向鍵」或數字鍵選對的國字！',
          mode: 'chinese-real',
          zhuyinBreakdown: [
            { char: '現在', py: 'ㄒㄧㄢˋ(v-u-0-4) ㄗㄞˋ(y-9-4)' },
            { char: '再見', py: 'ㄗㄞˋ(y-9-4) ㄐㄧㄢˋ(r-u-0-4)' },
            { char: '我的', py: 'ㄨㄛˇ(j-i-3) ㄉㄜ˙(2-k-7)' },
            { char: '跑得快', py: 'ㄆㄠˇ(q-l-3) ㄉㄜ˙(2-k-7) ㄎㄨㄞˋ(d-j-9-4)' }
          ],
          text: '現在 再見 我的 跑得快'
        }
      ]
    },
    {
      id: 'switch-master',
      title: '階段 5：中英切換神手 (Shift 中/英混合實戰)',
      titleEn: 'Stage 5: Bilingual Switch Master (Chinese + English)',
      badge: '⚡ 雙語切換',
      description: '利用「Shift」鍵一秒在「中」與「英」之間切換，打出最實用的雙語句子！',
      drills: [
        {
          id: 'sw-1',
          name: '第 21 關：中英切換初體驗 (Shift 鍵魔法)',
          nameEn: 'Level 21: Switching Between Chinese & English with Shift',
          tip: '在微軟注音裡，按一下左邊或右邊的「Shift」鍵，就會從「中」變成「英」，再按一下又變回「中」！試試看打出中英混合詞！',
          mode: 'chinese-real',
          zhuyinBreakdown: [
            { char: '我愛 AI', py: 'ㄨㄛˇ(j-i-3) ㄞˋ(9-4) [按Shift切英] AI' },
            { char: '打開 Google', py: 'ㄉㄚˇ(2-8-3) ㄎㄞ(d-9-Space) [按Shift切英] Google' }
          ],
          text: '我愛 AI 打開 Google'
        },
        {
          id: 'sw-2',
          name: '第 22 關：探險家雙語任務宣言',
          nameEn: 'Level 22: Explorer Bilingual Mission',
          tip: '結合中文注音與英文單字，注意大寫字母可以按住 Shift 再按字母，或切換中英後輸入！',
          mode: 'chinese-real',
          zhuyinBreakdown: [
            { char: '我的 Windows 筆電超酷', py: 'ㄨㄛˇ ㄉㄜ˙ [Shift] Windows [Shift] ㄅㄧˇ ㄉㄧㄢˋ ㄔㄠ ㄎㄨˋ' }
          ],
          text: '我的 Windows 筆電超酷'
        },
        {
          id: 'sw-3',
          name: '第 23 關：英文大寫 Shift 組合技 (Shift + 字母)',
          nameEn: 'Level 23: English Capitalization Combo (Shift + Letter)',
          tip: '按住左邊或右邊的 Shift 不放，再輕按英文字母，就能打出漂亮的大寫開頭專有名詞！',
          mode: 'english',
          text: 'Taiwan Windows Roblox Scratch Leo'
        },
        {
          id: 'sw-4',
          name: '第 24 關：黃金關鍵字搜尋實戰 (中英空白鍵搜尋)',
          nameEn: 'Level 24: Golden Keyword Search Practice',
          tip: '搜尋引擎最喜歡「關鍵字 + 空白鍵 + 關鍵字」！試試看中英夾雜打出超精準的搜尋詞！',
          mode: 'chinese-real',
          zhuyinBreakdown: [
            { char: '台北', py: 'ㄊㄞˊ ㄅㄟˇ (w-9-6 1-o-3)' },
            { char: '親子', py: 'ㄑㄧㄣ ㄗˇ (f-u-p-Space y-3)' },
            { char: '公園', py: 'ㄍㄨㄥ ㄩㄢˊ (e-j-/-Space m-0-6)' },
            { char: 'Scratch', py: '[按Shift切英] Scratch' },
            { char: '貓咪', py: 'ㄇㄠ ㄇㄧ (a-l-Space a-u-Space)' },
            { char: '教學', py: 'ㄐㄧㄠ ㄒㄩㄝˊ (r-u-l-Space v-m-,-6)' }
          ],
          text: '台北 親子 公園 Scratch 貓咪 教學'
        }
      ]
    },
    {
      id: 'phase2-stories',
      title: '階段 6：數字排與生活實戰故事 (Phase 2 進階)',
      titleEn: 'Stage 6: Number Row, Everyday English & Zhuyin Stories',
      badge: '🌟 進階實戰',
      description: '挑戰鍵盤最上方的數字排、常用英文對話，還有注音短故事連打！',
      drills: [
        {
          id: 'nr-1',
          name: '第 25 關：數字排探險 (12345 67890)',
          nameEn: 'Level 25: Number Row Adventure (1-0)',
          tip: '數字鍵在鍵盤最上面一排！記得按完數字後，手指要回到基準鍵 (A S D F / J K L ;) 喔！',
          mode: 'english',
          text: '12345 67890 2026 100 365'
        },
        {
          id: 'nr-2',
          name: '第 26 關：常用符號與算式探險 (! ? @ + =)',
          nameEn: 'Level 26: Symbols & Math Expressions (! ? =)',
          tip: '驚嘆號 ! 要按住 Shift+1，問號 ? 按住 Shift+/，加號 + 按住 Shift+=！小心別按錯喔！',
          mode: 'english',
          text: '2026 + 100 = 2126! Really? Yes!'
        },
        {
          id: 'en-1',
          name: '第 27 關：英語對話小達人 (Everyday English)',
          nameEn: 'Level 27: Everyday English Conversation',
          tip: '練習打出一整句日常英文問候！問號 ? 要按住 Shift + /，驚嘆號 ! 要按住 Shift + 1。',
          mode: 'english',
          text: 'Hello! How are you? I am fine, thank you!'
        },
        {
          id: 'zy-5',
          name: '第 28 關：注音短故事挑戰 (小探險家的早晨)',
          nameEn: 'Level 28: Zhuyin Short Story Challenge',
          tip: '切換成「微軟注音」模式，一口氣打出完整的小故事！注意標點符號可以按 Ctrl + , 或切換全形輸入。',
          mode: 'chinese-real',
          zhuyinBreakdown: [
            { char: '今天天氣真好', py: 'ㄐㄧㄣ ㄊㄧㄢ ㄊㄧㄢ ㄑㄧˋ ㄓㄣ ㄏㄠˇ' },
            { char: '我打開筆電練習打字', py: 'ㄨㄛˇ ㄉㄚˇ ㄎㄞ ㄅㄧˇ ㄉㄧㄢˋ ㄌㄧㄢˋ ㄒㄧˊ ㄉㄚˇ ㄗˋ' }
          ],
          text: '今天天氣真好 我打開筆電練習打字 準備探索 AI 世界'
        }
      ]
    },
    {
      id: 'game-coder',
      title: '階段 7：Scratch 與 Roblox 遊戲指令特訓 (Game Coder)',
      titleEn: 'Stage 7: Scratch & Roblox Game Commands',
      badge: '🎮 遊戲指令',
      description: '把 Roblox 與 Scratch 最常用的方向鍵、座標與積木指令練到飛快！',
      drills: [
        {
          id: 'gc-1',
          name: '第 29 關：遊戲方向鍵與座標 (WASD & X/Y)',
          nameEn: 'Level 29: Game Movement & X/Y Coordinates',
          tip: '玩電腦遊戲左手一定放在 W A S D 移動、大拇指放 Space 跳躍！順便記住 x 和 y 座標指令！',
          mode: 'english',
          text: 'w a s d space jump x 100 y -50 score 999'
        },
        {
          id: 'gc-2',
          name: '第 30 關：Scratch 積木魔法英文',
          nameEn: 'Level 30: Scratch Block Commands in English',
          tip: '這些都是 Scratch 程式裡最常出現的積木英文關鍵字！打熟了寫程式超快！',
          mode: 'english',
          text: 'when green flag clicked forever if touching edge bounce'
        },
        {
          id: 'gc-3',
          name: '第 31 關：Roblox Studio 創造者密語',
          nameEn: 'Level 31: Roblox Studio Creator Keywords',
          tip: '注意大小寫混合的「駝峰命名法 (CamelCase)」！像是 WalkSpeed 的 W 和 S 都是大寫喔！',
          mode: 'english',
          text: 'Part Anchored Workspace Script Touched Humanoid WalkSpeed'
        },
        {
          id: 'gc-4',
          name: '第 32 關：禮貌遊戲聊天室 (雙語好隊友)',
          nameEn: 'Level 32: Polite Gamer Chat (Bilingual Teamwork)',
          tip: 'gg (Good Game)、wp (Well Played) 是國際禮貌用語！切換中英給隊友一個溫暖的鼓勵吧！',
          mode: 'chinese-real',
          zhuyinBreakdown: [
            { char: 'gg wp', py: '[英] gg wp' },
            { char: '謝謝隊友', py: 'ㄒㄧㄝˋ ㄒㄧㄝ˙ ㄉㄨㄟˋ ㄧㄡˇ' },
            { char: '一起闖關', py: 'ㄧ ㄑㄧˇ ㄔㄨㄤˇ ㄍㄨㄢ' },
            { char: 'nice try', py: '[按Shift切英] nice try' }
          ],
          text: 'gg wp 謝謝隊友 一起闖關 nice try'
        }
      ]
    },
    {
      id: 'ai-prompt-dojo',
      title: '階段 8：AI 小魔法師提示詞特訓 (AI Prompt Master)',
      titleEn: 'Stage 8: AI Prompt Speed Master',
      badge: '🤖 AI 咒語',
      description: '練習打出結構清楚、有禮貌的中英 AI 提示詞 (Prompt)，成為 AI 詠唱小大師！',
      drills: [
        {
          id: 'ai-1',
          name: '第 33 關：請 AI 一步一步教我',
          nameEn: 'Level 33: Ask AI to Teach Step-by-Step',
          tip: '好問題才有好答案！學會快速打出這句超實用的 AI 學習魔法咒語！',
          mode: 'chinese-real',
          zhuyinBreakdown: [
            { char: '請用簡單的話', py: 'ㄑㄧㄥˇ ㄩㄥˋ ㄐㄧㄢˇ ㄉㄢ ㄉㄜ˙ ㄏㄨㄚˋ' },
            { char: '一步一步教我', py: 'ㄧˊ ㄅㄨˋ ㄧˊ ㄅㄨˋ ㄐㄧㄠ ㄨㄛˇ' }
          ],
          text: '請用簡單的話 一步一步教我'
        },
        {
          id: 'ai-2',
          name: '第 34 關：AI 繪圖五要素雙語咒語',
          nameEn: 'Level 34: AI Image Generation Bilingual Prompt',
          tip: '主角 + 動作 + 風格 + 光線！中英切換加入 3D style，讓 AI 畫出超棒的太空柴犬！',
          mode: 'chinese-real',
          zhuyinBreakdown: [
            { char: '穿太空衣的柴犬', py: 'ㄔㄨㄢ ㄊㄞˋ ㄎㄨㄥ ㄧ ㄉㄜ˙ ㄔㄞˊ ㄑㄩㄢˇ' },
            { char: '3D style', py: '[按Shift切英] 3D style' },
            { char: '柔和陽光', py: 'ㄖㄡˊ ㄏㄜˊ ㄧㄤˊ ㄍㄨㄤ' }
          ],
          text: '穿太空衣的柴犬 3D style 柔和陽光'
        },
        {
          id: 'ai-3',
          name: '第 35 關：AI 英文小家教對話',
          nameEn: 'Level 35: Talking to Your AI English Tutor',
          tip: '練習用完整的英文向 AI 提問！別忘了句尾的問號 ? 要按 Shift + / 喔！',
          mode: 'english',
          text: 'Can you teach me 5 English words about space?'
        },
        {
          id: 'ai-4',
          name: '第 36 關：終極大魔王：小探險家畢業宣言',
          nameEn: 'Level 36: Grand Finale - Digital Explorer Oath',
          tip: '最後一關！用最順暢的中英切換打出你的數位小探險家畢業宣言！',
          mode: 'chinese-real',
          zhuyinBreakdown: [
            { char: '我是', py: 'ㄨㄛˇ ㄕˋ' },
            { char: 'Windows 11', py: '[按Shift切英] Windows 11' },
            { char: '與', py: 'ㄩˇ' },
            { char: 'AI', py: '[英] AI' },
            { char: '數位小探險家', py: 'ㄕㄨˋ ㄨㄟˋ ㄒㄧㄠˇ ㄊㄢˋ ㄒㄧㄢˇ ㄐㄧㄚ' }
          ],
          text: '我是 Windows 11 與 AI 數位小探險家'
        }
      ]
    }
  ]
};
