import { useEffect, useState } from 'react';
import api, { errorMessage } from '../services/api.js';
import BlogCard from '../components/BlogCard.jsx';

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Re-fetch whenever the search text changes (small delay while typing)
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      api
        .get('/blogs', { params: { search } })
        .then((res) => {
          setBlogs(res.data);
          setError('');
        })
        .catch((err) => setError(errorMessage(err, 'Could not load blogs.')))
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <section className="container section">
      <h1 className="page-title">All Blogs</h1>

      <input
        type="search"
        className="input search"
        placeholder="Search blogs by title, description or category..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading && <p className="muted">Loading...</p>}
      {error && <p className="alert alert-error">{error}</p>}
      {!loading && !error && blogs.length === 0 && (
        <p className="muted">
          {search ? `No blogs found for "${search}".` : 'No blog posts are available yet.'}
        </p>
      )}

      <div className="grid">
        {blogs.map((blog) => (
          <BlogCard key={blog._id} blog={blog} />
        ))}
      </div>
    </section>
  );
}
