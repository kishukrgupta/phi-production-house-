/* ============================================
   TempleNightScene — Three.js r149
   Rain · Mist · Falling Leaves · Pointer Wisps
   Bloom Post-Processing · Responsive Camera
   ============================================ */

(function () {
  'use strict';

  /* ── Globals ── */
  const IMPORT_MAP = {
    three: 'https://unpkg.com/three@0.149.0/build/three.module.js',
    OrbitControls: 'https://unpkg.com/three@0.149.0/examples/jsm/controls/OrbitControls.js',
    EffectComposer: 'https://unpkg.com/three@0.149.0/examples/jsm/postprocessing/EffectComposer.js',
    RenderPass: 'https://unpkg.com/three@0.149.0/examples/jsm/postprocessing/RenderPass.js',
    UnrealBloomPass: 'https://unpkg.com/three@0.149.0/examples/jsm/postprocessing/UnrealBloomPass.js',
    ShaderPass: 'https://unpkg.com/three@0.149.0/examples/jsm/postprocessing/ShaderPass.js',
    CopyShader: 'https://unpkg.com/three@0.149.0/examples/jsm/shaders/CopyShader.js',
    LuminosityHighPassShader: 'https://unpkg.com/three@0.149.0/examples/jsm/shaders/LuminosityHighPassShader.js',
  };

  let THREE, EffectComposer, RenderPass, UnrealBloomPass;

  /* ── Boot ── */
  async function loadDeps() {
    THREE = await import(IMPORT_MAP.three);
    const ec = await import(IMPORT_MAP.EffectComposer);
    const rp = await import(IMPORT_MAP.RenderPass);
    const ub = await import(IMPORT_MAP.UnrealBloomPass);
    // Also load required shaders for bloom
    await import(IMPORT_MAP.LuminosityHighPassShader);
    await import(IMPORT_MAP.CopyShader);
    await import(IMPORT_MAP.ShaderPass);

    EffectComposer = ec.EffectComposer;
    RenderPass = rp.RenderPass;
    UnrealBloomPass = ub.UnrealBloomPass;
  }

  /* ── Pointer state ── */
  const pointer = { x: 0, y: 0, ndcX: 0, ndcY: 0 };

  /* ── Color palette ── */
  const PAL = {
    night: 0x060918,
    moonlight: 0xc8d8ff,
    warmGlow: 0xff9944,
    lantern: 0xffaa33,
    leafGreen: 0x2d5a1e,
    leafOrange: 0xcc6622,
    leafRed: 0x993322,
    mistBase: 0x182848,
    wispCyan: 0x66ddff,
    wispGold: 0xffcc66,
  };

  /* ============================================
     Main Scene Builder
     ============================================ */
  async function initTempleNightScene(container) {
    await loadDeps();

    const W = () => container.clientWidth || window.innerWidth || 1;
    const H = () => container.clientHeight || window.innerHeight || 1;

    const isMobile = window.innerWidth < 768 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    function getCameraParams() {
      const aspect = W() / H();
      if (aspect < 0.65) {
        return { fov: 66, z: 25, y: 5.5 };
      } else if (aspect < 1.0) {
        return { fov: 54, z: 23, y: 5.8 };
      }
      return { fov: 42, z: 22, y: 6 };
    }

    /* ── Renderer ── */
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.setSize(W(), H());
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.85;
    renderer.shadowMap.enabled = !isMobile;
    if (!isMobile) renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    /* ── Scene ── */
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(PAL.night);
    scene.fog = new THREE.FogExp2(PAL.night, 0.018);

    /* ── Camera ── */
    const initCam = getCameraParams();
    const camera = new THREE.PerspectiveCamera(initCam.fov, W() / H(), 0.1, 200);
    camera.position.set(0, initCam.y, initCam.z);
    camera.lookAt(0, 4, 0);

    /* ── Post-Processing (Bloom) ── */
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(W(), H()),
      isMobile ? 0.9 : 1.2,   // strength
      0.5,                    // radius
      0.35                    // threshold
    );
    composer.addPass(bloomPass);

    /* ============================================
       TEMPLE ARCHITECTURE
       ============================================ */

    // Ground plane
    const groundGeo = new THREE.PlaneGeometry(80, 80);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x111822,
      roughness: 0.9,
      metalness: 0.1,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    ground.receiveShadow = true;
    scene.add(ground);

    // Stone platform
    const platformGeo = new THREE.BoxGeometry(12, 0.8, 10);
    const stoneMat = new THREE.MeshStandardMaterial({
      color: 0x3a3a4a,
      roughness: 0.85,
      metalness: 0.15,
    });
    const platform = new THREE.Mesh(platformGeo, stoneMat);
    platform.position.set(0, 0.4, 0);
    platform.receiveShadow = true;
    platform.castShadow = true;
    scene.add(platform);

    // Steps
    for (let i = 0; i < 3; i++) {
      const stepGeo = new THREE.BoxGeometry(12 + i * 1.5, 0.3, 1.2);
      const step = new THREE.Mesh(stepGeo, stoneMat);
      step.position.set(0, 0.15 + i * -0.3, 5 + i * 1.2);
      step.receiveShadow = true;
      step.castShadow = true;
      scene.add(step);
    }

    // Temple columns
    const colMat = new THREE.MeshStandardMaterial({
      color: 0x5a5a6a,
      roughness: 0.7,
      metalness: 0.2,
    });

    function createColumn(x, z) {
      const group = new THREE.Group();
      // Base
      const base = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.5, 1.2), colMat);
      base.position.y = 1.05;
      group.add(base);
      // Shaft
      const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.4, 6, 12), colMat);
      shaft.position.y = 4.3;
      group.add(shaft);
      // Capital
      const cap = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.6, 1.4), colMat);
      cap.position.y = 7.6;
      group.add(cap);
      group.position.set(x, 0, z);
      group.traverse(c => { c.castShadow = true; c.receiveShadow = true; });
      return group;
    }

    const colPositions = [
      [-4.5, -3], [-4.5, 0], [-4.5, 3],
      [4.5, -3], [4.5, 0], [4.5, 3],
    ];
    colPositions.forEach(([x, z]) => scene.add(createColumn(x, z)));

    // Roof / Entablature
    const roofGeo = new THREE.BoxGeometry(13, 0.7, 11);
    const roofMat = new THREE.MeshStandardMaterial({
      color: 0x4a4a5a,
      roughness: 0.75,
      metalness: 0.2,
    });
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.set(0, 8.2, 0);
    roof.castShadow = true;
    roof.receiveShadow = true;
    scene.add(roof);

    // Triangular pediment
    const pedShape = new THREE.Shape();
    pedShape.moveTo(-6.5, 0);
    pedShape.lineTo(0, 3.5);
    pedShape.lineTo(6.5, 0);
    pedShape.lineTo(-6.5, 0);
    const pedGeo = new THREE.ExtrudeGeometry(pedShape, { depth: 0.6, bevelEnabled: false });
    const pediment = new THREE.Mesh(pedGeo, roofMat);
    pediment.position.set(0, 8.55, 5.2);
    pediment.castShadow = true;
    scene.add(pediment);

    // Back wall
    const wallGeo = new THREE.BoxGeometry(9.5, 7.5, 0.5);
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x2a2a3a,
      roughness: 0.9,
      metalness: 0.1,
    });
    const wall = new THREE.Mesh(wallGeo, wallMat);
    wall.position.set(0, 4.55, -4.5);
    wall.castShadow = true;
    wall.receiveShadow = true;
    scene.add(wall);

    // Inner sanctum glow object
    const sanctumGeo = new THREE.SphereGeometry(0.8, 16, 16);
    const sanctumMat = new THREE.MeshStandardMaterial({
      color: PAL.warmGlow,
      emissive: PAL.warmGlow,
      emissiveIntensity: 2.5,
      roughness: 0.2,
    });
    const sanctum = new THREE.Mesh(sanctumGeo, sanctumMat);
    sanctum.position.set(0, 3, -2);
    scene.add(sanctum);

    /* ── Lanterns ── */
    function createLantern(x, y, z) {
      const group = new THREE.Group();
      const bodyGeo = new THREE.CylinderGeometry(0.2, 0.25, 0.6, 8);
      const bodyMat = new THREE.MeshStandardMaterial({
        color: PAL.lantern,
        emissive: PAL.lantern,
        emissiveIntensity: 1.8,
        transparent: true,
        opacity: 0.85,
      });
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      group.add(body);

      const light = new THREE.PointLight(PAL.lantern, 3, 12, 2);
      light.position.y = 0.1;
      light.castShadow = true;
      light.shadow.mapSize.set(256, 256);
      group.add(light);

      group.position.set(x, y, z);
      return group;
    }

    const lanterns = [];
    [[-5.5, 2.5, 4.5], [5.5, 2.5, 4.5], [-3, 7, 1], [3, 7, 1]].forEach(p => {
      const l = createLantern(...p);
      lanterns.push(l);
      scene.add(l);
    });

    /* ── Lighting ── */
    // Moonlight
    const moon = new THREE.DirectionalLight(PAL.moonlight, 0.4);
    moon.position.set(15, 25, 10);
    moon.castShadow = true;
    moon.shadow.mapSize.set(1024, 1024);
    moon.shadow.camera.near = 1;
    moon.shadow.camera.far = 60;
    moon.shadow.camera.left = -20;
    moon.shadow.camera.right = 20;
    moon.shadow.camera.top = 20;
    moon.shadow.camera.bottom = -5;
    scene.add(moon);

    // Ambient
    const ambient = new THREE.AmbientLight(0x1a2040, 0.35);
    scene.add(ambient);

    // Rim fill
    const rimLight = new THREE.DirectionalLight(0x334488, 0.2);
    rimLight.position.set(-10, 8, -5);
    scene.add(rimLight);

    /* ============================================
       RAIN SYSTEM
       ============================================ */
    const RAIN_COUNT = isMobile ? 1200 : 4000;
    const rainGeo = new THREE.BufferGeometry();
    const rainPos = new Float32Array(RAIN_COUNT * 3);
    const rainVel = new Float32Array(RAIN_COUNT);

    for (let i = 0; i < RAIN_COUNT; i++) {
      rainPos[i * 3] = (Math.random() - 0.5) * 60;
      rainPos[i * 3 + 1] = Math.random() * 30;
      rainPos[i * 3 + 2] = (Math.random() - 0.5) * 60;
      rainVel[i] = 0.3 + Math.random() * 0.4;
    }
    rainGeo.setAttribute('position', new THREE.BufferAttribute(rainPos, 3));

    const rainMat = new THREE.PointsMaterial({
      color: 0x8899cc,
      size: 0.08,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const rain = new THREE.Points(rainGeo, rainMat);
    scene.add(rain);

    function updateRain() {
      const pos = rain.geometry.attributes.position.array;
      for (let i = 0; i < RAIN_COUNT; i++) {
        pos[i * 3 + 1] -= rainVel[i];
        pos[i * 3] += Math.sin(Date.now() * 0.001 + i) * 0.003; // slight wind
        if (pos[i * 3 + 1] < -1) {
          pos[i * 3 + 1] = 25 + Math.random() * 5;
          pos[i * 3] = (Math.random() - 0.5) * 60;
          pos[i * 3 + 2] = (Math.random() - 0.5) * 60;
        }
      }
      rain.geometry.attributes.position.needsUpdate = true;
    }

    /* ============================================
       MIST / FOG LAYERS
       ============================================ */
    const mistLayers = [];
    for (let i = 0; i < 6; i++) {
      const mistGeo = new THREE.PlaneGeometry(30 + i * 8, 3 + i * 0.5);
      const mistMat = new THREE.MeshBasicMaterial({
        color: PAL.mistBase,
        transparent: true,
        opacity: 0.08 + i * 0.02,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
      const mist = new THREE.Mesh(mistGeo, mistMat);
      mist.position.set(
        (Math.random() - 0.5) * 10,
        0.5 + i * 0.8,
        -8 + i * 3
      );
      mist.rotation.x = -0.15;
      mistLayers.push({ mesh: mist, speed: 0.0005 + Math.random() * 0.0008, drift: Math.random() * Math.PI * 2 });
      scene.add(mist);
    }

    function updateMist(t) {
      mistLayers.forEach((m, i) => {
        m.mesh.position.x = Math.sin(t * m.speed + m.drift) * (5 + i * 2);
        m.mesh.material.opacity = 0.06 + Math.sin(t * 0.0003 + i) * 0.03;
      });
    }

    /* ============================================
       FALLING LEAVES
       ============================================ */
    const LEAF_COUNT = 35;
    const leaves = [];
    const leafColors = [PAL.leafGreen, PAL.leafOrange, PAL.leafRed, 0x8B4513, 0x556B2F];

    for (let i = 0; i < LEAF_COUNT; i++) {
      const size = 0.15 + Math.random() * 0.2;
      const leafShape = new THREE.Shape();
      leafShape.moveTo(0, size);
      leafShape.quadraticCurveTo(size * 0.6, size * 0.6, size * 0.3, 0);
      leafShape.quadraticCurveTo(0, size * 0.2, -size * 0.3, 0);
      leafShape.quadraticCurveTo(-size * 0.6, size * 0.6, 0, size);

      const leafGeo = new THREE.ShapeGeometry(leafShape);
      const leafMat = new THREE.MeshStandardMaterial({
        color: leafColors[i % leafColors.length],
        roughness: 0.8,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85,
      });

      const leaf = new THREE.Mesh(leafGeo, leafMat);
      leaf.position.set(
        (Math.random() - 0.5) * 30,
        15 + Math.random() * 15,
        (Math.random() - 0.5) * 30
      );

      const leafData = {
        mesh: leaf,
        fallSpeed: 0.008 + Math.random() * 0.015,
        driftX: (Math.random() - 0.5) * 0.02,
        driftZ: (Math.random() - 0.5) * 0.02,
        rotSpeed: (Math.random() - 0.5) * 0.03,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.5 + Math.random() * 1.5,
      };
      leaves.push(leafData);
      scene.add(leaf);
    }

    function updateLeaves(t) {
      leaves.forEach(l => {
        l.mesh.position.y -= l.fallSpeed;
        l.mesh.position.x += l.driftX + Math.sin(t * 0.001 * l.wobbleSpeed + l.wobble) * 0.008;
        l.mesh.position.z += l.driftZ + Math.cos(t * 0.001 * l.wobbleSpeed + l.wobble) * 0.005;
        l.mesh.rotation.x += l.rotSpeed * 0.5;
        l.mesh.rotation.y += l.rotSpeed;
        l.mesh.rotation.z = Math.sin(t * 0.002 + l.wobble) * 0.3;

        if (l.mesh.position.y < -1) {
          l.mesh.position.y = 15 + Math.random() * 10;
          l.mesh.position.x = (Math.random() - 0.5) * 30;
          l.mesh.position.z = (Math.random() - 0.5) * 30;
        }
      });
    }

    /* ============================================
       POINTER WISPS
       ============================================ */
    const WISP_COUNT = 12;
    const wisps = [];

    for (let i = 0; i < WISP_COUNT; i++) {
      const wispGeo = new THREE.SphereGeometry(0.06 + Math.random() * 0.08, 8, 8);
      const wispColor = i % 2 === 0 ? PAL.wispCyan : PAL.wispGold;
      const wispMat = new THREE.MeshBasicMaterial({
        color: wispColor,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
      });
      const wisp = new THREE.Mesh(wispGeo, wispMat);

      // Trail light
      const wLight = new THREE.PointLight(wispColor, 0, 4, 2);
      wisp.add(wLight);

      wisp.position.set(
        (Math.random() - 0.5) * 20,
        2 + Math.random() * 6,
        (Math.random() - 0.5) * 15
      );

      const data = {
        mesh: wisp,
        light: wLight,
        targetX: 0,
        targetY: 4,
        targetZ: 10,
        orbitPhase: Math.random() * Math.PI * 2,
        orbitSpeed: 0.3 + Math.random() * 0.5,
        orbitRadius: 1.5 + Math.random() * 3,
        floatY: 0.5 + Math.random() * 1,
        baseOpacity: 0.4 + Math.random() * 0.3,
      };
      wisps.push(data);
      scene.add(wisp);
    }

    function updateWisps(t) {
      // Convert pointer NDC to world-ish coords
      const pWorldX = pointer.ndcX * 12;
      const pWorldY = 3 + pointer.ndcY * 5;

      wisps.forEach((w, i) => {
        // Orbit around pointer-mapped position
        const phase = w.orbitPhase + t * 0.001 * w.orbitSpeed;
        w.targetX = pWorldX + Math.cos(phase) * w.orbitRadius;
        w.targetY = pWorldY + Math.sin(phase * 1.3) * w.floatY;
        w.targetZ = 8 + Math.sin(phase * 0.7) * 3;

        // Smooth follow
        w.mesh.position.x += (w.targetX - w.mesh.position.x) * 0.015;
        w.mesh.position.y += (w.targetY - w.mesh.position.y) * 0.015;
        w.mesh.position.z += (w.targetZ - w.mesh.position.z) * 0.01;

        // Pulse opacity
        const pulse = 0.5 + 0.5 * Math.sin(t * 0.003 + i * 0.8);
        w.mesh.material.opacity = w.baseOpacity * pulse;
        w.light.intensity = pulse * 1.5;
      });
    }

    /* ============================================
       STARS / FIREFLIES in background
       ============================================ */
    const STAR_COUNT = 300;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(STAR_COUNT * 3);
    for (let i = 0; i < STAR_COUNT; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 100;
      starPos[i * 3 + 1] = 10 + Math.random() * 30;
      starPos[i * 3 + 2] = -20 - Math.random() * 40;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.12,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    /* ── Moon disc ── */
    const moonDiscGeo = new THREE.CircleGeometry(2, 32);
    const moonDiscMat = new THREE.MeshBasicMaterial({
      color: 0xddeeff,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending,
    });
    const moonDisc = new THREE.Mesh(moonDiscGeo, moonDiscMat);
    moonDisc.position.set(18, 22, -30);
    scene.add(moonDisc);

    // Moon glow halo
    const haloGeo = new THREE.CircleGeometry(5, 32);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0x8899cc,
      transparent: true,
      opacity: 0.06,
      blending: THREE.AdditiveBlending,
    });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    halo.position.set(18, 22, -31);
    scene.add(halo);

    /* ── Trees (simple silhouettes) ── */
    function createTree(x, z, scale) {
      const group = new THREE.Group();
      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.2 * scale, 0.3 * scale, 4 * scale, 6),
        new THREE.MeshStandardMaterial({ color: 0x1a1510, roughness: 0.95 })
      );
      trunk.position.y = 2 * scale;
      group.add(trunk);

      const foliage = new THREE.Mesh(
        new THREE.SphereGeometry(2 * scale, 8, 8),
        new THREE.MeshStandardMaterial({ color: 0x0a1a0a, roughness: 0.95 })
      );
      foliage.position.y = 5 * scale;
      group.add(foliage);

      group.position.set(x, 0, z);
      group.traverse(c => { c.castShadow = true; });
      return group;
    }

    [[-15, -5, 1.2], [16, -3, 1.0], [-12, 8, 0.8], [14, 10, 1.1],
     [-18, 2, 0.9], [20, -8, 1.3], [-8, -12, 0.7], [10, -14, 1.0]
    ].forEach(([x, z, s]) => scene.add(createTree(x, z, s)));

    /* ============================================
       POINTER TRACKING
       ============================================ */
    container.addEventListener('mousemove', e => {
      const rect = container.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.ndcX = (pointer.x / rect.width) * 2 - 1;
      pointer.ndcY = -((pointer.y / rect.height) * 2 - 1);
    });

    container.addEventListener('touchmove', e => {
      const rect = container.getBoundingClientRect();
      const touch = e.touches[0];
      pointer.x = touch.clientX - rect.left;
      pointer.y = touch.clientY - rect.top;
      pointer.ndcX = (pointer.x / rect.width) * 2 - 1;
      pointer.ndcY = -((pointer.y / rect.height) * 2 - 1);
    }, { passive: true });

    /* ============================================
       CAMERA COMPOSITION — subtle parallax
       ============================================ */
    const baseCamPos = { x: 0, y: 6, z: 22 };

    function updateCamera() {
      camera.position.x = baseCamPos.x + pointer.ndcX * 1.2;
      camera.position.y = baseCamPos.y + pointer.ndcY * 0.6;
      camera.lookAt(0, 4, 0);
    }

    /* ============================================
       ANIMATION LOOP
       ============================================ */
    const clock = new THREE.Clock();
    let frameId;

    function animate() {
      frameId = requestAnimationFrame(animate);
      const t = Date.now();
      const elapsed = clock.getElapsedTime();

      updateRain();
      updateMist(t);
      updateLeaves(t);
      updateWisps(t);
      updateCamera();

      // Lantern flicker
      lanterns.forEach((l, i) => {
        const flicker = 0.85 + 0.15 * Math.sin(elapsed * 5 + i * 2.1) * Math.sin(elapsed * 8.3 + i);
        l.children[1].intensity = 3 * flicker;
      });

      // Sanctum pulse
      sanctumMat.emissiveIntensity = 2.0 + Math.sin(elapsed * 1.5) * 0.8;

      // Star twinkle
      starMat.opacity = 0.45 + Math.sin(elapsed * 0.5) * 0.15;

      composer.render();
    }

    animate();

    /* ── Resize ── */
    function onResize() {
      const width = W();
      const height = H();
      if (!width || !height) return;
      const aspect = width / height;
      camera.aspect = aspect;
      const camParams = getCameraParams();
      camera.fov = camParams.fov;
      camera.position.z = camParams.z;
      camera.position.y = camParams.y;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      composer.setSize(width, height);
      bloomPass.resolution.set(width, height);
    }
    window.addEventListener('resize', onResize);

    // Return dispose function
    return function dispose() {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      renderer.domElement.remove();
    };
  }

  /* ── Auto-mount ── */
  function mount() {
    const container = document.querySelector('.shader-frame');
    if (container) {
      initTempleNightScene(container);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }

  // Expose globally
  window.TempleNightScene = initTempleNightScene;
})();
