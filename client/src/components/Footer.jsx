import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div>
          <strong>Softrate</strong>
          <p>Practical technology articles from the Softrate team.</p>
        </div>
        <div className="footer-links">
          <Link to="/">Home</Link>
          <Link to="/blogs">Blogs</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </div>
      </div>
      <div className="container footer-copy">© {new Date().getFullYear()} Softrate. All rights reserved.</div>
    </footer>
  );
}
