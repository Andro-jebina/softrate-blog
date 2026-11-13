const express = require('express');
const protect = require('../middleware/auth');
const { login, profile } = require('../controllers/authController');
const {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
} = require('../controllers/blogController');
const { getMessages, deleteMessage, getStats } = require('../controllers/contactController');

const router = express.Router();

// Only route that does not need a token
router.post('/login', login);

// Everything below is protected by JWT
router.use(protect);

router.get('/profile', profile);
router.get('/stats', getStats);

router.get('/blogs', getAllBlogs);
router.get('/blogs/:id', getBlogById);
router.post('/blogs', createBlog);
router.put('/blogs/:id', updateBlog);
router.delete('/blogs/:id', deleteBlog);

router.get('/messages', getMessages);
router.delete('/messages/:id', deleteMessage);

module.exports = router;
