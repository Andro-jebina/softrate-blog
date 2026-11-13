import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { errorMessage } from '../services/api.js';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/admin/stats')
      .then((res) => setStats(res.data))
      .catch((err) => setError(errorMessage(err, 'Could not load statistics.')));
  }, []);

  const items = stats
    ? [
        { label: 'Total Blogs', value: stats.totalBlogs },
        { label: 'Published Blogs', value: stats.publishedBlogs },
        { label: 'Draft Blogs', value: stats.draftBlogs },
        { label: 'Contact Messages', value: stats.totalMessages },
      ]
    : [];

  return (
    <>
      <h1 className="page-title">Dashboard</h1>
      {error && <p className="alert alert-error">{error}</p>}
      {!stats && !error && <p className="muted">Loading...</p>}

      <div className="stats">
        {items.map((s) => (
          <div className="stat" key={s.label}>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="actions">
        <Link to="/admin/blogs/add" className="btn btn-primary">Add New Blog</Link>
        <Link to="/admin/blogs" className="btn btn-outline">Manage Blogs</Link>
        <Link to="/admin/messages" className="btn btn-outline">Contact Messages</Link>
      </div>
    </>
  );
}
