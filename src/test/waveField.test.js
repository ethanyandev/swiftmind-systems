import { vi } from 'vitest'
import { createWaveField } from '../engine/waveField'

function fakeThree() {
  const renderer = { setPixelRatio: vi.fn(), setSize: vi.fn(), render: vi.fn(), dispose: vi.fn() }
  const geometry = { setAttribute: vi.fn(), dispose: vi.fn() }
  const material = { dispose: vi.fn(), uniforms: null }
  const camera = { position: { x: 0, y: 0, z: 0, set(x, y, z) { this.x = x; this.y = y; this.z = z } }, aspect: 1, lookAt: vi.fn(), updateProjectionMatrix: vi.fn() }
  const THREE = {
    WebGLRenderer: function () { return renderer },
    Scene: function () { return { add: vi.fn() } },
    PerspectiveCamera: function () { return camera },
    BufferGeometry: function () { return geometry },
    BufferAttribute: function (arr, n) { this.arr = arr; this.n = n },
    ShaderMaterial: function (opts) { material.uniforms = opts.uniforms; return material },
    Points: function () { this.rotation = { x: 0 } },
    Vector2: function (x = 0, y = 0) { this.x = x; this.y = y; this.set = (a, b) => { this.x = a; this.y = b } },
    NormalBlending: 1,
  }
  return { THREE, renderer, geometry, material, camera }
}

const canvas = { width: 0, height: 0, clientWidth: 1200, clientHeight: 800 }

test('returns the control surface', () => {
  const { THREE } = fakeThree()
  const field = createWaveField(canvas, { THREE, reduced: true, raf: () => 0, caf: () => {} })
  for (const k of ['setPointer', 'setScroll', 'pause', 'resume', 'resize', 'dispose']) expect(typeof field[k]).toBe('function')
})

test('reduced motion renders exactly one frame and never schedules a loop', () => {
  const { THREE, renderer } = fakeThree()
  const raf = vi.fn(() => 1)
  createWaveField(canvas, { THREE, reduced: true, raf, caf: () => {} })
  expect(renderer.render).toHaveBeenCalledTimes(1)
  expect(raf).not.toHaveBeenCalled()
})

test('normal mode schedules the loop', () => {
  const { THREE } = fakeThree()
  const raf = vi.fn(() => 1)
  createWaveField(canvas, { THREE, reduced: false, raf, caf: () => {} })
  expect(raf).toHaveBeenCalled()
})

test('resize propagates to renderer and camera', () => {
  const { THREE, renderer, camera } = fakeThree()
  const field = createWaveField(canvas, { THREE, reduced: true, raf: () => 0, caf: () => {} })
  field.resize(800, 600)
  expect(renderer.setSize).toHaveBeenLastCalledWith(800, 600, false)
  expect(camera.aspect).toBeCloseTo(800 / 600)
  expect(camera.updateProjectionMatrix).toHaveBeenCalled()
})

test('scroll progress lifts the camera', () => {
  const { THREE, camera } = fakeThree()
  const field = createWaveField(canvas, { THREE, reduced: true, raf: () => 0, caf: () => {} })
  field.setScroll(1)
  expect(camera.position.y).toBe(420)
  field.setScroll(0)
  expect(camera.position.y).toBe(260)
})

test('dispose releases gpu resources and cancels the loop', () => {
  const { THREE, renderer, geometry, material } = fakeThree()
  const caf = vi.fn()
  const field = createWaveField(canvas, { THREE, reduced: false, raf: () => 7, caf })
  field.dispose()
  expect(caf).toHaveBeenCalledWith(7)
  expect(renderer.dispose).toHaveBeenCalledTimes(1)
  expect(geometry.dispose).toHaveBeenCalledTimes(1)
  expect(material.dispose).toHaveBeenCalledTimes(1)
})
