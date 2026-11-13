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
          🎹 中英打字道館 (19關)
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
            <div class="stat-num">${completedDrillsCount} / 19</div>
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
  // VIEW 3: STANDALONE 19-STAGE TYPING DOJO
  // ==========================================================================
  renderStandaloneDojo(mainEl) {
    mainEl.innerHTML = `
      <div class="card-panel">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem; margin-bottom:1rem;">
          <div>
            <h1 style="font-size:1.5rem; font-weight:900;">🎹 老鷹變獵鷹：中英盲打與注音特訓道館 (共 19 關)</h1>
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
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'en-US';
      utter.rate = 0.88;
      window.speechSynthesis.speak(utter);
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
  }
};

document.addEventListener('DOMContentLoaded', () => {
  window.AppState.init();
});
