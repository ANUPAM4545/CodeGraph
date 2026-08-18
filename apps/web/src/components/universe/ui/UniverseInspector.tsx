import React from 'react';
import { X, Cpu, Info, Zap } from 'lucide-react';
import { UniverseNode, UniverseEdge } from '../../../types/universe';

interface Props {
  node: UniverseNode | null;
  edges: UniverseEdge[];
  onClose: () => void;
  onAskAI: (action: string) => void;
  onView2D: () => void;
}

export default function UniverseInspector({ node, edges, onClose, onAskAI, onView2D }: Props) {
  if (!node) return null;

  const connectedEdges = edges.filter(e => e.source === node.id || e.target === node.id);

  return (
    <div className="absolute right-0 top-0 h-full w-80 bg-white/95 backdrop-blur-md border-l border-gray-200 shadow-xl z-40 flex flex-col pointer-events-auto">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900 truncate flex-1" title={node.label}>
          {node.label}
        </h3>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded text-gray-500 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Type & Metadata */}
        <div>
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Details</h4>
          <div className="bg-gray-50 rounded border border-gray-200 p-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Type</span>
              <span className="font-mono text-gray-900">{node.type}</span>
            </div>
            {node.metadata?.file_path && (
              <div className="flex justify-between">
                <span className="text-gray-500">File</span>
                <span className="font-mono text-gray-900 truncate max-w-[150px]" title={node.metadata.file_path}>
                  {node.metadata.file_path.split('/').pop()}
                </span>
              </div>
            )}
            {node.metadata?.line_start && (
              <div className="flex justify-between">
                <span className="text-gray-500">Lines</span>
                <span className="font-mono text-gray-900">
                  {node.metadata.line_start} - {node.metadata.line_end}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* AI Actions */}
        <div>
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">AI Intelligence</h4>
          <div className="space-y-2">
            <button 
              onClick={() => onAskAI(`Explain what ${node.label} does and how it works.`)}
              className="w-full flex items-center justify-between px-3 py-2 text-sm bg-black text-white hover:bg-gray-800 rounded transition-colors"
            >
              <span>Explain this {node.type.toLowerCase()}</span>
              <Zap className="w-4 h-4 text-yellow-400" />
            </button>
            <button 
              onClick={() => onAskAI(`Explain the dependencies and what ${node.label} interacts with.`)}
              className="w-full flex items-center justify-between px-3 py-2 text-sm border border-gray-300 hover:bg-gray-50 rounded transition-colors"
            >
              <span>Explain dependencies</span>
              <Cpu className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Links */}
        <div>
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Navigation</h4>
          <button 
            onClick={onView2D}
            className="w-full text-left px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors"
          >
            View in 2D Explorer
          </button>
        </div>
      </div>
    </div>
  );
}
