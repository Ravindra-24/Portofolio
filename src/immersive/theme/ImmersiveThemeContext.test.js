import { fireEvent, render, screen } from '@testing-library/react'
import ImmersiveThemeToggle from '../components/ImmersiveThemeToggle'
import {
  IMMERSIVE_THEME_STORAGE_KEY,
  ImmersiveThemeProvider,
} from './ImmersiveThemeContext'

const renderTheme = () =>
  render(
    <ImmersiveThemeProvider>
      <ImmersiveThemeToggle />
    </ImmersiveThemeProvider>
  )

describe('Immersive theme preference', () => {
  beforeEach(() => {
    window.localStorage.clear()
    delete document.documentElement.dataset.immersiveTheme
  })

  test('defaults to dark and persists an accessible light-theme switch', () => {
    const { unmount } = renderTheme()
    const toggle = screen.getByRole('switch')
    expect(toggle).not.toBeChecked()
    expect(document.documentElement).toHaveAttribute('data-immersive-theme', 'dark')

    fireEvent.click(toggle)
    expect(toggle).toBeChecked()
    expect(window.localStorage.getItem(IMMERSIVE_THEME_STORAGE_KEY)).toBe('light')
    expect(document.documentElement).toHaveAttribute('data-immersive-theme', 'light')

    unmount()
    expect(document.documentElement).not.toHaveAttribute('data-immersive-theme')
  })

  test('loads and synchronizes a stored theme', () => {
    window.localStorage.setItem(IMMERSIVE_THEME_STORAGE_KEY, 'light')
    renderTheme()
    expect(screen.getByRole('switch')).toBeChecked()

    fireEvent(
      window,
      new StorageEvent('storage', {
        key: IMMERSIVE_THEME_STORAGE_KEY,
        newValue: 'dark',
      })
    )
    expect(screen.getByRole('switch')).not.toBeChecked()
  })
})
