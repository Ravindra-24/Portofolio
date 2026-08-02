import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const MotionContext = createContext(null)

const prefersReducedEffects = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
  Boolean(navigator.connection?.saveData)

const usesCoarsePointer = () => window.matchMedia('(pointer: coarse)').matches

export const ImmersiveMotionProvider = ({ children }) => {
  const [lenis, setLenis] = useState(null)
  const [reducedMotion, setReducedMotion] = useState(prefersReducedEffects)
  const [coarsePointer, setCoarsePointer] = useState(usesCoarsePointer)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const overlayRef = useRef(null)

  useEffect(() => {
    const reducedMedia = window.matchMedia('(prefers-reduced-motion: reduce)')
    const coarseMedia = window.matchMedia('(pointer: coarse)')
    const connection = navigator.connection
    const handleChange = () => {
      setReducedMotion(prefersReducedEffects())
      setCoarsePointer(usesCoarsePointer())
    }

    if (reducedMedia.addEventListener) {
      reducedMedia.addEventListener('change', handleChange)
      coarseMedia.addEventListener('change', handleChange)
      connection?.addEventListener?.('change', handleChange)
    } else {
      reducedMedia.addListener(handleChange)
      coarseMedia.addListener(handleChange)
      connection?.addListener?.(handleChange)
    }
    return () => {
      if (reducedMedia.removeEventListener) {
        reducedMedia.removeEventListener('change', handleChange)
        coarseMedia.removeEventListener('change', handleChange)
        connection?.removeEventListener?.('change', handleChange)
      } else {
        reducedMedia.removeListener(handleChange)
        coarseMedia.removeListener(handleChange)
        connection?.removeListener?.(handleChange)
      }
    }
  }, [])

  useEffect(() => {
    if (reducedMotion || coarsePointer) {
      setLenis(null)
      return undefined
    }

    const instance = new Lenis({
      lerp: 0.085,
      smoothWheel: true,
      syncTouch: false,
      stopInertiaOnNavigate: true,
    })
    const update = (time) => instance.raf(time * 1000)
    const updateScrollTrigger = () => ScrollTrigger.update()

    instance.on('scroll', updateScrollTrigger)
    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)
    setLenis(instance)

    return () => {
      instance.off('scroll', updateScrollTrigger)
      instance.destroy()
      gsap.ticker.remove(update)
      gsap.ticker.lagSmoothing(500, 33)
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [coarsePointer, reducedMotion])

  const transitionTo = useCallback(
    (navigate) => {
      if (isTransitioning) return
      if (reducedMotion || !overlayRef.current) {
        navigate()
        return
      }

      setIsTransitioning(true)
      const overlay = overlayRef.current
      gsap
        .timeline({
          onComplete: () => setIsTransitioning(false),
        })
        .set(overlay, { transformOrigin: 'bottom', scaleY: 0 })
        .to(overlay, { scaleY: 1, duration: 0.48, ease: 'power3.inOut' })
        .call(navigate)
        .set(overlay, { transformOrigin: 'top' })
        .to(overlay, { scaleY: 0, duration: 0.58, ease: 'power3.inOut' })
    },
    [isTransitioning, reducedMotion]
  )

  const value = useMemo(
    () => ({ lenis, reducedMotion, coarsePointer, isTransitioning, transitionTo }),
    [coarsePointer, isTransitioning, lenis, reducedMotion, transitionTo]
  )

  return (
    <MotionContext.Provider value={value}>
      {children}
      <div className="im-page-wipe" ref={overlayRef} aria-hidden="true" />
    </MotionContext.Provider>
  )
}

export const useImmersiveMotion = () => {
  const value = useContext(MotionContext)
  if (!value) throw new Error('useImmersiveMotion requires ImmersiveMotionProvider.')
  return value
}

export { gsap, ScrollTrigger }
