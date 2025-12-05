import React from 'react';
import { X, Link as LinkIcon } from 'lucide-react';

interface ConnectSpotifyModalProps {
  onClose: () => void;
  onConnect: () => void;
}

const ConnectSpotifyModal: React.FC<ConnectSpotifyModalProps> = ({ onClose, onConnect }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-white/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-md rounded-[32px] p-8 shadow-2xl flex flex-col items-center animate-slideUp border border-gray-100">
        
        <button 
            onClick={onClose}
            className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
        >
            <X size={24} />
        </button>

        {/* Icons Row */}
        <div className="flex items-center gap-6 mb-8 mt-4">
            {/* App Logo */}
            <div className="w-20 h-20 bg-white border border-gray-100 rounded-3xl flex items-center justify-center shadow-lg overflow-hidden">
                <img src="https://iili.io/fIDzzRS.png" alt="Infinity" className="w-full h-full object-cover" />
            </div>
            
            {/* Link Icon */}
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                <LinkIcon size={20} />
            </div>

            {/* Spotify Logo */}
            <div className="w-20 h-20 bg-white border border-gray-200 rounded-3xl flex items-center justify-center shadow-sm">
                 <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 512 511.992">
                    <path fill="#1DB954" fillRule="nonzero" d="M255.998.004C114.617.004 0 114.616 0 255.998c0 141.385 114.617 255.994 255.998 255.994C397.395 511.992 512 397.387 512 255.998 512 114.624 397.395.015 255.994.015l.004-.015v.004zm117.4 369.22c-4.585 7.519-14.426 9.907-21.949 5.288-60.104-36.715-135.771-45.028-224.882-24.669-8.587 1.955-17.146-3.425-19.104-12.015-1.966-8.59 3.394-17.149 12.004-19.104 97.517-22.28 181.164-12.687 248.644 28.551 7.523 4.615 9.907 14.427 5.287 21.949zm31.335-69.704c-5.779 9.389-18.067 12.353-27.452 6.578-68.813-42.297-173.703-54.547-255.096-29.837-10.556 3.188-21.704-2.761-24.906-13.298-3.18-10.556 2.772-21.68 13.309-24.89 92.971-28.209 208.551-14.546 287.575 34.015 9.385 5.778 12.349 18.066 6.574 27.44v-.004l-.004-.004zm2.692-72.583c-82.51-49.006-218.635-53.511-297.409-29.603-12.649 3.836-26.027-3.302-29.859-15.955-3.833-12.657 3.302-26.024 15.959-29.868 90.428-27.452 240.753-22.149 335.747 34.245 11.401 6.755 15.133 21.447 8.375 32.809-6.728 11.378-21.462 15.13-32.802 8.372h-.011z"/>
                 </svg>
            </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Connect Infinity to Spotify</h2>
        <p className="text-gray-500 text-center mb-8 px-4 leading-relaxed">
            Connect your Spotify account to search tracks, view playlists, and discover new music directly within Infinity.
        </p>

        <div className="flex w-full gap-4">
            <button 
                onClick={onClose}
                className="flex-1 py-3.5 rounded-full bg-black text-white font-semibold hover:bg-gray-800 transition-colors"
            >
                Cancel
            </button>
            <button 
                onClick={onConnect}
                className="flex-1 py-3.5 rounded-full border border-gray-200 text-gray-900 font-semibold hover:bg-gray-50 transition-colors"
            >
                Allow access
            </button>
        </div>

        <div className="mt-6 flex items-center gap-2 text-xs text-gray-400">
            <div className="w-3 h-3 rounded-full border border-gray-300 flex items-center justify-center">i</div>
            Terms and Privacy
        </div>

      </div>
    </div>
  );
};

export default ConnectSpotifyModal;