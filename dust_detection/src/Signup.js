import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please fill all fields');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    // TODO: replace with real signup flow
    navigate('/home');
  }

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Sign Up</h2>
        {error && <div className="auth-error">{error}</div>}
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
        </label>
        <label>
          Confirm Password
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Confirm Password"
          />
        </label>
        <button type="submit">Create Account</button>
        <p>
          Already registered? <Link to="/">Log in</Link>
        </p>
      </form>
    </div>
  );
}
