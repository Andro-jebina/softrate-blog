const Contact = require('../models/Contact');
const Blog = require('../models/Blog');

// POST /api/contact  (public)
exports.createMessage = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;
    const saved = await Contact.create({ name, email, subject, message });
    res.status(201).json({ message: 'Thank you! Your message has been sent.', id: saved._id });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/messages
exports.getMessages = async (req, res, next) => {
  try {
    res.json(await Contact.find().sort({ createdAt: -1 }));
  } catch (err) {
    next(err);
  }
};

// DELETE /api/admin/messages/:id
exports.deleteMessage = async (req, res, next) => {
  try {
    const msg = await Contact.findByIdAndDelete(req.params.id);
    if (!msg) return res.status(404).json({ message: 'Message not found' });
    res.json({ message: 'Message deleted' });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/stats  (dashboard numbers, all from the database)
exports.getStats = async (req, res, next) => {
  try {
    const [totalBlogs, publishedBlogs, draftBlogs, totalMessages] = await Promise.all([
      Blog.countDocuments(),
      Blog.countDocuments({ status: 'Published' }),
      Blog.countDocuments({ status: 'Draft' }),
      Contact.countDocuments(),
    ]);
    res.json({ totalBlogs, publishedBlogs, draftBlogs, totalMessages });
  } catch (err) {
    next(err);
  }
};
