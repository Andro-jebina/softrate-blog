import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { errorMessage } from '../services/api.js';
import { formatDate } from '../components/BlogCard.jsx';

export default function ManageBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewing, setViewing] = useState(null); // blog shown in the details panel

  const loadBlogs = async () => {
    try {
      const res = await api.get('/admin/blogs');
      setBlogs(res.data);
      setError('');
    } catch (err) {
      setError(errorMessage(err, 'Could not load blogs.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  const handleDelete = async (blog) => {
    if (!window.confirm(`Delete "${blog.title}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/admin/blogs/${blog._id}`);
      if (viewing && viewing._id === blog._id) setViewing(null);
      await loadBlogs(); // reload from the database
    } catch (err) {
      setError(errorMessage(err, 'Could not delete the blog.'));
    }
  };

  return (
    <>
      <div className="page-head">
        <h1 className="page-title">Manage Blogs</h1>
        <Link to="/admin/blogs/add" className="btn btn-primary">Add New Blog</Link>
      </div>

      {error && <p className="alert alert-error">{error}</p>}
      {loading && <p className="muted">Loading...</p>}
      {!loading && blogs.length === 0 && !error && <p className="muted">No blogs yet. Add your first one.</p>}

      {blogs.length > 0 && (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Author</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog) => (
                <tr key={blog._id}>
                  <td>{blog.title}</td>
                  <td>{blog.category}</td>
                  <td>{blog.author}</td>
                  <td>
                    <span className={`status ${blog.status === 'Published' ? 'status-pub' : 'status-draft'}`}>
                      {blog.status}
                    </span>
                  </td>
                  <td>{formatDate(blog.createdAt)}</td>
                  <td className="row-actions">
                    <button className="btn btn-outline btn-sm" onClick={() => setViewing(blog)}>View</button>
                    <Link className="btn btn-outline btn-sm" to={`/admin/blogs/edit/${blog._id}`}>Edit</Link>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(blog)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {viewing && (
        <div className="panel">
          <div className="page-head">
            <h2>{viewing.title}</h2>
            <button className="btn btn-outline btn-sm" onClick={() => setViewing(null)}>Close</button>
          </div>
          <p className="muted">
            {viewing.category} · {viewing.author} · {viewing.status} · /blogs/{viewing.slug}
          </p>
          <img src={viewing.image} alt={viewing.title} className="article-image" />
          <p><strong>Description:</strong> {viewing.description}</p>
          <div className="article-content">{viewing.content}</div>
        </div>
      )}
    </>
  );
}
