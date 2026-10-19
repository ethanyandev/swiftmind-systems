// Gradient orb stage. Pure module: THREE is injected so tests can pass a fake.
// Contract: createOrbField(canvas, { THREE, dpr, reduced, raf, caf })
//   → { setPointer(nx, ny), setScroll(p), pause(), resume(), resize(w, h), dispose() }

export const PALETTES = {
  ember: ['#FF5A1F', '#FF9A5C', '#FFD9B8'],
  lilac: ['#7B6CFF', '#C9A7FF', '#FFC2E8'],
  mist: ['#C9D1CC', '#E6EBE7', '#F7F9F7'],
  peach: ['#FF9A5C', '#FFD9B8', '#FFF1E6'],
}

// r is relative to the largest orb; x/y are fractions of the visible half-width / half-height.
export const ORBS = [
  { r: 1, x: 0.55, y: 0, z: 0, palette: 'ember', period: 8.5, phase: 0.0 },
  { r: 0.8, x: -0.45, y: 0.05, z: -0.3, palette: 'lilac', period: 7.2, phase: 1.9 },
  { r: 0.65, x: -0.1, y: -0.12, z: 0.3, palette: 'mist', period: 6.4, phase: 3.7 },
  { r: 0.5, x: 0.15, y: 0.28, z: 0.6, palette: 'peach', period: 9.0, phase: 5.1 },
]

export const SCROLL_SHIFT = 0.6
const BASE_RADIUS = 1.12
const CAMERA_Z = 7
const FOV = 35
const POINTER_ROT = 0.06
const POINTER_EASE = 0.06
const SEGMENTS = 64
const REF_ASPECT = 1200 / 560

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

const ORB_VERTEX = /* glsl */ `
varying vec3 vNormal;
varying vec3 vView;
varying vec3 vPos;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vNormal = normalize(normalMatrix * normal);
  vView = normalize(-mv.xyz);
  vPos = position;
  gl_Position = projectionMatrix * mv;
}
`

const ORB_FRAGMENT = /* glsl */ `
uniform vec3 uA;
uniform vec3 uB;
uniform vec3 uC;
uniform float uTime;
uniform float uSeed;
varying vec3 vNormal;
varying vec3 vView;
varying vec3 vPos;
${SIMPLEX}
float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
void main() {
  // Low-frequency drift so each orb reads as one soft gradient, not a planet texture.
  float n1 = snoise(vPos.xy * 0.55 + uSeed + uTime * 0.06) * 0.5 + 0.5;
  float n2 = snoise(vPos.yz * 0.8 - uSeed - uTime * 0.04) * 0.5 + 0.5;
  float t = smoothstep(0.0, 1.0, mix(n1, n2, 0.4));
  // Bias toward the lighter stops: the darkest colour only appears in pockets.
  t = mix(t, 0.72, 0.35);
  vec3 col = t < 0.5 ? mix(uA, uB, t * 2.0) : mix(uB, uC, (t - 0.5) * 2.0);
  float light = 0.86 + 0.14 * max(dot(vNormal, normalize(vec3(-0.35, 0.6, 1.0))), 0.0);
  col *= light;
  float fresnel = pow(1.0 - max(dot(vNormal, vView), 0.0), 1.8);
  col = mix(col, uC, fresnel * 0.9);
  float grain = (hash(gl_FragCoord.xy + fract(uTime)) - 0.5) * 0.06;
  col += grain;
  gl_FragColor = vec4(col, 1.0);
}
`

const SHADOW_VERTEX = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const SHADOW_FRAGMENT = /* glsl */ `
uniform float uAlpha;
varying vec2 vUv;
void main() {
  float d = length((vUv - 0.5) * 2.0);
  float a = smoothstep(1.0, 0.15, d) * uAlpha;
  gl_FragColor = vec4(vec3(0.067, 0.067, 0.063), a);
}
`

function visibleHalfExtent(aspect) {
  const halfH = Math.tan((FOV * Math.PI) / 360) * CAMERA_Z
  return { halfW: halfH * aspect, halfH }
}

export function createOrbField(canvas, opts) {
  const {
    THREE,
    reduced = false,
    dpr = Math.min(typeof devicePixelRatio === 'number' ? devicePixelRatio : 1, 1.5),
    raf = cb => requestAnimationFrame(cb),
    caf = id => cancelAnimationFrame(id),
  } = opts

  const width = canvas.clientWidth || 1
  const height = canvas.clientHeight || 1

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' })
  renderer.setPixelRatio(dpr)
  renderer.setSize(width, height, false)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(FOV, width / height, 0.1, 100)
  camera.position.set(0, 0, CAMERA_Z)
  camera.lookAt(0, 0, 0)

  const group = new THREE.Group()
  scene.add(group)

  const geometries = []
  const materials = []
  const orbs = ORBS.map((spec, i) => {
    const [a, b, c] = PALETTES[spec.palette]
    const geometry = new THREE.SphereGeometry(1, SEGMENTS, SEGMENTS)
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uA: { value: new THREE.Color(a) },
        uB: { value: new THREE.Color(b) },
        uC: { value: new THREE.Color(c) },
        uTime: { value: 0 },
        uSeed: { value: i * 17.3 },
      },
      vertexShader: ORB_VERTEX,
      fragmentShader: ORB_FRAGMENT,
    })
    const mesh = new THREE.Mesh(geometry, material)
    const radius = spec.r * BASE_RADIUS
    mesh.scale.setScalar(radius)
    group.add(mesh)

    const shadowGeometry = new THREE.PlaneGeometry(1, 1)
    const shadowMaterial = new THREE.ShaderMaterial({
      uniforms: { uAlpha: { value: 0.18 } },
      vertexShader: SHADOW_VERTEX,
      fragmentShader: SHADOW_FRAGMENT,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
    })
    const shadow = new THREE.Mesh(shadowGeometry, shadowMaterial)
    shadow.scale.set?.(radius * 2.6, radius * 0.9, 1)
    group.add(shadow)

    geometries.push(geometry, shadowGeometry)
    materials.push(material, shadowMaterial)
    return { spec, mesh, shadow, radius, base: { x: 0, y: 0, z: spec.z } }
  })

  // Narrower stages (tablet) shrink the orbs so they keep their spacing instead of overlapping.
  const layout = () => {
    const { halfW, halfH } = visibleHalfExtent(camera.aspect)
    const fit = Math.min(1, Math.max(0.6, camera.aspect / REF_ASPECT))
    for (const o of orbs) {
      o.radius = o.spec.r * BASE_RADIUS * fit
      o.mesh.scale.setScalar(o.radius)
      o.shadow.scale.set?.(o.radius * 2.6, o.radius * 0.9, 1)
      o.base.x = o.spec.x * halfW
      o.base.y = o.spec.y * halfH
      o.mesh.position.set(o.base.x, o.base.y, o.base.z)
      o.shadow.position.set(o.base.x, o.base.y - o.radius * 1.12, o.base.z - 0.05)
    }
  }
  layout()

  const targetRot = { x: 0, y: 0 }
  let scroll = 0
  let rafId = 0
  let running = false
  let disposed = false
  let last = 0
  let elapsed = 0

  const render = () => renderer.render(scene, camera)

  const tick = dt => {
    elapsed += dt
    group.rotation.y += (targetRot.y - group.rotation.y) * POINTER_EASE
    group.rotation.x += (targetRot.x - group.rotation.x) * POINTER_EASE
    for (const o of orbs) {
      const bob = Math.sin((elapsed * 2 * Math.PI) / o.spec.period + o.spec.phase) * o.radius * 0.12
      o.mesh.position.set(o.base.x, o.base.y + bob, o.base.z)
      o.mesh.material.uniforms.uTime.value = elapsed
      o.shadow.material.uniforms.uAlpha.value = 0.18 - bob * 0.25
    }
  }

  const frame = now => {
    if (disposed || !running) return
    const dt = last ? Math.min((now - last) / 1000, 0.05) : 0
    last = now
    tick(dt)
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
    tick(0)
    render()
  } else {
    start()
  }

  return {
    setPointer(nx, ny) {
      targetRot.y = nx * POINTER_ROT
      targetRot.x = -ny * POINTER_ROT * 0.6
    },
    setScroll(p) {
      scroll = Math.min(Math.max(p, 0), 1)
      group.position.y = -scroll * SCROLL_SHIFT
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
      layout()
      if (reduced) render()
    },
    dispose() {
      disposed = true
      running = false
      if (rafId) caf(rafId)
      rafId = 0
      for (const g of geometries) g.dispose()
      for (const m of materials) m.dispose()
      renderer.dispose()
    },
  }
}
