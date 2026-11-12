/**
 * ============================================================================
 * 🎮 INTERACTIVE SIMULATORS ENGINE (js/simulators.js)
 * ============================================================================
 * Renders rich hands-on practice labs for World 1, World 2, and World 3:
 * - win11-power: Desktop hazard removal & Windows 11 Start Menu -> Shut down
 * - win11-window: Right-click secret menu, Maximize, and Snap Left/Right
 * - typing-dojo: Embedded 19-stage ASUS Zhuyin + English Typing Dojo
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
    imgRendered: true
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
      case 'ai-prompt-builder':
        return this.renderAiPromptBuilder(el, containerId);
      case 'ai-skill-coach':
        return this.renderAiSkillCoach(el, containerId);
      case 'ai-image-studio':
        return this.renderAiImageStudio(el, containerId);
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
        title: '🚨 彈出視窗 2：「逼逼！警告！你的 ASUS 電腦發現 29 個嚴重病毒！請在 60 秒內點擊下載 SuperClean.exe 修復！」',
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
  }
};
