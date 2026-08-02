import { render } from '@testing-library/react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ImmersiveMotionProvider } from './ImmersiveMotionContext'

const mockLenisInstance = {
  on: jest.fn(),
  off: jest.fn(),
  raf: jest.fn(),
  destroy: jest.fn(),
}

jest.mock('lenis', () => jest.fn(() => mockLenisInstance))
jest.mock('gsap', () => ({
  gsap: {
    registerPlugin: jest.fn(),
    ticker: {
      add: jest.fn(),
      remove: jest.fn(),
      lagSmoothing: jest.fn(),
    },
    timeline: jest.fn(),
  },
}))
jest.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: {
    update: jest.fn(),
    getAll: jest.fn(() => [{ kill: jest.fn() }]),
  },
}))

describe('immersive animation lifecycle', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    Lenis.mockImplementation(() => mockLenisInstance)
    ScrollTrigger.getAll.mockImplementation(() => [{ kill: jest.fn() }])
    Object.defineProperty(navigator, 'connection', {
      configurable: true,
      value: undefined,
    })
    window.matchMedia = jest.fn(() => ({
      matches: false,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }))
  })

  test('initializes Lenis on the GSAP ticker and destroys it on unmount', () => {
    const { unmount } = render(
      <ImmersiveMotionProvider><div>Content</div></ImmersiveMotionProvider>
    )
    expect(Lenis).toHaveBeenCalledTimes(1)
    expect(mockLenisInstance.on).toHaveBeenCalledWith('scroll', expect.any(Function))
    mockLenisInstance.on.mock.calls[0][1]()
    expect(ScrollTrigger.update).toHaveBeenCalledTimes(1)
    expect(gsap.ticker.add).toHaveBeenCalledTimes(1)

    unmount()
    expect(mockLenisInstance.destroy).toHaveBeenCalledTimes(1)
    expect(gsap.ticker.remove).toHaveBeenCalledTimes(1)
    expect(ScrollTrigger.getAll).toHaveBeenCalledTimes(1)
  })

  test('does not initialize smooth scrolling for reduced motion', () => {
    window.matchMedia = jest.fn(() => ({
      matches: true,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }))
    render(<ImmersiveMotionProvider><div>Content</div></ImmersiveMotionProvider>)
    expect(Lenis).not.toHaveBeenCalled()
  })

  test('uses native scrolling for coarse pointers', () => {
    window.matchMedia = jest.fn((query) => ({
      matches: query === '(pointer: coarse)',
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }))
    render(<ImmersiveMotionProvider><div>Content</div></ImmersiveMotionProvider>)
    expect(Lenis).not.toHaveBeenCalled()
  })

  test('uses native scrolling when save-data is enabled', () => {
    Object.defineProperty(navigator, 'connection', {
      configurable: true,
      value: {
        saveData: true,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      },
    })
    render(<ImmersiveMotionProvider><div>Content</div></ImmersiveMotionProvider>)
    expect(Lenis).not.toHaveBeenCalled()
  })
})
