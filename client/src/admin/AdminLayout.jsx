import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { clearToken } from '../services/api.js';

// Sidebar + content area shared by all admin pages
export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearToken();
    navigate('/admin/login');
  };

  return (
    <div className="admin">
      <aside className="admin-sidebar">
        <div className="logo admin-logo">Soft<span>rate</span> Admin</div>
        <nav className="admin-nav">
          <NavLink to="/admin/dashboard">Dashboard</NavLink>
          <NavLink to="/admin/blogs" end>Manage Blogs</NavLink>
          <NavLink to="/admin/blogs/add">Add New Blog</NavLink>
          <NavLink to="/admin/messages">Contact Messages</NavLink>
          <a href="/" target="_blank" rel="noreferrer">View Website</a>
          <button type="button" onClick={handleLogout}>Logout</button>
        </nav>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
