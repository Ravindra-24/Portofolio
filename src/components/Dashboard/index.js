import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../../firebase'
import { isAdminUser } from '../../services/portfolioRepository'
import Home from './home'
import Login from '../Login'
import './index.scss'

const Dashboard = () => {
  const [state, setState] = useState({
    user: null,
    loading: true,
    isAdmin: false,
    error: '',
  })

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (!authUser) {
        setState({ user: null, loading: false, isAdmin: false, error: '' })
        return
      }

      setState({ user: authUser, loading: true, isAdmin: false, error: '' })
      try {
        const admin = await isAdminUser(authUser.uid)
        setState({
          user: authUser,
          loading: false,
          isAdmin: admin,
          error: '',
        })
      } catch (error) {
        setState({
          user: authUser,
          loading: false,
          isAdmin: false,
          error: 'Could not verify administrator access.',
        })
      }
    })

    return unsubscribe
  }, [])

  if (state.loading) {
    return <div className="auth-state">Checking administrator access…</div>
  }

  if (!state.user) return <Login />
  if (!state.isAdmin) {
    return (
      <div className="auth-state access-denied">
        <p className="eyebrow">Access denied</p>
        <h1>This Google account is not an administrator.</h1>
        <p>
          Add the Firebase UID <code>{state.user.uid}</code> as a document in
          the Firestore <code>admins</code> collection, then sign in again.
        </p>
        {state.error && <p role="alert">{state.error}</p>}
        <button className="secondary-button" onClick={() => auth.signOut()}>
          Sign out
        </button>
      </div>
    )
  }

  return <Home />
}

export default Dashboard
