/**
 * ============================================================================
 * 🏝️ THREE.JS 3D GAMIFIED ISLAND ADVENTURE MAP (js/island-scene.js)
 * ============================================================================
 * Features:
 * - Animated 3D Ocean + Sky Clouds (One Piece Skypiea-style Air Island!)
 * - 3 Distinct Animated Islands:
 *   1) World 1 (Laptop Island): Sandy beach + grass + breathing 3D laptop + orbiting keycaps
 *   2) World 2 (Internet Island): Emerald island + spinning globe + safety shield + data packets
 *   3) World 3 (AI Sky Island): High-altitude floating Sky Island in the clouds + AI crystal + stars
 * - Interactive 3D Explorer Avatar (🦁 / 🦊) that:
 *   - Hops across 3D stepping stones
 *   - Swims across open water with splash ripples
 *   - Performs a SUPER HIGH JUMP up into the clouds to reach the AI Air Island!
 * - Treasure chests between worlds that glow gold when a world is completed!
 * ============================================================================
 */

window.IslandScene = {
  animFrameId: null,
  renderer: null,
  scene: null,
  camera: null,
  islands: [],
  clouds: [],
  stones: [],
  chests: [],
  avatar: null,
  splashRings: [],
  jumpParticles: [],
  currentWorldId: 'world-1',
  avatarState: {
    mode: 'idle', // 'idle' | 'hopping' | 'swimming' | 'superjump'
    waypoints: [],
    wpIndex: 0,
    progress: 0,
    startPos: null,
    endPos: null,
    targetWorldId: 'world-1'
  },
  mouse: { x: 0, y: 0 },
  hoveredWorldId: null,
  orbitAngle: 0,
  isDragging: false,
  lastDragX: 0,
  dragMoved: false,

  destroy() {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    if (this.renderer) {
      try {
        this.renderer.dispose();
      } catch (e) {}
      this.renderer = null;
    }
    this.islands = [];
    this.clouds = [];
    this.stones = [];
    this.chests = [];
    this.splashRings = [];
    this.jumpParticles = [];
    this.avatar = null;
  },

  mount(containerId, options = {}) {
    this.destroy();
    const container = document.getElementById(containerId);
    if (!container) return;

    const {
      onSelectWorld = null,
      profile = { avatar: '🦁', name: '探險家', completedLessons: {} },
      worlds = []
    } = options;

    this._onSelectWorld = onSelectWorld;

    // Check WebGL & Three.js availability
    let hasWebGL = false;
    try {
      const testCanvas = document.createElement('canvas');
      hasWebGL = !!(
        typeof THREE !== 'undefined' &&
        (testCanvas.getContext('webgl2') || testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl'))
      );
    } catch (e) {
      hasWebGL = false;
    }

    if (!hasWebGL) {
      container.innerHTML = `
        <div class="island-fallback-banner">
          <span>🏝️ 3D 浮空島嶼冒險地圖已就緒（點選下方四個世界開始闖關！）</span>
        </div>
      `;
      return;
    }

    // Determine initial island based on progress
    const w1Done = (window.CURRICULUM_LESSONS || []).filter(l => l.worldId === 'world-1' && profile.completedLessons[l.id]).length;
    const w1Total = (window.CURRICULUM_LESSONS || []).filter(l => l.worldId === 'world-1').length || 4;
    const w2Done = (window.CURRICULUM_LESSONS || []).filter(l => l.worldId === 'world-2' && profile.completedLessons[l.id]).length;
    const w2Total = (window.CURRICULUM_LESSONS || []).filter(l => l.worldId === 'world-2').length || 5;
    const w3Done = (window.CURRICULUM_LESSONS || []).filter(l => l.worldId === 'world-3' && profile.completedLessons[l.id]).length;
    const w3Total = (window.CURRICULUM_LESSONS || []).filter(l => l.worldId === 'world-3').length || 6;
    const w4Done = (window.CURRICULUM_LESSONS || []).filter(l => l.worldId === 'world-4' && profile.completedLessons[l.id]).length;
    const w4Total = (window.CURRICULUM_LESSONS || []).filter(l => l.worldId === 'world-4').length || 3;
    const w5Done = (window.CURRICULUM_LESSONS || []).filter(l => l.worldId === 'world-5' && profile.completedLessons[l.id]).length;
    const w5Total = (window.CURRICULUM_LESSONS || []).filter(l => l.worldId === 'world-5').length || 4;
    const w6Done = (window.CURRICULUM_LESSONS || []).filter(l => l.worldId === 'world-6' && profile.completedLessons[l.id]).length;
    const w6Total = (window.CURRICULUM_LESSONS || []).filter(l => l.worldId === 'world-6').length || 4;
    const w7Done = (window.CURRICULUM_LESSONS || []).filter(l => l.worldId === 'world-7' && profile.completedLessons[l.id]).length;
    const w7Total = (window.CURRICULUM_LESSONS || []).filter(l => l.worldId === 'world-7').length || 3;

    container.innerHTML = `
      <div class="three-island-stage" id="${containerId}-stage" style="height: 390px;">
        <div class="three-hud-top">
          <span class="three-pill-badge">🎮 點擊島嶼讓 ${profile.avatar} 跳石頭、游泳、或超級大跳躍探索七大世界！</span>
          <span id="${containerId}-hover-label" class="three-hover-pill">✨ 拖曳可旋轉 3D 冒險地圖</span>
        </div>
        <div class="three-island-labels">
          <button class="island-quick-chip w1" onclick="window.IslandScene.travelToWorld('world-1', true)">
            💻 1. 筆電島 (⭐${w1Done}/${w1Total})
          </button>
          <button class="island-quick-chip w2" onclick="window.IslandScene.travelToWorld('world-2', true)">
            🌐 2. 網路島・游泳+跳石 (⭐${w2Done}/${w2Total})
          </button>
          <button class="island-quick-chip w3" onclick="window.IslandScene.travelToWorld('world-3', true)">
            ☁️ 3. AI 天空島・超級大跳躍! (⭐${w3Done}/${w3Total})
          </button>
          <button class="island-quick-chip w4" onclick="window.IslandScene.travelToWorld('world-4', true)">
            🚀 4. 創意程式島 (⭐${w4Done}/${w4Total})
          </button>
          <button class="island-quick-chip w5" onclick="window.IslandScene.travelToWorld('world-5', true)">
            🧱 5. Roblox 工坊 (⭐${w5Done}/${w5Total})
          </button>
          <button class="island-quick-chip w6" onclick="window.IslandScene.travelToWorld('world-6', true)">
            🗺️ 6. 熱門地圖拆解 (⭐${w6Done}/${w6Total})
          </button>
          <button class="island-quick-chip w7" onclick="window.IslandScene.travelToWorld('world-7', true)">
            🐱 7. Scratch 創意島 (⭐${w7Done}/${w7Total})
          </button>
        </div>
      </div>
    `;

    const stage = document.getElementById(`${containerId}-stage`);
    const hoverLabel = document.getElementById(`${containerId}-hover-label`);
    const width = stage.clientWidth || 960;
    const height = 390;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 120);
    camera.position.set(0, 4.5, 14.6);
    camera.lookAt(0, 0.85, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    stage.appendChild(renderer.domElement);

    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;

    // Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambient);

    const sunLight = new THREE.DirectionalLight(0xfffbeb, 1.2);
    sunLight.position.set(7, 12, 8);
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.45);
    rimLight.position.set(-8, 2, -6);
    scene.add(rimLight);

    // =========================================================================
    // ANIMATED 3D OCEAN
    // =========================================================================
    const oceanGeo = new THREE.PlaneGeometry(36, 20, 24, 14);
    oceanGeo.rotateX(-Math.PI / 2);
    const oceanMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.28,
      metalness: 0.1,
      flatShading: true,
      transparent: true,
      opacity: 0.9
    });
    const ocean = new THREE.Mesh(oceanGeo, oceanMat);
    ocean.position.set(0, -0.45, 0);
    scene.add(ocean);
    const oceanBaseY = [];
    const posAttr = oceanGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      oceanBaseY.push(posAttr.getY(i));
    }

    // Helper: Tropical Sea Island (Sand + Lush Grass)
    const createSeaIsland = (grassColor, sandColor) => {
      const group = new THREE.Group();
      const sand = new THREE.Mesh(
        new THREE.CylinderGeometry(2.1, 2.35, 0.55, 8),
        new THREE.MeshStandardMaterial({ color: sandColor, flatShading: true, roughness: 0.85 })
      );
      sand.position.y = -0.2;
      const grass = new THREE.Mesh(
        new THREE.CylinderGeometry(1.75, 1.9, 0.35, 8),
        new THREE.MeshStandardMaterial({ color: grassColor, flatShading: true, roughness: 0.65 })
      );
      grass.position.y = 0.22;
      group.add(sand, grass);
      return group;
    };

    // Helper: Sky Island (One Piece Skypiea-style floating island on clouds!)
    const createSkyIsland = (topColor, rockColor) => {
      const group = new THREE.Group();
      const top = new THREE.Mesh(
        new THREE.CylinderGeometry(2.05, 1.85, 0.42, 7),
        new THREE.MeshStandardMaterial({ color: topColor, flatShading: true, roughness: 0.55 })
      );
      top.position.y = 0.2;
      const rock = new THREE.Mesh(
        new THREE.ConeGeometry(1.85, 1.65, 7),
        new THREE.MeshStandardMaterial({ color: rockColor, flatShading: true, roughness: 0.85 })
      );
      rock.rotation.x = Math.PI;
      rock.position.y = -0.8;
      group.add(top, rock);

      // Fluffy cloud ring under the Sky Island
      const cloudMat = new THREE.MeshStandardMaterial({ color: 0xffffff, flatShading: true, roughness: 0.95 });
      for (let i = 0; i < 6; i++) {
        const ang = (i * Math.PI * 2) / 6;
        const puff = new THREE.Mesh(new THREE.DodecahedronGeometry(0.55, 0), cloudMat);
        puff.position.set(Math.cos(ang) * 1.45, -0.35, Math.sin(ang) * 1.45);
        group.add(puff);
      }
      return group;
    };

    // =========================================================================
    // ISLAND 1: 💻 筆電小達人島 (Sea Island)
    // =========================================================================
    const island1 = createSeaIsland(0x4ade80, 0xfde68a);
    island1.position.set(-5.4, 0, 0.6);
    island1.userData = {
      worldId: 'world-1',
      label: '💻 World 1: 筆電小達人島 (點擊跳過去！)',
      standPos: new THREE.Vector3(-5.4, 0.42, 1.35)
    };

    const laptopGroup = new THREE.Group();
    laptopGroup.position.set(0, 0.45, -0.25);
    const kbBase = new THREE.Mesh(
      new THREE.BoxGeometry(1.25, 0.1, 0.85),
      new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.4 })
    );
    const screenPivot = new THREE.Group();
    screenPivot.position.set(0, 0.05, -0.4);
    const screenFrame = new THREE.Mesh(
      new THREE.BoxGeometry(1.25, 0.82, 0.08),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4 })
    );
    screenFrame.position.set(0, 0.41, 0);
    const screenGlow = new THREE.Mesh(
      new THREE.PlaneGeometry(1.1, 0.68),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
    );
    screenGlow.position.set(0, 0.41, 0.045);
    screenPivot.add(screenFrame, screenGlow);
    screenPivot.rotation.x = -0.25;
    laptopGroup.add(kbBase, screenPivot);
    island1.add(laptopGroup);

    const keyOrbit = new THREE.Group();
    keyOrbit.position.set(0, 1.0, -0.2);
    const keycaps = [];
    [0xfef08a, 0x38bdf8, 0xf97316].forEach((col, idx) => {
      const k = new THREE.Mesh(
        new THREE.BoxGeometry(0.28, 0.2, 0.28),
        new THREE.MeshStandardMaterial({ color: col, roughness: 0.35 })
      );
      const a = (idx * Math.PI * 2) / 3;
      k.position.set(Math.cos(a) * 1.35, 0, Math.sin(a) * 1.35);
      keyOrbit.add(k);
      keycaps.push(k);
    });
    island1.add(keyOrbit);
    scene.add(island1);

    // =========================================================================
    // ISLAND 2: 🌐 網路探險家島 (Sea Island)
    // =========================================================================
    const island2 = createSeaIsland(0x10b981, 0xfcd34d);
    island2.position.set(-1.8, 0, -0.3);
    island2.userData = {
      worldId: 'world-2',
      label: '🌐 World 2: 網路探險家島 (跳石頭＋游泳過去！)',
      standPos: new THREE.Vector3(-1.8, 0.42, 0.75)
    };

    const globe = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.62, 1),
      new THREE.MeshStandardMaterial({ color: 0x0284c7, flatShading: true, roughness: 0.35 })
    );
    globe.position.set(0, 1.15, -0.2);
    const globeWire = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.65, 1),
      new THREE.MeshBasicMaterial({ color: 0xa7f3d0, wireframe: true })
    );
    globeWire.position.set(0, 1.15, -0.2);

    const shieldRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.05, 0.055, 8, 28),
      new THREE.MeshStandardMaterial({ color: 0xfde047, emissive: 0xf59e0b, emissiveIntensity: 0.3 })
    );
    shieldRing.position.set(0, 1.15, -0.2);
    shieldRing.rotation.x = Math.PI / 3;

    const packetOrbit = new THREE.Group();
    packetOrbit.position.set(0, 1.15, -0.2);
    const packets = [];
    for (let i = 0; i < 3; i++) {
      const pkt = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.16, 0),
        new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xfacc15, emissiveIntensity: 0.5 })
      );
      const a = (i * Math.PI * 2) / 3;
      pkt.position.set(Math.cos(a) * 1.4, 0, Math.sin(a) * 1.4);
      packetOrbit.add(pkt);
      packets.push(pkt);
    }
    island2.add(globe, globeWire, shieldRing, packetOrbit);
    scene.add(island2);

    // =========================================================================
    // ISLAND 3: ☁️ AI 魔法師天空島 (One Piece Skypiea-style Air Island!)
    // =========================================================================
    const island3 = createSkyIsland(0xfbbf24, 0x92400e);
    island3.position.set(1.8, 2.35, -0.1);
    island3.userData = {
      worldId: 'world-3',
      label: '☁️ World 3: AI 魔法師天空島 (超級大跳躍直達雲端！)',
      standPos: new THREE.Vector3(1.8, 2.77, 0.75)
    };

    const pedestal = new THREE.Mesh(
      new THREE.CylinderGeometry(0.5, 0.65, 0.28, 6),
      new THREE.MeshStandardMaterial({ color: 0xfef3c7, flatShading: true })
    );
    pedestal.position.set(0, 0.52, -0.25);
    const aiCrystal = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.58, 0),
      new THREE.MeshStandardMaterial({
        color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.45, roughness: 0.15, flatShading: true
      })
    );
    aiCrystal.position.set(0, 1.4, -0.25);

    const magicOrbit = new THREE.Group();
    magicOrbit.position.set(0, 1.35, -0.25);
    [0xf43f5e, 0xa855f7, 0x22c55e, 0xfef08a].forEach((col, i) => {
      const star = new THREE.Mesh(
        new THREE.TetrahedronGeometry(0.2, 0),
        new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: 0.35 })
      );
      const a = (i * Math.PI * 2) / 4;
      star.position.set(Math.cos(a) * 1.35, Math.sin(a * 2) * 0.18, Math.sin(a) * 1.35);
      magicOrbit.add(star);
    });
    island3.add(pedestal, aiCrystal, magicOrbit);
    scene.add(island3);

    // =========================================================================
    // ISLAND 4: 🚀 創意程式島 (Future Creative Coding & AI Studio Island)
    // =========================================================================
    const createFutureIsland = (topColor, ringColor) => {
      const group = new THREE.Group();
      // Cyber floating tech disc
      const disc = new THREE.Mesh(
        new THREE.CylinderGeometry(2.1, 1.7, 0.45, 8),
        new THREE.MeshStandardMaterial({ color: topColor, roughness: 0.3, metalness: 0.2, flatShading: true })
      );
      disc.position.y = 0.2;
      // Energy core under the island
      const core = new THREE.Mesh(
        new THREE.ConeGeometry(1.6, 1.3, 8),
        new THREE.MeshStandardMaterial({ color: 0x4c1d95, roughness: 0.5, flatShading: true })
      );
      core.rotation.x = Math.PI;
      core.position.y = -0.65;
      // Neon glow ring around platform
      const neonRing = new THREE.Mesh(
        new THREE.TorusGeometry(2.0, 0.06, 8, 24),
        new THREE.MeshStandardMaterial({ color: ringColor, emissive: ringColor, emissiveIntensity: 0.6 })
      );
      neonRing.rotation.x = Math.PI / 2;
      neonRing.position.y = 0.22;
      group.add(disc, core, neonRing);
      return group;
    };

    const island4 = createFutureIsland(0x7c3aed, 0xa855f7);
    island4.position.set(5.4, 0.85, 0.2);
    island4.userData = {
      worldId: 'world-4',
      label: '🚀 World 4: 創意程式島・Scratch與創作工坊 (點擊探索！)',
      standPos: new THREE.Vector3(5.4, 1.27, 0.85)
    };

    // Creative studio props: Scratch coding blocks & Glowing creative crystal
    const studioGroup = new THREE.Group();
    studioGroup.position.set(0, 0.55, -0.2);

    // Central Creative Crystal (Icosahedron glowing with creative energy)
    const creativeCrystal = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.52, 0),
      new THREE.MeshStandardMaterial({
        color: 0xc084fc,
        emissive: 0x7c3aed,
        emissiveIntensity: 0.6,
        roughness: 0.2,
        flatShading: true
      })
    );
    creativeCrystal.position.set(0, 0.9, 0);
    studioGroup.add(creativeCrystal);

    // Orbiting Scratch coding blocks ({ }, loop, event blocks)
    const codeOrbit = new THREE.Group();
    codeOrbit.position.set(0, 0.9, 0);
    const codeBlocks = [];
    const blockColors = [0xf59e0b, 0x10b981, 0xec4899, 0x06b6d4];
    blockColors.forEach((color, i) => {
      const block = new THREE.Mesh(
        new THREE.BoxGeometry(0.35, 0.18, 0.22),
        new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.35, roughness: 0.3 })
      );
      const ang = (i * Math.PI * 2) / blockColors.length;
      block.position.set(Math.cos(ang) * 1.35, Math.sin(ang * 2) * 0.15, Math.sin(ang) * 1.35);
      codeOrbit.add(block);
      codeBlocks.push(block);
    });
    studioGroup.add(codeOrbit);

    // Mini futuristic creative rocket
    const rocketGroup = new THREE.Group();
    rocketGroup.position.set(0, 0.8, 0);
    const rocketBody = new THREE.Mesh(
      new THREE.ConeGeometry(0.2, 0.65, 6),
      new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 })
    );
    const rocketTip = new THREE.Mesh(
      new THREE.ConeGeometry(0.12, 0.25, 6),
      new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xb91c1c, emissiveIntensity: 0.3 })
    );
    rocketTip.position.y = 0.35;
    rocketGroup.add(rocketBody, rocketTip);
    rocketGroup.position.set(0.9, 0.4, -0.6);
    studioGroup.add(rocketGroup);

    island4.add(studioGroup);
    scene.add(island4);

    // =========================================================================
    // ISLAND 5: ROBLOX 3D 遊戲工坊 (Roblox Obby & Studio Blocky Island)
    // =========================================================================
    const island5 = createFutureIsland(0xe11d48, 0xfb7185);
    island5.position.set(8.4, 1.4, -1.2);
    island5.userData = {
      worldId: 'world-5',
      label: '🧱 World 5: Roblox 3D 遊戲工坊・跑酷與 Luau (點擊探索！)',
      standPos: new THREE.Vector3(8.4, 1.85, -0.55)
    };

    const rbxGroup = new THREE.Group();
    rbxGroup.position.set(0, 0.5, -0.2);
    const rbxColors = [0x22c55e, 0xf59e0b, 0x3b82f6];
    rbxColors.forEach((col, i) => {
      const part = new THREE.Mesh(
        new THREE.BoxGeometry(0.55, 0.24, 0.55),
        new THREE.MeshStandardMaterial({ color: col, roughness: 0.3, flatShading: true })
      );
      part.position.set((i - 1) * 0.6, i * 0.28 + 0.15, (i % 2 === 0 ? 0.2 : -0.2));
      rbxGroup.add(part);
    });
    const goalFlag = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 0.9, 6),
      new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xf59e0b, emissiveIntensity: 0.4 })
    );
    goalFlag.position.set(0.6, 1.15, 0.2);
    rbxGroup.add(goalFlag);
    island5.add(rbxGroup);
    scene.add(island5);

    // =========================================================================
    // ISLAND 6: 熱門 ROBLOX 地圖拆解島 (Popular Maps Deconstructed)
    // =========================================================================
    const island6 = createFutureIsland(0x0284c7, 0x38bdf8);
    island6.position.set(11.4, 2.0, 0.2);
    island6.userData = {
      worldId: 'world-6',
      label: '🗺️ World 6: 熱門 Roblox 地圖拆解・自然災害/種菜/造船 (點擊探索！)',
      standPos: new THREE.Vector3(11.4, 2.45, 0.85)
    };
    const popMapsGroup = new THREE.Group();
    popMapsGroup.position.set(0, 0.5, -0.2);
    const trophyOrb = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.45, 0),
      new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xeab308, emissiveIntensity: 0.45, flatShading: true })
    );
    trophyOrb.position.set(0, 0.85, 0);
    popMapsGroup.add(trophyOrb);
    island6.add(popMapsGroup);
    scene.add(island6);

    // =========================================================================
    // ISLAND 7: 🐱 SCRATCH 積木遊戲創意島 (Scratch Game Creator Island)
    // =========================================================================
    const island7 = createFutureIsland(0xf97316, 0xfdba74);
    island7.position.set(14.4, 1.5, -0.8);
    island7.userData = {
      worldId: 'world-7',
      label: '🐱 World 7: Scratch 積木遊戲創意島・座標/變數/分身 (點擊探索！)',
      standPos: new THREE.Vector3(14.4, 1.95, -0.15)
    };
    const scratchGroup = new THREE.Group();
    scratchGroup.position.set(0, 0.5, -0.2);
    const scratchColors = [0xfacc15, 0xf97316, 0x3b82f6];
    scratchColors.forEach((col, i) => {
      const blk = new THREE.Mesh(
        new THREE.BoxGeometry(0.65, 0.22, 0.45),
        new THREE.MeshStandardMaterial({ color: col, roughness: 0.35, flatShading: true })
      );
      blk.position.set(0, i * 0.26 + 0.15, 0);
      scratchGroup.add(blk);
    });
    island7.add(scratchGroup);
    scene.add(island7);

    this.islands = [island1, island2, island3, island4, island5, island6, island7];

    // =========================================================================
    // STEPPING STONES (Between Island 1 & Water Swim Channel to Island 2)
    // =========================================================================
    const stonePositions = [
      new THREE.Vector3(-3.6, -0.32, 1.05),
      new THREE.Vector3(-2.8, -0.32, 0.75)
    ];
    stonePositions.forEach((pos, idx) => {
      const stone = new THREE.Mesh(
        new THREE.CylinderGeometry(0.38, 0.48, 0.32, 6),
        new THREE.MeshStandardMaterial({
          color: w1Done > idx ? 0xfef08a : 0x94a3b8,
          emissive: w1Done > idx ? 0xf59e0b : 0x000000,
          emissiveIntensity: 0.25,
          flatShading: true
        })
      );
      stone.position.copy(pos);
      scene.add(stone);
      this.stones.push(stone);
    });

    // =========================================================================
    // 3D TREASURE CHESTS (Between Worlds!)
    // =========================================================================
    const createChest = (pos, unlocked) => {
      const chest = new THREE.Group();
      const base = new THREE.Mesh(
        new THREE.BoxGeometry(0.55, 0.35, 0.4),
        new THREE.MeshStandardMaterial({ color: unlocked ? 0xf59e0b : 0x78350f, flatShading: true })
      );
      const lid = new THREE.Mesh(
        new THREE.BoxGeometry(0.58, 0.18, 0.42),
        new THREE.MeshStandardMaterial({ color: unlocked ? 0xfef08a : 0xb45309, flatShading: true })
      );
      lid.position.y = 0.25;
      if (unlocked) lid.rotation.x = -0.5;
      chest.add(base, lid);
      chest.position.copy(pos);
      scene.add(chest);
      this.chests.push(chest);
    };
    createChest(new THREE.Vector3(-3.6, -0.1, -0.5), w1Done >= w1Total);
    createChest(new THREE.Vector3(0.0, -0.1, -0.5), w2Done >= w2Total);
    createChest(new THREE.Vector3(3.6, 0.3, -0.4), w3Done >= w3Total);
    createChest(new THREE.Vector3(6.9, 0.7, -0.6), w4Done >= w4Total);
    createChest(new THREE.Vector3(9.9, 1.3, -0.4), w5Done >= w5Total);
    createChest(new THREE.Vector3(12.9, 1.4, -0.3), w6Done >= w6Total);

    // =========================================================================
    // 3D EXPLORER AVATAR (🦁 Lion or 🦊 Fox)
    // =========================================================================
    const isFox = profile.avatar === '🦊';
    const avatarGroup = new THREE.Group();
    const bodyMat = new THREE.MeshStandardMaterial({ color: isFox ? 0xf97316 : 0xf59e0b, flatShading: true });
    const headMat = new THREE.MeshStandardMaterial({ color: isFox ? 0xfb923c : 0xfbbf24, flatShading: true });
    const packMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, flatShading: true });

    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.28, 0.48, 8), bodyMat);
    body.position.y = 0.24;
    const head = new THREE.Mesh(new THREE.DodecahedronGeometry(0.28, 0), headMat);
    head.position.y = 0.64;
    const earL = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.18, 4), bodyMat);
    earL.position.set(-0.18, 0.88, 0);
    const earR = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.18, 4), bodyMat);
    earR.position.set(0.18, 0.88, 0);
    const backpack = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.3, 0.14), packMat);
    backpack.position.set(0, 0.28, -0.22);

    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });
    const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.04, 6, 6), eyeMat);
    eyeL.position.set(-0.09, 0.68, 0.23);
    const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.04, 6, 6), eyeMat);
    eyeR.position.set(0.09, 0.68, 0.23);

    avatarGroup.add(body, head, earL, earR, backpack, eyeL, eyeR);

    // Start avatar on current progress island
    let startWorld = 'world-1';
    if (w2Done > 0) startWorld = 'world-2';
    if (w3Done > 0) startWorld = 'world-3';
    if (w4Done > 0) startWorld = 'world-4';
    if (w5Done > 0) startWorld = 'world-5';
    if (w6Done > 0) startWorld = 'world-6';
    if (w7Done > 0) startWorld = 'world-7';
    this.currentWorldId = startWorld;
    const initIsl = this.islands.find(i => i.userData.worldId === startWorld) || island1;
    avatarGroup.position.copy(initIsl.userData.standPos);
    scene.add(avatarGroup);
    this.avatar = avatarGroup;

    // =========================================================================
    // DRIFTING CLOUDS
    // =========================================================================
    const cloudMat = new THREE.MeshStandardMaterial({ color: 0xffffff, flatShading: true, roughness: 0.95 });
    for (let c = 0; c < 6; c++) {
      const cGroup = new THREE.Group();
      for (let p = 0; p < 3; p++) {
        const puff = new THREE.Mesh(new THREE.DodecahedronGeometry(0.45 - p * 0.08, 0), cloudMat);
        puff.position.set((p - 1) * 0.42, p === 1 ? 0.12 : 0, 0);
        cGroup.add(puff);
      }
      cGroup.position.set(-7 + c * 2.8, 3.0 + (c % 2) * 0.8, -3.0 - (c % 3));
      cGroup.userData = { speed: 0.004 + (c % 3) * 0.002 };
      scene.add(cGroup);
      this.clouds.push(cGroup);
    }

    // =========================================================================
    // RAYCASTER & INTERACTION
    // =========================================================================
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const updatePointer = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      this.mouse.x = pointer.x;
      this.mouse.y = pointer.y;
    };

    renderer.domElement.addEventListener('pointerdown', (e) => {
      this.isDragging = true;
      this.dragMoved = false;
      this.lastDragX = e.clientX;
    });
    window.addEventListener('pointerup', () => {
      this.isDragging = false;
    });
    renderer.domElement.addEventListener('pointermove', (e) => {
      if (this.isDragging) {
        const dx = e.clientX - this.lastDragX;
        if (Math.abs(dx) > 2) this.dragMoved = true;
        this.orbitAngle += dx * 0.006;
        this.lastDragX = e.clientX;
      }
      updatePointer(e);
      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(this.islands, true);
      if (intersects.length > 0) {
        let obj = intersects[0].object;
        while (obj.parent && !obj.userData.worldId) obj = obj.parent;
        if (obj.userData && obj.userData.worldId) {
          this.hoveredWorldId = obj.userData.worldId;
          renderer.domElement.style.cursor = 'pointer';
          if (hoverLabel) hoverLabel.textContent = obj.userData.label;
          return;
        }
      }
      this.hoveredWorldId = null;
      renderer.domElement.style.cursor = this.isDragging ? 'grabbing' : 'grab';
      if (hoverLabel) hoverLabel.textContent = '✨ 點擊島嶼讓小探險家跳石頭、游泳、或超級大跳躍！';
    });

    renderer.domElement.addEventListener('click', (e) => {
      if (this.dragMoved) return;
      updatePointer(e);
      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(this.islands, true);
      if (intersects.length > 0) {
        let obj = intersects[0].object;
        while (obj.parent && !obj.userData.worldId) obj = obj.parent;
        if (obj.userData && obj.userData.worldId) {
          this.travelToWorld(obj.userData.worldId, true);
        }
      }
    });

    // =========================================================================
    // ANIMATION LOOP
    // =========================================================================
    const clock = new THREE.Clock();
    const animate = () => {
      if (!this.renderer) return;
      this.animFrameId = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.elapsedTime;

      // Gentle camera parallax + drag orbit
      const camRadius = 14.6;
      const targetAngle = this.orbitAngle + this.mouse.x * 0.12;
      camera.position.x = Math.sin(targetAngle) * camRadius;
      camera.position.z = Math.cos(targetAngle) * camRadius;
      camera.position.y = 4.5 + this.mouse.y * 0.45;
      camera.lookAt(0, 0.85, 0);

      // Ocean waves
      for (let i = 0; i < posAttr.count; i++) {
        const vx = posAttr.getX(i);
        const vz = posAttr.getZ(i);
        posAttr.setY(i, oceanBaseY[i] + Math.sin(vx * 0.7 + t * 2.0) * 0.08 + Math.cos(vz * 0.9 + t * 1.6) * 0.06);
      }
      posAttr.needsUpdate = true;

      // Island 1 Animation
      island1.position.y = Math.sin(t * 1.4) * 0.05;
      screenPivot.rotation.x = -0.22 + Math.sin(t * 1.8) * 0.08;
      keyOrbit.rotation.y = t * 0.9;
      keycaps.forEach((k, idx) => { k.rotation.x = t * 1.2 + idx; k.rotation.y = t * 1.5; });

      // Island 2 Animation
      island2.position.y = Math.sin(t * 1.4 + 2.0) * 0.05;
      globe.rotation.y = t * 0.7;
      globeWire.rotation.y = t * 0.7;
      shieldRing.rotation.z = t * 0.85;
      packetOrbit.rotation.y = -t * 1.35;
      packets.forEach((p, idx) => { p.position.y = Math.sin(t * 3 + idx * 2) * 0.15; });

      // Island 3 (Sky Island) Animation
      island3.position.y = 2.35 + Math.sin(t * 1.4 + 4.0) * 0.16;
      aiCrystal.position.y = 1.4 + Math.sin(t * 2.5) * 0.12;
      aiCrystal.rotation.y = t * 1.1;
      magicOrbit.rotation.y = t * 1.2;
      magicOrbit.rotation.z = Math.sin(t * 0.8) * 0.18;

      // Island 4 (Creative Coding & Studio Island) Animation
      island4.position.y = 0.85 + Math.sin(t * 1.4 + 5.5) * 0.08;
      creativeCrystal.rotation.y = t * 1.4;
      creativeCrystal.rotation.x = Math.sin(t * 0.9) * 0.2;
      creativeCrystal.position.y = 0.9 + Math.sin(t * 2.0) * 0.09;
      codeOrbit.rotation.y = -t * 1.1;
      codeBlocks.forEach((b, idx) => {
        b.rotation.x = t * 1.5 + idx;
        b.rotation.z = t * 1.2;
      });
      rocketGroup.position.y = 0.4 + Math.sin(t * 2.8) * 0.12;
      rocketGroup.rotation.y = t * 0.8;

      // Chests bobbing
      this.chests.forEach((ch, idx) => {
        ch.position.y = -0.1 + Math.sin(t * 2.2 + idx) * 0.08;
        ch.rotation.y = Math.sin(t * 0.8 + idx) * 0.25;
      });

      // Avatar Movement State Machine (Hop / Swim / Super High Jump!)
      if (this.avatar) {
        const av = this.avatarState;
        if (av.mode === 'idle') {
          const curIsl = this.islands.find(i => i.userData.worldId === this.currentWorldId) || island1;
          const baseStand = curIsl.userData.standPos;
          const yOffset = baseStand.y - curIsl.position.y;
          this.avatar.position.x = baseStand.x;
          this.avatar.position.z = baseStand.z;
          this.avatar.position.y = curIsl.position.y + yOffset + Math.abs(Math.sin(t * 3.0)) * 0.08;
          this.avatar.rotation.x = 0;
          this.avatar.rotation.y = Math.sin(t * 1.2) * 0.25;
        } else {
          const seg = av.waypoints[av.wpIndex];
          const speed = seg.type === 'superjump' ? 0.95 : seg.type === 'swim' ? 1.1 : 1.75;
          av.progress += dt * speed;
          const p = Math.min(av.progress, 1);

          // Linear X & Z interpolation
          const curX = seg.from.x + (seg.to.x - seg.from.x) * p;
          const curZ = seg.from.z + (seg.to.z - seg.from.z) * p;
          let curY = seg.from.y + (seg.to.y - seg.from.y) * p;

          // Face movement direction
          this.avatar.rotation.y = Math.atan2(seg.to.x - seg.from.x, seg.to.z - seg.from.z);

          if (seg.type === 'hop') {
            curY += Math.sin(p * Math.PI) * 0.85;
            this.avatar.rotation.x = 0.15;
          } else if (seg.type === 'swim') {
            curY = -0.52 + Math.sin(t * 12) * 0.06;
            this.avatar.rotation.x = 0.65; // swimming forward tilt!
            if (Math.random() < 0.22) {
              this.spawnSplashRing(curX, -0.38, curZ);
            }
          } else if (seg.type === 'superjump') {
            // One Piece Skypiea-style SUPER HIGH JUMP arc!
            curY += Math.sin(p * Math.PI) * 3.2;
            this.avatar.rotation.x = -0.25;
            this.avatar.rotation.y += p * Math.PI * 2; // joyful mid-air spin!
            if (Math.random() < 0.35) {
              this.spawnJumpSparkle(curX, curY, curZ);
            }
          }

          this.avatar.position.set(curX, curY, curZ);

          if (p >= 1) {
            av.wpIndex++;
            av.progress = 0;
            if (av.wpIndex >= av.waypoints.length) {
              av.mode = 'idle';
              this.currentWorldId = av.targetWorldId;
              if (this._onSelectWorld) {
                this._onSelectWorld(this.currentWorldId);
              }
            }
          }
        }
      }

      // Update Splash Rings
      for (let i = this.splashRings.length - 1; i >= 0; i--) {
        const r = this.splashRings[i];
        r.scale.multiplyScalar(1.06);
        r.material.opacity -= 0.035;
        if (r.material.opacity <= 0) {
          scene.remove(r);
          this.splashRings.splice(i, 1);
        }
      }

      // Update Super-Jump Sparkles
      for (let i = this.jumpParticles.length - 1; i >= 0; i--) {
        const sp = this.jumpParticles[i];
        sp.position.y -= 0.025;
        sp.material.opacity -= 0.04;
        if (sp.material.opacity <= 0) {
          scene.remove(sp);
          this.jumpParticles.splice(i, 1);
        }
      }

      // Hover scale-up effect
      this.islands.forEach(isl => {
        const isHov = isl.userData.worldId === this.hoveredWorldId;
        const targetScale = isHov ? 1.09 : 1.0;
        isl.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.12);
      });

      // Drifting clouds
      this.clouds.forEach(cl => {
        cl.position.x += cl.userData.speed;
        if (cl.position.x > 8.5) cl.position.x = -8.5;
      });

      renderer.render(scene, camera);
    };
    animate();

    this._onResize = () => {
      if (!stage || !this.renderer) return;
      const newW = stage.clientWidth || 960;
      camera.aspect = newW / height;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, height);
    };
    window.addEventListener('resize', this._onResize);
  },

  spawnSplashRing(x, y, z) {
    if (!this.scene) return;
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.18, 0.28, 16),
      new THREE.MeshBasicMaterial({ color: 0xe0f2fe, side: THREE.DoubleSide, transparent: true, opacity: 0.85 })
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(x, y, z);
    this.scene.add(ring);
    this.splashRings.push(ring);
  },

  spawnJumpSparkle(x, y, z) {
    if (!this.scene) return;
    const sp = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.14, 0),
      new THREE.MeshBasicMaterial({ color: 0xfef08a, transparent: true, opacity: 0.95 })
    );
    sp.position.set(x + (Math.random() - 0.5) * 0.3, y, z + (Math.random() - 0.5) * 0.3);
    this.scene.add(sp);
    this.jumpParticles.push(sp);
  },

  travelToWorld(targetWorldId, shouldScroll = true) {
    const targetIsl = this.islands.find(i => i.userData.worldId === targetWorldId);
    if (!targetIsl || !this.avatar) {
      if (shouldScroll && this._onSelectWorld) this._onSelectWorld(targetWorldId);
      return;
    }

    if (this.currentWorldId === targetWorldId && this.avatarState.mode === 'idle') {
      if (shouldScroll && this._onSelectWorld) this._onSelectWorld(targetWorldId);
      return;
    }

    const p1 = this.islands[0].userData.standPos;
    const s1 = new THREE.Vector3(-3.6, -0.1, 1.05);
    const s2 = new THREE.Vector3(-2.8, -0.1, 0.75);
    const p2 = this.islands[1].userData.standPos;
    const p3 = this.islands[2].userData.standPos;
    const p4 = this.islands[3].userData.standPos;
    const p5 = this.islands[4] ? this.islands[4].userData.standPos : p4;
    const p6 = this.islands[5] ? this.islands[5].userData.standPos : p5;
    const p7 = this.islands[6] ? this.islands[6].userData.standPos : p6;

    const waypoints = [];
    const cur = this.currentWorldId;

    const segmentsForward = {
      1: () => {
        waypoints.push({ from: p1, to: s1, type: 'hop' });
        waypoints.push({ from: s1, to: s2, type: 'hop' });
        waypoints.push({ from: s2, to: p2, type: 'swim' });
      },
      2: () => { waypoints.push({ from: p2, to: p3, type: 'superjump' }); },
      3: () => { waypoints.push({ from: p3, to: p4, type: 'superjump' }); },
      4: () => { waypoints.push({ from: p4, to: p5, type: 'superjump' }); },
      5: () => { waypoints.push({ from: p5, to: p6, type: 'superjump' }); },
      6: () => { waypoints.push({ from: p6, to: p7, type: 'superjump' }); }
    };

    const segmentsBackward = {
      2: () => {
        waypoints.push({ from: p2, to: s2, type: 'swim' });
        waypoints.push({ from: s2, to: s1, type: 'hop' });
        waypoints.push({ from: s1, to: p1, type: 'hop' });
      },
      3: () => { waypoints.push({ from: p3, to: p2, type: 'superjump' }); },
      4: () => { waypoints.push({ from: p4, to: p3, type: 'superjump' }); },
      5: () => { waypoints.push({ from: p5, to: p4, type: 'superjump' }); },
      6: () => { waypoints.push({ from: p6, to: p5, type: 'superjump' }); },
      7: () => { waypoints.push({ from: p7, to: p6, type: 'superjump' }); }
    };

    const curIdx = parseInt(cur.replace('world-', ''), 10);
    const tgtIdx = parseInt(targetWorldId.replace('world-', ''), 10);
    if (!Number.isNaN(curIdx) && !Number.isNaN(tgtIdx)) {
      if (curIdx < tgtIdx) {
        for (let i = curIdx; i < tgtIdx; i++) {
          if (segmentsForward[i]) segmentsForward[i]();
        }
      } else if (curIdx > tgtIdx) {
        for (let i = curIdx; i > tgtIdx; i--) {
          if (segmentsBackward[i]) segmentsBackward[i]();
        }
      }
    }

    if (waypoints.length === 0) {
      if (shouldScroll && this._onSelectWorld) this._onSelectWorld(targetWorldId);
      return;
    }

    this.avatarState = {
      mode: 'moving',
      waypoints,
      wpIndex: 0,
      progress: 0,
      targetWorldId
    };
    if (!shouldScroll) {
      this._onSelectWorld = null;
    }
  }
};
