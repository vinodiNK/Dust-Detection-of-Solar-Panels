import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from './firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }
    signInWithEmailAndPassword(auth, email, password)
      .then(() => navigate('/home'))
      .catch((err) => setError(err.message || 'Login failed'));
  }

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>🌞 Dust Detection</h2>
        <p className="auth-form-subtitle">Sign in to your account</p>
        {error && <div className="auth-error">{error}</div>}
        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>
        <button type="submit">Sign In</button>
        <p>
          Don't have an account? <Link to="/signup">Create one now</Link>
        </p>
      </form>
    </div>
  );
}
