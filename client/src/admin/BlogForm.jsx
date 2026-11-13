import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api, { errorMessage } from '../services/api.js';

const empty = {
  title: '',
  description: '',
  content: '',
  image: '',
  category: '',
  author: '',
  status: 'Draft',
};

// One form used for both "Add" (no id in URL) and "Edit" (id in URL)
export default function BlogForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // In edit mode, load the existing blog into the form
  useEffect(() => {
    if (!isEdit) return;
    api
      .get(`/admin/blogs/${id}`)
      .then((res) => {
        const b = res.data;
        setForm({
          title: b.title,
          description: b.description,
          content: b.content,
          image: b.image,
          category: b.category,
          author: b.author,
          status: b.status,
        });
      })
      .catch((err) => setError(errorMessage(err, 'Could not load this blog.')))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const required = ['title', 'description', 'content', 'image', 'category', 'author'];
    if (required.some((f) => !form[f].trim())) {
      setError('Please fill in all required fields.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      if (isEdit) {
        await api.put(`/admin/blogs/${id}`, form);
      } else {
        await api.post('/admin/blogs', form);
      }
      navigate('/admin/blogs');
    } catch (err) {
      setError(errorMessage(err, 'Could not save the blog.'));
      setSaving(false);
    }
  };

  if (loading) return <p className="muted">Loading...</p>;

  return (
    <>
      <h1 className="page-title">{isEdit ? 'Edit Blog' : 'Add New Blog'}</h1>
      {error && <p className="alert alert-error">{error}</p>}

      <form className="form panel" onSubmit={handleSubmit} noValidate>
        <label>
          Title *
          <input className="input" name="title" value={form.title} onChange={handleChange} />
        </label>
        <label>
          Short description *
          <textarea className="input" name="description" rows="2" maxLength="400" value={form.description} onChange={handleChange} />
        </label>
        <label>
          Content *
          <textarea className="input" name="content" rows="12" value={form.content} onChange={handleChange} />
        </label>
        <label>
          Image URL *
          <input className="input" name="image" placeholder="https://..." value={form.image} onChange={handleChange} />
        </label>
        <div className="form-row">
          <label>
            Category *
            <input className="input" name="category" value={form.category} onChange={handleChange} />
          </label>
          <label>
            Author *
            <input className="input" name="author" value={form.author} onChange={handleChange} />
          </label>
          <label>
            Status
            <select className="input" name="status" value={form.status} onChange={handleChange}>
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
            </select>
          </label>
        </div>
        <div className="actions">
          <button className="btn btn-primary" type="submit" disabled={saving}>
            {saving ? 'Saving...' : isEdit ? 'Update Blog' : 'Create Blog'}
          </button>
          <Link to="/admin/blogs" className="btn btn-outline">Cancel</Link>
        </div>
      </form>
    </>
  );
}
