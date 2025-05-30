import React from 'react';
import { motion } from 'framer-motion';

import { FaEdit, FaTrash } from 'react-icons/fa';

export default function BlogPostCard({ post, onClick, onEdit, onDelete }) {
  return (
    <motion.div
      whileHover={{ y: -6, boxShadow: '0 8px 32px rgba(95,111,255,0.10)' }}
      className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden cursor-pointer transition-all border border-[#e6eaff] dark:border-gray-700 flex flex-col relative"
      onClick={onClick}
    >
      {/* Edit/Delete Buttons */}
      <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <button
          className="w-9 h-9 flex items-center justify-center rounded-full bg-white dark:bg-gray-700 shadow hover:bg-blue-100 dark:hover:bg-[#5f6FFF] hover:text-[#5f6FFF] dark:hover:text-white text-gray-500 dark:text-gray-300 transition"
          onClick={e => { e.stopPropagation(); onEdit && onEdit(post); }}
          title="Edit"
          type="button"
        >
          <FaEdit />
        </button>
        <button
          className="w-9 h-9 flex items-center justify-center rounded-full bg-white dark:bg-gray-700 shadow hover:bg-red-100 dark:hover:bg-red-600 hover:text-red-600 dark:hover:text-white text-gray-500 dark:text-gray-300 transition"
          onClick={e => { e.stopPropagation(); onDelete && onDelete(post); }}
          title="Delete"
          type="button"
        >
          <FaTrash />
        </button>
      </div>
      <img
        src={
          post.images && post.images.length > 0
            ? (post.images[0].startsWith('http')
                ? post.images[0]
                : `${import.meta.env.VITE_BACKEND_URL}${post.images[0]}`)
            : 'https://via.placeholder.com/400x200?text=No+Image'
        }
        alt={post.title}
        className="w-full h-48 object-cover bg-gray-100"
        style={{objectFit: 'cover', background: '#f3f4f6'}}
      />
      <div className="p-5 flex flex-col flex-1">
        <div className="flex gap-2 mb-2 items-center">
          <span className="bg-[#5f6FFF] text-white text-xs px-3 py-1 rounded-full font-semibold mr-2">{post.category || 'General'}</span>
          {post.factChecked && (
            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-semibold ml-2">Fact-checked</span>
          )}
        </div>
        <div className="flex gap-2 mb-2">
          {post.tags && post.tags.map((tag, idx) => (
            <span key={idx} className="bg-[#5f6FFF] bg-opacity-10 text-[#5f6FFF] text-xs px-2 py-1 rounded-full font-semibold">
              {tag}
            </span>
          ))}
        </div>
        <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white line-clamp-2">{post.title}</h3>
      </div>
    </motion.div>
  );
}

