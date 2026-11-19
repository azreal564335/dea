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
  zhuyinFont: false,
  soundEnabled: true,
  darkMode: false,
  speakingCardKey: null,
  currentView: 'map', // 'map' | 'lesson' | 'dojo' | 'vocab' | 'certificate' | 'parent'
  currentLessonId: 'w1-l1',
  lessonStep: 'learn', // 'learn' | 'lab' | 'quiz'
  currentCardIdx: 0,
  settingsMenuOpen: false,
  expandedWorldOverrides: {}, // { [profileId]: { [worldId]: boolean } }
  quizAnswers: {},
  quizMistakes: {}, // { lessonId: number }
  quizOrderCache: {}, // { 'lessonId-qIdx': [origIdx...] }

  profiles: {
    'kid-10': {
      id: 'kid-10',
      name: '10歲大探險家',
      avatar: '🦁',
      xp: 0,
      soundEnabled: true,
      completedLessons: {}, // { 'w1-l1': { stars: 3, date: ... } }
      completedDrills: {},  // { 'hr-1': { cpm: 35 } }
      drillHistory: [],
      studioChecks: {}
    },
    'kid-8': {
      id: 'kid-8',
      name: '8歲小探險家',
      avatar: '🦊',
      xp: 0,
      soundEnabled: true,
      completedLessons: {},
      completedDrills: {},
      drillHistory: [],
      studioChecks: {}
    }
  },

  escapeHtml(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  },

  isSimpleMode() {
    return this.activeProfileId === 'kid-8';
  },

  isReducedMotion() {
    return typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  init() {
    let hasSavedDarkMode = false;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.profiles) this.profiles = parsed.profiles;
        if (parsed.activeProfileId) this.activeProfileId = parsed.activeProfileId;
        if (typeof parsed.showEnglishSubtitles === 'boolean') {
          this.showEnglishSubtitles = parsed.showEnglishSubtitles;
        }
        if (typeof parsed.zhuyinFont === 'boolean') {
          this.zhuyinFont = parsed.zhuyinFont;
        } else {
          this.zhuyinFont = this.activeProfileId === 'kid-8';
        }
        if (typeof parsed.darkMode === 'boolean') {
          this.darkMode = parsed.darkMode;
          hasSavedDarkMode = true;
        }
        if (typeof parsed.soundEnabled === 'boolean') {
          this.soundEnabled = parsed.soundEnabled;
        }
      } else {
        this.zhuyinFont = this.activeProfileId === 'kid-8';
      }
    } catch (e) {
      console.warn('Could not read localStorage:', e);
    }
    if (!hasSavedDarkMode) {
      this.darkMode = typeof window.matchMedia === 'function' &&
        !!window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    const activeProf = this.getProfile();
    if (typeof activeProf.soundEnabled === 'boolean') {
      this.soundEnabled = activeProf.soundEnabled;
    }
    if (!this._listenersBound) {
      this._listenersBound = true;
      document.addEventListener('click', (e) => {
        if (!this.settingsMenuOpen) return;
        const wrap = document.querySelector('.settings-dropdown-wrap');
        if (wrap && !wrap.contains(e.target)) {
          this.closeSettingsMenu();
        }
      });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.settingsMenuOpen) {
          this.closeSettingsMenu();
          return;
        }
        if (this.currentView === 'lesson' && this.lessonStep === 'learn') {
          const tag = e.target && e.target.tagName;
          if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
          if (e.key === 'ArrowLeft') {
            this.prevSlideCard();
          } else if (e.key === 'ArrowRight') {
            this.nextSlideCard();
          }
        }
      });
    }
    this.syncBodyClass();
    this.renderAll();
    if ('serviceWorker' in navigator && location.protocol && location.protocol.startsWith('http')) {
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    }
  },

  save() {
    try {
      const activeProf = this.getProfile();
      activeProf.soundEnabled = this.soundEnabled;
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        activeProfileId: this.activeProfileId,
        showEnglishSubtitles: this.showEnglishSubtitles,
        zhuyinFont: this.zhuyinFont,
        soundEnabled: this.soundEnabled,
        darkMode: this.darkMode,
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

  completeDrill(drillId, cpm, accuracy = 100) {
    const p = this.getProfile();
    if (!p.completedDrills[drillId]) {
      p.xp += 30;
    }
    p.completedDrills[drillId] = { cpm: Math.max(cpm, (p.completedDrills[drillId]?.cpm || 0)) };
    if (!Array.isArray(p.drillHistory)) p.drillHistory = [];
    p.drillHistory.push({ drillId, cpm, accuracy, at: new Date().toISOString() });
    if (p.drillHistory.length > 15) p.drillHistory = p.drillHistory.slice(-15);
    this.save();
    this.renderHeader();
  },

  completeLesson(lessonId, xpReward, starsOverride) {
    const p = this.getProfile();
    const isFirstTime = !p.completedLessons[lessonId];
    if (isFirstTime) {
      p.xp += xpReward;
    }
    const mistakes = this.quizMistakes[lessonId] || 0;
    const calcStars = starsOverride || (mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1);
    const prevStars = p.completedLessons[lessonId]?.stars || 0;
    p.completedLessons[lessonId] = {
      stars: Math.max(prevStars, calcStars),
      completedAt: new Date().toISOString()
    };
    this.save();
    this.renderHeader();
    this.triggerLessonCelebration(isFirstTime ? xpReward : 0);
  },

  playSuccessSound() {
    if (!this.soundEnabled) return;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (typeof AudioCtx !== 'function') return;
    try {
      const ctx = new AudioCtx();
      const notes = [523.25, 659.25, 783.99, 1046.5];
      const now = ctx.currentTime;
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.08);
        gain.gain.setValueAtTime(0.001, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.12, now + i * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.22);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.24);
      });
      setTimeout(() => {
        if (ctx && typeof ctx.close === 'function') ctx.close().catch(() => {});
      }, 900);
    } catch (e) {
      // Ignore audio failures in restricted environments
    }
  },

  triggerLessonCelebration(xpAwarded) {
    this.playSuccessSound();
    if (this.isReducedMotion()) return;

    // 1. Pure CSS/DOM Confetti burst (~40 pieces, auto-removed after ~2s)
    const oldBurst = document.getElementById('celebration-confetti-layer');
    if (oldBurst && oldBurst.parentNode) oldBurst.parentNode.removeChild(oldBurst);

    const layer = document.createElement('div');
    layer.id = 'celebration-confetti-layer';
    layer.className = 'confetti-layer';
    layer.setAttribute('aria-hidden', 'true');
    const colors = ['#f59e0b', '#0284c7', '#10b981', '#ec4899', '#8b5cf6', '#ef4444'];
    const pieceCount = 40;
    for (let i = 0; i < pieceCount; i++) {
      const piece = document.createElement('span');
      piece.className = 'confetti-piece';
      const angle = (i / pieceCount) * Math.PI * 2;
      const dist = 90 + (i % 5) * 35;
      const tx = Math.round(Math.cos(angle) * dist);
      const ty = Math.round(Math.sin(angle) * dist - 60);
      piece.style.left = `${45 + ((i * 7) % 11) - 5}%`;
      piece.style.top = '42%';
      piece.style.backgroundColor = colors[i % colors.length];
      piece.style.setProperty('--tx', `${tx}px`);
      piece.style.setProperty('--ty', `${ty}px`);
      piece.style.setProperty('--rot', `${(i * 47) % 360}deg`);
      piece.style.animationDelay = `${(i % 6) * 35}ms`;
      layer.appendChild(piece);
    }
    document.body.appendChild(layer);
    setTimeout(() => {
      if (layer.parentNode) layer.parentNode.removeChild(layer);
    }, 2000);

    // 2. XP fly-up element toward header XP pill
    if (xpAwarded > 0) {
      const flyEl = document.createElement('div');
      flyEl.className = 'xp-flyup';
      flyEl.textContent = `+${xpAwarded} XP`;
      const xpPill = document.querySelector('.xp-pill');
      if (xpPill && typeof xpPill.getBoundingClientRect === 'function') {
        const rect = xpPill.getBoundingClientRect();
        flyEl.style.setProperty('--target-x', `${Math.round(rect.left + rect.width / 2)}px`);
        flyEl.style.setProperty('--target-y', `${Math.round(rect.top + rect.height / 2)}px`);
      }
      document.body.appendChild(flyEl);
      setTimeout(() => {
        if (flyEl.parentNode) flyEl.parentNode.removeChild(flyEl);
      }, 1500);
    }
  },

  toggleStudioCheck(lessonId, idx) {
    const p = this.getProfile();
    if (!p.studioChecks) p.studioChecks = {};
    if (!Array.isArray(p.studioChecks[lessonId])) p.studioChecks[lessonId] = [];
    const list = p.studioChecks[lessonId];
    const pos = list.indexOf(idx);
    if (pos === -1) {
      list.push(idx);
      p.xp += 10;
    } else {
      list.splice(pos, 1);
    }
    this.save();
    this.renderAll();
  },

  switchProfile() {
    this.activeProfileId = this.activeProfileId === 'kid-10' ? 'kid-8' : 'kid-10';
    this.zhuyinFont = this.activeProfileId === 'kid-8';
    const nextProf = this.getProfile();
    if (typeof nextProf.soundEnabled === 'boolean') {
      this.soundEnabled = nextProf.soundEnabled;
    }
    this.quizAnswers = {};
    this.quizMistakes = {};
    this.stopReadAloud();
    this.syncBodyClass();
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

  toggleZhuyinFont() {
    this.zhuyinFont = !this.zhuyinFont;
    this.syncBodyClass();
    this.save();
    this.renderAll();
  },

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    this.save();
    this.renderHeader();
  },

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    this.syncBodyClass();
    this.save();
    this.renderHeader();
  },

  supportsSpeechSynthesis() {
    return typeof window.speechSynthesis === 'object' && window.speechSynthesis !== null &&
      typeof window.speechSynthesis.speak === 'function' &&
      typeof window.SpeechSynthesisUtterance === 'function';
  },

  stopReadAloud() {
    if (this.speakingCardKey && this.supportsSpeechSynthesis()) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}
    }
    this.speakingCardKey = null;
  },

  toggleReadAloudCard(lessonId, cardIdx) {
    if (!this.supportsSpeechSynthesis()) return;
    const key = `${lessonId}:${cardIdx}`;
    if (this.speakingCardKey === key) {
      this.stopReadAloud();
      this.renderMain();
      return;
    }
    const lesson = window.CURRICULUM_LESSONS.find(l => l.id === lessonId);
    const card = lesson && lesson.cards && lesson.cards[cardIdx];
    if (!card) return;
    const rawBody = (this.isSimpleMode() && card.simpleBody) ? card.simpleBody : card.body;
    const cleanText = `${card.title}。${String(rawBody || '').replace(/\*\*|`|\n+/g, ' ').trim()}`;
    try {
      window.speechSynthesis.cancel();
      const utter = new window.SpeechSynthesisUtterance(cleanText);
      utter.lang = 'zh-TW';
      utter.rate = 0.92;
      this.speakingCardKey = key;
      utter.onend = () => {
        if (this.speakingCardKey === key) {
          this.speakingCardKey = null;
          if (this.currentView === 'lesson' && this.lessonStep === 'learn') {
            this.renderMain();
          }
        }
      };
      utter.onerror = () => {
        if (this.speakingCardKey === key) {
          this.speakingCardKey = null;
        }
      };
      window.speechSynthesis.speak(utter);
    } catch (e) {
      this.speakingCardKey = null;
    }
    this.renderMain();
  },

  toggleSettingsMenu(event) {
    if (event && typeof event.stopPropagation === 'function') {
      event.stopPropagation();
    }
    this.settingsMenuOpen = !this.settingsMenuOpen;
    this.renderHeader();
  },

  closeSettingsMenu() {
    if (!this.settingsMenuOpen) return;
    this.settingsMenuOpen = false;
    this.renderHeader();
  },

  isWorldExpanded(worldId, defaultCurrentWorldId) {
    const overrides = (this.expandedWorldOverrides && this.expandedWorldOverrides[this.activeProfileId]) || {};
    if (typeof overrides[worldId] === 'boolean') {
      return overrides[worldId];
    }
    return worldId === defaultCurrentWorldId;
  },

  toggleWorldCollapse(worldId, defaultCurrentWorldId) {
    if (!this.expandedWorldOverrides) this.expandedWorldOverrides = {};
    if (!this.expandedWorldOverrides[this.activeProfileId]) {
      this.expandedWorldOverrides[this.activeProfileId] = {};
    }
    const curr = this.isWorldExpanded(worldId, defaultCurrentWorldId);
    this.expandedWorldOverrides[this.activeProfileId][worldId] = !curr;
    const sec = document.getElementById(`section-${worldId}`);
    if (sec) {
      sec.classList.toggle('collapsed', curr);
      const headerBtn = sec.querySelector('.world-header');
      if (headerBtn) headerBtn.setAttribute('aria-expanded', String(!curr));
      const chev = sec.querySelector('.world-collapse-chevron');
      if (chev) chev.textContent = !curr ? '▾' : '▸';
    } else {
      this.renderMain();
    }
  },

  renderProgressRing(doneCount, totalCount, color) {
    const pct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;
    const radius = 19;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (pct / 100) * circumference;
    return `
      <div class="world-progress-ring" title="已完成 ${doneCount} / ${totalCount} 堂課 (${pct}%)" aria-label="世界進度 ${pct}%">
        <svg viewBox="0 0 48 48" width="48" height="48">
          <circle class="ring-track" cx="24" cy="24" r="${radius}" fill="none" stroke="#e2e8f0" stroke-width="5"></circle>
          <circle class="ring-fill" cx="24" cy="24" r="${radius}" fill="none" stroke="${color}" stroke-width="5"
                  stroke-linecap="round"
                  stroke-dasharray="${circumference.toFixed(2)}"
                  stroke-dashoffset="${offset.toFixed(2)}"
                  transform="rotate(-90 24 24)"></circle>
        </svg>
        <span class="ring-label">${pct}%</span>
      </div>
    `;
  },

  syncBodyClass() {
    if (this.showEnglishSubtitles) {
      document.body.classList.add('show-en');
    } else {
      document.body.classList.remove('show-en');
    }
    if (this.zhuyinFont) {
      document.body.classList.add('zhuyin-font');
    } else {
      document.body.classList.remove('zhuyin-font');
    }
    if (this.activeProfileId === 'kid-8') {
      document.body.classList.add('kid-mode-8');
    } else {
      document.body.classList.remove('kid-mode-8');
    }
    if (this.darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  },

  navigate(view, lessonId) {
    this.currentView = view;
    this.settingsMenuOpen = false;
    this.stopReadAloud();
    if (lessonId) {
      this.currentLessonId = lessonId;
      this.lessonStep = 'learn';
      this.currentCardIdx = 0;
      this.quizAnswers = {};
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.renderAll();
  },

  setLessonStep(step) {
    this.lessonStep = step;
    if (step === 'learn') {
      this.currentCardIdx = 0;
    }
    this.stopReadAloud();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.renderMain();
  },

  setSlideCard(idx) {
    const lesson = window.CURRICULUM_LESSONS.find(l => l.id === this.currentLessonId);
    const total = (lesson && Array.isArray(lesson.cards)) ? lesson.cards.length : 1;
    const clamped = Math.max(0, Math.min(total - 1, idx));
    if (clamped === this.currentCardIdx) return;
    this.currentCardIdx = clamped;
    this.stopReadAloud();
    const carousel = document.querySelector('.learn-carousel');
    if (carousel) {
      const cards = carousel.querySelectorAll('.slide-card');
      cards.forEach((el, i) => {
        el.classList.toggle('is-hidden', i !== clamped);
      });
      const dots = carousel.querySelectorAll('.carousel-dot');
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === clamped);
        dot.setAttribute('aria-current', i === clamped ? 'true' : 'false');
      });
      const counter = carousel.querySelector('.carousel-counter');
      if (counter) counter.textContent = `${clamped + 1} / ${total}`;
      const prevBtn = carousel.querySelector('.carousel-prev-btn');
      const nextBtn = carousel.querySelector('.carousel-next-btn');
      if (prevBtn) prevBtn.disabled = clamped === 0;
      if (nextBtn) nextBtn.disabled = clamped >= total - 1;
    } else {
      this.renderMain();
    }
  },

  prevSlideCard() {
    this.setSlideCard(this.currentCardIdx - 1);
  },

  nextSlideCard() {
    this.setSlideCard(this.currentCardIdx + 1);
  },

  bindCarouselTouch(carouselEl) {
    if (!carouselEl || carouselEl._swipeBound) return;
    carouselEl._swipeBound = true;
    let startX = null;
    let startY = null;
    carouselEl.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches.length === 1) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
      }
    }, { passive: true });
    carouselEl.addEventListener('touchend', (e) => {
      if (startX === null || !e.changedTouches || !e.changedTouches.length) return;
      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;
      startX = null;
      startY = null;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
        if (dx < 0) this.nextSlideCard();
        else this.prevSlideCard();
      }
    }, { passive: true });
  },

  renderAll() {
    this.renderHeader();
    this.renderMain();
  },

  renderHeader() {
    const navEl = document.getElementById('app-header');
    if (!navEl) return;
    const p = this.getProfile();
    const safeName = this.escapeHtml(p.name);
    const completedCount = Object.keys(p.completedLessons).length;
    const totalLessons = window.CURRICULUM_LESSONS.length;
    const totalDrills = (window.TYPING_DATA && window.TYPING_DATA.categories)
      ? window.TYPING_DATA.categories.reduce((sum, c) => sum + c.drills.length, 0)
      : 22;

    navEl.innerHTML = `
      <div class="brand-area" onclick="window.AppState.navigate('map')" role="button" tabindex="0" aria-label="返回探險地圖">
        <div class="brand-logo">🚀</div>
        <div>
          <div class="brand-title">數位小探險家學院</div>
          <div class="brand-subtitle">Windows 11・中英盲打・網路與 AI 魔法學園</div>
        </div>
      </div>

      <nav class="nav-tabs" aria-label="主導覽列">
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
        <button class="nav-tab ${this.currentView === 'badges' ? 'active' : ''}"
                onclick="window.AppState.navigate('badges')">
          🏆 徽章櫃 Badges
        </button>
        <button class="nav-tab ${this.currentView === 'certificate' ? 'active' : ''}"
                onclick="window.AppState.navigate('certificate')">
          🎓 榮譽證書
        </button>
        <button class="nav-tab ${this.currentView === 'parent' ? 'active' : ''}"
                onclick="window.AppState.navigate('parent')">
          👨‍👩‍👧 家長儀表板
        </button>
      </nav>

      <div class="nav-right">
        <button class="profile-pill" onclick="window.AppState.switchProfile()" title="點擊切換 10歲 / 8歲 探險家檔案" aria-label="切換探險家檔案">
          <span>${p.avatar} ${safeName}</span>
          <span class="profile-switch-tag">切換</span>
        </button>
        <div class="xp-pill" aria-label="探險家總積分">
          ⭐ ${p.xp} XP
        </div>
        <div class="settings-dropdown-wrap">
          <button class="settings-btn ${this.settingsMenuOpen ? 'open' : ''}"
                  type="button"
                  onclick="window.AppState.toggleSettingsMenu(event)"
                  aria-haspopup="true"
                  aria-expanded="${this.settingsMenuOpen ? 'true' : 'false'}"
                  aria-label="開啟設定選單">
            ⚙️ 設定
          </button>
          <div class="settings-menu ${this.settingsMenuOpen ? 'open' : ''}" role="menu" aria-label="學習設定選單">
            <button class="settings-menu-item" type="button" role="menuitem"
                    onclick="window.AppState.closeSettingsMenu(); window.AppState.renameCurrentProfile()"
                    title="修改探險家名字" aria-label="修改探險家名字">
              <span>✏️ 改名 Rename</span>
              <span class="settings-item-badge">${safeName}</span>
            </button>
            <button class="settings-menu-item ${this.zhuyinFont ? 'en-on' : ''}" type="button" role="menuitem"
                    onclick="window.AppState.toggleZhuyinFont()"
                    title="切換國語課本注音字體 (Bpmf Iansui)"
                    aria-label="切換注音伴讀字體">
              <span>📖 注音字體 Zhuyin</span>
              <span class="settings-item-badge">${this.zhuyinFont ? 'ON' : 'OFF'}</span>
            </button>
            <button class="settings-menu-item ${this.showEnglishSubtitles ? 'en-on' : ''}" type="button" role="menuitem"
                    onclick="window.AppState.toggleEnglish()"
                    aria-label="切換中英雙語顯示">
              <span>🌐 中英雙語 English</span>
              <span class="settings-item-badge">${this.showEnglishSubtitles ? 'ON' : 'OFF'}</span>
            </button>
            <button class="settings-menu-item ${this.soundEnabled ? 'en-on' : ''}" type="button" role="menuitem"
                    onclick="window.AppState.toggleSound()"
                    aria-label="切換成功音效">
              <span>🔈 音效 Sound</span>
              <span class="settings-item-badge">${this.soundEnabled ? 'ON' : 'OFF'}</span>
            </button>
            <button class="settings-menu-item ${this.darkMode ? 'en-on' : ''}" type="button" role="menuitem"
                    onclick="window.AppState.toggleDarkMode()"
                    aria-label="切換深色模式">
              <span>🌙 深色模式 Dark</span>
              <span class="settings-item-badge">${this.darkMode ? 'ON' : 'OFF'}</span>
            </button>
          </div>
        </div>
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
    } else if (this.currentView === 'badges') {
      this.renderBadgeCabinet(mainEl);
    } else if (this.currentView === 'certificate') {
      this.renderCertificate(mainEl);
    } else if (this.currentView === 'parent') {
      this.renderParentGuide(mainEl);
    }
  },

  getDailyQuest() {
    const p = this.getProfile();
    const firstUnfinished = window.CURRICULUM_LESSONS.find(l => !p.completedLessons[l.id]) || null;
    const nextLesson = firstUnfinished || window.CURRICULUM_LESSONS[0];
    const allLessonsDone = !firstUnfinished;
    let nextDrill = null;
    if (window.TYPING_DATA && window.TYPING_DATA.categories) {
      for (const cat of window.TYPING_DATA.categories) {
        for (const d of cat.drills) {
          if (!p.completedDrills[d.id]) {
            nextDrill = d;
            break;
          }
        }
        if (nextDrill) break;
      }
      if (!nextDrill) nextDrill = window.TYPING_DATA.categories[0].drills[0];
    }
    return { nextLesson, nextDrill, allLessonsDone };
  },

  // ==========================================================================
  // VIEW 1: WORLD MAP
  // ==========================================================================
  renderWorldMap(mainEl) {
    const p = this.getProfile();
    const safeName = this.escapeHtml(p.name);
    const completedLessonsCount = Object.keys(p.completedLessons).length;
    const completedDrillsCount = Object.keys(p.completedDrills).length;
    const totalLessons = window.CURRICULUM_LESSONS.length;
    const totalDrills = (window.TYPING_DATA && window.TYPING_DATA.categories)
      ? window.TYPING_DATA.categories.reduce((sum, c) => sum + c.drills.length, 0)
      : 22;
    const { nextLesson, nextDrill, allLessonsDone } = this.getDailyQuest();

    const firstUnfinishedWorld = window.CURRICULUM_WORLDS.find(w => {
      const wl = window.CURRICULUM_LESSONS.filter(l => l.worldId === w.id);
      return wl.some(l => !p.completedLessons[l.id]);
    });
    const currentWorldId = firstUnfinishedWorld ? firstUnfinishedWorld.id : window.CURRICULUM_WORLDS[0].id;

    mainEl.innerHTML = `
      <section class="hero-banner">
        <div class="hero-info">
          <h1>👋 歡迎回來，${p.avatar} ${safeName}！</h1>
          <p>${this.isSimpleMode() ? '🌟 8歲簡易伴讀模式已開啟！一步一步學筆電、注音打字、AI 與 Roblox！' : '從認識你的全新 Windows 11 筆電、學會中英十指盲打，一路成為聰明又安全的網路與 AI 小大師！'}</p>
          <div class="dynamic-island-bar">
            <span class="dynamic-island-dot"></span>
            <span>💊 靈動探險島：${p.avatar} ${safeName} 連線中</span>
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

      <!-- ▶️ Big Continue Banner / Congrats when all done -->
      <section class="continue-banner" aria-label="快速繼續學習">
        ${allLessonsDone ? `
          <div class="continue-congrats">
            <span class="congrats-emoji">🎉</span>
            <div>
              <div class="congrats-title">太棒了！全部 ${totalLessons} 堂課都通關囉！All Done!</div>
              <div class="congrats-sub">可以去「🎓 榮譽證書」領獎狀，或去「🎹 打字道館」破紀錄！</div>
            </div>
            <button class="btn-primary" onclick="window.AppState.navigate('certificate')">🎓 看榮譽證書</button>
          </div>
        ` : `
          <button class="continue-btn" type="button" onclick="window.AppState.navigate('lesson', '${nextLesson.id}')">
            <span class="continue-btn-main">▶️ 繼續 Continue</span>
            <span class="continue-btn-sub">下一關：單元 ${nextLesson.number} ${nextLesson.title}</span>
          </button>
        `}
      </section>

      <!-- 🎯 Daily Quest Card -->
      <section class="daily-quest-card" aria-label="今日探險任務">
        <div>
          <div class="daily-quest-tag">🎯 今日探險任務 (Daily Quest)</div>
          <div class="daily-quest-title">
            1. 挑戰課程：單元 ${nextLesson.number} ${nextLesson.title}
            ${nextDrill ? ` ｜ 2. 打字特訓：${nextDrill.name}` : ''}
          </div>
        </div>
        <div class="daily-quest-actions">
          <button class="btn-primary" onclick="window.AppState.navigate('lesson', '${nextLesson.id}')">🚀 去上課</button>
          <button class="btn-secondary" onclick="window.AppState.navigate('dojo')">🎹 練打字</button>
        </div>
      </section>

      <!-- 🏝️ Three.js 3D Floating Islands Interactive Stage -->
      <div id="island-3d-canvas">${(window.IslandScene && !this.isReducedMotion()) ? `
        <div class="skeleton skeleton-island" role="status" aria-label="3D 浮空島嶼載入中">
          <div class="congrats-emoji">🏝️✨</div>
          <div class="lesson-vocab-heading">正在載入 3D 浮空探險島嶼 Loading 3D Islands...</div>
        </div>
      ` : `
        <div class="skeleton-island-static">
          🏝️ 探險島嶼地圖已就緒！點選下方世界展開課程關卡 👇
        </div>
      `}</div>

      ${window.CURRICULUM_WORLDS.map(world => {
        const wLessons = window.CURRICULUM_LESSONS.filter(l => l.worldId === world.id);
        const wDoneCount = wLessons.filter(l => p.completedLessons[l.id]).length;
        const isExpanded = this.isWorldExpanded(world.id, currentWorldId);
        const wColor = world.color || world.themeColor || '#0284c7';
        return `
          <section class="world-section themed-world ${isExpanded ? '' : 'collapsed'}" id="section-${world.id}" style="--world-color: ${wColor};">
            <div class="world-header" role="button" tabindex="0"
                 aria-expanded="${isExpanded ? 'true' : 'false'}"
                 onclick="window.AppState.toggleWorldCollapse('${world.id}', '${currentWorldId}')"
                 onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();window.AppState.toggleWorldCollapse('${world.id}', '${currentWorldId}');}">
              <div class="world-title-group">
                <div class="world-icon-badge" style="background:${wColor}18; border:2px solid ${wColor};">
                  ${world.icon}
                </div>
                <div>
                  <div class="world-number-label" style="color:${wColor};">
                    ${world.number} ・ ${world.titleEn}
                  </div>
                  <h2>${world.title}</h2>
                  <p>${world.subtitle}</p>
                </div>
              </div>
              <div class="world-header-right">
                ${this.renderProgressRing(wDoneCount, wLessons.length, 'var(--world-color)')}
                <div class="world-progress-pill">
                  🏆 進度：${wDoneCount} / ${wLessons.length} 關 ${wDoneCount === wLessons.length ? '（🏅 已獲得' + world.badgeName + '！）' : ''}
                </div>
                <span class="world-collapse-chevron" aria-hidden="true">${isExpanded ? '▾' : '▸'}</span>
              </div>
            </div>

            <div class="lesson-list lessons-grid">
              ${wLessons.map(lesson => {
                const isDone = !!p.completedLessons[lesson.id];
                const starsCount = isDone ? (p.completedLessons[lesson.id].stars || 3) : 0;
                return `
                  <article class="lesson-card ${isDone ? 'completed' : ''}"
                           onclick="window.AppState.navigate('lesson', '${lesson.id}')">
                    <div>
                      <div class="lesson-card-top">
                        <span class="lesson-num-tag">單元 ${lesson.number}</span>
                        <span class="lesson-status-stars">${isDone ? `${'⭐'.repeat(starsCount)} 已通關` : '🎯 點擊開始'}</span>
                      </div>
                      <h3>${lesson.icon} ${lesson.title}</h3>
                      <div class="en-sub">${lesson.titleEn}</div>
                      <p>${lesson.summary}</p>
                    </div>
                    <div class="lesson-card-footer">
                      <span>⏱️ ${lesson.duration}</span>
                      <span style="color:${wColor};">+${lesson.xp} XP 👉</span>
                    </div>
                  </article>
                `;
              }).join('')}
            </div>
          </section>
        `;
      }).join('')}
    `;

    const prefersReducedMotion = this.isReducedMotion();
    if (window.IslandScene && !prefersReducedMotion) {
      const mount3D = () => {
        if (this.currentView !== 'map') return;
        const canvasEl = document.getElementById('island-3d-canvas');
        if (!canvasEl) return;
        window.IslandScene.mount('island-3d-canvas', {
          onSelectWorld: (worldId) => {
            const sec = document.getElementById(`section-${worldId}`);
            if (sec) {
              if (sec.classList.contains('collapsed')) {
                this.toggleWorldCollapse(worldId, currentWorldId);
              }
              sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
              sec.classList.add('island-highlight');
              setTimeout(() => sec.classList.remove('island-highlight'), 1400);
            }
          },
          profile: p,
          worlds: window.CURRICULUM_WORLDS
        });
      };
      if (typeof window.requestAnimationFrame === 'function') {
        window.requestAnimationFrame(mount3D);
      } else {
        mount3D();
      }
    }
  },

  // ==========================================================================
  // VIEW 2: LESSON VIEWER (LEARN -> INTERACTIVE LAB -> QUIZ)
  // ==========================================================================
  renderLessonView(mainEl) {
    const lesson = window.CURRICULUM_LESSONS.find(l => l.id === this.currentLessonId) || window.CURRICULUM_LESSONS[0];
    const world = window.CURRICULUM_WORLDS.find(w => w.id === lesson.worldId);
    const worldColor = (world && (world.color || world.themeColor)) || '#0284c7';
    const lessonIdx = window.CURRICULUM_LESSONS.indexOf(lesson);
    const nextLesson = window.CURRICULUM_LESSONS[lessonIdx + 1] || null;
    const isCompleted = !!this.getProfile().completedLessons[lesson.id];
    const stepOrder = ['learn', 'lab', 'quiz'];
    const currentStepIdx = Math.max(0, stepOrder.indexOf(this.lessonStep));
    const prevStep = currentStepIdx > 0 ? stepOrder[currentStepIdx - 1] : null;
    const nextStep = currentStepIdx < stepOrder.length - 1 ? stepOrder[currentStepIdx + 1] : null;
    const totalCards = Array.isArray(lesson.cards) ? lesson.cards.length : 0;
    const activeCardIdx = Math.max(0, Math.min(totalCards - 1, this.currentCardIdx || 0));

    mainEl.innerHTML = `
      <div class="lesson-themed-container" style="--world-color: ${worldColor};">
        <div class="lesson-view-header">
          <button class="back-btn" onclick="window.AppState.navigate('map')">
            ← 返回探險地圖
          </button>
          <div class="lesson-steps" role="navigation" aria-label="課程三步驟進度條">
            <div class="lesson-steps-track">
              <button type="button"
                      class="lesson-step-pill ${this.lessonStep === 'learn' ? 'active' : (currentStepIdx > 0 ? 'done' : '')}"
                      onclick="window.AppState.setLessonStep('learn')">
                <span class="step-num">1</span>
                <span>📖 學習 Learn</span>
              </button>
              <div class="lesson-step-connector ${currentStepIdx >= 1 ? 'done' : ''}" aria-hidden="true"></div>
              <button type="button"
                      class="lesson-step-pill ${this.lessonStep === 'lab' ? 'active' : (currentStepIdx > 1 ? 'done' : '')}"
                      onclick="window.AppState.setLessonStep('lab')">
                <span class="step-num">2</span>
                <span>🧪 實驗 Lab</span>
              </button>
              <div class="lesson-step-connector ${currentStepIdx >= 2 ? 'done' : ''}" aria-hidden="true"></div>
              <button type="button"
                      class="lesson-step-pill ${this.lessonStep === 'quiz' ? 'active' : ''}"
                      onclick="window.AppState.setLessonStep('quiz')">
                <span class="step-num">3</span>
                <span>🏆 測驗 Quiz</span>
              </button>
            </div>
            <div class="lesson-step-nav-btns">
              ${prevStep ? `
                <button type="button" class="btn-secondary lesson-step-back-btn" onclick="window.AppState.setLessonStep('${prevStep}')">
                  ← 上一步 Back
                </button>
              ` : ''}
              ${nextStep ? `
                <button type="button" class="btn-primary lesson-step-next-btn" onclick="window.AppState.setLessonStep('${nextStep}')">
                  下一步 Next →
                </button>
              ` : ''}
            </div>
          </div>
        </div>

        <div class="card-panel">
          <div class="lesson-title-banner">
            <div>
              <span class="lesson-num-tag">單元 ${lesson.number} ・ +${lesson.xp} XP</span>
              <h1 class="lesson-main-title">${lesson.icon} ${lesson.title}</h1>
              <div class="en-sub lesson-title-en">${lesson.titleEn}</div>
            </div>
            <div>
              ${isCompleted ? `<span class="lesson-completed-pill">⭐⭐⭐ 本單元已通關！</span>` : ''}
            </div>
          </div>

          ${this.lessonStep === 'learn' ? `
            <!-- Step 1: Story & Concept Cards Carousel -->
            <div class="learn-carousel" aria-label="知識卡片輪播">
              <div class="carousel-cards-stage">
                ${lesson.cards.map((c, idx) => {
                  const cardText = (this.isSimpleMode() && c.simpleBody) ? c.simpleBody : c.body;
                  const canSpeak = this.supportsSpeechSynthesis();
                  const isSpeaking = this.speakingCardKey === `${lesson.id}:${idx}`;
                  return `
                  <div class="slide-card ${idx === activeCardIdx ? '' : 'is-hidden'}" data-card-index="${idx}">
                    <div class="slide-card-header">
                      <div>
                        <h3>${c.title}</h3>
                        <div class="en-sub mb-sm">${c.titleEn || ''}</div>
                      </div>
                      ${canSpeak ? `
                        <button type="button"
                                class="read-aloud-btn ${isSpeaking ? 'speaking' : ''}"
                                onclick="window.AppState.toggleReadAloudCard('${lesson.id}', ${idx})"
                                aria-label="${isSpeaking ? '停止朗讀卡片' : '朗讀這張知識卡'}">
                          ${isSpeaking ? '⏹️ 停止朗讀' : '🔊 朗讀 Read'}
                        </button>
                      ` : ''}
                    </div>
                    <div class="slide-body">${this.formatMarkdownBold(cardText)}</div>
                    ${c.visualType ? this.renderCardVisual(c.visualType) : ''}
                    ${c.highlight ? `<div class="slide-highlight">${c.highlight}</div>` : ''}
                  </div>
                `;
                }).join('')}
              </div>

              <div class="carousel-controls">
                <button type="button"
                        class="btn-secondary carousel-prev-btn"
                        onclick="window.AppState.prevSlideCard()"
                        ${activeCardIdx === 0 ? 'disabled' : ''}
                        aria-label="上一張知識卡">
                  ◀ 上一張
                </button>
                <div class="carousel-dots" role="tablist" aria-label="卡片頁數">
                  ${lesson.cards.map((_, idx) => `
                    <button type="button"
                            class="carousel-dot ${idx === activeCardIdx ? 'active' : ''}"
                            onclick="window.AppState.setSlideCard(${idx})"
                            aria-label="第 ${idx + 1} 張卡片"
                            aria-current="${idx === activeCardIdx ? 'true' : 'false'}"></button>
                  `).join('')}
                  <span class="carousel-counter">${activeCardIdx + 1} / ${totalCards}</span>
                </div>
                <button type="button"
                        class="btn-secondary carousel-next-btn"
                        onclick="window.AppState.nextSlideCard()"
                        ${activeCardIdx >= totalCards - 1 ? 'disabled' : ''}
                        aria-label="下一張知識卡">
                  下一張 ▶
                </button>
              </div>

              <!-- Essential English Tech Keywords -->
              <div class="lesson-vocab-panel">
                <h3 class="lesson-vocab-heading">
                  🔤 本單元必學「電腦與 AI 英文關鍵字」 (點喇叭可聽發音！)
                </h3>
                <div class="vocab-strip">
                  ${lesson.vocab.map(v => `
                    <div class="vocab-chip">
                      <div class="v-en">
                        <span>${v.en}</span>
                        <button onclick="window.AppState.speakEnglish('${v.en.replace(/'/g, '')}')"
                                class="vocab-speak-btn"
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

              <div class="flex-end-mt">
                <button class="btn-primary" onclick="window.AppState.setLessonStep('lab')">
                  下一步：進入「🧪 實驗 Lab」 👉
                </button>
              </div>
            </div>
          ` : ''}

          ${this.lessonStep === 'lab' ? `
            <!-- Step 2: Interactive Simulator Lab -->
            <div>
              <div class="lab-instruction-banner">
                <h3 class="lab-instruction-title">${lesson.simulator.title}</h3>
                <p class="lab-instruction-body">${lesson.simulator.instruction}</p>
              </div>

              <div id="lesson-simulator-mount">
                <div class="skeleton skeleton-sim" role="status" aria-label="互動實驗室載入中">
                  <div class="skeleton-bar short"></div>
                  <div class="skeleton-bar medium"></div>
                  <div class="skeleton-bar tall"></div>
                </div>
              </div>

              ${lesson.studioChecklist ? `
                <div class="studio-checklist" aria-label="真實 Roblox Studio 實作任務">
                  <div class="studio-checklist-title">🛠️ 真實 Roblox Studio 實作挑戰（每勾一項 +10 XP！）</div>
                  ${lesson.studioChecklist.map((item, idx) => {
                    const checkedList = (this.getProfile().studioChecks && this.getProfile().studioChecks[lesson.id]) || [];
                    const isDone = checkedList.includes(idx);
                    return `
                      <label class="studio-check-item ${isDone ? 'checked' : ''}" onclick="window.AppState.toggleStudioCheck('${lesson.id}', ${idx})">
                        <input type="checkbox" class="studio-check-input" ${isDone ? 'checked' : ''} />
                        <span>${item}</span>
                      </label>
                    `;
                  }).join('')}
                </div>
              ` : ''}

              <div class="flex-between-mt">
                <button class="btn-secondary" onclick="window.AppState.setLessonStep('learn')">
                  ← 回去看知識卡
                </button>
                <button class="btn-primary" onclick="window.AppState.setLessonStep('quiz')">
                  下一步：挑戰「🏆 測驗 Quiz」領取星星 👉
                </button>
              </div>
            </div>
          ` : ''}

          ${this.lessonStep === 'quiz' ? `
            <!-- Step 3: Mastery Quiz -->
            <div>
              <p class="quiz-intro-tip">
                🎯 答對下面全部 ${lesson.quiz.length} 題，就能獲得 <strong>+${lesson.xp} XP</strong>！（一次答對拿 ⭐⭐⭐ 三顆星！）
              </p>
              ${lesson.quiz.map((qItem, qIdx) => {
                const chosen = this.quizAnswers[qIdx];
                const isAnswered = chosen !== undefined;
                const isCorrect = chosen === qItem.correct;
                const order = this.getShuffledQuizOrder(lesson.id, qIdx, qItem.options.length);
                const labels = ['🅰️', '🅱️', '🆎', '🆔'];
                return `
                  <div class="quiz-question-card">
                    <div class="quiz-question-title">
                      Q${qIdx + 1}. ${qItem.q}
                    </div>
                    ${order.map((origIdx, displayIdx) => {
                      const opt = qItem.options[origIdx];
                      let cls = 'quiz-option';
                      if (isAnswered) {
                        if (origIdx === qItem.correct && isCorrect) cls += ' correct';
                        else if (origIdx === chosen && !isCorrect) cls += ' wrong';
                      }
                      return `
                        <button class="${cls}" onclick="window.AppState.answerQuiz(${qIdx}, ${origIdx}, '${lesson.id}', ${lesson.xp})">
                          ${labels[displayIdx] || '🔹'} ${opt}
                        </button>
                      `;
                    }).join('')}
                    ${isAnswered ? `
                      <div class="${isCorrect ? 'quiz-feedback-correct' : 'quiz-feedback-wrong'}">
                        ${isCorrect ? `🎉 答對了！${qItem.explain}` : `💡 再試試看其他選項喔！提示：${qItem.explain}`}
                      </div>
                    ` : ''}
                  </div>
                `;
              }).join('')}

              ${this.isQuizAllCorrect(lesson) ? (() => {
                const earnedStars = (this.getProfile().completedLessons[lesson.id]?.stars) || 3;
                const starIcons = '⭐'.repeat(earnedStars);
                return `
                <div class="quiz-pass-banner">
                  <div class="quiz-pass-stars">🎉${starIcons}🎉</div>
                  <h3 class="quiz-pass-title">
                    恭喜過關！你已獲得本單元 ${earnedStars} 顆星與 +${lesson.xp} XP！
                  </h3>
                  <div class="quiz-pass-actions">
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
                `;
              })() : ''}
            </div>
          ` : ''}
        </div>
      </div>
    `;

    if (this.lessonStep === 'learn') {
      this.bindCarouselTouch(mainEl.querySelector('.learn-carousel'));
    } else if (this.lessonStep === 'lab') {
      window.Simulators.render(lesson.simulator, 'lesson-simulator-mount');
    }
  },

  getShuffledQuizOrder(lessonId, qIdx, length) {
    const key = `${lessonId}-${qIdx}-${length}`;
    if (this.quizOrderCache[key]) return this.quizOrderCache[key];
    const indices = Array.from({ length }, (_, i) => i);
    // Deterministic hash-based shuffle so correct answer (index 0) spreads across A/B/C
    let seed = 0;
    for (let i = 0; i < key.length; i++) seed = (seed * 31 + key.charCodeAt(i)) >>> 0;
    for (let i = indices.length - 1; i > 0; i--) {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      const j = seed % (i + 1);
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    this.quizOrderCache[key] = indices;
    return indices;
  },

  answerQuiz(qIdx, oIdx, lessonId, xp) {
    const lesson = window.CURRICULUM_LESSONS.find(l => l.id === lessonId);
    if (lesson && lesson.quiz[qIdx] && oIdx !== lesson.quiz[qIdx].correct) {
      this.quizMistakes[lessonId] = (this.quizMistakes[lessonId] || 0) + 1;
    }
    this.quizAnswers[qIdx] = oIdx;
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
        <div class="view-page-header">
          <div>
            <h1 class="view-page-title">🎹 老鷹變獵鷹：中英盲打與注音特訓道館 (共 ${totalDrills} 關)</h1>
            <p class="view-page-sub mb-0">
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
        <h1 class="view-page-title">🔤 電腦、網路與 AI 必備英文單字百寶箱 (${allVocab.length} 個核心單字)</h1>
        <p class="view-page-sub">
          點每個單字右上角的「🔊 發音」按鈕，電腦就會唸純正的英文給你聽喔！
        </p>
        <div class="vocab-strip">
          ${allVocab.map(v => `
            <div class="vocab-chip">
              <div class="vocab-lesson-tag">單元 ${v.lessonNum}</div>
              <div class="v-en">
                <span>${v.en}</span>
                <button onclick="window.AppState.speakEnglish('${v.en.split('(')[0].replace(/'/g, '').trim()}')"
                        class="vocab-speak-btn">
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
  // VIEW 4B: BADGE CABINET
  // ==========================================================================
  renderBadgeCabinet(mainEl) {
    const p = this.getProfile();
    const completedLessons = p.completedLessons || {};
    const completedDrills = p.completedDrills || {};
    const doneLessonsCount = Object.keys(completedLessons).length;
    const totalLessons = window.CURRICULUM_LESSONS.length;
    const threeStarCount = Object.values(completedLessons).filter(item => item && item.stars === 3).length;
    const uniqueDays = new Set(
      Object.values(completedLessons)
        .concat(p.drillHistory || [])
        .map(item => (item && (item.completedAt || item.at)) ? String(item.completedAt || item.at).slice(0, 10) : null)
        .filter(Boolean)
    );
    const doneDrillsCount = Object.keys(completedDrills).length;
    const hasTypingData = !!(window.TYPING_DATA && Array.isArray(window.TYPING_DATA.categories));
    const totalDrills = hasTypingData
      ? window.TYPING_DATA.categories.reduce((sum, c) => sum + c.drills.length, 0)
      : 0;

    const worldBadges = window.CURRICULUM_WORLDS.map(world => {
      const wLessons = window.CURRICULUM_LESSONS.filter(l => l.worldId === world.id);
      const wDoneCount = wLessons.filter(l => !!completedLessons[l.id]).length;
      const earned = wLessons.length > 0 && wDoneCount === wLessons.length;
      const wColor = world.color || world.themeColor || '#0284c7';
      return {
        id: `badge-${world.id}`,
        icon: world.icon,
        title: world.badgeName || world.title,
        subtitle: `${world.title} (${world.titleEn})`,
        color: wColor,
        earned,
        hint: `完成「${world.title}」全部 ${wLessons.length} 堂課 (${wDoneCount}/${wLessons.length})`
      };
    });

    const specialBadges = [
      {
        id: 'badge-first-lesson',
        icon: '🌱',
        title: '第一步探險 First Step',
        subtitle: '小小探險家出發！',
        color: '#10b981',
        earned: doneLessonsCount >= 1,
        hint: '完成任何 1 堂課程即可解鎖'
      },
      {
        id: 'badge-three-star',
        icon: '⭐',
        title: '三星學霸 3-Star Quiz',
        subtitle: '測驗一次全對！',
        color: '#f59e0b',
        earned: threeStarCount >= 1,
        hint: '在任一單元測驗一次全對拿到 ⭐⭐⭐'
      },
      {
        id: 'badge-streak',
        icon: '🔥',
        title: '學習小火苗 Daily Streak',
        subtitle: '每天進步一點點',
        color: '#ef4444',
        earned: doneLessonsCount >= 3 || uniqueDays.size >= 2,
        hint: `完成 3 堂課程解鎖 (${Math.min(doneLessonsCount, 3)}/3)`
      }
    ];

    if (hasTypingData && totalDrills > 0) {
      specialBadges.push({
        id: 'badge-typing-rookie',
        icon: '🎹',
        title: '盲打新手 Typing Rookie',
        subtitle: '手指找到 F 與 J！',
        color: '#0284c7',
        earned: doneDrillsCount >= 1,
        hint: '在「中英打字道館」完成第 1 關'
      });
      specialBadges.push({
        id: 'badge-typing-master',
        icon: '🦅',
        title: '獵鷹神手 Typing Pro',
        subtitle: '十指盲打挑戰成功',
        color: '#6366f1',
        earned: doneDrillsCount >= 5,
        hint: `在「中英打字道館」完成 5 關 (${Math.min(doneDrillsCount, 5)}/5)`
      });
    }

    specialBadges.push({
      id: 'badge-grand-explorer',
      icon: '👑',
      title: '全能探險王 Grand Master',
      subtitle: '稱霸全部數位世界！',
      color: '#a855f7',
      earned: totalLessons > 0 && doneLessonsCount >= totalLessons,
      hint: `完成全部 ${totalLessons} 堂課程 (${doneLessonsCount}/${totalLessons})`
    });

    const allBadges = [...worldBadges, ...specialBadges];
    const earnedCount = allBadges.filter(b => b.earned).length;

    const renderCard = (b) => `
      <div class="badge-card ${b.earned ? 'earned' : 'locked'}" style="--badge-color: ${b.color};">
        <div class="badge-icon-wrap">
          <span class="badge-icon">${b.icon}</span>
          ${b.earned ? '<span class="badge-earned-tag">✨ 已獲得</span>' : '<span class="badge-lock-tag">🔒 未解鎖</span>'}
        </div>
        <h3 class="badge-title">${this.escapeHtml(b.title)}</h3>
        <div class="badge-subtitle">${this.escapeHtml(b.subtitle)}</div>
        <div class="badge-hint">
          ${b.earned ? '🎉 太厲害了！已經放進徽章櫃！' : `🔒 怎麼獲得：${this.escapeHtml(b.hint)}`}
        </div>
      </div>
    `;

    mainEl.innerHTML = `
      <div class="card-panel badge-cabinet">
        <div class="badge-cabinet-header">
          <div>
            <h1 class="view-page-title">🏆 ${this.escapeHtml(p.name)} 的徽章櫃 Badges</h1>
            <p class="view-page-sub-tight">
              完成每個世界與特別挑戰，收集閃亮亮的榮譽徽章吧！
            </p>
          </div>
          <div class="badge-summary-pill">
            🏅 已收集 <strong>${earnedCount} / ${allBadges.length}</strong> 枚徽章
          </div>
        </div>

        <h2 class="badge-section-heading">🗺️ 世界探險徽章 World Badges (${worldBadges.filter(b => b.earned).length}/${worldBadges.length})</h2>
        <div class="badge-grid">
          ${worldBadges.map(renderCard).join('')}
        </div>

        <h2 class="badge-section-heading mt-lg">🌟 特別榮譽徽章 Special Badges (${specialBadges.filter(b => b.earned).length}/${specialBadges.length})</h2>
        <div class="badge-grid">
          ${specialBadges.map(renderCard).join('')}
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
      <div class="card-panel text-center">
        <div class="cert-frame">
          <div class="cert-trophy-icons">🎓🏆🚀</div>
          <div class="cert-eng-label">
            DIGITAL EXPLORER ACADEMY CERTIFICATE
          </div>
          <h1 class="cert-main-title">
            數位小探險家學院・榮譽證書
          </h1>
          <p class="cert-lead">
            茲證明小小數位探險家：
          </p>
          <div class="cert-recipient-name">
            ${p.avatar} ${this.escapeHtml(p.name)}
          </div>
          <p class="cert-body-copy">
            已成功在 <strong>Windows 11 筆電</strong> 上完成：
            <strong>${doneLessons} / ${totalLessons} 堂數位課程</strong> 與 <strong>${doneDrills} / ${window.TYPING_DATA.categories.reduce((sum, c) => sum + c.drills.length, 0)} 關中英盲打特訓</strong>，
            累積獲得 <strong>⭐ ${p.xp} XP</strong>！具備優秀的筆電操作、網路搜尋防詐與 AI 魔法應用能力！
          </p>
          <div class="cert-footer-meta">
            <span>📅 頒發日期：${today}</span>
            <span>🏅 認證等級：${doneLessons >= totalLessons ? '👑 傳奇數位魔法師' : doneLessons >= 6 ? '🌟 進階數位探險家' : '🌱 見習數位小達人'}</span>
          </div>
        </div>

        <div class="cert-actions">
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
  // VIEW 6: PARENT DASHBOARD & GUIDE
  // ==========================================================================
  renderParentGuide(mainEl) {
    const totalLessons = window.CURRICULUM_LESSONS.length;
    const profileIds = ['kid-10', 'kid-8'];
    const cardsHtml = profileIds.map(pid => {
      const prof = this.profiles[pid] || { id: pid, name: pid, avatar: '🎓', xp: 0, completedLessons: {}, completedDrills: {}, drillHistory: [] };
      const doneLessons = Object.keys(prof.completedLessons || {}).length;
      const totalStars = Object.values(prof.completedLessons || {}).reduce((sum, item) => sum + (item.stars || 0), 0);
      const drillEntries = Object.values(prof.completedDrills || {});
      const avgCpm = drillEntries.length
        ? Math.round(drillEntries.reduce((sum, d) => sum + (d.cpm || 0), 0) / drillEntries.length)
        : 0;
      const incompleteWorlds = window.CURRICULUM_WORLDS.filter(w => {
        const wLessons = window.CURRICULUM_LESSONS.filter(l => l.worldId === w.id);
        return wLessons.some(l => !(prof.completedLessons || {})[l.id]);
      }).map(w => `${w.icon} ${w.title}`);

      return `
        <div class="parent-profile-card">
          <div class="parent-card-head">
            <h3 class="parent-card-name">${prof.avatar} ${this.escapeHtml(prof.name)}</h3>
            <span class="parent-xp-badge">⭐ ${prof.xp || 0} XP</span>
          </div>
          <div class="parent-metrics-grid">
            <div class="parent-metric-box">
              <div class="parent-metric-val">${doneLessons}/${totalLessons}</div>
              <div class="parent-metric-label">完成課程</div>
            </div>
            <div class="parent-metric-box">
              <div class="parent-metric-val stars">⭐ ${totalStars}</div>
              <div class="parent-metric-label">總星星數</div>
            </div>
            <div class="parent-metric-box">
              <div class="parent-metric-val cpm">${avgCpm} CPM</div>
              <div class="parent-metric-label">平均打字速</div>
            </div>
          </div>
          <div class="parent-card-worlds">
            <strong>待探索世界：</strong>${incompleteWorlds.length ? incompleteWorlds.join('、') : '🎉 全數完成！'}
          </div>
        </div>
      `;
    }).join('');

    mainEl.innerHTML = `
      <div class="card-panel">
        <div class="parent-dash-header">
          <div>
            <h1 class="view-page-title">👨‍👩‍👧 家長儀表板與陪學指南</h1>
            <p class="view-page-sub-tight">
              一眼掌握 10 歲與 8 歲孩子的學習進度、星星數、打字速度，並支援跨電腦雲端同步與列印報告。
            </p>
          </div>
          <div class="daily-quest-actions">
            <button class="btn-primary" onclick="window.AppState.openCloudSyncModal()">☁️ 雲端同步 (Vercel Redis)</button>
            <button class="btn-secondary" onclick="window.print()">🖨️ 列印學習報告</button>
            <button class="btn-secondary" onclick="window.AppState.exportProgress()">💾 匯出代碼</button>
            <button class="btn-secondary" onclick="window.AppState.importProgress()">📥 匯入代碼</button>
          </div>
        </div>

        <div class="parent-dash-grid" aria-label="孩子學習進度比較">
          ${cardsHtml}
        </div>

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
          <h3>☁️ 3. 免費部署與 Vercel Redis 跨電腦雲端同步</h3>
          <div class="slide-body">本專案採用純靜態模組化架構＋可選的 Vercel Serverless API（<code>api/progress.js</code>）：
1. 在 Vercel Dashboard 專案中連接 Upstash Redis / Vercel KV（系統會自動填入 <code>KV_REST_API_URL</code> 與 <code>KV_REST_API_TOKEN</code>）。
2. 即可點選上方「☁️ 雲端同步」用家庭代碼＋PIN 碼在哥哥與妹妹的筆電間即時同步進度！
3. 尚未設定 Redis 時，也能隨時使用「💾 匯出代碼 / 📥 匯入代碼」離線備份。</div>
        </div>

        <div class="slide-card">
          <h3>🧩 4. 超好擴充的架構設計：未來想新增更多課程或打字關卡怎麼做？</h3>
          <div class="slide-body">我們特別把「課程資料」與「程式畫面」完全分離，你未來只需要編輯 <code>data/</code> 資料夾底下的兩個檔案：
• <strong>想新增打字練習關卡</strong>：打開 <code>data/typing-drills.js</code>，在 <code>drills</code> 陣列中新增一行 <code>{ id: '...', name: '...', text: '...' }</code>，打字道館就會自動產生新關卡與手指提示！
• <strong>想新增更多單元或世界</strong>：打開 <code>data/curriculum.js</code>，複製任一單元的格式貼上，主地圖與進度系統就會自動長出新課程！</div>
        </div>
      </div>
    `;
  },

  sanitizeProfile(raw, fallback) {
    const clean = {
      id: fallback.id,
      name: (raw && typeof raw.name === 'string' && raw.name.trim()) ? raw.name.trim().slice(0, 30) : fallback.name,
      avatar: (raw && typeof raw.avatar === 'string') ? raw.avatar.slice(0, 4) : fallback.avatar,
      xp: (raw && typeof raw.xp === 'number' && Number.isFinite(raw.xp) && raw.xp >= 0) ? Math.min(Math.floor(raw.xp), 999999) : 0,
      completedLessons: (raw && raw.completedLessons && typeof raw.completedLessons === 'object' && !Array.isArray(raw.completedLessons)) ? raw.completedLessons : {},
      completedDrills: (raw && raw.completedDrills && typeof raw.completedDrills === 'object' && !Array.isArray(raw.completedDrills)) ? raw.completedDrills : {},
      drillHistory: (raw && Array.isArray(raw.drillHistory)) ? raw.drillHistory.slice(-15) : [],
      studioChecks: (raw && raw.studioChecks && typeof raw.studioChecks === 'object' && !Array.isArray(raw.studioChecks)) ? raw.studioChecks : {}
    };
    return clean;
  },

  async openCloudSyncModal() {
    const promptFn = (window.UIModal && window.UIModal.prompt) ? window.UIModal.prompt.bind(window.UIModal) : window.prompt;
    const alertFn = (window.UIModal && window.UIModal.alert) ? window.UIModal.alert.bind(window.UIModal) : window.alert;
    const input = await promptFn(
      '請輸入「動作:家庭代碼:PIN碼」\n• 上傳進度範例：push:myfamily:1234\n• 下載進度範例：pull:myfamily:1234',
      'push:family01:1234',
      '☁️ Vercel Redis 雲端同步'
    );
    if (!input || typeof input !== 'string') return;
    const parts = input.trim().split(':');
    if (parts.length < 3) {
      alertFn('⚠️ 格式錯誤，請輸入 動作:家庭代碼:PIN碼（例如 push:family01:1234）');
      return;
    }
    const [action, code, pin] = parts.map(s => s.trim());
    if (action === 'pull') {
      await this.cloudSyncPull(code, pin);
    } else {
      await this.cloudSyncPush(code, pin);
    }
  },

  async cloudSyncPush(code, pin) {
    const alertFn = (window.UIModal && window.UIModal.alert) ? window.UIModal.alert.bind(window.UIModal) : window.alert;
    try {
      const res = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, pin, data: { profiles: this.profiles, activeProfileId: this.activeProfileId } })
      });
      const json = await res.json();
      if (res.status === 501 || json.error === 'REDIS_NOT_CONFIGURED') {
        alertFn('☁️ 尚未在 Vercel 設定 Redis 資料庫（KV_REST_API_URL / KV_REST_API_TOKEN）。請先在 Vercel 連接 Redis，或改用「匯出 / 匯入代碼」備份！');
        return;
      }
      if (!res.ok) {
        alertFn(`⚠️ 雲端上傳失敗：${json.error || res.status}`);
        return;
      }
      if (window.UIModal && window.UIModal.toast) window.UIModal.toast('☁️ 進度已成功上傳至雲端！');
    } catch (e) {
      alertFn('⚠️ 無法連線至雲端同步 API（離線模式請使用匯出代碼）。');
    }
  },

  async cloudSyncPull(code, pin) {
    const alertFn = (window.UIModal && window.UIModal.alert) ? window.UIModal.alert.bind(window.UIModal) : window.alert;
    try {
      const res = await fetch(`/api/progress?code=${encodeURIComponent(code)}&pin=${encodeURIComponent(pin)}`);
      const json = await res.json();
      if (res.status === 501 || json.error === 'REDIS_NOT_CONFIGURED') {
        alertFn('☁️ 尚未在 Vercel 設定 Redis 資料庫（KV_REST_API_URL / KV_REST_API_TOKEN）。請先在 Vercel 連接 Redis，或改用「匯出 / 匯入代碼」備份！');
        return;
      }
      if (!res.ok || !json.data || !json.data.profiles) {
        alertFn(`⚠️ 雲端下載失敗：${json.error || '找不到資料或 PIN 碼錯誤'}`);
        return;
      }
      this.profiles['kid-10'] = this.sanitizeProfile(json.data.profiles['kid-10'], this.profiles['kid-10']);
      this.profiles['kid-8'] = this.sanitizeProfile(json.data.profiles['kid-8'], this.profiles['kid-8']);
      if (json.data.activeProfileId === 'kid-8' || json.data.activeProfileId === 'kid-10') {
        this.activeProfileId = json.data.activeProfileId;
      }
      this.save();
      this.renderAll();
      if (window.UIModal && window.UIModal.toast) window.UIModal.toast('☁️ 已成功從雲端同步進度！');
    } catch (e) {
      alertFn('⚠️ 無法連線至雲端同步 API（離線模式請使用匯出代碼）。');
    }
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
        if (parsed && parsed.profiles && typeof parsed.profiles === 'object' &&
            (parsed.profiles['kid-10'] || parsed.profiles['kid-8'])) {
          if (parsed.profiles['kid-10']) {
            this.profiles['kid-10'] = this.sanitizeProfile(parsed.profiles['kid-10'], this.profiles['kid-10']);
          }
          if (parsed.profiles['kid-8']) {
            this.profiles['kid-8'] = this.sanitizeProfile(parsed.profiles['kid-8'], this.profiles['kid-8']);
          }
          if (parsed.activeProfileId === 'kid-10' || parsed.activeProfileId === 'kid-8') {
            this.activeProfileId = parsed.activeProfileId;
          }
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
      .replace(/`([^`]+)`/g, '<code class="inline-code-pill">$1</code>');
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

      case 'win11-taskbar':
        return wrap(`
          <svg viewBox="0 0 720 220" xmlns="http://www.w3.org/2000/svg" font-family="system-ui, sans-serif">
            <rect width="720" height="220" fill="#0f172a"/>
            <!-- Desktop Window -->
            <rect x="44" y="20" width="632" height="132" rx="10" fill="#f8fafc" stroke="#38bdf8" stroke-width="2"/>
            <rect x="44" y="20" width="632" height="30" rx="10" fill="#e2e8f0"/>
            <text x="64" y="40" fill="#0f172a" font-size="12" font-weight="800">📁 我的作業視窗</text>
            <!-- Top-right window buttons -->
            <rect x="572" y="24" width="26" height="22" rx="4" fill="#cbd5e1"/><text x="581" y="39" fill="#0f172a" font-size="12" font-weight="900">─</text>
            <rect x="604" y="24" width="26" height="22" rx="4" fill="#cbd5e1"/><text x="612" y="39" fill="#0f172a" font-size="12" font-weight="900">□</text>
            <rect x="636" y="24" width="26" height="22" rx="4" fill="#ef4444"/><text x="644" y="39" fill="#fff" font-size="12" font-weight="900">✕</text>
            <circle cx="650" cy="24" r="10" fill="#facc15"/><text x="646" y="28" fill="#0f172a" font-size="11" font-weight="900">1</text>
            <text x="80" y="96" fill="#475569" font-size="13" font-weight="700">提示：右上角三個按鈕分別是「─ 縮小」、「□ 放大」、「✕ 關閉」</text>
            <!-- Bottom Taskbar -->
            <rect x="0" y="168" width="720" height="52" fill="#1e293b"/>
            <rect x="240" y="176" width="36" height="36" rx="8" fill="#0284c7"/><text x="249" y="200" fill="#fff" font-size="18">⊞</text>
            <circle cx="240" cy="176" r="10" fill="#22c55e"/><text x="236" y="180" fill="#0f172a" font-size="11" font-weight="900">2</text>
            <rect x="286" y="178" width="120" height="32" rx="16" fill="#334155"/><text x="300" y="199" fill="#cbd5e1" font-size="11" font-weight="700">🔍 搜尋程式</text>
            <rect x="418" y="176" width="36" height="36" rx="8" fill="#f59e0b"/><text x="427" y="200" fill="#fff" font-size="16">📁</text>
            <rect x="464" y="176" width="36" height="36" rx="8" fill="#16a34a"/><text x="473" y="200" fill="#fff" font-size="16">🌐</text>
            <text x="580" y="198" fill="#fde047" font-size="12" font-weight="800">中 / 英 🔊 🔋</text>
            <circle cx="580" cy="176" r="10" fill="#38bdf8"/><text x="576" y="180" fill="#0f172a" font-size="11" font-weight="900">3</text>
          </svg>
        `, 'Windows 11 畫面地圖：① 視窗右上角縮小/放大/關閉 ② 底部藍色 ⊞ 開始按鈕 ③ 右下角可看中/英輸入法與電量！');

      case 'chrome-tabs-search':
        return wrap(`
          <svg viewBox="0 0 720 220" xmlns="http://www.w3.org/2000/svg" font-family="system-ui, sans-serif">
            <rect width="720" height="220" fill="#1e293b"/>
            <!-- Browser Tabs -->
            <rect x="20" y="18" width="170" height="34" rx="8" fill="#ffffff"/>
            <text x="34" y="40" fill="#0f172a" font-size="12" font-weight="800">🚀 數位小探險家  ✕</text>
            <rect x="198" y="22" width="140" height="30" rx="8" fill="#475569"/>
            <text x="212" y="42" fill="#e2e8f0" font-size="11" font-weight="700">🔍 新分頁  ✕</text>
            <circle cx="356" cy="36" r="13" fill="#22c55e"/><text x="351" y="41" fill="#0f172a" font-size="16" font-weight="900">+</text>
            <circle cx="356" cy="16" r="10" fill="#facc15"/><text x="352" y="20" fill="#0f172a" font-size="11" font-weight="900">1</text>
            <!-- Address Bar -->
            <rect x="20" y="54" width="680" height="46" rx="8" fill="#f8fafc"/>
            <text x="36" y="82" fill="#64748b" font-size="16" font-weight="900">←  →  ↻</text>
            <rect x="118" y="62" width="510" height="30" rx="15" fill="#e2e8f0" stroke="#38bdf8" stroke-width="2"/>
            <text x="134" y="82" fill="#0f172a" font-size="12" font-weight="700">🔒 https://www.google.com</text>
            <circle cx="118" cy="62" r="10" fill="#ef4444"/><text x="114" y="66" fill="#fff" font-size="11" font-weight="900">2</text>
            <rect x="642" y="62" width="44" height="30" rx="8" fill="#fef08a" stroke="#eab308"/>
            <text x="656" y="82" fill="#b45309" font-size="16" font-weight="900">★</text>
            <circle cx="686" cy="62" r="10" fill="#3b82f6"/><text x="682" y="66" fill="#fff" font-size="11" font-weight="900">3</text>
            <!-- Content Tip -->
            <rect x="20" y="114" width="680" height="88" rx="10" fill="#0f172a" stroke="#334155"/>
            <text x="40" y="148" fill="#86efac" font-size="13" font-weight="800">✅ 看到網址列左邊有 🔒 鎖頭圖示代表連線安全！</text>
            <text x="40" y="178" fill="#fde047" font-size="12" font-weight="700">💡 搜尋時避開寫著「贊助 / 廣告」的連結，找真正需要的網站！</text>
          </svg>
        `, '瀏覽器操作位置：① 按 + 開新分頁 (Ctrl+T) ② 網址列確認 🔒 安全鎖頭 ③ 按右邊 ★ 星星存成書籤！');

      case 'ai-prompt-box':
        return wrap(`
          <svg viewBox="0 0 720 220" xmlns="http://www.w3.org/2000/svg" font-family="system-ui, sans-serif">
            <rect width="720" height="220" fill="#0f172a"/>
            <!-- 3 Prompt Formula Blocks -->
            <rect x="24" y="24" width="210" height="90" rx="10" fill="#1e3a8a" stroke="#60a5fa" stroke-width="2"/>
            <text x="38" y="48" fill="#93c5fd" font-size="12" font-weight="900">① 角色 (Role)</text>
            <text x="38" y="76" fill="#ffffff" font-size="12" font-weight="700">「你是一位親切的</text>
            <text x="38" y="96" fill="#ffffff" font-size="12" font-weight="700">國小自然科學老師」</text>
            <rect x="255" y="24" width="210" height="90" rx="10" fill="#14532d" stroke="#4ade80" stroke-width="2"/>
            <text x="269" y="48" fill="#86efac" font-size="12" font-weight="900">② 任務 (Task)</text>
            <text x="269" y="76" fill="#ffffff" font-size="12" font-weight="700">「用 3 個簡單步驟</text>
            <text x="269" y="96" fill="#ffffff" font-size="12" font-weight="700">解釋為什麼天會下雨」</text>
            <rect x="486" y="24" width="210" height="90" rx="10" fill="#713f12" stroke="#facc15" stroke-width="2"/>
            <text x="500" y="48" fill="#fde047" font-size="12" font-weight="900">③ 限制 (Rule)</text>
            <text x="500" y="76" fill="#ffffff" font-size="12" font-weight="700">「給 8 歲孩子看，</text>
            <text x="500" y="96" fill="#ffffff" font-size="12" font-weight="700">不超過 100 字！」</text>
            <!-- Chat Input Box -->
            <rect x="24" y="136" width="672" height="58" rx="14" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
            <text x="44" y="170" fill="#cbd5e1" font-size="13" font-weight="700">💬 把 ①＋②＋③ 組合起來貼進對話框，再按右邊送出 ➔</text>
            <circle cx="664" cy="165" r="18" fill="#2563eb"/><text x="656" y="171" fill="#fff" font-size="15" font-weight="900">➤</text>
          </svg>
        `, 'AI 魔法咒語公式：① 設定角色 + ② 說明任務 + ③ 加上字數或年齡限制 = 超棒的 AI 回答！');

      case 'scratch-blocks-ui':
        return wrap(`
          <svg viewBox="0 0 720 220" xmlns="http://www.w3.org/2000/svg" font-family="system-ui, sans-serif">
            <rect width="720" height="220" fill="#1e293b"/>
            <!-- Left Block Palette -->
            <rect x="16" y="16" width="170" height="188" rx="8" fill="#0f172a" stroke="#475569"/>
            <text x="28" y="38" fill="#f8fafc" font-size="11" font-weight="800">🧩 積木區 (Blocks)</text>
            <circle cx="16" cy="16" r="10" fill="#facc15"/><text x="12" y="20" fill="#0f172a" font-size="11" font-weight="900">1</text>
            <rect x="28" y="54" width="144" height="26" rx="6" fill="#eab308"/><text x="38" y="71" fill="#0f172a" font-size="11" font-weight="900">⚑ 當綠旗被點擊</text>
            <rect x="28" y="90" width="144" height="26" rx="6" fill="#f97316"/><text x="38" y="107" fill="#fff" font-size="11" font-weight="900">🔁 重複無限次</text>
            <rect x="28" y="126" width="144" height="26" rx="6" fill="#3b82f6"/><text x="38" y="143" fill="#fff" font-size="11" font-weight="900">➡️ 移動 10 點</text>
            <rect x="28" y="162" width="144" height="26" rx="6" fill="#a855f7"/><text x="38" y="179" fill="#fff" font-size="11" font-weight="900">💬 說出「你好！」</text>
            <!-- Middle Script Workspace -->
            <rect x="200" y="16" width="270" height="188" rx="8" fill="#f8fafc" stroke="#38bdf8" stroke-width="2"/>
            <text x="214" y="38" fill="#0f172a" font-size="11" font-weight="800">🛠️ 程式區 (把積木拖過來拼)</text>
            <circle cx="200" cy="16" r="10" fill="#38bdf8"/><text x="196" y="20" fill="#0f172a" font-size="11" font-weight="900">2</text>
            <rect x="224" y="56" width="160" height="30" rx="6" fill="#eab308"/><text x="236" y="76" fill="#0f172a" font-size="12" font-weight="900">⚑ 當綠旗被點擊</text>
            <rect x="224" y="88" width="170" height="84" rx="6" fill="#f97316"/><text x="236" y="108" fill="#fff" font-size="12" font-weight="900">🔁 重複無限次</text>
            <rect x="242" y="118" width="140" height="32" rx="6" fill="#3b82f6"/><text x="254" y="138" fill="#fff" font-size="12" font-weight="900">➡️ x 改變 10</text>
            <!-- Right Stage -->
            <rect x="484" y="16" width="220" height="188" rx="8" fill="#ecfeff" stroke="#22c55e" stroke-width="2"/>
            <circle cx="508" cy="36" r="13" fill="#22c55e"/><text x="502" y="41" fill="#fff" font-size="14" font-weight="900">⚑</text>
            <circle cx="484" cy="16" r="10" fill="#22c55e"/><text x="480" y="20" fill="#0f172a" font-size="11" font-weight="900">3</text>
            <text x="530" y="40" fill="#0f172a" font-size="11" font-weight="800">按綠旗開始玩！</text>
            <text x="572" y="122" fill="#0f172a" font-size="40">🐱</text>
            <text x="518" y="182" fill="#475569" font-size="11" font-weight="700">舞台區 (角色會在這裡動)</text>
          </svg>
        `, 'Scratch 介面位置：① 左邊挑積木 ② 中間拼起來 ③ 右邊按綠色 ⚑ 旗幟執行遊戲！');

      case 'scratch-xy-coords':
        return wrap(`
          <svg viewBox="0 0 720 230" xmlns="http://www.w3.org/2000/svg" font-family="system-ui, sans-serif">
            <rect width="720" height="230" fill="#1e293b"/>
            <!-- Left: Coordinate Stage -->
            <rect x="20" y="16" width="320" height="198" rx="10" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
            <line x1="180" y1="28" x2="180" y2="202" stroke="#22c55e" stroke-width="2" stroke-dasharray="5 3"/>
            <line x1="34" y1="115" x2="326" y2="115" stroke="#ef4444" stroke-width="2" stroke-dasharray="5 3"/>
            <text x="155" y="42" fill="#86efac" font-size="11" font-weight="900">Y: +180 (上)</text>
            <text x="155" y="200" fill="#86efac" font-size="11" font-weight="900">Y: -180 (下)</text>
            <text x="32" y="108" fill="#fca5a5" font-size="11" font-weight="900">X: -240</text>
            <text x="272" y="108" fill="#fca5a5" font-size="11" font-weight="900">X: +240</text>
            <circle cx="180" cy="115" r="16" fill="#38bdf8" fill-opacity="0.25"/>
            <text x="168" y="122" fill="#fff" font-size="22">🛸</text>
            <text x="188" y="132" fill="#fde047" font-size="10" font-weight="800">(0, 0)</text>
            <!-- Right: Code Blocks -->
            <rect x="360" y="16" width="340" height="198" rx="10" fill="#f8fafc" stroke="#f97316" stroke-width="2"/>
            <text x="376" y="40" fill="#0f172a" font-size="12" font-weight="900">🧩 滑順移動積木組合</text>
            <rect x="376" y="54" width="190" height="28" rx="6" fill="#f97316"/><text x="388" y="72" fill="#fff" font-size="11" font-weight="900">🔁 重複無限次</text>
            <rect x="394" y="88" width="248" height="28" rx="6" fill="#fb923c"/><text x="404" y="106" fill="#0f172a" font-size="11" font-weight="900">如果 &lt;向上鍵被按下?&gt; 那麼</text>
            <rect x="414" y="120" width="160" height="26" rx="6" fill="#3b82f6"/><text x="424" y="137" fill="#fff" font-size="11" font-weight="900">⬆️ y 改變 10</text>
            <rect x="394" y="152" width="248" height="28" rx="6" fill="#fb923c"/><text x="404" y="170" fill="#0f172a" font-size="11" font-weight="900">如果 &lt;向右鍵被按下?&gt; 那麼</text>
            <rect x="414" y="182" width="160" height="24" rx="6" fill="#3b82f6"/><text x="424" y="198" fill="#fff" font-size="11" font-weight="900">➡️ x 改變 10</text>
          </svg>
        `, 'Scratch 座標口訣：① 紅線 X 軸控制左右 ② 綠線 Y 軸控制上下 ③ 用「重複無限次」包住方向鍵積木就會超滑順！');

      case 'scratch-variables-if':
        return wrap(`
          <svg viewBox="0 0 720 220" xmlns="http://www.w3.org/2000/svg" font-family="system-ui, sans-serif">
            <rect width="720" height="220" fill="#1e293b"/>
            <rect x="16" y="16" width="200" height="188" rx="10" fill="#0f172a" stroke="#f97316" stroke-width="2"/>
            <text x="28" y="38" fill="#fdba74" font-size="12" font-weight="900">📦 左側「變數」區</text>
            <rect x="28" y="52" width="174" height="30" rx="6" fill="#ea580c"/><text x="40" y="71" fill="#fff" font-size="11" font-weight="900">+ 建立一個變數</text>
            <rect x="28" y="96" width="174" height="26" rx="13" fill="#f97316"/><text x="44" y="113" fill="#fff" font-size="11" font-weight="900">🏆 分數: 0</text>
            <rect x="28" y="132" width="174" height="26" rx="13" fill="#ef4444"/><text x="44" y="149" fill="#fff" font-size="11" font-weight="900">❤️ 生命值: 3</text>
            <rect x="232" y="16" width="472" height="188" rx="10" fill="#f8fafc" stroke="#38bdf8" stroke-width="2"/>
            <text x="248" y="38" fill="#0f172a" font-size="12" font-weight="900">💥 碰撞規則積木</text>
            <rect x="248" y="52" width="280" height="28" rx="6" fill="#eab308"/><text x="260" y="70" fill="#0f172a" font-size="11" font-weight="900">⚑ 當綠旗被點擊 ➔ 分數設為 0、生命值設為 3</text>
            <rect x="248" y="90" width="290" height="28" rx="6" fill="#fb923c"/><text x="260" y="108" fill="#0f172a" font-size="11" font-weight="900">如果 &lt;淺藍偵測：碰到 金幣?&gt; 那麼</text>
            <rect x="268" y="122" width="180" height="24" rx="6" fill="#ea580c"/><text x="280" y="138" fill="#fff" font-size="11" font-weight="900">變數 [分數] 改變 1</text>
            <rect x="248" y="156" width="430" height="28" rx="6" fill="#fb923c"/><text x="260" y="174" fill="#0f172a" font-size="11" font-weight="900">如果 &lt;碰到 雷射?&gt; ➔ 生命值改變 -1 ➔ 等待 0.5 秒</text>
          </svg>
        `, '① 左側橘紅「變數」區建立 分數 與 生命值 ② 綠旗開局先歸零/設滿 ③ 用淺藍「碰到...?」積木判斷加分或扣血！');

      case 'scratch-clones-timer':
        return wrap(`
          <svg viewBox="0 0 720 220" xmlns="http://www.w3.org/2000/svg" font-family="system-ui, sans-serif">
            <rect width="720" height="220" fill="#1e293b"/>
            <rect x="16" y="16" width="330" height="188" rx="10" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>
            <text x="32" y="40" fill="#fde047" font-size="12" font-weight="900">1️⃣ 本體生分身 (控制區)</text>
            <rect x="32" y="56" width="210" height="28" rx="6" fill="#eab308"/><text x="44" y="74" fill="#0f172a" font-size="11" font-weight="900">當按下 [空白鍵]</text>
            <rect x="32" y="92" width="210" height="28" rx="6" fill="#f97316"/><text x="44" y="110" fill="#fff" font-size="11" font-weight="900">👯‍♂️ 建立 [自己] 的分身</text>
            <rect x="32" y="128" width="210" height="28" rx="6" fill="#f97316"/><text x="44" y="146" fill="#fff" font-size="11" font-weight="900">⏱️ 等待 0.2 秒 (射速冷卻)</text>
            <rect x="364" y="16" width="340" height="188" rx="10" fill="#f8fafc" stroke="#22c55e" stroke-width="2"/>
            <text x="380" y="40" fill="#0f172a" font-size="12" font-weight="900">2️⃣ 分身飛出去 + 清掉自己</text>
            <rect x="380" y="56" width="220" height="28" rx="6" fill="#f97316"/><text x="392" y="74" fill="#fff" font-size="11" font-weight="900">當分身產生時 ➔ 顯示</text>
            <rect x="380" y="92" width="260" height="28" rx="6" fill="#fb923c"/><text x="392" y="110" fill="#0f172a" font-size="11" font-weight="900">重複直到 &lt;碰到邊緣?&gt; ➔ y 改變 12</text>
            <rect x="380" y="128" width="220" height="28" rx="6" fill="#dc2626"/><text x="392" y="146" fill="#fff" font-size="11" font-weight="900">🧹 刪除此分身 (必加！)</text>
            <rect x="380" y="166" width="280" height="26" rx="6" fill="#0284c7"/><text x="392" y="183" fill="#fff" font-size="11" font-weight="900">⏱️ 偵測區：計時器重置 / 計時器 &gt; 30 結束</text>
          </svg>
        `, '分身與計時器位置：① 本體負責「建立自己的分身」 ② 分身負責飛行，飛出邊緣一定要「刪除此分身」 ③ 偵測區有「計時器」！');

      default:
        return '';
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  window.AppState.init();
});
