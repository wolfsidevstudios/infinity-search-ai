
import React from 'react';
import { MediaItem } from '../types';
import { FileText, Calendar, ExternalLink, Hash } from 'lucide-react';

interface NotionResultsViewProps {
  items: MediaItem[];
  query: string;
}

const NotionResultsView: React.FC<NotionResultsViewProps> = ({ items, query }) => {
  if (!items.length) return null;

  return (
    <div className="w-full max-w-5xl mx-auto pb-20 animate-slideUp px-4">
        
      <div className="mb-8 pl-2">
         <div className="flex items-center gap-2 text-zinc-500 text-sm font-medium mb-2">
             <span className="bg-zinc-800 px-2 py-0.5 rounded border border-zinc-700 text-zinc-300">Workspace</span>
             <span>/</span>
             <span className="text-white">Search</span>
         </div>
         <h1 className="text-3xl font-bold text-white">
            Results for "{query}"
         </h1>
      </div>

      <div className="grid gap-6">
          {items.map((item) => (
              <a 
                key={item.id}
                href={item.pageUrl}
                target="_blank"
                rel="noreferrer"
                className="group block bg-zinc-900 border border-zinc-800 rounded-[20px] p-6 shadow-sm hover:border-zinc-600 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
              >
                  {/* Hover decoration */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className="w-12 h-12 text-2xl flex items-center justify-center bg-black border border-zinc-800 rounded-xl shrink-0">
                          {item.data?.icon || '📄'}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-bold text-white group-hover:underline decoration-2 decoration-zinc-700 underline-offset-4 mb-1">
                              {item.title}
                          </h3>
                          <p className="text-zinc-400 leading-relaxed mb-4 font-light">
                              {item.data?.preview}
                          </p>
                          
                          <div className="flex items-center gap-4 text-xs text-zinc-500">
                              <div className="flex items-center gap-1">
                                  <Calendar size={12} />
                                  <span>Edited {item.data?.lastEdited}</span>
                              </div>
                              {item.data?.tags && (
                                  <div className="flex gap-2">
                                      {item.data.tags.map((tag: string, i: number) => (
                                          <span key={i} className="flex items-center gap-1 bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-md border border-zinc-700">
                                              <Hash size={10} /> {tag}
                                          </span>
                                      ))}
                                  </div>
                              )}
                          </div>
                      </div>

                      <div className="w-8 h-8 flex items-center justify-center text-zinc-600 group-hover:text-white transition-colors">
                          <ExternalLink size={18} />
                      </div>
                  </div>
              </a>
          ))}
      </div>
    </div>
  );
};

export default NotionResultsView;
