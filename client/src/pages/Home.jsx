import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { errorMessage } from '../services/api.js';
import BlogCard from '../components/BlogCard.jsx';

export default function Home() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Latest 3 published posts, straight from MongoDB via the API
    api
      .get('/blogs', { params: { limit: 3 } })
      .then((res) => setBlogs(res.data))
      .catch((err) => setError(errorMessage(err, 'Could not load blogs.')))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section className="hero">
        <div className="container">
          <h1>Ideas and insights from the Softrate team</h1>
          <p>
            Read practical articles on software development, cloud, and technology trends written by
            people who build things every day.
          </p>
          <Link to="/blogs" className="btn btn-primary">Explore Blogs</Link>
        </div>
      </section>

      <section className="container section">
        <h2 className="section-title">Latest Posts</h2>

        {loading && <p className="muted">Loading...</p>}
        {error && <p className="alert alert-error">{error}</p>}
        {!loading && !error && blogs.length === 0 && (
          <p className="muted">No blog posts yet. Please check back soon.</p>
        )}

        <div className="grid">
          {blogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>

        <div className="center mt">
          <Link to="/blogs" className="btn btn-primary">View All Blogs</Link>
        </div>
      </section>
    </>
  );
}
