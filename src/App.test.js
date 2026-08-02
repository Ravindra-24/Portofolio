import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from './App'
import { VIEW_MODE_STORAGE_KEY } from './view-mode/ViewModeContext'

jest.mock('./classic/ClassicApp', () => () => <div>Classic shell</div>)
jest.mock('./immersive/ImmersiveApp', () => () => <div>Immersive shell</div>)

describe('application view boundary', () => {
  beforeEach(() => window.localStorage.clear())

  test('loads Classic by default', async () => {
    render(<MemoryRouter><App /></MemoryRouter>)
    expect(await screen.findByText('Classic shell')).toBeInTheDocument()
    expect(screen.queryByText('Immersive shell')).not.toBeInTheDocument()
    expect(screen.getByRole('switch')).toBeInTheDocument()
  })

  test('loads the stored Immersive view', async () => {
    window.localStorage.setItem(VIEW_MODE_STORAGE_KEY, 'immersive')
    render(<MemoryRouter><App /></MemoryRouter>)
    expect(await screen.findByText('Immersive shell')).toBeInTheDocument()
  })

  test.each(['/dashboard', '/dashboard/settings'])(
    'forces %s into Classic and hides the switch',
    async (path) => {
      window.localStorage.setItem(VIEW_MODE_STORAGE_KEY, 'immersive')
      render(<MemoryRouter initialEntries={[path]}><App /></MemoryRouter>)
      expect(await screen.findByText('Classic shell')).toBeInTheDocument()
      expect(screen.queryByRole('switch')).not.toBeInTheDocument()
    }
  )
})
