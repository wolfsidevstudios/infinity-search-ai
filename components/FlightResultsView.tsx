import React, { useState } from 'react';
import { Flight } from '../types';
import { Plane, ArrowRight, Clock, Bookmark, Check } from 'lucide-react';

interface FlightResultsViewProps {
  flights: Flight[];
  query: string;
  onSave: (item: any) => void;
}

const FlightResultsView: React.FC<FlightResultsViewProps> = ({ flights, query, onSave }) => {
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  const handleSave = (flight: Flight) => {
      onSave({ type: 'flight', content: flight });
      setSavedIds(prev => new Set(prev).add(flight.id));
      setTimeout(() => {
          setSavedIds(prev => {
              const next = new Set(prev);
              next.delete(flight.id);
              return next;
          });
      }, 2000);
  };

  if (flights.length === 0) {
      return (
          <div className="w-full h-96 flex flex-col items-center justify-center text-zinc-500 animate-fadeIn">
              <div className="w-24 h-24 bg-zinc-900 rounded-full flex items-center justify-center mb-6 border border-zinc-800">
                  <Plane size={40} className="opacity-30" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">No flights found</h2>
              <p>Try searching for "flights from New York to London".</p>
          </div>
      );
  }

  return (
    <div className="w-full max-w-5xl mx-auto pb-20 animate-slideUp px-4">
      
      {/* Header */}
      <div className="mb-10 pl-2">
         <div className="flex items-center gap-2 text-sky-400 text-sm font-bold uppercase tracking-wider mb-2">
             <Plane size={16} /> Travel Agent
         </div>
         <h1 className="text-4xl font-bold text-white">
            Flights for "{query}"
         </h1>
      </div>

      <div className="space-y-4">
          {flights.map((flight) => (
              <div 
                key={flight.id}
                className="bg-zinc-900 border border-zinc-800 rounded-[24px] p-6 hover:border-zinc-600 transition-all group relative flex flex-col md:flex-row items-center gap-6 md:gap-10"
              >
                  {/* Airline Logo/Info */}
                  <div className="flex items-center gap-4 w-full md:w-48">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center p-2">
                          {flight.airline_logo ? (
                              <img src={flight.airline_logo} alt={flight.airline} className="max-w-full max-h-full object-contain" />
                          ) : (
                              <Plane size={24} className="text-black" />
                          )}
                      </div>
                      <span className="font-bold text-white truncate">{flight.airline}</span>
                  </div>

                  {/* Flight Path */}
                  <div className="flex-1 flex flex-col items-center w-full">
                      <div className="flex items-center justify-between w-full mb-2">
                          <div className="text-left">
                              <div className="text-2xl font-bold text-white">{flight.departure}</div>
                              {/* <div className="text-xs text-zinc-500">Depart</div> */}
                          </div>
                          
                          <div className="flex flex-col items-center px-4 flex-1">
                              <div className="text-xs text-zinc-500 mb-1">{flight.duration}</div>
                              <div className="w-full h-[2px] bg-zinc-700 relative">
                                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-zinc-500 rounded-full"></div>
                              </div>
                              <div className="text-xs text-green-400 mt-1 font-medium">{flight.stops}</div>
                          </div>

                          <div className="text-right">
                              <div className="text-2xl font-bold text-white">{flight.arrival}</div>
                              {/* <div className="text-xs text-zinc-500">Arrive</div> */}
                          </div>
                      </div>
                  </div>

                  {/* Price & Action */}
                  <div className="flex flex-row md:flex-col items-center gap-4 w-full md:w-auto justify-between md:justify-center border-t md:border-t-0 md:border-l border-zinc-800 pt-4 md:pt-0 md:pl-8">
                      <div className="text-2xl font-bold text-white">{flight.price}</div>
                      
                      <div className="flex gap-2">
                          <button 
                            onClick={() => handleSave(flight)}
                            className="w-10 h-10 rounded-full border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                          >
                              {savedIds.has(flight.id) ? <Check size={16} className="text-green-500"/> : <Bookmark size={16} />}
                          </button>
                          <a 
                            href={flight.link} 
                            target="_blank" 
                            rel="noreferrer"
                            className="bg-white text-black px-6 py-2.5 rounded-full text-sm font-bold hover:bg-sky-400 hover:text-white transition-colors whitespace-nowrap"
                          >
                              Book
                          </a>
                      </div>
                  </div>
              </div>
          ))}
      </div>
    </div>
  );
};

export default FlightResultsView;
