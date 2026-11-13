import { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import api, { getToken, setToken, errorMessage } from '../services/api.js';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Already logged in? Go straight to the dashboard
  if (getToken()) return <Navigate to="/admin/dashboard" replace />;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username.trim() || !form.password) {
      setError('Please enter your username and password.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/admin/login', form);
      setToken(res.data.token);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(errorMessage(err, 'Login failed. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <form className="login-box form" onSubmit={handleSubmit}>
        <h1>Admin Login</h1>
        <p className="muted">Sign in to manage the Softrate blog.</p>

        {error && <p className="alert alert-error">{error}</p>}

        <label>
          Username
          <input className="input" name="username" autoComplete="username" value={form.username} onChange={handleChange} />
        </label>
        <label>
          Password
          <input
            className="input"
            type="password"
            name="password"
            autoComplete="current-password"
            value={form.password}
            onChange={handleChange}
          />
        </label>
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <Link to="/" className="back-link">← Back to website</Link>
      </form>
    </div>
  );
}
