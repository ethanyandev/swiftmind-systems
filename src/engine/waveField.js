// Particle wave surface. Pure module: THREE is injected so tests can pass a fake.
// Contract: createWaveField(canvas, { THREE, dpr, reduced, raf, caf })
//   → { setPointer(nx, ny), setScroll(p), pause(), resume(), resize(w, h), dispose() }

const GRID = 200
const PLANE_W = 1600
const PLANE_H = 1000
const CAMERA_Y = 260
const CAMERA_Z = 900
const LOOK_AT = [0, 0, -200]
const SCROLL_LIFT = 160
const POINTER_EASE = 0.08

const SIMPLEX = /* glsl */ `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m; m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}
`

const VERTEX = /* glsl */ `
uniform float uTime;
uniform vec2 uPointer;
uniform float uDpr;
varying float vAlpha;
${SIMPLEX}
void main() {
  vec3 p = position;
  float h = snoise(p.xy * 0.0022 + uTime * 0.08) * 90.0 + snoise(p.xy * 0.008 - uTime * 0.12) * 24.0;
  vec2 d = p.xy - uPointer;
  h += 60.0 * exp(-dot(d, d) / (220.0 * 220.0));
  p.z = h;
  float k = clamp((h + 90.0) / 200.0, 0.0, 1.0);
  vAlpha = 0.22 + 0.58 * k;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_PointSize = uDpr * (2.0 + 3.0 * k) * (700.0 / -mv.z);
  gl_Position = projectionMatrix * mv;
}
`

const FRAGMENT = /* glsl */ `
varying float vAlpha;
void main() {
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  gl_FragColor = vec4(vec3(0.08), vAlpha * (1.0 - d * 2.0));
}
`

function buildPositions() {
  const pos = new Float32Array(GRID * GRID * 3)
  let i = 0
  for (let y = 0; y < GRID; y++) {
    for (let x = 0; x < GRID; x++) {
      pos[i++] = (x / (GRID - 1) - 0.5) * PLANE_W
      pos[i++] = (y / (GRID - 1) - 0.5) * PLANE_H
      pos[i++] = 0
    }
  }
  return pos
}

export function createWaveField(canvas, opts) {
  const {
    THREE,
    reduced = false,
    dpr = Math.min(typeof devicePixelRatio === 'number' ? devicePixelRatio : 1, 1.5),
    raf = cb => requestAnimationFrame(cb),
    caf = id => cancelAnimationFrame(id),
  } = opts

  const width = canvas.clientWidth || 1
  const height = canvas.clientHeight || 1

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: 'high-performance' })
  renderer.setPixelRatio(dpr)
  renderer.setSize(width, height, false)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(45, width / height, 1, 4000)
  camera.position.set(0, CAMERA_Y, CAMERA_Z)
  camera.lookAt(...LOOK_AT)

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(buildPositions(), 3))
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uDpr: { value: dpr },
    },
    vertexShader: VERTEX,
    fragmentShader: FRAGMENT,
    transparent: true,
    depthWrite: false,
    blending: THREE.NormalBlending,
  })
  const points = new THREE.Points(geometry, material)
  // Lay the grid flat: plane +y becomes world -z (away from the camera), so heights rise along world +y.
  points.rotation.x = -Math.PI / 2
  scene.add(points)

  const target = { x: 0, y: 0 }
  const pointer = { x: 0, y: 0 }
  let scroll = 0
  let rafId = 0
  let running = false
  let disposed = false
  let last = 0
  let elapsed = 0

  const render = () => renderer.render(scene, camera)

  const frame = now => {
    if (disposed || !running) return
    const dt = last ? Math.min((now - last) / 1000, 0.05) : 0
    last = now
    elapsed += dt * (1 + scroll)
    pointer.x += (target.x - pointer.x) * POINTER_EASE
    pointer.y += (target.y - pointer.y) * POINTER_EASE
    material.uniforms.uTime.value = elapsed
    material.uniforms.uPointer.value.set(pointer.x, pointer.y)
    render()
    rafId = raf(frame)
  }

  const start = () => {
    if (running || disposed) return
    running = true
    last = 0
    rafId = raf(frame)
  }

  if (reduced) {
    render()
  } else {
    start()
  }

  return {
    setPointer(nx, ny) {
      target.x = nx * (PLANE_W / 2)
      target.y = -ny * (PLANE_H / 2)
    },
    setScroll(p) {
      scroll = Math.min(Math.max(p, 0), 1)
      camera.position.y = CAMERA_Y + scroll * SCROLL_LIFT
      camera.lookAt(...LOOK_AT)
      if (reduced) render()
    },
    pause() {
      running = false
      if (rafId) caf(rafId)
      rafId = 0
    },
    resume() {
      if (!reduced) start()
    },
    resize(w, h) {
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      if (reduced) render()
    },
    dispose() {
      disposed = true
      running = false
      if (rafId) caf(rafId)
      rafId = 0
      geometry.dispose()
      material.dispose()
      renderer.dispose()
    },
  }
}
