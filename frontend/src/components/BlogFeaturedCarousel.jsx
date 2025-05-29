import React from 'react';
import { motion } from 'framer-motion';

export default function BlogFeaturedCarousel({ posts }) {
  if (!posts || posts.length === 0) return null;
  return (
    <div className="mb-8">
      <div className="flex gap-6 overflow-x-auto pb-2">
        {posts.map((post, idx) => (
          <motion.div
            key={post._id || post.id}
            className="min-w-[320px] bg-gradient-to-r from-[#5f6FFF] to-[#6c5ce7] rounded-2xl shadow-xl p-6 text-white flex-shrink-0"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <div className="mb-2 text-xs uppercase tracking-wider opacity-80">{post.category || 'General'}</div>
            <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
            <p className="mb-2 line-clamp-3">{post.content?.substring(0, 120)}...</p>
            <div className="text-xs opacity-80">By {post.author} · {post.estimatedReadTime || '2 min read'}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
