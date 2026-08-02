import { useEffect, useRef, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import Sidebar from '../Sidebar/'
import './index.scss'

const NAVIGATION_ROUTES = [
  '/',
  '/about',
  '/experience',
  '/skills',
  '/project',
  '/certificate',
  '/contact',
]

const NAVIGATION_COOLDOWN_MS = 700
const MIN_WHEEL_DELTA = 35
const WHEEL_NAVIGATION_THRESHOLD = 240
const WHEEL_GESTURE_RESET_MS = 450
const MIN_TOUCH_SWIPE_DELTA = 60
const NAVIGATION_HINT_STORAGE_KEY = 'route_navigation_hint_dismissed'

const normalizePath = (path) => {
  if (!path) return '/'
  return path !== '/' && path.endsWith('/') ? path.slice(0, -1) : path
}

const getScrollState = (element, deltaY) => {
  let node = element
  let firstScrollable = null

  while (node && node !== document.body) {
    if (node instanceof HTMLElement) {
      const { overflowY } = window.getComputedStyle(node)
      const isScrollable =
        /(auto|scroll|overlay)/.test(overflowY) &&
        node.scrollHeight > node.clientHeight + 1

      if (isScrollable) {
        firstScrollable ||= node
        const hasRoomBelow =
          node.scrollTop + node.clientHeight < node.scrollHeight - 1
        const hasRoomAbove = node.scrollTop > 1

        if ((deltaY > 0 && hasRoomBelow) || (deltaY < 0 && hasRoomAbove)) {
          return { container: node, canScroll: true }
        }
      }
    }

    node = node.parentElement
  }

  return { container: firstScrollable, canScroll: false }
}

const isScrollableInDirection = (element, deltaY) =>
  getScrollState(element, deltaY).canScroll

const Layout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const previousPathRef = useRef(location.pathname)
  const lastNavigationAtRef = useRef(0)
  const accumulatedWheelDeltaRef = useRef(0)
  const lastWheelEventAtRef = useRef(0)
  const activeScrollContainerRef = useRef(null)
  const touchStartYRef = useRef(null)
  const touchStartTargetRef = useRef(null)
  const [transitionDirection, setTransitionDirection] = useState(1)
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const [showNavigationHint, setShowNavigationHint] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(pointer: coarse)')
    const updateInputType = () => {
      setIsTouchDevice(mediaQuery.matches)
    }

    updateInputType()

    if (!localStorage.getItem(NAVIGATION_HINT_STORAGE_KEY)) {
      setShowNavigationHint(true)
    }

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', updateInputType)
    } else {
      mediaQuery.addListener(updateInputType)
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', updateInputType)
      } else {
        mediaQuery.removeListener(updateInputType)
      }
    }
  }, [])

  useEffect(() => {
    const previousIndex = NAVIGATION_ROUTES.indexOf(
      normalizePath(previousPathRef.current)
    )
    const currentIndex = NAVIGATION_ROUTES.indexOf(normalizePath(location.pathname))

    if (previousIndex !== -1 && currentIndex !== -1 && previousIndex !== currentIndex) {
      setTransitionDirection(currentIndex > previousIndex ? 1 : -1)
    }

    previousPathRef.current = location.pathname
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }, [location.pathname])

  useEffect(() => {
    const handleWheel = (event) => {
      if (window.matchMedia('(pointer: coarse)').matches) return

      const deltaY =
        event.deltaMode === 1
          ? event.deltaY * 16
          : event.deltaMode === 2
            ? event.deltaY * window.innerHeight
            : event.deltaY
      if (Math.abs(deltaY) < MIN_WHEEL_DELTA) return

      const target = event.target
      if (!(target instanceof Element)) return

      if (
        target.closest(
          '.leaflet-container, .modal, .modal-overlay, .modal-content, [data-disable-scroll-route-nav="true"]'
        )
      ) {
        return
      }

      if (target.closest('input, textarea, select, button, [contenteditable="true"]')) {
        return
      }

      const now = Date.now()
      const scrollState = getScrollState(target, deltaY)

      if (scrollState.canScroll) {
        accumulatedWheelDeltaRef.current = 0
        lastWheelEventAtRef.current = now
        activeScrollContainerRef.current = scrollState.container
        return
      }

      const continuingGestureAtBoundary =
        scrollState.container &&
        activeScrollContainerRef.current === scrollState.container &&
        now - lastWheelEventAtRef.current < WHEEL_GESTURE_RESET_MS

      if (continuingGestureAtBoundary) {
        accumulatedWheelDeltaRef.current = 0
        lastWheelEventAtRef.current = now
        return
      }

      const gestureExpired =
        now - lastWheelEventAtRef.current >= WHEEL_GESTURE_RESET_MS
      const changedDirection =
        accumulatedWheelDeltaRef.current !== 0 &&
        Math.sign(accumulatedWheelDeltaRef.current) !== Math.sign(deltaY)

      if (gestureExpired || changedDirection) {
        accumulatedWheelDeltaRef.current = 0
      }

      lastWheelEventAtRef.current = now
      activeScrollContainerRef.current = null
      accumulatedWheelDeltaRef.current += deltaY

      if (
        Math.abs(accumulatedWheelDeltaRef.current) <
        WHEEL_NAVIGATION_THRESHOLD
      ) {
        return
      }

      const currentPath = normalizePath(location.pathname)
      const currentIndex = NAVIGATION_ROUTES.indexOf(currentPath)
      if (currentIndex === -1) return

      if (now - lastNavigationAtRef.current < NAVIGATION_COOLDOWN_MS) {
        accumulatedWheelDeltaRef.current = 0
        return
      }

      const direction = accumulatedWheelDeltaRef.current > 0 ? 1 : -1
      const nextIndex = currentIndex + direction

      if (nextIndex < 0 || nextIndex >= NAVIGATION_ROUTES.length) return

      event.preventDefault()
      accumulatedWheelDeltaRef.current = 0
      lastNavigationAtRef.current = now
      setTransitionDirection(direction)
      navigate(NAVIGATION_ROUTES[nextIndex])
    }

    const canNavigateByGesture = (target, deltaY) => {
      if (!(target instanceof Element)) return false

      if (
        target.closest(
          '.leaflet-container, .modal, .modal-overlay, .modal-content, [data-disable-scroll-route-nav="true"]'
        )
      ) {
        return false
      }

      if (target.closest('input, textarea, select, button, [contenteditable="true"]')) {
        return false
      }

      if (isScrollableInDirection(target, deltaY)) {
        return false
      }

      const now = Date.now()
      if (now - lastNavigationAtRef.current < NAVIGATION_COOLDOWN_MS) return false

      return true
    }

    const moveToNeighborRoute = (direction) => {
      const currentPath = normalizePath(location.pathname)
      const currentIndex = NAVIGATION_ROUTES.indexOf(currentPath)
      if (currentIndex === -1) return

      const nextIndex = currentIndex + direction
      if (nextIndex < 0 || nextIndex >= NAVIGATION_ROUTES.length) return

      lastNavigationAtRef.current = Date.now()
      setTransitionDirection(direction)
      navigate(NAVIGATION_ROUTES[nextIndex])
    }

    const handleTouchStart = (event) => {
      if (event.touches.length !== 1) {
        touchStartYRef.current = null
        touchStartTargetRef.current = null
        return
      }

      touchStartYRef.current = event.touches[0].clientY
      touchStartTargetRef.current = event.target
    }

    const handleTouchEnd = (event) => {
      if (touchStartYRef.current === null || event.changedTouches.length !== 1) {
        return
      }

      const endY = event.changedTouches[0].clientY
      const deltaY = touchStartYRef.current - endY
      const absDelta = Math.abs(deltaY)
      const touchTarget =
        event.target instanceof Element ? event.target : touchStartTargetRef.current

      touchStartYRef.current = null
      touchStartTargetRef.current = null

      if (absDelta < MIN_TOUCH_SWIPE_DELTA) return
      if (!canNavigateByGesture(touchTarget, deltaY)) return

      const direction = deltaY > 0 ? 1 : -1
      moveToNeighborRoute(direction)
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [location.pathname, navigate])

  return (
    <div className="App">
      <Sidebar />
      <div className="page">
        <div
          key={location.pathname}
          className={`route-view ${transitionDirection > 0 ? 'route-forward' : 'route-backward'}`}
        >
          <Outlet />
        </div>
        {showNavigationHint && (
          <div className="navigation-hint" role="note" aria-live="polite">
            <p>
              {isTouchDevice
                ? 'Tip: Swipe up or down to change pages.'
                : 'Tip: Scroll up or down to change pages.'}
            </p>
            <button
              type="button"
              aria-label="Dismiss navigation tip"
              onClick={() => {
                setShowNavigationHint(false)
                localStorage.setItem(NAVIGATION_HINT_STORAGE_KEY, 'true')
              }}
            >
              Got it
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Layout
