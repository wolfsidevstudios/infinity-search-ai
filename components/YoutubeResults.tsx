import React, { useEffect, useState } from 'react';
import { searchYoutube } from '../services/youtubeService';
import { MediaItem } from '../types';
import { Play, Youtube, X, Bookmark, Check } from 'lucide-react';

interface YoutubeResultsProps {
  query: string;
  onSave: (item: any) => void;
}

const YoutubeResults: React.FC<YoutubeResultsProps> = ({ query, onSave }) => {
  const [videos, setVideos] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<MediaItem | null>(null);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!query) return;
    const loadVideos = async () => {
      setLoading(true);
      const results = await searchYoutube(query);
      setVideos(results);
      setLoading(false);
    };
    loadVideos();
  }, [query]);

  const handleSave = (video: MediaItem) => {
      onSave({ type: 'video', content: video });
      setSavedIds(prev => new Set(prev).add(String(video.id)));
      setTimeout(() => {
          setSavedIds(prev => {
              const next = new Set(prev);
              next.delete(String(video.id));
              return next;
          });
      }, 2000);
  };

  // Handle HTML entities in titles (basic decode)
  const decodeHtml = (html: string) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  if (loading) {
      return (
          <div className="w-full py-12 flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                  <div className="w-10 h-10 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin"></div>
                  <span className="text-zinc-500 text-sm">Searching YouTube...</span>
              </div>
          </div>
      );
  }

  if (videos.length === 0) return null;

  return (
    <div className="w-full mt-10 animate-slideUp">
        <div className="flex items-center gap-3 mb-6 px-1">
            <div className="w-10 h-10 bg-red-600/10 rounded-full flex items-center justify-center text-red-500 border border-red-500/20">
                <Youtube size={20} />
            </div>
            <h3 className="text-2xl font-bold text-white">Videos</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
            {videos.map((video) => (
                <div 
                    key={video.id}
                    className="group flex flex-col gap-3 cursor-pointer"
                    onClick={() => setSelectedVideo(video)}
                >
                    {/* Thumbnail Container */}
                    <div className="relative aspect-video rounded-2xl overflow-hidden bg-zinc-900 shadow-md group-hover:shadow-2xl transition-all duration-300 group-hover:scale-[1.02]">
                        <img 
                            src={video.thumbnailUrl} 
                            alt={video.title} 
                            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500" 
                        />
                        
                        {/* Dark Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />

                        {/* Play Button - Centered */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100">
                            <div className="w-14 h-14 bg-red-600/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                                <Play size={24} className="text-white fill-white ml-1" />
                            </div>
                        </div>

                        {/* Save Button - Top Right */}
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                handleSave(video);
                            }}
                            className="absolute top-3 right-3 w-9 h-9 bg-black/40 hover:bg-blue-600 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-2 group-hover:translate-y-0"
                            title="Save to Collections"
                        >
                            {savedIds.has(String(video.id)) ? <Check size={16} /> : <Bookmark size={16} />}
                        </button>

                        {/* Source Badge - Bottom Right */}
                        <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-sm px-2 py-0.5 rounded-md text-[10px] font-bold text-white/90">
                            YouTube
                        </div>
                    </div>

                    {/* Text Info - Floating Below */}
                    <div className="flex flex-col px-1">
                        <h4 className="text-white font-bold text-base leading-snug line-clamp-2 group-hover:text-red-400 transition-colors">
                            {decodeHtml(video.title)}
                        </h4>
                        <div className="flex items-center justify-between mt-1.5">
                            <span className="text-zinc-400 text-xs font-medium hover:text-white transition-colors">{video.artist}</span>
                            {video.data?.publishTime && (
                                <span className="text-zinc-600 text-[10px] bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">
                                    {new Date(video.data.publishTime).getFullYear()}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>

        {/* Video Modal */}
        {selectedVideo && (
            <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8" onClick={() => setSelectedVideo(null)}>
                <div className="relative w-full max-w-6xl aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border border-zinc-800 animate-slideUp" onClick={e => e.stopPropagation()}>
                    <button 
                        onClick={() => setSelectedVideo(null)}
                        className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/60 hover:bg-red-600 text-white rounded-full flex items-center justify-center backdrop-blur-md transition-colors"
                    >
                        <X size={20} />
                    </button>
                    <iframe 
                        src={`https://www.youtube.com/embed/${selectedVideo.id}?autoplay=1`} 
                        title={selectedVideo.title}
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                    ></iframe>
                </div>
            </div>
        )}
    </div>
  );
};

export default YoutubeResults;