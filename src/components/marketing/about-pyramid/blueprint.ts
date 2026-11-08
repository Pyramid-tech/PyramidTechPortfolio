import {
  AdditiveBlending,
  AmbientLight,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  ColorManagement,
  DirectionalLight,
  Float32BufferAttribute,
  Fog,
  Group,
  Line,
  LineBasicMaterial,
  LineDashedMaterial,
  LineLoop,
  LineSegments,
  LinearSRGBColorSpace,
  Material,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  NormalBlending,
  PerspectiveCamera,
  Plane,
  PlaneGeometry,
  Points,
  PointsMaterial,
  Scene,
  Vector3,
  WebGLRenderer,
} from 'three';

interface Options {
  onPhase?: (phase: number) => void;
}

const LOOP = 12;
const STILL_FRAME = 6.5;
const HALF = 0.95;
const BASE_Y = -0.55;
const APEX_Y = 0.75;

const smooth = (from: number, to: number, x: number) => {
  const k = Math.min(1, Math.max(0, (x - from) / (to - from)));
  return k * k * (3 - 2 * k);
};

const channel = (styles: CSSStyleDeclaration, name: string, fallback: string) => {
  const parts = styles.getPropertyValue(name).trim().split(/\s+/).map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) return new Color(fallback);
  return new Color(parts[0] / 255, parts[1] / 255, parts[2] / 255);
};

const readPalette = () => {
  const root = document.documentElement;
  const styles = getComputedStyle(root);
  const light = root.dataset.theme === 'light';
  return {
    light,
    surface: channel(styles, '--c-bg-2', '#211f26'),
    grid: channel(styles, '--c-stroke', '#444e60'),
    line: channel(styles, '--c-primary', '#c4d8f5'),
    accent: channel(styles, '--c-accent', '#6f9bff'),
    guide: channel(styles, '--c-text-3', '#93a2b8'),
    node: channel(styles, '--c-text-1', '#e2e8f0'),
    face: new Color(light ? '#8fa9df' : '#2d2d5d'),
    emissive: new Color(light ? '#000000' : '#101024'),
    ambient: light ? 0.6 : 0.3,
    key: light ? 1.0 : 1.6,
    rim: light ? 1.2 : 1.9,
    gridOpacity: light ? 0.9 : 0.55,
    glowOpacity: light ? 0.16 : 0.3,
  };
};

const radialTexture = () => {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext('2d');
  if (context) {
    const gradient = context.createRadialGradient(
      size / 2,
      size / 2,
      0,
      size / 2,
      size / 2,
      size / 2,
    );
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, size, size);
  }
  return new CanvasTexture(canvas);
};

export default function mountBlueprint(canvas: HTMLCanvasElement, { onPhase }: Options = {}) {
  const host = canvas.parentElement ?? canvas;
  ColorManagement.enabled = false;

  const renderer = new WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  });
  renderer.outputColorSpace = LinearSRGBColorSpace;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.localClippingEnabled = true;

  const scene = new Scene();
  const fog = new Fog(0x211f26, 4.4, 8.8);
  scene.fog = fog;
  const camera = new PerspectiveCamera(35, 1.25, 0.1, 50);

  const apex = new Vector3(0, APEX_Y, 0);
  const base = [
    new Vector3(-HALF, BASE_Y, -HALF),
    new Vector3(HALF, BASE_Y, -HALF),
    new Vector3(HALF, BASE_Y, HALF),
    new Vector3(-HALF, BASE_Y, HALF),
  ];
  const corners = [apex, ...base];

  const gridPoints: number[] = [];
  const gridRadius = 3.2;
  for (let i = -10; i <= 10; i++) {
    const v = i * 0.32;
    gridPoints.push(
      -gridRadius,
      BASE_Y,
      v,
      gridRadius,
      BASE_Y,
      v,
      v,
      BASE_Y,
      -gridRadius,
      v,
      BASE_Y,
      gridRadius,
    );
  }
  const gridGeometry = new BufferGeometry();
  gridGeometry.setAttribute('position', new Float32BufferAttribute(gridPoints, 3));
  const gridMaterial = new LineBasicMaterial({ transparent: true, opacity: 0 });
  scene.add(new LineSegments(gridGeometry, gridMaterial));

  const rig = new Group();
  scene.add(rig);

  const edgeMaterial = new LineBasicMaterial({ transparent: true, opacity: 0.95 });
  const edges = (
    [
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 1],
      [1, 0],
      [2, 0],
      [3, 0],
      [4, 0],
    ] as const
  ).map(([from, to]) => {
    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new BufferAttribute(new Float32Array(6), 3));
    const line = new Line(geometry, edgeMaterial);
    line.frustumCulled = false;
    rig.add(line);
    return { from: corners[from], to: corners[to], geometry, line };
  });
  const drawEdge = (edge: (typeof edges)[number], progress: number) => {
    const attribute = edge.geometry.getAttribute('position') as BufferAttribute;
    const { from, to } = edge;
    attribute.setXYZ(0, from.x, from.y, from.z);
    attribute.setXYZ(
      1,
      from.x + (to.x - from.x) * progress,
      from.y + (to.y - from.y) * progress,
      from.z + (to.z - from.z) * progress,
    );
    attribute.needsUpdate = true;
    edge.line.visible = progress > 0.002;
  };

  const baseNodeMaterial = new PointsMaterial({
    size: 5,
    sizeAttenuation: false,
    transparent: true,
    opacity: 0,
  });
  const apexNodeMaterial = baseNodeMaterial.clone();
  rig.add(new Points(new BufferGeometry().setFromPoints(base), baseNodeMaterial));
  rig.add(new Points(new BufferGeometry().setFromPoints([apex]), apexNodeMaterial));

  const guideMaterial = new LineDashedMaterial({
    dashSize: 0.05,
    gapSize: 0.04,
    transparent: true,
    opacity: 0,
  });
  const guides = new LineSegments(
    new BufferGeometry().setFromPoints([
      base[0],
      base[2],
      base[1],
      base[3],
      new Vector3(0, BASE_Y, 0),
      apex,
    ]),
    guideMaterial,
  );
  guides.computeLineDistances();
  rig.add(guides);

  const triangles: number[] = [];
  const push = (point: Vector3) => triangles.push(point.x, point.y, point.z);
  for (let i = 0; i < 4; i++) {
    push(base[(i + 1) % 4]);
    push(base[i]);
    push(apex);
  }
  [base[0], base[1], base[2], base[0], base[2], base[3]].forEach(push);
  const faceGeometry = new BufferGeometry();
  faceGeometry.setAttribute('position', new Float32BufferAttribute(triangles, 3));
  faceGeometry.computeVertexNormals();
  const cut = new Plane(new Vector3(0, -1, 0), BASE_Y - 0.01);
  const faceMaterial = new MeshLambertMaterial({
    flatShading: true,
    clippingPlanes: [cut],
    polygonOffset: true,
    polygonOffsetFactor: 1,
    polygonOffsetUnits: 1,
  });
  const faces = new Mesh(faceGeometry, faceMaterial);
  rig.add(faces);

  const scanMaterial = new LineBasicMaterial({ transparent: true, opacity: 0 });
  const scan = new LineLoop(
    new BufferGeometry().setFromPoints([
      new Vector3(-1, 0, -1),
      new Vector3(1, 0, -1),
      new Vector3(1, 0, 1),
      new Vector3(-1, 0, 1),
    ]),
    scanMaterial,
  );
  rig.add(scan);

  const glowTexture = radialTexture();
  const glowMaterial = new MeshBasicMaterial({
    map: glowTexture,
    transparent: true,
    opacity: 0,
    depthWrite: false,
  });
  const glow = new Mesh(new PlaneGeometry(3.6, 3.6), glowMaterial);
  glow.rotation.x = -Math.PI / 2;
  glow.position.y = BASE_Y - 0.003;
  scene.add(glow);

  const ambient = new AmbientLight();
  const key = new DirectionalLight();
  key.position.set(-2.2, 3.2, 2.6);
  const rim = new DirectionalLight();
  rim.position.set(2.6, 0.8, -2.4);
  scene.add(ambient, key, rim);

  const lineColor = new Color();
  const accentColor = new Color();
  let palette = readPalette();
  const applyPalette = () => {
    palette = readPalette();
    fog.color.copy(palette.surface);
    gridMaterial.color.copy(palette.grid);
    guideMaterial.color.copy(palette.guide);
    baseNodeMaterial.color.copy(palette.node);
    apexNodeMaterial.color.copy(palette.node);
    faceMaterial.color.copy(palette.face);
    faceMaterial.emissive.copy(palette.emissive);
    scanMaterial.color.copy(palette.accent);
    glowMaterial.color.copy(palette.accent);
    glowMaterial.blending = palette.light ? NormalBlending : AdditiveBlending;
    glowMaterial.needsUpdate = true;
    ambient.color.copy(palette.guide);
    ambient.intensity = palette.ambient * Math.PI;
    key.color.copy(palette.node);
    key.intensity = palette.key * Math.PI;
    rim.color.copy(palette.accent);
    rim.intensity = palette.rim * Math.PI;
    lineColor.copy(palette.line);
    accentColor.copy(palette.accent);
  };
  applyPalette();

  const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
  let lastPhase = -1;

  const update = (t: number) => {
    const u = t % LOOP;
    gridMaterial.opacity = palette.gridOpacity * smooth(0, 0.8, u) * (1 - smooth(11.2, 12, u));

    edges.forEach((edge, i) => {
      const start = i < 4 ? 0.5 + i * 0.28 : 1.75 + (i - 4) * 0.16;
      const duration = i < 4 ? 0.5 : 0.75;
      const retract = (7 - i) * 0.06;
      drawEdge(
        edge,
        smooth(start, start + duration, u) * (1 - smooth(10.7 + retract, 11.3 + retract, u)),
      );
    });

    guideMaterial.opacity = 0.65 * smooth(0.3, 1.0, u) * (1 - smooth(3.6, 4.6, u));
    baseNodeMaterial.opacity = smooth(0.45, 0.8, u) * (1 - smooth(10.9, 11.5, u));
    apexNodeMaterial.opacity = smooth(2.3, 2.7, u) * (1 - smooth(10.7, 11.2, u));

    const built = Math.max(0, Math.min(1, smooth(3.0, 4.6, u) - smooth(9.4, 10.6, u)));
    const height = BASE_Y - 0.01 + (APEX_Y - BASE_Y + 0.02) * built;
    cut.constant = height;
    faces.visible = built > 0.001;
    scan.position.y = Math.min(height, APEX_Y);
    const scanHalf =
      Math.max(0.0001, (HALF * (APEX_Y - scan.position.y)) / (APEX_Y - BASE_Y)) + 0.006;
    scan.scale.set(scanHalf, 1, scanHalf);
    scanMaterial.opacity = 0.95 * Math.min(1, Math.min(built, 1 - built) * 14);
    edgeMaterial.color.copy(lineColor).lerp(accentColor, built);
    glowMaterial.opacity = palette.glowOpacity * built;

    rig.rotation.y = 0.65 + t * 0.22 + pointer.x * 0.45;
    camera.position.set(0, 1.15 + pointer.y * 0.45, 4.6);
    camera.lookAt(0, 0.05, 0);

    const phase = u < 3.0 ? 0 : u < 4.6 ? 1 : u < 9.4 ? 2 : u < 10.6 ? 1 : 0;
    if (phase !== lastPhase) {
      lastPhase = phase;
      onPhase?.(phase);
    }
  };

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const renderStill = () => {
    update(STILL_FRAME);
    renderer.render(scene, camera);
  };

  const fit = () => {
    const width = Math.max(1, host.clientWidth);
    const height = Math.max(1, host.clientHeight);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    if (reducedMotion) renderStill();
  };
  fit();
  const resizeObserver = new ResizeObserver(fit);
  resizeObserver.observe(host);

  const themeObserver = new MutationObserver(() => {
    applyPalette();
    if (reducedMotion) renderStill();
  });
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });

  const onPointerMove = (event: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    pointer.targetX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.targetY = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
  };
  const onPointerLeave = () => {
    pointer.targetX = 0;
    pointer.targetY = 0;
  };

  let frame = 0;
  let elapsed = 0;
  let last = 0;
  const loop = (now: number) => {
    frame = requestAnimationFrame(loop);
    const dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
    last = now;
    elapsed += dt;
    const ease = Math.min(1, dt * 4);
    pointer.x += (pointer.targetX - pointer.x) * ease;
    pointer.y += (pointer.targetY - pointer.y) * ease;
    update(elapsed);
    renderer.render(scene, camera);
  };
  const start = () => {
    if (frame) return;
    last = 0;
    frame = requestAnimationFrame(loop);
  };
  const stop = () => {
    cancelAnimationFrame(frame);
    frame = 0;
  };

  let visibilityObserver: IntersectionObserver | undefined;
  if (reducedMotion) {
    renderStill();
  } else {
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerleave', onPointerLeave);
    visibilityObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) start();
      else stop();
    });
    visibilityObserver.observe(host);
  }

  return () => {
    stop();
    visibilityObserver?.disconnect();
    resizeObserver.disconnect();
    themeObserver.disconnect();
    canvas.removeEventListener('pointermove', onPointerMove);
    canvas.removeEventListener('pointerleave', onPointerLeave);
    scene.traverse((object) => {
      if (object instanceof Mesh || object instanceof Line || object instanceof Points) {
        object.geometry.dispose();
        const materials: Material[] = Array.isArray(object.material)
          ? object.material
          : [object.material];
        materials.forEach((material) => material.dispose());
      }
    });
    glowTexture.dispose();
    renderer.dispose();
  };
}
