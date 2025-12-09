import React, { useEffect, useState, useRef } from 'react';
import { CommunityPost } from '../types';
import { fetchPosts, createPost, searchPosts, likePost, fetchPostById } from '../services/communityService';
import { User } from '@supabase/supabase-js';
import { Image as ImageIcon, Send, Hash, Heart, MessageCircle, Share2, MoreHorizontal, Search, X, Copy, Facebook, Link as LinkIcon, ArrowLeft, Download } from 'lucide-react';

interface CommunityViewProps {
  user: User | null;
  initialQuery?: string;
  initialPostId?: string | null;
}

const INFINITY_LOGO_URL = 'https://i.ibb.co/pjtXDLqZ/Google-AI-Studio-2025-12-06-T01-46-54-593-Z-modified.png';

const CommunityView: React.FC<CommunityViewProps> = ({ user, initialQuery, initialPostId }) => {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Compose State
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  
  // Share State
  const [sharePost, setSharePost] = useState<CommunityPost | null>(null);
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadPosts();
  }, [initialQuery, initialPostId]);

  const loadPosts = async () => {
    setLoading(true);
    let data = [];
    
    if (initialPostId) {
        const singlePost = await fetchPostById(initialPostId);
        if (singlePost) {
            data = [singlePost];
        } else {
            // Fallback if ID invalid
            data = await fetchPosts();
        }
    } else if (initialQuery) {
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

  const handleCopyLink = () => {
      if (!sharePost) return;
      const url = `https://infinitysearch-ai.vercel.app/community/${sharePost.id}`;
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
  };

  const getQrUrl = (transparent: boolean) => {
      if (!sharePost) return '';
      const postUrl = `https://infinitysearch-ai.vercel.app/community/${sharePost.id}`;
      // Use QuickChart API for logo embedding
      // light=00000000 creates transparent background (hex + alpha)
      const bgColor = transparent ? '00000000' : 'ffffff';
      return `https://quickchart.io/qr?text=${encodeURIComponent(postUrl)}&centerImageUrl=${encodeURIComponent(INFINITY_LOGO_URL)}&centerImageSizeRatio=0.25&ecLevel=H&size=500&format=png&margin=1&light=${bgColor}`;
  };

  const handleDownloadQr = async (transparent: boolean) => {
      if (!sharePost) return;
      setIsDownloading(true);
      try {
          const url = getQrUrl(transparent);
          const response = await fetch(url);
          const blob = await response.blob();
          const objectUrl = URL.createObjectURL(blob);
          
          const link = document.createElement('a');
          link.href = objectUrl;
          link.download = `infinity-post-${sharePost.id.slice(0,8)}-qr${transparent ? '-transparent' : ''}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(objectUrl);
      } catch (e) {
          console.error("QR Download failed", e);
          window.open(getQrUrl(transparent), '_blank');
      }
      setIsDownloading(false);
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

  const clearFilters = () => {
      // Reload full feed
      if (initialPostId) {
          window.history.pushState({}, '', '/community');
          setLoading(true);
          fetchPosts().then(data => {
              setPosts(data);
              setLoading(false);
          });
      }
  };

  return (
    <div className="w-full max-w-2xl mx-auto pb-20 animate-slideUp">
      
      {/* Header */}
      <div className="sticky top-0 bg-black/80 backdrop-blur-xl border-b border-zinc-800 z-30 px-4 py-4 flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
              {initialPostId && (
                  <button onClick={clearFilters} className="mr-2 hover:bg-zinc-800 p-1 rounded-full transition-colors"><ArrowLeft size={20}/></button>
              )}
              Infinity Community
          </h2>
          {initialQuery && (
              <div className="text-sm text-blue-400 font-medium flex items-center gap-1">
                  <Search size={14} /> Result for "{initialQuery}"
              </div>
          )}
      </div>

      {/* Compose Box */}
      {!initialQuery && !initialPostId && (
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
              <div className="py-10 text-center text-zinc-500">No posts found.</div>
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
                                  <button 
                                    onClick={() => setSharePost(post)}
                                    className="flex items-center gap-2 group hover:text-green-400 transition-colors"
                                  >
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

      {/* Share Modal */}
      {sharePost && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn" onClick={() => setSharePost(null)}>
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl relative animate-slideUp" onClick={e => e.stopPropagation()}>
                <button onClick={() => setSharePost(null)} className="absolute top-4 right-4 text-zinc-500 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors">
                    <X size={20} />
                </button>
                
                <h3 className="text-xl font-bold text-white mb-6 text-center">Share Post</h3>
                
                {/* QR Code - Display with White Background for visibility in Dark Mode */}
                <div className="flex justify-center mb-6">
                    <div className="p-3 bg-white rounded-xl shadow-lg relative group">
                        <img 
                            src={getQrUrl(false)} 
                            alt="QR Code" 
                            className="w-40 h-40 object-contain" 
                        />
                    </div>
                </div>

                {/* Download Actions */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                    <button 
                        onClick={() => handleDownloadQr(false)}
                        disabled={isDownloading}
                        className="flex items-center justify-center gap-2 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-bold transition-colors disabled:opacity-50"
                    >
                        <Download size={14} /> Download PNG
                    </button>
                    <button 
                        onClick={() => handleDownloadQr(true)}
                        disabled={isDownloading}
                        className="flex items-center justify-center gap-2 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-bold transition-colors disabled:opacity-50"
                    >
                        <Download size={14} /> Transparent PNG
                    </button>
                </div>

                {/* URL Input */}
                <div className="flex items-center gap-2 bg-black border border-zinc-800 rounded-xl p-1.5 mb-6 focus-within:border-blue-500 transition-colors">
                    <div className="pl-3 pr-2 text-zinc-500">
                        <LinkIcon size={16} />
                    </div>
                    <input 
                        type="text" 
                        readOnly 
                        value={`https://infinitysearch-ai.vercel.app/community/${sharePost.id}`} 
                        className="bg-transparent text-zinc-300 text-sm flex-1 outline-none truncate font-mono"
                    />
                    <button 
                        onClick={handleCopyLink}
                        className={`p-2.5 rounded-lg text-white font-medium text-xs transition-all ${copied ? 'bg-green-600' : 'bg-zinc-800 hover:bg-zinc-700'}`}
                    >
                        {copied ? 'Copied!' : 'Copy'}
                    </button>
                </div>

                {/* Social Buttons */}
                <div className="grid grid-cols-2 gap-3">
                    <a 
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://infinitysearch-ai.vercel.app/community/${sharePost.id}`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-2 py-3 bg-[#1877F2] hover:bg-[#166fe5] text-white rounded-xl font-bold text-sm transition-colors"
                    >
                        <Facebook size={18} /> Facebook
                    </a>
                    <a 
                        href={`https://www.reddit.com/submit?url=${encodeURIComponent(`https://infinitysearch-ai.vercel.app/community/${sharePost.id}`)}&title=${encodeURIComponent("Check out this post on Infinity")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-2 py-3 bg-[#FF4500] hover:bg-[#e03d00] text-white rounded-xl font-bold text-sm transition-colors"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/></svg>
                        Reddit
                    </a>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default CommunityView;