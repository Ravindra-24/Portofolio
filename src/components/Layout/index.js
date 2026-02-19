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

const normalizePath = (path) => {
  if (!path) return '/'
  return path !== '/' && path.endsWith('/') ? path.slice(0, -1) : path
}

const isScrollableInDirection = (element, deltaY) => {
  let node = element

  while (node && node !== document.body) {
    if (node instanceof HTMLElement) {
      const { overflowY } = window.getComputedStyle(node)
      const isScrollable =
        /(auto|scroll|overlay)/.test(overflowY) &&
        node.scrollHeight > node.clientHeight + 1

      if (isScrollable) {
        const hasRoomBelow =
          node.scrollTop + node.clientHeight < node.scrollHeight - 1
        const hasRoomAbove = node.scrollTop > 1

        if ((deltaY > 0 && hasRoomBelow) || (deltaY < 0 && hasRoomAbove)) {
          return true
        }
      }
    }

    node = node.parentElement
  }

  return false
}

const Layout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const previousPathRef = useRef(location.pathname)
  const lastNavigationAtRef = useRef(0)
  const [transitionDirection, setTransitionDirection] = useState(1)

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

      const deltaY = event.deltaY
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

      if (isScrollableInDirection(target, deltaY)) {
        return
      }

      const currentPath = normalizePath(location.pathname)
      const currentIndex = NAVIGATION_ROUTES.indexOf(currentPath)
      if (currentIndex === -1) return

      const now = Date.now()
      if (now - lastNavigationAtRef.current < NAVIGATION_COOLDOWN_MS) return

      const direction = deltaY > 0 ? 1 : -1
      const nextIndex = currentIndex + direction

      if (nextIndex < 0 || nextIndex >= NAVIGATION_ROUTES.length) return

      event.preventDefault()
      lastNavigationAtRef.current = now
      setTransitionDirection(direction)
      navigate(NAVIGATION_ROUTES[nextIndex])
    }

    window.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      window.removeEventListener('wheel', handleWheel)
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
      </div>
    </div>
  )
}

export default Layout
