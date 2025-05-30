import React, { useState, useEffect, useContext } from 'react';
import BlogPostCard from '../components/BlogPostCard';
import BlogArticleModal from '../components/BlogArticleModal.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaTimes } from 'react-icons/fa';
import { AppContext } from '../context/AppContext';
import BlogCategories from '../components/BlogCategories.jsx';

import BlogFeaturedCarousel from '../components/BlogFeaturedCarousel.jsx';
import MedicalDisclaimer from '../components/MedicalDisclaimer.jsx';

const Blog = () => {
  const { token, userData } = useContext(AppContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    images: [],
    tags: [],
    author: '',
    authorAvatar: '',
    category: 'General',
  });
  const [selectedCategory, setSelectedCategory] = useState('General');
  const [search, setSearch] = useState('');
  const [editingPostId, setEditingPostId] = useState(null);


  useEffect(() => {
    setLoading(true);
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/blog`)
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleAddPost = async (e) => {
    e.preventDefault();
    setPosting(true);
    setPostError(null);
    try {
      if (editingPostId) {
        // Simulate update (replace with backend call in real app)
        setPosts(posts.map(p => (p._id || p.id) === editingPostId ? {
          ...p,
          ...newPost,
          tags: Array.isArray(newPost.tags) ? newPost.tags : [],
        } : p));
        setEditingPostId(null);
      } else {
        // Use logged-in user's profile for author fields
        const formData = new FormData();
        formData.append('title', newPost.title);
        formData.append('content', newPost.content);
        formData.append('author', userData && userData.name ? userData.name : 'Anonymous');
        formData.append('authorAvatar', userData && userData.image ? userData.image : 'https://randomuser.me/api/portraits/men/32.jpg');
        formData.append('category', newPost.category);
        formData.append('estimatedReadTime', newPost.estimatedReadTime || '2 min read');
        formData.append('references', JSON.stringify(newPost.references || []));
        formData.append('lastUpdated', newPost.lastUpdated || '');
        formData.append('authorCredentials', newPost.authorCredentials || '');
        formData.append('factChecked', newPost.factChecked || false);
        formData.append('featured', newPost.featured || false);
        formData.append('medicalDisclaimer', newPost.medicalDisclaimer || '');
        (newPost.tags || []).forEach(tag => formData.append('tags', tag));
        (newPost.images || []).forEach(file => formData.append('images', file));
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/blog`, {
          method: 'POST',
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: formData,
        });
        if (!res.ok) throw new Error('Failed to publish post');
        const created = await res.json();
        setPosts([...posts, created]);
      }
      setNewPost({ title: '', content: '', image: '', tags: [], author: '', authorAvatar: '', category: 'General' });
      setIsCreateModalOpen(false);
    } catch (err) {
      setPostError(err.message);
    } finally {
      setPosting(false);
    }
  };


  // Filter and search logic
  const filteredPosts = posts.filter(post => {
    const matchCategory = selectedCategory === 'General' || post.category === selectedCategory;
    const matchSearch =
      post.title?.toLowerCase().includes(search.toLowerCase()) ||
      post.content?.toLowerCase().includes(search.toLowerCase()) ||
      (post.tags && post.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase())));
    return matchCategory && matchSearch;
  });

  // Featured posts for carousel (e.g., posts marked as featured)
  const featuredPosts = posts.filter(post => post.featured);

  // (removed duplicate modalOpen/setModalOpen declaration)
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-5xl mx-auto px-4 py-16"
    >
      <MedicalDisclaimer />
      <BlogFeaturedCarousel posts={featuredPosts} />
      <BlogCategories selected={selectedCategory} onSelect={setSelectedCategory} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post) => (
          <BlogPostCard
            key={post._id || post.id}
            post={{
              ...post,
              excerpt: post.content?.substring(0, 120) + (post.content?.length > 120 ? '...' : ''),
              author: post.author || 'Unknown',
              authorAvatar: post.authorAvatar || 'https://randomuser.me/api/portraits/men/32.jpg',
              date: post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Unknown',
              category: post.category || 'General',
              estimatedReadTime: post.estimatedReadTime || '2 min read',
              factChecked: post.factChecked,
              references: post.references,
              authorCredentials: post.authorCredentials,
              lastUpdated: post.lastUpdated,
              medicalDisclaimer: post.medicalDisclaimer,
            }}
            onClick={() => {
              setSelectedPost({
                ...post,
                date: post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Unknown',
                author: post.author || 'Unknown',
                authorAvatar: post.authorAvatar || 'https://randomuser.me/api/portraits/men/32.jpg',
                category: post.category || 'General',
                estimatedReadTime: post.estimatedReadTime || '2 min read',
                factChecked: post.factChecked,
                references: post.references,
                authorCredentials: post.authorCredentials,
                lastUpdated: post.lastUpdated,
                medicalDisclaimer: post.medicalDisclaimer,
              });
              setIsDetailsModalOpen(true);
            }}
            onEdit={token ? (post => {
              setEditingPostId(post._id || post.id);
              setNewPost({
                title: post.title || '',
                content: post.content || '',
                images: post.images || [],
                tags: post.tags || [],
                author: post.author || '',
                authorAvatar: post.authorAvatar || '',
                category: post.category || 'General',
              });
              setIsCreateModalOpen(true);
            }) : undefined}
            onDelete={token ? (post => {
              if (window.confirm(`Are you sure you want to delete the post: ${post.title}?`)) {
                setPosts(posts.filter(p => (p._id || p.id) !== (post._id || post.id)));
              }
            }) : undefined}
          />
        ))}
      </div>
      <BlogArticleModal post={selectedPost} open={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)} />
      {token && (
        <button
          className="bg-[#5f6FFF] hover:bg-[#6c5ce7] text-white font-bold py-2 px-4 rounded fixed bottom-4 right-4 z-50"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <FaPlus />
        </button>
      )}
      <AnimatePresence>
        {isCreateModalOpen && token && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50"
          >
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-0 w-full max-w-lg relative"
            >
              {/* Gradient Header Bar */}
              <div className="rounded-t-2xl bg-gradient-to-r from-[#5f6FFF] to-[#6c5ce7] px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-8 h-8 bg-white/20 rounded-full">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 20h9" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.5a2.121 2.121 0 113 3L7 19.5 3 21l1.5-4L16.5 3.5z" /></svg>
                  </span>
                  <h2 className="text-xl font-bold text-white tracking-wide">{editingPostId ? 'Edit Post' : 'Create a Post'}</h2>
                </div>
                <button
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 transition absolute top-3 right-3"
                  onClick={() => setIsCreateModalOpen(false)}
                  type="button"
                  aria-label="Close"
                >
                  <FaTimes className="text-white text-lg" />
                </button>
              </div>
              <form onSubmit={handleAddPost} className="px-8 py-6 flex flex-col gap-4">
                {/* Title Field with Floating Label */}
                <div className="relative">
                  <input
                    type="text"
                    id="post-title"
                    value={newPost.title}
                    onChange={e => setNewPost({ ...newPost, title: e.target.value })}
                    className="peer block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-200 px-4 pt-6 pb-2 text-base text-gray-900 dark:text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#5f6FFF] focus:border-[#5f6FFF] transition"
                    placeholder=" "
                    required
                  />
                  <label htmlFor="post-title" className="absolute left-4 top-2 text-xs text-gray-500 peer-focus:text-[#5f6FFF] transition-all pointer-events-none peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-xs">Title</label>
                </div>
                {/* Category Field with Floating Label */}
                <div className="relative">
                  <select
                    id="post-category"
                    value={newPost.category}
                    onChange={e => setNewPost({ ...newPost, category: e.target.value })}
                    className="peer block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-200 px-4 pt-6 pb-2 text-base text-gray-900 dark:text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#5f6FFF] focus:border-[#5f6FFF] transition appearance-none"
                    required
                  >
                    <option value="General">General</option>
                    <option value="Industry News">Industry News</option>
                    <option value="Wellness Tips">Wellness Tips</option>
                    <option value="Patient Stories">Patient Stories</option>
                    <option value="Tutorials">Tutorials</option>
                    <option value="Tech Innovations">Tech Innovations</option>
                    <option value="Research">Research</option>
                    <option value="Seasonal Advice">Seasonal Advice</option>
                  </select>
                  <label htmlFor="post-category" className="absolute left-4 top-2 text-xs text-gray-500 peer-focus:text-[#5f6FFF] transition-all pointer-events-none peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-xs">Type/Category</label>
                </div>
                {/* Content Field with Floating Label */}
                <div className="relative">
                  <textarea
                    id="post-content"
                    value={newPost.content}
                    onChange={e => setNewPost({ ...newPost, content: e.target.value })}
                    className="peer block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-200 px-4 pt-6 pb-2 text-base text-gray-900 dark:text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#5f6FFF] focus:border-[#5f6FFF] transition min-h-[100px] resize-vertical"
                    placeholder=" "
                    required
                  />
                  <label htmlFor="post-content" className="absolute left-4 top-2 text-xs text-gray-500 peer-focus:text-[#5f6FFF] transition-all pointer-events-none peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-xs">Content</label>
                </div>
                {/* Drag-and-drop Image Upload */}
                <div className="relative flex flex-col gap-2">
                  <label className="text-xs text-gray-500 mb-1">Upload Images</label>
                  <div
                    className="flex flex-col items-center justify-center border-2 border-dashed border-[#5f6FFF] dark:border-[#5f6FFF] rounded-lg bg-white dark:bg-gray-200 py-6 px-4 cursor-pointer hover:bg-[#f5f7ff] dark:hover:bg-[#e0e7ff] transition"
                    onClick={() => document.getElementById('post-images-input').click()}
                    onDragOver={e => { e.preventDefault(); e.stopPropagation(); }}
                    onDrop={e => {
                      e.preventDefault();
                      const files = Array.from(e.dataTransfer.files);
                      setNewPost(prev => ({ ...prev, images: [...(prev.images || []), ...files] }));
                    }}
                  >
                    <input
                      id="post-images-input"
                      type="file"
                      multiple
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={e => {
                        const files = Array.from(e.target.files);
                        setNewPost(prev => ({ ...prev, images: [...(prev.images || []), ...files] }));
                      }}
                    />
                    <span className="text-[#5f6FFF] font-semibold mb-1">Click or Drag & Drop Images</span>
                    <span className="text-xs text-gray-400">(JPG, PNG, GIF, max 5MB each)</span>
                  </div>
                  {newPost.images && newPost.images.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {newPost.images.map((file, idx) => {
                        let src = '';
                        if (typeof file === 'string') {
                          // Existing image URL from backend
                          src = file.startsWith('http') ? file : `http://localhost:4000${file}`;
                        } else if (file instanceof File) {
                          src = URL.createObjectURL(file);
                        }
                        return (
                          <img
                            key={idx}
                            src={src}
                            alt={`preview-${idx}`}
                            className="w-16 h-16 object-cover rounded border border-gray-300"
                          />
                        );
                      })}
                    </div>
                  )}
                </div>
                {/* Tags Field with Floating Label */}
                <div className="relative">
                  <input
                    type="text"
                    id="post-tags"
                    value={newPost.tags.join(', ')}
                    onChange={e => setNewPost({ ...newPost, tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean) })}
                    className="peer block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-200 px-4 pt-6 pb-2 text-base text-gray-900 dark:text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#5f6FFF] focus:border-[#5f6FFF] transition"
                    placeholder=" "
                  />
                  <label htmlFor="post-tags" className="absolute left-4 top-2 text-xs text-gray-500 peer-focus:text-[#5f6FFF] transition-all pointer-events-none peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-xs">Tags (comma separated)</label>
                </div>
                {postError && <div className="text-red-500 mb-2">{postError}</div>}
                <button
                  type="submit"
                  className="bg-[#5f6FFF] hover:bg-[#6c5ce7] text-white font-bold py-3 px-4 rounded-lg w-full mt-2 shadow transition disabled:opacity-60 disabled:cursor-not-allowed"
                  disabled={posting}
                >
                  {posting ? (editingPostId ? 'Updating...' : 'Publishing...') : (editingPostId ? 'Update' : 'Publish')}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {loading && <div className="text-center text-lg text-gray-400 mt-8">Loading blog posts...</div>}
      {error && <div className="text-center text-lg text-red-500 mt-8">{error}</div>}
    </motion.div>
  );
};

export default Blog;
