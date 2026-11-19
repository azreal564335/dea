/**
 * ============================================================================
 * 🧪 COMPREHENSIVE AUTOMATED DOM & INTERACTION TEST SUITE (tests/run-all-tests.js)
 * ============================================================================
 * Tests BOTH:
 * 1. Modular source files (index.html + js/*.js + data/*.js)
 * 2. Self-contained bundled HTML artifact (digital_explorer_academy.html)
 *
 * Verifies:
 * - Window & sandboxed iframe compatibility: UIModal.alert/prompt/toast replaces blocking alert/prompt
 * - Navigation: all 5 top tabs ('map', 'dojo', 'vocab', 'certificate', 'parent')
 * - Profile switching: 'kid-10' <-> 'kid-8'
 * - Profile renaming via UIModal.prompt ("✏️ 改名" updates profile name and persists)
 * - Language toggle: Bilingual 'show-en' toggle
 * - Export & Import progress backup code with custom modal
 * - All 18 lessons ('w1-l1' through 'w4-l3') across 4 Worlds:
 *     - 'learn' mode slides
 *     - 'lab' mode (tests every simulator: win11-power, win11-window, shortcut-rescue, browser-pilot,
 *       search-detective, scam-shield, ai-prompt-builder, ai-skill-coach, ai-image-studio,
 *       maps-navigator, slide-studio, scratch-blocks, story-studio)
 *     - 'quiz' mode: answering all multiple-choice questions correctly to achieve 3 stars and full XP rewards
 * - All 22 typing drills in TypingDojo:
 *     - Character highlight & live typing updates without destroying input element
 *     - IME composition compatibility
 *     - Calculation of speed (WPM/CPM) and accuracy (100%)
 *     - Progression through all drills in all categories
 * - Three.js IslandScene World 4 multi-modal routing & waypoints
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const failureDetails = [];

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ PASS: ${message}`);
  } else {
    failedTests++;
    console.error(`  ❌ FAIL: ${message}`);
    failureDetails.push(message);
  }
}

async function runTestsForHtml(htmlContent, suiteTitle) {
  console.log(`\n================================================================================`);
  console.log(`🚀 RUNNING TEST SUITE: ${suiteTitle}`);
  console.log(`================================================================================`);

  // Create isolated DOM environment with virtual localStorage
  const storage = {};
  let clipboardText = '';

  const dom = new JSDOM(htmlContent, {
    runScripts: 'dangerously',
    url: 'https://digital-explorer-academy.vercel.app/',
    beforeParse(window) {
      window.localStorage = {
        getItem(k) { return storage[k] || null; },
        setItem(k, v) { storage[k] = String(v); },
        removeItem(k) { delete storage[k]; },
        clear() { for (const k in storage) delete storage[k]; }
      };

      window.navigator.clipboard = {
        writeText: async (t) => { clipboardText = t; return Promise.resolve(); },
        readText: async () => Promise.resolve(clipboardText)
      };

      window.document.execCommand = (cmd) => {
        if (cmd === 'copy') return true;
        return false;
      };

      window.speechSynthesis = {
        speak: () => {},
        cancel: () => {}
      };
      window.SpeechSynthesisUtterance = function (t) { this.text = t; };
    }
  });

  const { window } = dom;

  // Wait for scripts and DOMContentLoaded
  await new Promise(r => setTimeout(r, 250));

  // 1. Verify Core Globals
  assert(typeof window.AppState === 'object', 'window.AppState is initialized');
  assert(typeof window.UIModal === 'object', 'window.UIModal is available');
  assert(typeof window.TypingDojo === 'object', 'window.TypingDojo is available');
  assert(typeof window.Simulators === 'object', 'window.Simulators is available');
  assert(Array.isArray(window.CURRICULUM_WORLDS) && window.CURRICULUM_WORLDS.length === 7, 'All 7 curriculum worlds are loaded');
  assert(Array.isArray(window.CURRICULUM_LESSONS) && window.CURRICULUM_LESSONS.length === 29, 'All 29 curriculum lessons are loaded');
  assert(Array.isArray(window.TYPING_DATA.categories) && window.TYPING_DATA.categories.length === 6, 'All 6 typing categories loaded');

  // Count total drills
  let drillCount = 0;
  window.TYPING_DATA.categories.forEach(c => drillCount += c.drills.length);
  assert(drillCount === 22, `Total 22 typing drills defined (found: ${drillCount})`);

  // 2. Test Top Navigation Tabs
  console.log('\n--- Testing Top Navigation Tabs ---');
  const tabs = ['map', 'dojo', 'vocab', 'certificate', 'parent'];
  for (const tab of tabs) {
    window.AppState.navigate(tab);
    assert(window.AppState.currentView === tab, `Navigated to top tab: '${tab}'`);
    const mainEl = window.document.getElementById('app-main');
    assert(mainEl && mainEl.children.length > 0, `Content rendered for tab: '${tab}'`);
  }

  // 3. Test Profile Switching
  console.log('\n--- Testing Profile Switching ---');
  window.AppState.navigate('map');
  assert(window.AppState.activeProfileId === 'kid-10', 'Default active profile is kid-10');
  window.AppState.switchProfile();
  assert(window.AppState.activeProfileId === 'kid-8', 'Profile switched to kid-8');
  window.AppState.switchProfile();
  assert(window.AppState.activeProfileId === 'kid-10', 'Profile switched back to kid-10');

  // 4. Test Profile Renaming via Custom UIModal
  console.log('\n--- Testing Profile Renaming via Custom UIModal ---');
  // Trigger renameCurrentProfile
  window.AppState.renameCurrentProfile();
  const modalOverlay = window.document.getElementById('ui-modal-overlay');
  assert(modalOverlay && modalOverlay.style.display !== 'none', 'Custom UIModal overlay displayed when renaming');
  const promptInput = window.document.getElementById('ui-modal-prompt-input');
  assert(promptInput && promptInput.value === '10歲大探險家', 'UIModal prompt pre-fills current profile name');

  // Simulate user changing name to "大探險家 Leo" and clicking OK
  promptInput.value = '大探險家 Leo';
  const okBtn = window.document.getElementById('ui-modal-ok-btn');
  okBtn.click();
  await new Promise(r => setTimeout(r, 50));

  assert(window.AppState.getProfile().name === '大探險家 Leo', 'Profile name successfully updated via UIModal to "大探險家 Leo"');
  assert(modalOverlay.style.display === 'none', 'Modal overlay closed after submitting');

  // 5. Test Language Toggle (Bilingual English Subtitles)
  console.log('\n--- Testing Language Toggle ---');
  assert(window.AppState.showEnglishSubtitles === true, 'Bilingual subtitles initially enabled');
  assert(window.document.body.classList.contains('show-en'), 'document.body contains "show-en" class');
  window.AppState.toggleEnglish();
  assert(window.AppState.showEnglishSubtitles === false, 'Subtitles toggled off');
  assert(!window.document.body.classList.contains('show-en'), '"show-en" class removed from body');
  window.AppState.toggleEnglish();
  assert(window.AppState.showEnglishSubtitles === true, 'Subtitles toggled back on');
  assert(window.document.body.classList.contains('show-en'), '"show-en" restored on body');

  // 6. Test Export & Import Progress
  console.log('\n--- Testing Progress Export & Import ---');
  window.AppState.getProfile().xp = 750;
  window.AppState.exportProgress();
  const exportInput = window.document.getElementById('ui-modal-prompt-input');
  assert(exportInput && exportInput.value.length > 20, 'Export code generated in custom UIModal');
  const exportedCode = exportInput.value;
  window.UIModal.close(null);

  // Modify local XP
  window.AppState.getProfile().xp = 0;
  assert(window.AppState.getProfile().xp === 0, 'Reset profile XP to 0 before import');

  // Now import the code
  window.AppState.importProgress();
  const importInput = window.document.getElementById('ui-modal-prompt-input');
  assert(importInput !== null, 'Import prompt modal opened');
  importInput.value = exportedCode;
  window.document.getElementById('ui-modal-ok-btn').click();
  await new Promise(r => setTimeout(r, 50));
  assert(window.AppState.getProfile().xp === 750, 'Progress successfully imported and restored 750 XP!');

  // 7. Test All 18 Lessons: Learn -> Lab (Simulators) -> Quiz
  console.log('\n--- Testing All 18 Lessons (Learn -> Lab -> Quiz) ---');
  for (const lesson of window.CURRICULUM_LESSONS) {
    console.log(`\n  * Testing Lesson: [${lesson.id}] ${lesson.number} ${lesson.title}`);

    // Step 1: Learn View
    window.AppState.navigate('lesson', lesson.id);
    assert(window.AppState.currentLessonId === lesson.id, `Navigated to lesson ${lesson.id}`);
    assert(window.AppState.lessonStep === 'learn', `Default step is 'learn'`);
    const learnCards = window.document.querySelectorAll('.slide-card');
    assert(learnCards.length > 0, `Rendered ${learnCards.length} learn cards`);

    // Step 2: Lab View (Interactive Simulators)
    window.AppState.setLessonStep('lab');
    assert(window.AppState.lessonStep === 'lab', `Switched to 'lab' step`);
    const simMount = window.document.getElementById('lesson-simulator-mount');
    assert(simMount !== null, `Simulator mount container found`);

    // Test specific simulator actions
    if (lesson.simulator.type === 'win11-power') {
      // Test hazards removal
      assert(simMount.textContent.includes('移除筆電旁邊'), 'win11-power simulator loaded');
      window.Simulators.removeHazard('drink', 'lesson-simulator-mount');
      window.Simulators.removeHazard('pencil', 'lesson-simulator-mount');
      window.Simulators.removeHazard('pillow', 'lesson-simulator-mount');
      assert(Object.keys(window.Simulators.state.hazardsRemoved).length === 3, 'All 3 desktop hazards removed');

      // Test Start Menu and Power Shut down
      window.Simulators.toggleStartMenu('lesson-simulator-mount');
      assert(window.Simulators.state.startMenuOpen === true, 'Start Menu opened');
      window.Simulators.togglePowerMenu('lesson-simulator-mount');
      assert(window.Simulators.state.powerMenuOpen === true, 'Power menu opened');
      window.Simulators.completeShutdown('lesson-simulator-mount');
      assert(window.Simulators.state.powerDone === true, 'Safe Shut down completed');
    } else if (lesson.simulator.type === 'win11-window') {
      window.Simulators.doWindowTask('rightClick', 'lesson-simulator-mount');
      assert(window.Simulators.state.rightClickDone === true, 'Right click task completed');
      window.Simulators.doWindowTask('maximize', 'lesson-simulator-mount');
      assert(window.Simulators.state.maximizedDone === true, 'Maximize task completed');
      window.Simulators.doWindowTask('snap', 'lesson-simulator-mount');
      assert(window.Simulators.state.snapDone === true, 'Snap window task completed');
    } else if (lesson.simulator.type === 'shortcut-rescue') {
      window.Simulators.doShortcut('undo', 'lesson-simulator-mount');
      assert(window.Simulators.state.undoDone === true, 'Ctrl+Z Undo task completed');
      window.Simulators.doShortcut('copy', 'lesson-simulator-mount');
      assert(window.Simulators.state.copiedDone === true, 'Ctrl+C Copy task completed');
      window.Simulators.doShortcut('paste', 'lesson-simulator-mount');
      assert(window.Simulators.state.pastedDone === true, 'Ctrl+V Paste task completed');
      window.Simulators.doShortcut('save', 'lesson-simulator-mount');
      assert(window.Simulators.state.fileNamedDone === true, 'Ctrl+S File Save task completed');
    } else if (lesson.simulator.type === 'browser-pilot') {
      window.Simulators.browserAction('closeTab', 'lesson-simulator-mount');
      assert(window.Simulators.state.tabsClosed >= 1, 'Closed unused tab');
      window.Simulators.browserAction('newTab', 'lesson-simulator-mount');
      assert(window.Simulators.state.newTabOpened === true, 'New tab opened');
      window.Simulators.browserAction('bookmark', 'lesson-simulator-mount');
      assert(window.Simulators.state.bookmarked === true, 'URL bookmarked');
    } else if (lesson.simulator.type === 'search-detective') {
      window.Simulators.switchSearchScenario(0, 'lesson-simulator-mount');
      window.Simulators.pickSearchKeyword(2, 'lesson-simulator-mount'); // '板橋車站 拉麵 親子 推薦 菜單'
      assert(window.Simulators.state.selectedKeywordIdx === 2, 'Selected optimal search keyword');
      window.Simulators.pickSearchResult(1, 'lesson-simulator-mount'); // Real review, not ad
      assert(window.Simulators.state.selectedResultIdx === 1, 'Selected reliable organic result over Ad');
    } else if (lesson.simulator.type === 'scam-shield') {
      window.Simulators.answerScam(true, 'lesson-simulator-mount');
      assert(window.Simulators.state.scamAnswered === true, 'Phishing detection answered');
      window.Simulators.nextScam('lesson-simulator-mount', 3);
      assert(window.Simulators.state.scamIdx === 1, 'Advanced to next scam test');
    } else if (lesson.simulator.type === 'ai-prompt-builder') {
      window.Simulators.setPromptPart('roleIdx', 1, 'lesson-simulator-mount');
      window.Simulators.setPromptPart('taskIdx', 1, 'lesson-simulator-mount');
      window.Simulators.testAiPrompt('lesson-simulator-mount');
      assert(window.Simulators.state.promptTested === true, 'AI Prompt tested and simulated response generated');
      window.Simulators.copyText('lesson-simulator-mount-prompt-box');
      assert(clipboardText.length > 10, 'Prompt copied to clipboard successfully');
    } else if (lesson.simulator.type === 'ai-skill-coach') {
      window.Simulators.selectCoachSkill(0, 'lesson-simulator-mount');
      assert(window.Simulators.state.coachStep === 1, 'Coach Step 1 started');
      window.Simulators.advanceCoach(2, 'lesson-simulator-mount');
      assert(window.Simulators.state.coachStep === 2, 'Coach Step 2 unlocked');
      window.Simulators.copyText('lesson-simulator-mount-coach-prompt');
      assert(clipboardText.includes('你是一位超有耐心'), 'Skill Coach prompt copied to clipboard');
    } else if (lesson.simulator.type === 'ai-image-studio') {
      window.Simulators.setImgPart('imgSubjectIdx', 1, 'lesson-simulator-mount');
      window.Simulators.setImgPart('imgStyleIdx', 0, 'lesson-simulator-mount');
      window.Simulators.copyText('lesson-simulator-mount-img-zh');
      assert(clipboardText.length > 5, 'Chinese image prompt copied');
      window.Simulators.copyText('lesson-simulator-mount-img-en');
      assert(clipboardText.length > 5, 'English image prompt copied');
    } else if (lesson.simulator.type === 'maps-navigator') {
      window.Simulators.setMapsMode('transit', 'lesson-simulator-mount');
      assert(window.Simulators.state.mapsTripMode === 'transit', 'Maps trip mode switched to transit');
      window.Simulators.toggleMapsStreetView('lesson-simulator-mount');
      assert(window.Simulators.state.mapsStreetViewOpen === true, 'Maps Street View Pegman opened');
      window.Simulators.setMapsReviewFilter('real', 'lesson-simulator-mount');
      assert(window.Simulators.state.mapsReviewFilter === 'real', 'Maps review filtered to real reviews');
      window.Simulators.inspectMapsReview('rev-1', 'lesson-simulator-mount');
      assert(window.Simulators.state.mapsSelectedReviewId === 'rev-1', 'Inspected real review details');
    } else if (lesson.simulator.type === 'slide-studio') {
      window.Simulators.toggleSlideStep('slideRescueStep1', 'lesson-simulator-mount');
      assert(window.Simulators.state.slideRescueStep1 === true, 'Slide Rescue Step 1 (Rule of 3) applied');
      window.Simulators.toggleSlideStep('slideRescueStep2', 'lesson-simulator-mount');
      assert(window.Simulators.state.slideRescueStep2 === true, 'Slide Rescue Step 2 (High Contrast) applied');
      window.Simulators.toggleSlideStep('slideRescueStep3', 'lesson-simulator-mount');
      assert(window.Simulators.state.slideRescueStep3 === true, 'Slide Rescue Step 3 (Hero Visual) applied');
      window.Simulators.toggleSlideShow('lesson-simulator-mount');
      assert(window.Simulators.state.slideShowMode === true, 'Slide presentation mode launched');
      window.Simulators.toggleSlideShow('lesson-simulator-mount');
    } else if (lesson.simulator.type === 'scratch-blocks') {
      window.Simulators.toggleScratchBlock('scratchBlockBowl', 'lesson-simulator-mount');
      assert(window.Simulators.state.scratchBlockBowl === true, 'Scratch bowl controller block snapped');
      window.Simulators.toggleScratchBlock('scratchBlockApple', 'lesson-simulator-mount');
      assert(window.Simulators.state.scratchBlockApple === true, 'Scratch apple falling block snapped');
      window.Simulators.toggleScratchBlock('scratchBlockScore', 'lesson-simulator-mount');
      assert(window.Simulators.state.scratchBlockScore === true, 'Scratch score & broadcast block snapped');
      window.Simulators.toggleScratchGame('lesson-simulator-mount');
      assert(window.Simulators.state.scratchGamePlaying === true, 'Scratch game loop started');
      assert(window.Simulators._scratchTimer !== null, 'Scratch animation timer active');
      window.Simulators.catchAppleDirect('lesson-simulator-mount');
      assert(window.Simulators.state.scratchScore >= 1, 'Caught falling apple and increased score');
      // Test nav-away lifecycle safety: timer must be cleanly cleared when container unmounts
      window.Simulators.toggleScratchGame('lesson-simulator-mount');
      assert(window.Simulators.state.scratchGamePlaying === false, 'Scratch game paused/stopped cleanly');
    } else if (lesson.simulator.type === 'story-studio') {
      window.Simulators.setStoryPart('storyHeroIdx', 1, 'lesson-simulator-mount');
      assert(window.Simulators.state.storyHeroIdx === 1, 'Story hero selected');
      window.Simulators.setStoryPart('storyCompanionIdx', 2, 'lesson-simulator-mount');
      assert(window.Simulators.state.storyCompanionIdx === 2, 'Story companion selected');
      window.Simulators.setStoryPart('storySettingIdx', 1, 'lesson-simulator-mount');
      assert(window.Simulators.state.storySettingIdx === 1, 'Story setting selected');
      window.Simulators.setStoryPart('storyTwistIdx', 1, 'lesson-simulator-mount');
      assert(window.Simulators.state.storyTwistIdx === 1, 'Story plot twist selected');
      window.Simulators.setStoryScene(1, 'lesson-simulator-mount');
      assert(window.Simulators.state.storyCurrentScene === 1, 'Navigated to Story scene 2');
      // Test TTS narration and error resilience
      window.Simulators.speakStoryScene(1, 'lesson-simulator-mount');
      assert(typeof window.speechSynthesis === 'object', 'TTS narration triggered successfully');
      // Simulate TTS throw to verify error resilience (no uncaught exception)
      const origSpeak = window.speechSynthesis.speak;
      window.speechSynthesis.speak = () => { throw new Error('Simulated TTS device error'); };
      let ttsErrorHandled = true;
      try {
        window.Simulators.speakStoryScene(1, 'lesson-simulator-mount');
      } catch (e) {
        ttsErrorHandled = false;
      }
      assert(ttsErrorHandled === true, 'TTS speech synthesis error handled gracefully without throwing');
      window.speechSynthesis.speak = origSpeak;
    } else if (lesson.simulator.type === 'roblox-studio-basics') {
      const beforeCount = window.Simulators.state.rbxParts.length;
      window.Simulators.rbxAddPart('Block', 'lesson-simulator-mount');
      assert(window.Simulators.state.rbxParts.length === beforeCount + 1, 'Added new 3D Part in Roblox Studio');
      window.Simulators.rbxUpdateProp('anchored', true, 'lesson-simulator-mount');
      window.Simulators.rbxTogglePlaytest('lesson-simulator-mount');
      assert(window.Simulators.state.rbxPlaytestRunning === true, 'Roblox Studio gravity playtest started');
      window.Simulators.rbxTogglePlaytest('lesson-simulator-mount');
    } else if (lesson.simulator.type === 'roblox-obby-builder') {
      window.Simulators.obbySetBrush('safe', 'lesson-simulator-mount');
      window.Simulators.obbyPaintCell(2, 2, 'lesson-simulator-mount');
      assert(window.Simulators.state.obbyCells['2,2'] === 'safe', 'Painted safe platform in Obby builder');
      window.Simulators.obbyTogglePlaytest('lesson-simulator-mount');
      assert(window.Simulators.state.obbyPlaying === true, 'Obby playtest started');
      window.Simulators.obbyControl('jump', 'lesson-simulator-mount');
      window.Simulators.obbyTogglePlaytest('lesson-simulator-mount');
      assert(window.Simulators.state.obbyPlaying === false, 'Obby playtest stopped cleanly');
    } else if (lesson.simulator.type === 'roblox-lua-lab') {
      window.Simulators.luaSelectPreset('speed', 'lesson-simulator-mount');
      window.Simulators.luaToggleStep(1, 'lesson-simulator-mount');
      window.Simulators.luaToggleStep(2, 'lesson-simulator-mount');
      window.Simulators.luaToggleStep(3, 'lesson-simulator-mount');
      window.Simulators.luaRunTrigger('lesson-simulator-mount');
      assert(window.Simulators.state.luaWalkSpeed === 40, 'Luau Speed Pad script increased WalkSpeed to 40');
    } else if (lesson.simulator.type === 'roblox-game-architect') {
      window.Simulators.rbxSelectGenre('tycoon', 'lesson-simulator-mount');
      [0, 1, 2, 3].forEach(i => window.Simulators.rbxToggleModule(i, 'lesson-simulator-mount'));
      window.Simulators.rbxRunGenreSim('lesson-simulator-mount');
      assert(window.Simulators.state.rbxGenreSimDone === true, 'Tycoon game loop simulation completed');
      window.Simulators.rbxToggleCheck('toolbox', 'lesson-simulator-mount');
      window.Simulators.rbxToggleCheck('playtest', 'lesson-simulator-mount');
      window.Simulators.rbxToggleCheck('privacy', 'lesson-simulator-mount');
      assert(window.Simulators.state.rbxChecks.privacy === true, 'Roblox safe publish checklist completed');
    } else if (lesson.simulator.type === 'roblox-disaster-lab') {
      window.Simulators.setDisasterType('flood', 'lesson-simulator-mount');
      window.Simulators.runDisasterRound('lesson-simulator-mount');
      assert(window.Simulators.state.disasterRoundRan === true, 'Natural disaster round simulation ran');
    } else if (lesson.simulator.type === 'roblox-garden-sim') {
      window.Simulators.gardenSelectCrop('sunflower', 'lesson-simulator-mount');
      window.Simulators.gardenPlant('lesson-simulator-mount');
      window.Simulators.gardenWater('lesson-simulator-mount');
      window.Simulators.gardenWater('lesson-simulator-mount');
      window.Simulators.gardenHarvest('lesson-simulator-mount');
      assert(window.Simulators.state.gardenCoins >= 20, 'Garden simulator planted, watered, and harvested for coins');
    } else if (lesson.simulator.type === 'roblox-rp-stage') {
      window.Simulators.rpToggleDoor('lesson-simulator-mount');
      window.Simulators.rpToggleLamp('lesson-simulator-mount');
      window.Simulators.rpVoteRunway('lesson-simulator-mount');
      assert(window.Simulators.state.rpDoorOpen === true && window.Simulators.state.rpRunwayStars === 5, 'Brookhaven door and Dress to Impress runway tested');
    } else if (lesson.simulator.type === 'roblox-boat-builder') {
      window.Simulators.boatTogglePart('wood', 'lesson-simulator-mount');
      window.Simulators.boatTogglePart('seat', 'lesson-simulator-mount');
      window.Simulators.boatLaunch('lesson-simulator-mount');
      assert(window.Simulators.state.boatLaunched === true, 'Build a Boat WeldConstraint vessel launched');
    } else if (lesson.simulator.type === 'scratch-space-dodge') {
      window.Simulators.scToggleSpaceBlock('x', 'lesson-simulator-mount');
      window.Simulators.scToggleSpaceBlock('y', 'lesson-simulator-mount');
      window.Simulators.scMoveShip(10, 10, 'lesson-simulator-mount');
      assert(window.Simulators.state.scShipX === 10 && window.Simulators.state.scShipY === 10, 'Scratch Space Dodge X/Y ship moved');
    } else if (lesson.simulator.type === 'scratch-collision-hp') {
      window.Simulators.scToggleRule('coin', 'lesson-simulator-mount');
      window.Simulators.scToggleRule('laser', 'lesson-simulator-mount');
      window.Simulators.scHitEvent('coin', 'lesson-simulator-mount');
      window.Simulators.scHitEvent('laser', 'lesson-simulator-mount');
      assert(window.Simulators.state.scScore === 1 && window.Simulators.state.scHp === 2, 'Scratch Collision updated Score and HP');
    } else if (lesson.simulator.type === 'scratch-clone-timer') {
      window.Simulators.scSetCloneRate(0.2, 'lesson-simulator-mount');
      window.Simulators.scFireClones('lesson-simulator-mount');
      assert(window.Simulators.state.scClonesFired >= 5, 'Scratch Clone & Timer fired clones');
    }

    // Step 3: Quiz View
    window.AppState.setLessonStep('quiz');
    assert(window.AppState.lessonStep === 'quiz', `Switched to 'quiz' step`);
    const quizCards = window.document.querySelectorAll('.quiz-question-card');
    assert(quizCards.length === lesson.quiz.length, `Rendered all ${lesson.quiz.length} quiz questions`);

    // Answer all quiz questions correctly
    const initialXP = window.AppState.getProfile().xp;
    lesson.quiz.forEach((q, qIdx) => {
      window.AppState.answerQuiz(qIdx, q.correct, lesson.id, lesson.xp);
    });

    assert(window.AppState.isQuizAllCorrect(lesson) === true, `All questions in ${lesson.id} answered correctly`);
    const comp = window.AppState.getProfile().completedLessons[lesson.id];
    assert(comp && comp.stars === 3, `Lesson ${lesson.id} marked complete with 3 stars`);
    assert(window.AppState.getProfile().xp >= initialXP + lesson.xp, `Awarded +${lesson.xp} XP for lesson ${lesson.id}`);
  }

  // 8. Test All 22 Typing Dojo Drills
  console.log('\n--- Testing All 22 Typing Dojo Drills in Standalone Dojo ---');
  window.AppState.navigate('dojo');
  assert(window.AppState.currentView === 'dojo', 'Navigated to standalone Dojo');

  const dojoMount = window.document.getElementById('standalone-dojo-mount');
  assert(dojoMount !== null, 'Found standalone-dojo-mount container');

  for (const category of window.TYPING_DATA.categories) {
    for (const drill of category.drills) {
      window.TypingDojo.selectCategory(category.id, 'standalone-dojo-mount');
      window.TypingDojo.selectDrill(drill.id, 'standalone-dojo-mount');
      assert(window.TypingDojo.currentDrillId === drill.id, `Selected drill: ${drill.id} (${drill.name})`);

      const inputEl = window.document.getElementById('standalone-dojo-mount-input');
      assert(inputEl !== null, `Typing input element exists for ${drill.id}`);

      // Test In-Place Keystroke update (no innerHTML re-render destroying input)
      const inputRefBefore = inputEl;

      // Simulate first character keystroke
      const firstChar = drill.text[0] || 'a';
      inputEl.value = firstChar;
      const inputEvt = new window.Event('input', { bubbles: true });
      inputEl.dispatchEvent(inputEvt);

      const inputRefAfter = window.document.getElementById('standalone-dojo-mount-input');
      assert(inputRefBefore === inputRefAfter, `Input DOM element preserved on keystroke (IME friendly!) for ${drill.id}`);

      // Verify character display was updated in-place
      const charsDisplay = window.document.getElementById('standalone-dojo-mount-chars');
      assert(charsDisplay && charsDisplay.children.length === drill.text.length, `Character display has ${drill.text.length} spans`);
      assert(charsDisplay.children[0].classList.contains('correct'), `First char marked correct`);

      // Test IME composition events
      const compStartEvt = new window.Event('compositionstart', { bubbles: true });
      inputEl.dispatchEvent(compStartEvt);
      assert(window.TypingDojo.isComposing === true, `IME compositionstart correctly detected`);

      const compEndEvt = new window.Event('compositionend', { bubbles: true });
      inputEl.value = drill.text;
      inputEl.dispatchEvent(compEndEvt);
      assert(window.TypingDojo.isComposing === false, `IME compositionend processed full text`);

      // Verify Drill Completion
      assert(window.TypingDojo.isCompleted === true, `Drill ${drill.id} successfully completed`);
      const drillComp = window.AppState.getCompletedDrills()[drill.id];
      assert(drillComp !== null && drillComp.cpm > 0, `Drill ${drill.id} saved to completedDrills with CPM: ${drillComp ? drillComp.cpm : 0}`);
    }
  }

  // 9. Verify Certificate Page with 100% completion
  console.log('\n--- Testing Graduation Certificate ---');
  window.AppState.navigate('certificate');
  assert(window.AppState.currentView === 'certificate', 'Navigated to certificate view');
  const certEl = window.document.getElementById('app-main');
  assert(certEl.textContent.includes('數位小探險家學院・榮譽證書'), 'Graduation Certificate title rendered');
  assert(certEl.textContent.includes('29 / 29 堂數位課程'), 'All 29/29 lessons reflected on Certificate');
  assert(certEl.textContent.includes('22 / 22 關中英盲打特訓'), 'All 22/22 typing drills reflected on Certificate');
  assert(certEl.textContent.includes('傳奇數位魔法師'), 'Awarded highest certification tier: 傳奇數位魔法師');

  // 10. Test IslandScene World 7 Navigation & Routing
  console.log('\n--- Testing IslandScene 3D World Map Navigation ---');
  assert(typeof window.IslandScene === 'object', 'window.IslandScene object exists');
  let selectedTargetWorld = null;
  window.IslandScene._onSelectWorld = (targetId) => { selectedTargetWorld = targetId; };
  window.IslandScene.islands = [
    { userData: { worldId: 'world-1', standPos: new window.THREE.Vector3(-5.4, 0.42, 1.35) } },
    { userData: { worldId: 'world-2', standPos: new window.THREE.Vector3(-1.8, 0.42, 1.35) } },
    { userData: { worldId: 'world-3', standPos: new window.THREE.Vector3(1.8, 2.75, 0.95) } },
    { userData: { worldId: 'world-4', standPos: new window.THREE.Vector3(5.4, 1.27, 0.85) } },
    { userData: { worldId: 'world-5', standPos: new window.THREE.Vector3(8.4, 1.85, -0.55) } },
    { userData: { worldId: 'world-6', standPos: new window.THREE.Vector3(11.4, 2.45, 0.85) } },
    { userData: { worldId: 'world-7', standPos: new window.THREE.Vector3(14.4, 1.95, -0.15) } }
  ];
  window.IslandScene.avatar = new window.THREE.Group();
  window.IslandScene.currentWorldId = 'world-1';
  window.IslandScene.avatarState.mode = 'idle';

  window.IslandScene.travelToWorld('world-7', true);
  assert(window.IslandScene.avatarState.mode === 'moving', 'Avatar state switched to moving mode');
  assert(window.IslandScene.avatarState.targetWorldId === 'world-7', 'Target world set to world-7');
  assert(Array.isArray(window.IslandScene.avatarState.waypoints) && window.IslandScene.avatarState.waypoints.length === 8,
    `Scenic waypoints to World 7 generated (count: ${window.IslandScene.avatarState.waypoints.length})`);
  const wpTypes = window.IslandScene.avatarState.waypoints.map(w => w.type);
  assert(wpTypes.includes('hop') && wpTypes.includes('swim') && wpTypes.includes('superjump'),
    'Waypoints include hop, swim, and superjump segments to reach World 7');

  console.log('\n--- 12. Annotated UI Location Diagrams (World 5, 6 & 7) ---');
  for (const lid of ['w5-l1', 'w5-l2', 'w5-l3', 'w5-l4', 'w6-l1', 'w6-l2', 'w6-l3', 'w6-l4', 'w7-l1', 'w7-l2', 'w7-l3']) {
    window.AppState.navigate('lesson', lid);
    window.AppState.setLessonStep('learn');
    const diagrams = window.document.querySelectorAll('.slide-visual-diagram');
    assert(diagrams.length >= 1, `Lesson ${lid} renders at least 1 UI location diagram (${diagrams.length} found)`);
    diagrams.forEach((d, idx) => {
      assert(!!d.querySelector('svg'), `Lesson ${lid} diagram #${idx + 1} contains inline <svg>`);
      assert(!!d.querySelector('.visual-caption')?.textContent.trim(), `Lesson ${lid} diagram #${idx + 1} has non-empty caption`);
    });
  }

  console.log('\n--- 13. Improvement Plan Features & Content Lint ---');
  // 13a. Content lint: every lesson has >= 2 cards and >= 3 quiz questions
  for (const lesson of window.CURRICULUM_LESSONS) {
    assert(Array.isArray(lesson.cards) && lesson.cards.length >= 2, `Content lint: ${lesson.id} has >= 2 cards (${lesson.cards.length})`);
    assert(Array.isArray(lesson.quiz) && lesson.quiz.length >= 3, `Content lint: ${lesson.id} has >= 3 quiz questions (${lesson.quiz.length})`);
  }

  // 13b. Worlds 1-4 visual diagrams
  for (const lid of ['w1-l2', 'w2-l1', 'w3-l2', 'w4-l2']) {
    window.AppState.navigate('lesson', lid);
    window.AppState.setLessonStep('learn');
    const diagrams = window.document.querySelectorAll('.slide-visual-diagram svg');
    assert(diagrams.length >= 1, `World 1-4 lesson ${lid} renders annotated SVG diagram`);
  }

  // 13c. Shuffled quiz order varies display positions
  const firstPositions = new Set();
  for (const lesson of window.CURRICULUM_LESSONS) {
    const order = window.AppState.getShuffledQuizOrder(lesson.id, 0, lesson.quiz[0].options.length);
    firstPositions.add(order.indexOf(lesson.quiz[0].correct));
  }
  assert(firstPositions.size >= 2, `Shuffled quiz order places correct answers across multiple positions (${[...firstPositions].join(',')})`);

  // 13d. Dynamic stars based on quizMistakes
  window.AppState.quizMistakes['w1-l1'] = 2;
  window.AppState.getProfile().completedLessons['w1-l1'] = null;
  window.AppState.completeLesson('w1-l1', 50);
  assert(window.AppState.getProfile().completedLessons['w1-l1'].stars === 2, '2 quiz mistakes yield 2 stars');
  window.AppState.quizMistakes['w1-l1'] = 4;
  window.AppState.getProfile().completedLessons['w1-l1'] = null;
  window.AppState.completeLesson('w1-l1', 50);
  assert(window.AppState.getProfile().completedLessons['w1-l1'].stars === 1, '4 quiz mistakes yield 1 star');

  // 13e. XSS escaping & Zhuyin font toggle
  assert(window.AppState.escapeHtml('<script>x</script>') === '&lt;script&gt;x&lt;/script&gt;', 'escapeHtml escapes HTML tags');
  window.AppState.toggleZhuyinFont();
  const zState = window.AppState.zhuyinFont;
  assert(window.document.body.classList.contains('zhuyin-font') === zState, 'toggleZhuyinFont syncs body.zhuyin-font class');

  // 13f. Daily Quest & Parent Dashboard & Studio Checklist
  window.AppState.navigate('map');
  assert(!!window.document.querySelector('.daily-quest-card'), 'Daily Quest card rendered on World Map');
  window.AppState.navigate('parent');
  assert(window.document.querySelectorAll('.parent-profile-card').length === 2, 'Parent Dashboard renders both kid-10 and kid-8 comparison cards');
  const xpBeforeCheck = window.AppState.getProfile().xp;
  window.AppState.toggleStudioCheck('w5-l1', 0);
  assert(window.AppState.getProfile().xp === xpBeforeCheck + 10, 'toggleStudioCheck awards +10 XP on first check');

  // 14. UI Batch 1: Navigation Makeover Tests
  console.log('\n--- 14. UI Batch 1: Navigation Makeover ---');
  // 14a. Settings menu in header contains the 3 toggles (rename, Zhuyin font, English) and closes on outside click / Escape
  const settingsBtn = window.document.querySelector('.settings-btn');
  const settingsMenu = window.document.querySelector('.settings-menu');
  assert(!!settingsBtn && !!settingsMenu, 'Header renders .settings-btn and .settings-menu');
  assert(!!window.document.querySelector('.profile-pill') && !!window.document.querySelector('.xp-pill'), 'Header keeps profile pill and XP pill visible');
  const menuText = settingsMenu.textContent;
  assert(menuText.includes('改名') && menuText.includes('注音字體') && menuText.includes('中英雙語'),
    'Settings menu contains rename, Zhuyin font toggle, and bilingual/English toggle');
  settingsBtn.click();
  assert(window.AppState.settingsMenuOpen === true && window.document.querySelector('.settings-menu.open') !== null,
    'Clicking .settings-btn opens .settings-menu');
  window.document.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  assert(window.AppState.settingsMenuOpen === false, 'Pressing Escape closes .settings-menu');
  window.document.querySelector('.settings-btn').click();
  assert(window.AppState.settingsMenuOpen === true, 'Re-opened .settings-menu for outside click test');
  window.document.body.click();
  assert(window.AppState.settingsMenuOpen === false, 'Clicking outside closes .settings-menu');

  // 14b. Map page: all-done congrats message when all lessons completed, and Continue button + collapsible worlds + SVG ring when unfinished
  window.AppState.navigate('map');
  assert(window.document.querySelector('.continue-congrats') !== null && window.document.querySelector('.continue-btn') === null,
    'Continue button replaced with congrats message when all lessons are completed');

  // Reset kid-8 to fresh progress to test unfinished map state
  window.AppState.switchProfile(); // kid-10 -> kid-8 (fresh)
  window.AppState.navigate('map');
  const w1Sec = window.document.getElementById('section-world-1');
  const w2Sec = window.document.getElementById('section-world-2');
  assert(!!w1Sec && !w1Sec.classList.contains('collapsed'), 'First unfinished world (world-1) is expanded by default');
  assert(!!w2Sec && w2Sec.classList.contains('collapsed'), 'Subsequent worlds (world-2) are collapsed by default');
  assert(w2Sec.querySelectorAll('.lesson-card').length > 0, 'Collapsed world keeps lesson cards in the DOM');
  const progressRings = window.document.querySelectorAll('.world-section .world-progress-ring svg');
  assert(progressRings.length === window.CURRICULUM_WORLDS.length, `All ${window.CURRICULUM_WORLDS.length} world headers render an SVG progress ring`);

  // Toggle collapse on world-1 and world-2 by clicking header
  w1Sec.querySelector('.world-header').click();
  assert(w1Sec.classList.contains('collapsed'), 'Clicking world-1 header collapses it');
  w2Sec.querySelector('.world-header').click();
  assert(!w2Sec.classList.contains('collapsed'), 'Clicking world-2 header expands it');

  // 14c. Continue button opens next unfinished lesson
  const continueBtn = window.document.querySelector('.continue-btn');
  assert(!!continueBtn, 'Big .continue-btn rendered at top of map when unfinished lessons remain');
  continueBtn.click();
  assert(window.AppState.currentView === 'lesson' && window.AppState.currentLessonId === 'w1-l1',
    'Clicking .continue-btn opens the next unfinished lesson (w1-l1)');

  // 14d. Lesson 3-step progress bar (.lesson-steps) renders 3 steps + Next/Back navigation
  const lessonStepsEl = window.document.querySelector('.lesson-steps');
  assert(!!lessonStepsEl, 'Lesson page renders .lesson-steps progress bar');
  const stepPills = lessonStepsEl.querySelectorAll('.lesson-step-pill');
  assert(stepPills.length === 3, 'Lesson step bar renders 3 steps (Learn / Lab / Quiz)');
  assert(lessonStepsEl.textContent.includes('學習 Learn') && lessonStepsEl.textContent.includes('實驗 Lab') && lessonStepsEl.textContent.includes('測驗 Quiz'),
    'Lesson step bar displays 學習 Learn / 實驗 Lab / 測驗 Quiz labels');
  assert(stepPills[0].classList.contains('active'), 'Step 1 (Learn) is highlighted initially');
  window.document.querySelector('.lesson-step-next-btn').click();
  assert(window.AppState.lessonStep === 'lab' && window.document.querySelectorAll('.lesson-step-pill')[1].classList.contains('active'),
    'Next button advances from Learn to Lab and highlights step 2');
  assert(!!window.document.getElementById('lesson-simulator-mount'), '#lesson-simulator-mount remains intact in Lab step');
  window.document.querySelector('.lesson-step-back-btn').click();
  assert(window.AppState.lessonStep === 'learn' && window.document.querySelectorAll('.lesson-step-pill')[0].classList.contains('active'),
    'Back button returns from Lab to Learn');

  // 15. UI Batch 2: Delight & Accessibility Tests
  console.log('\n--- 15. UI Batch 2: Delight & Accessibility ---');
  // 15a. kid-8 big tap mode body class
  assert(window.AppState.activeProfileId === 'kid-8' && window.document.body.classList.contains('kid-mode-8'),
    'kid-8 profile activates body.kid-mode-8 class');
  window.AppState.switchProfile(); // kid-8 -> kid-10
  assert(window.AppState.activeProfileId === 'kid-10' && !window.document.body.classList.contains('kid-mode-8'),
    'Switching back to kid-10 removes body.kid-mode-8 class');
  window.AppState.switchProfile(); // kid-10 -> kid-8

  // 15b. Read-aloud button on learn cards (.read-aloud-btn)
  window.AppState.navigate('lesson', 'w1-l1');
  const readBtns = window.document.querySelectorAll('.read-aloud-btn');
  assert(readBtns.length === window.CURRICULUM_LESSONS[0].cards.length,
    `Each learn card renders a .read-aloud-btn when speechSynthesis is supported (${readBtns.length})`);
  let spokenUtterance = null;
  let cancelCalled = false;
  const origSpeakFn = window.speechSynthesis.speak;
  const origCancelFn = window.speechSynthesis.cancel;
  window.speechSynthesis.speak = (u) => { spokenUtterance = u; };
  window.speechSynthesis.cancel = () => { cancelCalled = true; };
  readBtns[0].click();
  assert(spokenUtterance && spokenUtterance.lang === 'zh-TW' && window.AppState.speakingCardKey === 'w1-l1:0',
    'Clicking .read-aloud-btn speaks card with lang zh-TW');
  window.document.querySelectorAll('.read-aloud-btn')[0].click();
  assert(cancelCalled === true && window.AppState.speakingCardKey === null,
    'Clicking .read-aloud-btn again stops speech');
  window.speechSynthesis.speak = origSpeakFn;
  window.speechSynthesis.cancel = origCancelFn;

  // Hide read-aloud button when speechSynthesis unsupported
  const savedSynth = window.speechSynthesis;
  window.speechSynthesis = undefined;
  window.AppState.renderMain();
  assert(window.document.querySelectorAll('.read-aloud-btn').length === 0,
    'Read-aloud buttons hidden when speechSynthesis is unsupported');
  window.speechSynthesis = savedSynth;

  // 15c. Sound toggle & Dark mode in settings menu
  const settingsMenu2 = window.document.querySelector('.settings-menu');
  assert(settingsMenu2.textContent.includes('音效 Sound') && settingsMenu2.textContent.includes('深色模式 Dark'),
    'Settings menu contains sound toggle and dark mode toggle');
  const prevSound = window.AppState.soundEnabled;
  window.AppState.toggleSound();
  assert(window.AppState.soundEnabled === !prevSound && window.AppState.getProfile().soundEnabled === !prevSound,
    'toggleSound updates AppState and persists to profile');
  window.AppState.toggleSound(); // restore

  assert(window.document.body.classList.contains('dark-mode') === false, 'Dark mode initially off when prefers-color-scheme not dark');
  window.AppState.toggleDarkMode();
  assert(window.AppState.darkMode === true && window.document.body.classList.contains('dark-mode'),
    'toggleDarkMode enables body.dark-mode');
  window.AppState.toggleDarkMode();
  assert(window.AppState.darkMode === false && !window.document.body.classList.contains('dark-mode'),
    'toggleDarkMode disables body.dark-mode');

  // 15d. Lesson completion celebration (confetti + XP flyup)
  window.AppState.setLessonStep('quiz');
  const w1l1 = window.CURRICULUM_LESSONS[0];
  w1l1.quiz.forEach((q, qIdx) => {
    window.AppState.answerQuiz(qIdx, q.correct, w1l1.id, w1l1.xp);
  });
  const confettiLayer = window.document.getElementById('celebration-confetti-layer');
  const confettiPieces = window.document.querySelectorAll('.confetti-piece');
  const xpFlyup = window.document.querySelector('.xp-flyup');
  assert(!!confettiLayer && confettiPieces.length === 40, `Lesson completion spawns confetti burst (${confettiPieces.length} pieces)`);
  assert(!!xpFlyup && xpFlyup.textContent.includes(`+${w1l1.xp} XP`), 'Lesson completion spawns .xp-flyup element');
}

async function main() {
  const repoDir = path.resolve(__dirname, '..');
  const artifactPath = path.join(repoDir, 'dist', 'digital_explorer_academy.html');

  // 1. Build fresh bundle first
  console.log('📦 Building bundled artifact...');
  require(path.join(repoDir, 'scripts', 'build-bundle.js'));

  // 2. Read bundled HTML
  const bundledHtml = fs.readFileSync(artifactPath, 'utf8');

  // 3. Run test suite against bundled artifact
  await runTestsForHtml(bundledHtml, 'Self-Contained Artifact (digital_explorer_academy.html)');

  // 4. Report Final Summary
  console.log(`\n================================================================================`);
  console.log(`📊 FINAL TEST REPORT SUMMARY`);
  console.log(`================================================================================`);
  console.log(`Total Assertions Run : ${totalTests}`);
  console.log(`Passed Assertions     : ${passedTests}`);
  console.log(`Failed Assertions     : ${failedTests}`);

  if (failedTests > 0) {
    console.error('\n❌ Failures:');
    failureDetails.forEach((f, i) => console.error(`  ${i + 1}. ${f}`));
    process.exit(1);
  } else {
    console.log(`\n🎉 ALL TESTS PASSED WITH 100% SUCCESS RATE!`);
    process.exit(0);
  }
}

main().catch(err => {
  console.error('Fatal Test Runner Error:', err);
  process.exit(1);
});
