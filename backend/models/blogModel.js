import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  images: [{ type: String }],
  tags: [String],
  author: { type: String, required: true },
  authorAvatar: { type: String },
  category: { type: String, default: 'General' },

  comments: [{
    text: { type: String, required: true },
    date: { type: Date, default: Date.now },
    author: { type: String },
    authorAvatar: { type: String }
  }],
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model('Blog', blogSchema);
