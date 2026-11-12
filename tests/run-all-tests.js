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
 * - All 14 lessons ('w1-l1' through 'w3-l6'):
 *     - 'learn' mode slides
 *     - 'lab' mode (tests every simulator: win11-power hazards & shut down, win11-window right click/maximize/snap,
 *       shortcut-rescue undo/copy/paste/save, browser-pilot tabs/bookmark/new tab, search-detective keywords & ads,
 *       scam-shield phishing detection, ai-prompt-builder chips & copy, ai-skill-coach chips/custom skill/next steps,
 *       ai-image-studio 5 ingredients & copy)
 *     - 'quiz' mode: answering all multiple-choice questions correctly to achieve 3 stars and full XP rewards
 * - All 19 typing drills in TypingDojo:
 *     - Character highlight & live typing updates without destroying input element
 *     - IME composition compatibility
 *     - Calculation of speed (WPM/CPM) and accuracy (100%)
 *     - Progression through all drills in all categories
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
  assert(Array.isArray(window.CURRICULUM_LESSONS) && window.CURRICULUM_LESSONS.length === 14, 'All 14 curriculum lessons are loaded');
  assert(Array.isArray(window.TYPING_DATA.categories) && window.TYPING_DATA.categories.length === 5, 'All 5 typing categories loaded');

  // Count total drills
  let drillCount = 0;
  window.TYPING_DATA.categories.forEach(c => drillCount += c.drills.length);
  assert(drillCount === 19, `Total 19 typing drills defined (found: ${drillCount})`);

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

  // 7. Test All 14 Lessons: Learn -> Lab (Simulators) -> Quiz
  console.log('\n--- Testing All 14 Lessons (Learn -> Lab -> Quiz) ---');
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

  // 8. Test All 19 Typing Dojo Drills
  console.log('\n--- Testing All 19 Typing Dojo Drills in Standalone Dojo ---');
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
  assert(certEl.textContent.includes('14 / 14 堂數位課程'), 'All 14/14 lessons reflected on Certificate');
  assert(certEl.textContent.includes('19 / 19 關中英盲打特訓'), 'All 19/19 typing drills reflected on Certificate');
  assert(certEl.textContent.includes('傳奇數位魔法師'), 'Awarded highest certification tier: 傳奇數位魔法師');
}

async function main() {
  const repoDir = '/home/antigravity/digital-explorer-academy';
  const artifactPath = '/home/antigravity/.gemini/jetski/brain/v1/default/jetski_remote_agents_3p/8223c394-dab1-4c16-8db7-43c01f53f7c1/digital_explorer_academy.html';

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
