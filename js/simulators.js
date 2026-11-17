/**
 * ============================================================================
 * 🎮 INTERACTIVE SIMULATORS ENGINE (js/simulators.js)
 * ============================================================================
 * Renders rich hands-on practice labs for World 1, World 2, and World 3:
 * - win11-power: Desktop hazard removal & Windows 11 Start Menu -> Shut down
 * - win11-window: Right-click secret menu, Maximize, and Snap Left/Right
 * - typing-dojo: Embedded 19-stage Zhuyin + English Typing Dojo
 * - shortcut-rescue: Interactive Ctrl+Z, Ctrl+C/V, and File Naming rescues
 * - browser-pilot: Tab cleanup, Bookmark star, and URL navigation
 * - search-detective: Local food search keywords & school research + spotting Ads
 * - scam-shield: Interactive pop-up & phishing inspector
 * - ai-prompt-builder: 4-Part Magic Prompt Builder + Bilingual English tutor
 * - ai-skill-coach: Step-by-step Socratic Skill Coach simulator + prompt copier
 * - ai-image-studio: 5-Ingredient AI Image Prompt Studio with live SVG canvas art
 * ============================================================================
 */

window.Simulators = {
  state: {
    // Win11 Power
    hazardsRemoved: {},
    startMenuOpen: false,
    powerMenuOpen: false,
    powerDone: false,

    // Win11 Window
    rightClickDone: false,
    maximizedDone: false,
    snapDone: false,

    // Shortcut Rescue
    undoDone: false,
    copiedDone: false,
    pastedDone: false,
    fileNamedDone: false,
    customFileName: '2026_三年級自然科_火山報告.docx',

    // Browser Pilot
    tabsClosed: 0,
    bookmarked: false,
    newTabOpened: false,

    // Search Detective
    searchScenarioIdx: 0,
    selectedKeywordIdx: null,
    selectedResultIdx: null,

    // Scam Shield
    scamIdx: 0,
    scamScore: 0,
    scamAnswered: false,

    // AI Prompt Builder
    roleIdx: 0,
    taskIdx: 0,
    levelIdx: 0,
    formatIdx: 0,
    generatedPrompt: '',
    promptTested: false,

    // AI Skill Coach
    skillIdx: 0,
    customSkill: '',
    coachStep: 0,

    // AI Image Studio
    imgSubjectIdx: 0,
    imgActionIdx: 0,
    imgBgIdx: 0,
    imgStyleIdx: 0,
    imgLightIdx: 0,
    imgRendered: true,

    // Google Maps Navigator (Lesson 2.5)
    mapsTripMode: 'transit', // 'walk' | 'transit' | 'drive'
    mapsStreetViewOpen: false,
    mapsReviewFilter: 'all', // 'all' | 'fake' | 'real'
    mapsSelectedReviewId: null,

    // Slide Studio (Lesson 4.1)
    slideRescueStep1: false, // Rule of 3 applied
    slideRescueStep2: false, // High contrast theme applied
    slideRescueStep3: false, // Hero visual added
    slideShowMode: false,

    // Scratch Blocks & Apple Catch Game (Lesson 4.2)
    scratchBlockBowl: false,
    scratchBlockApple: false,
    scratchBlockScore: false,
    scratchGamePlaying: false,
    scratchScore: 0,
    scratchWin: false,
    scratchBowlX: 180,
    scratchAppleX: 150,
    scratchAppleY: 20,

    // Story Studio (Lesson 4.3)
    storyHeroIdx: 0,
    storyCompanionIdx: 0,
    storySettingIdx: 0,
    storyTwistIdx: 0,
    storyCurrentScene: 0,
    storyAudioPlaying: false,

    // Roblox Studio Basics (Lesson 5.1)
    rbxParts: [
      { id: 'part-1', name: 'SpawnLocation', shape: 'Block', color: '#3b82f6', material: 'SmoothPlastic', anchored: true, x: 40, y: 150, w: 72, h: 18, rot: 0 },
      { id: 'part-2', name: 'SkyPlatform', shape: 'Block', color: '#10b981', material: 'Wood', anchored: true, x: 155, y: 95, w: 96, h: 20, rot: 0 },
      { id: 'part-3', name: 'LooseBrick', shape: 'Wedge', color: '#f59e0b', material: 'Neon', anchored: false, x: 295, y: 60, w: 68, h: 36, rot: 0 }
    ],
    rbxSelectedId: 'part-3',
    rbxTool: 'move',
    rbxPlaytestRunning: false,

    // Roblox Obby Builder & Playtester (Lesson 5.2)
    obbyBrush: 'safe',
    obbyCells: {
      '0,3': 'spawn',
      '1,3': 'safe',
      '2,3': 'lava',
      '3,2': 'safe',
      '4,2': 'checkpoint',
      '5,2': 'moving',
      '6,1': 'safe',
      '7,1': 'goal'
    },
    obbyPlaying: false,
    obbyPlayerX: 25,
    obbyPlayerY: 132,
    obbyPlayerVY: 0,
    obbyOnGround: true,
    obbySpawnX: 25,
    obbySpawnY: 132,
    obbyDeaths: 0,
    obbyReachedGoal: false,
    obbyMoveTick: 0,
    obbyTimerId: null,

    // Roblox Luau Script Lab (Lesson 5.3)
    luaPreset: 'coin',
    luaStep1: false,
    luaStep2: false,
    luaStep3: false,
    luaCoins: 0,
    luaWalkSpeed: 16,
    luaJumpPower: 50,
    luaDoorOpen: false,
    luaTriggered: false,

    // Roblox Multi-Genre Game Architect (Lesson 5.4)
    rbxGenre: 'tycoon',
    rbxGenreModules: {},
    rbxGenreSimDone: false,
    rbxChecks: { toolbox: false, privacy: false, playtest: false }
  },

  render(simConfig, containerId) {
    const el = document.getElementById(containerId);
    if (!el || !simConfig) return;

    switch (simConfig.type) {
      case 'win11-power':
        return this.renderWin11Power(el, containerId);
      case 'win11-window':
        return this.renderWin11Window(el, containerId);
      case 'typing-dojo':
        return window.TypingDojo.render(containerId);
      case 'shortcut-rescue':
        return this.renderShortcutRescue(el, containerId);
      case 'browser-pilot':
        return this.renderBrowserPilot(el, containerId);
      case 'search-detective':
        return this.renderSearchDetective(el, containerId);
      case 'scam-shield':
        return this.renderScamShield(el, containerId);
      case 'maps-navigator':
        return this.renderMapsNavigator(el, containerId);
      case 'ai-prompt-builder':
        return this.renderAiPromptBuilder(el, containerId);
      case 'ai-skill-coach':
        return this.renderAiSkillCoach(el, containerId);
      case 'ai-image-studio':
        return this.renderAiImageStudio(el, containerId);
      case 'slide-studio':
        return this.renderSlideStudio(el, containerId);
      case 'scratch-blocks':
        return this.renderScratchBlocks(el, containerId);
      case 'story-studio':
        return this.renderStoryStudio(el, containerId);
      case 'roblox-studio-basics':
        return this.renderRobloxStudioBasics(el, containerId);
      case 'roblox-obby-builder':
        return this.renderRobloxObbyBuilder(el, containerId);
      case 'roblox-lua-lab':
        return this.renderRobloxLuaLab(el, containerId);
      case 'roblox-game-architect':
        return this.renderRobloxGameArchitect(el, containerId);
      default:
        el.innerHTML = `
          <div class="sim-box" style="text-align:center;">
            <p style="font-weight:800; color:#0369a1;">👇 請直接完成下方的互動情境問答挑戰，檢驗你的學習成果！</p>
          </div>
        `;
    }
  },

  // ==========================================================================
  // 1.1 WIN 11 POWER & LAPTOP CARE
  // ==========================================================================
  renderWin11Power(el, cid) {
    const s = this.state;
    const hazards = [
      { id: 'drink', icon: '🧋', label: '鍵盤旁的珍珠奶茶 (點擊移走！)' },
      { id: 'pencil', icon: '✏️', label: '放在鍵盤上的鉛筆 (點擊移走！)' },
      { id: 'pillow', icon: '🛏️', label: '擋住散熱孔的厚枕頭 (點擊移走！)' }
    ];
    const allRemoved = hazards.every(h => s.hazardsRemoved[h.id]);

    el.innerHTML = `
      <div class="sim-box">
        <div style="margin-bottom:0.85rem; font-weight:800; display:flex; justify-content:space-between; flex-wrap:wrap; gap:0.5rem;">
          <span>🛡️ 步驟 1：移除筆電旁邊的 3 個危險物品 (${Object.keys(s.hazardsRemoved).length}/3)</span>
          <span>⚡ 步驟 2：${s.powerDone ? '✅ 已成功安全關機！' : '點下方 Windows 開始按鈕 (⊞) → 電源 ⏻ → 關機'}</span>
        </div>

        <div class="win11-desktop">
          <!-- Desktop Hazard Area -->
          <div style="padding:1.25rem; display:flex; gap:1rem; flex-wrap:wrap; align-items:flex-start;">
            ${hazards.map(h => s.hazardsRemoved[h.id] ? `
              <div style="background:rgba(22,163,74,0.9); color:white; padding:0.65rem 1rem; border-radius:12px; font-weight:800;">
                ✅ 已安全移開：${h.icon}
              </div>
            ` : `
              <button onclick="window.Simulators.removeHazard('${h.id}', '${cid}')"
                      style="background:#fef2f2; border:3px solid #ef4444; padding:0.75rem 1rem; border-radius:12px; font-weight:800; cursor:pointer; font-size:0.95rem;">
                ⚠️ ${h.icon} ${h.label}
              </button>
            `).join('')}

            ${s.powerDone ? `
              <div style="width:100%; background:rgba(15,23,42,0.92); color:#4ade80; padding:1.5rem; border-radius:14px; text-align:center; font-weight:900; font-size:1.2rem; margin-top:0.5rem;">
                🌙 電腦已安全儲存所有資料並完成「關機 (Shut down)」！現在可以放心蓋上螢幕囉！🎉
              </div>
            ` : ''}
          </div>

          <!-- Simulated Start Menu -->
          ${s.startMenuOpen ? `
            <div class="win11-start-menu">
              <div style="font-weight:900; color:#0f172a; margin-bottom:0.5rem; border-bottom:1px solid #e2e8f0; padding-bottom:0.4rem;">
                ⊞ Windows 11 開始選單 (Start)
              </div>
              <div style="font-size:0.85rem; color:#475569; margin-bottom:0.75rem;">
                👤 數位小探險家
              </div>
              <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid #e2e8f0; padding-top:0.6rem;">
                <span style="font-size:0.82rem; color:#64748b;">點右邊電源按鈕 👉</span>
                <button onclick="window.Simulators.togglePowerMenu('${cid}')"
                        style="background:#0284c7; color:white; border:none; padding:0.4rem 0.8rem; border-radius:8px; font-weight:800; cursor:pointer;">
                  ⏻ 電源 (Power)
                </button>
              </div>
              ${s.powerMenuOpen ? `
                <div style="margin-top:0.6rem; background:#f8fafc; border:2px solid #cbd5e1; border-radius:10px; padding:0.4rem; display:flex; flex-direction:column; gap:0.35rem;">
                  <button onclick="window.UIModal ? window.UIModal.alert('🌙 睡眠 (Sleep) 適合去吃飯暫時離開；如果今天已經不用電腦要收起來，請選「關機 (Shut down)」喔！', '🌙 睡眠模式說明') : alert('🌙 睡眠模式說明')"
                          style="text-align:left; padding:0.4rem 0.6rem; border:none; background:transparent; cursor:pointer; font-weight:700;">
                    🌙 睡眠 (Sleep) — 暫時休息
                  </button>
                  <button onclick="window.Simulators.completeShutdown('${cid}')"
                          style="text-align:left; padding:0.45rem 0.6rem; border:none; background:#dcfce7; color:#166534; border-radius:6px; cursor:pointer; font-weight:900;">
                    🛑 關機 (Shut down) — 完全關閉電源
                  </button>
                  <button onclick="window.UIModal ? window.UIModal.alert('🔄 重新啟動 (Restart) 適合更新電腦或遇到卡住時使用！', '🔄 重新啟動說明') : alert('🔄 重新啟動說明')"
                          style="text-align:left; padding:0.4rem 0.6rem; border:none; background:transparent; cursor:pointer; font-weight:700;">
                    🔄 重新啟動 (Restart)
                  </button>
                </div>
              ` : ''}
            </div>
          ` : ''}

          <!-- Windows 11 Taskbar -->
          <div class="win11-taskbar">
            <div style="font-size:0.8rem;">☀️ 26°C 台北</div>
            <div style="display:flex; gap:0.6rem; align-items:center;">
              <button onclick="window.Simulators.toggleStartMenu('${cid}')"
                      style="background:#38bdf8; color:#0f172a; border:none; padding:0.35rem 0.9rem; border-radius:8px; font-weight:900; cursor:pointer;">
                ⊞ 開始 (Start)
              </button>
            </div>
            <div style="font-size:0.82rem; display:flex; gap:0.6rem; align-items:center;">
              <span title="中/英輸入法狀態" style="background:#334155; padding:2px 6px; border-radius:4px; font-weight:800;">中 ㄅ</span>
              <span>📶 Wi-Fi</span>
              <span>🔈 80%</span>
              <span>🔋 95%</span>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  removeHazard(id, cid) {
    this.state.hazardsRemoved[id] = true;
    this.renderWin11Power(document.getElementById(cid), cid);
  },
  toggleStartMenu(cid) {
    this.state.startMenuOpen = !this.state.startMenuOpen;
    this.renderWin11Power(document.getElementById(cid), cid);
  },
  togglePowerMenu(cid) {
    this.state.powerMenuOpen = !this.state.powerMenuOpen;
    this.renderWin11Power(document.getElementById(cid), cid);
  },
  completeShutdown(cid) {
    if (Object.keys(this.state.hazardsRemoved).length < 3) {
      if (window.UIModal && window.UIModal.alert) {
        window.UIModal.alert('⚠️ 關機並蓋上筆電前，請先把桌面上那 3 個危險物品（珍奶、鉛筆、厚枕頭）點選移開喔！', '⚠️ 桌面還有危險物品！');
      } else {
        alert('⚠️ 關機並蓋上筆電前，請先把桌面上那 3 個危險物品（珍奶、鉛筆、厚枕頭）點選移開喔！');
      }
      return;
    }
    this.state.powerDone = true;
    this.state.startMenuOpen = false;
    this.state.powerMenuOpen = false;
    this.renderWin11Power(document.getElementById(cid), cid);
  },

  // ==========================================================================
  // 1.2 WIN 11 TOUCHPAD & WINDOW MANAGEMENT
  // ==========================================================================
  renderWin11Window(el, cid) {
    const s = this.state;
    el.innerHTML = `
      <div class="sim-box">
        <div style="display:flex; gap:0.75rem; flex-wrap:wrap; margin-bottom:1rem;">
          <span style="padding:0.35rem 0.8rem; border-radius:999px; font-weight:800; background:${s.rightClickDone ? '#dcfce7' : '#e2e8f0'};">
            ${s.rightClickDone ? '✅' : '1️⃣'} 任務 1：呼叫「右鍵秘密選單 (Right Click)」
          </span>
          <span style="padding:0.35rem 0.8rem; border-radius:999px; font-weight:800; background:${s.maximizedDone ? '#dcfce7' : '#e2e8f0'};">
            ${s.maximizedDone ? '✅' : '2️⃣'} 任務 2：點視窗右上角「□ 最大化 (Maximize)」
          </span>
          <span style="padding:0.35rem 0.8rem; border-radius:999px; font-weight:800; background:${s.snapDone ? '#dcfce7' : '#e2e8f0'};">
            ${s.snapDone ? '✅' : '3️⃣'} 任務 3：啟動「◧ 左右分割並排視窗 (Snap Layout)」
          </span>
        </div>

        <div class="win11-desktop" style="padding:1rem; min-height:290px;"
             oncontextmenu="event.preventDefault(); window.Simulators.doWindowTask('rightClick', '${cid}')">
          <div style="display:flex; gap:1rem; flex-wrap:wrap; width:100%; flex:1;">
            <!-- Simulated App Window -->
            <div style="background:white; border-radius:12px; overflow:hidden; box-shadow:0 8px 20px rgba(0,0,0,0.25); flex:${s.maximizedDone ? '1 1 100%' : '1 1 48%'}; transition:all 0.25s ease;">
              <div style="background:#f1f5f9; padding:0.5rem 0.85rem; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #cbd5e1;">
                <span style="font-weight:800; font-size:0.9rem;">📝 我的探險筆記本.txt</span>
                <div style="display:flex; gap:0.4rem;">
                  <button onclick="window.Simulators.doWindowTask('snap', '${cid}')"
                          title="左右並排分割視窗 (Snap Layout)"
                          style="background:#e0f2fe; border:1px solid #0284c7; color:#0369a1; border-radius:6px; padding:2px 8px; font-weight:800; cursor:pointer;">
                    ◧ 左右並排
                  </button>
                  <button onclick="window.UIModal ? window.UIModal.alert('「— 最小化 (Minimize)」會把視窗暫時收進底下工作列，想再打開只要點工作列上的圖示即可！', '— 最小化功能') : alert('— 最小化功能')"
                          style="border:1px solid #cbd5e1; background:white; border-radius:6px; width:28px; height:26px; cursor:pointer; font-weight:900;">—</button>
                  <button onclick="window.Simulators.doWindowTask('maximize', '${cid}')"
                          style="border:1px solid #0284c7; background:#fef08a; border-radius:6px; width:28px; height:26px; cursor:pointer; font-weight:900;">□</button>
                  <button onclick="window.UIModal ? window.UIModal.alert('「✕ 關閉 (Close)」會完全關掉程式。記得關閉前一定要先按 Ctrl + S 存檔喔！', '✕ 關閉視窗功能') : alert('✕ 關閉視窗功能')"
                          style="border:1px solid #fca5a5; background:#fee2e2; color:#991b1b; border-radius:6px; width:28px; height:26px; cursor:pointer; font-weight:900;">✕</button>
                </div>
              </div>
              <div style="padding:1rem; font-size:0.95rem; color:#334155;">
                <p>👋 試試看點這個視窗右上角的 <strong>「□ 最大化」</strong> 按鈕，還有 <strong>「◧ 左右並排」</strong> 按鈕！</p>
                <div style="margin-top:0.75rem;">
                  <button class="btn-secondary" style="font-size:0.85rem; padding:0.4rem 0.8rem;"
                          onclick="window.Simulators.doWindowTask('rightClick', '${cid}')">
                    🖱️ 點這裡（或在藍色桌面按滑鼠右鍵）打開「右鍵秘密選單」！
                  </button>
                </div>
                ${s.rightClickDone ? `
                  <div style="margin-top:0.65rem; background:#f8fafc; border:2px solid #0284c7; border-radius:8px; padding:0.5rem 0.8rem; font-size:0.85rem; font-weight:700;">
                    ✨ <strong>右鍵秘密選單 (Context Menu) 已開啟：</strong><br/>
                    📁 新增資料夾 (New Folder) ｜ 📋 複製 (Copy) ｜ ✏️ 重新命名 (Rename)
                  </div>
                ` : ''}
              </div>
            </div>

            ${s.snapDone ? `
              <div style="background:white; border-radius:12px; overflow:hidden; box-shadow:0 8px 20px rgba(0,0,0,0.25); flex:1 1 45%;">
                <div style="background:#dcfce7; padding:0.5rem 0.85rem; font-weight:800; font-size:0.9rem; color:#166534;">
                  🌐 數位小探險家學院 (右半邊並排視窗)
                </div>
                <div style="padding:1rem; font-size:0.92rem; color:#166534; font-weight:700;">
                  🎉 太強了！這就是 Windows 11 的「左右分割視窗 (Snap Layout)」！你可以左邊看題目、右邊打字練習！
                </div>
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  },

  doWindowTask(type, cid) {
    if (type === 'rightClick') this.state.rightClickDone = true;
    if (type === 'maximize') this.state.maximizedDone = !this.state.maximizedDone;
    if (type === 'snap') {
      this.state.snapDone = true;
      this.state.maximizedDone = false;
    }
    this.renderWin11Window(document.getElementById(cid), cid);
  },

  // ==========================================================================
  // 1.4 SHORTCUT RESCUE (Ctrl+Z, Ctrl+C/V, File Naming)
  // ==========================================================================
  renderShortcutRescue(el, cid) {
    const s = this.state;
    el.innerHTML = `
      <div class="sim-box">
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:1rem;">
          <!-- Task 1: Ctrl + Z Undo -->
          <div style="background:white; border:2px solid #cbd5e1; border-radius:14px; padding:1.1rem;">
            <h4 style="font-size:1.05rem; margin-bottom:0.4rem;">🚨 救援任務 1：搶救消失的故事 (Ctrl + Z)</h4>
            <p style="font-size:0.9rem; color:#475569; margin-bottom:0.75rem;">
              ${s.undoDone
                ? '✅ <strong>已救回：</strong>「從前有一隻住在台北 101 頂樓的太空柴犬，牠每天晚上都會開飛碟去月球買雞排...」'
                : '😱 慘了！小明寫了半小時的《太空柴犬歷險記》剛剛不小心被按到刪除全不見了！'}
            </p>
            <button class="btn-primary" style="width:100%; justify-content:center;"
                    onclick="window.Simulators.doShortcut('undo', '${cid}')">
              ⏪ 按下 Ctrl + Z (Undo 復原時光機！)
            </button>
          </div>

          <!-- Task 2: Ctrl + C & Ctrl + V -->
          <div style="background:white; border:2px solid #cbd5e1; border-radius:14px; padding:1.1rem;">
            <h4 style="font-size:1.05rem; margin-bottom:0.4rem;">📋 救援任務 2：複製與貼上魔法 (Ctrl + C / V)</h4>
            <div style="background:#f1f5f9; padding:0.5rem; border-radius:8px; font-size:0.85rem; font-weight:700; margin-bottom:0.6rem;">
              魔法通行證：<span style="color:#0284c7;">SUPER-EXPLORER-888</span>
            </div>
            <div style="display:flex; gap:0.5rem; margin-bottom:0.5rem;">
              <button class="btn-secondary" style="flex:1;" onclick="window.Simulators.doShortcut('copy', '${cid}')">
                ${s.copiedDone ? '✅ 已複製' : '1. 按 Ctrl + C (複製)'}
              </button>
              <button class="btn-primary" style="flex:1;" onclick="window.Simulators.doShortcut('paste', '${cid}')">
                ${s.pastedDone ? '✅ 已貼上' : '2. 按 Ctrl + V (貼上)'}
              </button>
            </div>
            <div style="font-size:0.88rem; color:${s.pastedDone ? '#16a34a' : '#64748b'}; font-weight:800;">
              目標信箱：${s.pastedDone ? '🎉 SUPER-EXPLORER-888 (貼上成功！)' : '(等待貼上...)'}
            </div>
          </div>

          <!-- Task 3: File Naming & Ctrl + S -->
          <div style="background:white; border:2px solid #cbd5e1; border-radius:14px; padding:1.1rem;">
            <h4 style="font-size:1.05rem; margin-bottom:0.4rem;">💾 救援任務 3：幫檔案取好名字並存檔 (Ctrl + S)</h4>
            <input type="text" id="${cid}-fname" value="${s.customFileName}"
                   style="width:100%; padding:0.5rem; border:2px solid #94a3b8; border-radius:8px; font-weight:700; margin-bottom:0.6rem;" />
            <button class="btn-primary" style="width:100%; justify-content:center;"
                    onclick="window.Simulators.doShortcut('save', '${cid}')">
              💾 按下 Ctrl + S (Save 儲存到專屬資料夾)
            </button>
            ${s.fileNamedDone ? `<div style="margin-top:0.45rem; color:#16a34a; font-weight:800; font-size:0.88rem;">✅ 已整齊存入「我的文件 / 小探險家資料夾」！</div>` : ''}
          </div>
        </div>
      </div>
    `;
  },

  doShortcut(action, cid) {
    if (action === 'undo') this.state.undoDone = true;
    if (action === 'copy') this.state.copiedDone = true;
    if (action === 'paste') {
      if (!this.state.copiedDone) {
        if (window.UIModal && window.UIModal.alert) {
          window.UIModal.alert('💡 請先按「1. Ctrl + C (複製)」，把文字記在電腦剪貼簿裡，才能按 Ctrl + V 貼上喔！', '💡 先複製才能貼上');
        } else {
          alert('💡 請先按「1. Ctrl + C (複製)」，把文字記在電腦剪貼簿裡，才能按 Ctrl + V 貼上喔！');
        }
        return;
      }
      this.state.pastedDone = true;
    }
    if (action === 'save') {
      const inp = document.getElementById(`${cid}-fname`);
      if (inp) this.state.customFileName = inp.value;
      this.state.fileNamedDone = true;
    }
    this.renderShortcutRescue(document.getElementById(cid), cid);
  },

  // ==========================================================================
  // 2.1 BROWSER PILOT SIMULATOR
  // ==========================================================================
  renderBrowserPilot(el, cid) {
    const s = this.state;
    el.innerHTML = `
      <div class="sim-box">
        <div style="background:#1e293b; border-radius:14px; overflow:hidden; border:2px solid #334155;">
          <!-- Browser Tab Bar -->
          <div style="background:#0f172a; padding:0.5rem 0.75rem 0; display:flex; align-items:center; gap:0.4rem; flex-wrap:wrap;">
            <div style="background:#ffffff; color:#0f172a; padding:0.45rem 0.9rem; border-radius:10px 10px 0 0; font-weight:800; font-size:0.85rem; display:flex; align-items:center; gap:0.5rem;">
              🚀 數位小探險家學院
            </div>
            ${s.tabsClosed < 1 ? `
              <div style="background:#334155; color:#cbd5e1; padding:0.45rem 0.75rem; border-radius:10px 10px 0 0; font-size:0.82rem; display:flex; align-items:center; gap:0.4rem;">
                <span>看完的舊網頁 1</span>
                <button onclick="window.Simulators.browserAction('closeTab', '${cid}')" style="background:#ef4444; color:white; border:none; border-radius:4px; padding:0 5px; cursor:pointer; font-weight:900;">✕</button>
              </div>
            ` : ''}
            ${s.tabsClosed < 2 ? `
              <div style="background:#334155; color:#cbd5e1; padding:0.45rem 0.75rem; border-radius:10px 10px 0 0; font-size:0.82rem; display:flex; align-items:center; gap:0.4rem;">
                <span>沒在用的舊分頁 2</span>
                <button onclick="window.Simulators.browserAction('closeTab', '${cid}')" style="background:#ef4444; color:white; border:none; border-radius:4px; padding:0 5px; cursor:pointer; font-weight:900;">✕</button>
              </div>
            ` : ''}
            ${s.newTabOpened ? `
              <div style="background:#e0f2fe; color:#0369a1; padding:0.45rem 0.85rem; border-radius:10px 10px 0 0; font-weight:800; font-size:0.85rem;">
                🔍 Google 新分頁
              </div>
            ` : ''}
            <button onclick="window.Simulators.browserAction('newTab', '${cid}')"
                    title="開新分頁 (New Tab)"
                    style="background:#38bdf8; color:#0f172a; border:none; border-radius:8px; padding:0.25rem 0.65rem; font-weight:900; cursor:pointer; margin-bottom:4px;">
              ＋ 開新分頁 (Tab)
            </button>
          </div>

          <!-- URL / Address Bar -->
          <div style="background:#f8fafc; padding:0.6rem 0.9rem; display:flex; align-items:center; gap:0.6rem; border-bottom:1px solid #cbd5e1; flex-wrap:wrap;">
            <button class="btn-secondary" style="padding:0.25rem 0.55rem;" onclick="window.UIModal ? window.UIModal.toast('← Back：回到上一頁！') : alert('← Back：回到上一頁！')">←</button>
            <button class="btn-secondary" style="padding:0.25rem 0.55rem;" onclick="window.UIModal ? window.UIModal.toast('↻ Refresh：重新整理網頁！') : alert('↻ Refresh：重新整理網頁！')">↻</button>
            <div style="flex:1; background:white; border:2px solid #94a3b8; border-radius:999px; padding:0.35rem 1rem; display:flex; align-items:center; justify-content:space-between; font-size:0.9rem;">
              <span>🔒 <strong>https://</strong>digital-explorer-academy.vercel.app</span>
              <button onclick="window.Simulators.browserAction('bookmark', '${cid}')"
                      style="background:${s.bookmarked ? '#fef08a' : 'transparent'}; border:2px solid #f59e0b; border-radius:999px; padding:2px 10px; font-weight:900; cursor:pointer; color:#b45309;">
                ${s.bookmarked ? '★ 已加入書籤 (Bookmarked!)' : '☆ 點星星加入書籤 (Bookmark)'}
              </button>
            </div>
          </div>

          <!-- Bookmark Bar -->
          <div style="background:#f1f5f9; padding:0.35rem 1rem; font-size:0.82rem; font-weight:700; color:#475569; display:flex; gap:1rem; border-bottom:1px solid #e2e8f0;">
            <span>📌 書籤列 (Bookmarks)：</span>
            ${s.bookmarked ? `<span style="color:#0284c7; font-weight:900;">★ 🚀 數位小探險家學院</span>` : `<span>(尚未加入書籤 — 快點網址列右邊的 ★ 星號！)</span>`}
          </div>

          <!-- Browser Body -->
          <div style="background:white; padding:1.25rem; text-align:center;">
            <p style="font-weight:800; font-size:1rem; color:#0f172a;">
              駕駛進度：
              1. 關閉雜亂分頁 (${s.tabsClosed}/2) ｜
              2. 加入書籤 (${s.bookmarked ? '✅' : '⬜'}) ｜
              3. 開新分頁 (${s.newTabOpened ? '✅' : '⬜'})
            </p>
          </div>
        </div>
      </div>
    `;
  },

  browserAction(act, cid) {
    if (act === 'closeTab') this.state.tabsClosed = Math.min(2, this.state.tabsClosed + 1);
    if (act === 'bookmark') this.state.bookmarked = true;
    if (act === 'newTab') this.state.newTabOpened = true;
    this.renderBrowserPilot(document.getElementById(cid), cid);
  },

  // ==========================================================================
  // 2.2 SEARCH DETECTIVE (Local Food Search Keywords + School Research + Spotting Ads)
  // ==========================================================================
  renderSearchDetective(el, cid) {
    const scenarios = [
      {
        title: '🍜 任務 1：週末全家去「板橋車站」附近，想找好吃、評價高又適合小朋友的「拉麵或早午餐」！',
        prompt: '請問下面哪一組「Google 搜尋關鍵字」最精準有效？',
        keywords: [
          { text: '好吃的東西', good: false, feedback: '❌ 太模糊了！Google 不知道你在哪個城市、也不知道你想吃什麼，會跑出幾百萬筆無關的網頁喔！' },
          { text: '請問電腦先生今天我們全家去板橋玩有沒有什麼好吃的店不要太貴謝謝', good: false, feedback: '❌ 句子太長太囉嗦了！搜尋引擎喜歡「重點詞 + 空白鍵」，不需要打整串禮貌寒暄喔！' },
          { text: '板橋車站 拉麵 親子 推薦 菜單', good: true, feedback: '🎉 太精準了！【地點：板橋車站】＋【食物：拉麵】＋【需求：親子 推薦 菜單】，一秒就能找到真實食記與 Google Maps 高分店家！' }
        ],
        results: [
          {
            isAd: true,
            badge: '贊助 (Sponsored / Ad)',
            url: 'https://ad-super-game-food-promo.com',
            title: '【廣告】全台灣最好吃神級美食排行榜！點我下載免費美食折價券 App！',
            snippet: '立即點擊安裝執行檔，免費領取 10,000 元餐券...',
            feedback: '⚠️ 小心！左上角寫著「贊助 (Sponsored)」，這是花錢買的廣告，而且還要你下載不明 App，千萬別點！'
          },
          {
            isAd: false,
            badge: '🗺️ Google Maps 實測 & 真實食記',
            url: 'https://maps.google.com/banqiao-ramen-reviews',
            title: '【板橋車站美食】精選 6 間高評價拉麵＆親子友善餐廳（附最新菜單、距離車站步行 5 分鐘、4.5★ 超過 800 則真實評論）',
            snippet: '整理板橋火車站周邊走路可到的濃郁豚骨與清湯拉麵，內含兒童座椅資訊與完整價目表...',
            feedback: '🌟 滿分小偵探！你成功避開了最上面的贊助廣告，選中了有真實菜單、地點明確且評論數充足的可靠結果！'
          }
        ]
      },
      {
        title: '🌋 任務 2：自然課要做「台灣的火山（如大屯火山群）為什麼會有溫泉」的科學報告！',
        prompt: '請選出最能查到「科學原理與圖解」的黃金關鍵字：',
        keywords: [
          { text: '大屯火山 溫泉 成因 科普 圖解', good: true, feedback: '🎉 完美命中！【主題：大屯火山 溫泉】＋【問題：成因】＋【性質：科普 圖解】，馬上就能找到科博館與地質調查所的圖文解說！' },
          { text: '溫泉飯店泡湯幾折', good: false, feedback: '❌ 這樣會全部跑出旅行社跟溫泉旅館的訂房廣告喔！' },
          { text: '山', good: false, feedback: '❌ 只打一個「山」字範圍太大了，找不到火山與溫泉的原理！' }
        ],
        results: [
          {
            isAd: true,
            badge: '贊助 (Sponsored / Ad)',
            url: 'https://hot-spring-hotel-sale.com',
            title: '【限時搶購】北投溫泉總統套房一泊二食只要 1,999 元！立即刷卡！',
            snippet: '全網最低價溫泉住宿券...',
            feedback: '⚠️ 這是溫泉飯店買的「贊助廣告」，裡面沒有自然科報告需要的火山科學原理喔！'
          },
          {
            isAd: false,
            badge: '🏛️ 國立自然科學博物館 / 國家公園科普網 (.gov.tw / .edu.tw)',
            url: 'https://www.ymsnp.gov.tw/science/volcano-hotspring',
            title: '陽明山大屯火山群與溫泉是怎麼形成的？兒童地質科普圖解',
            snippet: '當地下水遇到地底下的火山岩漿熱源加熱後，湧出地面就形成了溫泉！一起看剖面圖認識...',
            feedback: '🌟 太棒了！網址結尾是 .gov.tw 政府國家公園網站，沒有廣告又有清楚的科學圖解！'
          }
        ]
      }
    ];

    const sc = scenarios[this.state.searchScenarioIdx];
    const selKw = this.state.selectedKeywordIdx !== null ? sc.keywords[this.state.selectedKeywordIdx] : null;
    const selRes = this.state.selectedResultIdx !== null ? sc.results[this.state.selectedResultIdx] : null;

    el.innerHTML = `
      <div class="sim-box">
        <div style="display:flex; gap:0.5rem; margin-bottom:1rem;">
          ${scenarios.map((item, idx) => `
            <button class="step-tab ${idx === this.state.searchScenarioIdx ? 'active' : ''}"
                    onclick="window.Simulators.switchSearchScenario(${idx}, '${cid}')">
              ${idx === 0 ? '🍜 實戰 1：找在地美食餐廳' : '🌋 實戰 2：查自然科報告'}
            </button>
          `).join('')}
        </div>

        <div style="background:white; border:2px solid #cbd5e1; border-radius:14px; padding:1.25rem;">
          <h4 style="font-size:1.1rem; color:#0f172a; margin-bottom:0.5rem;">${sc.title}</h4>
          <p style="font-size:0.95rem; font-weight:700; color:#0369a1; margin-bottom:0.65rem;">步驟 1：${sc.prompt}</p>

          <div style="display:flex; flex-direction:column; gap:0.5rem; margin-bottom:1rem;">
            ${sc.keywords.map((kw, kIdx) => `
              <button class="quiz-option ${this.state.selectedKeywordIdx === kIdx ? (kw.good ? 'correct' : 'wrong') : ''}"
                      onclick="window.Simulators.pickSearchKeyword(${kIdx}, '${cid}')">
                🔍 關鍵字組合 ${kIdx + 1}：「<strong>${kw.text}</strong>」
              </button>
            `).join('')}
          </div>

          ${selKw ? `
            <div style="padding:0.85rem 1rem; border-radius:10px; background:${selKw.good ? '#dcfce7' : '#fee2e2'}; font-weight:800; margin-bottom:1rem;">
              ${selKw.feedback}
            </div>
          ` : ''}

          ${selKw && selKw.good ? `
            <div style="border-top:2px dashed #cbd5e1; padding-top:1rem;">
              <p style="font-size:0.95rem; font-weight:800; color:#0369a1; margin-bottom:0.65rem;">
                步驟 2：Google 搜尋結果出來了！請避開「贊助廣告」，點選最值得信賴的網站：
              </p>
              <div style="display:flex; flex-direction:column; gap:0.75rem;">
                ${sc.results.map((r, rIdx) => `
                  <div onclick="window.Simulators.pickSearchResult(${rIdx}, '${cid}')"
                       style="border:2px solid ${this.state.selectedResultIdx === rIdx ? (r.isAd ? '#ef4444' : '#16a34a') : '#cbd5e1'}; background:#f8fafc; padding:0.9rem 1rem; border-radius:12px; cursor:pointer;">
                    <div style="font-size:0.78rem; font-weight:900; color:${r.isAd ? '#b45309' : '#059669'}; margin-bottom:0.2rem;">
                      ${r.badge} ｜ <span style="color:#64748b; font-weight:600;">${r.url}</span>
                    </div>
                    <div style="font-size:1.05rem; font-weight:800; color:#1d4ed8; text-decoration:underline; margin-bottom:0.25rem;">
                      ${r.title}
                    </div>
                    <div style="font-size:0.88rem; color:#475569;">${r.snippet}</div>
                  </div>
                `).join('')}
              </div>
              ${selRes ? `
                <div style="margin-top:0.85rem; padding:0.85rem 1rem; border-radius:10px; background:${selRes.isAd ? '#fee2e2' : '#dcfce7'}; font-weight:800;">
                  ${selRes.feedback}
                </div>
              ` : ''}
            </div>
          ` : ''}
        </div>
      </div>
    `;
  },

  switchSearchScenario(idx, cid) {
    this.state.searchScenarioIdx = idx;
    this.state.selectedKeywordIdx = null;
    this.state.selectedResultIdx = null;
    this.renderSearchDetective(document.getElementById(cid), cid);
  },
  pickSearchKeyword(kIdx, cid) {
    this.state.selectedKeywordIdx = kIdx;
    this.state.selectedResultIdx = null;
    this.renderSearchDetective(document.getElementById(cid), cid);
  },
  pickSearchResult(rIdx, cid) {
    this.state.selectedResultIdx = rIdx;
    this.renderSearchDetective(document.getElementById(cid), cid);
  },

  // ==========================================================================
  // 2.3 SCAM SHIELD DEFENDER
  // ==========================================================================
  renderScamShield(el, cid) {
    const cases = [
      {
        title: '🎁 彈出視窗 1：「恭喜你是今天第 9,999 名幸運兒！免費送你最新 iPad Pro 與 10,000 Robux！請輸入爸媽手機與密碼領取！」',
        isScam: true,
        explain: '🛑 100% 是詐騙！真正的網站不會無緣無故送你 iPad 或免費遊戲幣，更不會跟你要密碼！直接關閉分頁！'
      },
      {
        title: '🚨 彈出視窗 2：「逼逼！警告！你的 Windows 電腦發現 29 個嚴重病毒！請在 60 秒內點擊下載 SuperClean.exe 修復！」',
        isScam: true,
        explain: '🛑 100% 是假病毒警報！網頁不能掃描你的電腦，它想騙你下載真正的病毒檔案 (.exe)！千萬別點！'
      },
      {
        title: '📚 網頁 3：「台北市立圖書館兒童電子書網站 (https://tpml.gov.taipei) — 請使用借書證號閱讀繪本」',
        isScam: false,
        explain: '✅ 這是安全的政府公共圖書館網站 (.gov.taipei)！跟爸媽一起登入借書證就能安心看書！'
      }
    ];

    const cur = cases[this.state.scamIdx];
    el.innerHTML = `
      <div class="sim-box">
        <div style="background:white; border:2px solid #cbd5e1; border-radius:14px; padding:1.25rem;">
          <div style="font-size:0.85rem; font-weight:800; color:#64748b; margin-bottom:0.4rem;">
            案件 ${this.state.scamIdx + 1} / ${cases.length}
          </div>
          <div style="background:#fefce8; border:2px dashed #f59e0b; padding:1.1rem; border-radius:12px; font-size:1.05rem; font-weight:800; margin-bottom:1rem;">
            ${cur.title}
          </div>
          <div style="display:flex; gap:0.75rem; flex-wrap:wrap;">
            <button class="btn-primary" style="background:#dc2626;"
                    onclick="window.Simulators.answerScam(true, '${cid}')">
              🛑 這是詐騙陷阱！立刻按 ✕ 關閉並告訴爸媽
            </button>
            <button class="btn-primary" style="background:#16a34a;"
                    onclick="window.Simulators.answerScam(false, '${cid}')">
              ✅ 這是安全可靠的正規網站
            </button>
          </div>
          ${this.state.scamAnswered ? `
            <div style="margin-top:1rem; padding:0.9rem; border-radius:10px; background:#dcfce7; color:#14532d; font-weight:800; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;">
              <span>${cur.explain}</span>
              <button class="btn-secondary" onclick="window.Simulators.nextScam('${cid}', ${cases.length})">下一題 👉</button>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  },

  answerScam(userSaysScam, cid) {
    this.state.scamAnswered = true;
    this.renderScamShield(document.getElementById(cid), cid);
  },
  nextScam(cid, total) {
    this.state.scamIdx = (this.state.scamIdx + 1) % total;
    this.state.scamAnswered = false;
    this.renderScamShield(document.getElementById(cid), cid);
  },

  // ==========================================================================
  // 3.2 AI 4-PART PROMPT BUILDER (+ ENGLISH TUTOR)
  // ==========================================================================
  renderAiPromptBuilder(el, cid) {
    const roles = [
      '你是一位幽默風趣的自然科學老師',
      '你是一位超有耐心的兒童雙語英文家教老師',
      '你是一位想像力豐富的奇幻故事作家'
    ];
    const tasks = [
      '請幫我解釋「為什麼天空會打雷和閃電」',
      '請教我 5 個跟「太空探險 (Space)」有關的簡單英文單字，附上繁體中文意思與可愛例句',
      '請幫我解釋「飛機為什麼這麼重卻能飛在天上」'
    ];
    const levels = [
      '我是 8 歲的小學生，請用超簡單的生活比喻和繁體中文說明',
      '我是 10 歲的小學生，請用生動好懂的繁體中文搭配重點英文單字說明'
    ];
    const formats = [
      '請列成 3 個清楚的重點，並在最後出 1 題有趣的選擇題考考我！',
      '請用一個小故事的方式講給我聽，最後幫我整理成一張小表格！'
    ];

    const s = this.state;
    const fullPrompt = `${roles[s.roleIdx]}，${tasks[s.taskIdx]}。${levels[s.levelIdx]}，而且${formats[s.formatIdx]}`;

    const simulatedResponses = [
      `⚡ **【AI 科學老師來囉！】**\n哈囉小探險家！想像雲朵裡有好多穿毛衣的小水滴在溜滑梯，摩擦久了就會產生「靜電火花」（就像冬天脫毛衣會啪啪響一樣）：\n1. **閃電 (Lightning)**：雲裡面的電太多了，瞬間衝出來發出一道超亮的光！\n2. **打雷 (Thunder)**：閃電經過的地方空氣瞬間被烤得超熱、急速膨脹，「轟隆！」一聲就變成雷聲啦！\n3. **為什麼先看到閃電才聽到雷聲？** 因為「光」跑得比「聲音」快非常多喔！\n\n🎯 **小測驗時間**：請問閃電跟打雷其實是同時發生的嗎？ (A) 是的，只是光跑比較快 (B) 不是，雷公公比較晚起床！`,
      `🚀 **【AI 雙語英文小家教來囉！】**\n太棒了！一起來學 5 個超酷的太空英文單字吧：\n1. **Rocket (火箭)** — 發音像「Rockets」\n   👉 例句：The **rocket** flies to the moon! (火箭飛向月球！)\n2. **Astronaut (太空人)**\n   👉 例句：I want to be an **astronaut**! (我想當太空人！)\n3. **Planet (行星)**\n   👉 例句：Earth is a beautiful blue **planet**. (地球是一顆美麗的藍色行星。)\n4. **Star (星星 / 恆星)**\n   👉 例句：Look at the bright **star** in the sky! (看天上那顆閃亮的星星！)\n5. **Gravity (地心引力 / 重力)**\n   👉 例句：There is low **gravity** on the moon! (月球上的引力很小，跳起來像慢動作！)\n\n🎯 **小測驗時間**：請問「太空人」的英文是 (A) Rocket 還是 (B) Astronaut 呢？`,
      `✈️ **【AI 科學老師來囉！】**\n飛機雖然像好幾隻大象一樣重，但靠著翅膀的魔法就能飛起來喔：\n1. **引擎往前衝 (Thrust 推力)**：噴射引擎用力把飛機往前推！\n2. **翅膀弧度魔法 (Lift 升力)**：飛機翅膀上面彎彎的、下面平平的，空氣流過去時會從下面把飛機「托起來」！\n3. **就像把手伸出車窗外**：當風吹過微翹的手掌，手就會感覺被風往上抬喔！\n\n🎯 **小測驗時間**：把飛機往上托起來的力量叫做什麼力呢？ (A) 升力 Lift (B) 巧克力！`
    ];

    el.innerHTML = `
      <div class="sim-box">
        <div style="background:white; border:2px solid #cbd5e1; border-radius:14px; padding:1.25rem;">
          <div style="margin-bottom:0.75rem;">
            <div style="font-weight:800; color:#92400e;">🎭 1. 選擇角色 (Role)：</div>
            <div class="prompt-chip-group">
              ${roles.map((r, i) => `<button class="prompt-chip ${s.roleIdx === i ? 'selected' : ''}" onclick="window.Simulators.setPromptPart('roleIdx', ${i}, '${cid}')">${r}</button>`).join('')}
            </div>

            <div style="font-weight:800; color:#92400e;">🎯 2. 選擇任務 (Task — 含學英文單字)：</div>
            <div class="prompt-chip-group">
              ${tasks.map((t, i) => `<button class="prompt-chip ${s.taskIdx === i ? 'selected' : ''}" onclick="window.Simulators.setPromptPart('taskIdx', ${i}, '${cid}')">${t}</button>`).join('')}
            </div>

            <div style="font-weight:800; color:#92400e;">👶 3. 選擇年齡與程度 (Level)：</div>
            <div class="prompt-chip-group">
              ${levels.map((l, i) => `<button class="prompt-chip ${s.levelIdx === i ? 'selected' : ''}" onclick="window.Simulators.setPromptPart('levelIdx', ${i}, '${cid}')">${l}</button>`).join('')}
            </div>

            <div style="font-weight:800; color:#92400e;">📦 4. 選擇呈現格式 (Format)：</div>
            <div class="prompt-chip-group">
              ${formats.map((f, i) => `<button class="prompt-chip ${s.formatIdx === i ? 'selected' : ''}" onclick="window.Simulators.setPromptPart('formatIdx', ${i}, '${cid}')">${f}</button>`).join('')}
            </div>
          </div>

          <div style="background:#fffbeb; border:2px solid #f59e0b; border-radius:12px; padding:1rem; margin-bottom:1rem;">
            <div style="font-size:0.82rem; font-weight:900; color:#b45309; margin-bottom:0.3rem;">✨ 組合完成的五星級魔法提示詞 (你可以直接修改或複製)：</div>
            <textarea id="${cid}-prompt-box" rows="3" style="width:100%; border:1px solid #fcd34d; border-radius:8px; padding:0.6rem; font-size:0.98rem; font-weight:700; font-family:inherit;">${fullPrompt}</textarea>
            <div style="display:flex; gap:0.65rem; margin-top:0.65rem; flex-wrap:wrap;">
              <button class="btn-primary" onclick="window.Simulators.testAiPrompt('${cid}')">
                ✨ 在安全模擬器中測試 AI 回答
              </button>
              <button class="btn-secondary" onclick="window.Simulators.copyText('${cid}-prompt-box')">
                📋 複製提示詞 (Ctrl+C) 去真 AI 試試看！
              </button>
            </div>
          </div>

          ${s.promptTested ? `
            <div style="background:#f0fdf4; border:2px solid #86efac; border-radius:12px; padding:1.15rem; white-space:pre-line; font-size:0.98rem; line-height:1.7;">
              ${simulatedResponses[s.taskIdx]}
            </div>
          ` : ''}
        </div>
      </div>
    `;
  },

  setPromptPart(key, val, cid) {
    this.state[key] = val;
    this.state.promptTested = true;
    this.renderAiPromptBuilder(document.getElementById(cid), cid);
  },
  testAiPrompt(cid) {
    this.state.promptTested = true;
    this.renderAiPromptBuilder(document.getElementById(cid), cid);
  },
  copyText(inputId) {
    const el = document.getElementById(inputId);
    if (!el) return;
    const textToCopy = el.value !== undefined ? el.value : (el.innerText || '');
    const successMsg = '🎉 已成功複製提示詞！你可以打開 ChatGPT 或 Gemini 按 Ctrl + V 貼上試試看喔！';

    const notifySuccess = () => {
      if (window.UIModal && window.UIModal.toast) {
        window.UIModal.toast(successMsg, 4000);
      } else if (window.UIModal && window.UIModal.alert) {
        window.UIModal.alert(successMsg, '🎉 複製成功！');
      } else {
        alert(successMsg);
      }
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        notifySuccess();
      }).catch(() => {
        try {
          if (typeof el.select === 'function') el.select();
          document.execCommand('copy');
          notifySuccess();
        } catch (e) {
          if (window.UIModal && window.UIModal.prompt) {
            window.UIModal.prompt('請按 Ctrl + C 複製以下內容：', textToCopy, '📋 複製提示詞');
          } else {
            notifySuccess();
          }
        }
      });
    } else {
      try {
        if (typeof el.select === 'function') el.select();
        document.execCommand('copy');
        notifySuccess();
      } catch (e) {
        if (window.UIModal && window.UIModal.prompt) {
          window.UIModal.prompt('請按 Ctrl + C 複製以下內容：', textToCopy, '📋 複製提示詞');
        }
      }
    }
  },

  // ==========================================================================
  // 3.3 AI SKILL COACH (HOW TO ASK AI TO LEARN ANY SKILL STEP-BY-STEP)
  // ==========================================================================
  renderAiSkillCoach(el, cid) {
    const skills = [
      {
        name: '♟️ 學下西洋棋 (Chess 新手入門)',
        promptSkill: '下西洋棋 (Chess) 的基本規則與開局技巧',
        step1: `👋 **【AI 西洋棋教練 — 第 1 關：認識棋盤與最勇敢的小兵 (Pawn)】**\n太棒了！我們分成 5 個小關卡，現在先只學 **第 1 關**：\n* **小兵 (Pawn)** 站在最前排，它平常每次只能「往前走 1 格」，但**第一次出發時可以選擇往前衝 2 格**喔！\n* 特別規則：小兵走路是直直走，但吃對方的棋子時要 **「斜前方吃 1 格」**！\n\n🎯 **給你的第 1 關小練習**：如果你的小兵還在起點還沒動過，請問它第一步可以往前走幾格呢？點下方回答我，答對我們就進入第 2 關（騎士與城堡）！`,
        step2: `🎉 **答對了！小兵第一步可以走 1 格或 2 格！現在進入【第 2 關：會跳躍的騎士馬 (Knight)】**\n* **騎士 (Knight)** 長得像一匹馬，它是整個棋盤上**唯一可以「跳過別的棋子」**的角色！\n* 它走路的形狀是一個英文大寫 **「L 字型（日字型）」**：先直走 2 格，再往左或往右轉 1 格！\n\n🌟 你看，用「一次只教一步 + 等我回答」的提示詞，學任何新本領是不是都超輕鬆！快複製上方的教練提示詞去學你想學的任何技能吧！`
      },
      {
        name: '🎨 學畫可愛 Q 版人物 (Chibi Drawing)',
        promptSkill: '畫出超可愛的二頭身 Q 版漫畫人物',
        step1: `👋 **【AI 繪畫教練 — 第 1 關：二頭身黃金比例與大圓頭】**\n畫可愛 Q 版人物超簡單！我們分成 5 步，現在先做 **第 1 步**：\n* 拿出紙和筆，先畫一個像包子一樣圓滾滾的大圓形當「頭」！\n* **Q 版可愛秘訣**：身體跟腿加起來的高度，跟「一顆頭」一樣高（這就叫做 **二頭身**）！\n\n🎯 **給你的第 1 關小練習**：請問 Q 版人物的眼睛應該畫在臉的「偏上方」還是「正中間偏下方一點點」看起來會最像小寶寶一樣可愛呢？`,
        step2: `🎉 **太有藝術天分了！眼睛畫在中間偏下方、而且距離稍微寬一點會最萌！**\n**【第 2 關：畫出閃亮大眼睛與表情】**\n* 在大眼睛裡面畫兩個白色的小圓圈（反光高光），眼睛馬上就會亮晶晶有靈魂！\n\n🌟 快複製這套「一步步技能教練提示詞」，不管想學畫恐龍、摺紙飛機還是魔術方塊都能請 AI 教你！`
      },
      {
        name: '🗣️ 學出國旅遊點餐英文會話 (Travel English)',
        promptSkill: '去國外餐廳與冰淇淋店自己用英文點餐',
        step1: `👋 **【AI 英文會話教練 — 第 1 關：萬用禮貌點餐神句】**\n別緊張！不用背複雜文法，第 1 關只要學會這一句萬用魔法句：\n* **"Can I have a [食物名稱], please?"**（請問我可以點一個...嗎？）\n* 例如想點巧克力冰淇淋：**"Can I have a chocolate ice cream, please?"**\n\n🎯 **給你的第 1 關小練習**：如果今天你想點一個「起司漢堡 (cheeseburger)」，用剛剛的萬用句要怎麼對店員說呢？`,
        step2: `🎉 **100 分！"Can I have a cheeseburger, please!" 店員一定會笑著稱讚你超有禮貌！**\n**【第 2 關：店員問你 For here or to go? 怎麼回？】**\n* **For here, please!** = 在店裡吃（內用）\n* **To go, please!** = 打包帶走（外帶）！`
      },
      {
        name: '💻 學做 Scratch 小遊戲 / 摺紙 / 科學實驗',
        promptSkill: '設計一個接蘋果計分小遊戲的邏輯步驟',
        step1: `👋 **【AI 遊戲設計教練 — 第 1 關：主角左右移動邏輯】**\n做遊戲就像拼樂高！第 1 關我們先讓畫面底下的「碗」能跟著鍵盤左右移動：\n* 當按下 **「右方向鍵 →」** 時，讓 X 座標 **增加 10**（往右跑）！\n* 當按下 **「左方向鍵 ←」** 時，讓 X 座標 **減少 10**（往左跑）！\n\n🎯 **第 1 關小練習**：如果蘋果要從天上往下掉，應該是改變「左右 X 座標」還是「上下 Y 座標」呢？`,
        step2: `🎉 **太聰明了！上下移動就是改變 Y 座標！**\n**【第 2 關：碰到碗就加 1 分！】**\n* 加上一個判斷積木：「如果蘋果碰到碗 → 得分 +1，而且蘋果回到天上重新掉下來！」`
      }
    ];

    const s = this.state;
    const chosen = skills[s.skillIdx];
    const targetSkillText = s.customSkill.trim() !== '' ? s.customSkill.trim() : chosen.promptSkill;
    const coachPrompt = `你是一位超有耐心、很會鼓勵小朋友的專屬技能教練。我是 9 歲的小學生（初學者 Beginner），我今天想學會：「${targetSkillText}」。\n請把這個技能拆解成 5 個由淺入深的小步驟 (Step-by-Step)。\n⚠️ 最重要規則：現在請「先只教我第 1 步」，並給我一個馬上可以試試看的小練習或小問題，等我回答你、確認我學會之後，你再教我第 2 步！請用繁體中文回答。`;

    el.innerHTML = `
      <div class="sim-box">
        <div style="background:white; border:2px solid #cbd5e1; border-radius:14px; padding:1.25rem;">
          <div style="font-weight:800; color:#92400e; margin-bottom:0.4rem;">🥋 步驟 1：挑選你想請 AI 教你的新技能（或自己打字輸入！）：</div>
          <div class="prompt-chip-group">
            ${skills.map((sk, idx) => `
              <button class="prompt-chip ${s.skillIdx === idx && !s.customSkill ? 'selected' : ''}"
                      onclick="window.Simulators.selectCoachSkill(${idx}, '${cid}')">
                ${sk.name}
              </button>
            `).join('')}
          </div>

          <div style="margin-bottom:0.9rem;">
            <label style="font-size:0.88rem; font-weight:800; color:#475569;">✍️ 或者自己輸入任何你想學的本領（例如：魔術方塊、摺紙飛機、吹直笛、認識星座）：</label>
            <input type="text"
                   placeholder="在此輸入你想學的任何技能..."
                   value="${s.customSkill}"
                   oninput="window.Simulators.updateCustomSkill(this.value, '${cid}')"
                   style="width:100%; margin-top:0.35rem; padding:0.55rem 0.85rem; border:2px solid #cbd5e1; border-radius:10px; font-weight:700;" />
          </div>

          <div style="background:#fffbeb; border:2px solid #f59e0b; border-radius:12px; padding:1rem; margin-bottom:1rem;">
            <div style="font-size:0.82rem; font-weight:900; color:#b45309; margin-bottom:0.3rem;">
              🌟 你的「互動式一步步技能教練」黃金提示詞 (Prompt)：
            </div>
            <textarea id="${cid}-coach-prompt" rows="4" style="width:100%; border:1px solid #fcd34d; border-radius:8px; padding:0.6rem; font-size:0.95rem; font-weight:700; font-family:inherit;">${coachPrompt}</textarea>
            <div style="display:flex; gap:0.6rem; margin-top:0.6rem; flex-wrap:wrap;">
              <button class="btn-primary" onclick="window.Simulators.advanceCoach(1, '${cid}')">
                🥋 開始第 1 步互動教學體驗
              </button>
              <button class="btn-secondary" onclick="window.Simulators.copyText('${cid}-coach-prompt')">
                📋 複製這組教練提示詞
              </button>
            </div>
          </div>

          ${s.coachStep >= 1 ? `
            <div style="background:#f0f9ff; border:2px solid #7dd3fc; border-radius:12px; padding:1.1rem; white-space:pre-line; margin-bottom:0.85rem;">
              ${chosen.step1}
              ${s.coachStep === 1 ? `
                <div style="margin-top:0.85rem;">
                  <button class="btn-primary" style="background:#059669;" onclick="window.Simulators.advanceCoach(2, '${cid}')">
                    🙋‍♂️ 我學會第 1 步並回答問題了！請教練繼續教我「第 2 步」👉
                  </button>
                </div>
              ` : ''}
            </div>
          ` : ''}

          ${s.coachStep >= 2 ? `
            <div style="background:#f0fdf4; border:2px solid #86efac; border-radius:12px; padding:1.1rem; white-space:pre-line;">
              ${chosen.step2}
            </div>
          ` : ''}
        </div>
      </div>
    `;
  },

  selectCoachSkill(idx, cid) {
    this.state.skillIdx = idx;
    this.state.customSkill = '';
    this.state.coachStep = 1;
    this.renderAiSkillCoach(document.getElementById(cid), cid);
  },
  updateCustomSkill(val, cid) {
    this.state.customSkill = val;
    const promptArea = document.getElementById(`${cid}-coach-prompt`);
    if (promptArea) {
      const target = val.trim() || '這項新技能';
      promptArea.value = `你是一位超有耐心、很會鼓勵小朋友的專屬技能教練。我是 9 歲的小學生（初學者 Beginner），我今天想學會：「${target}」。\n請把這個技能拆解成 5 個由淺入深的小步驟 (Step-by-Step)。\n⚠️ 最重要規則：現在請「先只教我第 1 步」，並給我一個馬上可以試試看的小練習或小問題，等我回答你、確認我學會之後，你再教我第 2 步！請用繁體中文回答。`;
    }
  },
  advanceCoach(step, cid) {
    this.state.coachStep = step;
    this.renderAiSkillCoach(document.getElementById(cid), cid);
  },

  // ==========================================================================
  // 3.4 AI 5-INGREDIENT IMAGE PROMPTING STUDIO
  // ==========================================================================
  renderAiImageStudio(el, cid) {
    const subjects = [
      { zh: '一隻戴著透明太空頭盔的可愛柴犬', en: 'a cute Shiba Inu dog wearing a space helmet', emoji: '🐕‍🦺👨‍🚀' },
      { zh: '一隻背著噴射背包的胖嘟嘟橘貓', en: 'a chubby orange cat wearing a jetpack', emoji: '🐱🚀' },
      { zh: '一隻戴著魔法師帽子的友善小恐龍', en: 'a friendly baby dinosaur wearing a wizard hat', emoji: '🦖🧙‍♂️' },
      { zh: '一台會飛行的未來珍珠奶茶餐車', en: 'a futuristic flying bubble tea food truck', emoji: '🧋🛸' }
    ];
    const actions = [
      { zh: '正在開心地滑著發光飛天滑板', en: 'happily riding a glowing hoverboard' },
      { zh: '正在用放大鏡探索神祕的寶箱', en: 'exploring a glowing treasure chest with a magnifying glass' },
      { zh: '正在跟外星人一起喝珍珠奶茶', en: 'drinking bubble tea with cute friendly aliens' }
    ];
    const bgs = [
      { zh: '在佈滿彩色水晶與地球美景的月球表面', en: 'on the moon surface with colorful crystals and Earth in the sky', bgGrad: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 55%, #312e81 100%)', stars: true },
      { zh: '在長滿發光巨型蘑菇的奇幻魔法森林裡', en: 'in an enchanted forest filled with giant glowing mushrooms', bgGrad: 'linear-gradient(135deg, #064e3b 0%, #047857 60%, #10b981 100%)', stars: false },
      { zh: '在雲朵與彩虹組成的天空城堡樂園', en: 'in a floating sky castle playground made of clouds and rainbows', bgGrad: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 55%, #fef08a 100%)', stars: false }
    ];
    const styles = [
      { zh: '皮克斯 3D 動畫電影風格', en: 'Pixar 3D animation movie style, cute, high detail', badge: '🎬 Pixar 3D 立體動畫風', filter: 'drop-shadow(0 10px 16px rgba(0,0,0,0.45))' },
      { zh: '吉卜力溫暖手繪水彩動畫風', en: 'Studio Ghibli hand-drawn anime watercolor style', badge: '🍃 吉卜力手繪水彩風', filter: 'sepia(0.15) saturate(1.2)' },
      { zh: '8-bit 復古像素電玩風', en: '8-bit retro pixel art game style', badge: '👾 Pixel Art 像素遊戲風', filter: 'contrast(1.35)' },
      { zh: '樂高積木微縮世界風格', en: 'made entirely of colorful LEGO bricks, macro toy photography', badge: '🧱 LEGO 樂高積木風', filter: 'saturate(1.4)' }
    ];
    const lights = [
      { zh: '溫暖閃耀的黃金陽光與魔法光點', en: 'warm golden hour lighting with magical sparkles', glow: '#fde047' },
      { zh: '夢幻霓虹星光與柔和光暈', en: 'dreamy neon starlight and soft cinematic glow', glow: '#38bdf8' }
    ];

    const s = this.state;
    const sub = subjects[s.imgSubjectIdx];
    const act = actions[s.imgActionIdx];
    const bg = bgs[s.imgBgIdx];
    const sty = styles[s.imgStyleIdx];
    const lgt = lights[s.imgLightIdx];

    const zhPrompt = `${sub.zh}，${act.zh}，背景是${bg.zh}，${sty.zh}，充滿${lgt.zh}。`;
    const enPrompt = `${sub.en}, ${act.en}, ${bg.en}, ${sty.en}, ${lgt.en}.`;

    el.innerHTML = `
      <div class="sim-box">
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(310px, 1fr)); gap:1.25rem; align-items:start;">
          <!-- Left: 5-Ingredient Selector -->
          <div style="background:white; border:2px solid #cbd5e1; border-radius:14px; padding:1.15rem;">
            <div style="font-weight:800; color:#92400e;">1️⃣ 主角 (Subject)：</div>
            <div class="prompt-chip-group">
              ${subjects.map((item, i) => `<button class="prompt-chip ${s.imgSubjectIdx === i ? 'selected' : ''}" onclick="window.Simulators.setImgPart('imgSubjectIdx', ${i}, '${cid}')">${item.emoji} ${item.zh.replace('一隻', '').replace('一台', '')}</button>`).join('')}
            </div>

            <div style="font-weight:800; color:#92400e;">2️⃣ 動作 (Action)：</div>
            <div class="prompt-chip-group">
              ${actions.map((item, i) => `<button class="prompt-chip ${s.imgActionIdx === i ? 'selected' : ''}" onclick="window.Simulators.setImgPart('imgActionIdx', ${i}, '${cid}')">${item.zh}</button>`).join('')}
            </div>

            <div style="font-weight:800; color:#92400e;">3️⃣ 背景環境 (Setting / Background)：</div>
            <div class="prompt-chip-group">
              ${bgs.map((item, i) => `<button class="prompt-chip ${s.imgBgIdx === i ? 'selected' : ''}" onclick="window.Simulators.setImgPart('imgBgIdx', ${i}, '${cid}')">${item.zh}</button>`).join('')}
            </div>

            <div style="font-weight:800; color:#92400e;">4️⃣ 藝術風格 (Art Style — 超關鍵！)：</div>
            <div class="prompt-chip-group">
              ${styles.map((item, i) => `<button class="prompt-chip ${s.imgStyleIdx === i ? 'selected' : ''}" onclick="window.Simulators.setImgPart('imgStyleIdx', ${i}, '${cid}')">${item.badge}</button>`).join('')}
            </div>

            <div style="font-weight:800; color:#92400e;">5️⃣ 光線與色彩 (Lighting)：</div>
            <div class="prompt-chip-group">
              ${lights.map((item, i) => `<button class="prompt-chip ${s.imgLightIdx === i ? 'selected' : ''}" onclick="window.Simulators.setImgPart('imgLightIdx', ${i}, '${cid}')">${item.zh}</button>`).join('')}
            </div>
          </div>

          <!-- Right: Live Visual Canvas Preview & Bilingual Prompts -->
          <div style="background:white; border:2px solid #cbd5e1; border-radius:14px; padding:1.15rem;">
            <div style="background:${bg.bgGrad}; border-radius:14px; min-height:230px; padding:1.25rem; color:white; display:flex; flex-direction:column; justify-content:space-between; align-items:center; text-align:center; position:relative; overflow:hidden; filter:${sty.filter}; border:4px solid ${lgt.glow};">
              <div style="background:rgba(15,23,42,0.75); padding:0.3rem 0.85rem; border-radius:999px; font-size:0.82rem; font-weight:800; color:${lgt.glow};">
                ${sty.badge} ｜ ✨ 5 要素即時預覽畫布
              </div>
              <div style="font-size:4.2rem; margin:0.6rem 0; text-shadow:0 0 24px ${lgt.glow};">
                ${sub.emoji}
              </div>
              <div style="background:rgba(15,23,42,0.82); padding:0.65rem 0.9rem; border-radius:10px; font-size:0.88rem; font-weight:700; line-height:1.45;">
                「${sub.zh}，${act.zh}」<br/>
                <span style="color:#fde047; font-size:0.8rem;">🌄 ${bg.zh}</span>
              </div>
            </div>

            <div style="margin-top:0.9rem;">
              <div style="font-size:0.84rem; font-weight:900; color:#0369a1; margin-bottom:0.25rem;">🇹🇼 中文繪圖提示詞 (Chinese Image Prompt)：</div>
              <textarea id="${cid}-img-zh" rows="2" style="width:100%; padding:0.5rem; border:1px solid #cbd5e1; border-radius:8px; font-size:0.88rem; font-weight:700;">${zhPrompt}</textarea>

              <div style="font-size:0.84rem; font-weight:900; color:#059669; margin:0.5rem 0 0.25rem;">🔤 英文繪圖提示詞 (English Image Prompt — 學起來超強！)：</div>
              <textarea id="${cid}-img-en" rows="2" style="width:100%; padding:0.5rem; border:1px solid #cbd5e1; border-radius:8px; font-size:0.88rem; font-weight:700;">${enPrompt}</textarea>

              <div style="display:flex; gap:0.5rem; margin-top:0.6rem; flex-wrap:wrap;">
                <button class="btn-primary" style="flex:1; justify-content:center; font-size:0.88rem;" onclick="window.Simulators.copyText('${cid}-img-zh')">
                  📋 複製中文繪圖指令
                </button>
                <button class="btn-secondary" style="flex:1; justify-content:center; font-size:0.88rem;" onclick="window.Simulators.copyText('${cid}-img-en')">
                  📋 複製英文繪圖指令
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  setImgPart(key, val, cid) {
    this.state[key] = val;
    this.renderAiImageStudio(document.getElementById(cid), cid);
  },

  // ==========================================================================
  // 2.5 GOOGLE MAPS NAVIGATOR (FAMILY TRIP, STREET VIEW & REAL REVIEWS)
  // ==========================================================================
  renderMapsNavigator(el, cid) {
    const s = this.state;
    const routes = {
      walk: {
        modeName: '🚶 步行 (Walking)',
        time: '1 小時 25 分鐘',
        dist: '6.8 公里 (約 9,200 步)',
        traffic: '一路暢行 (人行道)',
        trafficColor: '#059669',
        tip: '短途散步很健康，但帶小孩長距離出遊會腳痠，建議搭捷運！',
        steps: ['從台北車站東三門出發', '沿著承德路人行道向北走', '經百齡橋抵達兒童新樂園']
      },
      transit: {
        modeName: '🚌 捷運＋接駁公車 (Transit)',
        time: '28 分鐘',
        dist: '淡水信義線 (紅線) ＋ 兒樂接駁車',
        traffic: '每 5 分鐘一班車，順暢準時！',
        trafficColor: '#0284c7',
        tip: '最適合全家出遊！車廂涼爽有冷氣，刷悠遊卡超方便！',
        steps: ['台北車站搭乘【淡水信義線 (紅線)】往淡水方向', '搭乘 5 站至【捷運劍潭站】1 號出口', '轉乘【兒樂 1 號線接駁車】直達園區門口']
      },
      drive: {
        modeName: '🚗 開車 (Driving)',
        time: '22 分鐘 (路況順暢時)',
        dist: '7.2 公里',
        traffic: '🟡 承德路三段局部車多 (慢行)・周邊停車位剩餘 15%',
        trafficColor: '#d97706',
        tip: '開車出門前先看路況顏色！橘色黃色代表車多，記得預留找車位時間！',
        steps: ['由市民大道切入承德路', '直行承德路經文林北路', '依指標轉入兒童新樂園地下停車場']
      }
    };
    const currentRoute = routes[s.mapsTripMode] || routes.transit;

    const reviews = [
      {
        id: 'rev-1',
        author: '快樂小探險家家長 (在地嚮導 第 6 級)',
        stars: 5,
        time: '2 週前',
        isFake: false,
        text: '上週末帶 8 歲與 10 歲兩個孩子去玩，摩天輪和雲霄飛車排隊大約 15 分鐘。園區美食街座位很多，洗手間非常乾淨！強烈推薦在入口先拿紙本地圖！',
        photos: '🎡 摩天輪景觀照・🍦 彩虹冰淇淋照',
        tag: '🏆 真實詳細評論 (附照片與具體建議)'
      },
      {
        id: 'rev-2',
        author: '幸運大吉星 (新註冊帳號，僅發表過 1 則評論)',
        stars: 5,
        time: '昨天',
        isFake: true,
        text: '太棒了老闆人超好五星好評送可樂讚讚讚！',
        photos: '無照片',
        tag: '🚨 疑似刷星廣告 (五星換好康、無具體細節)'
      },
      {
        id: 'rev-3',
        author: '林老師 (學校戶外教學帶隊組長)',
        stars: 4,
        time: '1 個月前',
        isFake: false,
        text: '門票非常親民，悠遊卡感應入園超方便。缺點是中午戶外遮蔭處較少，建議爸爸媽媽一定要幫小朋友準備水壺和防曬遮陽帽！整體 4.5 顆星！',
        photos: '🌳 園區遮陽棚配置照・🚰 飲水機位置圖',
        tag: '🏆 誠實客觀評價 (給出實用提醒)'
      }
    ];

    const filteredReviews = reviews.filter(r => {
      if (s.mapsReviewFilter === 'fake') return r.isFake;
      if (s.mapsReviewFilter === 'real') return !r.isFake;
      return true;
    });

    el.innerHTML = `
      <div class="sim-box">
        <!-- Top Toolbar -->
        <div style="background:#0f172a; color:white; border-radius:14px; padding:0.9rem 1.2rem; margin-bottom:1rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.6rem;">
          <div style="display:flex; align-items:center; gap:0.6rem;">
            <span style="font-size:1.4rem;">🗺️</span>
            <div>
              <div style="font-weight:900; font-size:1.05rem;">Google Maps 出遊領航員</div>
              <div style="font-size:0.8rem; color:#94a3b8;">起點：台北車站 📍 ➔ 目的地：台北市立兒童新樂園 🎡</div>
            </div>
          </div>
          <div style="display:flex; gap:0.4rem;">
            <button class="btn-secondary" style="padding:0.35rem 0.75rem; font-size:0.82rem; background:${s.mapsStreetViewOpen ? '#fef08a' : '#334155'}; color:${s.mapsStreetViewOpen ? '#854d0e' : '#f8fafc'}; border:none;"
                    onclick="window.Simulators.toggleMapsStreetView('${cid}')">
              ${s.mapsStreetViewOpen ? '✕ 關閉 360° 街景' : '🚶‍♂️ 街景小黃人 (Street View)'}
            </button>
          </div>
        </div>

        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap:1rem;">
          <!-- Left: Route Planner & Map View -->
          <div style="background:white; border:2px solid #cbd5e1; border-radius:14px; padding:1.1rem;">
            <div style="font-size:0.92rem; font-weight:800; color:#0369a1; margin-bottom:0.6rem;">
              1️⃣ 選擇交通導航方式 (Directions)：
            </div>
            <div style="display:flex; gap:0.4rem; margin-bottom:0.85rem;">
              <button class="step-tab ${s.mapsTripMode === 'transit' ? 'active' : ''}" style="flex:1; justify-content:center;"
                      onclick="window.Simulators.setMapsMode('transit', '${cid}')">
                🚌 捷運公車
              </button>
              <button class="step-tab ${s.mapsTripMode === 'drive' ? 'active' : ''}" style="flex:1; justify-content:center;"
                      onclick="window.Simulators.setMapsMode('drive', '${cid}')">
                🚗 開車
              </button>
              <button class="step-tab ${s.mapsTripMode === 'walk' ? 'active' : ''}" style="flex:1; justify-content:center;"
                      onclick="window.Simulators.setMapsMode('walk', '${cid}')">
                🚶 步行
              </button>
            </div>

            <!-- Route Details Card -->
            <div style="background:#f8fafc; border:2px solid #bae6fd; border-radius:12px; padding:0.9rem; margin-bottom:0.9rem;">
              <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:0.3rem;">
                <span style="font-size:1.15rem; font-weight:900; color:#0284c7;">⏱️ 預估時間：${currentRoute.time}</span>
                <span style="font-size:0.85rem; font-weight:700; color:#475569;">${currentRoute.dist}</span>
              </div>
              <div style="font-size:0.85rem; font-weight:800; color:${currentRoute.trafficColor}; margin-bottom:0.5rem;">
                🚦 即時路況：${currentRoute.traffic}
              </div>
              <div style="font-size:0.84rem; background:#ffffff; border:1px solid #e2e8f0; border-radius:8px; padding:0.55rem; color:#334155;">
                💡 <strong>探險家小提示</strong>：${currentRoute.tip}
              </div>
            </div>

            <!-- Simulated Interactive Map Screen -->
            <div style="background:linear-gradient(135deg, #e0f2fe 0%, #dcfce7 100%); border:2px solid #94a3b8; border-radius:12px; height:180px; position:relative; overflow:hidden; display:flex; flex-direction:column; justify-content:space-between; padding:0.75rem;">
              <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                <span style="background:rgba(15,23,42,0.85); color:white; font-size:0.78rem; font-weight:800; padding:0.25rem 0.6rem; border-radius:6px;">
                  📍 路線圖預覽（藍色順暢導航線）
                </span>
                <button onclick="window.Simulators.toggleMapsStreetView('${cid}')"
                        style="background:#f59e0b; color:#0f172a; border:none; border-radius:999px; padding:0.3rem 0.7rem; font-size:0.8rem; font-weight:900; cursor:pointer; box-shadow:0 2px 8px rgba(0,0,0,0.15);">
                  🚶‍♂️ 丟下小黃人看街景
                </button>
              </div>

              <!-- SVG Route Map Graphic -->
              <div style="position:absolute; inset:0; pointer-events:none;">
                <svg width="100%" height="100%" viewBox="0 0 300 180" preserveAspectRatio="none">
                  <path d="M 30 150 Q 120 120, 150 80 T 260 30" fill="none" stroke="${currentRoute.trafficColor}" stroke-width="6" stroke-linecap="round" stroke-dasharray="${s.mapsTripMode === 'walk' ? '6,6' : 'none'}"/>
                  <circle cx="30" cy="150" r="7" fill="#0284c7" />
                  <circle cx="260" cy="30" r="8" fill="#ef4444" />
                </svg>
              </div>

              <div style="display:flex; justify-content:space-between; align-items:flex-end; font-size:0.8rem; font-weight:800; z-index:2;">
                <span style="background:white; padding:0.2rem 0.5rem; border-radius:6px; border:1px solid #cbd5e1;">📍 台北車站</span>
                <span style="background:white; padding:0.2rem 0.5rem; border-radius:6px; border:1px solid #cbd5e1;">🎡 兒童新樂園門口</span>
              </div>
            </div>

            <!-- Step by Step Directions List -->
            <div style="margin-top:0.75rem; font-size:0.82rem; color:#475569;">
              <div style="font-weight:800; color:#0f172a; margin-bottom:0.25rem;">詳細行車指引：</div>
              ${currentRoute.steps.map((st, i) => `<div>${i + 1}. ${st}</div>`).join('')}
            </div>
          </div>

          <!-- Right: Street View or Review Detective -->
          <div style="background:white; border:2px solid #cbd5e1; border-radius:14px; padding:1.1rem; display:flex; flex-direction:column; justify-content:space-between;">
            ${s.mapsStreetViewOpen ? `
              <!-- 360° Street View Screen -->
              <div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.6rem;">
                  <span style="font-size:0.95rem; font-weight:900; color:#b45309;">
                    🚶‍♂️ 街景服務 (Street View)：園區正門 360° 全景
                  </span>
                  <span style="font-size:0.78rem; background:#fef3c7; color:#92400e; padding:0.2rem 0.5rem; border-radius:4px; font-weight:800;">
                    時光機：2026 年最新影像
                  </span>
                </div>
                <div style="background:radial-gradient(circle at center, #60a5fa 0%, #1e3a8a 100%); border-radius:12px; height:220px; position:relative; overflow:hidden; border:2px solid #1e293b; display:flex; flex-direction:column; justify-content:center; align-items:center; color:white; text-align:center; padding:1rem;">
                  <div style="font-size:3.5rem; margin-bottom:0.3rem; animation:pulse 2s infinite;">🎡</div>
                  <div style="font-size:1.05rem; font-weight:900; text-shadow:0 2px 4px rgba(0,0,0,0.6);">
                    台北市立兒童新樂園・正門售票口
                  </div>
                  <div style="font-size:0.8rem; color:#bae6fd; margin-top:0.3rem;">
                    💡 地標辨識：認明右手邊彩虹拱門與左手邊紅樹林接駁公車站牌！
                  </div>
                  <div style="position:absolute; bottom:8px; left:8px; background:rgba(0,0,0,0.6); padding:2px 8px; border-radius:4px; font-size:0.72rem;">
                    🔄 滑鼠拖曳可環景 360° 旋轉踩點
                  </div>
                </div>
                <div style="margin-top:0.75rem; padding:0.6rem; background:#ecfdf5; border-radius:8px; font-size:0.84rem; font-weight:800; color:#065f46;">
                  ✅ 街景踩點成功！先看過大門口建築招牌，到現場全家完全不會迷路！
                </div>
              </div>
            ` : `
              <!-- Review Detective -->
              <div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.6rem; flex-wrap:wrap; gap:0.4rem;">
                  <div style="font-size:0.95rem; font-weight:900; color:#0f172a;">
                    🕵️ 評論小偵探：揪出洗星假評價，挑選真實好店！
                  </div>
                </div>

                <div style="display:flex; gap:0.35rem; margin-bottom:0.75rem;">
                  <button class="step-tab ${s.mapsReviewFilter === 'all' ? 'active' : ''}" style="padding:0.3rem 0.6rem; font-size:0.8rem;"
                          onclick="window.Simulators.setMapsReviewFilter('all', '${cid}')">
                    全部評價 (${reviews.length})
                  </button>
                  <button class="step-tab ${s.mapsReviewFilter === 'real' ? 'active' : ''}" style="padding:0.3rem 0.6rem; font-size:0.8rem;"
                          onclick="window.Simulators.setMapsReviewFilter('real', '${cid}')">
                    🏆 真實心得 (2)
                  </button>
                  <button class="step-tab ${s.mapsReviewFilter === 'fake' ? 'active' : ''}" style="padding:0.3rem 0.6rem; font-size:0.8rem;"
                          onclick="window.Simulators.setMapsReviewFilter('fake', '${cid}')">
                    🚨 疑似刷星 (1)
                  </button>
                </div>

                <div style="display:flex; flex-direction:column; gap:0.6rem; max-height:260px; overflow-y:auto; padding-right:4px;">
                  ${filteredReviews.map(r => `
                    <div onclick="window.Simulators.inspectMapsReview('${r.id}', '${cid}')"
                         style="background:#f8fafc; border:2px solid ${s.mapsSelectedReviewId === r.id ? (r.isFake ? '#ef4444' : '#16a34a') : (r.isFake ? '#fecaca' : '#cbd5e1')}; border-radius:10px; padding:0.65rem 0.85rem; cursor:pointer;">
                      <div style="display:flex; justify-content:space-between; font-size:0.78rem; margin-bottom:0.2rem;">
                        <span style="font-weight:900; color:#0f172a;">${r.author}</span>
                        <span style="color:#d97706; font-weight:800;">${'★'.repeat(r.stars)}</span>
                      </div>
                      <div style="font-size:0.82rem; color:#334155; line-height:1.4; margin-bottom:0.3rem;">
                        ${r.text}
                      </div>
                      <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.75rem;">
                        <span style="color:#64748b;">📷 ${r.photos}</span>
                        <span style="font-weight:800; color:${r.isFake ? '#dc2626' : '#16a34a'};">${r.tag}</span>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            `}

            <!-- Bottom Action Tips -->
            <div style="margin-top:0.85rem; padding-top:0.75rem; border-top:1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center;">
              <span style="font-size:0.82rem; font-weight:800; color:#059669;">
                📍 已將「兒童新樂園」加入全家週末出遊清單 ★
              </span>
              <button class="btn-primary" style="font-size:0.82rem; padding:0.35rem 0.75rem;"
                      onclick="window.UIModal ? window.UIModal.toast('🎉 成功將兒童新樂園儲存到 Google Maps「想去的地點」！') : alert('🎉 儲存成功！')">
                ❤️ 儲存地點
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  setMapsMode(mode, cid) {
    this.state.mapsTripMode = mode;
    this.renderMapsNavigator(document.getElementById(cid), cid);
  },
  toggleMapsStreetView(cid) {
    this.state.mapsStreetViewOpen = !this.state.mapsStreetViewOpen;
    this.renderMapsNavigator(document.getElementById(cid), cid);
  },
  setMapsReviewFilter(filter, cid) {
    this.state.mapsReviewFilter = filter;
    this.renderMapsNavigator(document.getElementById(cid), cid);
  },
  inspectMapsReview(rid, cid) {
    this.state.mapsSelectedReviewId = rid;
    this.renderMapsNavigator(document.getElementById(cid), cid);
  },

  // ==========================================================================
  // 4.1 SLIDE STUDIO (MESSY SLIDE RESCUE & RULE OF 3)
  // ==========================================================================
  renderSlideStudio(el, cid) {
    const s = this.state;
    const allFixed = s.slideRescueStep1 && s.slideRescueStep2 && s.slideRescueStep3;

    el.innerHTML = `
      <div class="sim-box">
        <!-- Control Header -->
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; flex-wrap:wrap; gap:0.5rem;">
          <div>
            <h3 style="font-size:1.15rem; font-weight:900; color:#5b21b6; margin-bottom:0.2rem;">
              📊 簡報魔法改造實驗室：拯救混亂投影片
            </h3>
            <div style="font-size:0.84rem; color:#64748b;">
              完成 3 大排版改造，讓學校報告從「不及格大魔王」變身「全班最高分」！
            </div>
          </div>
          <button class="btn-primary" style="background:#7c3aed; padding:0.45rem 1rem; font-size:0.9rem;"
                  onclick="window.Simulators.toggleSlideShow('${cid}')">
            ${s.slideShowMode ? '⏹️ 退出放映' : '▶️ 全螢幕放映預覽 (Slideshow)'}
          </button>
        </div>

        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap:1rem;">
          <!-- Left: Rescue Action Toolbox -->
          <div style="background:white; border:2px solid #cbd5e1; border-radius:14px; padding:1.15rem;">
            <div style="font-size:0.95rem; font-weight:900; color:#4c1d95; margin-bottom:0.75rem;">
              🛠️ 簡報醫師工具箱 (3 步急救大改造)：
            </div>

            <!-- Fix Step 1 -->
            <div style="margin-bottom:0.85rem; padding:0.8rem; border-radius:10px; background:${s.slideRescueStep1 ? '#f5f3ff' : '#f8fafc'}; border:2px solid ${s.slideRescueStep1 ? '#8b5cf6' : '#cbd5e1'};">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.35rem;">
                <span style="font-weight:900; font-size:0.9rem; color:#0f172a;">
                  1️⃣ 套用「三重點法則 (Rule of 3)」
                </span>
                <span style="font-size:0.8rem; font-weight:800; color:${s.slideRescueStep1 ? '#16a34a' : '#64748b'};">
                  ${s.slideRescueStep1 ? '✅ 已濃縮' : '未處理'}
                </span>
              </div>
              <p style="font-size:0.82rem; color:#475569; margin-bottom:0.5rem;">
                把原本 15 行落落長的維基百科全文，濃縮成 3 條好讀的重點條列！
              </p>
              <button class="btn-secondary" style="width:100%; justify-content:center; font-size:0.85rem;"
                      onclick="window.Simulators.toggleSlideStep('slideRescueStep1', '${cid}')">
                ${s.slideRescueStep1 ? '↩️ 還原成混亂長文' : '✨ 一鍵套用 3 大條列重點'}
              </button>
            </div>

            <!-- Fix Step 2 -->
            <div style="margin-bottom:0.85rem; padding:0.8rem; border-radius:10px; background:${s.slideRescueStep2 ? '#f5f3ff' : '#f8fafc'}; border:2px solid ${s.slideRescueStep2 ? '#8b5cf6' : '#cbd5e1'};">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.35rem;">
                <span style="font-weight:900; font-size:0.9rem; color:#0f172a;">
                  2️⃣ 修正顏色對比度 (High Contrast)
                </span>
                <span style="font-size:0.8rem; font-weight:800; color:${s.slideRescueStep2 ? '#16a34a' : '#64748b'};">
                  ${s.slideRescueStep2 ? '✅ 高對比' : '看不清'}
                </span>
              </div>
              <p style="font-size:0.82rem; color:#475569; margin-bottom:0.5rem;">
                告別深紫色底配黑字的致命地雷，切換成乾淨清爽的高對比學院風！
              </p>
              <button class="btn-secondary" style="width:100%; justify-content:center; font-size:0.85rem;"
                      onclick="window.Simulators.toggleSlideStep('slideRescueStep2', '${cid}')">
                ${s.slideRescueStep2 ? '↩️ 還原成暗黑模糊色' : '🎨 套用乾淨高對比主題'}
              </button>
            </div>

            <!-- Fix Step 3 -->
            <div style="padding:0.8rem; border-radius:10px; background:${s.slideRescueStep3 ? '#f5f3ff' : '#f8fafc'}; border:2px solid ${s.slideRescueStep3 ? '#8b5cf6' : '#cbd5e1'};">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.35rem;">
                <span style="font-weight:900; font-size:0.9rem; color:#0f172a;">
                  3️⃣ 插入焦點英雄大圖與圖說 (Hero Image)
                </span>
                <span style="font-size:0.8rem; font-weight:800; color:${s.slideRescueStep3 ? '#16a34a' : '#64748b'};">
                  ${s.slideRescueStep3 ? '✅ 已配置' : '無焦點'}
                </span>
              </div>
              <p style="font-size:0.82rem; color:#475569; margin-bottom:0.5rem;">
                一張圖勝過千言萬語！插入清晰大圖與圖說，吸引全班同學目光！
              </p>
              <button class="btn-secondary" style="width:100%; justify-content:center; font-size:0.85rem;"
                      onclick="window.Simulators.toggleSlideStep('slideRescueStep3', '${cid}')">
                ${s.slideRescueStep3 ? '↩️ 移除焦點大圖' : '🖼️ 插入焦點大圖與圖說'}
              </button>
            </div>
          </div>

          <!-- Right: Live Slide Preview Canvas -->
          <div style="background:white; border:2px solid #cbd5e1; border-radius:14px; padding:1.15rem; display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.6rem;">
                <span style="font-size:0.88rem; font-weight:800; color:#5b21b6;">
                  📺 投影片 16:9 實時預覽
                </span>
                <span style="font-size:0.8rem; font-weight:800; color:${allFixed ? '#16a34a' : '#dc2626'};">
                  ${allFixed ? '🎉 報告品質：100 分特優！' : '⚠️ 還有排版地雷需要救援'}
                </span>
              </div>

              <!-- Slide Canvas Box -->
              <div style="background:${s.slideRescueStep2 ? '#ffffff' : '#312e81'}; color:${s.slideRescueStep2 ? '#0f172a' : '#1e1b4b'}; border:3px solid ${s.slideRescueStep2 ? '#7c3aed' : '#1e1b4b'}; border-radius:12px; min-height:260px; padding:1.4rem; position:relative; box-shadow:0 6px 20px rgba(0,0,0,0.12); display:flex; flex-direction:column; justify-content:space-between; transition:all 0.3s ease;">
                <!-- Slide Header -->
                <div>
                  <div style="font-size:0.75rem; font-weight:800; color:${s.slideRescueStep2 ? '#7c3aed' : '#4338ca'}; text-transform:uppercase; margin-bottom:0.25rem;">
                    三年級自然與生活科技・期末專題發表
                  </div>
                  <h2 style="font-size:1.35rem; font-weight:900; color:${s.slideRescueStep2 ? '#1e1b4b' : '#0f172a'}; margin-bottom:0.75rem;">
                    🌋 台灣的大屯火山群：會噴發嗎？
                  </h2>
                </div>

                <!-- Slide Body Content -->
                <div style="display:grid; grid-template-columns:${s.slideRescueStep3 ? '1.2fr 0.8fr' : '1fr'}; gap:1rem; align-items:center;">
                  <div>
                    ${s.slideRescueStep1 ? `
                      <ul style="padding-left:1.2rem; font-size:0.92rem; font-weight:700; line-height:1.6; color:${s.slideRescueStep2 ? '#334155' : '#0f172a'};">
                        <li><strong>休眠中的活火山</strong>：地底下依然有岩漿庫活動，被列為活火山！</li>
                        <li><strong>天然地熱溫泉</strong>：雨水受地底岩漿加熱，形成北投與陽明山溫泉！</li>
                        <li><strong>全天候科學監測</strong>：中央地質調查所設有地震儀與氣體觀測站，非常安全！</li>
                      </ul>
                    ` : `
                      <div style="font-size:0.76rem; line-height:1.35; color:${s.slideRescueStep2 ? '#334155' : '#0f172a'}; font-family:serif;">
                        大屯火山群位於台灣北部，是由大屯山、七星山等二十餘座火山所組成的火山群。在以前的教科書中常被歸類為休眠火山或死火山，然而近年經由中央研究院地質科學家透過精密地震儀器研究發現，金山、萬里到陽明山地底深處約二十公里處存在著巨大的岩漿庫，因此地質學界已正式將其正名為活火山。雖然如此大家不必過度恐慌，因為火山噴發前會有明顯頻繁的群震與地熱氣體釋放...
                      </div>
                    `}
                  </div>

                  ${s.slideRescueStep3 ? `
                    <div style="background:#f5f3ff; border:2px dashed #8b5cf6; border-radius:10px; padding:0.6rem; text-align:center;">
                      <div style="font-size:2.8rem; margin-bottom:0.2rem;">🌋</div>
                      <div style="font-size:0.75rem; font-weight:800; color:#5b21b6;">
                        ▲ 大屯火山群地熱噴氣孔觀測站
                      </div>
                    </div>
                  ` : ''}
                </div>

                <!-- Slide Footer Page Indicator -->
                <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.72rem; color:${s.slideRescueStep2 ? '#94a3b8' : '#3730a3'}; border-top:1px solid ${s.slideRescueStep2 ? '#f1f5f9' : '#3730a3'}; padding-top:0.4rem; margin-top:0.6rem;">
                  <span>報告人：數位小探險家 Leo</span>
                  <span>第 3 頁 / 共 8 頁</span>
                </div>
              </div>
            </div>

            <!-- Slide Show Full Screen Modal preview -->
            ${s.slideShowMode ? `
              <div style="position:fixed; inset:0; background:rgba(15,23,42,0.92); z-index:999999; display:flex; flex-direction:column; justify-content:center; align-items:center; padding:2rem;">
                <div style="width:100%; max-width:820px; background:${s.slideRescueStep2 ? '#ffffff' : '#312e81'}; color:${s.slideRescueStep2 ? '#0f172a' : '#1e1b4b'}; border-radius:16px; padding:2rem; box-shadow:0 25px 50px rgba(0,0,0,0.5);">
                  <div style="display:flex; justify-content:space-between; margin-bottom:1rem;">
                    <span style="font-weight:900; color:#7c3aed;">▶️ Google Slides 全螢幕放映中 (按 ESC 或右上角關閉)</span>
                    <button class="btn-secondary" style="padding:0.25rem 0.65rem;" onclick="window.Simulators.toggleSlideShow('${cid}')">✕ 結束放映</button>
                  </div>
                  <h1 style="font-size:1.8rem; margin-bottom:1rem; color:${s.slideRescueStep2 ? '#1e1b4b' : '#ffffff'};">
                    🌋 台灣的大屯火山群：會噴發嗎？
                  </h1>
                  <div style="font-size:1.15rem; line-height:1.8; color:${s.slideRescueStep2 ? '#334155' : '#ffffff'};">
                    ${s.slideRescueStep1 ? `
                      <ul style="padding-left:1.5rem;">
                        <li><strong>休眠中的活火山</strong>：地底下依然有岩漿庫活動！</li>
                        <li><strong>天然地熱溫泉</strong>：雨水加熱形成北投與陽明山溫泉！</li>
                        <li><strong>全天候科學監測</strong>：設有地震儀與觀測站，請安心！</li>
                      </ul>
                    ` : `
                      <p>（長篇文字字體太小，全螢幕放映時最後一排同學完全看不見！）</p>
                    `}
                  </div>
                </div>
              </div>
            ` : ''}

            <!-- Bottom Evaluation Card -->
            <div style="margin-top:0.85rem; padding:0.6rem 0.9rem; border-radius:8px; background:${allFixed ? '#dcfce7' : '#fef3c7'}; font-size:0.85rem; font-weight:800; color:${allFixed ? '#166534' : '#92400e'};">
              ${allFixed ? '🏆 太棒了！三重點法則 ＋ 高對比色調 ＋ 焦點大圖，學校老師一定會給你 100 分！' : '💡 請在左邊工具箱把 3 個急救步驟全部打勾，完成簡報拯救大考驗！'}
            </div>
          </div>
        </div>
      </div>
    `;
  },

  toggleSlideStep(stepKey, cid) {
    this.state[stepKey] = !this.state[stepKey];
    this.renderSlideStudio(document.getElementById(cid), cid);
  },
  toggleSlideShow(cid) {
    this.state.slideShowMode = !this.state.slideShowMode;
    this.renderSlideStudio(document.getElementById(cid), cid);
  },

  // ==========================================================================
  // 4.2 SCRATCH BLOCKS & CATCH-THE-APPLE GAME PLAYGROUND
  // ==========================================================================
  renderScratchBlocks(el, cid) {
    if (!el) return;
    const s = this.state;
    const allSnapped = s.scratchBlockBowl && s.scratchBlockApple && s.scratchBlockScore;

    el.innerHTML = `
      <div class="sim-box">
        <!-- Header -->
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; flex-wrap:wrap; gap:0.5rem;">
          <div>
            <h3 style="font-size:1.15rem; font-weight:900; color:#c026d3; margin-bottom:0.2rem;">
              🐱 Scratch 積木程式實驗室：拼裝並試玩「接蘋果遊戲」！
            </h3>
            <div style="font-size:0.84rem; color:#64748b;">
              把程式邏輯拼裝成積木，在右側遊戲畫布啟動實戰！接住 10 顆蘋果破關！
            </div>
          </div>
          <div style="display:flex; gap:0.5rem; align-items:center;">
            <span style="font-size:0.88rem; font-weight:800; color:#0f172a; background:#f5d0fe; padding:0.35rem 0.8rem; border-radius:999px;">
              🍎 得分 (Score)：<strong>${s.scratchScore}</strong> / 10
            </span>
            <button class="btn-primary" style="background:${allSnapped ? '#16a34a' : '#94a3b8'}; padding:0.4rem 0.9rem; font-size:0.88rem;"
                    onclick="window.Simulators.toggleScratchGame('${cid}')">
              ${s.scratchGamePlaying ? '⏹️ 停止遊戲' : '🚩 點擊綠旗 (執行遊戲)'}
            </button>
          </div>
        </div>

        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap:1rem;">
          <!-- Left: Scratch Block Snapping Bench -->
          <div style="background:white; border:2px solid #cbd5e1; border-radius:14px; padding:1.15rem;">
            <div style="font-size:0.92rem; font-weight:900; color:#86198f; margin-bottom:0.75rem;">
              🧩 積木工作台 (點擊積木卡片，拼入主程式中)：
            </div>

            <!-- Block 1: Event & Bowl -->
            <div onclick="window.Simulators.toggleScratchBlock('scratchBlockBowl', '${cid}')"
                 style="background:#fef08a; border:2px solid ${s.scratchBlockBowl ? '#ca8a04' : '#eab308'}; border-radius:10px; padding:0.65rem 0.85rem; margin-bottom:0.65rem; cursor:pointer; box-shadow:0 2px 4px rgba(0,0,0,0.06);">
              <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.8rem; font-weight:800; color:#854d0e; margin-bottom:0.2rem;">
                <span>🚩 事件與小碗移動 (Events & Movement)</span>
                <span>${s.scratchBlockBowl ? '✅ 已拼裝' : '➕ 點擊拼入'}</span>
              </div>
              <div style="font-family:monospace; font-size:0.85rem; font-weight:900; color:#713f12;">
                [當 綠旗 🚩 被點擊] ➔ [重複無限次] ➔ [將 X 設為 滑鼠 X]
              </div>
            </div>

            <!-- Block 2: Apple Falling Loop -->
            <div onclick="window.Simulators.toggleScratchBlock('scratchBlockApple', '${cid}')"
                 style="background:#fed7aa; border:2px solid ${s.scratchBlockApple ? '#ea580c' : '#f97316'}; border-radius:10px; padding:0.65rem 0.85rem; margin-bottom:0.65rem; cursor:pointer; box-shadow:0 2px 4px rgba(0,0,0,0.06);">
              <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.8rem; font-weight:800; color:#9a3412; margin-bottom:0.2rem;">
                <span>🍎 蘋果重力掉落迴圈 (Falling Loop)</span>
                <span>${s.scratchBlockApple ? '✅ 已拼裝' : '➕ 點擊拼入'}</span>
              </div>
              <div style="font-family:monospace; font-size:0.85rem; font-weight:900; color:#7c2d12;">
                [重複無限次] ➔ [將 Y 座標改變 -5] ➔ [如果 Y < -140 回到上方]
              </div>
            </div>

            <!-- Block 3: Collision & Scoring -->
            <div onclick="window.Simulators.toggleScratchBlock('scratchBlockScore', '${cid}')"
                 style="background:#bbf7d0; border:2px solid ${s.scratchBlockScore ? '#16a34a' : '#22c55e'}; border-radius:10px; padding:0.65rem 0.85rem; margin-bottom:0.75rem; cursor:pointer; box-shadow:0 2px 4px rgba(0,0,0,0.06);">
              <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.8rem; font-weight:800; color:#166534; margin-bottom:0.2rem;">
                <span>🎯 碰撞偵測與變數得分 (Collision & Variable)</span>
                <span>${s.scratchBlockScore ? '✅ 已拼裝' : '➕ 點擊拼入'}</span>
              </div>
              <div style="font-family:monospace; font-size:0.85rem; font-weight:900; color:#14532d;">
                [如果 碰到 &lt;碗&gt;?] ➔ [變數 得分 改變 1] ➔ [播放 叮咚 音效]
              </div>
            </div>

            <!-- Assembled Program Preview -->
            <div style="background:#f8fafc; border:2px dashed #cbd5e1; border-radius:10px; padding:0.75rem;">
              <div style="font-size:0.78rem; font-weight:800; color:#64748b; margin-bottom:0.35rem;">
                📜 拼裝完成的主程式碼預覽：
              </div>
              <div style="font-family:monospace; font-size:0.8rem; color:#334155; line-height:1.45;">
                ${allSnapped ? `
                  <span style="color:#ca8a04;">當 綠旗 點擊</span><br/>
                  <span style="color:#ea580c;">　重複無限次</span><br/>
                  <span style="color:#0284c7;">　　小碗.X = 滑鼠.X</span><br/>
                  <span style="color:#ea580c;">　　蘋果.Y -= 5</span><br/>
                  <span style="color:#16a34a;">　　如果 &lt;蘋果 碰到 碗&gt; 那麼</span><br/>
                  <span style="color:#c026d3;">　　　[得分] 增加 1 並且 蘋果回到頂端</span>
                ` : `
                  <span style="color:#94a3b8;">（請點擊上方三組積木，把程式拼裝完整！）</span>
                `}
              </div>
            </div>
          </div>

          <!-- Right: Playable HTML5 2D Canvas Game Area -->
          <div style="background:white; border:2px solid #cbd5e1; border-radius:14px; padding:1.15rem; display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.6rem;">
                <span style="font-size:0.88rem; font-weight:800; color:#86198f;">
                  🎮 HTML5 遊戲舞台 (Canvas Stage)
                </span>
                <span style="font-size:0.8rem; font-weight:700; color:#64748b;">
                  可用滑鼠左右滑動、鍵盤 ← →、或下方按鈕操作！
                </span>
              </div>

              <!-- Canvas / Stage Container -->
              <div id="${cid}-canvas-box"
                   style="background:linear-gradient(180deg, #67e8f9 0%, #bae6fd 60%, #86efac 100%); border:3px solid #0f172a; border-radius:12px; height:240px; position:relative; overflow:hidden; cursor:crosshair; user-select:none;"
                   onmousemove="window.Simulators.handleScratchMouseMove(event, '${cid}')">
                <!-- HTML5 Canvas Element -->
                <canvas id="${cid}-scratch-canvas" width="340" height="240" style="width:100%; height:100%; display:block;"></canvas>

                <!-- In-stage Win Celebration Overlay -->
                ${s.scratchWin ? `
                  <div style="position:absolute; inset:0; background:rgba(15,23,42,0.85); color:white; display:flex; flex-direction:column; justify-content:center; align-items:center; z-index:10; padding:1rem; text-align:center;">
                    <div style="font-size:3rem; margin-bottom:0.25rem;">🏆</div>
                    <div style="font-size:1.25rem; font-weight:900; color:#fde047;">恭喜破關！接住 10 顆蘋果！</div>
                    <div style="font-size:0.85rem; color:#e2e8f0; margin-top:0.35rem;">
                      你已經掌握事件、迴圈、條件判斷與變數的四大精髓！
                    </div>
                    <button class="btn-primary" style="margin-top:0.75rem; background:#ca8a04; font-size:0.85rem;"
                            onclick="window.Simulators.resetScratchGame('${cid}')">
                      🔄 再玩一次
                    </button>
                  </div>
                ` : ''}

                <!-- Status if not snapped -->
                ${!allSnapped ? `
                  <div style="position:absolute; inset:0; background:rgba(15,23,42,0.7); color:white; display:flex; flex-direction:column; justify-content:center; align-items:center; z-index:5; padding:1rem; text-align:center;">
                    <div style="font-size:2rem; margin-bottom:0.3rem;">🧩</div>
                    <div style="font-size:0.95rem; font-weight:800;">程式積木尚未拼裝完成</div>
                    <div style="font-size:0.8rem; color:#cbd5e1; margin-top:0.2rem;">
                      請在左側點選三組積木完成組裝，綠旗才會亮起喔！
                    </div>
                  </div>
                ` : ''}
              </div>

              <!-- Fallback Touch / Button Controls -->
              <div style="display:flex; justify-content:center; gap:0.6rem; margin-top:0.6rem;">
                <button class="btn-secondary" style="padding:0.4rem 1.1rem; font-weight:900;"
                        onclick="window.Simulators.moveScratchBowl(-35, '${cid}')">
                  ⬅️ 向左移動
                </button>
                <button class="btn-secondary" style="padding:0.4rem 1.1rem; font-weight:900;"
                        onclick="window.Simulators.moveScratchBowl(35, '${cid}')">
                  向右移動 ➡️
                </button>
                <button class="btn-secondary" style="padding:0.4rem 0.8rem; font-size:0.82rem;"
                        onclick="window.Simulators.catchAppleDirect('${cid}')">
                  🍎 瞬間接住 (+1)
                </button>
              </div>
            </div>

            <!-- Bottom Note -->
            <div style="margin-top:0.65rem; font-size:0.8rem; color:#64748b; text-align:center;">
              ⭐ 提示：滑鼠在畫布內左右移動，小碗就會自動跟著滑鼠跑！
            </div>
          </div>
        </div>
      </div>
    `;

    // Attempt to draw canvas frame
    this.drawScratchCanvas(cid);
  },

  toggleScratchBlock(blockKey, cid) {
    this.state[blockKey] = !this.state[blockKey];
    this.renderScratchBlocks(document.getElementById(cid), cid);
  },
  toggleScratchGame(cid) {
    if (!this.state.scratchBlockBowl || !this.state.scratchBlockApple || !this.state.scratchBlockScore) {
      if (window.UIModal && window.UIModal.toast) {
        window.UIModal.toast('💡 請先把左側的 3 組積木全部拼入，才能啟動遊戲喔！');
      }
      return;
    }
    this.state.scratchGamePlaying = !this.state.scratchGamePlaying;
    if (this.state.scratchGamePlaying) {
      this.startScratchGameLoop(cid);
    }
    this.renderScratchBlocks(document.getElementById(cid), cid);
  },
  resetScratchGame(cid) {
    this.state.scratchScore = 0;
    this.state.scratchWin = false;
    this.state.scratchGamePlaying = true;
    this.state.scratchAppleY = 20;
    this.startScratchGameLoop(cid);
    this.renderScratchBlocks(document.getElementById(cid), cid);
  },
  moveScratchBowl(delta, cid) {
    this.state.scratchBowlX = Math.max(30, Math.min(310, this.state.scratchBowlX + delta));
    this.checkScratchCollision(cid);
    this.drawScratchCanvas(cid);
  },
  catchAppleDirect(cid) {
    this.state.scratchScore += 1;
    if (this.state.scratchScore >= 10) {
      this.state.scratchWin = true;
      this.state.scratchGamePlaying = false;
    }
    this.state.scratchAppleY = 20;
    this.state.scratchAppleX = Math.floor(Math.random() * 260) + 40;
    this.renderScratchBlocks(document.getElementById(cid), cid);
  },
  handleScratchMouseMove(evt, cid) {
    const box = document.getElementById(`${cid}-canvas-box`);
    if (!box) return;
    const rect = box.getBoundingClientRect();
    const mouseX = evt.clientX - rect.left;
    const ratio = 340 / (rect.width || 340);
    this.state.scratchBowlX = Math.max(30, Math.min(310, mouseX * ratio));
    this.checkScratchCollision(cid);
    this.drawScratchCanvas(cid);
  },
  checkScratchCollision(cid) {
    const s = this.state;
    // Bowl is at (s.scratchBowlX, 205), width ~50, height ~18. Apple is at (s.scratchAppleX, s.scratchAppleY), radius ~12.
    if (s.scratchAppleY >= 190 && s.scratchAppleY <= 220) {
      if (Math.abs(s.scratchAppleX - s.scratchBowlX) < 35) {
        s.scratchScore += 1;
        s.scratchAppleY = 20;
        s.scratchAppleX = Math.floor(Math.random() * 260) + 40;
        if (s.scratchScore >= 10) {
          s.scratchWin = true;
          s.scratchGamePlaying = false;
        }
        const el = document.getElementById(cid);
        if (el) {
          this.renderScratchBlocks(el, cid);
        }
      }
    }
  },
  startScratchGameLoop(cid) {
    if (this._scratchTimer) clearInterval(this._scratchTimer);
    this._scratchTimer = setInterval(() => {
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
      s.scratchAppleY += 7;
      if (s.scratchAppleY > 230) {
        // missed apple, loop back
        s.scratchAppleY = 20;
        s.scratchAppleX = Math.floor(Math.random() * 260) + 40;
      }
      this.checkScratchCollision(cid);
      this.drawScratchCanvas(cid);
    }, 45);
  },
  drawScratchCanvas(cid) {
    const canvas = document.getElementById(`${cid}-scratch-canvas`);
    if (!canvas || typeof canvas.getContext !== 'function') return;
    let ctx = null;
    try {
      ctx = canvas.getContext('2d');
    } catch (e) {
      ctx = null;
    }
    if (!ctx) return; // Clean JSDOM guard

    const s = this.state;
    ctx.clearRect(0, 0, 340, 240);

    // Draw background grass & sky
    ctx.fillStyle = '#67e8f9';
    ctx.fillRect(0, 0, 340, 195);
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(0, 195, 340, 45);

    // Draw falling Apple
    ctx.font = '24px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🍎', s.scratchAppleX, s.scratchAppleY);

    // Draw Catcher Bowl
    ctx.fillStyle = '#d97706';
    ctx.beginPath();
    ctx.ellipse(s.scratchBowlX, 215, 30, 12, 0, 0, Math.PI);
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#78350f';
    ctx.stroke();

    // Score overlay on canvas
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 13px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`得分：${s.scratchScore} / 10`, 10, 20);
  },

  // ==========================================================================
  // 4.3 AUDIO & VISUAL STORY STUDIO (3-SCENE PICTURE BOOK & TTS NARRATION)
  // ==========================================================================
  renderStoryStudio(el, cid) {
    const s = this.state;

    const heroes = [
      { id: 'leo', name: '小探險家 Leo', desc: '戴紅色飛行護目鏡的勇敢少年', icon: '👦' },
      { id: 'mia', name: '智多星 Mia', desc: '手拿平板電腦與指南針的科學少女', icon: '👧' },
      { id: 'robo', name: '機器人嗶波 (Bibo)', desc: '胸前有太陽能發光寶石的 AI 機器人', icon: '🤖' }
    ];

    const companions = [
      { id: 'fox', name: '彩虹小狐狸', desc: '尾巴會指引方向的森林守護精靈', icon: '🦊' },
      { id: 'owl', name: '百科全書貓頭鷹', desc: '博學多聞的夜間飛行導師', icon: '🦉' },
      { id: 'drone', name: '迷你偵察無人機', desc: '具備 360 度空中照相掃描功能', icon: '🛸' }
    ];

    const settings = [
      { id: 'forest', name: '發光水晶森林', desc: '樹木長滿藍綠色發光果實的神秘山谷', icon: '🌲', bg: '#064e3b' },
      { id: 'space', name: '星際浮島空間站', desc: '漂浮在土星環旁邊的未來太空基地', icon: '🌌', bg: '#1e1b4b' },
      { id: 'undersea', name: '亞特蘭提斯水下城', desc: '海豚與珊瑚圍繞的遠古高科技王國', icon: '🌊', bg: '#0c4a6e' }
    ];

    const twists = [
      { id: 'lost', title: '星光指南針突然失靈', resolve: '利用筆電查出北極星天文方位順利脫困' },
      { id: 'puzzle', title: '古老石門需要輸入秘密密碼', resolve: '用 Scratch 積木邏輯拼出解鎖代碼' },
      { id: 'baby', title: '受困在樹上的幼鳥寶寶', resolve: '呼叫無人機安全降下能量吊籃平安救援' }
    ];

    const curHero = heroes[s.storyHeroIdx];
    const curComp = companions[s.storyCompanionIdx];
    const curSetting = settings[s.storySettingIdx];
    const curTwist = twists[s.storyTwistIdx];

    // Build 3 Story Scenes
    const scenes = [
      {
        sceneNum: 1,
        title: '第一幕：出發冒險 (The Journey Begins)',
        zhText: `在晴朗清晨，${curHero.name} 背起探險背包，與最好的搭檔 ${curComp.name} 一同踏入了傳說中的「${curSetting.name}」。空氣中飄著冒險的氣息，他們的目標是尋找傳奇數位之石！`,
        enText: `On a crisp morning, ${curHero.name} and loyal friend ${curComp.name} set foot into the legendary ${curSetting.name}. An exciting adventure is about to unfold!`,
        artPromptZh: `皮克斯 3D 動畫風格，${curHero.name} 和 ${curComp.name} 站在 ${curSetting.name} 入口，晨光灑落，充滿希望，電影級光影。`,
        artPromptEn: `Pixar 3D animation style, ${curHero.name} and ${curComp.name} standing at entrance of ${curSetting.name}, morning golden sunlight, cinematic lighting, ultra-detailed 8k.`,
        sceneIcon: curSetting.icon
      },
      {
        sceneNum: 2,
        title: '第二幕：考驗難關 (The Sudden Challenge)',
        zhText: `突然間，天空閃過一道奇異光芒！${curTwist.title}！四週的一切變得安靜無聲，${curComp.name} 緊張地拉了拉 ${curHero.name} 的衣角。`,
        enText: `Suddenly, a mysterious beam lit the sky! ${curTwist.title}! ${curHero.name} kept calm and analyzed the situation carefully.`,
        artPromptZh: `皮克斯 3D 動畫風格，${curHero.name} 與 ${curComp.name} 在 ${curSetting.name} 面對考驗，緊張神秘氛圍，戲劇性光影對比。`,
        artPromptEn: `Pixar 3D style, dramatic moment when ${curHero.name} and ${curComp.name} face a challenge in ${curSetting.name}, mystical glow, dramatic shadows.`,
        sceneIcon: '⚡'
      },
      {
        sceneNum: 3,
        title: '第三幕：智慧化解與榮耀 (Victory & Celebration)',
        zhText: `「別怕，我有數位探險家的智慧！」${curHero.name} 與夥伴同心協力，${curTwist.resolve}！難題瞬間化解，天空中綻放起絢麗煙火，榮譽勳章閃閃發光！`,
        enText: `"Together we can solve anything!" With courage and wisdom, ${curTwist.resolve}. Fireworks burst in celebration!`,
        artPromptZh: `皮克斯 3D 渲染，${curHero.name} 和 ${curComp.name} 歡呼慶祝勝利，天空綻放彩虹煙火，溫暖快樂大團圓，超精細。`,
        artPromptEn: `Pixar 3D render, joyful celebration, ${curHero.name} and ${curComp.name} cheering triumphantly, colorful fireworks, heartwarming happy ending, masterpieces.`,
        sceneIcon: '🎉'
      }
    ];

    const activeScene = scenes[s.storyCurrentScene] || scenes[0];

    el.innerHTML = `
      <div class="sim-box">
        <!-- Header -->
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; flex-wrap:wrap; gap:0.5rem;">
          <div>
            <h3 style="font-size:1.15rem; font-weight:900; color:#0284c7; margin-bottom:0.2rem;">
              🎬 AI 圖文與有聲故事實驗室：創作你的 3 幕冒險繪本！
            </h3>
            <div style="font-size:0.84rem; color:#64748b;">
              選擇主角與情節，自動生成起承轉合 3 幕分鏡插圖提詞與雙語有聲書旁白！
            </div>
          </div>
          <div style="display:flex; gap:0.4rem;">
            <button class="btn-primary" style="background:#0284c7; padding:0.4rem 0.9rem; font-size:0.86rem;"
                    onclick="window.Simulators.speakStoryScene(${s.storyCurrentScene}, '${cid}')">
              🔊 聽有聲書朗讀 (Web Speech API)
            </button>
            <button class="btn-secondary" style="padding:0.4rem 0.8rem; font-size:0.86rem;"
                    onclick="window.UIModal ? window.UIModal.toast('🎉 故事繪本已成功儲存至你的數位作品集！') : alert('🎉 儲存成功！')">
              💾 儲存繪本
            </button>
          </div>
        </div>

        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap:1rem;">
          <!-- Left: Story Elements Configuration -->
          <div style="background:white; border:2px solid #cbd5e1; border-radius:14px; padding:1.15rem;">
            <div style="font-size:0.92rem; font-weight:900; color:#0369a1; margin-bottom:0.75rem;">
              🎨 繪本故事工坊 (選擇你的 4 大故事要素)：
            </div>

            <!-- Hero Selector -->
            <div style="margin-bottom:0.75rem;">
              <div style="font-size:0.82rem; font-weight:800; color:#475569; margin-bottom:0.3rem;">1️⃣ 故事主角 (Hero)：</div>
              <div class="prompt-chip-group" style="margin-bottom:0;">
                ${heroes.map((h, i) => `
                  <button class="prompt-chip ${s.storyHeroIdx === i ? 'selected' : ''}"
                          onclick="window.Simulators.setStoryPart('storyHeroIdx', ${i}, '${cid}')">
                    ${h.icon} ${h.name}
                  </button>
                `).join('')}
              </div>
            </div>

            <!-- Companion Selector -->
            <div style="margin-bottom:0.75rem;">
              <div style="font-size:0.82rem; font-weight:800; color:#475569; margin-bottom:0.3rem;">2️⃣ 冒險同伴 (Companion)：</div>
              <div class="prompt-chip-group" style="margin-bottom:0;">
                ${companions.map((c, i) => `
                  <button class="prompt-chip ${s.storyCompanionIdx === i ? 'selected' : ''}"
                          onclick="window.Simulators.setStoryPart('storyCompanionIdx', ${i}, '${cid}')">
                    ${c.icon} ${c.name}
                  </button>
                `).join('')}
              </div>
            </div>

            <!-- Setting Selector -->
            <div style="margin-bottom:0.75rem;">
              <div style="font-size:0.82rem; font-weight:800; color:#475569; margin-bottom:0.3rem;">3️⃣ 冒險舞台 (Setting)：</div>
              <div class="prompt-chip-group" style="margin-bottom:0;">
                ${settings.map((st, i) => `
                  <button class="prompt-chip ${s.storySettingIdx === i ? 'selected' : ''}"
                          onclick="window.Simulators.setStoryPart('storySettingIdx', ${i}, '${cid}')">
                    ${st.icon} ${st.name}
                  </button>
                `).join('')}
              </div>
            </div>

            <!-- Twist Selector -->
            <div>
              <div style="font-size:0.82rem; font-weight:800; color:#475569; margin-bottom:0.3rem;">4️⃣ 考驗與解題難題 (Plot Twist)：</div>
              <div class="prompt-chip-group" style="margin-bottom:0;">
                ${twists.map((tw, i) => `
                  <button class="prompt-chip ${s.storyTwistIdx === i ? 'selected' : ''}"
                          onclick="window.Simulators.setStoryPart('storyTwistIdx', ${i}, '${cid}')">
                    ⚡ ${tw.title}
                  </button>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- Right: 3-Scene Storyboard Viewer -->
          <div style="background:white; border:2px solid #cbd5e1; border-radius:14px; padding:1.15rem; display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <!-- Scene Tabs -->
              <div style="display:flex; gap:0.4rem; margin-bottom:0.75rem;">
                ${scenes.map((sc, idx) => `
                  <button class="step-tab ${s.storyCurrentScene === idx ? 'active' : ''}" style="flex:1; justify-content:center; padding:0.35rem 0.5rem; font-size:0.82rem;"
                          onclick="window.Simulators.setStoryScene(${idx}, '${cid}')">
                    第 ${idx + 1} 幕
                  </button>
                `).join('')}
              </div>

              <!-- Scene Stage Canvas -->
              <div style="background:linear-gradient(135deg, ${curSetting.bg} 0%, #0f172a 100%); border-radius:12px; min-height:190px; padding:1.2rem; color:white; display:flex; flex-direction:column; justify-content:space-between; position:relative; overflow:hidden; border:2px solid #334155; margin-bottom:0.85rem;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <span style="background:rgba(255,255,255,0.2); backdrop-filter:blur(4px); padding:0.25rem 0.65rem; border-radius:999px; font-size:0.78rem; font-weight:900;">
                    ${activeScene.title}
                  </span>
                  <span style="font-size:1.5rem;">${activeScene.sceneIcon}</span>
                </div>

                <div style="text-align:center; margin:0.8rem 0;">
                  <span style="font-size:3.5rem; filter:drop-shadow(0 0 16px rgba(255,255,255,0.4));">
                    ${curHero.icon} ${curComp.icon}
                  </span>
                </div>

                <div style="background:rgba(15,23,42,0.85); border-radius:8px; padding:0.65rem 0.85rem; font-size:0.86rem; line-height:1.5;">
                  <strong>${activeScene.zhText}</strong><br/>
                  <span style="color:#93c5fd; font-size:0.78rem;">${activeScene.enText}</span>
                </div>
              </div>

              <!-- AI Image Prompt Box for Current Scene -->
              <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:10px; padding:0.65rem 0.85rem;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.25rem;">
                  <span style="font-size:0.78rem; font-weight:900; color:#0369a1;">
                    🎨 第 ${activeScene.sceneNum} 幕 AI 繪圖提示詞 (一致性風格)：
                  </span>
                  <button class="btn-secondary" style="padding:2px 8px; font-size:0.75rem;"
                          onclick="window.Simulators.copyText('${cid}-scene-prompt')">
                    📋 複製
                  </button>
                </div>
                <input type="text" id="${cid}-scene-prompt" readonly value="${activeScene.artPromptZh} (${activeScene.artPromptEn})"
                       style="width:100%; padding:0.35rem 0.5rem; font-size:0.78rem; font-weight:700; border:1px solid #cbd5e1; border-radius:6px; background:white; color:#334155;" />
              </div>
            </div>

            <!-- Bottom Scene Nav & Narration -->
            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:0.75rem; border-top:1px solid #e2e8f0; padding-top:0.65rem;">
              <button class="btn-secondary" style="padding:0.35rem 0.75rem; font-size:0.82rem;"
                      ${s.storyCurrentScene === 0 ? 'disabled style="opacity:0.5;"' : `onclick="window.Simulators.setStoryScene(${s.storyCurrentScene - 1}, '${cid}')"`}>
                ← 上一幕
              </button>
              <span style="font-size:0.82rem; font-weight:800; color:#475569;">
                第 ${s.storyCurrentScene + 1} 幕 / 共 3 幕
              </span>
              <button class="btn-secondary" style="padding:0.35rem 0.75rem; font-size:0.82rem;"
                      ${s.storyCurrentScene === 2 ? 'disabled style="opacity:0.5;"' : `onclick="window.Simulators.setStoryScene(${s.storyCurrentScene + 1}, '${cid}')"`}>
                下一幕 →
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  setStoryPart(key, val, cid) {
    this.state[key] = val;
    this.renderStoryStudio(document.getElementById(cid), cid);
  },
  setStoryScene(sceneIdx, cid) {
    this.state.storyCurrentScene = sceneIdx;
    this.renderStoryStudio(document.getElementById(cid), cid);
  },
  speakStoryScene(sceneIdx, cid) {
    const s = this.state;
    const heroes = [
      { name: '小探險家 Leo' }, { name: '智多星 Mia' }, { name: '機器人嗶波' }
    ];
    const companions = [
      { name: '彩虹小狐狸' }, { name: '百科全書貓頭鷹' }, { name: '迷你偵察無人機' }
    ];
    const settings = [
      { name: '發光水晶森林' }, { name: '星際浮島空間站' }, { name: '亞特蘭提斯水下城' }
    ];
    const twists = [
      { title: '星光指南針突然失靈', resolve: '利用筆電查出北極星天文方位順利脫困' },
      { title: '古老石門需要輸入秘密密碼', resolve: '用 Scratch 積木邏輯拼出解鎖代碼' },
      { title: '受困在樹上的幼鳥寶寶', resolve: '呼叫無人機安全降下能量吊籃平安救援' }
    ];
    const curHero = heroes[s.storyHeroIdx];
    const curComp = companions[s.storyCompanionIdx];
    const curSetting = settings[s.storySettingIdx];
    const curTwist = twists[s.storyTwistIdx];

    const texts = [
      `在晴朗清晨，${curHero.name} 背起探險背包，與最好的搭檔 ${curComp.name} 一同踏入了傳說中的「${curSetting.name}」。`,
      `突然間，天空閃過一道奇異光芒！${curTwist.title}！${curHero.name} 冷靜觀察。`,
      `別怕，我有數位探險家的智慧！${curHero.name} 與夥伴同心協力，${curTwist.resolve}！成功過關！`
    ];
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
  },

  // ==========================================================================
  // 5.1 ROBLOX STUDIO BASICS WORKBENCH (PART, TRANSFORM, EXPLORER, ANCHORED)
  // ==========================================================================
  renderRobloxStudioBasics(el, cid) {
    const s = this.state;
    const selected = s.rbxParts.find(p => p.id === s.rbxSelectedId) || s.rbxParts[0];
    const allAnchored = s.rbxParts.length > 0 && s.rbxParts.every(p => p.anchored);

    el.innerHTML = `
      <div class="sim-box roblox-box">
        <div class="roblox-toolbar">
          <div style="display:flex; gap:0.4rem; flex-wrap:wrap;">
            <button class="rbx-tool-btn ${s.rbxTool === 'move' ? 'active' : ''}" onclick="window.Simulators.rbxSetTool('move', '${cid}')">✥ Move 移動</button>
            <button class="rbx-tool-btn ${s.rbxTool === 'scale' ? 'active' : ''}" onclick="window.Simulators.rbxSetTool('scale', '${cid}')">⤢ Scale 縮放</button>
            <button class="rbx-tool-btn ${s.rbxTool === 'rotate' ? 'active' : ''}" onclick="window.Simulators.rbxSetTool('rotate', '${cid}')">↻ Rotate 旋轉</button>
          </div>
          <div style="display:flex; gap:0.4rem; flex-wrap:wrap;">
            <button class="btn-secondary" style="padding:0.35rem 0.7rem; font-size:0.82rem;" onclick="window.Simulators.rbxAddPart('Block', '${cid}')">+ 🧱 方塊</button>
            <button class="btn-secondary" style="padding:0.35rem 0.7rem; font-size:0.82rem;" onclick="window.Simulators.rbxAddPart('Wedge', '${cid}')">+ 📐 斜坡</button>
            <button class="btn-primary" style="padding:0.35rem 0.85rem; font-size:0.85rem; background:${s.rbxPlaytestRunning ? '#dc2626' : '#059669'};" onclick="window.Simulators.rbxTogglePlaytest('${cid}')">
              ${s.rbxPlaytestRunning ? '⏹ Stop 停止試玩' : '▶ Playtest 試玩重力'}
            </button>
          </div>
        </div>

        <div class="roblox-studio-grid">
          <!-- 3D Viewport -->
          <div class="roblox-viewport">
            <div class="roblox-viewport-hud">
              <span>🎥 3D Viewport (WASD 飛行 / 右鍵旋轉 / F 聚焦)</span>
              <span>${s.rbxPlaytestRunning ? (allAnchored ? '✅ 重力測試：所有積木都穩穩浮在空中！' : '💥 哎呀！沒開 Anchored 的積木掉到地板上了！') : '🛠️ 編輯模式'}</span>
            </div>
            <div class="roblox-stage-area">
              ${s.rbxParts.map(p => {
                const isSel = selected && selected.id === p.id;
                const fallenY = (s.rbxPlaytestRunning && !p.anchored) ? 168 - p.h : p.y;
                const radius = p.shape === 'Sphere' ? '50%' : '4px';
                const clip = p.shape === 'Wedge' ? 'polygon(0 100%, 100% 0, 100% 100%)' : 'none';
                return `
                  <div onclick="window.Simulators.rbxSelectPart('${p.id}', '${cid}')"
                       class="rbx-part ${isSel ? 'selected' : ''}"
                       style="left:${p.x}px; top:${fallenY}px; width:${p.w}px; height:${p.h}px; background:${p.color}; border-radius:${radius}; clip-path:${clip}; transform:rotate(${p.rot}deg);">
                    <span class="rbx-part-tag">${p.anchored ? '⚓' : '⚠️'} ${p.name}</span>
                  </div>
                `;
              }).join('')}
              <div class="roblox-baseplate">Baseplate (灰色安全地板)</div>
            </div>
            ${selected ? `
              <div style="display:flex; gap:0.4rem; flex-wrap:wrap; margin-top:0.5rem; justify-content:center;">
                <button class="btn-secondary" style="padding:0.28rem 0.65rem; font-size:0.8rem;" onclick="window.Simulators.rbxTransformSelected(-18, 0, '${cid}')">⬅️ 左 / 縮小 / 左轉</button>
                <button class="btn-secondary" style="padding:0.28rem 0.65rem; font-size:0.8rem;" onclick="window.Simulators.rbxTransformSelected(18, 0, '${cid}')">➡️ 右 / 拉長 / 右轉</button>
                <button class="btn-secondary" style="padding:0.28rem 0.65rem; font-size:0.8rem;" onclick="window.Simulators.rbxTransformSelected(0, -18, '${cid}')">⬆️ 升高</button>
                <button class="btn-secondary" style="padding:0.28rem 0.65rem; font-size:0.8rem;" onclick="window.Simulators.rbxTransformSelected(0, 18, '${cid}')">⬇️ 降低</button>
              </div>
            ` : ''}
          </div>

          <!-- Explorer + Properties -->
          <div class="roblox-sidebar">
            <div class="roblox-panel">
              <div class="roblox-panel-title">📂 Explorer (物件層級樹)</div>
              <div style="font-size:0.82rem; font-weight:700; color:#475569; margin-bottom:0.35rem;">▾ 🌐 Workspace</div>
              ${s.rbxParts.map(p => `
                <div class="rbx-explorer-item ${selected && selected.id === p.id ? 'active' : ''}"
                     onclick="window.Simulators.rbxSelectPart('${p.id}', '${cid}')">
                  <span>🧱 ${p.name}</span>
                  <span>${p.anchored ? '⚓' : '⚠️'}</span>
                </div>
              `).join('')}
            </div>

            ${selected ? `
              <div class="roblox-panel">
                <div class="roblox-panel-title">⚙️ Properties (${selected.name})</div>
                <div class="rbx-prop-row">
                  <span>Color 顏色</span>
                  <div style="display:flex; gap:4px;">
                    ${['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#a855f7'].map(c => `
                      <button onclick="window.Simulators.rbxUpdateProp('color', '${c}', '${cid}')"
                              style="width:20px; height:20px; border-radius:4px; border:${selected.color === c ? '2px solid #0f172a' : '1px solid #cbd5e1'}; background:${c}; cursor:pointer;"></button>
                    `).join('')}
                  </div>
                </div>
                <div class="rbx-prop-row">
                  <span>Material 材質</span>
                  <select onchange="window.Simulators.rbxUpdateProp('material', this.value, '${cid}')" style="font-size:0.8rem; padding:2px 4px; border-radius:6px;">
                    ${['SmoothPlastic', 'Wood', 'Neon', 'Grass'].map(m => `<option value="${m}" ${selected.material === m ? 'selected' : ''}>${m}</option>`).join('')}
                  </select>
                </div>
                <div class="rbx-prop-row">
                  <span>⚓ Anchored (固定鎖)</span>
                  <button onclick="window.Simulators.rbxUpdateProp('anchored', ${!selected.anchored}, '${cid}')"
                          style="padding:0.25rem 0.6rem; border-radius:8px; border:none; font-weight:800; cursor:pointer; background:${selected.anchored ? '#dcfce7' : '#fee2e2'}; color:${selected.anchored ? '#166534' : '#991b1b'};">
                    ${selected.anchored ? '✅ true (已固定)' : '❌ false (會掉落!)'}
                  </button>
                </div>
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  },

  rbxSelectPart(id, cid) {
    this.state.rbxSelectedId = id;
    this.render({ type: 'roblox-studio-basics' }, cid);
  },

  rbxSetTool(tool, cid) {
    this.state.rbxTool = tool;
    this.render({ type: 'roblox-studio-basics' }, cid);
  },

  rbxAddPart(shape, cid) {
    const idx = this.state.rbxParts.length + 1;
    const newPart = {
      id: `part-${Date.now()}-${idx}`,
      name: `${shape}${idx}`,
      shape,
      color: shape === 'Wedge' ? '#ec4899' : '#06b6d4',
      material: 'SmoothPlastic',
      anchored: true,
      x: 60 + ((idx * 35) % 240),
      y: 65 + ((idx * 15) % 60),
      w: 68,
      h: shape === 'Wedge' ? 34 : 22,
      rot: 0
    };
    this.state.rbxParts.push(newPart);
    this.state.rbxSelectedId = newPart.id;
    this.state.rbxPlaytestRunning = false;
    this.render({ type: 'roblox-studio-basics' }, cid);
  },

  rbxUpdateProp(key, val, cid) {
    const p = this.state.rbxParts.find(item => item.id === this.state.rbxSelectedId);
    if (!p) return;
    p[key] = val;
    this.render({ type: 'roblox-studio-basics' }, cid);
  },

  rbxTransformSelected(dx, dy, cid) {
    const p = this.state.rbxParts.find(item => item.id === this.state.rbxSelectedId);
    if (!p) return;
    const t = this.state.rbxTool;
    if (t === 'move') {
      p.x = Math.max(10, Math.min(340, p.x + dx));
      p.y = Math.max(20, Math.min(145, p.y + dy));
    } else if (t === 'scale') {
      p.w = Math.max(32, Math.min(160, p.w + dx));
      p.h = Math.max(14, Math.min(70, p.h - Math.sign(dy) * 8));
    } else if (t === 'rotate') {
      p.rot = (p.rot + (dx > 0 ? 15 : -15)) % 360;
    }
    this.render({ type: 'roblox-studio-basics' }, cid);
  },

  rbxTogglePlaytest(cid) {
    this.state.rbxPlaytestRunning = !this.state.rbxPlaytestRunning;
    this.render({ type: 'roblox-studio-basics' }, cid);
  },

  // ==========================================================================
  // 5.2 ROBLOX OBBY STAGE BUILDER & PLAYTESTER
  // ==========================================================================
  renderRobloxObbyBuilder(el, cid) {
    const s = this.state;
    const cols = 8;
    const rows = 5;
    const brushes = [
      { id: 'safe', icon: '🟩', label: '安全平台' },
      { id: 'lava', icon: '🟥', label: '岩漿陷阱' },
      { id: 'moving', icon: '🟦', label: '移動平台' },
      { id: 'checkpoint', icon: '🚩', label: '存檔點' },
      { id: 'goal', icon: '🏆', label: '終點獎盃' },
      { id: 'erase', icon: '🧹', label: '橡皮擦' }
    ];

    let gridHtml = '';
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const key = `${c},${r}`;
        const cell = s.obbyCells[key] || '';
        const emojiMap = { spawn: '🚀', safe: '🟩', lava: '🔥', moving: '🟦', checkpoint: '🚩', goal: '🏆' };
        gridHtml += `
          <button class="obby-cell ${cell ? 'type-' + cell : ''}"
                  onclick="window.Simulators.obbyPaintCell(${c}, ${r}, '${cid}')">
            ${emojiMap[cell] || ''}
          </button>
        `;
      }
    }

    el.innerHTML = `
      <div class="sim-box roblox-box">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem; margin-bottom:0.75rem;">
          <div style="display:flex; gap:0.35rem; flex-wrap:wrap;">
            ${brushes.map(b => `
              <button class="rbx-tool-btn ${s.obbyBrush === b.id ? 'active' : ''}"
                      onclick="window.Simulators.obbySetBrush('${b.id}', '${cid}')">
                ${b.icon} ${b.label}
              </button>
            `).join('')}
          </div>
          <button class="btn-primary" style="background:${s.obbyPlaying ? '#dc2626' : '#059669'};"
                  onclick="window.Simulators.obbyTogglePlaytest('${cid}')">
            ${s.obbyPlaying ? '🛠️ 返回編輯模式' : '▶ Playtest 試玩跑酷'}
          </button>
        </div>

        ${!s.obbyPlaying ? `
          <div class="obby-grid-editor">${gridHtml}</div>
          <div style="font-size:0.84rem; color:#475569; font-weight:700; margin-top:0.5rem; text-align:center;">
            💡 點擊格子擺放跑酷磚塊，完成後按「▶ Playtest 試玩跑酷」親自挑戰！
          </div>
        ` : `
          <div class="obby-playtest-box">
            <div style="display:flex; justify-content:space-between; font-weight:800; margin-bottom:0.4rem; font-size:0.9rem;">
              <span>🏃 試玩中！目標：抵達 🏆 終點</span>
              <span>💀 失誤次數：${s.obbyDeaths} | ${s.obbyReachedGoal ? '🎉 跑酷過關成功！' : '加油跳躍！'}</span>
            </div>
            <canvas id="${cid}-obby-canvas" width="480" height="220" style="width:100%; max-width:480px; background:#0f172a; border-radius:12px; display:block; margin:0 auto;"></canvas>
            <div style="display:flex; justify-content:center; gap:0.6rem; margin-top:0.65rem; flex-wrap:wrap;">
              <button class="btn-secondary" onclick="window.Simulators.obbyControl('left', '${cid}')">⬅️ 往左 (A)</button>
              <button class="btn-primary" onclick="window.Simulators.obbyControl('jump', '${cid}')">⬆️ 跳躍 (Space)</button>
              <button class="btn-secondary" onclick="window.Simulators.obbyControl('right', '${cid}')">➡️ 往右 (D)</button>
            </div>
          </div>
        `}
      </div>
    `;

    if (s.obbyPlaying) {
      this.obbyDrawCanvas(cid);
    }
  },

  obbySetBrush(brush, cid) {
    this.state.obbyBrush = brush;
    this.render({ type: 'roblox-obby-builder' }, cid);
  },

  obbyPaintCell(c, r, cid) {
    const key = `${c},${r}`;
    if (this.state.obbyCells[key] === 'spawn') return; // preserve spawn
    if (this.state.obbyBrush === 'erase') {
      delete this.state.obbyCells[key];
    } else {
      this.state.obbyCells[key] = this.state.obbyBrush;
    }
    this.render({ type: 'roblox-obby-builder' }, cid);
  },

  obbyTogglePlaytest(cid) {
    const s = this.state;
    if (s.obbyPlaying) {
      s.obbyPlaying = false;
      if (s.obbyTimerId) {
        clearInterval(s.obbyTimerId);
        s.obbyTimerId = null;
      }
      this.render({ type: 'roblox-obby-builder' }, cid);
      return;
    }

    s.obbyPlaying = true;
    s.obbyReachedGoal = false;
    s.obbyDeaths = 0;
    s.obbySpawnX = 25;
    s.obbySpawnY = 120;
    // Find spawn cell
    Object.keys(s.obbyCells).forEach(k => {
      if (s.obbyCells[k] === 'spawn') {
        const [c, r] = k.split(',').map(Number);
        s.obbySpawnX = c * 60 + 20;
        s.obbySpawnY = r * 44 - 22;
      }
    });
    s.obbyPlayerX = s.obbySpawnX;
    s.obbyPlayerY = s.obbySpawnY;
    s.obbyPlayerVY = 0;
    s.obbyOnGround = true;

    this.render({ type: 'roblox-obby-builder' }, cid);

    if (s.obbyTimerId) clearInterval(s.obbyTimerId);
    s.obbyTimerId = setInterval(() => {
      if (!this.state.obbyPlaying) {
        clearInterval(this.state.obbyTimerId);
        this.state.obbyTimerId = null;
        return;
      }
      this.obbyPhysicsTick(cid);
    }, 60);
  },

  obbyControl(action, cid) {
    const s = this.state;
    if (!s.obbyPlaying) return;
    if (action === 'left') s.obbyPlayerX = Math.max(4, s.obbyPlayerX - 24);
    if (action === 'right') s.obbyPlayerX = Math.min(454, s.obbyPlayerX + 24);
    if (action === 'jump') {
      s.obbyPlayerVY = -14;
      s.obbyOnGround = false;
    }
    this.obbyPhysicsTick(cid);
  },

  obbyPhysicsTick(cid) {
    const s = this.state;
    s.obbyMoveTick = (s.obbyMoveTick + 1) % 60;
    s.obbyPlayerVY = Math.min(12, s.obbyPlayerVY + 2.2);
    s.obbyPlayerY += s.obbyPlayerVY;

    const px = s.obbyPlayerX + 10;
    const py = s.obbyPlayerY + 20;

    // Check collisions with grid cells
    Object.keys(s.obbyCells).forEach(k => {
      const type = s.obbyCells[k];
      const [c, r] = k.split(',').map(Number);
      const offsetX = type === 'moving' ? Math.sin(s.obbyMoveTick / 10) * 18 : 0;
      const cx = c * 60 + offsetX;
      const cy = r * 44;
      if (px >= cx && px <= cx + 56 && py >= cy && py <= cy + 24 && s.obbyPlayerVY >= 0) {
        if (type === 'lava') {
          s.obbyDeaths++;
          s.obbyPlayerX = s.obbySpawnX;
          s.obbyPlayerY = s.obbySpawnY;
          s.obbyPlayerVY = 0;
        } else {
          s.obbyPlayerY = cy - 20;
          s.obbyPlayerVY = 0;
          s.obbyOnGround = true;
          if (type === 'checkpoint') {
            s.obbySpawnX = cx + 16;
            s.obbySpawnY = cy - 22;
          } else if (type === 'goal' && !s.obbyReachedGoal) {
            s.obbyReachedGoal = true;
            if (s.obbyTimerId) {
              clearInterval(s.obbyTimerId);
              s.obbyTimerId = null;
            }
            if (window.UIModal && window.UIModal.toast) {
              window.UIModal.toast('🏆 太神啦！你成功通過自己設計的 3D 跑酷關卡了！', 3500);
            }
          }
        }
      }
    });

    // Fall into void
    if (s.obbyPlayerY > 220) {
      s.obbyDeaths++;
      s.obbyPlayerX = s.obbySpawnX;
      s.obbyPlayerY = s.obbySpawnY;
      s.obbyPlayerVY = 0;
    }

    this.obbyDrawCanvas(cid);
  },

  obbyDrawCanvas(cid) {
    const canvas = document.getElementById(`${cid}-obby-canvas`);
    if (!canvas || !canvas.getContext) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const s = this.state;
    ctx.clearRect(0, 0, 480, 220);

    // Draw platforms
    Object.keys(s.obbyCells).forEach(k => {
      const type = s.obbyCells[k];
      const [c, r] = k.split(',').map(Number);
      const offsetX = type === 'moving' ? Math.sin(s.obbyMoveTick / 10) * 18 : 0;
      const x = c * 60 + offsetX;
      const y = r * 44;
      const colors = { spawn: '#3b82f6', safe: '#22c55e', lava: '#ef4444', moving: '#38bdf8', checkpoint: '#eab308', goal: '#f59e0b' };
      ctx.fillStyle = colors[type] || '#94a3b8';
      ctx.fillRect(x, y, 54, 18);
    });

    // Draw Roblox blocky character
    ctx.fillStyle = '#fde047';
    ctx.fillRect(s.obbyPlayerX, s.obbyPlayerY, 20, 20);
  },

  // ==========================================================================
  // 5.3 ROBLOX LUAU SCRIPTING LAB
  // ==========================================================================
  renderRobloxLuaLab(el, cid) {
    const s = this.state;
    const presets = {
      coin: {
        name: '🪙 旋轉金幣 (Collectible Coin)',
        line1: 'local coin = script.Parent',
        line2: 'coin.Touched:Connect(function(hit)',
        line3: '  leaderstats.Coins.Value += 1 -- 防連點冷卻 debounce!'
      },
      speed: {
        name: '⚡ 閃電加速板 (Speed Pad)',
        line1: 'local pad = script.Parent',
        line2: 'pad.Touched:Connect(function(hit)',
        line3: '  hit.Parent.Humanoid.WalkSpeed = 40'
      },
      bounce: {
        name: '🦘 超級彈跳板 (Bounce Pad)',
        line1: 'local pad = script.Parent',
        line2: 'pad.Touched:Connect(function(hit)',
        line3: '  hit.Parent.Humanoid.JumpPower = 120'
      },
      door: {
        name: '🚪 感應自動門 (Auto Door)',
        line1: 'local door = script.Parent',
        line2: 'door.Touched:Connect(function(hit)',
        line3: '  door.Transparency = 0.7; door.CanCollide = false'
      }
    };
    const cur = presets[s.luaPreset] || presets.coin;
    const allAssembled = s.luaStep1 && s.luaStep2 && s.luaStep3;

    el.innerHTML = `
      <div class="sim-box roblox-box">
        <div style="display:flex; gap:0.4rem; flex-wrap:wrap; margin-bottom:0.85rem;">
          ${Object.keys(presets).map(k => `
            <button class="rbx-tool-btn ${s.luaPreset === k ? 'active' : ''}"
                    onclick="window.Simulators.luaSelectPreset('${k}', '${cid}')">
              ${presets[k].name}
            </button>
          `).join('')}
        </div>

        <div class="roblox-studio-grid">
          <div>
            <div style="font-weight:800; margin-bottom:0.4rem;">📜 點擊積木組裝 Luau 腳本 (Script)：</div>
            <div class="lua-code-bench">
              <button class="lua-line-btn ${s.luaStep1 ? 'done' : ''}" onclick="window.Simulators.luaToggleStep(1, '${cid}')">
                ${s.luaStep1 ? '✅' : '1️⃣'} <code>${cur.line1}</code>
              </button>
              <button class="lua-line-btn ${s.luaStep2 ? 'done' : ''}" onclick="window.Simulators.luaToggleStep(2, '${cid}')">
                ${s.luaStep2 ? '✅' : '2️⃣'} <code>${cur.line2}</code>
              </button>
              <button class="lua-line-btn ${s.luaStep3 ? 'done' : ''}" onclick="window.Simulators.luaToggleStep(3, '${cid}')">
                ${s.luaStep3 ? '✅' : '3️⃣'} <code>${cur.line3}</code>
              </button>
            </div>
            <button class="btn-primary" style="margin-top:0.7rem; width:100%;"
                    ${allAssembled ? '' : 'disabled'}
                    onclick="window.Simulators.luaRunTrigger('${cid}')">
              ${allAssembled ? '▶ Run Script 派角色踩上去測試！' : '👆 請先依序點選上方 3 行 Luau 程式積木'}
            </button>
          </div>

          <div class="roblox-panel">
            <div class="roblox-panel-title">📊 遊戲即時狀態 (leaderstats & Humanoid)</div>
            <div style="font-size:0.95rem; font-weight:800; line-height:1.9;">
              <div>🪙 Coins 金幣：<span style="color:#d97706;">${s.luaCoins}</span></div>
              <div>⚡ WalkSpeed 速度：<span style="color:#0284c7;">${s.luaWalkSpeed}</span></div>
              <div>🦘 JumpPower 跳力：<span style="color:#059669;">${s.luaJumpPower}</span></div>
              <div>🚪 Door 感應門：<span style="color:#7c3aed;">${s.luaDoorOpen ? '已開啟 (可穿過)' : '關閉中'}</span></div>
            </div>
            ${s.luaTriggered ? `
              <div style="margin-top:0.6rem; padding:0.55rem; background:#dcfce7; color:#166534; border-radius:10px; font-weight:800; font-size:0.85rem;">
                ✨ <code>Touched</code> 事件成功觸發！機關運作正常！
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  },

  luaSelectPreset(preset, cid) {
    this.state.luaPreset = preset;
    this.state.luaStep1 = false;
    this.state.luaStep2 = false;
    this.state.luaStep3 = false;
    this.state.luaTriggered = false;
    this.render({ type: 'roblox-lua-lab' }, cid);
  },

  luaToggleStep(step, cid) {
    this.state[`luaStep${step}`] = true;
    this.render({ type: 'roblox-lua-lab' }, cid);
  },

  luaRunTrigger(cid) {
    const s = this.state;
    s.luaTriggered = true;
    if (s.luaPreset === 'coin') s.luaCoins += 1;
    if (s.luaPreset === 'speed') s.luaWalkSpeed = 40;
    if (s.luaPreset === 'bounce') s.luaJumpPower = 120;
    if (s.luaPreset === 'door') s.luaDoorOpen = !s.luaDoorOpen;
    this.render({ type: 'roblox-lua-lab' }, cid);
  },

  // ==========================================================================
  // 5.4 ROBLOX MULTI-GENRE GAME ARCHITECT & SAFE PUBLISH
  // ==========================================================================
  renderRobloxGameArchitect(el, cid) {
    const s = this.state;
    const genres = {
      tycoon: {
        name: '🏭 大亨經營 (Tycoon)',
        loop: 'Dropper 生產 ➔ Conveyor 運送 ➔ Collector 換錢 ➔ Button 買升級',
        modules: ['⚙️ Dropper 自動生產機', '🛤️ Conveyor 輸送帶', '💵 Cash Collector 收銀台', '🟩 Upgrade Button 升級按鈕']
      },
      simulator: {
        name: '🐾 收集模擬器 (Simulator)',
        loop: '點擊收集資源 ➔ 裝滿 Backpack ➔ 賣出換金幣 ➔ 買更強寵物',
        modules: ['💎 寶石/工具點擊器', '🎒 Backpack 背包容量', '🏪 商店賣出換金幣', '🐣 寵物孵化機 (Pet Egg)']
      },
      racing: {
        name: '🏎️ 賽車競速 (Racing)',
        loop: '坐上 VehicleSeat ➔ 衝過賽道彎道 ➔ 通過 Checkpoint ➔ 衝線計時',
        modules: ['🛣️ 3D 賽道與彎道', '🪑 VehicleSeat 駕駛座', '🚩 圈數 Checkpoint', '⏱️ 比賽計時器']
      },
      hideseek: {
        name: '👻 躲貓貓 (Hide & Seek)',
        loop: '大廳倒數 ➔ 隨機選鬼 (Seeker) ➔ 躲藏者找密室 ➔ 時間到結算',
        modules: ['🏠 巨大立體家具房間', '🚪 秘密躲藏通道', '⏳ 大廳倒數計時器', '🎯 Teams 分隊系統']
      }
    };
    const cur = genres[s.rbxGenre] || genres.tycoon;
    const doneMods = cur.modules.filter((_, i) => s.rbxGenreModules[`${s.rbxGenre}-${i}`]).length;
    const allChecks = s.rbxChecks.toolbox && s.rbxChecks.privacy && s.rbxChecks.playtest;

    el.innerHTML = `
      <div class="sim-box roblox-box">
        <div style="display:flex; gap:0.4rem; flex-wrap:wrap; margin-bottom:0.85rem;">
          ${Object.keys(genres).map(k => `
            <button class="rbx-tool-btn ${s.rbxGenre === k ? 'active' : ''}"
                    onclick="window.Simulators.rbxSelectGenre('${k}', '${cid}')">
              ${genres[k].name}
            </button>
          `).join('')}
        </div>

        <div style="background:#f8fafc; border:2px solid #cbd5e1; border-radius:14px; padding:0.9rem; margin-bottom:0.85rem;">
          <div style="font-weight:900; color:#0f172a; margin-bottom:0.35rem;">🔄 核心遊戲循環：${cur.loop}</div>
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(170px, 1fr)); gap:0.5rem; margin-top:0.6rem;">
            ${cur.modules.map((m, i) => {
              const active = !!s.rbxGenreModules[`${s.rbxGenre}-${i}`];
              return `
                <button class="lua-line-btn ${active ? 'done' : ''}"
                        onclick="window.Simulators.rbxToggleModule(${i}, '${cid}')">
                  ${active ? '✅' : '➕'} ${m}
                </button>
              `;
            }).join('')}
          </div>
          <button class="btn-primary" style="margin-top:0.75rem;"
                  ${doneMods === 4 ? '' : 'disabled'}
                  onclick="window.Simulators.rbxRunGenreSim('${cid}')">
            ${doneMods === 4 ? '▶ 模擬此遊戲類型運作！' : `請放入全部 4 個核心模組 (${doneMods}/4)`}
          </button>
          ${s.rbxGenreSimDone ? `
            <div style="margin-top:0.6rem; padding:0.55rem; background:#dcfce7; color:#166534; border-radius:10px; font-weight:800;">
              🎉 太棒了！你的「${cur.name}」核心循環已成功跑起來囉！
            </div>
          ` : ''}
        </div>

        <div style="background:#fff1f2; border:2px solid #fda4af; border-radius:14px; padding:0.9rem;">
          <div style="font-weight:900; color:#9f1239; margin-bottom:0.45rem;">🛡️ 安全發佈檢查清單 (Publish Checklist)</div>
          <div style="display:flex; flex-direction:column; gap:0.4rem;">
            <label style="font-weight:700; cursor:pointer;">
              <input type="checkbox" ${s.rbxChecks.toolbox ? 'checked' : ''} onchange="window.Simulators.rbxToggleCheck('toolbox', '${cid}')">
              1. 已檢查 Toolbox 免費模型，確認沒有可疑的未知 Script
            </label>
            <label style="font-weight:700; cursor:pointer;">
              <input type="checkbox" ${s.rbxChecks.playtest ? 'checked' : ''} onchange="window.Simulators.rbxToggleCheck('playtest', '${cid}')">
              2. 已按 Play 親自試玩過關，確認所有平台都有開 Anchored
            </label>
            <label style="font-weight:700; cursor:pointer;">
              <input type="checkbox" ${s.rbxChecks.privacy ? 'checked' : ''} onchange="window.Simulators.rbxToggleCheck('privacy', '${cid}')">
              3. 新手測試先設為 Private（私人）或 Friends（只限好友）安全分享
            </label>
          </div>
          ${allChecks ? `
            <div style="margin-top:0.6rem; font-weight:900; color:#059669;">
              🏆 恭喜通過所有安全檢查！你已具備 Roblox 3D 遊戲建築師實力！
            </div>
          ` : ''}
        </div>
      </div>
    `;
  },

  rbxSelectGenre(genre, cid) {
    this.state.rbxGenre = genre;
    this.state.rbxGenreSimDone = false;
    this.render({ type: 'roblox-game-architect' }, cid);
  },

  rbxToggleModule(idx, cid) {
    const key = `${this.state.rbxGenre}-${idx}`;
    this.state.rbxGenreModules[key] = !this.state.rbxGenreModules[key];
    this.render({ type: 'roblox-game-architect' }, cid);
  },

  rbxRunGenreSim(cid) {
    this.state.rbxGenreSimDone = true;
    this.render({ type: 'roblox-game-architect' }, cid);
  },

  rbxToggleCheck(field, cid) {
    this.state.rbxChecks[field] = !this.state.rbxChecks[field];
    this.render({ type: 'roblox-game-architect' }, cid);
  }
};
