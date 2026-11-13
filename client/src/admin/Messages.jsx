import { useEffect, useState } from 'react';
import api, { errorMessage } from '../services/api.js';
import { formatDate } from '../components/BlogCard.jsx';

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadMessages = async () => {
    try {
      const res = await api.get('/admin/messages');
      setMessages(res.data);
      setError('');
    } catch (err) {
      setError(errorMessage(err, 'Could not load messages.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleDelete = async (msg) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await api.delete(`/admin/messages/${msg._id}`);
      if (selected && selected._id === msg._id) setSelected(null);
      await loadMessages();
    } catch (err) {
      setError(errorMessage(err, 'Could not delete the message.'));
    }
  };

  return (
    <>
      <h1 className="page-title">Contact Messages</h1>
      {error && <p className="alert alert-error">{error}</p>}
      {loading && <p className="muted">Loading...</p>}
      {!loading && messages.length === 0 && !error && <p className="muted">No messages yet.</p>}

      {messages.length > 0 && (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Subject</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((m) => (
                <tr key={m._id}>
                  <td>{m.name}</td>
                  <td>{m.email}</td>
                  <td>{m.subject}</td>
                  <td>{formatDate(m.createdAt)}</td>
                  <td className="row-actions">
                    <button className="btn btn-outline btn-sm" onClick={() => setSelected(m)}>Read</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(m)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <div className="panel">
          <div className="page-head">
            <h2>{selected.subject}</h2>
            <button className="btn btn-outline btn-sm" onClick={() => setSelected(null)}>Close</button>
          </div>
          <p className="muted">
            From {selected.name} ({selected.email}) · {formatDate(selected.createdAt)}
          </p>
          <div className="article-content">{selected.message}</div>
        </div>
      )}
    </>
  );
}
