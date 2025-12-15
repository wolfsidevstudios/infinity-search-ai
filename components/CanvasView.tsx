
import React, { useState, useRef } from 'react';
import { CanvasNode } from '../types';
import { Plus, Image as ImageIcon, Type, Link, Move, X, Edit2, Trash2 } from 'lucide-react';

const CanvasView: React.FC = () => {
  const [nodes, setNodes] = useState<CanvasNode[]>([]);
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
      if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          const zoomSensitivity = 0.001;
          const newScale = Math.min(Math.max(0.2, scale - e.deltaY * zoomSensitivity), 5);
          setScale(newScale);
      } else {
          // Pan with scroll if not zooming
          setPan(p => ({ x: p.x - e.deltaX, y: p.y - e.deltaY }));
      }
  };

  const addNode = (type: 'note' | 'image' | 'link') => {
      let title = 'Untitled';
      let content = '';
      
      if (type === 'note') {
          const userContent = prompt("Enter note content:", "");
          if (userContent === null) return;
          content = userContent || "New Note";
          title = prompt("Enter note title:", "Note") || "Note";
      } else if (type === 'image') {
          const url = prompt("Enter image URL:", "");
          if (!url) return;
          content = url;
          title = "Image";
      } else if (type === 'link') {
          const url = prompt("Enter URL:", "https://");
          if (!url) return;
          title = prompt("Enter link title:", "Link") || "Link";
          content = url;
      }

      const newNode: CanvasNode = {
          id: Date.now().toString(),
          type,
          // Calculate center of current viewport accounting for pan and scale
          x: (window.innerWidth / 2 - pan.x) / scale - 150, 
          y: (window.innerHeight / 2 - pan.y) / scale - 100,
          title,
          content,
          color: type === 'note' ? '#eab308' : undefined,
          width: type === 'image' ? 300 : 250
      };
      setNodes([...nodes, newNode]);
  };

  const deleteNode = (id: string) => {
      if (window.confirm("Delete this item?")) {
          setNodes(nodes.filter(n => n.id !== id));
      }
  };

  const editNode = (node: CanvasNode) => {
      let newTitle = node.title;
      let newContent = node.content;

      if (node.type === 'note') {
          newTitle = prompt("Edit Title:", node.title) || node.title;
          newContent = prompt("Edit Content:", node.content) || node.content;
      } else if (node.type === 'link') {
          newTitle = prompt("Edit Link Title:", node.title) || node.title;
          newContent = prompt("Edit URL:", node.content) || node.content;
      } else if (node.type === 'image') {
          newContent = prompt("Edit Image URL:", node.content) || node.content;
      }

      setNodes(nodes.map(n => n.id === node.id ? { ...n, title: newTitle, content: newContent } : n));
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

        {/* Empty State Hint */}
        {nodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-zinc-600">
                <div className="text-center">
                    <p className="text-lg font-medium mb-2">Your canvas is empty</p>
                    <p className="text-sm">Use the toolbar above to add notes, images, or links.</p>
                </div>
            </div>
        )}

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
                        onDoubleClick={(e) => { e.stopPropagation(); editNode(node); }}
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
                        <div className="h-8 bg-zinc-800/50 flex items-center justify-between px-3 cursor-grab active:cursor-grabbing border-b border-zinc-800/50">
                            <div className="flex gap-2 items-center">
                                <div className={`w-3 h-3 rounded-full ${node.type === 'note' ? 'bg-yellow-500' : node.type === 'link' ? 'bg-blue-500' : 'bg-green-500'}`}></div>
                                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">{node.type}</span>
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={(e) => { e.stopPropagation(); editNode(node); }} className="text-zinc-500 hover:text-white p-1">
                                    <Edit2 size={12} />
                                </button>
                                <button onClick={(e) => { e.stopPropagation(); deleteNode(node.id); }} className="text-zinc-500 hover:text-red-500 p-1">
                                    <Trash2 size={12} />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-4">
                            {node.type === 'image' ? (
                                <img 
                                    src={node.content} 
                                    alt="node" 
                                    className="w-full h-auto rounded-lg pointer-events-none bg-zinc-800 min-h-[100px]" 
                                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Invalid+Image+URL'; }}
                                />
                            ) : (
                                <>
                                    <h3 className="text-white font-bold mb-2 break-words">{node.title}</h3>
                                    <p className="text-zinc-400 text-sm leading-relaxed whitespace-pre-wrap break-words">{node.content}</p>
                                    {node.type === 'link' && (
                                        <div className="mt-3 pt-3 border-t border-zinc-800">
                                            <a href={node.content} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-400 text-xs hover:underline pointer-events-auto" onMouseDown={e => e.stopPropagation()}>
                                                <Link size={10} /> Open Link
                                            </a>
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
        <div className="absolute bottom-8 left-8 text-zinc-500 text-xs font-medium pointer-events-none bg-black/50 backdrop-blur px-3 py-1 rounded-full border border-white/5">
            Space+Drag to Pan • Scroll to Zoom • Double Click to Edit
        </div>

    </div>
  );
};

export default CanvasView;
