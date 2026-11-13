const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true, maxlength: 200 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, required: [true, 'Short description is required'], trim: true, maxlength: 400 },
    content: { type: String, required: [true, 'Content is required'] },
    image: { type: String, required: [true, 'Image URL is required'], trim: true },
    category: { type: String, required: [true, 'Category is required'], trim: true },
    author: { type: String, required: [true, 'Author is required'], trim: true },
    status: { type: String, enum: ['Draft', 'Published'], default: 'Draft' },
  },
  { timestamps: true } // adds createdAt and updatedAt
);

module.exports = mongoose.model('Blog', blogSchema);
