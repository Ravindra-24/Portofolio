import { signInWithGoogle } from '../../firebase'
import '../Dashboard/index.scss'

const Login = () => {
  return (
    <div className="dashboard auth-state">
      <p className="eyebrow">Portfolio administration</p>
      <h1>Sign in to manage content</h1>
      <p>Use the Google account connected to your Firebase administrator UID.</p>
      <button className="primary-button" onClick={signInWithGoogle}>
        Sign in with Google
      </button>
    </div>
  )
}

export default Login
