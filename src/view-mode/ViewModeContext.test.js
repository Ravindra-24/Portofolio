import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, useLocation } from 'react-router-dom'
import {
  ViewModeProvider,
  useViewMode,
  VIEW_MODE_STORAGE_KEY,
} from './ViewModeContext'
import ViewModeSwitch from './ViewModeSwitch'

const ModeProbe = () => {
  const { viewMode } = useViewMode()
  const location = useLocation()
  return <output>{`${viewMode}:${location.pathname}`}</output>
}

const renderSwitcher = (path = '/') =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <ViewModeProvider>
        <ViewModeSwitch />
        <ModeProbe />
      </ViewModeProvider>
    </MemoryRouter>
  )

describe('portfolio view mode', () => {
  beforeEach(() => window.localStorage.clear())

  test('defaults invalid or missing preferences to Classic and persists a switch', () => {
    window.localStorage.setItem(VIEW_MODE_STORAGE_KEY, 'unknown')
    renderSwitcher()
    const toggle = screen.getByRole('switch')
    expect(toggle).not.toBeChecked()
    expect(screen.getByText('classic:/')).toBeInTheDocument()

    fireEvent.click(toggle)
    expect(toggle).toBeChecked()
    expect(window.localStorage.getItem(VIEW_MODE_STORAGE_KEY)).toBe('immersive')
  })

  test('uses an immersive stored preference and responds to another tab', () => {
    window.localStorage.setItem(VIEW_MODE_STORAGE_KEY, 'immersive')
    renderSwitcher()
    expect(screen.getByRole('switch')).toBeChecked()

    fireEvent(
      window,
      new StorageEvent('storage', {
        key: VIEW_MODE_STORAGE_KEY,
        newValue: 'classic',
      })
    )
    expect(screen.getByRole('switch')).not.toBeChecked()
  })

  test('continues in memory when localStorage is unavailable', () => {
    const getItem = jest
      .spyOn(Storage.prototype, 'getItem')
      .mockImplementation(() => {
        throw new Error('blocked')
      })
    const setItem = jest
      .spyOn(Storage.prototype, 'setItem')
      .mockImplementation(() => {
        throw new Error('blocked')
      })

    renderSwitcher()
    fireEvent.click(screen.getByRole('switch'))
    expect(screen.getByText('immersive:/')).toBeInTheDocument()

    getItem.mockRestore()
    setItem.mockRestore()
  })

  test('maps an immersive case study back to the Classic projects route', async () => {
    window.localStorage.setItem(VIEW_MODE_STORAGE_KEY, 'immersive')
    renderSwitcher('/project/project-1')

    fireEvent.click(screen.getByRole('switch'))
    await waitFor(() => {
      expect(screen.getByText('classic:/project')).toBeInTheDocument()
    })
  })
})
