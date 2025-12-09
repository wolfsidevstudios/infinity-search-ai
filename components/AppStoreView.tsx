import React, { useEffect, useState } from 'react';
import { AppStoreApp } from '../types';
import { fetchTopApps } from '../services/appStoreService';
import { Star, Download } from 'lucide-react';

const AppStoreView: React.FC = () => {
  const [apps, setApps] = useState<AppStoreApp[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
        const data = await fetchTopApps();
        setApps(data);
        setLoading(false);
    };
    load();
  }, []);

  if (loading) {
      return <div className="h-64 flex items-center justify-center text-zinc-500">Loading App Store...</div>;
  }

  return (
    <div className="w-full">
        <h2 className="text-2xl font-bold text-white mb-6">Top Charts: US App Store</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {apps.map((app) => (
                <a 
                    key={app.id} 
                    href={app.link}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-4 bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800/50 rounded-2xl p-4 transition-all group"
                >
                    <div className="relative shrink-0">
                        <img src={app.image} alt={app.title} className="w-16 h-16 rounded-xl shadow-lg group-hover:scale-105 transition-transform" />
                        <div className="absolute -top-2 -left-2 w-6 h-6 bg-black border border-zinc-700 rounded-full flex items-center justify-center text-[10px] font-bold text-white">
                            {app.rank}
                        </div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-white font-bold truncate mb-1">{app.title}</h3>
                        <p className="text-zinc-500 text-xs truncate mb-2">{app.category}</p>
                        <div className="flex items-center gap-1 text-[10px] text-zinc-400">
                            {app.rating && (
                                <div className="flex items-center gap-0.5 text-yellow-500">
                                    <Star size={10} fill="currentColor" /> {app.rating.toFixed(1)}
                                </div>
                            )}
                            <span className="ml-auto bg-blue-600/20 text-blue-400 px-2 py-0.5 rounded-full font-bold">GET</span>
                        </div>
                    </div>
                </a>
            ))}
        </div>
    </div>
  );
};

export default AppStoreView;
