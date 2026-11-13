import { Link } from 'react-router-dom';

export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });

// Shown on the homepage and the blog listing page
export default function BlogCard({ blog }) {
  return (
    <article className="card">
      <Link to={`/blogs/${blog.slug}`} className="card-image-link">
        <img
          src={blog.image}
          alt={blog.title}
          className="card-image"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.style.visibility = 'hidden';
          }}
        />
      </Link>
      <div className="card-body">
        <div className="card-meta">
          <span className="badge">{blog.category}</span>
          <span>{formatDate(blog.createdAt)}</span>
        </div>
        <h3 className="card-title">
          <Link to={`/blogs/${blog.slug}`}>{blog.title}</Link>
        </h3>
        <p className="card-text">{blog.description}</p>
        <Link to={`/blogs/${blog.slug}`} className="btn btn-outline btn-sm">
          Read More
        </Link>
      </div>
    </article>
  );
}
