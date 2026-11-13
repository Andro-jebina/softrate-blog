import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api, { errorMessage } from '../services/api.js';
import { formatDate } from '../components/BlogCard.jsx';

export default function BlogDetail() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    setError('');
    api
      .get(`/blogs/${slug}`)
      .then((res) => setBlog(res.data))
      .catch((err) => {
        if (err.response?.status === 404) setNotFound(true);
        else setError(errorMessage(err, 'Could not load this blog.'));
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="container section"><p className="muted">Loading...</p></div>;

  if (notFound || error) {
    return (
      <div className="container section center">
        <h1 className="page-title">{notFound ? 'Blog not found' : 'Something went wrong'}</h1>
        <p className="muted">
          {notFound ? 'This blog does not exist or is no longer available.' : error}
        </p>
        <Link to="/blogs" className="btn btn-primary mt">Back to Blogs</Link>
      </div>
    );
  }

  return (
    <article className="container article">
      <Link to="/blogs" className="back-link">← Back to Blogs</Link>
      <div className="card-meta">
        <span className="badge">{blog.category}</span>
        <span>{formatDate(blog.createdAt)}</span>
        <span>by {blog.author}</span>
      </div>
      <h1 className="article-title">{blog.title}</h1>
      <img src={blog.image} alt={blog.title} className="article-image" />
      {/* Content is shown as plain text; blank lines become paragraphs */}
      <div className="article-content">{blog.content}</div>
    </article>
  );
}
