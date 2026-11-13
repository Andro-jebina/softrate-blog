const express = require('express');
const { getPublicBlogs, getBlogBySlug } = require('../controllers/blogController');
const { createMessage } = require('../controllers/contactController');

const router = express.Router();

router.get('/blogs', getPublicBlogs);
router.get('/blogs/:slug', getBlogBySlug);
router.post('/contact', createMessage);

module.exports = router;
