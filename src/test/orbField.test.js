import { vi } from 'vitest'
import { createOrbField, ORBS, PALETTES, SCROLL_SHIFT } from '../engine/orbField'

function fakeThree() {
  const renderer = { setPixelRatio: vi.fn(), setSize: vi.fn(), render: vi.fn(), dispose: vi.fn() }
  const camera = { position: { x: 0, y: 0, z: 0, set(x, y, z) { this.x = x; this.y = y; this.z = z } }, aspect: 1, lookAt: vi.fn(), updateProjectionMatrix: vi.fn() }
  const geometries = []
  const materials = []
  const groups = []
  function Geometry() { const g = { dispose: vi.fn() }; geometries.push(g); return g }
  const THREE = {
    WebGLRenderer: function () { return renderer },
    Scene: function () { return { add: vi.fn() } },
    PerspectiveCamera: function () { return camera },
    SphereGeometry: function () { return Object.assign(Geometry(), { kind: 'sphere' }) },
    PlaneGeometry: function () { return Object.assign(Geometry(), { kind: 'plane' }) },
    ShaderMaterial: function (opts) { const m = { dispose: vi.fn(), uniforms: opts.uniforms, fragmentShader: opts.fragmentShader }; materials.push(m); return m },
    Mesh: function (geometry, material) { this.geometry = geometry; this.material = material; this.position = { x: 0, y: 0, z: 0, set(x, y, z) { this.x = x; this.y = y; this.z = z } }; this.scale = { setScalar: vi.fn() }; this.rotation = { x: 0, y: 0 } },
    Group: function () { const g = { children: [], add(c) { this.children.push(c) }, position: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0 } }; groups.push(g); return g },
    Color: function (hex) { this.hex = hex },
    Vector2: function (x = 0, y = 0) { this.x = x; this.y = y; this.set = (a, b) => { this.x = a; this.y = b } },
    NormalBlending: 1,
  }
  return { THREE, renderer, camera, geometries, materials, groups }
}

const canvas = { width: 0, height: 0, clientWidth: 1200, clientHeight: 560 }
const still = { reduced: true, raf: () => 0, caf: () => {} }

test('four orbs with four shadows live in one group', () => {
  const { THREE, groups } = fakeThree()
  createOrbField(canvas, { THREE, ...still })
  const group = groups[0]
  const spheres = group.children.filter(c => c.geometry.kind === 'sphere')
  const planes = group.children.filter(c => c.geometry.kind === 'plane')
  expect(spheres).toHaveLength(4)
  expect(planes).toHaveLength(4)
})

test('each orb carries its palette as three colour uniforms, largest first', () => {
  const { THREE, groups } = fakeThree()
  createOrbField(canvas, { THREE, ...still })
  const spheres = groups[0].children.filter(c => c.geometry.kind === 'sphere')
  expect(ORBS.map(o => o.palette)).toEqual(['ember', 'lilac', 'mist', 'peach'])
  expect(ORBS.map(o => o.r)).toEqual([1, 0.8, 0.65, 0.5])
  spheres.forEach((s, i) => {
    const [a, b, c] = PALETTES[ORBS[i].palette]
    expect(s.material.uniforms.uA.value.hex).toBe(a)
    expect(s.material.uniforms.uB.value.hex).toBe(b)
    expect(s.material.uniforms.uC.value.hex).toBe(c)
  })
  expect(PALETTES.ember).toEqual(['#FF5A1F', '#FF9A5C', '#FFD9B8'])
  expect(PALETTES.peach).toEqual(['#FF9A5C', '#FFD9B8', '#FFF1E6'])
})

test('reduced motion renders once and never schedules a loop', () => {
  const { THREE, renderer } = fakeThree()
  const raf = vi.fn(() => 1)
  createOrbField(canvas, { THREE, reduced: true, raf, caf: () => {} })
  expect(renderer.render).toHaveBeenCalledTimes(1)
  expect(raf).not.toHaveBeenCalled()
})

test('pointer eases the group rotation toward the target over frames', () => {
  const { THREE, groups } = fakeThree()
  const frames = []
  const field = createOrbField(canvas, { THREE, reduced: false, raf: cb => (frames.push(cb), frames.length), caf: () => {} })
  field.setPointer(1, 0)
  frames.shift()(16)
  frames.shift()(32)
  const group = groups[0]
  expect(group.rotation.y).toBeGreaterThan(0)
  expect(group.rotation.y).toBeLessThanOrEqual(0.06)
})

test('scroll shifts the group down by SCROLL_SHIFT at full progress', () => {
  const { THREE, groups } = fakeThree()
  const field = createOrbField(canvas, { THREE, ...still })
  field.setScroll(1)
  expect(groups[0].position.y).toBeCloseTo(-SCROLL_SHIFT)
  field.setScroll(0)
  expect(groups[0].position.y).toBeCloseTo(0)
})

test('resize propagates to renderer and camera', () => {
  const { THREE, renderer, camera } = fakeThree()
  const field = createOrbField(canvas, { THREE, ...still })
  field.resize(800, 400)
  expect(renderer.setSize).toHaveBeenLastCalledWith(800, 400, false)
  expect(camera.aspect).toBeCloseTo(2)
  expect(camera.updateProjectionMatrix).toHaveBeenCalled()
})

test('dispose releases every geometry and material and cancels the loop', () => {
  const { THREE, renderer, geometries, materials } = fakeThree()
  const caf = vi.fn()
  const field = createOrbField(canvas, { THREE, reduced: false, raf: () => 7, caf })
  field.dispose()
  expect(caf).toHaveBeenCalledWith(7)
  expect(renderer.dispose).toHaveBeenCalledTimes(1)
  expect(geometries).toHaveLength(8)
  expect(materials).toHaveLength(8)
  for (const g of geometries) expect(g.dispose).toHaveBeenCalledTimes(1)
  for (const m of materials) expect(m.dispose).toHaveBeenCalledTimes(1)
})

test('fragment shader mixes the palette with noise, fresnel and grain', () => {
  const { THREE, materials } = fakeThree()
  createOrbField(canvas, { THREE, ...still })
  const sphere = materials[0].fragmentShader
  expect(sphere).toMatch(/snoise/)
  expect(sphere).toMatch(/fresnel/)
  expect(sphere).toMatch(/grain/)
})
