
import React, { useEffect, useState, useRef } from 'react';
import { CommunityPost } from '../types';
import { fetchPosts, createPost, searchPosts, likePost, fetchPostById } from '../services/communityService';
import { chatWithGemini } from '../services/geminiService';
import { User } from '@supabase/supabase-js';
import { Image as ImageIcon, Send, Hash, Heart, MessageCircle, Share2, MoreHorizontal, Search, X, Copy, Facebook, Link as LinkIcon, ArrowLeft, Download, Zap, Pin, AlertTriangle, Newspaper, Users, Gift, Wand2, Sparkles, BrainCircuit, Layout, Database, ShieldCheck } from 'lucide-react';

interface CommunityViewProps {
  user: User | null;
  initialQuery?: string;
  initialPostId?: string | null;
}

const INFINITY_LOGO_URL = 'https://i.ibb.co/pjtXDLqZ/Google-AI-Studio-2025-12-06-T01-46-54-593-Z-modified.png';

const NEW_MODEL_CHAT_POST: CommunityPost = {
  id: 'new-model-chat-launch',
  user_id: 'infinity-official',
  content: "🚀 **Introducing the New Infinity Chat & AI Model**\n\nWe've completely reimagined the conversation experience. The new **Chat Page** is now live, featuring a floating input interface and deep integration with your App Data.\n\n**Meet the New Model:**\nOur latest reasoning engine is smarter, faster, and more context-aware. It knows your weather, collections, and can use widgets like Calculator and Clock directly in the chat.\n\n**What's New:**\n• 💬 **Dedicated Chat Interface**: Distraction-free deep thinking.\n• 🧠 **App Context**: The AI now understands your saved collections.\n• ⚡ **Widget Support**: Ask for a calculator or timer instantly.\n\nTry it out by clicking the \"New Chat\" button in the sidebar!",
  hashtags: ['#Update', '#AI', '#NewFeatures', '#InfinityOS'],
  created_at: new Date(Date.now() + 40000).toISOString(),
  likes_count: 842,
  author_name: 'Infinity HQ',
  author_avatar: INFINITY_LOGO_URL,
  image_url: 'https://images.unsplash.com/photo-1676299081847-824916de030a?q=80&w=1974&auto=format&fit=crop'
};

const PRESS_RELEASE_POST: CommunityPost = {
  id: 'infinity-os-26-release',
  user_id: 'infinity-official',
  content: "📣 **Press Release: Why Infinity OS 26.0?**\n\nToday marks a significant shift in our release strategy. We are officially rebranding our versioning from 2.0 to **Infinity OS 26.0**.\n\n**Why the jump?**\nWe believe software versions should be intuitive. By aligning our major release number with the year (2026), you will instantly know if your system is current without guessing if \"v2.4\" is newer than \"v2.3.9\".\n\n**What's New in 26.0:**\n• Complete UI overhaul to \"Spatial Glass\" design.\n• Local-first architecture for privacy.\n\n**Coming Soon:**\nInfinity OS 26.1 is already in the works with revolutionary features. Check Settings for a sneak peek.",
  hashtags: ['#InfinityOS', '#Rebrand', '#Update'],
  created_at: new Date(Date.now() + 20000).toISOString(), 
  likes_count: 15402,
  author_name: 'Infinity HQ',
  author_avatar: INFINITY_LOGO_URL,
  image_url: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1974&auto=format&fit=crop'
};

const ANNOUNCEMENT_POST: CommunityPost = {
  id: 'official-announcement-dev',
  user_id: 'infinity-official',
  content: "🚀 Upcoming Updates!\n\nWe're actively working to improve the Infinity app. Our focus isn't just on the UI, but on making sure the app is completely error-free and bug-free, while making animations much smoother.\n\nThese improvements will be rolling out in future updates.\n\n🛠️ Plus, the Developer Console is coming soon in the following weeks! Stay tuned.",
  hashtags: ['#roadmap', '#bugfree', '#developerconsole', '#infinity'],
  created_at: new Date(Date.now() + 10000).toISOString(),
  likes_count: 2048,
  author_name: 'Infinity Team',
  author_avatar: INFINITY_LOGO_URL,
  image_url: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=2070&auto=format&fit=crop'
};

const NOTION_UPDATE_POST: CommunityPost = {
  id: 'official-notion-update',
  user_id: 'infinity-official',
  content: "⚠️ Important Notice: Notion Integration\n\nAs we streamline our architecture to focus on local-first privacy and speed, the Notion integration will be discontinued in upcoming updates.\n\nWe are developing a new, faster local file connector to replace it, ensuring your data remains completely on your device.",
  hashtags: ['#update', '#notion', '#privacy'],
  created_at: new Date().toISOString(),
  likes_count: 892,
  author_name: 'Infinity Team',
  author_avatar: INFINITY_LOGO_URL,
};

const DROPS_26_0 = [
    {
        title: "Deep Think 2.0 Engine",
        desc: "Our new reasoning kernel breaks down complex queries into steps, verifies facts, and synthesizes answers with citations.",
        icon: BrainCircuit,
        color: "text-purple-400",
        bg: "bg-purple-500/10"
    },
    {
        title: "Infinity Chat Experience",
        desc: "A dedicated conversational interface separate from search, featuring app context awareness and persistent history.",
        icon: MessageCircle,
        color: "text-blue-400",
        bg: "bg-blue-500/10"
    },
    {
        title: "Spatial Glass UI",
        desc: "A complete visual overhaul introducing a refined dark mode, glassmorphism effects, and fluid physics animations.",
        icon: Layout,
        color: "text-pink-400",
        bg: "bg-pink-500/10"
    },
    {
        title: "Widget Ecosystem",
        desc: "Interactive widgets for weather, stocks, and tools like calculators directly within search results and chat.",
        icon: Zap,
        color: "text-yellow-400",
        bg: "bg-yellow-500/10"
    },
    {
        title: "Local-First Privacy",
        desc: "Enhanced privacy architecture where search history and app tokens are encrypted and stored locally on your device.",
        icon: ShieldCheck,
        color: "text-green-400",
        bg: "bg-green-500/10"
    },
    {
        title: "Database Connectors",
        desc: "Beta support for connecting custom MCP servers and local databases via the Developer Console.",
        icon: Database,
        color: "text-orange-400",
        bg: "bg-orange-500/10"
    }
];

const CommunityView: React.FC<CommunityViewProps> = ({ user, initialQuery, initialPostId }) => {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'community' | 'press' | 'drops'>('community');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Compose State
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  
  // Share State
  const [sharePost, setSharePost] = useState<CommunityPost | null>(null);
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPro, setIsPro] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadPosts();
    const status = localStorage.getItem('infinity_pro_status');
    if (status === 'active') setIsPro(true);
  }, [initialQuery, initialPostId]);

  const loadPosts = async () => {
    setLoading(true);
    let data = [];
    
    // Official posts array
    const officialPosts = [NEW_MODEL_CHAT_POST, PRESS_RELEASE_POST, ANNOUNCEMENT_POST, NOTION_UPDATE_POST];

    if (initialPostId) {
        const singlePost = await fetchPostById(initialPostId);
        if (singlePost) {
            data = [singlePost];
        } else {
            data = await fetchPosts();
            data = [...officialPosts, ...data];
        }
    } else if (initialQuery) {
        data = await searchPosts(initialQuery);
    } else {
        data = await fetchPosts();
        // Prepend official posts
        data = [...officialPosts, ...data];
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

  const handleAiEnhance = async (type: 'fix' | 'tone' | 'expand') => {
      if (!content.trim()) return;
      setIsEnhancing(true);
      
      let prompt = "";
      if (type === 'fix') prompt = `Fix grammar and spelling mistakes in this text, keep it natural: "${content}"`;
      if (type === 'tone') prompt = `Rewrite this text to sound more exciting and engaging for a social media post: "${content}"`;
      if (type === 'expand') prompt = `Expand this short thought into a slightly more detailed paragraph: "${content}"`;

      try {
          const enhancedText = await chatWithGemini(
              [{ role: 'user', parts: [{ text: prompt }] }], 
              'gemini-2.0-flash', 
              'You are a helpful writing assistant. Return ONLY the enhanced text, no explanations.'
          );
          setContent(enhancedText.replace(/^"|"$/g, ''));
      } catch (e) {
          console.error("AI Enhance failed", e);
      } finally {
          setIsEnhancing(false);
      }
  };

  const handlePost = async () => {
    if (!content.trim() && !imageFile) return;
    if (!user) {
        alert("Please sign in to post to the community.");
        return;
    }

    setIsPosting(true);
    
    const hashtags = content.match(/#[a-z0-9_]+/gi) || [];
    
    const newPost = await createPost(content, hashtags as string[], imageFile || undefined, user);
    
    if (newPost) {
      setPosts(prev => {
          const officials = prev.filter(p => p.user_id === 'infinity-official');
          const others = prev.filter(p => p.user_id !== 'infinity-official');
          return [...officials, newPost, ...others];
      });
      setContent('');
      setImageFile(null);
      setImagePreview(null);
    }
    
    setIsPosting(false);
  };

  const handleLike = async (post: CommunityPost) => {
      setPosts(prev => prev.map(p => p.id === post.id ? { ...p, likes_count: p.likes_count + 1 } : p));
      if (post.user_id !== 'infinity-official') {
          await likePost(post.id, post.likes_count);
      }
  };

  const handleHype = async (post: CommunityPost) => {
      if (!isPro) return alert("Hyping posts is an Infinity Pro feature!");
      setPosts(prev => prev.map(p => p.id === post.id ? { ...p, likes_count: p.likes_count + 5 } : p));
      if (post.user_id !== 'infinity-official') {
          await likePost(post.id, post.likes_count + 4); 
      }
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
      const optimizedLogoUrl = `https://wsrv.nl/?url=i.ibb.co/pjtXDLqZ/Google-AI-Studio-2025-12-06-T01-46-54-593-Z-modified.png&w=200&output=png`;
      const bgColor = transparent ? '00000000' : 'ffffff';
      return `https://quickchart.io/qr?text=${encodeURIComponent(postUrl)}&centerImageUrl=${encodeURIComponent(optimizedLogoUrl)}&centerImageSizeRatio=0.25&ecLevel=H&size=500&format=png&margin=1&light=${bgColor}`;
  };

  const handleDownloadQr = async (transparent: boolean) => {
      if (!sharePost) return;
      setIsDownloading(true);
      try {
          const url = getQrUrl(transparent);
          const response = await fetch(url);
          if (!response.ok) throw new Error("Failed to fetch QR");
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
      if (initialPostId) {
          window.history.pushState({}, '', '/community');
          setLoading(true);
          const officialPosts = [NEW_MODEL_CHAT_POST, PRESS_RELEASE_POST, ANNOUNCEMENT_POST, NOTION_UPDATE_POST];
          fetchPosts().then(data => {
              setPosts([...officialPosts, ...data]);
              setLoading(false);
          });
      }
  };

  // Filter Posts Logic
  const displayPosts = posts.filter(post => {
      const matchesSearch = searchQuery 
          ? post.content.toLowerCase().includes(searchQuery.toLowerCase()) || post.author_name?.toLowerCase().includes(searchQuery.toLowerCase())
          : true;
          
      if (!matchesSearch) return false;

      const isOfficial = post.user_id === 'infinity-official';
      if (activeTab === 'press') return isOfficial;
      // In community tab, show everything or just user posts? Let's show user posts primarily but official ones pinned.
      // For clarity based on prompts: Community = User Content, Press = Official content.
      return !isOfficial; 
  });

  return (
    <div className="w-full max-w-2xl mx-auto pb-20 animate-slideUp">
      
      {/* Header Area */}
      <div className="sticky top-0 bg-black/80 backdrop-blur-xl border-b border-zinc-800 z-30 px-4 pt-4 pb-2 flex flex-col gap-4 mb-6 transition-all">
          <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  {initialPostId && (
                      <button onClick={clearFilters} className="mr-2 hover:bg-zinc-800 p-1 rounded-full transition-colors"><ArrowLeft size={20}/></button>
                  )}
                  Community
              </h2>
              {initialQuery && (
                  <div className="text-sm text-blue-400 font-medium flex items-center gap-1">
                      <Search size={14} /> Result for "{initialQuery}"
                  </div>
              )}
          </div>

          {/* Search Bar */}
          <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
              <input 
                  type="text" 
                  placeholder="Search posts..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-full py-2 pl-10 pr-4 text-sm text-white focus:border-zinc-700 outline-none transition-colors placeholder-zinc-600"
              />
          </div>

          {/* Pill-Shaped Tab Switcher */}
          <div className="flex p-1 bg-zinc-900 rounded-full border border-zinc-800">
              <button 
                onClick={() => setActiveTab('community')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'community' ? 'bg-zinc-800 text-white shadow-sm ring-1 ring-white/10' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                  <Users size={14} /> Community
              </button>
              <button 
                onClick={() => setActiveTab('press')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'press' ? 'bg-zinc-800 text-white shadow-sm ring-1 ring-white/10' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                  <Newspaper size={14} /> Press
              </button>
              <button 
                onClick={() => setActiveTab('drops')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'drops' ? 'bg-zinc-800 text-white shadow-sm ring-1 ring-white/10' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                  <Gift size={14} /> Drops
              </button>
          </div>
      </div>

      {/* DROPS TAB CONTENT */}
      {activeTab === 'drops' && (
          <div className="px-4 animate-fadeIn">
              <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">Infinity OS 26.0</h3>
                  <p className="text-zinc-500 text-sm">Monthly Drop • February 2025</p>
              </div>
              
              <div className="space-y-4">
                  {DROPS_26_0.map((drop, idx) => (
                      <div key={idx} className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 flex gap-4 hover:bg-zinc-900 transition-colors cursor-default">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${drop.bg} ${drop.color}`}>
                              <drop.icon size={24} />
                          </div>
                          <div>
                              <h4 className={`text-lg font-bold mb-1 ${drop.color}`}>{drop.title}</h4>
                              <p className="text-zinc-400 text-sm leading-relaxed">{drop.desc}</p>
                          </div>
                      </div>
                  ))}
              </div>
              
              <div className="mt-12 p-6 bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-3xl border border-white/5 text-center">
                  <h4 className="text-white font-bold mb-2">Missed previous drops?</h4>
                  <p className="text-zinc-500 text-sm mb-4">Check the archive to see how Infinity has evolved.</p>
                  <button className="px-6 py-2 bg-zinc-800 text-white rounded-full text-sm font-bold hover:bg-zinc-700 transition-colors">View Archive</button>
              </div>
          </div>
      )}

      {/* COMMUNITY TAB CONTENT */}
      {activeTab !== 'drops' && (
        <>
            {/* Compose Box (Only visible in Community Tab) */}
            {!initialQuery && !initialPostId && activeTab === 'community' && (
                <div className="px-4 mb-8">
                    <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shrink-0 shadow-lg">
                            {user?.user_metadata?.avatar_url ? (
                                <img src={user.user_metadata.avatar_url} className="w-full h-full rounded-full object-cover" />
                            ) : (
                                user?.email?.[0].toUpperCase() || '?'
                            )}
                        </div>
                        <div className="flex-1 bg-zinc-900/30 rounded-2xl p-4 border border-zinc-800/50 focus-within:border-zinc-700 focus-within:bg-zinc-900 transition-all">
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="What's happening in your world?"
                                className="w-full bg-transparent text-white text-base placeholder-zinc-500 outline-none resize-none min-h-[80px]"
                            />
                            
                            {imagePreview && (
                                <div className="relative mb-4 rounded-xl overflow-hidden max-h-60 w-fit animate-scaleIn border border-zinc-700">
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                    <button 
                                        onClick={() => { setImageFile(null); setImagePreview(null); }}
                                        className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 hover:bg-red-500 transition-colors"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            )}

                            {/* AI Tools */}
                            <div className="flex gap-2 overflow-x-auto py-2 mb-2 scrollbar-hide">
                                <button onClick={() => handleAiEnhance('fix')} className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800/50 hover:bg-purple-900/30 text-purple-300 text-xs rounded-lg transition-colors border border-purple-500/20 whitespace-nowrap">
                                    <Wand2 size={12} /> Fix Grammar
                                </button>
                                <button onClick={() => handleAiEnhance('tone')} className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800/50 hover:bg-blue-900/30 text-blue-300 text-xs rounded-lg transition-colors border border-blue-500/20 whitespace-nowrap">
                                    <Sparkles size={12} /> Hype It
                                </button>
                                <button onClick={() => handleAiEnhance('expand')} className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800/50 hover:bg-green-900/30 text-green-300 text-xs rounded-lg transition-colors border border-green-500/20 whitespace-nowrap">
                                    <Zap size={12} /> Expand
                                </button>
                                {isEnhancing && <div className="text-zinc-500 text-xs flex items-center animate-pulse">Thinking...</div>}
                            </div>

                            <div className="flex items-center justify-between border-t border-zinc-800 pt-3 mt-1">
                                <div className="flex gap-1 text-zinc-400">
                                    <button onClick={() => fileInputRef.current?.click()} className="p-2 hover:bg-zinc-800 hover:text-white rounded-full transition-colors">
                                        <ImageIcon size={18} />
                                    </button>
                                    <button className="p-2 hover:bg-zinc-800 hover:text-white rounded-full transition-colors">
                                        <Hash size={18} />
                                    </button>
                                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageSelect} />
                                </div>
                                <button 
                                    onClick={handlePost}
                                    disabled={isPosting || (!content && !imageFile)}
                                    className={`px-5 py-2 rounded-full font-bold text-sm transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] hover:scale-105 active:scale-95 ${
                                        isPosting || (!content && !imageFile) 
                                        ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                                        : 'bg-white text-black hover:bg-gray-200 shadow-lg'
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
                    <div className="py-10 text-center text-zinc-500">Loading {activeTab}...</div>
                ) : displayPosts.length === 0 ? (
                    <div className="py-10 text-center text-zinc-500">No posts found matching "{searchQuery}".</div>
                ) : (
                    displayPosts.map((post) => (
                        <div key={post.id} 
                            className={`p-4 border-b border-zinc-800 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] hover:bg-zinc-900/40 cursor-pointer animate-fadeIn hover:scale-[1.01] active:scale-[0.99]
                            ${post.id === NEW_MODEL_CHAT_POST.id ? 'bg-green-900/10 border-l-4 border-l-green-500' : ''}
                            ${post.id === PRESS_RELEASE_POST.id ? 'bg-zinc-900/30 border-l-4 border-l-white' : ''}
                            ${post.id === ANNOUNCEMENT_POST.id ? 'bg-blue-900/10 border-l-4 border-l-blue-500' : ''}
                            ${post.id === NOTION_UPDATE_POST.id ? 'bg-orange-900/10 border-l-4 border-l-orange-500' : ''}
                            `}
                        >
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 overflow-hidden shrink-0 shadow-md">
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
                                            
                                            {post.id === NEW_MODEL_CHAT_POST.id && (
                                                <span className="bg-green-500/20 text-green-400 text-[10px] px-1.5 py-0.5 rounded border border-green-500/30 font-bold flex items-center gap-1">
                                                    <Zap size={8} fill="currentColor" /> New Model
                                                </span>
                                            )}

                                            {post.id === PRESS_RELEASE_POST.id && (
                                                <span className="bg-white/10 text-white text-[10px] px-1.5 py-0.5 rounded border border-white/20 font-bold flex items-center gap-1">
                                                    <Zap size={8} fill="currentColor" /> Official Release
                                                </span>
                                            )}

                                            {post.id === ANNOUNCEMENT_POST.id && (
                                                <span className="bg-blue-500/20 text-blue-400 text-[10px] px-1.5 py-0.5 rounded border border-blue-500/30 font-bold flex items-center gap-1">
                                                    <Pin size={8} fill="currentColor" /> Pinned
                                                </span>
                                            )}
                                            
                                            {post.id === NOTION_UPDATE_POST.id && (
                                                <span className="bg-orange-500/20 text-orange-400 text-[10px] px-1.5 py-0.5 rounded border border-orange-500/30 font-bold flex items-center gap-1">
                                                    <AlertTriangle size={8} fill="currentColor" /> Notice
                                                </span>
                                            )}

                                            <span className="text-zinc-600 text-xs">• {formatDate(post.created_at)}</span>
                                        </div>
                                        <button className="text-zinc-500 hover:text-blue-400 p-1 rounded-full hover:bg-white/5 transition-colors">
                                            <MoreHorizontal size={16} />
                                        </button>
                                    </div>
                                    
                                    <p className="text-white/90 text-[15px] whitespace-pre-wrap leading-relaxed mb-3">
                                        {post.content}
                                    </p>

                                    {post.image_url && (
                                        <div className="mb-3 rounded-2xl overflow-hidden border border-zinc-800 max-h-[500px] shadow-lg">
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
                                            onClick={(e) => { e.stopPropagation(); handleLike(post); }}
                                            className="flex items-center gap-2 group hover:text-pink-500 transition-colors"
                                        >
                                            <div className="p-2 rounded-full group-hover:bg-pink-500/10 transition-colors">
                                                <Heart size={18} />
                                            </div>
                                            <span className="text-xs">{post.likes_count}</span>
                                        </button>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); handleHype(post); }}
                                            className={`flex items-center gap-2 group transition-colors ${isPro ? 'hover:text-yellow-400' : 'opacity-50 hover:opacity-100'}`}
                                            title={isPro ? "Hype Post" : "Upgrade to Hype"}
                                        >
                                            <div className="p-2 rounded-full group-hover:bg-yellow-500/10 transition-colors">
                                                <Zap size={18} className={isPro ? 'text-zinc-500 group-hover:text-yellow-400' : 'text-zinc-600'} fill={isPro ? 'none' : 'currentColor'} />
                                            </div>
                                        </button>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); setSharePost(post); }}
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
        </>
      )}

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
                    <div className="p-3 bg-white rounded-xl shadow-lg relative group transition-transform duration-500 hover:scale-105">
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
                        className="flex items-center justify-center gap-2 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-bold transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50"
                    >
                        <Download size={14} /> Download PNG
                    </button>
                    <button 
                        onClick={() => handleDownloadQr(true)}
                        disabled={isDownloading}
                        className="flex items-center justify-center gap-2 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-bold transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50"
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
                        className={`p-2.5 rounded-lg text-white font-medium text-xs transition-all duration-300 ${copied ? 'bg-green-600 scale-105' : 'bg-zinc-800 hover:bg-zinc-700 hover:scale-105'}`}
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
                        className="flex items-center justify-center gap-2 py-3 bg-[#1877F2] hover:bg-[#166fe5] text-white rounded-xl font-bold text-sm transition-all duration-300 hover:scale-105 active:scale-95"
                    >
                        <Facebook size={18} /> Facebook
                    </a>
                    <a 
                        href={`https://www.reddit.com/submit?url=${encodeURIComponent(`https://infinitysearch-ai.vercel.app/community/${sharePost.id}`)}&title=${encodeURIComponent("Check out this post on Infinity")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-2 py-3 bg-[#FF4500] hover:bg-[#e03d00] text-white rounded-xl font-bold text-sm transition-all duration-300 hover:scale-105 active:scale-95"
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
