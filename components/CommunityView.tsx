import React, { useEffect, useState, useRef } from 'react';
import { CommunityPost } from '../types';
import { fetchPosts, createPost, searchPosts, likePost } from '../services/communityService';
import { User } from '@supabase/supabase-js';
import { Image as ImageIcon, Send, Hash, Heart, MessageCircle, Share2, MoreHorizontal, Search } from 'lucide-react';

interface CommunityViewProps {
  user: User | null;
  initialQuery?: string;
}

const CommunityView: React.FC<CommunityViewProps> = ({ user, initialQuery }) => {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Compose State
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadPosts();
  }, [initialQuery]);

  const loadPosts = async () => {
    setLoading(true);
    let data = [];
    if (initialQuery) {
        data = await searchPosts(initialQuery);
    } else {
        data = await fetchPosts();
    }
    setPosts(data);
    setLoading(false);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handlePost = async () => {
    if (!content.trim() && !imageFile) return;
    if (!user) {
        alert("Please sign in to post to the community.");
        return;
    }

    setIsPosting(true);
    
    // Extract hashtags
    const hashtags = content.match(/#[a-z0-9_]+/gi) || [];
    
    const newPost = await createPost(content, hashtags as string[], imageFile || undefined, user);
    
    if (newPost) {
      setPosts(prev => [newPost, ...prev]);
      setContent('');
      setImageFile(null);
      setImagePreview(null);
    }
    
    setIsPosting(false);
  };

  const handleLike = async (post: CommunityPost) => {
      // Optimistic update
      setPosts(prev => prev.map(p => p.id === post.id ? { ...p, likes_count: p.likes_count + 1 } : p));
      await likePost(post.id, post.likes_count);
  };

  const formatDate = (dateStr: string) => {
      const date = new Date(dateStr);
      const now = new Date();
      const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
      
      if (diffSeconds < 60) return 'Just now';
      if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m`;
      if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}h`;
      return date.toLocaleDateString();
  };

  return (
    <div className="w-full max-w-2xl mx-auto pb-20 animate-slideUp">
      
      {/* Header */}
      <div className="sticky top-0 bg-black/80 backdrop-blur-xl border-b border-zinc-800 z-30 px-4 py-4 flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Infinity Community</h2>
          {initialQuery && (
              <div className="text-sm text-blue-400 font-medium flex items-center gap-1">
                  <Search size={14} /> Result for "{initialQuery}"
              </div>
          )}
      </div>

      {/* Compose Box */}
      {!initialQuery && (
          <div className="px-4 mb-8">
            <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shrink-0">
                    {user?.user_metadata?.avatar_url ? (
                        <img src={user.user_metadata.avatar_url} className="w-full h-full rounded-full object-cover" />
                    ) : (
                        user?.email?.[0].toUpperCase() || '?'
                    )}
                </div>
                <div className="flex-1">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="What's happening in your world?"
                        className="w-full bg-transparent text-white text-lg placeholder-zinc-500 outline-none resize-none min-h-[100px]"
                    />
                    
                    {imagePreview && (
                        <div className="relative mb-4 rounded-2xl overflow-hidden max-h-80 w-fit">
                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                            <button 
                                onClick={() => { setImageFile(null); setImagePreview(null); }}
                                className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 hover:bg-red-500 transition-colors"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                            </button>
                        </div>
                    )}

                    <div className="flex items-center justify-between border-t border-zinc-800 pt-4">
                        <div className="flex gap-2 text-blue-400">
                            <button onClick={() => fileInputRef.current?.click()} className="p-2 hover:bg-blue-500/10 rounded-full transition-colors">
                                <ImageIcon size={20} />
                            </button>
                            <button className="p-2 hover:bg-blue-500/10 rounded-full transition-colors">
                                <Hash size={20} />
                            </button>
                            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageSelect} />
                        </div>
                        <button 
                            onClick={handlePost}
                            disabled={isPosting || (!content && !imageFile)}
                            className={`px-5 py-2 rounded-full font-bold text-sm transition-all ${
                                isPosting || (!content && !imageFile) 
                                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                                : 'bg-blue-500 text-white hover:bg-blue-600'
                            }`}
                        >
                            {isPosting ? 'Posting...' : 'Post'}
                        </button>
                    </div>
                </div>
            </div>
          </div>
      )}

      {/* Feed */}
      <div className="border-t border-zinc-800">
          {loading ? (
              <div className="py-10 text-center text-zinc-500">Loading community...</div>
          ) : posts.length === 0 ? (
              <div className="py-10 text-center text-zinc-500">No posts yet. Be the first!</div>
          ) : (
              posts.map((post) => (
                  <div key={post.id} className="p-4 border-b border-zinc-800 hover:bg-zinc-900/30 transition-colors cursor-pointer animate-fadeIn">
                      <div className="flex gap-4">
                          <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 overflow-hidden shrink-0">
                              {post.author_avatar ? (
                                  <img src={post.author_avatar} className="w-full h-full object-cover" />
                              ) : (
                                  post.author_name?.[0].toUpperCase()
                              )}
                          </div>
                          <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                  <div className="flex items-center gap-2 overflow-hidden">
                                      <span className="font-bold text-white truncate">{post.author_name}</span>
                                      <span className="text-zinc-500 text-sm truncate">@{post.author_name?.replace(/\s+/g, '').toLowerCase()}</span>
                                      <span className="text-zinc-600 text-xs">• {formatDate(post.created_at)}</span>
                                  </div>
                                  <button className="text-zinc-500 hover:text-blue-400">
                                      <MoreHorizontal size={16} />
                                  </button>
                              </div>
                              
                              <p className="text-white/90 text-[15px] whitespace-pre-wrap leading-relaxed mb-3">
                                  {post.content}
                              </p>

                              {post.image_url && (
                                  <div className="mb-3 rounded-2xl overflow-hidden border border-zinc-800 max-h-[500px]">
                                      <img src={post.image_url} alt="Post media" className="w-full h-full object-cover" />
                                  </div>
                              )}

                              <div className="flex items-center justify-between text-zinc-500 max-w-md mt-3">
                                  <button className="flex items-center gap-2 group hover:text-blue-400 transition-colors">
                                      <div className="p-2 rounded-full group-hover:bg-blue-500/10 transition-colors">
                                          <MessageCircle size={18} />
                                      </div>
                                      <span className="text-xs">0</span>
                                  </button>
                                  <button 
                                    onClick={() => handleLike(post)}
                                    className="flex items-center gap-2 group hover:text-pink-500 transition-colors"
                                  >
                                      <div className="p-2 rounded-full group-hover:bg-pink-500/10 transition-colors">
                                          <Heart size={18} />
                                      </div>
                                      <span className="text-xs">{post.likes_count}</span>
                                  </button>
                                  <button className="flex items-center gap-2 group hover:text-green-400 transition-colors">
                                      <div className="p-2 rounded-full group-hover:bg-green-500/10 transition-colors">
                                          <Share2 size={18} />
                                      </div>
                                  </button>
                              </div>
                          </div>
                      </div>
                  </div>
              ))
          )}
      </div>
    </div>
  );
};

export default CommunityView;