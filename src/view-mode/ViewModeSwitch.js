import { useLocation, useNavigate } from 'react-router-dom'
import { useViewMode, VIEW_MODES } from './ViewModeContext'
import './view-mode.scss'

const ViewModeSwitch = () => {
  const { viewMode, setViewMode } = useViewMode()
  const location = useLocation()
  const navigate = useNavigate()
  const isImmersive = viewMode === VIEW_MODES.IMMERSIVE

  const toggleMode = () => {
    const nextMode = isImmersive ? VIEW_MODES.CLASSIC : VIEW_MODES.IMMERSIVE
    if (nextMode === VIEW_MODES.CLASSIC && /^\/project\/[^/]+/.test(location.pathname)) {
      navigate('/project', { replace: true })
    }
    setViewMode(nextMode)
  }

  return (
    <button
      type="button"
      className="view-mode-switch"
      role="switch"
      aria-checked={isImmersive}
      aria-label={`Switch to ${isImmersive ? 'Classic' : 'Immersive'} view`}
      onClick={toggleMode}
    >
      <span className={!isImmersive ? 'active' : ''}>Classic</span>
      <span className="view-mode-switch__track" aria-hidden="true">
        <span className="view-mode-switch__thumb" />
      </span>
      <span className={isImmersive ? 'active' : ''}>Immersive</span>
    </button>
  )
}

export default ViewModeSwitch
