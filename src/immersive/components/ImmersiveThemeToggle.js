import { IMMERSIVE_THEMES, useImmersiveTheme } from '../theme/ImmersiveThemeContext'

const ImmersiveThemeToggle = () => {
  const { theme, setTheme } = useImmersiveTheme()
  const isLight = theme === IMMERSIVE_THEMES.LIGHT

  return (
    <button
      type="button"
      className="im-theme-toggle"
      role="switch"
      aria-checked={isLight}
      aria-label={`Switch to ${isLight ? 'dark' : 'light'} theme`}
      onClick={() => setTheme(isLight ? IMMERSIVE_THEMES.DARK : IMMERSIVE_THEMES.LIGHT)}
    >
      <span aria-hidden="true">{isLight ? '☀' : '☾'}</span>
      {isLight ? 'Light' : 'Dark'}
    </button>
  )
}

export default ImmersiveThemeToggle
