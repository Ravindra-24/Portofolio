import { createContext, useCallback, useContext, useEffect, useState } from 'react'

export const VIEW_MODE_STORAGE_KEY = 'portfolio:view-mode:v1'
export const VIEW_MODES = {
  CLASSIC: 'classic',
  IMMERSIVE: 'immersive',
}

const isViewMode = (value) => Object.values(VIEW_MODES).includes(value)

const readStoredViewMode = () => {
  try {
    const stored = window.localStorage.getItem(VIEW_MODE_STORAGE_KEY)
    return isViewMode(stored) ? stored : VIEW_MODES.CLASSIC
  } catch (error) {
    return VIEW_MODES.CLASSIC
  }
}

const ViewModeContext = createContext(null)

export const ViewModeProvider = ({ children }) => {
  const [viewMode, setViewModeState] = useState(readStoredViewMode)

  const setViewMode = useCallback((nextMode) => {
    const safeMode = isViewMode(nextMode) ? nextMode : VIEW_MODES.CLASSIC
    setViewModeState(safeMode)
    try {
      window.localStorage.setItem(VIEW_MODE_STORAGE_KEY, safeMode)
    } catch (error) {
      // Storage can be unavailable in privacy mode; in-memory switching still works.
    }
  }, [])

  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key !== VIEW_MODE_STORAGE_KEY) return
      setViewModeState(isViewMode(event.newValue) ? event.newValue : VIEW_MODES.CLASSIC)
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  return (
    <ViewModeContext.Provider value={{ viewMode, setViewMode }}>
      {children}
    </ViewModeContext.Provider>
  )
}

export const useViewMode = () => {
  const value = useContext(ViewModeContext)
  if (!value) throw new Error('useViewMode must be used inside ViewModeProvider.')
  return value
}
