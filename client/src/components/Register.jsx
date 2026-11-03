import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context.jsx';

const Register = () => {
  const [f, setF] = useState({ name: '', email: '', password: '' });
  const [error, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useApp(); // context login function can handle register endpoint too!
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    if (f.password.length < 6) {
      setErr('Password must be at least 6 characters long.');
      return;
    }
    setErr('');
    setLoading(true);

    try {
      await login('/auth/register', f);
      navigate('/');
    } catch (x) {
      setErr(x.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const on = (k) => (e) => setF({ ...f, [k]: e.target.value });

  return (
    <form className="form" onSubmit={submit}>
      <h1>Create your account</h1>

      {error && <p className="error" style={{ color: '#fb7185', background: 'rgba(251, 113, 133, 0.1)', padding: '10px', borderRadius: '8px' }}>⚠️ {error}</p>}

      <label>Name
        <input required value={f.name} onChange={on('name')} placeholder="Sakthivel Arumugam" />
      </label>

      <label>Email
        <input type="email" required value={f.email} onChange={on('email')} placeholder="yourname@gmail.com" />
      </label>

      <label>Password
        <input type="password" required minLength={6} value={f.password} onChange={on('password')} placeholder="••••••••" />
      </label>

      <button className="btn" disabled={loading}>
        {loading ? 'Creating Account...' : 'Sign up'}
      </button>

      <p style={{ marginTop: '15px', textAlign: 'center' }}>
        Already have an account?{' '}
        <Link to="/login" style={{ color: '#22d3ee', fontWeight: 'bold' }}>
          Login here
        </Link>
      </p>
    </form>
  );
};

export default Register;