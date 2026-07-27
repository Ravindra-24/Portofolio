import { render, screen, waitFor } from '@testing-library/react'
import { onAuthStateChanged } from 'firebase/auth'
import Dashboard from '.'
import { isAdminUser } from '../../services/portfolioRepository'

jest.mock('firebase/auth', () => ({
  onAuthStateChanged: jest.fn(),
}))

jest.mock('../../firebase', () => ({
  auth: { signOut: jest.fn() },
  signInWithGoogle: jest.fn(),
}))

jest.mock('../../services/portfolioRepository', () => ({
  isAdminUser: jest.fn(),
}))

jest.mock('./home', () => () => <div>Admin CMS loaded</div>)

describe('Dashboard authorization', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('shows sign in when no user is authenticated', async () => {
    onAuthStateChanged.mockImplementation((_auth, callback) => {
      callback(null)
      return jest.fn()
    })

    render(<Dashboard />)
    expect(
      await screen.findByRole('heading', { name: /sign in to manage content/i })
    ).toBeInTheDocument()
  })

  test('denies an authenticated non-admin and shows the UID', async () => {
    isAdminUser.mockResolvedValue(false)
    onAuthStateChanged.mockImplementation((_auth, callback) => {
      callback({ uid: 'not-an-admin' })
      return jest.fn()
    })

    render(<Dashboard />)
    expect(await screen.findByText(/not an administrator/i)).toBeInTheDocument()
    expect(screen.getByText('not-an-admin')).toBeInTheDocument()
  })

  test('loads the CMS for an administrator', async () => {
    isAdminUser.mockResolvedValue(true)
    onAuthStateChanged.mockImplementation((_auth, callback) => {
      callback({ uid: 'admin-user' })
      return jest.fn()
    })

    render(<Dashboard />)
    await waitFor(() => {
      expect(screen.getByText('Admin CMS loaded')).toBeInTheDocument()
    })
  })
})
