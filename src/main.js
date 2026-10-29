import * as THREE from 'three';

/* ==========================================================================
   1. HIGH-PERFORMANCE RENDERER & SCENE
   ========================================================================== */
const canvas = document.querySelector('#webgl-canvas');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x020403, 0.045);

const camera = new THREE.PerspectiveCamera(46, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 0, 8.8);

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  powerPreference: 'high-performance'
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.35;

/* ==========================================================================
   2. ACTIVE THEORY LIGHTING RIG (Emerald Key, Wine Rim, Bioluminescent Point)
   ========================================================================== */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

// Key Emerald Directional Light
const greenKey = new THREE.DirectionalLight(0x00FF66, 4.0);
greenKey.position.set(5, 6, 6);
scene.add(greenKey);

// Deep Crimson Rim Light
const crimsonRim = new THREE.DirectionalLight(0xFF1E44, 3.5);
crimsonRim.position.set(-6, -4, 4);
scene.add(crimsonRim);

// Center Bioluminescent Spore Light
const sporeLight = new THREE.PointLight(0xa7f3d0, 2.5, 14);
sporeLight.position.set(0, 0, 3.5);
scene.add(sporeLight);

/* ==========================================================================
   3. CENTRAL ACTIVE THEORY HOLOGRAPHIC VERTEBRA COLUMN (Double Helix Strand)
   ========================================================================== */
const spineGroup = new THREE.Group();
scene.add(spineGroup);

// Iridescent Physical Glass Material
const glassMat = new THREE.MeshPhysicalMaterial({
  color: 0x064e3b,
  emissive: 0x022c22,
  roughness: 0.1,
  metalness: 0.2,
  transmission: 0.85,
  ior: 1.55,
  reflectivity: 0.95,
  clearcoat: 1.0,
  clearcoatRoughness: 0.08
});

// Segmented Vertebra Pods running down the core
const vertebraSegments = [];
const segmentCount = 11;

for (let i = 0; i < segmentCount; i++) {
  const segment = new THREE.Group();
  const yPos = (i - segmentCount / 2 + 0.5) * 0.65;

  // Center pod
  const podGeo = new THREE.TorusGeometry(0.55, 0.16, 16, 40);
  const podMesh = new THREE.Mesh(podGeo, glassMat);
  podMesh.rotation.x = Math.PI / 2;
  segment.add(podMesh);

  // Outer organic disc
  const discGeo = new THREE.RingGeometry(0.65, 0.9, 32);
  const discMat = new THREE.MeshBasicMaterial({
    color: 0x00FF66,
    wireframe: true,
    transparent: true,
    opacity: 0.25
  });
  const discMesh = new THREE.Mesh(discGeo, discMat);
  discMesh.rotation.x = Math.PI / 2;
  segment.add(discMesh);

  segment.position.y = yPos;
  spineGroup.add(segment);
  vertebraSegments.push(segment);
}

// Interlaced helical DNA backbone
const curve1 = new THREE.CatmullRomCurve3([
  new THREE.Vector3(-0.4, -4, -0.2),
  new THREE.Vector3(0.5, -2, 0.3),
  new THREE.Vector3(-0.5, 0, -0.3),
  new THREE.Vector3(0.5, 2, 0.3),
  new THREE.Vector3(-0.4, 4, -0.2)
]);
const tubeGeo1 = new THREE.TubeGeometry(curve1, 80, 0.06, 12, false);
const tubeMat1 = new THREE.MeshStandardMaterial({ color: 0x00FF66, roughness: 0.3, metalness: 0.8 });
const strand1 = new THREE.Mesh(tubeGeo1, tubeMat1);
spineGroup.add(strand1);

const curve2 = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0.4, -4, 0.2),
  new THREE.Vector3(-0.5, -2, -0.3),
  new THREE.Vector3(0.5, 0, 0.3),
  new THREE.Vector3(-0.5, 2, -0.3),
  new THREE.Vector3(0.4, 4, 0.2)
]);
const tubeGeo2 = new THREE.TubeGeometry(curve2, 80, 0.06, 12, false);
const tubeMat2 = new THREE.MeshStandardMaterial({ color: 0xFF1E44, roughness: 0.3, metalness: 0.8 });
const strand2 = new THREE.Mesh(tubeGeo2, tubeMat2);
spineGroup.add(strand2);

/* ==========================================================================
   4. VOLUMETRIC SANDSTORM & BIOLUMINESCENT SPORES (1,200 Particles)
   ========================================================================== */
const particleCount = 1200;
const particleGeo = new THREE.BufferGeometry();
const particlePos = new Float32Array(particleCount * 3);
const particleColors = new Float32Array(particleCount * 3);
const particleScales = new Float32Array(particleCount);

const colEmerald = new THREE.Color(0x00FF66);
const colMint = new THREE.Color(0x6ee7b7);
const colCrimson = new THREE.Color(0xFF1E44);
const colGold = new THREE.Color(0xfbbf24);

for (let i = 0; i < particleCount; i++) {
  const idx = i * 3;
  // Volumetric cylindrical distribution around the spine
  const radius = 0.5 + Math.pow(Math.random(), 1.5) * 6.5;
  const angle = Math.random() * Math.PI * 2;

  particlePos[idx] = Math.cos(angle) * radius;
  particlePos[idx + 1] = (Math.random() - 0.5) * 14;
  particlePos[idx + 2] = Math.sin(angle) * radius;

  // Particle color distribution
  const roll = Math.random();
  let c = colEmerald;
  if (roll < 0.25) c = colCrimson;
  else if (roll < 0.5) c = colMint;
  else if (roll < 0.65) c = colGold;

  particleColors[idx] = c.r;
  particleColors[idx + 1] = c.g;
  particleColors[idx + 2] = c.b;

  particleScales[i] = 0.03 + Math.random() * 0.06;
}

particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

const particleMat = new THREE.PointsMaterial({
  size: 0.05,
  vertexColors: true,
  transparent: true,
  opacity: 0.75,
  blending: THREE.AdditiveBlending
});
const dustParticles = new THREE.Points(particleGeo, particleMat);
scene.add(dustParticles);

/* ==========================================================================
   5. PROCEDURAL FLUID NEBULA TEXTURES FOR ACTIVE THEORY CARDS
   ========================================================================== */
function createActiveTheoryTexture(projectIndex, title, subtitle, metric, metricLabel, description) {
  const c = document.createElement('canvas');
  c.width = 1200;
  c.height = 760;
  const ctx = c.getContext('2d');

  // Base Obsidian Gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 1200, 760);
  bgGrad.addColorStop(0, '#040906');
  bgGrad.addColorStop(1, '#020403');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1200, 760);

  // Generative Fluid Nebula Clouds (Simulating Active Theory's project artwork)
  const colors = [
    ['rgba(0, 255, 102, 0.35)', 'rgba(255, 30, 68, 0.25)'],
    ['rgba(16, 185, 129, 0.35)', 'rgba(139, 92, 246, 0.25)'],
    ['rgba(255, 30, 68, 0.35)', 'rgba(245, 158, 11, 0.25)'],
    ['rgba(59, 130, 246, 0.35)', 'rgba(16, 185, 129, 0.25)'],
    ['rgba(236, 72, 153, 0.35)', 'rgba(0, 255, 102, 0.25)']
  ];
  const pair = colors[projectIndex % colors.length];

  for (let n = 0; n < 4; n++) {
    const nx = 400 + Math.sin(projectIndex + n) * 350;
    const ny = 380 + Math.cos(projectIndex + n * 2) * 200;
    const nRad = 260 + n * 60;

    const radGrad = ctx.createRadialGradient(nx, ny, 10, nx, ny, nRad);
    radGrad.addColorStop(0, n % 2 === 0 ? pair[0] : pair[1]);
    radGrad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = radGrad;
    ctx.fillRect(0, 0, 1200, 760);
  }

  // Scanline Grid Overlay
  ctx.fillStyle = 'rgba(0, 255, 102, 0.05)';
  for (let y = 0; y < 760; y += 14) {
    ctx.fillRect(0, y, 1200, 1.5);
  }

  // Active Theory Rounded Border with Frosted Accent
  ctx.strokeStyle = 'rgba(0, 255, 102, 0.45)';
  ctx.lineWidth = 5;
  ctx.strokeRect(14, 14, 1172, 732);

  // Header Title
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 48px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(title, 70, 115);

  // Subtitle
  ctx.fillStyle = '#94a3b8';
  ctx.font = '22px "JetBrains Mono", monospace';
  ctx.fillText(subtitle, 70, 165);

  // Big Stat Metric
  ctx.fillStyle = '#00FF66';
  ctx.font = 'bold 110px "JetBrains Mono", monospace';
  ctx.fillText(metric, 70, 330);

  // Metric Description
  ctx.fillStyle = '#e2e8f0';
  ctx.font = 'bold 26px "JetBrains Mono", monospace';
  ctx.fillText(metricLabel, 70, 385);

  // Summary Text
  ctx.fillStyle = '#94a3b8';
  ctx.font = '24px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(description, 70, 480);

  // Footer Tag
  ctx.fillStyle = '#FF1E44';
  ctx.font = 'bold 18px "JetBrains Mono", monospace';
  ctx.fillText('// ACTIVE THEORY SPATIAL PORTFOLIO PIPELINE', 70, 680);

  const texture = new THREE.CanvasTexture(c);
  texture.needsUpdate = true;
  return texture;
}

/* ==========================================================================
   6. SPATIAL CAROUSEL RIG & CARDS
   ========================================================================== */
const carouselGroup = new THREE.Group();
scene.add(carouselGroup);

const cardData = [
  {
    title: "HOTELKEY INDIA SAAS PLATFORM",
    subtitle: "Product Operations & Cloud Database Engineering",
    metric: "-40% LATENCY",
    metricLabel: "QUERY & CPU LOAD REDUCTION",
    description: "Tuned 50+ mission-critical queries via index analysis across 500+ properties."
  },
  {
    title: "PRODUCTION CLOUD MIGRATION",
    subtitle: "Oracle Data Pump Enterprise Pipeline",
    metric: "70,000+",
    metricLabel: "RECORDS MIGRATED WITH ZERO DATA LOSS",
    description: "Built custom pre- and post-validation scripts with 100% integrity."
  },
  {
    title: "TRANSACTIONAL ETL PIPELINES",
    subtitle: "MySQL & Oracle -> Downstream Analytics",
    metric: "45 MIN",
    metricLabel: "DATA PIPELINE LAG (DOWN FROM 4 HOURS)",
    description: "Improved data pipeline reliability by 30% for SaaS operations."
  },
  {
    title: "HOSPITAL MANAGEMENT 3NF ENGINE",
    subtitle: "Relational Architecture & Enterprise RBAC",
    metric: "25+ TABLES",
    metricLabel: "60% DATA REDUNDANCY ELIMINATION",
    description: "Engineered 20+ PL/SQL stored procedures & 5-tier role-based access control."
  },
  {
    title: "AWS CLOUD & CI/CD INFRASTRUCTURE",
    subtitle: "RDS, EC2 & Jenkins Release Automation",
    metric: "99.9%",
    metricLabel: "PRODUCTION PLATFORM UPTIME (12 MONTHS)",
    description: "Automated Bitbucket CI/CD pipelines enabling zero-downtime releases."
  }
];

const cards = [];
const cardGeometry = new THREE.PlaneGeometry(3.6, 2.28);
const radius = 4.4;

cardData.forEach((item, index) => {
  const texture = createActiveTheoryTexture(index, item.title, item.subtitle, item.metric, item.metricLabel, item.description);

  const cardMat = new THREE.MeshPhysicalMaterial({
    map: texture,
    transparent: true,
    opacity: 0.98,
    roughness: 0.1,
    metalness: 0.1,
    transmission: 0.25,
    clearcoat: 1.0,
    side: THREE.FrontSide
  });

  const mesh = new THREE.Mesh(cardGeometry, cardMat);
  mesh.userData = {
    index,
    baseAngle: (index / cardData.length) * Math.PI * 2
  };

  carouselGroup.add(mesh);
  cards.push(mesh);
});

/* ==========================================================================
   7. INTERACTIVE DRAG & NAVIGATION
   ========================================================================== */
let isDragging = false;
let pointerStartX = 0;
let carouselAngle = 0;
let targetAngle = 0;
let currentIndex = 0;

window.addEventListener('pointerdown', (e) => {
  isDragging = true;
  pointerStartX = e.clientX;
});

window.addEventListener('pointermove', (e) => {
  if (isDragging) {
    const delta = e.clientX - pointerStartX;
    targetAngle += delta * 0.0055;
    pointerStartX = e.clientX;
  }
});

window.addEventListener('pointerup', () => { isDragging = false; });
window.addEventListener('pointerleave', () => { isDragging = false; });

// Wheel / Trackpad scroll support
window.addEventListener('wheel', (e) => {
  targetAngle += e.deltaY * 0.0022;
});

// Update active states on sidebar menu
function updateActiveMenu(index) {
  currentIndex = index;
  document.querySelectorAll('.at-menu-item').forEach((item, i) => {
    item.classList.toggle('active', i === index);
  });
}

// Menu Clicks
cardData.forEach((_, i) => {
  document.querySelector(`#menu-item-${i}`)?.addEventListener('click', () => {
    targetAngle = - (i / cardData.length) * Math.PI * 2;
    updateActiveMenu(i);
  });
});

// Navigation Buttons
document.querySelector('#btn-next')?.addEventListener('click', () => {
  targetAngle -= (Math.PI * 2) / cardData.length;
});
document.querySelector('#btn-prev')?.addEventListener('click', () => {
  targetAngle += (Math.PI * 2) / cardData.length;
});

/* ==========================================================================
   8. REAL-TIME RENDER & ANIMATION LOOP
   ========================================================================== */
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const elapsedTime = clock.getElapsedTime();

  // Smooth carousel momentum lerp
  carouselAngle += (targetAngle - carouselAngle) * 0.075;

  // Position and depth-scale cards around the carousel
  cards.forEach((card) => {
    const angle = card.userData.baseAngle + carouselAngle;

    card.position.x = Math.sin(angle) * radius;
    card.position.z = Math.cos(angle) * radius - 0.5;

    // Direct front billboarding (Zero mirrored text)
    card.rotation.y = 0;

    // Depth scaling
    const depthFactor = (card.position.z + radius) / (radius * 2);
    card.scale.setScalar(0.72 + depthFactor * 0.38);
    card.material.opacity = 0.25 + depthFactor * 0.75;
  });

  // Vertebra continuous organic ripple wave
  vertebraSegments.forEach((seg, i) => {
    seg.rotation.y = Math.sin(elapsedTime * 1.4 + i * 0.35) * 0.45 + carouselAngle * 0.25;
    seg.position.x = Math.sin(elapsedTime * 0.9 + i * 0.3) * 0.14;
  });

  // DNA backbone helical twist
  strand1.rotation.y = elapsedTime * 0.3;
  strand2.rotation.y = -elapsedTime * 0.3;

  // Particle drift & spore swirl
  dustParticles.rotation.y = elapsedTime * 0.025;

  renderer.render(scene, camera);
}

animate();

/* ==========================================================================
   9. RESIZE LISTENER
   ========================================================================== */
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});