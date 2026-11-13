import { useState } from 'react';
import api, { errorMessage } from '../services/api.js';

const empty = { name: '', email: '', subject: '', message: '' };

export default function Contact() {
  const [form, setForm] = useState(empty);
  const [status, setStatus] = useState({ type: '', text: '' });
  const [sending, setSending] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Basic checks in the browser; the backend validates again
  const validate = () => {
    if (!form.name.trim() || !form.email.trim() || !form.subject.trim() || !form.message.trim()) {
      return 'Please fill in all fields.';
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      return 'Please enter a valid email address.';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const problem = validate();
    if (problem) {
      setStatus({ type: 'error', text: problem });
      return;
    }
    setSending(true);
    setStatus({ type: '', text: '' });
    try {
      const res = await api.post('/contact', form);
      setStatus({ type: 'success', text: res.data.message });
      setForm(empty);
    } catch (err) {
      setStatus({ type: 'error', text: errorMessage(err, 'Could not send your message. Please try again.') });
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="container section narrow">
      <h1 className="page-title">Contact Us</h1>
      <p className="muted">Send us a message and we will get back to you.</p>

      {status.text && (
        <p className={`alert ${status.type === 'success' ? 'alert-success' : 'alert-error'}`}>{status.text}</p>
      )}

      <form onSubmit={handleSubmit} className="form" noValidate>
        <label>
          Name
          <input className="input" name="name" value={form.name} onChange={handleChange} />
        </label>
        <label>
          Email
          <input className="input" type="email" name="email" value={form.email} onChange={handleChange} />
        </label>
        <label>
          Subject
          <input className="input" name="subject" value={form.subject} onChange={handleChange} />
        </label>
        <label>
          Message
          <textarea className="input" name="message" rows="6" value={form.message} onChange={handleChange} />
        </label>
        <button className="btn btn-primary" type="submit" disabled={sending}>
          {sending ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </section>
  );
}
