import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext.jsx';

export default function CommentSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [input, setInput] = useState('');
  const { userData } = useContext(AppContext) || {};
  const defaultAvatar = 'https://randomuser.me/api/portraits/men/32.jpg';

  useEffect(() => {
    // Fetch comments from backend
    fetch(`/api/blog/${postId}/comments`)
      .then(res => res.json())
      .then(data => setComments(Array.isArray(data) ? data : []))
      .catch(() => setComments([]));
  }, [postId]);

  const addComment = async () => {
    if (!input.trim()) return;
    try {
      const author = userData && userData.name ? userData.name : 'Anonymous';
      const authorAvatar = userData && userData.image ? userData.image : defaultAvatar;
      const res = await fetch(`/api/blog/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input, author, authorAvatar })
      });
      if (!res.ok) throw new Error('Failed to post comment');
      const comment = await res.json();
      setComments([...comments, comment]);
      setInput('');
    } catch (err) {
      // Optionally show error
    }
  };


  return (
    <div className="mt-8">
      <h3 className="text-lg font-bold mb-2">Comments</h3>
      <div className="space-y-3 mb-4">
        {comments.length === 0 && (
          <div className="text-gray-400 italic text-sm">No comments yet. Be the first to comment!</div>
        )}
        {comments.map((c, idx) => (
          <div key={idx} className="bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2 text-sm flex flex-row items-start gap-3">
            <img src={c.authorAvatar || defaultAvatar} alt={c.author || 'Anonymous'} className="w-8 h-8 rounded-full object-cover border border-gray-300 mt-1" />
            <div className="flex-1 flex flex-col">
              <span className="font-semibold text-gray-800 dark:text-white">{c.author || 'Anonymous'}</span>
              <span>{c.text}</span>
              <span className="text-xs text-gray-400 mt-1">{c.date ? (new Date(c.date).toLocaleString()) : ''}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-[#5f6FFF]"
        />
        <button
          onClick={addComment}
          className="px-4 py-2 rounded-lg bg-[#5f6FFF] text-white font-semibold hover:bg-[#4752c4] transition"
        >
          Post
        </button>
      </div>
    </div>
  );
}
