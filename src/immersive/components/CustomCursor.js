import { useEffect, useRef, useState } from 'react'
import { useImmersiveMotion } from '../motion/ImmersiveMotionContext'

const CustomCursor = () => {
  const dotRef = useRef(null)
  const followerRef = useRef(null)
  const { reducedMotion } = useImmersiveMotion()
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)')
    const update = () => setEnabled(finePointer.matches && !reducedMotion)
    update()
    if (finePointer.addEventListener) finePointer.addEventListener('change', update)
    else finePointer.addListener(update)
    return () => {
      if (finePointer.removeEventListener) finePointer.removeEventListener('change', update)
      else finePointer.removeListener(update)
    }
  }, [reducedMotion])

  useEffect(() => {
    if (!enabled) return undefined

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const current = { ...target }
    let magneticElement = null
    let frame

    const move = (event) => {
      target.x = event.clientX
      target.y = event.clientY
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${target.x}px, ${target.y}px, 0)`
      }
      const interactive = event.target.closest?.('.immersive-root a, .immersive-root button')
      if (magneticElement && magneticElement !== interactive) {
        magneticElement.style.translate = ''
      }
      magneticElement = interactive || null
      if (magneticElement) {
        const bounds = magneticElement.getBoundingClientRect()
        const offsetX = (event.clientX - (bounds.left + bounds.width / 2)) * 0.12
        const offsetY = (event.clientY - (bounds.top + bounds.height / 2)) * 0.12
        magneticElement.style.translate = `${offsetX}px ${offsetY}px`
      }
    }

    const render = () => {
      current.x += (target.x - current.x) * 0.14
      current.y += (target.y - current.y) * 0.14
      if (followerRef.current) {
        followerRef.current.style.transform = `translate3d(${current.x}px, ${current.y}px, 0)`
      }
      frame = requestAnimationFrame(render)
    }

    const handleOver = (event) => {
      if (event.target.closest?.('.immersive-root a, .immersive-root button')) {
        followerRef.current?.classList.add('is-active')
      }
    }
    const handleOut = (event) => {
      const leavingInteractive = event.target.closest?.(
        '.immersive-root a, .immersive-root button'
      )
      const enteringInteractive = event.relatedTarget?.closest?.(
        '.immersive-root a, .immersive-root button'
      )
      if (leavingInteractive && !enteringInteractive) {
        followerRef.current?.classList.remove('is-active')
        leavingInteractive.style.translate = ''
      }
    }

    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerover', handleOver)
    document.addEventListener('pointerout', handleOut)
    frame = requestAnimationFrame(render)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerover', handleOver)
      document.removeEventListener('pointerout', handleOut)
      if (magneticElement) magneticElement.style.translate = ''
    }
  }, [enabled])

  if (!enabled) return null
  return (
    <div className="im-cursor" aria-hidden="true">
      <span className="im-cursor__dot" ref={dotRef} />
      <span className="im-cursor__follower" ref={followerRef} />
    </div>
  )
}

export default CustomCursor
