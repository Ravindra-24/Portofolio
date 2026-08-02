import { render } from '@testing-library/react'
import WebGLScene from './WebGLScene'
import * as THREE from 'three'

let mockReducedMotion = false
let mockCoarsePointer = false
const mockRenderer = {
  domElement: document.createElement('canvas'),
  setClearColor: jest.fn(),
  setPixelRatio: jest.fn(),
  setSize: jest.fn(),
  render: jest.fn(),
  dispose: jest.fn(),
  forceContextLoss: jest.fn(),
}
const mockParticlesGeometry = { setAttribute: jest.fn(), dispose: jest.fn() }
const mockParticlesMaterial = { dispose: jest.fn() }
const mockOrbGeometry = { dispose: jest.fn() }
const mockOrbMaterial = { dispose: jest.fn() }

jest.mock('../motion/ImmersiveMotionContext', () => ({
  useImmersiveMotion: () => ({
    reducedMotion: mockReducedMotion,
    coarsePointer: mockCoarsePointer,
  }),
}))
jest.mock('three', () => ({
  WebGLRenderer: jest.fn(() => mockRenderer),
  Scene: jest.fn(() => ({ add: jest.fn() })),
  PerspectiveCamera: jest.fn(() => ({ position: {}, updateProjectionMatrix: jest.fn() })),
  BufferGeometry: jest.fn(() => mockParticlesGeometry),
  BufferAttribute: jest.fn(),
  PointsMaterial: jest.fn(() => mockParticlesMaterial),
  Points: jest.fn(() => ({ rotation: { x: 0, y: 0 } })),
  IcosahedronGeometry: jest.fn(() => mockOrbGeometry),
  MeshBasicMaterial: jest.fn(() => mockOrbMaterial),
  Mesh: jest.fn(() => ({ rotation: {}, position: { set: jest.fn() } })),
}))

describe('immersive WebGL scene', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockReducedMotion = false
    mockCoarsePointer = false
    mockRenderer.domElement = document.createElement('canvas')
    THREE.WebGLRenderer.mockImplementation(() => mockRenderer)
    THREE.Scene.mockImplementation(() => ({ add: jest.fn() }))
    THREE.PerspectiveCamera.mockImplementation(() => ({
      position: {},
      updateProjectionMatrix: jest.fn(),
    }))
    THREE.BufferGeometry.mockImplementation(() => mockParticlesGeometry)
    THREE.PointsMaterial.mockImplementation(() => mockParticlesMaterial)
    THREE.Points.mockImplementation(() => ({ rotation: { x: 0, y: 0 } }))
    THREE.IcosahedronGeometry.mockImplementation(() => mockOrbGeometry)
    THREE.MeshBasicMaterial.mockImplementation(() => mockOrbMaterial)
    THREE.Mesh.mockImplementation(() => ({
      rotation: {},
      position: { set: jest.fn() },
    }))
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation(() => 1)
    jest.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {})
  })

  afterEach(() => {
    window.requestAnimationFrame.mockRestore()
    window.cancelAnimationFrame.mockRestore()
  })

  test('disposes renderer, geometry, and materials on unmount', () => {
    const { container, unmount } = render(<WebGLScene />)
    expect(THREE.WebGLRenderer).toHaveBeenCalledTimes(1)
    expect(container.querySelector('canvas')).toBeInTheDocument()

    unmount()
    expect(mockParticlesGeometry.dispose).toHaveBeenCalledTimes(1)
    expect(mockParticlesMaterial.dispose).toHaveBeenCalledTimes(1)
    expect(mockOrbGeometry.dispose).toHaveBeenCalledTimes(1)
    expect(mockOrbMaterial.dispose).toHaveBeenCalledTimes(1)
    expect(mockRenderer.dispose).toHaveBeenCalledTimes(1)
    expect(mockRenderer.forceContextLoss).toHaveBeenCalledTimes(1)
  })

  test('skips WebGL entirely for reduced motion', () => {
    mockReducedMotion = true
    const { container } = render(<WebGLScene />)
    expect(THREE.WebGLRenderer).not.toHaveBeenCalled()
    expect(container.querySelector('canvas')).not.toBeInTheDocument()
  })

  test('uses static artwork instead of WebGL on coarse pointers', () => {
    mockCoarsePointer = true
    const { container } = render(<WebGLScene />)
    expect(THREE.WebGLRenderer).not.toHaveBeenCalled()
    expect(container.querySelector('canvas')).not.toBeInTheDocument()
  })
})
