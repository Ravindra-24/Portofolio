import { Routes, Route } from 'react-router-dom'
import 'lenis/dist/lenis.css'
import { ImmersiveDataProvider } from './data/ImmersiveDataContext'
import { ImmersiveMotionProvider } from './motion/ImmersiveMotionContext'
import ImmersiveHome from './ImmersiveHome'
import ImmersiveCaseStudy from './ImmersiveCaseStudy'
import CustomCursor from './components/CustomCursor'
import ImmersiveThemeToggle from './components/ImmersiveThemeToggle'
import WebGLScene from './components/WebGLScene'
import {
  IMMERSIVE_THEMES,
  ImmersiveThemeProvider,
  useImmersiveTheme,
} from './theme/ImmersiveThemeContext'
import './immersive.scss'

const ImmersiveSurface = () => {
  const { theme } = useImmersiveTheme()
  const isLight = theme === IMMERSIVE_THEMES.LIGHT

  return (
    <ImmersiveMotionProvider>
      <div className="immersive-root" data-theme={theme}>
        <WebGLScene lightMode={isLight} />
        <Routes>
          <Route path="/project/:projectId" element={<ImmersiveCaseStudy />} />
          <Route path="*" element={<ImmersiveHome />} />
        </Routes>
        <ImmersiveThemeToggle />
        <CustomCursor />
      </div>
    </ImmersiveMotionProvider>
  )
}

const ImmersiveApp = () => (
  <ImmersiveDataProvider>
    <ImmersiveThemeProvider>
      <ImmersiveSurface />
    </ImmersiveThemeProvider>
  </ImmersiveDataProvider>
)

export default ImmersiveApp
