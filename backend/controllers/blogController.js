import Blog from '../models/blogModel.js';

export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createBlog = async (req, res) => {
  try {
    const { title, content, tags, author, authorAvatar, category, estimatedReadTime, references } = req.body;
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => `/uploads/${file.filename}`);
    }
    const blog = new Blog({ title, content, images, tags, author, authorAvatar, category, estimatedReadTime, references });
    const newBlog = await blog.save();
    res.status(201).json(newBlog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a comment to a blog post
export const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, author, authorAvatar } = req.body;
    if (!text) return res.status(400).json({ message: 'Comment text is required' });
    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ message: 'Blog post not found' });
    const comment = { text, author, authorAvatar, date: new Date() };
    blog.comments.push(comment);
    await blog.save();
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get comments for a blog post
export const getComments = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id, 'comments');
    if (!blog) return res.status(404).json({ message: 'Blog post not found' });
    res.json(blog.comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
