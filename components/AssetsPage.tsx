
import React from 'react';
import { Download, ArrowLeft, Image as ImageIcon, Layers, Command } from 'lucide-react';

interface AssetsPageProps {
  onBack: () => void;
}

const AssetsPage: React.FC<AssetsPageProps> = ({ onBack }) => {
  
  const handleDownload = (elementId: string, filename: string) => {
    // Basic simulation of downloading since we can't really generate new files in browser efficiently without a huge lib
    // In a real app, this would point to a static asset URL like /assets/logo-pack.zip
    // Here we will use html2canvas if available, or just alert.
    // For this demo, we will provide direct links to the images we use.
    
    // Attempting to simulate download of the visible asset
    const link = document.createElement('a');
    if (elementId === 'logo') {
        link.href = 'https://i.ibb.co/pjtXDLqZ/Google-AI-Studio-2025-12-06-T01-46-54-593-Z-modified.png';
        link.download = 'infinity-logo.png';
    } else {
        // Fallback for demo
        alert("In a production build, this would download the high-res asset pack.");
        return;
    }
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-y-auto">
      <nav className="sticky top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-4 cursor-pointer hover:opacity-70 transition-opacity" onClick={onBack}>
                <ArrowLeft className="text-gray-500" />
                <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
                    <img src="https://i.ibb.co/pjtXDLqZ/Google-AI-Studio-2025-12-06-T01-46-54-593-Z-modified.png" alt="Infinity Logo" className="w-8 h-8 rounded-lg shadow-sm" />
                    Infinity Media Kit
                </div>
            </div>
            <button onClick={onBack} className="text-sm font-medium text-gray-500 hover:text-black">Back to Site</button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-20">
        <header className="mb-20 text-center max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold mb-6 tracking-tight">Brand Assets</h1>
            <p className="text-xl text-gray-500">
                Official logos, screenshots, and product mockups for press and media.
            </p>
        </header>

        {/* LOGOS SECTION */}
        <section className="mb-24">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-2"><Command size={24}/> Logos</h2>
            <div className="grid md:grid-cols-3 gap-8">
                {/* Primary Icon */}
                <div className="border border-gray-100 rounded-3xl p-10 flex flex-col items-center justify-center bg-gray-50/50 hover:bg-white hover:shadow-xl transition-all group">
                    <img src="https://i.ibb.co/pjtXDLqZ/Google-AI-Studio-2025-12-06-T01-46-54-593-Z-modified.png" alt="Logo" className="w-32 h-32 rounded-2xl shadow-lg mb-8" />
                    <div className="flex items-center justify-between w-full px-4">
                        <span className="font-mono text-xs text-gray-400">App Icon (512x512)</span>
                        <button 
                            onClick={() => handleDownload('logo', 'infinity-icon.png')}
                            className="p-2 bg-gray-200 rounded-full hover:bg-black hover:text-white transition-colors"
                        >
                            <Download size={16} />
                        </button>
                    </div>
                </div>

                {/* Dark Mode Icon */}
                <div className="border border-gray-100 rounded-3xl p-10 flex flex-col items-center justify-center bg-black hover:shadow-xl transition-all group">
                    <img src="https://i.ibb.co/pjtXDLqZ/Google-AI-Studio-2025-12-06-T01-46-54-593-Z-modified.png" alt="Logo" className="w-32 h-32 rounded-2xl shadow-lg mb-8 border border-white/20" />
                    <div className="flex items-center justify-between w-full px-4">
                        <span className="font-mono text-xs text-gray-500">Dark Variant</span>
                         <button 
                            onClick={() => handleDownload('logo', 'infinity-icon-dark.png')}
                            className="p-2 bg-gray-800 text-white rounded-full hover:bg-white hover:text-black transition-colors"
                        >
                            <Download size={16} />
                        </button>
                    </div>
                </div>

                 {/* Wordmark */}
                <div className="border border-gray-100 rounded-3xl p-10 flex flex-col items-center justify-center bg-white hover:shadow-xl transition-all group">
                    <div className="h-32 flex items-center justify-center">
                        <span className="text-4xl font-bold tracking-tight">Infinity.</span>
                    </div>
                    <div className="flex items-center justify-between w-full px-4 mt-auto">
                        <span className="font-mono text-xs text-gray-400">Wordmark</span>
                         <button 
                            onClick={() => alert('Download simulated')}
                            className="p-2 bg-gray-200 rounded-full hover:bg-black hover:text-white transition-colors"
                        >
                            <Download size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </section>

        {/* SCREENSHOTS SECTION */}
        <section className="mb-24">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-2"><ImageIcon size={24}/> Product Screenshots</h2>
            <div className="grid md:grid-cols-2 gap-8">
                
                {/* Dashboard Shot */}
                <div className="group cursor-pointer">
                    <div className="aspect-video bg-gray-100 rounded-2xl border border-gray-200 overflow-hidden relative shadow-sm group-hover:shadow-2xl transition-all">
                        {/* Simulate UI */}
                        <div className="absolute inset-0 flex flex-col">
                             <div className="h-12 border-b border-gray-200 bg-white flex items-center px-4 gap-2">
                                <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-gray-300"/><div className="w-3 h-3 rounded-full bg-gray-300"/><div className="w-3 h-3 rounded-full bg-gray-300"/></div>
                             </div>
                             <div className="flex-1 bg-gray-50 flex items-center justify-center">
                                 <div className="w-3/4 h-3/4 bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col items-center justify-center gap-4">
                                     <div className="w-12 h-12 bg-black rounded-xl"></div>
                                     <div className="w-1/2 h-4 bg-gray-200 rounded-full"></div>
                                 </div>
                             </div>
                        </div>
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button className="px-4 py-2 bg-black text-white rounded-lg text-sm font-bold flex items-center gap-2">
                                <Download size={14} /> Download High-Res
                             </button>
                        </div>
                    </div>
                    <p className="mt-3 text-sm font-medium text-gray-500">Dashboard View</p>
                </div>

                 {/* Mobile Shot */}
                <div className="group cursor-pointer">
                    <div className="aspect-video bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden relative shadow-sm group-hover:shadow-2xl transition-all">
                        {/* Simulate Dark UI */}
                         <div className="absolute inset-0 flex flex-col">
                             <div className="h-12 border-b border-gray-800 bg-black flex items-center px-4 gap-2">
                                <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-gray-600"/><div className="w-3 h-3 rounded-full bg-gray-600"/><div className="w-3 h-3 rounded-full bg-gray-600"/></div>
                             </div>
                             <div className="flex-1 bg-[#111] flex items-center justify-center">
                                 <div className="w-3/4 h-3/4 bg-black rounded-xl shadow-lg border border-gray-800 flex flex-col items-center justify-center gap-4">
                                     <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl"></div>
                                     <div className="w-1/2 h-4 bg-gray-800 rounded-full"></div>
                                 </div>
                             </div>
                        </div>
                        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button className="px-4 py-2 bg-white text-black rounded-lg text-sm font-bold flex items-center gap-2">
                                <Download size={14} /> Download High-Res
                             </button>
                        </div>
                    </div>
                    <p className="mt-3 text-sm font-medium text-gray-500">Dark Mode Search</p>
                </div>

            </div>
        </section>

         {/* COLOR PALETTE */}
         <section className="mb-24">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-2"><Layers size={24}/> Color Palette</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="h-32 rounded-2xl bg-black text-white p-4 flex flex-col justify-end shadow-lg">
                    <span className="font-mono text-sm">#000000</span>
                    <span className="text-xs text-gray-400">Primary</span>
                </div>
                 <div className="h-32 rounded-2xl bg-white border border-gray-200 text-black p-4 flex flex-col justify-end shadow-sm">
                    <span className="font-mono text-sm">#FFFFFF</span>
                    <span className="text-xs text-gray-400">Background</span>
                </div>
                 <div className="h-32 rounded-2xl bg-blue-600 text-white p-4 flex flex-col justify-end shadow-lg">
                    <span className="font-mono text-sm">#2563EB</span>
                    <span className="text-xs text-blue-200">Accent Blue</span>
                </div>
                 <div className="h-32 rounded-2xl bg-purple-600 text-white p-4 flex flex-col justify-end shadow-lg">
                    <span className="font-mono text-sm">#9333EA</span>
                    <span className="text-xs text-purple-200">Accent Purple</span>
                </div>
            </div>
        </section>

      </main>

      <footer className="py-12 border-t border-gray-100 text-center text-gray-400 text-sm">
        <p>© 2025 Infinity Search Inc. Media Kit.</p>
      </footer>
    </div>
  );
};

export default AssetsPage;