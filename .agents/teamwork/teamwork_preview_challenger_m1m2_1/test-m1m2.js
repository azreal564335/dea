/**
 * Empirical Test Harness for Milestones M1 & M2 (Node + JSDOM)
 *
 * Requirements to verify:
 * 1. Load all scripts in JSDOM, initialize AppState.init(), verify all 4 worlds and 18 lessons render.
 * 2. Test every new lesson (w2-l5, w4-l1, w4-l2, w4-l3) through learn -> lab -> quiz -> completion,
 *    verifying XP, stars, and Certificate update (18 / 18).
 * 3. Exercise interactive handlers on all 4 new simulators (maps-navigator, slide-studio, scratch-blocks, story-studio)
 *    and verify DOM updates and state transitions work without throwing errors.
 * 4. Test IslandScene.mount and IslandScene.travelToWorld('world-4', true) in JSDOM.
 */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const REPO_ROOT = path.resolve(__dirname, '../../..');

let totalAsserts = 0;
let passedAsserts = 0;
let failedAsserts = 0;
const failureList = [];

function assert(condition, message) {
  totalAsserts++;
  if (condition) {
    passedAsserts++;
    console.log(`  [PASS] ${message}`);
  } else {
    failedAsserts++;
    console.error(`  [FAIL] ${message}`);
    failureList.push(message);
  }
}

async function runEmpiricalSuite() {
  console.log('================================================================');
  console.log('🧪 EMPIRICAL CHALLENGER TEST SUITE: MILESTONES M1 & M2');
  console.log('================================================================\n');

  // Read all scripts directly to load in JSDOM
  const threeJs = fs.readFileSync(path.join(REPO_ROOT, 'js/vendor/three.min.js'), 'utf8');
  const islandSceneJs = fs.readFileSync(path.join(REPO_ROOT, 'js/island-scene.js'), 'utf8');
  const uiModalJs = fs.readFileSync(path.join(REPO_ROOT, 'js/ui-modal.js'), 'utf8');
  const typingDrillsJs = fs.readFileSync(path.join(REPO_ROOT, 'data/typing-drills.js'), 'utf8');
  const curriculumJs = fs.readFileSync(path.join(REPO_ROOT, 'data/curriculum.js'), 'utf8');
  const typingDojoJs = fs.readFileSync(path.join(REPO_ROOT, 'js/typing-dojo.js'), 'utf8');
  const simulatorsJs = fs.readFileSync(path.join(REPO_ROOT, 'js/simulators.js'), 'utf8');
  const appJs = fs.readFileSync(path.join(REPO_ROOT, 'js/app.js'), 'utf8');

  const baseHtml = `<!DOCTYPE html>
<html lang="zh-Hant-TW">
<head><meta charset="UTF-8"><title>Test</title></head>
<body class="show-en">
  <header id="app-header" class="top-nav"></header>
  <main id="app-main" class="main-container"></main>
</body>
</html>`;

  const storage = {};
  let clipboardText = '';
  let speechUtterances = [];

  const dom = new JSDOM(baseHtml, {
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

      window.document.execCommand = (cmd) => cmd === 'copy';

      window.speechSynthesis = {
        speak: (utt) => { speechUtterances.push(utt.text); },
        cancel: () => {}
      };
      window.SpeechSynthesisUtterance = function(t) { this.text = t; };

      window.scrollTo = () => {};
      window.requestAnimationFrame = (fn) => setTimeout(fn, 16);
      window.cancelAnimationFrame = (id) => clearTimeout(id);
    }
  });

  const { window } = dom;

  // Execute scripts into window
  window.eval(threeJs);
  window.eval(islandSceneJs);
  window.eval(uiModalJs);
  window.eval(typingDrillsJs);
  window.eval(curriculumJs);
  window.eval(typingDojoJs);
  window.eval(simulatorsJs);
  window.eval(appJs);

  await new Promise(r => setTimeout(r, 200));

  console.log('--- SECTION 1: Script Loading & Environment Init ---');
  assert(typeof window.AppState === 'object', 'AppState is initialized');
  assert(typeof window.IslandScene === 'object', 'IslandScene is loaded');
  assert(typeof window.Simulators === 'object', 'Simulators is loaded');
  assert(typeof window.CURRICULUM_WORLDS === 'object', 'CURRICULUM_WORLDS is loaded');
  assert(typeof window.CURRICULUM_LESSONS === 'object', 'CURRICULUM_LESSONS is loaded');

  assert(window.CURRICULUM_WORLDS.length === 4, `CURRICULUM_WORLDS length is 4 (actual: ${window.CURRICULUM_WORLDS?.length})`);
  assert(window.CURRICULUM_LESSONS.length === 18, `CURRICULUM_LESSONS length is 18 (actual: ${window.CURRICULUM_LESSONS?.length})`);

  // Verify World 4 exists
  const w4 = window.CURRICULUM_WORLDS.find(w => w.id === 'world-4');
  assert(!!w4, 'world-4 exists in CURRICULUM_WORLDS');
  if (w4) {
    assert(w4.title === '數位創作與程式入門', `world-4 title is '數位創作與程式入門' (actual: ${w4.title})`);
    assert(w4.themeColor === '#7c3aed', `world-4 themeColor is '#7c3aed' (actual: ${w4.themeColor})`);
    assert(w4.badgeName === '數位創意大師勳章', `world-4 badgeName is '數位創意大師勳章' (actual: ${w4.badgeName})`);
  }

  // Verify Lesson IDs
  const lessonIds = window.CURRICULUM_LESSONS.map(l => l.id);
  assert(lessonIds.includes('w2-l5'), "CURRICULUM_LESSONS includes 'w2-l5'");
  assert(lessonIds.includes('w4-l1'), "CURRICULUM_LESSONS includes 'w4-l1'");
  assert(lessonIds.includes('w4-l2'), "CURRICULUM_LESSONS includes 'w4-l2'");
  assert(lessonIds.includes('w4-l3'), "CURRICULUM_LESSONS includes 'w4-l3'");

  // Initial render check
  window.AppState.init();
  const mainEl = window.document.getElementById('app-main');
  assert(!!mainEl, 'Main app element #app-main exists');

  // Verify map view renders all 4 worlds and 18 lesson cards
  window.AppState.navigate('map');
  const worldSections = mainEl.querySelectorAll('.world-section');
  assert(worldSections.length === 4, `All 4 world sections render in map view (actual: ${worldSections.length})`);

  const lessonCards = mainEl.querySelectorAll('.lesson-card');
  assert(lessonCards.length === 18, `All 18 lesson cards render in map view (actual: ${lessonCards.length})`);

  // Verify World 4 section details in DOM
  const w4Section = mainEl.querySelector('#section-world-4');
  assert(!!w4Section, 'World 4 section #section-world-4 exists in DOM');
  if (w4Section) {
    assert(w4Section.textContent.includes('數位創作與程式入門'), 'World 4 title found in section DOM');
    const w4LessonsInDom = w4Section.querySelectorAll('.lesson-card');
    assert(w4LessonsInDom.length === 3, `World 4 contains 3 lesson cards (actual: ${w4LessonsInDom.length})`);
  }

  console.log('\n--- SECTION 2: Lesson Lifecycle (learn -> lab -> quiz -> completion) ---');
  const targetLessons = ['w2-l5', 'w4-l1', 'w4-l2', 'w4-l3'];
  const initialXP = window.AppState.getProfile().xp;
  console.log(`  Initial Profile XP: ${initialXP}`);

  for (const lId of targetLessons) {
    console.log(`\nTesting lesson lifecycle for: ${lId}`);
    const lObj = window.CURRICULUM_LESSONS.find(l => l.id === lId);
    assert(!!lObj, `Lesson object found for ${lId}`);

    // 1. Enter lesson (learn step)
    window.AppState.navigate('lesson', lId);
    assert(window.AppState.currentLessonId === lId, `AppState.currentLessonId is ${lId}`);
    assert(window.AppState.lessonStep === 'learn', `Current step is 'learn' for ${lId}`);

    const slideCards = mainEl.querySelectorAll('.slide-card');
    assert(slideCards.length === lObj.cards.length, `Rendered all ${lObj.cards.length} slide cards for ${lId}`);

    // 2. Advance to lab step
    window.AppState.setLessonStep('lab');
    assert(window.AppState.lessonStep === 'lab', `Current step is 'lab' for ${lId}`);
    const simMount = mainEl.querySelector('#lesson-simulator-mount');
    assert(!!simMount, `Simulator mount container found for ${lId}`);
    assert(simMount.innerHTML.trim().length > 0, `Simulator content rendered for ${lId}`);

    // 3. Advance to quiz step
    window.AppState.setLessonStep('quiz');
    assert(window.AppState.lessonStep === 'quiz', `Current step is 'quiz' for ${lId}`);

    // Answer all quiz questions correctly
    const quizCount = lObj.quiz.length;
    assert(quizCount > 0, `Quiz has questions for ${lId} (count: ${quizCount})`);

    const xpBefore = window.AppState.getProfile().xp;
    lObj.quiz.forEach((q, qIdx) => {
      window.AppState.answerQuiz(qIdx, q.correct, lId, lObj.xp);
    });

    const isDone = window.AppState.getProfile().completedLessons[lId];
    assert(!!isDone, `Lesson ${lId} marked as completed in profile`);
    assert(isDone && isDone.stars === 3, `Lesson ${lId} awarded 3 stars`);

    const xpAfter = window.AppState.getProfile().xp;
    assert(xpAfter === xpBefore + lObj.xp, `XP correctly awarded for ${lId} (+${lObj.xp} XP, before=${xpBefore}, after=${xpAfter})`);
  }

  // Verify Certificate View reflects 18 / 18
  console.log('\n--- SECTION 2B: Certificate Verification ---');
  // Complete all 18 lessons in profile to check 18 / 18
  window.CURRICULUM_LESSONS.forEach(l => {
    window.AppState.completeLesson(l.id, l.xp);
  });
  window.AppState.navigate('certificate');
  const certText = mainEl.textContent;
  assert(certText.includes('18 / 18 堂數位課程'), `Certificate displays '18 / 18 堂數位課程' (found: ${certText.includes('18 / 18 堂數位課程')})`);
  assert(certText.includes('👑 傳奇數位魔法師'), `Certificate displays highest rank '👑 傳奇數位魔法師'`);

  console.log('\n--- SECTION 3: Interactive Simulator Stress-Testing ---');

  // Simulator 1: maps-navigator (Lesson 2.5)
  console.log('\n[Simulator: maps-navigator (w2-l5)]');
  window.AppState.navigate('lesson', 'w2-l5');
  window.AppState.setLessonStep('lab');
  const simCid = 'lesson-simulator-mount';

  // Test mode toggles: walk, transit, drive
  window.Simulators.setMapsMode('drive', simCid);
  assert(window.Simulators.state.mapsTripMode === 'drive', 'mapsTripMode switched to drive');
  assert(mainEl.innerHTML.includes('開車'), 'DOM updated with driving route details');

  window.Simulators.setMapsMode('walk', simCid);
  assert(window.Simulators.state.mapsTripMode === 'walk', 'mapsTripMode switched to walk');
  assert(mainEl.innerHTML.includes('步行'), 'DOM updated with walking route details');

  window.Simulators.setMapsMode('transit', simCid);
  assert(window.Simulators.state.mapsTripMode === 'transit', 'mapsTripMode switched to transit');
  assert(mainEl.innerHTML.includes('捷運公車'), 'DOM updated with transit route details');

  // Test Street View toggle
  assert(window.Simulators.state.mapsStreetViewOpen === false, 'Street View initially closed');
  window.Simulators.toggleMapsStreetView(simCid);
  assert(window.Simulators.state.mapsStreetViewOpen === true, 'Street View opened');
  assert(mainEl.innerHTML.includes('正門售票口'), 'Street View DOM rendered 360 view');

  window.Simulators.toggleMapsStreetView(simCid);
  assert(window.Simulators.state.mapsStreetViewOpen === false, 'Street View closed again');

  // Test Review filters & inspection
  window.Simulators.setMapsReviewFilter('fake', simCid);
  assert(window.Simulators.state.mapsReviewFilter === 'fake', 'Review filter set to fake');
  assert(mainEl.innerHTML.includes('幸運大吉星') || mainEl.innerHTML.includes('疑似刷星'), 'Fake review displayed in filtered list');

  window.Simulators.inspectMapsReview('rev-2', simCid);
  assert(window.Simulators.state.mapsSelectedReviewId === 'rev-2', 'Review rev-2 inspected');
  assert(mainEl.innerHTML.includes('疑似刷星廣告'), 'Inspector card identifies fake review');

  window.Simulators.setMapsReviewFilter('real', simCid);
  assert(window.Simulators.state.mapsReviewFilter === 'real', 'Review filter set to real');
  window.Simulators.inspectMapsReview('rev-1', simCid);
  assert(mainEl.innerHTML.includes('真實詳細評論'), 'Inspector card displays real review tag');


  // Simulator 2: slide-studio (Lesson 4.1)
  console.log('\n[Simulator: slide-studio (w4-l1)]');
  window.AppState.navigate('lesson', 'w4-l1');
  window.AppState.setLessonStep('lab');

  assert(window.Simulators.state.slideRescueStep1 === false, 'slideRescueStep1 initially false');
  assert(window.Simulators.state.slideRescueStep2 === false, 'slideRescueStep2 initially false');
  assert(window.Simulators.state.slideRescueStep3 === false, 'slideRescueStep3 initially false');

  // Step 1: Rule of 3
  window.Simulators.toggleSlideStep('slideRescueStep1', simCid);
  assert(window.Simulators.state.slideRescueStep1 === true, 'slideRescueStep1 toggled to true');
  assert(mainEl.innerHTML.includes('休眠中的活火山'), 'DOM updated with 3 bullet points');

  // Step 2: High Contrast
  window.Simulators.toggleSlideStep('slideRescueStep2', simCid);
  assert(window.Simulators.state.slideRescueStep2 === true, 'slideRescueStep2 toggled to true');
  assert(mainEl.innerHTML.includes('高對比') || mainEl.innerHTML.includes('#ffffff'), 'DOM updated with high contrast theme');

  // Step 3: Hero Visual
  window.Simulators.toggleSlideStep('slideRescueStep3', simCid);
  assert(window.Simulators.state.slideRescueStep3 === true, 'slideRescueStep3 toggled to true');
  assert(mainEl.innerHTML.includes('100 分特優'), 'All 3 steps completed: score is 100%');

  // Slideshow toggle
  window.Simulators.toggleSlideShow(simCid);
  assert(window.Simulators.state.slideShowMode === true, 'slideShowMode opened');
  assert(mainEl.innerHTML.includes('Google Slides 全螢幕放映中'), 'Slideshow modal rendered');
  window.Simulators.toggleSlideShow(simCid);
  assert(window.Simulators.state.slideShowMode === false, 'slideShowMode closed');


  // Simulator 3: scratch-blocks (Lesson 4.2)
  console.log('\n[Simulator: scratch-blocks (w4-l2)]');
  window.AppState.navigate('lesson', 'w4-l2');
  window.AppState.setLessonStep('lab');

  assert(window.Simulators.state.scratchBlockBowl === false, 'scratchBlockBowl initially false');
  assert(window.Simulators.state.scratchBlockApple === false, 'scratchBlockApple initially false');
  assert(window.Simulators.state.scratchBlockScore === false, 'scratchBlockScore initially false');

  // Snap all blocks
  window.Simulators.toggleScratchBlock('scratchBlockBowl', simCid);
  window.Simulators.toggleScratchBlock('scratchBlockApple', simCid);
  window.Simulators.toggleScratchBlock('scratchBlockScore', simCid);
  assert(window.Simulators.state.scratchBlockBowl === true, 'scratchBlockBowl snapped');
  assert(window.Simulators.state.scratchBlockApple === true, 'scratchBlockApple snapped');
  assert(window.Simulators.state.scratchBlockScore === true, 'scratchBlockScore snapped');

  // Start game
  window.Simulators.toggleScratchGame(simCid);
  assert(window.Simulators.state.scratchGamePlaying === true, 'Scratch game loop started');

  // Move bowl
  window.Simulators.moveScratchBowl(20, simCid);
  assert(window.Simulators.state.scratchBowlX === 200, 'moveScratchBowl(+20) moved bowl to 200');
  window.Simulators.moveScratchBowl(-40, simCid);
  assert(window.Simulators.state.scratchBowlX === 160, 'moveScratchBowl(-40) moved bowl to 160');

  // Direct catch helper
  window.Simulators.state.scratchScore = 8;
  window.Simulators.catchAppleDirect(simCid);
  assert(window.Simulators.state.scratchScore === 9, 'catchAppleDirect incremented score to 9');

  // 10th apple triggers win
  window.Simulators.catchAppleDirect(simCid);
  assert(window.Simulators.state.scratchScore >= 10, 'Score reached 10');
  assert(window.Simulators.state.scratchWin === true, 'scratchWin state triggered');
  assert(window.Simulators.state.scratchGamePlaying === false, 'Game stopped on win');
  assert(mainEl.innerHTML.includes('恭喜破關！接住 10 顆蘋果！'), 'Win celebration modal rendered in DOM');

  // Reset game
  window.Simulators.resetScratchGame(simCid);
  assert(window.Simulators.state.scratchScore === 0, 'scratchScore reset to 0');
  assert(window.Simulators.state.scratchWin === false, 'scratchWin reset to false');


  // Simulator 4: story-studio (Lesson 4.3)
  console.log('\n[Simulator: story-studio (w4-l3)]');
  window.AppState.navigate('lesson', 'w4-l3');
  window.AppState.setLessonStep('lab');

  // Change story elements (indices from heroes array: 0=Leo, 1=Mia, 2=Bibo)
  window.Simulators.setStoryPart('storyHeroIdx', 1, simCid);
  assert(window.Simulators.state.storyHeroIdx === 1, 'storyHeroIdx updated to 1 (智多星 Mia)');
  assert(mainEl.innerHTML.includes('智多星 Mia'), 'DOM updated with new hero');

  // companions: 0=彩虹小狐狸, 1=百科全書貓頭鷹, 2=迷你偵察無人機
  window.Simulators.setStoryPart('storyCompanionIdx', 1, simCid);
  assert(window.Simulators.state.storyCompanionIdx === 1, 'storyCompanionIdx updated to 1 (百科全書貓頭鷹)');
  assert(mainEl.innerHTML.includes('百科全書貓頭鷹'), 'DOM updated with new companion');

  window.Simulators.setStoryPart('storySettingIdx', 1, simCid);
  assert(window.Simulators.state.storySettingIdx === 1, 'storySettingIdx updated to 1 (星際浮島空間站)');

  window.Simulators.setStoryPart('storyTwistIdx', 1, simCid);
  assert(window.Simulators.state.storyTwistIdx === 1, 'storyTwistIdx updated to 1');

  // Scene navigation: 0 -> 1 -> 2
  window.Simulators.setStoryScene(1, simCid);
  assert(window.Simulators.state.storyCurrentScene === 1, 'Switched to Scene 2');
  assert(mainEl.innerHTML.includes('第二幕：考驗難關'), 'DOM rendered Scene 2 content');

  window.Simulators.setStoryScene(2, simCid);
  assert(window.Simulators.state.storyCurrentScene === 2, 'Switched to Scene 3');
  assert(mainEl.innerHTML.includes('第三幕：智慧化解與榮耀'), 'DOM rendered Scene 3 content');

  // Web Speech TTS trigger
  speechUtterances = [];
  window.Simulators.speakStoryScene(2, simCid);
  assert(speechUtterances.length > 0, `Web Speech speak was called (captured utterance: "${speechUtterances[0]?.slice(0, 30)}...")`);

  // Copy scene prompt input trigger
  const promptInputId = `${simCid}-scene-prompt`;
  window.Simulators.copyText(promptInputId);
  await new Promise(r => setTimeout(r, 50));
  assert(clipboardText.length > 0, `Scene prompt copied to clipboard: "${clipboardText.slice(0, 35)}..."`);
  assert(clipboardText.includes('Pixar 3D'), `Copied prompt contains Pixar 3D style elements`);

  console.log('\n--- SECTION 4: IslandScene.mount & IslandScene.travelToWorld ---');
  // IslandScene mount in JSDOM (fallback banner or WebGL check)
  const islandContainer = window.document.createElement('div');
  islandContainer.id = 'island-3d-canvas-test';
  window.document.body.appendChild(islandContainer);

  let selectedWorldId = null;
  window.IslandScene.mount('island-3d-canvas-test', {
    onSelectWorld: (wId) => { selectedWorldId = wId; },
    profile: window.AppState.getProfile(),
    worlds: window.CURRICULUM_WORLDS
  });

  // Check fallback banner in JSDOM (since headless node has no GPU WebGL canvas)
  assert(islandContainer.innerHTML.includes('3D 浮空島嶼冒險地圖已就緒') || !!window.IslandScene.renderer,
    'IslandScene mounted gracefully in JSDOM environment');

  // Test travelToWorld('world-4', true)
  window.IslandScene.travelToWorld('world-4', true);
  assert(selectedWorldId === 'world-4', `travelToWorld('world-4', true) invoked onSelectWorld with 'world-4' (actual: ${selectedWorldId})`);

  // Test travelToWorld with full mock 3D scene objects to exercise waypoints logic
  console.log('Testing travelToWorld 3D waypoint state machine directly...');
  const mockIslands = [
    { userData: { worldId: 'world-1', standPos: { x: -5.4, y: 0.42, z: 1.35 } } },
    { userData: { worldId: 'world-2', standPos: { x: -1.8, y: 0.42, z: 1.35 } } },
    { userData: { worldId: 'world-3', standPos: { x: 1.8, y: 3.22, z: -0.85 } } },
    { userData: { worldId: 'world-4', standPos: { x: 5.4, y: 1.27, z: 0.85 } } }
  ];

  window.IslandScene.islands = mockIslands;
  window.IslandScene.avatar = {
    position: { x: 0, y: 0, z: 0, set(x, y, z) { this.x = x; this.y = y; this.z = z; } },
    rotation: { x: 0, y: 0, z: 0 }
  };
  window.IslandScene.currentWorldId = 'world-1';
  window.IslandScene.avatarState = { mode: 'idle', waypoints: [], wpIndex: 0, progress: 0, targetWorldId: 'world-1' };

  window.IslandScene.travelToWorld('world-4', false);
  assert(window.IslandScene.avatarState.mode === 'hop' || window.IslandScene.avatarState.mode === 'swimming' || window.IslandScene.avatarState.waypoints.length > 0,
    `travelToWorld('world-4') computed waypoints from world-1 to world-4 (count: ${window.IslandScene.avatarState.waypoints.length})`);
  assert(window.IslandScene.avatarState.targetWorldId === 'world-4',
    `targetWorldId set to 'world-4'`);

  // Test other transitions
  window.IslandScene.currentWorldId = 'world-4';
  window.IslandScene.avatarState.mode = 'idle';
  window.IslandScene.travelToWorld('world-1', false);
  assert(window.IslandScene.avatarState.waypoints.length > 0,
    `travelToWorld('world-1') from world-4 computed return waypoints (count: ${window.IslandScene.avatarState.waypoints.length})`);

  window.IslandScene.currentWorldId = 'world-3';
  window.IslandScene.avatarState.mode = 'idle';
  window.IslandScene.travelToWorld('world-4', false);
  assert(window.IslandScene.avatarState.waypoints.length === 1 && window.IslandScene.avatarState.waypoints[0].type === 'superjump',
    `travelToWorld('world-4') from world-3 is a direct 'superjump'`);

  console.log('\n================================================================');
  console.log('📊 EMPIRICAL TEST SUITE SUMMARY');
  console.log('================================================================');
  console.log(`Total Assertions Run : ${totalAsserts}`);
  console.log(`Passed Assertions     : ${passedAsserts}`);
  console.log(`Failed Assertions     : ${failedAsserts}`);

  if (failedAsserts === 0) {
    console.log('\n🎉 ALL TESTS PASSED! VERDICT: APPROVE');
  } else {
    console.error('\n❌ FAILURES ENCOUNTERED:');
    failureList.forEach(f => console.error(` - ${f}`));
    console.log('\n⚠️ VERDICT: REQUEST_CHANGES');
  }

  // Clean up
  window.IslandScene.destroy();
  if (window.Simulators._scratchTimer) {
    clearInterval(window.Simulators._scratchTimer);
  }

  return { totalAsserts, passedAsserts, failedAsserts, failureList };
}

runEmpiricalSuite().then(res => {
  if (res.failedAsserts > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}).catch(err => {
  console.error("Runner Exception:", err);
  process.exit(1);
});

