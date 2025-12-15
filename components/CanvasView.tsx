
import React, { useState, useRef } from 'react';
import { CanvasNode } from '../types';
import { Plus, Image as ImageIcon, Type, Link, Move, X } from 'lucide-react';

const INITIAL_NODES: CanvasNode[] = [
    { id: '1', type: 'note', x: 400, y: 300, title: 'Project Idea', content: 'Build a spatial interface for search results.', color: '#3b82f6' },
    { id: '2', type: 'image', x: 700, y: 150, title: 'Inspiration', content: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop', width: 300, height: 200 },
    { id: '3', type: 'link', x: 200, y: 500, title: 'Documentation', content: 'https://react.dev' },
];

const CanvasView: React.FC = () => {
  const [nodes, setNodes] = useState<CanvasNode[]>(INITIAL_NODES);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
  const [draggingNode, setDraggingNode] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const containerRef = useRef<HTMLDivElement>(null);

  // Pan Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
      // Only pan if clicking background
      if (e.target === containerRef.current) {
          setIsDraggingCanvas(true);
          setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
      if (isDraggingCanvas) {
          setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
      } else if (draggingNode) {
          const nodeIndex = nodes.findIndex(n => n.id === draggingNode);
          if (nodeIndex === -1) return;
          
          const newNodes = [...nodes];
          // Calculate delta accounting for scale
          newNodes[nodeIndex].x += e.movementX / scale;
          newNodes[nodeIndex].y += e.movementY / scale;
          setNodes(newNodes);
      }
  };

  const handleMouseUp = () => {
      setIsDraggingCanvas(false);
      setDraggingNode(null);
  };

  const handleWheel = (e: React.WheelEvent) => {
      if (e.ctrlKey) {
          e.preventDefault();
          const zoomSensitivity = 0.001;
          const newScale = Math.min(Math.max(0.5, scale - e.deltaY * zoomSensitivity), 3);
          setScale(newScale);
      }
  };

  const addNode = (type: 'note' | 'image' | 'link') => {
      const newNode: CanvasNode = {
          id: Date.now().toString(),
          type,
          x: -pan.x / scale + window.innerWidth / 2, // Center on screen
          y: -pan.y / scale + window.innerHeight / 2,
          title: 'New Item',
          content: type === 'image' ? 'https://via.placeholder.com/300' : 'New Content',
          color: type === 'note' ? '#eab308' : undefined
      };
      setNodes([...nodes, newNode]);
  };

  const deleteNode = (id: string) => {
      setNodes(nodes.filter(n => n.id !== id));
  };

  return (
    <div className="w-full h-full relative bg-[#111] overflow-hidden animate-fadeIn select-none">
        
        {/* Toolbar */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-zinc-900/90 backdrop-blur-xl border border-zinc-800 p-2 rounded-full flex gap-2 z-50 shadow-2xl">
            <button onClick={() => addNode('note')} className="p-3 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors" title="Add Note">
                <Type size={20} />
            </button>
            <button onClick={() => addNode('image')} className="p-3 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors" title="Add Image">
                <ImageIcon size={20} />
            </button>
            <button onClick={() => addNode('link')} className="p-3 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors" title="Add Link">
                <Link size={20} />
            </button>
            <div className="w-[1px] h-6 bg-zinc-800 self-center mx-1"></div>
            <div className="px-4 flex items-center font-mono text-xs text-zinc-500">
                Infinity Canvas 1.0
            </div>
        </div>

        {/* Canvas Area */}
        <div 
            ref={containerRef}
            className="w-full h-full cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
            style={{
                backgroundImage: 'radial-gradient(#333 1px, transparent 1px)',
                backgroundSize: `${20 * scale}px ${20 * scale}px`,
                backgroundPosition: `${pan.x}px ${pan.y}px`
            }}
        >
            <div 
                style={{ 
                    transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
                    transformOrigin: '0 0',
                    width: '100%',
                    height: '100%'
                }}
            >
                {nodes.map(node => (
                    <div
                        key={node.id}
                        onMouseDown={(e) => { e.stopPropagation(); setDraggingNode(node.id); }}
                        className="absolute bg-zinc-900 border border-zinc-700 rounded-2xl shadow-xl overflow-hidden group hover:border-white/50 transition-colors"
                        style={{
                            left: node.x,
                            top: node.y,
                            width: node.width || (node.type === 'image' ? 300 : 250),
                            height: 'auto',
                            cursor: 'default'
                        }}
                    >
                        {/* Handle */}
                        <div className="h-8 bg-zinc-800/50 flex items-center justify-between px-3 cursor-grab active:cursor-grabbing">
                            <div className="flex gap-2">
                                <div className={`w-3 h-3 rounded-full ${node.type === 'note' ? 'bg-yellow-500' : node.type === 'link' ? 'bg-blue-500' : 'bg-green-500'}`}></div>
                                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">{node.type}</span>
                            </div>
                            <button onClick={() => deleteNode(node.id)} className="text-zinc-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                                <X size={14} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-4">
                            {node.type === 'image' ? (
                                <img src={node.content} alt="node" className="w-full h-auto rounded-lg pointer-events-none" />
                            ) : (
                                <>
                                    <h3 className="text-white font-bold mb-2">{node.title}</h3>
                                    <p className="text-zinc-400 text-sm leading-relaxed">{node.content}</p>
                                    {node.type === 'link' && (
                                        <div className="mt-3 flex items-center gap-1 text-blue-400 text-xs">
                                            <Link size={10} /> {node.content}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Hint */}
        <div className="absolute bottom-8 left-8 text-zinc-500 text-xs font-medium pointer-events-none">
            Space: Hold to Pan • Scroll: Zoom
        </div>

    </div>
  );
};

export default CanvasView;
