/**
 * ============================================================================
 * 🎹 TYPING DOJO ENGINE (js/typing-dojo.js)
 * ============================================================================
 * Renders the interactive Windows 11 Keyboard with both English letters
 * and Traditional Chinese Zhuyin (注音符號), color-coded finger guides,
 * F/J tactile bump indicators, real-time WPM & accuracy calculation, and
 * 19 progressive drills (from fff jjj, as asd, aaa bbb ccc to Zhuyin & Shift!).
 *
 * IME & SANDBOX COMPATIBILITY:
 * In-place DOM updates on typing keystrokes without re-rendering container.innerHTML,
 * preserving input focus, selection, and IME composition (Microsoft Bopomofo).
 * ============================================================================
 */

window.TypingDojo = {
  currentCategoryId: 'home-row',
  currentDrillId: 'hr-1',
  typedText: '',
  startTime: null,
  isCompleted: false,
  isComposing: false, // Track IME composition

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

  render(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const { category, drill } = this.findDrill(this.currentDrillId);
    this.currentCategoryId = category.id;
    const completedDrills = window.AppState ? window.AppState.getCompletedDrills() : {};

    const nextExpectedChar = drill.text[this.typedText.length] || '';
    const keyInfo = this.findKeyInfo(nextExpectedChar);
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

    container.innerHTML = `
      <div class="dojo-wrapper">
        <!-- Category Tabs -->
        <div class="dojo-cat-tabs">
          ${window.TYPING_DATA.categories.map(cat => `
            <button class="step-tab ${cat.id === category.id ? 'active' : ''}"
                    onclick="window.TypingDojo.selectCategory('${cat.id}', '${containerId}')">
              ${cat.badge} ${cat.title.split('(')[0]}
            </button>
          `).join('')}
        </div>

        <!-- Drill Selector within Category -->
        <div class="drill-selector-grid" id="${containerId}-drill-grid">
          ${category.drills.map(d => {
            const isDone = !!completedDrills[d.id];
            const isActive = d.id === drill.id;
            return `
              <button class="drill-btn ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}"
                      onclick="window.TypingDojo.selectDrill('${d.id}', '${containerId}')">
                <div class="drill-btn-row">
                  <span>${d.name}</span>
                  <span>${isDone ? '⭐⭐⭐' : '⚪'}</span>
                </div>
              </button>
            `;
          }).join('')}
        </div>

        <!-- Target Display Area -->
        <div class="typing-target-box">
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

          <div class="typing-chars-display" id="${containerId}-chars">
            ${charsHtml}
          </div>

          <div class="dojo-input-row">
            <input type="text"
                   id="${containerId}-input"
                   class="typing-input-field"
                   value="${this.escapeHtml(this.typedText)}"
                   placeholder="${drill.mode === 'chinese-real' ? '請切換成「中 (微軟注音)」在這裡打字...' : '點這裡開始打字！(請確認右下角為「英」模式)'}"
                   autocomplete="off"
                   autocorrect="off"
                   autocapitalize="off"
                   spellcheck="false" />
          </div>

          <div class="dojo-hint-bar">
            <div id="${containerId}-key-hint" class="dojo-key-hint">
              ${this.isCompleted
                ? '🎉 太棒了！你成功完成這一關！點右邊按鈕進入下一關！'
                : keyInfo
                  ? `👉 下一個按鍵：【 ${nextExpectedChar === ' ' ? '空白鍵 Space' : nextExpectedChar.toUpperCase()} / 注音 ${keyInfo.zhuyin} 】— 請用「${keyInfo.hand}」${customHint}`
                  : '👉 請照著上方藍底游標的文字輸入！'}
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
        </div>

        <!-- Visual Taiwan Keyboard (English + Zhuyin + Home Row Bumps) -->
        <div class="taiwan-keyboard" id="${containerId}-keyboard">
          ${this.renderKeyboardHtml(nextExpectedChar)}
        </div>

        ${this.renderHistoryChart()}
      </div>
    `;

    const inputEl = document.getElementById(`${containerId}-input`);
    if (inputEl) {
      inputEl.focus();
      const len = inputEl.value.length;
      inputEl.setSelectionRange(len, len);

      // Support IME composition events without interrupting Chinese candidate input
      inputEl.addEventListener('compositionstart', () => {
        this.isComposing = true;
      });

      inputEl.addEventListener('compositionend', (e) => {
        this.isComposing = false;
        this.handleTypingInput(e.target.value, containerId);
      });

      inputEl.addEventListener('input', (e) => {
        if (this.isComposing) return; // Wait for IME composition to complete
        this.handleTypingInput(e.target.value, containerId);
      });
    }
  },

  handleTypingInput(val, containerId) {
    const { drill } = this.findDrill(this.currentDrillId);

    if (!this.startTime && val.length > 0) {
      this.startTime = Date.now();
    }
    this.typedText = val;

    // Check completion
    const wasCompleted = this.isCompleted;
    if (this.typedText === drill.text || (this.typedText.length >= drill.text.length && this.typedText.trim() === drill.text.trim())) {
      this.isCompleted = true;
      if (!wasCompleted && window.AppState) {
        let accuracy = 100;
        let correctCount = 0;
        for (let i = 0; i < this.typedText.length; i++) {
          if (this.typedText[i] === drill.text[i]) correctCount++;
        }
        accuracy = Math.round((correctCount / this.typedText.length) * 100);
        const elapsedMin = Math.max((Date.now() - (this.startTime || Date.now())) / 60000, 0.05);
        const cpm = Math.round(this.typedText.length / elapsedMin);
        window.AppState.completeDrill(drill.id, cpm || 25);
        if (window.UIModal && window.UIModal.toast) {
          window.UIModal.toast(`🎉 通關成功！${drill.name} — 速度 ${cpm} 字/分 ｜ 準確度 ${accuracy}%`);
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
    const hintEl = document.getElementById(`${containerId}-key-hint`);
    const keyboardEl = document.getElementById(`${containerId}-keyboard`);

    const nextExpectedChar = drill.text[this.typedText.length] || '';
    const keyInfo = this.findKeyInfo(nextExpectedChar);
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

    if (hintEl) {
      hintEl.textContent = this.isCompleted
        ? '🎉 太棒了！你成功完成這一關！點右邊按鈕進入下一關！'
        : keyInfo
          ? `👉 下一個按鍵：【 ${nextExpectedChar === ' ' ? '空白鍵 Space' : nextExpectedChar.toUpperCase()} / 注音 ${keyInfo.zhuyin} 】— 請用「${keyInfo.hand}」${customHint}`
          : '👉 請照著上方藍底游標的文字輸入！';
    }

    // Update keyboard target highlight
    if (keyboardEl) {
      keyboardEl.innerHTML = this.renderKeyboardHtml(nextExpectedChar);
    }

    // Update drill selector done status in grid if completed
    if (this.isCompleted) {
      const grid = document.getElementById(`${containerId}-drill-grid`);
      if (grid) {
        const completedDrills = window.AppState ? window.AppState.getCompletedDrills() : {};
        const { category } = this.findDrill(this.currentDrillId);
        grid.innerHTML = category.drills.map(d => {
          const isDone = !!completedDrills[d.id] || d.id === drill.id;
          const isActive = d.id === drill.id;
          return `
            <button class="drill-btn ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}"
                    onclick="window.TypingDojo.selectDrill('${d.id}', '${containerId}')">
              <div class="drill-btn-row">
                <span>${d.name}</span>
                <span>${isDone ? '⭐⭐⭐' : '⚪'}</span>
              </div>
            </button>
          `;
        }).join('');
      }
    }
  },

  renderKeyboardHtml(nextExpectedChar) {
    return `
      <div class="kb-guide-caption">
        💻 台灣注音雙語鍵盤導引（黃色發光鍵 ＝ 下一個要按的鍵；F 與 J 底下有藍色定位凸點！）
      </div>
      ${window.TYPING_DATA.keyboardLayout.map((row, rIdx) => `
        <div class="kb-row" style="padding-left:${rIdx * 14}px;">
          ${rIdx === 3 ? `<div class="kb-key kb-key-wide kb-key-shift">Shift (切換中/英)</div>` : ''}
          ${row.map(k => {
            const isTarget = nextExpectedChar && nextExpectedChar.toLowerCase() === k.key;
            const fColor = this.getFingerColor(k.finger);
            return `
              <div class="kb-key ${k.home ? 'home-key' : ''} ${k.bump ? 'bump-key' : ''} ${isTarget ? 'highlight-target' : ''}"
                   style="border-bottom: 4px solid ${fColor};">
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
        <div class="kb-key kb-key-space ${nextExpectedChar === ' ' ? 'highlight-target' : ''}">
          <span>Space 空白鍵（大拇指 / 注音一聲）</span>
        </div>
        <div class="kb-key kb-key-wide kb-key-arrow">↓ 選字方向鍵</div>
      </div>

      <!-- Finger Color Legend -->
      <div class="finger-legend">
        <span class="finger-badge" style="background:var(--finger-L5)">左手小指 (A/Q/Z/1)</span>
        <span class="finger-badge" style="background:var(--finger-L4)">左手無名指 (S/W/X/2)</span>
        <span class="finger-badge" style="background:var(--finger-L3)">左手中指 (D/E/C/3)</span>
        <span class="finger-badge" style="background:var(--finger-L2)">左手食指 (F凸點/G/R/T/V/B)</span>
        <span class="finger-badge" style="background:var(--finger-R2)">右手食指 (J凸點/H/Y/U/N/M)</span>
        <span class="finger-badge" style="background:var(--finger-R3)">右手中指 (K/I/8/,)</span>
        <span class="finger-badge" style="background:var(--finger-R4)">右手無名指 (L/O/9/.)</span>
        <span class="finger-badge" style="background:var(--finger-R5)">右手小指 (;/P/0//)</span>
      </div>
    `;
  },

  selectCategory(catId, containerId) {
    const cat = window.TYPING_DATA.categories.find(c => c.id === catId);
    if (cat && cat.drills.length > 0) {
      this.currentCategoryId = cat.id;
      this.currentDrillId = cat.drills[0].id;
      this.typedText = '';
      this.startTime = null;
      this.isCompleted = false;
      this.isComposing = false;
      this.render(containerId);
    }
  },

  selectDrill(drillId, containerId) {
    this.currentDrillId = drillId;
    this.typedText = '';
    this.startTime = null;
    this.isCompleted = false;
    this.isComposing = false;
    this.render(containerId);
  },

  resetDrill(containerId) {
    this.typedText = '';
    this.startTime = null;
    this.isCompleted = false;
    this.isComposing = false;
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
