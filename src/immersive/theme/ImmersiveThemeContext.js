import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react'

export const IMMERSIVE_THEME_STORAGE_KEY = 'portfolio:immersive-theme:v1'
export const IMMERSIVE_THEMES = {
  DARK: 'dark',
  LIGHT: 'light',
}

const isTheme = (value) => Object.values(IMMERSIVE_THEMES).includes(value)

const readTheme = () => {
  try {
    const stored = window.localStorage.getItem(IMMERSIVE_THEME_STORAGE_KEY)
    return isTheme(stored) ? stored : IMMERSIVE_THEMES.DARK
  } catch (error) {
    return IMMERSIVE_THEMES.DARK
  }
}

const ImmersiveThemeContext = createContext(null)

export const ImmersiveThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(readTheme)

  const setTheme = useCallback((nextTheme) => {
    const safeTheme = isTheme(nextTheme) ? nextTheme : IMMERSIVE_THEMES.DARK
    setThemeState(safeTheme)
    try {
      window.localStorage.setItem(IMMERSIVE_THEME_STORAGE_KEY, safeTheme)
    } catch (error) {
      // The theme still works in memory if browser storage is unavailable.
    }
  }, [])

  useLayoutEffect(() => {
    document.documentElement.dataset.immersiveTheme = theme
    return () => {
      delete document.documentElement.dataset.immersiveTheme
    }
  }, [theme])

  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key !== IMMERSIVE_THEME_STORAGE_KEY) return
      setThemeState(isTheme(event.newValue) ? event.newValue : IMMERSIVE_THEMES.DARK)
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  return (
    <ImmersiveThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ImmersiveThemeContext.Provider>
  )
}

export const useImmersiveTheme = () => {
  const value = useContext(ImmersiveThemeContext)
  if (!value) throw new Error('useImmersiveTheme requires ImmersiveThemeProvider.')
  return value
}
