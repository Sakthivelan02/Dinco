import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context.jsx';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useApp();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Context login function moolama API call & state update panrom
      await login('/auth/login', { email, password });
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="form" onSubmit={handleLogin}>
      <h1>Log in to Dinco</h1>

      {error && <p className="error" style={{ color: '#fb7185', background: 'rgba(251, 113, 133, 0.1)', padding: '10px', borderRadius: '8px' }}>⚠️ {error}</p>}

      <label>
        Email Address
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="yourname@gmail.com"
        />
      </label>

      <label>
        Password
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />
      </label>

      <button className="btn" disabled={loading}>
        {loading ? 'Logging in...' : 'Log in'}
      </button>

      <p style={{ marginTop: '15px', textAlign: 'center' }}>
        Don't have an account?{' '}
        <Link to="/register" style={{ color: '#22d3ee', fontWeight: 'bold' }}>
          Sign up here
        </Link>
      </p>
    </form>
  );
};

export default Login;