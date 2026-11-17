/**
 * ============================================================================
 * 🚀 DIGITAL EXPLORER ACADEMY — MAIN APPLICATION CONTROLLER (js/app.js)
 * ============================================================================
 * Manages:
 * - Multi-kid profiles (10歲探險家 & 8歲探險家, customizable names & avatars)
 * - LocalStorage persistence + Export/Import Progress Code (for multi-laptop sync)
 * - World Map, Lesson Viewer (Learn -> Interactive Lab -> Quiz), Standalone Typing Dojo,
 *   English Vocabulary Bank, and Printable Graduation Certificate!
 * ============================================================================
 */

const STORAGE_KEY = 'digital_explorer_academy_v1';

window.AppState = {
  activeProfileId: 'kid-10',
  showEnglishSubtitles: true,
  currentView: 'map', // 'map' | 'lesson' | 'dojo' | 'vocab' | 'certificate' | 'parent'
  currentLessonId: 'w1-l1',
  lessonStep: 'learn', // 'learn' | 'lab' | 'quiz'
  quizAnswers: {},

  profiles: {
    'kid-10': {
      id: 'kid-10',
      name: '10歲大探險家',
      avatar: '🦁',
      xp: 0,
      completedLessons: {}, // { 'w1-l1': { stars: 3, date: ... } }
      completedDrills: {}   // { 'hr-1': { cpm: 35 } }
    },
    'kid-8': {
      id: 'kid-8',
      name: '8歲小探險家',
      avatar: '🦊',
      xp: 0,
      completedLessons: {},
      completedDrills: {}
    }
  },

  init() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.profiles) this.profiles = parsed.profiles;
        if (parsed.activeProfileId) this.activeProfileId = parsed.activeProfileId;
        if (typeof parsed.showEnglishSubtitles === 'boolean') {
          this.showEnglishSubtitles = parsed.showEnglishSubtitles;
        }
      }
    } catch (e) {
      console.warn('Could not read localStorage:', e);
    }
    this.syncBodyClass();
    this.renderAll();
  },

  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        activeProfileId: this.activeProfileId,
        showEnglishSubtitles: this.showEnglishSubtitles,
        profiles: this.profiles
      }));
    } catch (e) {
      console.warn('Could not save localStorage:', e);
    }
  },

  getProfile() {
    return this.profiles[this.activeProfileId] || this.profiles['kid-10'];
  },

  getCompletedDrills() {
    return this.getProfile().completedDrills || {};
  },

  completeDrill(drillId, cpm) {
    const p = this.getProfile();
    if (!p.completedDrills[drillId]) {
      p.xp += 30;
    }
    p.completedDrills[drillId] = { cpm: Math.max(cpm, (p.completedDrills[drillId]?.cpm || 0)) };
    this.save();
    this.renderHeader();
  },

  completeLesson(lessonId, xpReward) {
    const p = this.getProfile();
    if (!p.completedLessons[lessonId]) {
      p.xp += xpReward;
    }
    p.completedLessons[lessonId] = { stars: 3, completedAt: new Date().toISOString() };
    this.save();
    this.renderHeader();
  },

  switchProfile() {
    this.activeProfileId = this.activeProfileId === 'kid-10' ? 'kid-8' : 'kid-10';
    this.quizAnswers = {};
    this.save();
    this.renderAll();
  },

  renameCurrentProfile() {
    const p = this.getProfile();
    const promptFn = (window.UIModal && window.UIModal.prompt) ? window.UIModal.prompt.bind(window.UIModal) : window.prompt;
    const res = promptFn('請輸入你的探險家暱稱（例如：哥哥 Leo / 妹妹 Mia）：', p.name, '✏️ 修改探險家暱稱');
    if (res && typeof res.then === 'function') {
      res.then((newName) => {
        if (newName && newName.trim()) {
          p.name = newName.trim();
          this.save();
          this.renderAll();
          if (window.UIModal && window.UIModal.toast) {
            window.UIModal.toast(`🎉 暱稱已成功更新為「${p.name}」！`);
          }
        }
      });
    } else if (res && typeof res === 'string' && res.trim()) {
      p.name = res.trim();
      this.save();
      this.renderAll();
    }
  },

  toggleEnglish() {
    this.showEnglishSubtitles = !this.showEnglishSubtitles;
    this.syncBodyClass();
    this.save();
    this.renderHeader();
  },

  syncBodyClass() {
    if (this.showEnglishSubtitles) {
      document.body.classList.add('show-en');
    } else {
      document.body.classList.remove('show-en');
    }
  },

  navigate(view, lessonId) {
    this.currentView = view;
    if (lessonId) {
      this.currentLessonId = lessonId;
      this.lessonStep = 'learn';
      this.quizAnswers = {};
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.renderAll();
  },

  setLessonStep(step) {
    this.lessonStep = step;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.renderMain();
  },

  renderAll() {
    this.renderHeader();
    this.renderMain();
  },

  renderHeader() {
    const navEl = document.getElementById('app-header');
    if (!navEl) return;
    const p = this.getProfile();
    const completedCount = Object.keys(p.completedLessons).length;
    const totalLessons = window.CURRICULUM_LESSONS.length;
    const totalDrills = (window.TYPING_DATA && window.TYPING_DATA.categories)
      ? window.TYPING_DATA.categories.reduce((sum, c) => sum + c.drills.length, 0)
      : 22;

    navEl.innerHTML = `
      <div class="brand-area" onclick="window.AppState.navigate('map')">
        <div class="brand-logo">🚀</div>
        <div>
          <div class="brand-title">數位小探險家學院</div>
          <div class="brand-subtitle">Windows 11・中英盲打・網路與 AI 魔法學園</div>
        </div>
      </div>

      <div class="nav-tabs">
        <button class="nav-tab ${this.currentView === 'map' || this.currentView === 'lesson' ? 'active' : ''}"
                onclick="window.AppState.navigate('map')">
          🗺️ 探險地圖 (${completedCount}/${totalLessons})
        </button>
        <button class="nav-tab ${this.currentView === 'dojo' ? 'active' : ''}"
                onclick="window.AppState.navigate('dojo')">
          🎹 中英打字道館 (${totalDrills}關)
        </button>
        <button class="nav-tab ${this.currentView === 'vocab' ? 'active' : ''}"
                onclick="window.AppState.navigate('vocab')">
          🔤 電腦英文單字卡
        </button>
        <button class="nav-tab ${this.currentView === 'certificate' ? 'active' : ''}"
                onclick="window.AppState.navigate('certificate')">
          🎓 榮譽證書
        </button>
        <button class="nav-tab ${this.currentView === 'parent' ? 'active' : ''}"
                onclick="window.AppState.navigate('parent')">
          👨‍👩‍👧 家長指南
        </button>
      </div>

      <div class="nav-right">
        <div class="profile-pill" onclick="window.AppState.switchProfile()" title="點擊切換 10歲 / 8歲 探險家檔案">
          <span>${p.avatar} ${p.name}</span>
          <span style="font-size:0.75rem; background:#fde68a; padding:1px 6px; border-radius:999px;">切換</span>
        </div>
        <button class="lang-toggle-btn" onclick="window.AppState.renameCurrentProfile()" title="修改探險家名字">
          ✏️ 改名
        </button>
        <div class="xp-pill">
          ⭐ ${p.xp} XP
        </div>
        <button class="lang-toggle-btn ${this.showEnglishSubtitles ? 'en-on' : ''}"
                onclick="window.AppState.toggleEnglish()">
          ${this.showEnglishSubtitles ? '中+EN 雙語開啟' : '僅顯示中文'}
        </button>
      </div>
    `;
  },

  renderMain() {
    const mainEl = document.getElementById('app-main');
    if (!mainEl) return;

    if (this.currentView !== 'map' && window.IslandScene) {
      window.IslandScene.destroy();
    }

    if (this.currentView === 'map') {
      this.renderWorldMap(mainEl);
    } else if (this.currentView === 'lesson') {
      this.renderLessonView(mainEl);
    } else if (this.currentView === 'dojo') {
      this.renderStandaloneDojo(mainEl);
    } else if (this.currentView === 'vocab') {
      this.renderVocabBank(mainEl);
    } else if (this.currentView === 'certificate') {
      this.renderCertificate(mainEl);
    } else if (this.currentView === 'parent') {
      this.renderParentGuide(mainEl);
    }
  },

  // ==========================================================================
  // VIEW 1: WORLD MAP
  // ==========================================================================
  renderWorldMap(mainEl) {
    const p = this.getProfile();
    const completedLessonsCount = Object.keys(p.completedLessons).length;
    const completedDrillsCount = Object.keys(p.completedDrills).length;
    const totalLessons = window.CURRICULUM_LESSONS.length;
    const totalDrills = (window.TYPING_DATA && window.TYPING_DATA.categories)
      ? window.TYPING_DATA.categories.reduce((sum, c) => sum + c.drills.length, 0)
      : 22;

    mainEl.innerHTML = `
      <section class="hero-banner">
        <div class="hero-info">
          <h1>👋 歡迎回來，${p.avatar} ${p.name}！</h1>
          <p>從認識你的全新 Windows 11 筆電、學會中英十指盲打，一路成為聰明又安全的網路與 AI 小大師！</p>
          <div class="dynamic-island-bar">
            <span class="dynamic-island-dot"></span>
            <span>💊 靈動探險島：${p.avatar} ${p.name} 連線中</span>
            <span>｜</span>
            <span>👀 20-20-20 護眼提醒：每 20 分鐘看遠方 20 秒！</span>
          </div>
        </div>
        <div class="hero-stats">
          <div class="stat-box">
            <div class="stat-num">${completedLessonsCount} / ${totalLessons}</div>
            <div class="stat-label">已完成課程</div>
          </div>
          <div class="stat-box">
            <div class="stat-num">${completedDrillsCount} / ${totalDrills}</div>
            <div class="stat-label">打字道館通關</div>
          </div>
          <div class="stat-box">
            <div class="stat-num">⭐ ${p.xp}</div>
            <div class="stat-label">探險家總積分</div>
          </div>
        </div>
      </section>

      <!-- 🏝️ Three.js 3D Floating Islands Interactive Stage -->
      <div id="island-3d-canvas"></div>

      ${window.CURRICULUM_WORLDS.map(world => {
        const wLessons = window.CURRICULUM_LESSONS.filter(l => l.worldId === world.id);
        const wDoneCount = wLessons.filter(l => p.completedLessons[l.id]).length;
        return `
          <section class="world-section" id="section-${world.id}">
            <div class="world-header">
              <div class="world-title-group">
                <div class="world-icon-badge" style="background:${world.themeColor}18; border:2px solid ${world.themeColor};">
                  ${world.icon}
                </div>
                <div>
                  <div style="font-size:0.8rem; font-weight:900; color:${world.themeColor}; text-transform:uppercase;">
                    ${world.number} ・ ${world.titleEn}
                  </div>
                  <h2>${world.title}</h2>
                  <p>${world.subtitle}</p>
                </div>
              </div>
              <div style="background:#f8fafc; border:2px solid #e2e8f0; padding:0.45rem 0.95rem; border-radius:999px; font-weight:800; font-size:0.88rem;">
                🏆 進度：${wDoneCount} / ${wLessons.length} 關 ${wDoneCount === wLessons.length ? '（🏅 已獲得' + world.badgeName + '！）' : ''}
              </div>
            </div>

            <div class="lessons-grid">
              ${wLessons.map(lesson => {
                const isDone = !!p.completedLessons[lesson.id];
                return `
                  <article class="lesson-card ${isDone ? 'completed' : ''}"
                           onclick="window.AppState.navigate('lesson', '${lesson.id}')">
                    <div>
                      <div class="lesson-card-top">
                        <span class="lesson-num-tag">單元 ${lesson.number}</span>
                        <span class="lesson-status-stars">${isDone ? '⭐⭐⭐ 已通關' : '🎯 點擊開始'}</span>
                      </div>
                      <h3>${lesson.icon} ${lesson.title}</h3>
                      <div class="en-sub">${lesson.titleEn}</div>
                      <p>${lesson.summary}</p>
                    </div>
                    <div class="lesson-card-footer">
                      <span>⏱️ ${lesson.duration}</span>
                      <span style="color:${world.themeColor};">+${lesson.xp} XP 👉</span>
                    </div>
                  </article>
                `;
              }).join('')}
            </div>
          </section>
        `;
      }).join('')}
    `;

    if (window.IslandScene) {
      window.IslandScene.mount('island-3d-canvas', {
        onSelectWorld: (worldId) => {
          const sec = document.getElementById(`section-${worldId}`);
          if (sec) {
            sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
            sec.classList.add('island-highlight');
            setTimeout(() => sec.classList.remove('island-highlight'), 1400);
          }
        },
        profile: p,
        worlds: window.CURRICULUM_WORLDS
      });
    }
  },

  // ==========================================================================
  // VIEW 2: LESSON VIEWER (LEARN -> INTERACTIVE LAB -> QUIZ)
  // ==========================================================================
  renderLessonView(mainEl) {
    const lesson = window.CURRICULUM_LESSONS.find(l => l.id === this.currentLessonId) || window.CURRICULUM_LESSONS[0];
    const lessonIdx = window.CURRICULUM_LESSONS.indexOf(lesson);
    const nextLesson = window.CURRICULUM_LESSONS[lessonIdx + 1] || null;
    const isCompleted = !!this.getProfile().completedLessons[lesson.id];

    mainEl.innerHTML = `
      <div class="lesson-view-header">
        <button class="back-btn" onclick="window.AppState.navigate('map')">
          ← 返回探險地圖
        </button>
        <div class="step-tabs">
          <button class="step-tab ${this.lessonStep === 'learn' ? 'active' : ''}"
                  onclick="window.AppState.setLessonStep('learn')">
            📖 1. 圖文知識卡 (${lesson.cards.length})
          </button>
          <button class="step-tab ${this.lessonStep === 'lab' ? 'active' : ''}"
                  onclick="window.AppState.setLessonStep('lab')">
            🎮 2. 互動實戰練習場
          </button>
          <button class="step-tab ${this.lessonStep === 'quiz' ? 'active' : ''}"
                  onclick="window.AppState.setLessonStep('quiz')">
            🏆 3. 闖關小測驗 (${lesson.quiz.length}題)
          </button>
        </div>
      </div>

      <div class="card-panel">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem; margin-bottom:1.25rem; border-bottom:2px solid #f1f5f9; padding-bottom:1rem;">
          <div>
            <span class="lesson-num-tag">單元 ${lesson.number} ・ +${lesson.xp} XP</span>
            <h1 style="font-size:1.55rem; font-weight:900; margin-top:0.35rem;">${lesson.icon} ${lesson.title}</h1>
            <div class="en-sub" style="font-size:0.95rem;">${lesson.titleEn}</div>
          </div>
          <div>
            ${isCompleted ? `<span style="background:#dcfce7; color:#166534; padding:0.45rem 0.9rem; border-radius:999px; font-weight:900;">⭐⭐⭐ 本單元已通關！</span>` : ''}
          </div>
        </div>

        ${this.lessonStep === 'learn' ? `
          <!-- Step 1: Story & Concept Cards -->
          <div>
            ${lesson.cards.map((c, idx) => `
              <div class="slide-card">
                <h3>${c.title}</h3>
                <div class="en-sub" style="margin-bottom:0.5rem;">${c.titleEn || ''}</div>
                <div class="slide-body">${this.formatMarkdownBold(c.body)}</div>
                ${c.visualType ? this.renderCardVisual(c.visualType) : ''}
                ${c.highlight ? `<div class="slide-highlight">${c.highlight}</div>` : ''}
              </div>
            `).join('')}

            <!-- Essential English Tech Keywords -->
            <div style="margin-top:1.75rem; background:#f8fafc; border:2px solid #e2e8f0; border-radius:16px; padding:1.25rem;">
              <h3 style="font-size:1.15rem; font-weight:900; color:#0369a1;">
                🔤 本單元必學「電腦與 AI 英文關鍵字」 (點喇叭可聽發音！)
              </h3>
              <div class="vocab-strip">
                ${lesson.vocab.map(v => `
                  <div class="vocab-chip">
                    <div class="v-en">
                      <span>${v.en}</span>
                      <button onclick="window.AppState.speakEnglish('${v.en.replace(/'/g, '')}')"
                              style="background:#e0f2fe; border:none; border-radius:6px; padding:2px 7px; cursor:pointer; font-size:0.85rem;"
                              title="點擊聽英文發音">
                        🔊 發音
                      </button>
                    </div>
                    <div class="v-zh">${v.zh}</div>
                    <div class="v-desc">${v.desc}</div>
                  </div>
                `).join('')}
              </div>
            </div>

            <div style="display:flex; justify-content:flex-end; margin-top:1.5rem;">
              <button class="btn-primary" onclick="window.AppState.setLessonStep('lab')">
                下一步：進入「🎮 互動實戰練習場」 👉
              </button>
            </div>
          </div>
        ` : ''}

        ${this.lessonStep === 'lab' ? `
          <!-- Step 2: Interactive Simulator Lab -->
          <div>
            <div style="background:#eff6ff; border:2px solid #bfdbfe; border-radius:14px; padding:1rem 1.25rem; margin-bottom:1rem;">
              <h3 style="font-size:1.18rem; color:#1e40af; margin-bottom:0.25rem;">${lesson.simulator.title}</h3>
              <p style="font-size:0.95rem; color:#1e3a8a; font-weight:700; white-space:pre-line;">${lesson.simulator.instruction}</p>
            </div>

            <div id="lesson-simulator-mount"></div>

            <div style="display:flex; justify-content:space-between; margin-top:1.5rem; flex-wrap:wrap; gap:0.75rem;">
              <button class="btn-secondary" onclick="window.AppState.setLessonStep('learn')">
                ← 回去看知識卡
              </button>
              <button class="btn-primary" onclick="window.AppState.setLessonStep('quiz')">
                下一步：挑戰「🏆 闖關小測驗」領取星星 👉
              </button>
            </div>
          </div>
        ` : ''}

        ${this.lessonStep === 'quiz' ? `
          <!-- Step 3: Mastery Quiz -->
          <div>
            <p style="font-weight:800; color:#475569; margin-bottom:1rem;">
              🎯 答對下面全部 ${lesson.quiz.length} 題，就能獲得 <strong>+${lesson.xp} XP</strong> 與 ⭐⭐⭐ 三顆星勳章！
            </p>
            ${lesson.quiz.map((qItem, qIdx) => {
              const chosen = this.quizAnswers[qIdx];
              const isAnswered = chosen !== undefined;
              const isCorrect = chosen === qItem.correct;
              return `
                <div class="quiz-question-card">
                  <div style="font-weight:900; font-size:1.08rem; margin-bottom:0.5rem;">
                    Q${qIdx + 1}. ${qItem.q}
                  </div>
                  ${qItem.options.map((opt, oIdx) => {
                    let cls = 'quiz-option';
                    if (isAnswered) {
                      if (oIdx === qItem.correct) cls += ' correct';
                      else if (oIdx === chosen) cls += ' wrong';
                    }
                    return `
                      <button class="${cls}" onclick="window.AppState.answerQuiz(${qIdx}, ${oIdx}, '${lesson.id}', ${lesson.xp})">
                        ${oIdx === 0 ? '🅰️' : oIdx === 1 ? '🅱️' : '🆎'} ${opt}
                      </button>
                    `;
                  }).join('')}
                  ${isAnswered ? `
                    <div style="margin-top:0.75rem; padding:0.75rem 1rem; border-radius:10px; background:${isCorrect ? '#dcfce7' : '#fee2e2'}; font-weight:800; font-size:0.95rem;">
                      ${isCorrect ? '🎉 答對了！' : '💡 再想一下喔：'}${qItem.explain}
                    </div>
                  ` : ''}
                </div>
              `;
            }).join('')}

            ${this.isQuizAllCorrect(lesson) ? `
              <div style="background:linear-gradient(135deg, #dcfce7 0%, #fef9c3 100%); border:3px solid #22c55e; border-radius:18px; padding:1.5rem; text-align:center; margin-top:1.25rem;">
                <div style="font-size:2.5rem;">🎉⭐⭐⭐🎉</div>
                <h3 style="font-size:1.35rem; font-weight:900; color:#14532d; margin:0.35rem 0;">
                  恭喜過關！你已獲得本單元三顆星與 +${lesson.xp} XP！
                </h3>
                <div style="display:flex; justify-content:center; gap:0.85rem; margin-top:1rem; flex-wrap:wrap;">
                  <button class="btn-secondary" onclick="window.AppState.navigate('map')">
                    🗺️ 返回探險地圖
                  </button>
                  ${nextLesson ? `
                    <button class="btn-primary" onclick="window.AppState.navigate('lesson', '${nextLesson.id}')">
                      🚀 前往下一關：單元 ${nextLesson.number} ${nextLesson.title} 👉
                    </button>
                  ` : `
                    <button class="btn-primary" onclick="window.AppState.navigate('certificate')">
                      🎓 領取「數位小探險家榮譽畢業證書」 👉
                    </button>
                  `}
                </div>
              </div>
            ` : ''}
          </div>
        ` : ''}
      </div>
    `;

    if (this.lessonStep === 'lab') {
      window.Simulators.render(lesson.simulator, 'lesson-simulator-mount');
    }
  },

  answerQuiz(qIdx, oIdx, lessonId, xp) {
    this.quizAnswers[qIdx] = oIdx;
    const lesson = window.CURRICULUM_LESSONS.find(l => l.id === lessonId);
    if (lesson && this.isQuizAllCorrect(lesson)) {
      this.completeLesson(lessonId, xp);
    }
    this.renderMain();
  },

  isQuizAllCorrect(lesson) {
    return lesson.quiz.every((q, idx) => this.quizAnswers[idx] === q.correct);
  },

  // ==========================================================================
  // VIEW 3: STANDALONE TYPING DOJO
  // ==========================================================================
  renderStandaloneDojo(mainEl) {
    const totalDrills = (window.TYPING_DATA && window.TYPING_DATA.categories)
      ? window.TYPING_DATA.categories.reduce((sum, c) => sum + c.drills.length, 0)
      : 22;

    mainEl.innerHTML = `
      <div class="card-panel">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem; margin-bottom:1rem;">
          <div>
            <h1 style="font-size:1.5rem; font-weight:900;">🎹 老鷹變獵鷹：中英盲打與注音特訓道館 (共 ${totalDrills} 關)</h1>
            <p style="color:#475569; font-weight:700;">
              從最基礎的 <code>fff jjj</code>、<code>as asd</code>、<code>aaa bbb ccc</code>，一路練到「微軟注音四聲」與「Shift 中英切換」！每天練 10 分鐘，手指就會長出記憶喔！
            </p>
          </div>
        </div>
        <div id="standalone-dojo-mount"></div>
      </div>
    `;
    window.TypingDojo.render('standalone-dojo-mount');
  },

  // ==========================================================================
  // VIEW 4: COMPUTER & AI ENGLISH VOCABULARY BANK
  // ==========================================================================
  renderVocabBank(mainEl) {
    const allVocab = [];
    window.CURRICULUM_LESSONS.forEach(l => {
      l.vocab.forEach(v => allVocab.push({ ...v, lessonNum: l.number }));
    });

    mainEl.innerHTML = `
      <div class="card-panel">
        <h1 style="font-size:1.5rem; font-weight:900; margin-bottom:0.35rem;">🔤 電腦、網路與 AI 必備英文單字百寶箱 (${allVocab.length} 個核心單字)</h1>
        <p style="color:#475569; font-weight:700; margin-bottom:1.25rem;">
          點每個單字右上角的「🔊 發音」按鈕，電腦就會唸純正的英文給你聽喔！
        </p>
        <div class="vocab-strip">
          ${allVocab.map(v => `
            <div class="vocab-chip">
              <div style="font-size:0.72rem; font-weight:800; color:#64748b; margin-bottom:2px;">單元 ${v.lessonNum}</div>
              <div class="v-en">
                <span>${v.en}</span>
                <button onclick="window.AppState.speakEnglish('${v.en.split('(')[0].replace(/'/g, '').trim()}')"
                        style="background:#e0f2fe; border:none; border-radius:6px; padding:2px 8px; cursor:pointer; font-size:0.82rem; font-weight:800;">
                  🔊 發音
                </button>
              </div>
              <div class="v-zh">${v.zh}</div>
              <div class="v-desc">${v.desc}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  // ==========================================================================
  // VIEW 5: GRADUATION CERTIFICATE & PROGRESS BACKUP
  // ==========================================================================
  renderCertificate(mainEl) {
    const p = this.getProfile();
    const doneLessons = Object.keys(p.completedLessons).length;
    const doneDrills = Object.keys(p.completedDrills).length;
    const totalLessons = window.CURRICULUM_LESSONS.length;
    const today = new Date().toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' });

    mainEl.innerHTML = `
      <div class="card-panel" style="text-align:center;">
        <div style="border:6px double #d97706; background:linear-gradient(135deg, #fffbeb 0%, #ffffff 50%, #f0f9ff 100%); border-radius:20px; padding:2.5rem 1.5rem; max-width:780px; margin:0 auto;">
          <div style="font-size:3rem;">🎓🏆🚀</div>
          <div style="font-size:0.9rem; font-weight:900; color:#b45309; letter-spacing:0.15em; margin-top:0.4rem;">
            DIGITAL EXPLORER ACADEMY CERTIFICATE
          </div>
          <h1 style="font-size:2rem; font-weight:900; color:#0f172a; margin:0.5rem 0;">
            數位小探險家學院・榮譽證書
          </h1>
          <p style="font-size:1.1rem; color:#475569; margin-bottom:1.25rem;">
            茲證明小小數位探險家：
          </p>
          <div style="font-size:2.1rem; font-weight:900; color:#0284c7; border-bottom:3px solid #0284c7; display:inline-block; padding:0.2rem 2rem; margin-bottom:1.25rem;">
            ${p.avatar} ${p.name}
          </div>
          <p style="font-size:1.05rem; color:#334155; max-width:600px; margin:0 auto 1.5rem; line-height:1.8;">
            已成功在 <strong>Windows 11 筆電</strong> 上完成：
            <strong>${doneLessons} / ${totalLessons} 堂數位課程</strong> 與 <strong>${doneDrills} / ${window.TYPING_DATA.categories.reduce((sum, c) => sum + c.drills.length, 0)} 關中英盲打特訓</strong>，
            累積獲得 <strong>⭐ ${p.xp} XP</strong>！具備優秀的筆電操作、網路搜尋防詐與 AI 魔法應用能力！
          </p>
          <div style="display:flex; justify-content:space-around; flex-wrap:wrap; gap:1rem; margin-top:1.5rem; padding-top:1rem; border-top:2px dashed #fde68a; font-weight:800; color:#64748b;">
            <span>📅 頒發日期：${today}</span>
            <span>🏅 認證等級：${doneLessons >= totalLessons ? '👑 傳奇數位魔法師' : doneLessons >= 6 ? '🌟 進階數位探險家' : '🌱 見習數位小達人'}</span>
          </div>
        </div>

        <div style="margin-top:1.5rem; display:flex; justify-content:center; gap:1rem; flex-wrap:wrap;">
          <button class="btn-primary" onclick="window.print()">
            🖨️ 列印或另存 PDF 畢業證書
          </button>
          <button class="btn-secondary" onclick="window.AppState.exportProgress()">
            💾 匯出學習進度代碼 (跨電腦備份)
          </button>
          <button class="btn-secondary" onclick="window.AppState.importProgress()">
            📥 匯入學習進度代碼
          </button>
        </div>
      </div>
    `;
  },

  // ==========================================================================
  // VIEW 6: PARENT GUIDE & EXTENSIBILITY DOCS
  // ==========================================================================
  renderParentGuide(mainEl) {
    mainEl.innerHTML = `
      <div class="card-panel">
        <h1 style="font-size:1.55rem; font-weight:900; margin-bottom:0.5rem;">👨‍👩‍👧 家長專屬指南：陪 8 歲與 10 歲孩子開啟數位與 AI 之旅</h1>
        <p style="color:#475569; font-weight:700; margin-bottom:1.25rem;">
          這份指南整理了 Windows 11 筆電的快速設定、如何陪孩子練習中英盲打與 AI，以及如何免費部署到 GitHub / Vercel / Cloudflare Pages 與未來擴充課程的方法。
        </p>

        <div class="slide-card">
          <h3>💻 1. 新買的 Windows 11 筆電：5 分鐘家長設定清單</h3>
          <div class="slide-body">1. <strong>確認微軟注音 (Microsoft Bopomofo) 設定</strong>：
   • 進入 Windows「設定 (Settings)」→「時間與語言 (Time & language)」→「語言與區域 (Language & region)」。
   • 確認「中文 (台灣)」底下有「微軟注音」。按一下 <code>Shift</code> 即可切換「中 / 英」，按 <code>Win + 空白鍵</code> 可切換不同語言。
2. <strong>把本學習網站加入書籤列 (Bookmark Bar)</strong>：
   • 在 Chrome 或 Edge 按 <code>Ctrl + Shift + B</code> 永遠顯示書籤列，按網址列右邊的「★」把本網站存起來，孩子一開瀏覽器就能自己點進來闖關！
3. <strong>保護孩子上網安全 (Microsoft Family Safety)</strong>：
   • 建議為 8 歲與 10 歲孩子設定兒童帳號，開啟 Edge 安全搜尋 (SafeSearch)，並與孩子約定「下載任何 .exe 程式前一定要先問爸媽」。</div>
        </div>

        <div class="slide-card">
          <h3>🎹 2. 如何幫助孩子從「一指神功老鷹打字」變成「十指中英盲打」？</h3>
          <div class="slide-body">• <strong>每天 10 分鐘比週末一次練 2 小時更有效</strong>：每次上課前，先讓孩子去「🎹 中英打字道館」打 2 關暖身（從 <code>fff jjj</code>、<code>as asd</code>、<code>aaa bbb ccc</code> 開始）。
• <strong>要求食指永遠先摸到 F 與 J 的小凸點</strong>：孩子一開始打得慢沒關係，只要「手指定位正確、盡量看螢幕上的彩色鍵盤提示而不是低頭看實體鍵盤」，兩週內速度就會翻倍！</div>
        </div>

        <div class="slide-card">
          <h3>☁️ 3. 如何免費部署到 GitHub + Vercel 或 Cloudflare Pages？</h3>
          <div class="slide-body">本專案採用純靜態模組化架構（無須付費伺服器，100% 免費託管）：
1. 將本資料夾上傳到你的 GitHub 儲存庫 (Repository)。
2. 登入 <strong>Vercel.com</strong> 或 <strong>Cloudflare Pages</strong>（皆可直接使用 GitHub 帳號免費登入）。
3. 點選「Add New Project / Connect to Git」選擇此儲存庫，Framework Preset 選擇「Other (Static)」，直接點選 <strong>Deploy</strong>！
4. 30 秒內就會獲得一個專屬免費網址（例如 <code>https://kids-academy.vercel.app</code>），在兩台孩子的筆電上各自打開網址並加入書籤，進度會自動存在各自筆電的瀏覽器中！</div>
        </div>

        <div class="slide-card">
          <h3>🧩 4. 超好擴充的架構設計：未來想新增更多課程或打字關卡怎麼做？</h3>
          <div class="slide-body">我們特別把「課程資料」與「程式畫面」完全分離，你未來只需要編輯 <code>data/</code> 資料夾底下的兩個檔案：
• <strong>想新增打字練習關卡</strong>：打開 <code>data/typing-drills.js</code>，在 <code>drills</code> 陣列中新增一行 <code>{ id: '...', name: '...', text: '...' }</code>，打字道館就會自動產生新關卡與手指提示！
• <strong>想新增更多單元或第 4 個世界（例如：Scratch 程式設計、Canva 簡報設計、進階英文）</strong>：打開 <code>data/curriculum.js</code>，複製任一單元的格式貼上，主地圖與進度系統就會自動長出新課程！</div>
        </div>
      </div>
    `;
  },

  exportProgress() {
    const code = btoa(encodeURIComponent(JSON.stringify({
      profiles: this.profiles,
      activeProfileId: this.activeProfileId
    })));
    if (window.UIModal && window.UIModal.prompt) {
      window.UIModal.prompt('請複製 (Ctrl + C) 以下進度備份代碼，可在另一台電腦匯入：', code, '💾 匯出學習進度代碼');
    } else {
      prompt('請複製 (Ctrl + C) 以下進度備份代碼，可在另一台電腦匯入：', code);
    }
  },

  importProgress() {
    const promptFn = (window.UIModal && window.UIModal.prompt) ? window.UIModal.prompt.bind(window.UIModal) : window.prompt;
    const alertFn = (window.UIModal && window.UIModal.alert) ? window.UIModal.alert.bind(window.UIModal) : window.alert;

    const handleImportCode = (code) => {
      if (!code) return;
      try {
        const parsed = JSON.parse(decodeURIComponent(atob(code.trim())));
        if (parsed && parsed.profiles) {
          this.profiles = parsed.profiles;
          if (parsed.activeProfileId) this.activeProfileId = parsed.activeProfileId;
          this.save();
          this.renderAll();
          if (window.UIModal && window.UIModal.toast) {
            window.UIModal.toast('🎉 學習進度匯入成功！');
          } else {
            alertFn('🎉 學習進度匯入成功！');
          }
        } else {
          alertFn('⚠️ 代碼格式不正確，請重新確認喔！');
        }
      } catch (e) {
        alertFn('⚠️ 代碼格式不正確，請重新確認喔！');
      }
    };

    const res = promptFn('請貼上 (Ctrl + V) 之前匯出的進度備份代碼：', '', '📥 匯入學習進度代碼');
    if (res && typeof res.then === 'function') {
      res.then(handleImportCode);
    } else if (res) {
      handleImportCode(res);
    }
  },

  speakEnglish(text) {
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = 'en-US';
        utter.rate = 0.88;
        window.speechSynthesis.speak(utter);
      } catch (e) {
        console.warn('SpeechSynthesis error:', e);
      }
      if (window.UIModal && window.UIModal.toast) {
        window.UIModal.toast(`🔊 英文發音：${text}`);
      }
    } else {
      if (window.UIModal && window.UIModal.toast) {
        window.UIModal.toast(`🔊 英文單字：${text}`);
      } else {
        alert(`英文發音：${text}`);
      }
    }
  },

  formatMarkdownBold(str) {
    return String(str)
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/`([^`]+)`/g, '<code style="background:#e0f2fe; color:#0369a1; padding:2px 6px; border-radius:6px; font-weight:800;">$1</code>');
  },

  renderCardVisual(visualType) {
    const wrap = (svg, caption) => `
      <div class="slide-visual-diagram" data-visual="${visualType}">
        ${svg}
        <div class="visual-caption">📸 <span>${caption}</span></div>
      </div>
    `;

    switch (visualType) {
      case 'rbx-viewport-nav':
        return wrap(`
          <svg viewBox="0 0 720 270" xmlns="http://www.w3.org/2000/svg" font-family="system-ui, sans-serif">
            <rect width="720" height="270" fill="#1e2228"/>
            <!-- Top Menu Bar -->
            <rect x="0" y="0" width="720" height="28" fill="#2d323b"/>
            <text x="14" y="18" fill="#94a3b8" font-size="11" font-weight="700">File</text>
            <rect x="46" y="4" width="48" height="24" rx="4" fill="#1e2228"/>
            <text x="55" y="19" fill="#38bdf8" font-size="11" font-weight="800">Home</text>
            <text x="108" y="18" fill="#94a3b8" font-size="11" font-weight="700">Model</text>
            <text x="156" y="18" fill="#94a3b8" font-size="11" font-weight="700">Test</text>
            <text x="198" y="18" fill="#94a3b8" font-size="11" font-weight="700">View</text>
            <!-- Top Ribbon -->
            <rect x="0" y="28" width="720" height="44" fill="#252930"/>
            <rect x="12" y="34" width="44" height="32" rx="5" fill="#334155"/><text x="20" y="54" fill="#e2e8f0" font-size="10" font-weight="700">Select</text>
            <rect x="62" y="34" width="44" height="32" rx="5" fill="#334155"/><text x="70" y="54" fill="#e2e8f0" font-size="10" font-weight="700">Move</text>
            <rect x="112" y="34" width="44" height="32" rx="5" fill="#334155"/><text x="121" y="54" fill="#e2e8f0" font-size="10" font-weight="700">Scale</text>
            <rect x="162" y="34" width="48" height="32" rx="5" fill="#334155"/><text x="169" y="54" fill="#e2e8f0" font-size="10" font-weight="700">Rotate</text>
            <rect x="224" y="34" width="48" height="32" rx="5" fill="#1d4ed8"/><text x="237" y="54" fill="#ffffff" font-size="10" font-weight="800">Part</text>
            <rect x="280" y="34" width="54" height="32" rx="5" fill="#15803d"/><text x="292" y="54" fill="#ffffff" font-size="10" font-weight="800">▶ Play</text>
            <!-- 3D Viewport -->
            <rect x="10" y="80" width="500" height="178" rx="6" fill="#7dd3fc"/>
            <polygon points="10,205 510,205 510,258 10,258" fill="#64748b"/>
            <line x1="10" y1="222" x2="510" y2="222" stroke="#94a3b8" stroke-width="1" stroke-dasharray="4 4"/>
            <line x1="10" y1="240" x2="510" y2="240" stroke="#94a3b8" stroke-width="1" stroke-dasharray="4 4"/>
            <text x="24" y="248" fill="#e2e8f0" font-size="11" font-weight="700">Baseplate (灰色地板)</text>
            <!-- Selected 3D Part -->
            <rect x="245" y="152" width="76" height="44" rx="4" fill="#38bdf8" stroke="#facc15" stroke-width="3"/>
            <text x="268" y="178" fill="#0f172a" font-size="12" font-weight="900">Part</text>
            <!-- Right Side Panels -->
            <rect x="520" y="80" width="190" height="86" rx="6" fill="#252930" stroke="#475569"/>
            <text x="530" y="97" fill="#f8fafc" font-size="11" font-weight="800">📂 Explorer (物件清單)</text>
            <text x="536" y="116" fill="#94a3b8" font-size="10">▾ 🌐 Workspace</text>
            <rect x="546" y="122" width="140" height="18" rx="3" fill="#2563eb"/>
            <text x="554" y="135" fill="#ffffff" font-size="10" font-weight="700">🧱 Part (已選取)</text>
            <text x="548" y="154" fill="#94a3b8" font-size="10">🧭 SpawnLocation</text>
            <rect x="520" y="172" width="190" height="86" rx="6" fill="#252930" stroke="#475569"/>
            <text x="530" y="189" fill="#f8fafc" font-size="11" font-weight="800">🎛️ Properties (屬性面板)</text>
            <text x="536" y="210" fill="#cbd5e1" font-size="10">Color: Electric Blue</text>
            <text x="536" y="227" fill="#cbd5e1" font-size="10">Material: Plastic</text>
            <text x="536" y="244" fill="#4ade80" font-size="10" font-weight="800">Anchored: [✓]</text>
            <!-- Callout 1: WASD + Right Click -->
            <rect x="24" y="92" width="186" height="48" rx="8" fill="#0f172a" fill-opacity="0.88" stroke="#ef4444" stroke-width="2"/>
            <circle cx="24" cy="92" r="11" fill="#ef4444"/><text x="20" y="96" fill="#fff" font-size="11" font-weight="900">1</text>
            <text x="40" y="112" fill="#facc15" font-size="11" font-weight="800">WASD 飛行移動</text>
            <text x="40" y="129" fill="#f8fafc" font-size="10">按住滑鼠右鍵拖曳轉視角</text>
            <!-- Callout 2: F key -->
            <rect x="336" y="102" width="160" height="38" rx="8" fill="#0f172a" fill-opacity="0.88" stroke="#f59e0b" stroke-width="2"/>
            <circle cx="336" cy="102" r="11" fill="#f59e0b"/><text x="332" y="106" fill="#0f172a" font-size="11" font-weight="900">2</text>
            <text x="352" y="125" fill="#fde047" font-size="11" font-weight="800">按 F 鍵飛到積木前！</text>
            <line x1="350" y1="140" x2="310" y2="154" stroke="#f59e0b" stroke-width="2" stroke-dasharray="4 3"/>
            <!-- Callout 3: Right panels -->
            <circle cx="520" cy="80" r="11" fill="#ef4444"/><text x="516" y="84" fill="#fff" font-size="11" font-weight="900">3</text>
          </svg>
        `, '介面地圖：① 中間是 3D 畫面 (WASD + 右鍵飛行) ② 按 F 鍵聚焦積木 ③ 右邊是 Explorer 清單與 Properties 屬性面板');

      case 'rbx-ribbon-tools':
        return wrap(`
          <svg viewBox="0 0 720 230" xmlns="http://www.w3.org/2000/svg" font-family="system-ui, sans-serif">
            <rect width="720" height="230" fill="#1e2228"/>
            <!-- Ribbon Header -->
            <rect x="0" y="0" width="720" height="28" fill="#2d323b"/>
            <rect x="46" y="4" width="52" height="24" rx="4" fill="#252930"/>
            <text x="56" y="19" fill="#38bdf8" font-size="11" font-weight="800">Home</text>
            <text x="114" y="19" fill="#94a3b8" font-size="11" font-weight="700">Model</text>
            <!-- Tool Buttons Bar -->
            <rect x="0" y="28" width="720" height="86" fill="#252930"/>
            <!-- Move -->
            <rect x="24" y="38" width="84" height="64" rx="8" fill="#334155" stroke="#ef4444" stroke-width="2.5"/>
            <text x="54" y="65" fill="#ef4444" font-size="20" font-weight="900">✥</text>
            <text x="46" y="90" fill="#f8fafc" font-size="12" font-weight="800">Move</text>
            <circle cx="24" cy="38" r="11" fill="#ef4444"/><text x="20" y="42" fill="#fff" font-size="11" font-weight="900">2</text>
            <!-- Scale -->
            <rect x="122" y="38" width="84" height="64" rx="8" fill="#334155" stroke="#22c55e" stroke-width="2.5"/>
            <text x="150" y="65" fill="#4ade80" font-size="20" font-weight="900">⤢</text>
            <text x="145" y="90" fill="#f8fafc" font-size="12" font-weight="800">Scale</text>
            <circle cx="122" cy="38" r="11" fill="#22c55e"/><text x="118" y="42" fill="#0f172a" font-size="11" font-weight="900">3</text>
            <!-- Rotate -->
            <rect x="220" y="38" width="84" height="64" rx="8" fill="#334155" stroke="#3b82f6" stroke-width="2.5"/>
            <text x="250" y="65" fill="#60a5fa" font-size="20" font-weight="900">↻</text>
            <text x="240" y="90" fill="#f8fafc" font-size="12" font-weight="800">Rotate</text>
            <circle cx="220" cy="38" r="11" fill="#3b82f6"/><text x="216" y="42" fill="#fff" font-size="11" font-weight="900">4</text>
            <!-- Part -->
            <rect x="334" y="38" width="110" height="64" rx="8" fill="#1d4ed8" stroke="#facc15" stroke-width="3"/>
            <text x="378" y="65" fill="#fde047" font-size="20" font-weight="900">🧱</text>
            <text x="360" y="90" fill="#ffffff" font-size="12" font-weight="900">Part ▾</text>
            <circle cx="334" cy="38" r="11" fill="#facc15"/><text x="330" y="42" fill="#0f172a" font-size="11" font-weight="900">1</text>
            <!-- Part Dropdown Hint -->
            <rect x="466" y="34" width="234" height="72" rx="8" fill="#0f172a" stroke="#475569"/>
            <text x="478" y="54" fill="#fde047" font-size="11" font-weight="800">點 Part ▾ 可選 4 種形狀：</text>
            <text x="478" y="75" fill="#e2e8f0" font-size="11">🟦 Block 方塊   ⚪ Sphere 球體</text>
            <text x="478" y="95" fill="#e2e8f0" font-size="11">📐 Wedge 斜坡   🛢️ Cylinder 圓柱</text>
            <!-- Bottom Axis Legend -->
            <rect x="24" y="128" width="672" height="84" rx="10" fill="#0f172a" stroke="#334155"/>
            <text x="42" y="152" fill="#38bdf8" font-size="12" font-weight="800">🌈 Move / Scale 彩色箭頭口訣：</text>
            <circle cx="56" cy="182" r="8" fill="#ef4444"/><text x="72" y="186" fill="#fca5a5" font-size="12" font-weight="700">X 紅箭頭 = 左右</text>
            <circle cx="240" cy="182" r="8" fill="#22c55e"/><text x="256" y="186" fill="#86efac" font-size="12" font-weight="700">Y 綠箭頭 = 上下高度</text>
            <circle cx="460" cy="182" r="8" fill="#3b82f6"/><text x="476" y="186" fill="#93c5fd" font-size="12" font-weight="700">Z 藍箭頭 = 前後</text>
          </svg>
        `, '上方 Home 工具列位置：① 按 Part 新增積木 ② Move 移動 ③ Scale 縮放大小 ④ Rotate 旋轉角度');

      case 'rbx-explorer-anchored':
        return wrap(`
          <svg viewBox="0 0 720 260" xmlns="http://www.w3.org/2000/svg" font-family="system-ui, sans-serif">
            <rect width="720" height="260" fill="#1e2228"/>
            <!-- Top Ribbon -->
            <rect x="0" y="0" width="720" height="58" fill="#252930"/>
            <rect x="30" y="10" width="84" height="38" rx="6" fill="#334155" stroke="#facc15" stroke-width="2.5"/>
            <text x="43" y="33" fill="#fde047" font-size="12" font-weight="900">⚓ Anchor</text>
            <circle cx="30" cy="10" r="11" fill="#facc15"/><text x="26" y="14" fill="#0f172a" font-size="11" font-weight="900">1</text>
            <rect x="136" y="10" width="84" height="38" rx="6" fill="#15803d" stroke="#4ade80" stroke-width="2"/>
            <text x="155" y="33" fill="#ffffff" font-size="12" font-weight="900">▶ Play</text>
            <circle cx="136" cy="10" r="11" fill="#22c55e"/><text x="132" y="14" fill="#0f172a" font-size="11" font-weight="900">3</text>
            <!-- Left 3D Preview -->
            <rect x="14" y="70" width="290" height="176" rx="8" fill="#0f172a" stroke="#334155"/>
            <rect x="46" y="110" width="96" height="26" rx="4" fill="#22c55e" stroke="#facc15" stroke-width="2"/>
            <text x="52" y="127" fill="#0f172a" font-size="10" font-weight="900">Anchored ✅</text>
            <text x="36" y="154" fill="#86efac" font-size="10" font-weight="700">穩穩浮在空中！</text>
            <rect x="180" y="176" width="92" height="26" rx="4" fill="#ef4444" transform="rotate(14 226 189)"/>
            <text x="172" y="232" fill="#fca5a5" font-size="10" font-weight="700">❌ 沒打勾就會掉下去！</text>
            <!-- Right Explorer + Properties -->
            <rect x="320" y="70" width="175" height="176" rx="8" fill="#252930" stroke="#475569"/>
            <text x="332" y="90" fill="#f8fafc" font-size="11" font-weight="800">📂 Explorer</text>
            <text x="336" y="112" fill="#94a3b8" font-size="11">▾ 🌐 Workspace</text>
            <rect x="344" y="120" width="138" height="22" rx="4" fill="#2563eb"/>
            <text x="352" y="135" fill="#fff" font-size="11" font-weight="800">🧱 SkyPlatform</text>
            <rect x="506" y="70" width="200" height="176" rx="8" fill="#252930" stroke="#475569"/>
            <text x="518" y="90" fill="#f8fafc" font-size="11" font-weight="800">🎛️ Properties - Part</text>
            <text x="520" y="114" fill="#94a3b8" font-size="10">▾ Behavior (物理行為)</text>
            <!-- Highlighted Anchored row -->
            <rect x="514" y="126" width="184" height="32" rx="6" fill="#713f12" stroke="#facc15" stroke-width="2.5"/>
            <text x="526" y="146" fill="#fef08a" font-size="12" font-weight="900">Anchored</text>
            <rect x="664" y="132" width="20" height="20" rx="4" fill="#22c55e"/>
            <text x="669" y="147" fill="#0f172a" font-size="14" font-weight="900">✓</text>
            <circle cx="514" cy="126" r="11" fill="#ef4444"/><text x="510" y="130" fill="#fff" font-size="11" font-weight="900">2</text>
            <text x="526" y="182" fill="#cbd5e1" font-size="10">CanCollide: [✓]</text>
            <text x="526" y="202" fill="#cbd5e1" font-size="10">CastShadow: [✓]</text>
          </svg>
        `, '固定空中積木的兩個位置：① 按上方工具列 ⚓ Anchor，或 ② 在右下角 Properties 把 Anchored 打勾 ✓ ➔ ③ 按 ▶ Play 測試！');

      case 'rbx-obby-parts':
        return wrap(`
          <svg viewBox="0 0 720 230" xmlns="http://www.w3.org/2000/svg" font-family="system-ui, sans-serif">
            <rect width="720" height="230" fill="#1e2228"/>
            <rect x="14" y="14" width="692" height="202" rx="10" fill="#0f172a" stroke="#334155"/>
            <!-- SpawnLocation -->
            <rect x="38" y="116" width="120" height="34" rx="6" fill="#94a3b8" stroke="#facc15" stroke-width="2.5"/>
            <text x="56" y="137" fill="#0f172a" font-size="11" font-weight="900">🧭 SpawnLocation</text>
            <circle cx="38" cy="116" r="11" fill="#facc15"/><text x="34" y="120" fill="#0f172a" font-size="11" font-weight="900">1</text>
            <text x="42" y="172" fill="#cbd5e1" font-size="10" font-weight="700">在 Model ➔ Spawn 新增</text>
            <!-- Safe Platform -->
            <rect x="206" y="96" width="126" height="30" rx="6" fill="#22c55e" stroke="#86efac" stroke-width="2"/>
            <text x="232" y="115" fill="#0f172a" font-size="11" font-weight="900">安全平台 (Part)</text>
            <circle cx="206" cy="96" r="11" fill="#22c55e"/><text x="202" y="100" fill="#0f172a" font-size="11" font-weight="900">2</text>
            <text x="212" y="148" fill="#86efac" font-size="10" font-weight="700">間距 6~10 Studs + Anchored ✓</text>
            <!-- KillBrick / Lava -->
            <rect x="386" y="110" width="144" height="32" rx="6" fill="#ef4444" stroke="#fca5a5" stroke-width="3"/>
            <text x="404" y="130" fill="#ffffff" font-size="11" font-weight="900">🔥 KillBrick (岩漿)</text>
            <circle cx="386" cy="110" r="11" fill="#ef4444"/><text x="382" y="114" fill="#fff" font-size="11" font-weight="900">3</text>
            <text x="386" y="164" fill="#fca5a5" font-size="10" font-weight="700">Properties 設為 Material: Neon</text>
            <!-- Goal -->
            <rect x="576" y="82" width="106" height="34" rx="6" fill="#facc15"/>
            <text x="594" y="103" fill="#0f172a" font-size="11" font-weight="900">🏆 終點獎盃</text>
            <path d="M 162 110 Q 182 70 202 92" fill="none" stroke="#38bdf8" stroke-width="2" stroke-dasharray="4 3"/>
            <path d="M 336 92 Q 360 64 384 102" fill="none" stroke="#38bdf8" stroke-width="2" stroke-dasharray="4 3"/>
          </svg>
        `, '跑酷關卡三寶：① 起點 SpawnLocation ② 綠色安全平台 (Anchored ✓) ③ 紅色發光 Neon 岩漿磚 (KillBrick)');

      case 'rbx-obby-checkpoint':
        return wrap(`
          <svg viewBox="0 0 720 230" xmlns="http://www.w3.org/2000/svg" font-family="system-ui, sans-serif">
            <rect width="720" height="230" fill="#1e2228"/>
            <!-- Left Toolbox Panel -->
            <rect x="12" y="12" width="248" height="206" rx="8" fill="#252930" stroke="#475569"/>
            <text x="26" y="34" fill="#f8fafc" font-size="12" font-weight="800">🧰 Toolbox (免費素材庫)</text>
            <circle cx="12" cy="12" r="11" fill="#facc15"/><text x="8" y="16" fill="#0f172a" font-size="11" font-weight="900">1</text>
            <rect x="24" y="46" width="222" height="28" rx="6" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
            <text x="34" y="64" fill="#38bdf8" font-size="11" font-weight="700">🔍 搜尋: Obby Checkpoint</text>
            <circle cx="24" cy="46" r="11" fill="#38bdf8"/><text x="20" y="50" fill="#0f172a" font-size="11" font-weight="900">2</text>
            <rect x="24" y="88" width="104" height="58" rx="6" fill="#334155"/><text x="40" y="120" fill="#fde047" font-size="11" font-weight="800">🚩 存檔旗幟</text>
            <rect x="140" y="88" width="104" height="58" rx="6" fill="#334155"/><text x="154" y="120" fill="#93c5fd" font-size="11" font-weight="800">🟦 移動平台</text>
            <text x="24" y="176" fill="#94a3b8" font-size="10">💡 點一下就能把官方範本放到地圖！</text>
            <!-- Right 3D Stage -->
            <rect x="274" y="12" width="434" height="206" rx="8" fill="#0f172a" stroke="#334155"/>
            <rect x="304" y="126" width="110" height="32" rx="6" fill="#facc15" stroke="#fde047" stroke-width="2"/>
            <text x="320" y="146" fill="#0f172a" font-size="11" font-weight="900">🚩 Checkpoint</text>
            <circle cx="304" cy="126" r="11" fill="#ef4444"/><text x="300" y="130" fill="#fff" font-size="11" font-weight="900">3</text>
            <rect x="486" y="114" width="150" height="30" rx="6" fill="#3b82f6" stroke="#93c5fd" stroke-width="2"/>
            <text x="504" y="133" fill="#ffffff" font-size="11" font-weight="800">⬅ 移動平台 ➡</text>
            <text x="304" y="188" fill="#cbd5e1" font-size="11" font-weight="700">每 4~5 關放一個存檔點，掉下去就從旗幟復活！</text>
          </svg>
        `, '① 打開 Home ➔ Toolbox ② 搜尋 Checkpoint 存檔旗幟 ③ 放到每 4~5 關後面，再搭配左右移動平台！');

      case 'rbx-add-script':
        return wrap(`
          <svg viewBox="0 0 720 250" xmlns="http://www.w3.org/2000/svg" font-family="system-ui, sans-serif">
            <rect width="720" height="250" fill="#1e2228"/>
            <!-- Explorer Panel -->
            <rect x="14" y="14" width="230" height="222" rx="8" fill="#252930" stroke="#475569"/>
            <text x="26" y="34" fill="#f8fafc" font-size="12" font-weight="800">📂 Explorer</text>
            <text x="30" y="58" fill="#94a3b8" font-size="11">▾ 🌐 Workspace</text>
            <rect x="38" y="68" width="194" height="28" rx="5" fill="#2563eb"/>
            <text x="48" y="86" fill="#ffffff" font-size="11" font-weight="800">⚡ SpeedPad (Part)</text>
            <!-- Plus button -->
            <circle cx="214" cy="82" r="10" fill="#facc15"/>
            <text x="209" y="86" fill="#0f172a" font-size="14" font-weight="900">+</text>
            <circle cx="232" cy="68" r="11" fill="#ef4444"/><text x="228" y="72" fill="#fff" font-size="11" font-weight="900">1</text>
            <!-- Popup Insert Menu -->
            <rect x="260" y="42" width="170" height="156" rx="8" fill="#1e293b" stroke="#facc15" stroke-width="2.5"/>
            <text x="272" y="62" fill="#94a3b8" font-size="10" font-weight="700">Insert Object (新增元件)</text>
            <rect x="270" y="72" width="150" height="28" rx="5" fill="#16a34a"/>
            <text x="282" y="90" fill="#ffffff" font-size="12" font-weight="900">📜 Script</text>
            <circle cx="260" cy="72" r="11" fill="#22c55e"/><text x="256" y="76" fill="#0f172a" font-size="11" font-weight="900">2</text>
            <text x="282" y="122" fill="#cbd5e1" font-size="11">👆 ClickDetector</text>
            <text x="282" y="146" fill="#cbd5e1" font-size="11">💬 ProximityPrompt</text>
            <text x="282" y="170" fill="#cbd5e1" font-size="11">💡 PointLight</text>
            <!-- Script Editor Preview -->
            <rect x="448" y="14" width="258" height="222" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
            <text x="462" y="36" fill="#38bdf8" font-size="11" font-weight="800">📜 Script 編輯器</text>
            <circle cx="448" cy="14" r="11" fill="#38bdf8"/><text x="444" y="18" fill="#0f172a" font-size="11" font-weight="900">3</text>
            <text x="462" y="66" fill="#f472b6" font-size="11" font-family="monospace">local part = script.Parent</text>
            <text x="462" y="92" fill="#a7f3d0" font-size="11" font-family="monospace">part.Touched:Connect(</text>
            <text x="476" y="114" fill="#fde047" font-size="11" font-family="monospace">function(hit)</text>
            <text x="490" y="138" fill="#93c5fd" font-size="11" font-family="monospace">-- 檢查 Humanoid!</text>
            <text x="462" y="162" fill="#fde047" font-size="11" font-family="monospace">end)</text>
          </svg>
        `, '新增程式步驟：① 在 Explorer 滑鼠移到 Part 上按 + 號 ② 點選綠色 Script ③ 在右側編輯器寫下觸碰邏輯！');

      case 'rbx-script-editor':
        return wrap(`
          <svg viewBox="0 0 720 220" xmlns="http://www.w3.org/2000/svg" font-family="system-ui, sans-serif">
            <rect width="720" height="220" fill="#1e2228"/>
            <rect x="14" y="14" width="220" height="192" rx="8" fill="#252930" stroke="#475569"/>
            <text x="26" y="36" fill="#f8fafc" font-size="11" font-weight="800">🎛️ Humanoid 屬性</text>
            <circle cx="14" cy="14" r="11" fill="#facc15"/><text x="10" y="18" fill="#0f172a" font-size="11" font-weight="900">1</text>
            <text x="26" y="68" fill="#fde047" font-size="11" font-weight="700">WalkSpeed: 16 ➔ 40 (加速)</text>
            <text x="26" y="96" fill="#86efac" font-size="11" font-weight="700">JumpPower: 50 ➔ 120 (彈跳)</text>
            <text x="26" y="124" fill="#93c5fd" font-size="11" font-weight="700">Health: 100 (血量)</text>
            <rect x="252" y="14" width="454" height="192" rx="8" fill="#0f172a" stroke="#22c55e" stroke-width="2"/>
            <text x="268" y="36" fill="#4ade80" font-size="11" font-weight="800">🪙 防連點冷卻 (Debounce) ＋ 排行榜 (leaderstats)</text>
            <circle cx="252" cy="14" r="11" fill="#22c55e"/><text x="248" y="18" fill="#0f172a" font-size="11" font-weight="900">2</text>
            <text x="268" y="68" fill="#f472b6" font-size="11" font-family="monospace">local debounce = false  -- 冷卻開關</text>
            <text x="268" y="94" fill="#a7f3d0" font-size="11" font-family="monospace">if not debounce then</text>
            <text x="288" y="118" fill="#fde047" font-size="11" font-family="monospace">debounce = true</text>
            <text x="288" y="142" fill="#93c5fd" font-size="11" font-family="monospace">player.leaderstats.Coins.Value += 1</text>
            <text x="288" y="166" fill="#cbd5e1" font-size="11" font-family="monospace">task.wait(1) ; debounce = false</text>
            <text x="268" y="188" fill="#a7f3d0" font-size="11" font-family="monospace">end</text>
          </svg>
        `, '① 改 WalkSpeed/JumpPower 就能做加速板與彈跳板 ② 加上 debounce 冷卻開關，金幣才不會一秒加一百次！');

      case 'rbx-publish-menu':
        return wrap(`
          <svg viewBox="0 0 720 250" xmlns="http://www.w3.org/2000/svg" font-family="system-ui, sans-serif">
            <rect width="720" height="250" fill="#1e2228"/>
            <!-- File Dropdown -->
            <rect x="14" y="14" width="210" height="222" rx="8" fill="#252930" stroke="#475569"/>
            <rect x="14" y="14" width="60" height="26" rx="4" fill="#2563eb"/>
            <text x="28" y="31" fill="#fff" font-size="11" font-weight="800">File</text>
            <circle cx="14" cy="14" r="11" fill="#facc15"/><text x="10" y="18" fill="#0f172a" font-size="11" font-weight="900">1</text>
            <text x="26" y="64" fill="#cbd5e1" font-size="11">New / Open...</text>
            <text x="26" y="90" fill="#cbd5e1" font-size="11">Save to Roblox</text>
            <rect x="22" y="106" width="194" height="32" rx="6" fill="#16a34a" stroke="#4ade80" stroke-width="2"/>
            <text x="32" y="126" fill="#ffffff" font-size="11" font-weight="900">🚀 Publish to Roblox...</text>
            <circle cx="22" cy="106" r="11" fill="#22c55e"/><text x="18" y="110" fill="#0f172a" font-size="11" font-weight="900">2</text>
            <text x="26" y="162" fill="#cbd5e1" font-size="11">⚙️ Game Settings</text>
            <!-- Permissions Modal -->
            <rect x="242" y="14" width="246" height="222" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
            <text x="256" y="36" fill="#38bdf8" font-size="12" font-weight="800">⚙️ Game Settings ➔ Permissions</text>
            <circle cx="242" cy="14" r="11" fill="#38bdf8"/><text x="238" y="18" fill="#0f172a" font-size="11" font-weight="900">3</text>
            <rect x="256" y="54" width="218" height="44" rx="6" fill="#14532d" stroke="#22c55e" stroke-width="2"/>
            <text x="268" y="74" fill="#86efac" font-size="12" font-weight="900">🔘 Private (只有自己能玩)</text>
            <text x="268" y="90" fill="#bbf7d0" font-size="10">✅ 最推薦！自己測試超安全</text>
            <rect x="256" y="110" width="218" height="44" rx="6" fill="#1e3a8a" stroke="#60a5fa" stroke-width="2"/>
            <text x="268" y="130" fill="#bfdbfe" font-size="12" font-weight="900">🔘 Friends (只限好友)</text>
            <text x="268" y="146" fill="#dbeafe" font-size="10">✅ 可邀哥哥妹妹或同學一起玩</text>
            <text x="256" y="184" fill="#94a3b8" font-size="11">⚪ Public (公開給所有人)</text>
            <!-- Virus Check Box -->
            <rect x="504" y="14" width="202" height="222" rx="8" fill="#252930" stroke="#ef4444" stroke-width="2"/>
            <text x="516" y="36" fill="#fca5a5" font-size="11" font-weight="900">🛡️ Toolbox 安全檢查</text>
            <text x="516" y="66" fill="#cbd5e1" font-size="11">📂 ToolboxCar</text>
            <text x="526" y="92" fill="#86efac" font-size="11">✓ VehicleSeat (正常)</text>
            <rect x="522" y="106" width="172" height="32" rx="5" fill="#7f1d1d" stroke="#ef4444"/>
            <text x="530" y="126" fill="#fecaca" font-size="11" font-weight="800">❌ Virus / Infection</text>
            <text x="516" y="164" fill="#fde047" font-size="10" font-weight="700">發現可疑 Script 馬上按</text>
            <text x="516" y="182" fill="#fde047" font-size="10" font-weight="700">Delete 鍵刪掉！</text>
          </svg>
        `, '安全發佈 3 步驟：① 點左上角 File ② 選 Publish to Roblox ③ 在 Permissions 選 Private 或 Friends，並檢查 Toolbox 裡的可疑 Script！');

      case 'rbx-disaster-unanchor':
        return wrap(`
          <svg viewBox="0 0 720 220" xmlns="http://www.w3.org/2000/svg" font-family="system-ui, sans-serif">
            <rect width="720" height="220" fill="#1e2228"/>
            <rect x="14" y="14" width="210" height="192" rx="8" fill="#0f172a" stroke="#22c55e" stroke-width="2"/>
            <text x="28" y="38" fill="#86efac" font-size="12" font-weight="900">1. 安全大廳 (Lobby)</text>
            <rect x="44" y="64" width="150" height="54" rx="6" fill="#334155"/>
            <text x="64" y="95" fill="#f8fafc" font-size="11" font-weight="800">⏱️ 倒數 15 秒集合</text>
            <text x="34" y="150" fill="#cbd5e1" font-size="10">時間到 ➔ 傳送到小島！</text>
            <rect x="242" y="14" width="224" height="192" rx="8" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>
            <text x="256" y="38" fill="#fde047" font-size="12" font-weight="900">2. 平常的房子 (Anchored)</text>
            <rect x="292" y="72" width="120" height="68" rx="4" fill="#64748b" stroke="#22c55e" stroke-width="2"/>
            <text x="314" y="110" fill="#fff" font-size="11" font-weight="800">🏠 Anchored = true</text>
            <text x="268" y="168" fill="#86efac" font-size="10">穩穩站在地面上！</text>
            <rect x="484" y="14" width="222" height="192" rx="8" fill="#0f172a" stroke="#ef4444" stroke-width="2"/>
            <text x="498" y="38" fill="#fca5a5" font-size="12" font-weight="900">3. 龍捲風來了！(Unanchor)</text>
            <rect x="524" y="70" width="52" height="32" rx="4" fill="#94a3b8" transform="rotate(-18 550 86)"/>
            <rect x="598" y="94" width="52" height="32" rx="4" fill="#94a3b8" transform="rotate(24 624 110)"/>
            <text x="506" y="152" fill="#fca5a5" font-size="11" font-weight="800">🌪️ Anchored = false</text>
            <text x="506" y="174" fill="#cbd5e1" font-size="10">積木散開飛起來啦！</text>
          </svg>
        `, '回合制災難地圖結構：① Lobby 大廳倒數 ② 房子預設 Anchored=true ③ 災難腳本切換成 Anchored=false 製造破壞！');

      case 'rbx-proximity-prompt':
        return wrap(`
          <svg viewBox="0 0 720 230" xmlns="http://www.w3.org/2000/svg" font-family="system-ui, sans-serif">
            <rect width="720" height="230" fill="#1e2228"/>
            <rect x="14" y="14" width="224" height="202" rx="8" fill="#252930" stroke="#475569"/>
            <text x="26" y="36" fill="#f8fafc" font-size="11" font-weight="800">📂 Explorer ➔ 按 + 新增</text>
            <circle cx="14" cy="14" r="11" fill="#facc15"/><text x="10" y="18" fill="#0f172a" font-size="11" font-weight="900">1</text>
            <text x="30" y="64" fill="#94a3b8" font-size="11">▾ 🍓 StrawberryPart</text>
            <rect x="44" y="76" width="180" height="28" rx="5" fill="#16a34a"/>
            <text x="54" y="94" fill="#ffffff" font-size="11" font-weight="900">💬 ProximityPrompt</text>
            <text x="44" y="126" fill="#cbd5e1" font-size="11">📜 HarvestScript</text>
            <rect x="256" y="14" width="228" height="202" rx="8" fill="#252930" stroke="#38bdf8" stroke-width="2"/>
            <text x="268" y="36" fill="#38bdf8" font-size="11" font-weight="800">🎛️ Properties 設定</text>
            <circle cx="256" cy="14" r="11" fill="#38bdf8"/><text x="252" y="18" fill="#0f172a" font-size="11" font-weight="900">2</text>
            <text x="270" y="72" fill="#e2e8f0" font-size="11">ActionText: <tspan fill="#fde047" font-weight="800">"採收果實"</tspan></text>
            <text x="270" y="102" fill="#e2e8f0" font-size="11">KeyboardKeyCode: <tspan fill="#4ade80" font-weight="800">E</tspan></text>
            <text x="270" y="132" fill="#e2e8f0" font-size="11">HoldDuration: <tspan fill="#cbd5e1" font-weight="800">0.5 秒</tspan></text>
            <rect x="502" y="14" width="204" height="202" rx="8" fill="#0f172a" stroke="#22c55e" stroke-width="2"/>
            <text x="516" y="36" fill="#86efac" font-size="11" font-weight="800">🎮 遊戲內實際畫面</text>
            <circle cx="502" cy="14" r="11" fill="#22c55e"/><text x="498" y="18" fill="#0f172a" font-size="11" font-weight="900">3</text>
            <circle cx="604" cy="126" r="34" fill="#1e293b" stroke="#facc15" stroke-width="3"/>
            <rect x="588" y="106" width="32" height="26" rx="5" fill="#f8fafc"/>
            <text x="598" y="124" fill="#0f172a" font-size="15" font-weight="900">E</text>
            <text x="580" y="148" fill="#fde047" font-size="11" font-weight="800">採收果實</text>
          </svg>
        `, '① 在果實 Part 按 + 加入 ProximityPrompt ② 在 Properties 設定按鈕 E 與文字 ③ 玩家靠近就會自動跳出按 E 圈圈！');

      case 'rbx-click-detector':
        return wrap(`
          <svg viewBox="0 0 720 230" xmlns="http://www.w3.org/2000/svg" font-family="system-ui, sans-serif">
            <rect width="720" height="230" fill="#1e2228"/>
            <rect x="14" y="14" width="224" height="202" rx="8" fill="#252930" stroke="#475569"/>
            <text x="26" y="36" fill="#f8fafc" font-size="11" font-weight="800">📂 Explorer ➔ 按 + 新增</text>
            <circle cx="14" cy="14" r="11" fill="#facc15"/><text x="10" y="18" fill="#0f172a" font-size="11" font-weight="900">1</text>
            <text x="30" y="64" fill="#94a3b8" font-size="11">▾ 🚪 FrontDoor (Part)</text>
            <rect x="44" y="76" width="180" height="28" rx="5" fill="#2563eb"/>
            <text x="54" y="94" fill="#ffffff" font-size="11" font-weight="900">👆 ClickDetector</text>
            <text x="44" y="126" fill="#cbd5e1" font-size="11">📜 OpenDoorScript</text>
            <rect x="256" y="14" width="228" height="202" rx="8" fill="#252930" stroke="#38bdf8" stroke-width="2"/>
            <text x="268" y="36" fill="#38bdf8" font-size="11" font-weight="800">🎛️ 開門切換的 Properties</text>
            <circle cx="256" cy="14" r="11" fill="#38bdf8"/><text x="252" y="18" fill="#0f172a" font-size="11" font-weight="900">2</text>
            <text x="270" y="72" fill="#e2e8f0" font-size="11">Transparency: <tspan fill="#fde047" font-weight="800">0 ➔ 0.8</tspan></text>
            <text x="270" y="102" fill="#e2e8f0" font-size="11">CanCollide: <tspan fill="#4ade80" font-weight="800">true ➔ false</tspan></text>
            <text x="270" y="132" fill="#cbd5e1" font-size="10">(變成半透明而且可以穿過去！)</text>
            <rect x="502" y="14" width="204" height="202" rx="8" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>
            <text x="516" y="36" fill="#fde047" font-size="11" font-weight="800">🖱️ 點一下門就打開</text>
            <circle cx="502" cy="14" r="11" fill="#f59e0b"/><text x="498" y="18" fill="#0f172a" font-size="11" font-weight="900">3</text>
            <rect x="564" y="64" width="76" height="118" rx="4" fill="#92400e" fill-opacity="0.5" stroke="#fde047" stroke-width="2" stroke-dasharray="4 3"/>
            <text x="594" y="128" fill="#fff" font-size="22">👆</text>
          </svg>
        `, '① 在門或電燈裡按 + 加入 ClickDetector ② 腳本切換 Transparency 與 CanCollide ③ 滑鼠點一下就開門！');

      case 'rbx-weld-seat':
        return wrap(`
          <svg viewBox="0 0 720 240" xmlns="http://www.w3.org/2000/svg" font-family="system-ui, sans-serif">
            <rect width="720" height="240" fill="#1e2228"/>
            <!-- Top Model Ribbon -->
            <rect x="0" y="0" width="720" height="58" fill="#252930"/>
            <text x="20" y="20" fill="#38bdf8" font-size="11" font-weight="800">Model 分頁 ➔ Constraints (約束黏合)</text>
            <rect x="260" y="10" width="144" height="38" rx="6" fill="#1d4ed8" stroke="#facc15" stroke-width="2.5"/>
            <text x="278" y="33" fill="#ffffff" font-size="12" font-weight="900">🔗 Create ➔ Weld</text>
            <circle cx="260" cy="10" r="11" fill="#facc15"/><text x="256" y="14" fill="#0f172a" font-size="11" font-weight="900">1</text>
            <!-- Explorer -->
            <rect x="14" y="70" width="260" height="156" rx="8" fill="#252930" stroke="#475569"/>
            <text x="26" y="90" fill="#f8fafc" font-size="11" font-weight="800">📂 Explorer - MyBoat</text>
            <circle cx="14" cy="70" r="11" fill="#22c55e"/><text x="10" y="74" fill="#0f172a" font-size="11" font-weight="900">2</text>
            <text x="32" y="114" fill="#cbd5e1" font-size="11">🪵 WoodHull (Anchored: false)</text>
            <text x="32" y="138" fill="#fde047" font-size="11" font-weight="800">🪑 VehicleSeat (駕駛座)</text>
            <text x="32" y="162" fill="#93c5fd" font-size="11" font-weight="800">🔗 WeldConstraint (把船黏起來)</text>
            <text x="32" y="186" fill="#fca5a5" font-size="11">🚀 Thruster (推進器)</text>
            <!-- 3D Boat Preview -->
            <rect x="292" y="70" width="414" height="156" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
            <circle cx="292" cy="70" r="11" fill="#38bdf8"/><text x="288" y="74" fill="#0f172a" font-size="11" font-weight="900">3</text>
            <rect x="360" y="142" width="230" height="34" rx="6" fill="#92400e" stroke="#fde047" stroke-width="2"/>
            <rect x="446" y="112" width="46" height="30" rx="4" fill="#facc15"/>
            <text x="454" y="131" fill="#0f172a" font-size="11" font-weight="900">🪑 座</text>
            <rect x="330" y="146" width="30" height="24" rx="4" fill="#ef4444"/>
            <text x="336" y="162" fill="#fff" font-size="12">🚀</text>
            <path d="M 320 184 Q 480 198 650 184" fill="none" stroke="#38bdf8" stroke-width="3"/>
          </svg>
        `, '造船位置：① 到 Model 分頁按 Create ➔ Weld 黏合積木 ② 確認船身 Anchored=false ③ 放進 VehicleSeat 就能開船！');

      default:
        return '';
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  window.AppState.init();
});
