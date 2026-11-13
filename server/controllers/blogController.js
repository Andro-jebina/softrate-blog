const Blog = require('../models/Blog');

// Turns "My First Post!" into "my-first-post"
const makeSlug = (title) =>
  title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'post';

// Makes sure the slug is unique by adding -2, -3 ... if needed
const uniqueSlug = async (title, ignoreId) => {
  const base = makeSlug(title);
  let slug = base;
  let count = 1;
  while (await Blog.findOne({ slug, _id: { $ne: ignoreId } })) {
    count += 1;
    slug = `${base}-${count}`;
  }
  return slug;
};

// Picks only the fields we allow from the request body
const pickFields = (body) => ({
  title: body.title,
  description: body.description,
  content: body.content,
  image: body.image,
  category: body.category,
  author: body.author,
  status: body.status,
});

// ---------- PUBLIC ----------

// GET /api/blogs?search=react&limit=3
exports.getPublicBlogs = async (req, res, next) => {
  try {
    const filter = { status: 'Published' };
    const search = String(req.query.search || '').trim();
    if (search) {
      const safe = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(safe, 'i');
      filter.$or = [{ title: regex }, { description: regex }, { category: regex }];
    }
    let query = Blog.find(filter).select('-content').sort({ createdAt: -1 });
    const limit = parseInt(req.query.limit, 10);
    if (limit > 0) query = query.limit(limit);
    res.json(await query);
  } catch (err) {
    next(err);
  }
};

// GET /api/blogs/:slug
exports.getBlogBySlug = async (req, res, next) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, status: 'Published' });
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json(blog);
  } catch (err) {
    next(err);
  }
};

// ---------- ADMIN ----------

// GET /api/admin/blogs  (drafts + published)
// GET /api/admin/blogs?id=... is not needed; edit page uses /api/admin/blogs/:id
exports.getAllBlogs = async (req, res, next) => {
  try {
    res.json(await Blog.find().sort({ createdAt: -1 }));
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/blogs/:id
exports.getBlogById = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json(blog);
  } catch (err) {
    next(err);
  }
};

// POST /api/admin/blogs
exports.createBlog = async (req, res, next) => {
  try {
    const data = pickFields(req.body);
    if (!data.title || !String(data.title).trim()) {
      return res.status(400).json({ message: 'Title is required' });
    }
    data.slug = await uniqueSlug(data.title);
    const blog = await Blog.create(data);
    res.status(201).json(blog);
  } catch (err) {
    next(err);
  }
};

// PUT /api/admin/blogs/:id
exports.updateBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    const data = pickFields(req.body);
    // Only regenerate the slug when the title really changed
    if (data.title && data.title.trim() !== blog.title) {
      blog.slug = await uniqueSlug(data.title, blog._id);
    }
    Object.keys(data).forEach((key) => {
      if (data[key] !== undefined) blog[key] = data[key];
    });
    await blog.save(); // runs validation
    res.json(blog);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/admin/blogs/:id
exports.deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json({ message: 'Blog deleted' });
  } catch (err) {
    next(err);
  }
};
