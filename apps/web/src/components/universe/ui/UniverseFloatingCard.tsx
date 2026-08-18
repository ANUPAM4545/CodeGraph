'use client';

import React from 'react';
import { UniverseNode, UniverseHierarchy } from '../../../types/universe';
import { Eye, ChevronRight, Layers, FileCode, Folder, Shield } from 'lucide-react';

interface Props {
  node: UniverseNode;
  hierarchy: UniverseHierarchy;
  onFocus: () => void;
  onInspect: () => void;
  onToggleExpand: () => void;
}

export default function UniverseFloatingCard({ 
  node, 
  hierarchy, 
  onFocus, 
  onInspect, 
  onToggleExpand 
}: Props) {
  const childDirs = node.children.filter(c => c.type === 'Directory').length;
  const childFiles = node.children.filter(c => c.type !== 'Directory').length;
  
  // Real relationships involving this node
  const connectedEdges = hierarchy.visibleEdges.filter(e => 
    e.source === node.id || e.target === node.id
  );

  return (
    <div className="absolute top-16 right-4 w-72 bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl shadow-xl p-3.5 z-40 animate-in fade-in slide-in-from-top-2 duration-150 select-none">
      <div className="flex items-start justify-between pb-2 border-b border-gray-100">
        <div className="min-w-0 pr-2">
          <div className="flex items-center space-x-1.5 mb-0.5">
            <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100">
              {node.type}
            </span>
          </div>
          <h3 className="text-sm font-semibold text-gray-900 truncate" title={node.label}>
            {node.label}
          </h3>
        </div>
      </div>

      {/* Real Metrics Grid */}
      <div className="grid grid-cols-3 gap-2 my-3 text-center">
        {node.type === 'Directory' || node.type === 'RepositoryVersion' ? (
          <>
            <div className="p-1.5 bg-gray-50 rounded border border-gray-100">
              <div className="text-[10px] text-gray-400 font-medium">Dirs</div>
              <div className="text-xs font-bold text-gray-800">{childDirs}</div>
            </div>
            <div className="p-1.5 bg-gray-50 rounded border border-gray-100">
              <div className="text-[10px] text-gray-400 font-medium">Files</div>
              <div className="text-xs font-bold text-gray-800">{childFiles}</div>
            </div>
            <div className="p-1.5 bg-gray-50 rounded border border-gray-100">
              <div className="text-[10px] text-gray-400 font-medium">Edges</div>
              <div className="text-xs font-bold text-gray-800">{connectedEdges.length}</div>
            </div>
          </>
        ) : (
          <>
            <div className="p-1.5 bg-gray-50 rounded border border-gray-100 col-span-2 text-left px-2">
              <div className="text-[10px] text-gray-400 font-medium">Path</div>
              <div className="text-[11px] font-mono text-gray-800 truncate">
                {node.metadata?.file_path || 'Not available'}
              </div>
            </div>
            <div className="p-1.5 bg-gray-50 rounded border border-gray-100">
              <div className="text-[10px] text-gray-400 font-medium">Edges</div>
              <div className="text-xs font-bold text-gray-800">{connectedEdges.length}</div>
            </div>
          </>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-2 pt-1 border-t border-gray-100">
        <button
          onClick={onFocus}
          className="flex-1 py-1 px-2 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors flex items-center justify-center space-x-1"
        >
          <Eye className="w-3 h-3" />
          <span>Focus</span>
        </button>

        {node.hasChildren && (
          <button
            onClick={onToggleExpand}
            className="flex-1 py-1 px-2 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors flex items-center justify-center space-x-1"
          >
            <span>{node.isExpanded ? 'Collapse' : 'Expand'}</span>
          </button>
        )}

        <button
          onClick={onInspect}
          className="py-1 px-2 text-xs font-medium text-white bg-slate-900 hover:bg-black rounded-md transition-colors flex items-center justify-center space-x-1"
        >
          <span>Inspect</span>
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
