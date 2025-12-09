import React, { useEffect, useState } from 'react';
import { searchYoutube } from '../services/youtubeService';
import { MediaItem } from '../types';
import { Play, Youtube, X } from 'lucide-react';

interface YoutubeResultsProps {
  query: string;
}

const YoutubeResults: React.FC<YoutubeResultsProps> = ({ query }) => {
  const [videos, setVideos] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<MediaItem | null>(null);

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
    <div className="w-full mt-8 animate-slideUp">
        <div className="flex items-center gap-3 mb-6 px-2">
            <div className="w-10 h-10 bg-red-600/20 rounded-xl flex items-center justify-center text-red-500 border border-red-500/30">
                <Youtube size={24} />
            </div>
            <h3 className="text-2xl font-bold text-white">Related Videos</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
                <div 
                    key={video.id}
                    className="group bg-zinc-900 border border-zinc-800 rounded-[24px] overflow-hidden hover:border-zinc-600 hover:shadow-xl transition-all cursor-pointer duration-300 hover:-translate-y-1"
                    onClick={() => setSelectedVideo(video)}
                >
                    <div className="relative aspect-video bg-black">
                        <img 
                            src={video.thumbnailUrl} 
                            alt={video.title} 
                            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500" 
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                            <div className="w-14 h-14 bg-red-600/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <Play size={24} className="text-white fill-white ml-1" />
                            </div>
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs font-bold text-white">
                            YouTube
                        </div>
                    </div>
                    <div className="p-5">
                        <h4 className="text-white font-bold text-lg leading-tight mb-2 line-clamp-2 group-hover:text-red-400 transition-colors">
                            {decodeHtml(video.title)}
                        </h4>
                        <div className="flex items-center justify-between text-zinc-500 text-xs font-medium">
                            <span>{video.artist}</span>
                            {video.data?.publishTime && (
                                <span>{new Date(video.data.publishTime).getFullYear()}</span>
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