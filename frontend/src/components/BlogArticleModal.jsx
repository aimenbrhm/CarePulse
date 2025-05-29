import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CommentSection from './CommentSection.jsx';

export default function BlogArticleModal({ post, open, onClose }) {
  const [currentImg, setCurrentImg] = useState(0);
  useEffect(() => {
    setCurrentImg(0);
  }, [post]);
  if (!open || !post) return null;
  // Debug: log post data
  if (typeof window !== 'undefined') {
    console.debug('BlogArticleModal post:', post);
  }
  const hasContent = post.content && post.content.trim();
  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div 
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full p-8 relative"
          initial={{ scale: 0.9, y: 40 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 40 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          onClick={e => e.stopPropagation()}
        >
          <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-white text-2xl font-bold" onClick={onClose}>&times;</button>
          {post.images && post.images.length > 0 && (
            <div className="relative w-full h-56 mb-4 flex items-center justify-center">
              <button
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-1 shadow"
                style={{zIndex:2}}
                onClick={e => { e.stopPropagation(); setCurrentImg(i => (i === 0 ? post.images.length - 1 : i - 1)); }}
                disabled={post.images.length <= 1}
              >&#8592;</button>
              {post.images[currentImg] && (
                <img
                  src={`http://localhost:4000${post.images[currentImg]}`}
                  alt={`blog-img-${currentImg}`}
                  className="w-full h-56 object-contain rounded-lg bg-gray-50 flex items-center justify-center"
                  style={{maxWidth:'100%', maxHeight:'14rem', background:'#f3f4f6'}}
                />
              )}
              <button
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-1 shadow"
                style={{zIndex:2}}
                onClick={e => { e.stopPropagation(); setCurrentImg(i => (i === post.images.length - 1 ? 0 : i + 1)); }}
                disabled={post.images.length <= 1}
              >&#8594;</button>
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                {post.images.map((_, idx) => (
                  <span key={idx} className={`inline-block w-2 h-2 rounded-full ${currentImg === idx ? 'bg-[#5f6FFF]' : 'bg-gray-300'}`}></span>
                ))}
              </div>
            </div>
          )}
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-[#5f6FFF] text-white text-xs px-3 py-1 rounded-full font-semibold">{post.category || 'General'}</span>
            {post.factChecked && <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-semibold ml-2">Fact-checked</span>}
          </div>
          <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">{post.title}</h2>
          {hasContent ? (
            <div className="mb-4 text-gray-700 dark:text-gray-200 whitespace-pre-line" style={{whiteSpace: 'pre-line'}}>{post.content}</div>
          ) : (
            <div className="mb-4 text-red-500 font-semibold">This article has no content or failed to load. Please try again or contact support.</div>
          )}
          <div className="flex items-center gap-3 mb-3">
            <img src={post.authorAvatar} alt={post.author} className="w-10 h-10 rounded-full object-cover border-2 border-[#5f6FFF]" />
            <div>
              <div className="text-base font-bold text-gray-700 dark:text-white">{post.author}</div>
              <div className="text-xs text-gray-400">{post.authorCredentials && <span className="mr-1">{post.authorCredentials}</span>}{post.date}</div>
              {post.lastUpdated && <div className="text-xs text-blue-400">Updated: {new Date(post.lastUpdated).toLocaleDateString()}</div>}
            </div>
          </div>

          {/* Comment Section restored below article content */}
          <CommentSection postId={post._id || post.id} />

          {post.medicalDisclaimer && (
            <div className="bg-yellow-100 dark:bg-yellow-900 text-yellow-900 dark:text-yellow-100 rounded-lg px-4 py-3 mt-6 text-xs shadow">
              <strong>Medical Disclaimer:</strong> <span>{post.medicalDisclaimer}</span>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
