import { lazy, Suspense, useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { ViewModeProvider, useViewMode, VIEW_MODES } from './view-mode/ViewModeContext'
import ViewModeSwitch from './view-mode/ViewModeSwitch'

const ClassicApp = lazy(() => import('./classic/ClassicApp'))
const ImmersiveApp = lazy(() => import('./immersive/ImmersiveApp'))

const AppView = () => {
  const { viewMode } = useViewMode()
  const location = useLocation()
  const isDashboard = /^\/dashboard(?:\/|$)/.test(location.pathname)
  const effectiveMode = isDashboard ? VIEW_MODES.CLASSIC : viewMode

  useLayoutEffect(() => {
    document.documentElement.dataset.portfolioView = effectiveMode
    return () => {
      delete document.documentElement.dataset.portfolioView
    }
  }, [effectiveMode])

  return (
    <>
      {!isDashboard && <ViewModeSwitch />}
      <Suspense fallback={<div className="view-loading">Loading view…</div>}>
        {effectiveMode === VIEW_MODES.IMMERSIVE ? <ImmersiveApp /> : <ClassicApp />}
      </Suspense>
    </>
  )
}

function App() {
  return (
    <ViewModeProvider>
      <AppView />
    </ViewModeProvider>
  )
}

export default App
