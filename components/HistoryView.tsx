import React from 'react';
import { HistoryItem } from '../types';
import { Clock, Search, FileText, ArrowRight } from 'lucide-react';

interface HistoryViewProps {
  history: HistoryItem[];
  onSelectItem: (item: HistoryItem) => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ history, onSelectItem }) => {
  return (
    <div className="w-full max-w-4xl mx-auto pb-20 animate-slideUp px-4">
      <div className="mb-8 text-white">
        <h2 className="text-4xl font-bold mb-2">History</h2>
        <p className="opacity-70 text-lg font-light">Your journey through knowledge.</p>
      </div>

      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-white/40">
            <Clock size={64} className="mb-4 opacity-50" />
            <p className="text-xl">No history yet.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {history.map((item) => (
            <div 
              key={item.id}
              onClick={() => onSelectItem(item)}
              className="group flex flex-col bg-white/10 hover:bg-white/15 backdrop-blur-xl border border-white/10 p-6 rounded-[40px] cursor-pointer transition-all duration-300 hover:scale-[1.01] hover:shadow-xl relative overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3 z-10">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.type === 'search' ? 'bg-blue-500/20 text-blue-300' : 'bg-purple-500/20 text-purple-300'}`}>
                        {item.type === 'search' ? <Search size={18} /> : <FileText size={18} />}
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-lg leading-tight">{item.title}</h3>
                        <div className="text-white/40 text-xs font-light">
                             {item.timestamp.toLocaleDateString()} • {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                    </div>
                  </div>
                  
                  <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/30 group-hover:text-white group-hover:bg-white/20 transition-all">
                    <ArrowRight size={16} />
                  </div>
              </div>

              {/* Summary Snippet */}
              {item.summary && (
                  <div className="mb-4 pl-[52px] z-10">
                      <p className="text-white/70 text-sm font-light leading-relaxed line-clamp-2">
                          {item.summary}
                      </p>
                  </div>
              )}

              {/* Sources Snippet */}
              {item.sources && item.sources.length > 0 && (
                  <div className="flex items-center gap-2 pl-[52px] z-10">
                      {item.sources.slice(0, 5).map((source, idx) => (
                          <div key={idx} className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center overflow-hidden border border-white/10" title={source.title}>
                              <img 
                                src={`https://www.google.com/s2/favicons?domain=${source.hostname}&sz=32`} 
                                alt="icon" 
                                className="w-3.5 h-3.5 object-contain opacity-80"
                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                              />
                          </div>
                      ))}
                      {item.sources.length > 5 && (
                          <span className="text-xs text-white/40">+{item.sources.length - 5}</span>
                      )}
                  </div>
              )}
              
              {/* Subtle gradient background on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryView;
