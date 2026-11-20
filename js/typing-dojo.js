/**
 * ============================================================================
 * 🎹 TYPING DOJO ENGINE (js/typing-dojo.js)
 * ============================================================================
 * Renders the interactive Windows 11 Keyboard with both English letters
 * and Traditional Chinese Zhuyin (注音符號), color-coded finger guides,
 * 2D SVG Left & Right Virtual Hands (TypingClub style), Direct-Focus Stage
 * with Smooth Caret & Combo Streak (Monkeytype style), Multi-Key Zhuyin
 * Syllable Step Badges (BopoType style), Web Audio Key Clicks & Live Key
 * Flash, Stage Clear 1-3 Star Result Card with Weak-Key Heatmap (Keybr style),
 * and the "🌧️ 注音/英打流星雨 (Typing Meteor Shower)" Mini-Game!
 *
 * IME & SANDBOX COMPATIBILITY:
 * In-place DOM updates on typing keystrokes without re-rendering container.innerHTML,
 * preserving input focus, selection, and IME composition (Microsoft Bopomofo).
 * ============================================================================
 */

const CHAR_ZHUYIN_MAP = {
  '你': 'ㄋㄧˇ', '好': 'ㄏㄠˇ', '謝': 'ㄒㄧㄝˋ', '台': 'ㄊㄞˊ', '灣': 'ㄨㄢ ',
  '電': 'ㄉㄧㄢˋ', '腦': 'ㄋㄠˇ', '小': 'ㄒㄧㄠˇ', '達': 'ㄉㄚˊ', '人': 'ㄖㄣˊ',
  '我': 'ㄨㄛˇ', '愛': 'ㄞˋ', '打': 'ㄉㄚˇ', '開': 'ㄎㄞ ', '的': 'ㄉㄜ˙',
  '筆': 'ㄅㄧˇ', '超': 'ㄔㄠ ', '酷': 'ㄎㄨˋ', '今': 'ㄐㄧㄣ ', '天': 'ㄊㄧㄢ ',
  '氣': 'ㄑㄧˋ', '真': 'ㄓㄣ ', '練': 'ㄌㄧㄢˋ', '習': 'ㄒㄧˊ', '字': 'ㄗˋ',
  '準': 'ㄓㄨㄣˇ', '備': 'ㄅㄟˋ', '探': 'ㄊㄢˋ', '索': 'ㄙㄨㄛˇ', '世': 'ㄕˋ',
  '界': 'ㄐㄧㄝˋ'
};

window.TypingDojo = {
  currentCategoryId: 'home-row',
  currentDrillId: 'hr-1',
  dojoMode: 'drill', // 'drill' | 'meteor'
  typedText: '',
  startTime: null,
  isCompleted: false,
  isComposing: false, // Track IME composition
  comboStreak: 0,
  maxStreak: 0,
  missedKeys: {}, // { 'f': 2, 'j': 1 }
  lastFlashKey: null,
  lastFlashOk: true,
  lastCompletedStats: null, // { cpm, accuracy, stars, targetCpm }

  // Meteor Mini-Game State
  meteorRunning: false,
  meteorScore: 0,
  meteorLives: 3,
  meteorItems: [], // [{ id, key, zhuyin, x, y, speed }]
  meteorTimerId: null,
  meteorContainerId: null,

  getFingerColor(fingerCode) {
    const map = {
      L5: '#ef4444',
      L4: '#f97316',
      L3: '#eab308',
      L2: '#10b981',
      R2: '#06b6d4',
      R3: '#3b82f6',
      R4: '#ec4899',
      R5: '#14b8a6',
      THUMB: '#64748b'
    };
    return map[fingerCode] || '#64748b';
  },

  findDrill(drillId) {
    for (const cat of window.TYPING_DATA.categories) {
      for (const d of cat.drills) {
        if (d.id === drillId) return { category: cat, drill: d };
      }
    }
    const firstCat = window.TYPING_DATA.categories[0];
    return { category: firstCat, drill: firstCat.drills[0] };
  },

  findKeyInfo(char) {
    if (!char) return null;
    if (char === ' ') {
      return { key: ' ', zhuyin: '一聲 / 空白鍵', finger: 'THUMB', hand: '雙手大拇指 (空白鍵 Space)' };
    }
    const lower = char.toLowerCase();
    for (const row of window.TYPING_DATA.keyboardLayout) {
      for (const k of row) {
        if (k.key === lower) return k;
      }
    }
    return null;
  },

  findKeyByZhuyin(zySymbol) {
    if (!zySymbol) return null;
    if (zySymbol === ' ') {
      return { key: ' ', zhuyin: '一聲(Space)', finger: 'THUMB', hand: '雙手大拇指 (空白鍵 Space)' };
    }
    for (const row of window.TYPING_DATA.keyboardLayout) {
      for (const k of row) {
        if (k.zhuyin === zySymbol) return k;
      }
    }
    return null;
  },

  getZhuyinSequenceForChar(char, drill) {
    if (!char || char === ' ') return [];
    let zyStr = CHAR_ZHUYIN_MAP[char] || '';
    if (!zyStr && drill && Array.isArray(drill.zhuyinBreakdown)) {
      for (const item of drill.zhuyinBreakdown) {
        if (item.char && item.char.includes(char)) {
          const idx = item.char.indexOf(char);
          const pyParts = String(item.py || '').split(/\s+/);
          if (pyParts[idx]) {
            zyStr = pyParts[idx].replace(/\([^)]*\)/g, '');
          }
          break;
        }
      }
    }
    if (!zyStr) return [];
    const steps = [];
    for (const ch of zyStr) {
      const kInfo = this.findKeyByZhuyin(ch);
      if (kInfo) {
        steps.push({
          step: steps.length + 1,
          key: kInfo.key,
          zhuyin: ch === ' ' ? 'ˉ(空白鍵)' : ch,
          finger: kInfo.finger,
          hand: kInfo.hand
        });
      }
    }
    return steps;
  },

  playKeyAudio(isCorrect = true) {
    if (window.AppState && window.AppState.soundEnabled === false) return;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    try {
      if (!this._audioCtx) this._audioCtx = new AudioCtx();
      const ctx = this._audioCtx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = isCorrect ? 'triangle' : 'sawtooth';
      osc.frequency.setValueAtTime(isCorrect ? 520 : 190, ctx.currentTime);
      if (isCorrect) {
        osc.frequency.exponentialRampToValueAtTime(760, ctx.currentTime + 0.045);
      }
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (isCorrect ? 0.05 : 0.09));
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + (isCorrect ? 0.055 : 0.095));
    } catch (e) {
      // Ignore AudioContext restrictions in headless/sandbox environments
    }
  },

  focusInput(containerId) {
    const inputEl = document.getElementById(`${containerId}-input`);
    if (inputEl) {
      inputEl.focus();
      const len = inputEl.value.length;
      if (typeof inputEl.setSelectionRange === 'function') {
        inputEl.setSelectionRange(len, len);
      }
    }
  },

  setDojoMode(mode, containerId) {
    this.stopMeteorGame();
    this.dojoMode = mode === 'meteor' ? 'meteor' : 'drill';
    this.render(containerId);
  },

  render(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const { category, drill } = this.findDrill(this.currentDrillId);
    this.currentCategoryId = category.id;
    const completedDrills = window.AppState ? window.AppState.getCompletedDrills() : {};

    const nextExpectedChar = drill.text[this.typedText.length] || '';
    const zhuyinSeq = drill.mode === 'chinese-real'
      ? this.getZhuyinSequenceForChar(nextExpectedChar, drill)
      : [];
    const keyInfo = this.findKeyInfo(nextExpectedChar) || (zhuyinSeq[0] ? this.findKeyInfo(zhuyinSeq[0].key) : null);
    const customHint = drill.keyHintMap && drill.keyHintMap[nextExpectedChar.toLowerCase()]
      ? `請按【 ${drill.keyHintMap[nextExpectedChar.toLowerCase()]} 】`
      : '';

    // Build character spans
    let charsHtml = '';
    for (let i = 0; i < drill.text.length; i++) {
      const targetChar = drill.text[i];
      const displayChar = targetChar === ' ' ? '␣' : targetChar;
      let cls = 't-char';
      if (i < this.typedText.length) {
        cls += this.typedText[i] === targetChar ? ' correct' : ' wrong';
      } else if (i === this.typedText.length) {
        cls += ' current';
      }
      charsHtml += `<span class="${cls}">${displayChar}</span>`;
    }

    // Calculate live WPM & Accuracy
    let accuracy = 100;
    if (this.typedText.length > 0) {
      let correctCount = 0;
      for (let i = 0; i < this.typedText.length; i++) {
        if (this.typedText[i] === drill.text[i]) correctCount++;
      }
      accuracy = Math.round((correctCount / this.typedText.length) * 100);
    }

    let cpm = 0;
    if (this.startTime && this.typedText.length > 1) {
      const elapsedMin = Math.max((Date.now() - this.startTime) / 60000, 0.05);
      cpm = Math.round(this.typedText.length / elapsedMin);
    }

    const isSimple = window.AppState && window.AppState.isSimpleMode ? window.AppState.isSimpleMode() : false;
    const targetCpm = Math.round((drill.targetCpm || 40) * (isSimple ? 0.75 : 1));

    container.innerHTML = `
      <div class="dojo-wrapper">
        <!-- Mode Switcher: Lesson Drills vs Meteor Shower Mini-Game -->
        <div class="dojo-mode-bar">
          <div class="dojo-mode-tabs" role="tablist" aria-label="打字訓練模式切換">
            <button class="dojo-mode-btn ${this.dojoMode === 'drill' ? 'active' : ''}"
                    type="button"
                    onclick="window.TypingDojo.setDojoMode('drill', '${containerId}')">
              📖 闖關盲打練習 (Lesson Drills)
            </button>
            <button class="dojo-mode-btn ${this.dojoMode === 'meteor' ? 'active' : ''}"
                    type="button"
                    onclick="window.TypingDojo.setDojoMode('meteor', '${containerId}')">
              🌧️ 流星雨小遊戲 (Meteor Game)
            </button>
          </div>
          <div class="dojo-hud-pills">
            <span class="dojo-streak-pill ${this.comboStreak >= 5 ? 'hot' : ''}" id="${containerId}-streak">
              🔥 連擊 x${this.comboStreak}
            </span>
            <span class="dojo-target-pill">
              🎯 目標：${targetCpm} 字/分
            </span>
          </div>
        </div>

        <!-- Category Tabs -->
        <div class="dojo-cat-tabs">
          ${window.TYPING_DATA.categories.map(cat => `
            <button class="step-tab ${cat.id === category.id ? 'active' : ''}"
                    onclick="window.TypingDojo.selectCategory('${cat.id}', '${containerId}')">
              ${cat.badge} ${cat.title.split('(')[0]}
            </button>
          `).join('')}
        </div>

        ${this.dojoMode === 'meteor' ? this.renderMeteorGameHtml(containerId, category) : `
        <!-- Drill Selector within Category -->
        <div class="drill-selector-grid" id="${containerId}-drill-grid">
          ${category.drills.map(d => {
            const comp = completedDrills[d.id];
            const isDone = !!comp;
            const stars = (comp && comp.stars) ? '⭐'.repeat(comp.stars) : (isDone ? '⭐⭐⭐' : '⚪');
            const isActive = d.id === drill.id;
            return `
              <button class="drill-btn ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}"
                      onclick="window.TypingDojo.selectDrill('${d.id}', '${containerId}')">
                <div class="drill-btn-row">
                  <span>${d.name}</span>
                  <span>${stars}</span>
                </div>
              </button>
            `;
          }).join('')}
        </div>

        <!-- Target Display Area (Monkeytype Direct-Focus Stage) -->
        <div class="typing-target-box" onclick="window.TypingDojo.focusInput('${containerId}')">
          <div class="typing-tip-bar">
            <span>💡 <strong>本關秘訣：</strong>${drill.tip}</span>
            <span id="${containerId}-stats" class="dojo-stats-pill">
              速度：${cpm} 字/分 ｜ 準確度：${accuracy}%
            </span>
          </div>

          ${drill.zhuyinDisplay ? `
            <div class="dojo-zhuyin-target">
              🇹🇼 對應注音目標：${drill.zhuyinDisplay}
            </div>
          ` : ''}

          ${drill.zhuyinBreakdown ? `
            <div class="dojo-breakdown-row">
              ${drill.zhuyinBreakdown.map(item => `
                <div class="dojo-breakdown-chip">
                  <strong class="dojo-breakdown-char">${item.char}</strong>
                  <span class="dojo-breakdown-py">${item.py}</span>
                </div>
              `).join('')}
            </div>
          ` : ''}

          <div id="${containerId}-zy-steps" class="dojo-zy-step-bar">
            ${this.renderZhuyinStepPillsHtml(nextExpectedChar, zhuyinSeq)}
          </div>

          <div class="typing-chars-display" id="${containerId}-chars" title="點擊此處直接開始打字">
            ${charsHtml}
          </div>

          <div class="dojo-input-row ${drill.mode === 'chinese-real' ? 'ime-mode' : 'direct-mode'}">
            <input type="text"
                   id="${containerId}-input"
                   class="typing-input-field"
                   value="${this.escapeHtml(this.typedText)}"
                   placeholder="${drill.mode === 'chinese-real' ? '請切換成「中 (微軟注音)」在這裡打字...' : '直接按鍵盤開始打字！(請確認右下角為「英」模式)'}"
                   autocomplete="off"
                   autocorrect="off"
                   autocapitalize="off"
                   spellcheck="false" />
          </div>

          <div class="dojo-hint-bar">
            <div id="${containerId}-key-hint" class="dojo-key-hint">
              ${this.formatKeyHintText(nextExpectedChar, keyInfo, customHint, zhuyinSeq)}
            </div>
            <div class="flex-row-gap-sm">
              <button class="btn-secondary btn-compact"
                      onclick="window.TypingDojo.resetDrill('${containerId}')">
                🔄 重新練習本關
              </button>
              <button class="btn-primary btn-compact"
                      onclick="window.TypingDojo.nextDrill('${containerId}')">
                ⏭️ 下一關
              </button>
            </div>
          </div>

          <div id="${containerId}-result-card">
            ${this.isCompleted ? this.renderResultCardHtml(containerId, drill) : ''}
          </div>
        </div>

        <!-- Visual Taiwan Keyboard + 2D SVG Virtual Hands (TypingClub style) -->
        <div class="taiwan-keyboard" id="${containerId}-keyboard">
          ${this.renderKeyboardHtml(nextExpectedChar, zhuyinSeq)}
        </div>
        `}

        ${this.renderHistoryChart()}
      </div>
    `;

    const inputEl = document.getElementById(`${containerId}-input`);
    if (inputEl) {
      inputEl.focus();
      const len = inputEl.value.length;
      inputEl.setSelectionRange(len, len);

      inputEl.addEventListener('compositionstart', () => {
        this.isComposing = true;
      });

      inputEl.addEventListener('compositionend', (e) => {
        this.isComposing = false;
        this.handleTypingInput(e.target.value, containerId);
      });

      inputEl.addEventListener('input', (e) => {
        if (this.isComposing) return;
        this.handleTypingInput(e.target.value, containerId);
      });

      inputEl.addEventListener('keydown', (e) => {
        if (this.isCompleted && e.key === 'Enter') {
          e.preventDefault();
          this.nextDrill(containerId);
          return;
        }
        if (e.key && e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
          const { drill: curDrill } = this.findDrill(this.currentDrillId);
          const expected = curDrill.text[this.typedText.length] || '';
          const seq = curDrill.mode === 'chinese-real' ? this.getZhuyinSequenceForChar(expected, curDrill) : [];
          const pressedLower = e.key.toLowerCase();
          const isMatch = (expected && expected.toLowerCase() === pressedLower) ||
            seq.some(s => s.key === pressedLower);
          this.lastFlashKey = pressedLower;
          this.lastFlashOk = isMatch;
          this.playKeyAudio(isMatch);
        }
      });
    }
  },

  formatKeyHintText(nextExpectedChar, keyInfo, customHint, zhuyinSeq = []) {
    if (this.isCompleted) {
      return '🎉 太棒了！你成功完成這一關！按 Enter 或點右邊按鈕進入下一關！';
    }
    if (zhuyinSeq && zhuyinSeq.length > 0) {
      const stepsText = zhuyinSeq.map(s => `${s.step}. ${s.zhuyin}(${s.key.toUpperCase()})`).join(' ➔ ');
      return `👉 正在拼「${nextExpectedChar}」：【 ${stepsText} 】— 第一鍵請用「${zhuyinSeq[0].hand}」`;
    }
    if (keyInfo) {
      return `👉 下一個按鍵：【 ${nextExpectedChar === ' ' ? '空白鍵 Space' : nextExpectedChar.toUpperCase()} / 注音 ${keyInfo.zhuyin} 】— 請用「${keyInfo.hand}」${customHint}`;
    }
    return '👉 請照著上方藍底游標的文字輸入！';
  },

  renderZhuyinStepPillsHtml(nextExpectedChar, zhuyinSeq = []) {
    if (!zhuyinSeq || zhuyinSeq.length === 0) return '';
    const badgeNums = ['①', '②', '③', '④', '⑤'];
    return `
      <div class="dojo-zy-steps-inner" aria-label="注音拆解按鍵步驟">
        <span class="dojo-zy-steps-label">🇹🇼 「${this.escapeHtml(nextExpectedChar)}」注音按鍵順序：</span>
        ${zhuyinSeq.map((s, idx) => `
          <span class="dojo-zy-step-pill" style="border-color:${this.getFingerColor(s.finger)};">
            <span class="zy-step-num">${badgeNums[idx] || s.step}</span>
            <strong>${s.zhuyin}</strong>
            <code>${s.key === ' ' ? 'Space' : s.key.toUpperCase()}</code>
          </span>
        `).join('<span class="zy-step-arrow">➔</span>')}
      </div>
    `;
  },

  renderResultCardHtml(containerId, drill) {
    const stats = this.lastCompletedStats || { cpm: 30, accuracy: 100, stars: 3, targetCpm: 30 };
    const starIcons = '⭐'.repeat(stats.stars) + '☆'.repeat(Math.max(0, 3 - stats.stars));
    const missedEntries = Object.entries(this.missedKeys || {}).filter(([, cnt]) => cnt > 0);
    const weakText = missedEntries.length > 0
      ? missedEntries.map(([k, cnt]) => `<span class="weak-key-chip">${k === ' ' ? 'Space' : k.toUpperCase()} (${cnt}次)</span>`).join(' ')
      : '<span class="weak-key-perfect">✨ 零失誤完美手指！所有按鍵都超穩！</span>';

    return `
      <div class="dojo-result-card" role="status" aria-live="polite">
        <div class="dojo-result-header">
          <div class="dojo-result-stars">${starIcons}</div>
          <div>
            <div class="dojo-result-title">🎉 恭喜過關！${this.escapeHtml(drill.name)}</div>
            <div class="dojo-result-sub">速度 <strong>${stats.cpm}</strong> 字/分（目標 ${stats.targetCpm}）｜ 準確度 <strong>${stats.accuracy}%</strong> ｜ 最高連擊 <strong>🔥 x${this.maxStreak}</strong></div>
          </div>
        </div>
        <div class="dojo-result-weak">
          <strong>🔍 按鍵熱點分析：</strong>${weakText}
        </div>
      </div>
    `;
  },

  handleTypingInput(val, containerId) {
    const { drill } = this.findDrill(this.currentDrillId);

    if (!this.startTime && val.length > 0) {
      this.startTime = Date.now();
    }

    // Track combo streak & missed keys on newly typed character
    if (val.length > this.typedText.length) {
      const idx = val.length - 1;
      const typedChar = val[idx];
      const expectedChar = drill.text[idx];
      if (expectedChar !== undefined) {
        if (typedChar === expectedChar) {
          this.comboStreak++;
          if (this.comboStreak > this.maxStreak) this.maxStreak = this.comboStreak;
          this.lastFlashKey = expectedChar.toLowerCase();
          this.lastFlashOk = true;
        } else {
          this.comboStreak = 0;
          const kKey = expectedChar.toLowerCase();
          this.missedKeys[kKey] = (this.missedKeys[kKey] || 0) + 1;
          this.lastFlashKey = (typedChar || '').toLowerCase();
          this.lastFlashOk = false;
        }
      }
    }
    this.typedText = val;

    // Check completion
    const wasCompleted = this.isCompleted;
    if (this.typedText === drill.text || (this.typedText.length >= drill.text.length && this.typedText.trim() === drill.text.trim())) {
      this.isCompleted = true;
      let accuracy = 100;
      let correctCount = 0;
      for (let i = 0; i < this.typedText.length; i++) {
        if (this.typedText[i] === drill.text[i]) correctCount++;
      }
      accuracy = Math.round((correctCount / Math.max(1, this.typedText.length)) * 100);
      const elapsedMin = Math.max((Date.now() - (this.startTime || Date.now())) / 60000, 0.05);
      const cpm = Math.round(this.typedText.length / elapsedMin) || 25;
      const isSimple = window.AppState && window.AppState.isSimpleMode ? window.AppState.isSimpleMode() : false;
      const targetCpm = Math.round((drill.targetCpm || 40) * (isSimple ? 0.75 : 1));
      const stars = (accuracy >= 95 && cpm >= targetCpm * 0.8) ? 3 : (accuracy >= 85 ? 2 : 1);
      this.lastCompletedStats = { cpm, accuracy, stars, targetCpm };

      if (!wasCompleted && window.AppState) {
        window.AppState.completeDrill(drill.id, cpm, accuracy);
        const p = window.AppState.getProfile();
        if (p && p.completedDrills && p.completedDrills[drill.id]) {
          p.completedDrills[drill.id].stars = Math.max(stars, p.completedDrills[drill.id].stars || 0);
        }
        if (window.UIModal && window.UIModal.toast) {
          window.UIModal.toast(`🎉 通關成功！${drill.name} — 速度 ${cpm} 字/分 ｜ 準確度 ${accuracy}% (${'⭐'.repeat(stars)})`);
        }
      }
    }

    // Update in-place without destroying the input element
    this.updateLiveDojoDisplay(containerId);
  },

  updateLiveDojoDisplay(containerId) {
    const { drill } = this.findDrill(this.currentDrillId);
    const charsContainer = document.getElementById(`${containerId}-chars`);
    const statsEl = document.getElementById(`${containerId}-stats`);
    const streakEl = document.getElementById(`${containerId}-streak`);
    const hintEl = document.getElementById(`${containerId}-key-hint`);
    const zyStepsEl = document.getElementById(`${containerId}-zy-steps`);
    const resultEl = document.getElementById(`${containerId}-result-card`);
    const keyboardEl = document.getElementById(`${containerId}-keyboard`);

    const nextExpectedChar = drill.text[this.typedText.length] || '';
    const zhuyinSeq = drill.mode === 'chinese-real'
      ? this.getZhuyinSequenceForChar(nextExpectedChar, drill)
      : [];
    const keyInfo = this.findKeyInfo(nextExpectedChar) || (zhuyinSeq[0] ? this.findKeyInfo(zhuyinSeq[0].key) : null);
    const customHint = drill.keyHintMap && drill.keyHintMap[nextExpectedChar.toLowerCase()]
      ? `請按【 ${drill.keyHintMap[nextExpectedChar.toLowerCase()]} 】`
      : '';

    // Update character highlights
    if (charsContainer) {
      let charsHtml = '';
      for (let i = 0; i < drill.text.length; i++) {
        const targetChar = drill.text[i];
        const displayChar = targetChar === ' ' ? '␣' : targetChar;
        let cls = 't-char';
        if (i < this.typedText.length) {
          cls += this.typedText[i] === targetChar ? ' correct' : ' wrong';
        } else if (i === this.typedText.length) {
          cls += ' current';
        }
        charsHtml += `<span class="${cls}">${displayChar}</span>`;
      }
      charsContainer.innerHTML = charsHtml;
    }

    // Calculate live WPM & Accuracy
    let accuracy = 100;
    if (this.typedText.length > 0) {
      let correctCount = 0;
      for (let i = 0; i < this.typedText.length; i++) {
        if (this.typedText[i] === drill.text[i]) correctCount++;
      }
      accuracy = Math.round((correctCount / this.typedText.length) * 100);
    }

    let cpm = 0;
    if (this.startTime && this.typedText.length > 1) {
      const elapsedMin = Math.max((Date.now() - this.startTime) / 60000, 0.05);
      cpm = Math.round(this.typedText.length / elapsedMin);
    }

    if (statsEl) {
      statsEl.textContent = `速度：${cpm} 字/分 ｜ 準確度：${accuracy}%`;
    }

    if (streakEl) {
      streakEl.textContent = `🔥 連擊 x${this.comboStreak}`;
      streakEl.classList.toggle('hot', this.comboStreak >= 5);
    }

    if (zyStepsEl) {
      zyStepsEl.innerHTML = this.renderZhuyinStepPillsHtml(nextExpectedChar, zhuyinSeq);
    }

    if (hintEl) {
      hintEl.textContent = this.formatKeyHintText(nextExpectedChar, keyInfo, customHint, zhuyinSeq);
    }

    if (resultEl) {
      resultEl.innerHTML = this.isCompleted ? this.renderResultCardHtml(containerId, drill) : '';
    }

    // Update keyboard target highlight & virtual SVG hands
    if (keyboardEl) {
      keyboardEl.innerHTML = this.renderKeyboardHtml(nextExpectedChar, zhuyinSeq);
    }

    // Update drill selector done status in grid if completed
    if (this.isCompleted) {
      const grid = document.getElementById(`${containerId}-drill-grid`);
      if (grid) {
        const completedDrills = window.AppState ? window.AppState.getCompletedDrills() : {};
        const { category } = this.findDrill(this.currentDrillId);
        grid.innerHTML = category.drills.map(d => {
          const comp = completedDrills[d.id];
          const isDone = !!comp || d.id === drill.id;
          const stars = (comp && comp.stars) ? '⭐'.repeat(comp.stars) : (isDone ? '⭐⭐⭐' : '⚪');
          const isActive = d.id === drill.id;
          return `
            <button class="drill-btn ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}"
                    onclick="window.TypingDojo.selectDrill('${d.id}', '${containerId}')">
              <div class="drill-btn-row">
                <span>${d.name}</span>
                <span>${stars}</span>
              </div>
            </button>
          `;
        }).join('');
      }
    }
  },

  renderKeyboardHtml(nextExpectedChar, zhuyinSeq = []) {
    const seqMap = {};
    if (Array.isArray(zhuyinSeq)) {
      zhuyinSeq.forEach((s) => {
        if (!seqMap[s.key]) seqMap[s.key] = s.step;
      });
    }
    const primaryKeyInfo = this.findKeyInfo(nextExpectedChar) || (zhuyinSeq[0] ? this.findKeyInfo(zhuyinSeq[0].key) : null);
    const activeFinger = primaryKeyInfo ? primaryKeyInfo.finger : null;
    const badgeNums = ['', '①', '②', '③', '④', '⑤'];

    return `
      <div class="kb-guide-caption">
        💻 台灣注音雙語鍵盤導引（黃色發光鍵 ＝ 下一個要按的鍵；F 與 J 底下有藍色定位凸點！）
      </div>
      ${window.TYPING_DATA.keyboardLayout.map((row, rIdx) => `
        <div class="kb-row" style="padding-left:${rIdx * 14}px;">
          ${rIdx === 3 ? `<div class="kb-key kb-key-wide kb-key-shift">Shift (切換中/英)</div>` : ''}
          ${row.map(k => {
            const zyStep = seqMap[k.key] || 0;
            const isTarget = (nextExpectedChar && nextExpectedChar.toLowerCase() === k.key) || zyStep > 0;
            const isFlashed = this.lastFlashKey === k.key;
            const flashClass = isFlashed ? (this.lastFlashOk ? 'pressed-correct' : 'pressed-wrong') : '';
            const missedCount = (this.missedKeys && this.missedKeys[k.key]) || 0;
            const weakClass = missedCount > 0 ? 'weak-key' : '';
            const fColor = this.getFingerColor(k.finger);
            return `
              <div class="kb-key ${k.home ? 'home-key' : ''} ${k.bump ? 'bump-key' : ''} ${isTarget ? 'highlight-target' : ''} ${flashClass} ${weakClass}"
                   style="border-bottom: 4px solid ${fColor};"
                   data-key="${k.key}">
                ${zyStep > 0 ? `<span class="kb-step-badge">${badgeNums[zyStep] || zyStep}</span>` : ''}
                <div class="kb-key-top">
                  <span>${k.key.toUpperCase()}</span>
                  <span class="kb-key-sub">${k.sub || ''}</span>
                </div>
                <div class="kb-key-zy">${k.zhuyin}</div>
              </div>
            `;
          }).join('')}
          ${rIdx === 2 ? `<div class="kb-key kb-key-wide kb-key-enter">Enter ↵ (確認)</div>` : ''}
          ${rIdx === 3 ? `<div class="kb-key kb-key-wide kb-key-shift">Shift (中/英)</div>` : ''}
        </div>
      `).join('')}
      <div class="kb-row">
        <div class="kb-key kb-key-wide kb-key-mod">Ctrl</div>
        <div class="kb-key kb-key-wide kb-key-mod">Win ⊞</div>
        <div class="kb-key kb-key-wide kb-key-mod">Alt</div>
        <div class="kb-key kb-key-space ${(nextExpectedChar === ' ' || seqMap[' ']) ? 'highlight-target' : ''}">
          ${seqMap[' '] ? `<span class="kb-step-badge">${badgeNums[seqMap[' ']] || seqMap[' ']}</span>` : ''}
          <span>Space 空白鍵（大拇指 / 注音一聲）</span>
        </div>
        <div class="kb-key kb-key-wide kb-key-arrow">↓ 選字方向鍵</div>
      </div>

      <!-- 2D SVG Virtual Left & Right Hands (TypingClub style) -->
      ${this.renderVirtualHandsSvg(activeFinger, primaryKeyInfo)}

      <!-- Finger Color Legend -->
      <div class="finger-legend">
        <span class="finger-badge ${activeFinger === 'L5' ? 'active-finger-badge' : ''}" style="background:var(--finger-L5)">左手小指 (A/Q/Z/1)</span>
        <span class="finger-badge ${activeFinger === 'L4' ? 'active-finger-badge' : ''}" style="background:var(--finger-L4)">左手無名指 (S/W/X/2)</span>
        <span class="finger-badge ${activeFinger === 'L3' ? 'active-finger-badge' : ''}" style="background:var(--finger-L3)">左手中指 (D/E/C/3)</span>
        <span class="finger-badge ${activeFinger === 'L2' ? 'active-finger-badge' : ''}" style="background:var(--finger-L2)">左手食指 (F凸點/G/R/T/V/B)</span>
        <span class="finger-badge ${activeFinger === 'R2' ? 'active-finger-badge' : ''}" style="background:var(--finger-R2)">右手食指 (J凸點/H/Y/U/N/M)</span>
        <span class="finger-badge ${activeFinger === 'R3' ? 'active-finger-badge' : ''}" style="background:var(--finger-R3)">右手中指 (K/I/8/,)</span>
        <span class="finger-badge ${activeFinger === 'R4' ? 'active-finger-badge' : ''}" style="background:var(--finger-R4)">右手無名指 (L/O/9/.)</span>
        <span class="finger-badge ${activeFinger === 'R5' ? 'active-finger-badge' : ''}" style="background:var(--finger-R5)">右手小指 (;/P/0//)</span>
      </div>
    `;
  },

  renderVirtualHandsSvg(activeFinger, keyInfo) {
    const fingers = [
      // Left Hand (L5..L2 + L_THUMB)
      { code: 'L5', label: '左小指', home: 'A', x: 34, y: 42, h: 52, color: '#ef4444', side: 'left' },
      { code: 'L4', label: '左無名指', home: 'S', x: 64, y: 26, h: 68, color: '#f97316', side: 'left' },
      { code: 'L3', label: '左中指', home: 'D', x: 94, y: 18, h: 76, color: '#eab308', side: 'left' },
      { code: 'L2', label: '左食指', home: 'F•', x: 124, y: 28, h: 66, color: '#10b981', side: 'left', bump: true },
      { code: 'THUMB', label: '左拇指', home: 'Space', x: 156, y: 66, h: 44, color: '#64748b', side: 'left' },
      // Right Hand (R_THUMB + R2..R5)
      { code: 'THUMB', label: '右拇指', home: 'Space', x: 256, y: 66, h: 44, color: '#64748b', side: 'right' },
      { code: 'R2', label: '右食指', home: 'J•', x: 288, y: 28, h: 66, color: '#06b6d4', side: 'right', bump: true },
      { code: 'R3', label: '右中指', home: 'K', x: 318, y: 18, h: 76, color: '#3b82f6', side: 'right' },
      { code: 'R4', label: '右無名指', home: 'L', x: 348, y: 26, h: 68, color: '#ec4899', side: 'right' },
      { code: 'R5', label: '右小指', home: ';', x: 378, y: 42, h: 52, color: '#14b8a6', side: 'right' }
    ];

    const activeCallout = keyInfo
      ? `🖐️ 請動動【 ${keyInfo.hand} 】按下「${keyInfo.key === ' ' ? 'Space 空白鍵' : keyInfo.key.toUpperCase() + ' / ' + keyInfo.zhuyin}」`
      : '🖐️ 雙手輕放在基準鍵 A S D F 與 J K L ; 上';

    return `
      <div class="dojo-hands-panel" aria-label="雙手指法視覺導引">
        <div class="dojo-hands-callout">${activeCallout}</div>
        <svg class="dojo-hands-svg" viewBox="0 0 434 155" role="img" aria-label="左右手十指鍵盤位置圖">
          <!-- Left & Right Palms -->
          <rect x="30" y="88" width="122" height="54" rx="26" class="hand-palm" />
          <rect x="284" y="88" width="122" height="54" rx="26" class="hand-palm" />
          <text x="91" y="121" text-anchor="middle" class="hand-palm-label">左手 Left</text>
          <text x="345" y="121" text-anchor="middle" class="hand-palm-label">右手 Right</text>

          ${fingers.map((f, idx) => {
            const isActive = activeFinger && f.code === activeFinger;
            const yPos = isActive ? Math.max(4, f.y - 10) : f.y;
            return `
              <g class="svg-finger ${isActive ? 'is-active' : ''}" data-finger="${f.code}" data-idx="${idx}">
                ${isActive ? `<circle cx="${f.x + 11}" cy="${yPos + 10}" r="18" fill="${f.color}" opacity="0.28" class="finger-pulse-ring" />` : ''}
                <rect x="${f.x}" y="${yPos}" width="22" height="${f.h}" rx="11"
                      fill="${f.color}"
                      opacity="${isActive ? '1' : '0.45'}"
                      stroke="${isActive ? '#0f172a' : '#ffffff'}"
                      stroke-width="${isActive ? '3' : '1.5'}" />
                <text x="${f.x + 11}" y="${yPos + 16}" text-anchor="middle" class="finger-home-text">${f.home}</text>
              </g>
            `;
          }).join('')}
        </svg>
      </div>
    `;
  },

  // ==========================================================================
  // FEATURE 6: TYPING METEOR SHOWER MINI-GAME (🌧️ 注音/英打流星雨)
  // ==========================================================================
  renderMeteorGameHtml(containerId, category) {
    const isSimple = window.AppState && window.AppState.isSimpleMode ? window.AppState.isSimpleMode() : false;
    return `
      <div class="meteor-game-panel" id="${containerId}-meteor-panel">
        <div class="meteor-hud">
          <div>
            <strong>🌧️ 流星雨挑戰：${category.title.split('(')[0]}</strong>
            <span class="meteor-sub">（按下流星上的英文字母或注音對應鍵就能發射雷射擊落它！）</span>
          </div>
          <div class="meteor-stats">
            <span id="${containerId}-meteor-score" class="meteor-score-pill">🏆 分數：${this.meteorScore}</span>
            <span id="${containerId}-meteor-lives" class="meteor-lives-pill">❤️ 生命：${'❤️'.repeat(Math.max(0, this.meteorLives)) || '💔'}</span>
            <button class="btn-primary btn-compact"
                    type="button"
                    onclick="window.TypingDojo.startMeteorGame('${containerId}')">
              ${this.meteorRunning ? '🔄 重新開始流星雨' : '🚀 開始流星雨挑戰'}
            </button>
          </div>
        </div>
        <div class="meteor-stage" id="${containerId}-meteor-stage" tabindex="0">
          ${this.meteorRunning ? this.renderMeteorItemsHtml() : `
            <div class="meteor-start-overlay">
              <div class="meteor-start-icon">☄️</div>
              <h3>準備好守護探險島了嗎？</h3>
              <p>${isSimple ? '🌟 8歲護航慢速模式已開啟！看準流星上的按鍵，按一下就得分！' : '流星會帶著本階段的英文字母與注音符號落下來，直接按鍵盤擊落它們！'}</p>
              <button class="btn-primary" type="button" onclick="window.TypingDojo.startMeteorGame('${containerId}')">
                🚀 立即發射開始！
              </button>
            </div>
          `}
        </div>
      </div>
    `;
  },

  renderMeteorItemsHtml() {
    if (!this.meteorItems || this.meteorItems.length === 0) return '';
    return this.meteorItems.map(item => `
      <div class="meteor-item" data-key="${item.key}" style="left:${item.x}%; top:${item.y}%; border-color:${this.getFingerColor(item.finger)};">
        <span class="meteor-key">${item.key.toUpperCase()}</span>
        <span class="meteor-zy">${item.zhuyin}</span>
      </div>
    `).join('');
  },

  getCategoryKeyPool(catId) {
    const cat = window.TYPING_DATA.categories.find(c => c.id === catId) || window.TYPING_DATA.categories[0];
    const chars = new Set();
    cat.drills.forEach(d => {
      for (const ch of (d.text || '')) {
        const lower = ch.toLowerCase();
        if (this.findKeyInfo(lower) && lower !== ' ') {
          chars.add(lower);
        }
      }
    });
    if (chars.size === 0) {
      ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'].forEach(k => chars.add(k));
    }
    return Array.from(chars);
  },

  startMeteorGame(containerId) {
    this.stopMeteorGame();
    this.dojoMode = 'meteor';
    this.meteorRunning = true;
    this.meteorScore = 0;
    this.meteorLives = 3;
    this.meteorItems = [];
    this.meteorContainerId = containerId;
    this.spawnMeteorItem();
    this.render(containerId);

    if (!this._meteorKeyBound) {
      this._meteorKeyBound = true;
      window.addEventListener('keydown', (e) => {
        if (this.dojoMode !== 'meteor' || !this.meteorRunning) return;
        if (!e.key || e.key.length !== 1) return;
        this.handleMeteorKey(e.key.toLowerCase());
      });
    }

    this.meteorTimerId = setInterval(() => {
      this.tickMeteorGame();
    }, 250);
  },

  stopMeteorGame() {
    if (this.meteorTimerId) {
      clearInterval(this.meteorTimerId);
      this.meteorTimerId = null;
    }
    this.meteorRunning = false;
  },

  spawnMeteorItem() {
    const pool = this.getCategoryKeyPool(this.currentCategoryId);
    const key = pool[Math.floor(Math.random() * pool.length)] || 'f';
    const info = this.findKeyInfo(key) || { key: 'f', zhuyin: 'ㄑ', finger: 'L2' };
    const isSimple = window.AppState && window.AppState.isSimpleMode ? window.AppState.isSimpleMode() : false;
    this.meteorItems.push({
      id: Date.now() + Math.random(),
      key: info.key,
      zhuyin: info.zhuyin,
      finger: info.finger,
      x: 12 + Math.floor(Math.random() * 74),
      y: 6,
      speed: isSimple ? 4 : 6
    });
  },

  handleMeteorKey(pressedKey) {
    if (!this.meteorRunning) return false;
    const idx = this.meteorItems.findIndex(m => m.key === pressedKey);
    if (idx !== -1) {
      this.meteorItems.splice(idx, 1);
      this.meteorScore += 10;
      this.playKeyAudio(true);
      if (this.meteorItems.length === 0) {
        this.spawnMeteorItem();
      }
      this.updateMeteorDom();
      return true;
    }
    this.playKeyAudio(false);
    return false;
  },

  tickMeteorGame() {
    if (!this.meteorRunning) return;
    for (let i = this.meteorItems.length - 1; i >= 0; i--) {
      this.meteorItems[i].y += this.meteorItems[i].speed;
      if (this.meteorItems[i].y >= 86) {
        this.meteorItems.splice(i, 1);
        this.meteorLives--;
      }
    }
    if (this.meteorLives <= 0) {
      this.stopMeteorGame();
      this.updateMeteorDom();
      return;
    }
    if (this.meteorItems.length < 3 && Math.random() < 0.45) {
      this.spawnMeteorItem();
    }
    this.updateMeteorDom();
  },

  updateMeteorDom() {
    const cid = this.meteorContainerId;
    if (!cid) return;
    const stage = document.getElementById(`${cid}-meteor-stage`);
    const scoreEl = document.getElementById(`${cid}-meteor-score`);
    const livesEl = document.getElementById(`${cid}-meteor-lives`);
    if (scoreEl) scoreEl.textContent = `🏆 分數：${this.meteorScore}`;
    if (livesEl) livesEl.textContent = `❤️ 生命：${'❤️'.repeat(Math.max(0, this.meteorLives)) || '💔'}`;
    if (stage) {
      if (!this.meteorRunning && this.meteorLives <= 0) {
        stage.innerHTML = `
          <div class="meteor-start-overlay">
            <div class="meteor-start-icon">🏆</div>
            <h3>流星雨挑戰結束！總分：${this.meteorScore} 分</h3>
            <button class="btn-primary" type="button" onclick="window.TypingDojo.startMeteorGame('${cid}')">
              🔄 再玩一次！
            </button>
          </div>
        `;
      } else if (this.meteorRunning) {
        stage.innerHTML = this.renderMeteorItemsHtml();
      }
    }
  },

  selectCategory(catId, containerId) {
    this.stopMeteorGame();
    const cat = window.TYPING_DATA.categories.find(c => c.id === catId);
    if (cat && cat.drills.length > 0) {
      this.currentCategoryId = cat.id;
      this.currentDrillId = cat.drills[0].id;
      this.resetStateOnly();
      this.render(containerId);
    }
  },

  selectDrill(drillId, containerId) {
    this.stopMeteorGame();
    this.currentDrillId = drillId;
    this.resetStateOnly();
    this.render(containerId);
  },

  resetStateOnly() {
    this.typedText = '';
    this.startTime = null;
    this.isCompleted = false;
    this.isComposing = false;
    this.comboStreak = 0;
    this.maxStreak = 0;
    this.missedKeys = {};
    this.lastFlashKey = null;
    this.lastCompletedStats = null;
  },

  resetDrill(containerId) {
    this.resetStateOnly();
    this.render(containerId);
  },

  nextDrill(containerId) {
    const allDrills = [];
    window.TYPING_DATA.categories.forEach(c => {
      c.drills.forEach(d => allDrills.push(d.id));
    });
    const idx = allDrills.indexOf(this.currentDrillId);
    const nextIdx = (idx + 1) % allDrills.length;
    this.selectDrill(allDrills[nextIdx], containerId);
  },

  renderHistoryChart() {
    const profile = window.AppState && window.AppState.getProfile ? window.AppState.getProfile() : null;
    const history = (profile && Array.isArray(profile.drillHistory)) ? profile.drillHistory.slice(-10) : [];
    const isSimple = window.AppState && window.AppState.isSimpleMode ? window.AppState.isSimpleMode() : false;
    const { drill } = this.findDrill(this.currentDrillId);
    const targetCpm = Math.round((drill.targetCpm || 60) * (isSimple ? 0.75 : 1));

    if (history.length === 0) {
      return `
        <div class="typing-history-box">
          <div class="dojo-history-empty-title">📈 速度成長曲線（目標：${targetCpm} 字/分${isSimple ? ' · 8歲護航目標' : ''}）</div>
          <div class="dojo-history-empty-sub">完成 1 次打字練習後，這裡就會畫出你的進步曲線喔！</div>
        </div>
      `;
    }

    const maxCpm = Math.max(targetCpm, ...history.map(h => h.cpm || 0), 40);
    const w = 520, h = 90, pad = 16;
    const pts = history.map((item, idx) => {
      const x = history.length === 1 ? w / 2 : pad + (idx / (history.length - 1)) * (w - pad * 2);
      const y = h - pad - ((item.cpm || 0) / maxCpm) * (h - pad * 2);
      return { x: Math.round(x), y: Math.round(y), cpm: item.cpm, acc: item.accuracy };
    });
    const poly = pts.map(p => `${p.x},${p.y}`).join(' ');

    return `
      <div class="typing-history-box">
        <div class="dojo-history-header">
          <strong class="dojo-history-title">📈 最近 ${history.length} 次打字速度成長曲線（目標：${targetCpm} 字/分）</strong>
          <span class="dojo-history-latest">最新：${history[history.length - 1].cpm} 字/分 ・ ${history[history.length - 1].accuracy}%</span>
        </div>
        <svg viewBox="0 0 ${w} ${h}" class="dojo-history-svg">
          ${pts.length > 1 ? `<polyline fill="none" stroke="#2563eb" stroke-width="3" points="${poly}"/>` : ''}
          ${pts.map(p => `<circle cx="${p.x}" cy="${p.y}" r="5" fill="#f59e0b" stroke="#ffffff" stroke-width="2"><title>${p.cpm} 字/分 (${p.acc}%)</title></circle>`).join('')}
        </svg>
      </div>
    `;
  },

  escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
};
