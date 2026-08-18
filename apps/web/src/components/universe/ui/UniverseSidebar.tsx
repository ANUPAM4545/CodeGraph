'use client';

import React, { useState } from 'react';
import { 
  Globe, 
  Layers, 
  Sparkles, 
  History, 
  Box, 
  Code, 
  Share2, 
  Flame, 
  Target, 
  RotateCcw, 
  Compass, 
  Eye, 
  EyeOff, 
  ChevronLeft, 
  ChevronRight,
  Maximize2,
  Minimize2
} from 'lucide-react';
import Link from 'next/link';

interface Props {
  repositoryId: string;
  versionId: string;
  selectedNodeId: string | null;
  explorationLevel: 'architecture' | 'file' | 'symbol';
  setExplorationLevel: (level: 'architecture' | 'file' | 'symbol') => void;
  viewMode: 'ARCHITECTURE' | 'DEPENDENCIES' | 'IMPACT';
  setViewMode: (mode: 'ARCHITECTURE' | 'DEPENDENCIES' | 'IMPACT') => void;
  edgeDensity: 'LOW' | 'MEDIUM' | 'HIGH';
  setEdgeDensity: (density: 'LOW' | 'MEDIUM' | 'HIGH') => void;
  showLabels: boolean;
  setShowLabels: (show: boolean) => void;
  showBoundaries: boolean;
  setShowBoundaries: (show: boolean) => void;
  onFocusSelected: () => void;
  onResetView: () => void;
  onTopView: () => void;
  onExpandAllTop: () => void;
  onCollapseAll: () => void;
  onOpenAI: () => void;
}

export default function UniverseSidebar({
  repositoryId,
  versionId,
  selectedNodeId,
  explorationLevel,
  setExplorationLevel,
  viewMode,
  setViewMode,
  edgeDensity,
  setEdgeDensity,
  showLabels,
  setShowLabels,
  showBoundaries,
  setShowBoundaries,
  onFocusSelected,
  onResetView,
  onTopView,
  onExpandAllTop,
  onCollapseAll,
  onOpenAI
}: Props) {
  const [collapsed, setCollapsed] = useState(false);

  if (collapsed) {
    return (
      <button
        onClick={() => setCollapsed(false)}
        className="absolute top-18 left-4 z-40 p-2 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-sm text-gray-600 hover:text-black hover:bg-gray-50 transition-colors"
        title="Open Navigation"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    );
  }

  return (
    <div className="absolute top-18 left-4 w-56 bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl shadow-md z-40 flex flex-col p-3 space-y-4 text-xs select-none max-h-[calc(100vh-120px)] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
        <span className="font-bold text-gray-900 uppercase tracking-wider text-[10px]">3D UNIVERSE</span>
        <button 
          onClick={() => setCollapsed(true)} 
          className="text-gray-400 hover:text-black p-0.5 rounded transition-colors"
          title="Collapse Panel"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Exploration Links */}
      <div className="space-y-1">
        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Exploration</span>
        <div className="flex items-center space-x-2 px-2 py-1.5 bg-black text-white font-semibold rounded-md shadow-xs">
          <Globe className="w-3.5 h-3.5 text-blue-400" />
          <span>3D Universe</span>
        </div>
        <Link 
          href={`/repositories/${repositoryId}?version=${versionId}${selectedNodeId ? `&node=${selectedNodeId}` : ''}`}
          className="flex items-center space-x-2 px-2 py-1.5 text-gray-600 hover:text-black hover:bg-gray-100 rounded-md transition-colors"
        >
          <Layers className="w-3.5 h-3.5 text-gray-400" />
          <span>2D Graph Explorer</span>
        </Link>
        <button 
          onClick={onOpenAI}
          className="w-full flex items-center space-x-2 px-2 py-1.5 text-gray-600 hover:text-black hover:bg-gray-100 rounded-md transition-colors text-left"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>AI Assistant</span>
        </button>
        <Link 
          href={`/repositories/${repositoryId}/history`}
          className="flex items-center space-x-2 px-2 py-1.5 text-gray-600 hover:text-black hover:bg-gray-100 rounded-md transition-colors"
        >
          <History className="w-3.5 h-3.5 text-gray-400" />
          <span>Browse History</span>
        </Link>
      </div>

      {/* Views */}
      <div className="space-y-1 border-t border-gray-100 pt-2">
        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Views</span>
        <button 
          onClick={() => {
            setViewMode('ARCHITECTURE');
            setExplorationLevel('architecture');
          }}
          className={`w-full flex items-center justify-between px-2 py-1.5 rounded-md transition-colors ${
            viewMode === 'ARCHITECTURE' && explorationLevel === 'architecture'
              ? 'bg-blue-50 text-blue-900 font-semibold border border-blue-200' 
              : 'text-gray-600 hover:text-black hover:bg-gray-100'
          }`}
        >
          <div className="flex items-center space-x-2">
            <Layers className="w-3.5 h-3.5" />
            <span>Architecture</span>
          </div>
          <span className="text-[9px] font-mono text-gray-400">1</span>
        </button>
        <button 
          onClick={() => {
            setViewMode('DEPENDENCIES');
            setExplorationLevel('file');
            setEdgeDensity('MEDIUM');
          }}
          className={`w-full flex items-center justify-between px-2 py-1.5 rounded-md transition-colors ${
            viewMode === 'DEPENDENCIES' 
              ? 'bg-blue-50 text-blue-900 font-semibold border border-blue-200' 
              : 'text-gray-600 hover:text-black hover:bg-gray-100'
          }`}
        >
          <div className="flex items-center space-x-2">
            <Share2 className="w-3.5 h-3.5" />
            <span>Dependencies</span>
          </div>
          <span className="text-[9px] font-mono text-gray-400">2</span>
        </button>
        <button 
          onClick={() => {
            setViewMode('IMPACT');
            setEdgeDensity('HIGH');
          }}
          className={`w-full flex items-center justify-between px-2 py-1.5 rounded-md transition-colors ${
            viewMode === 'IMPACT' 
              ? 'bg-amber-50 text-amber-900 font-semibold border border-amber-200' 
              : 'text-gray-600 hover:text-black hover:bg-gray-100'
          }`}
        >
          <div className="flex items-center space-x-2">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>Impact Analysis</span>
          </div>
          <span className="text-[9px] font-mono text-gray-400">3</span>
        </button>
      </div>

      {/* Camera & Tree Controls */}
      <div className="space-y-1 border-t border-gray-100 pt-2">
        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Controls</span>
        <button 
          onClick={onFocusSelected}
          disabled={!selectedNodeId}
          className={`w-full flex items-center justify-between px-2 py-1.5 rounded-md transition-colors ${
            selectedNodeId ? 'text-gray-700 hover:text-black hover:bg-gray-100' : 'text-gray-300 cursor-not-allowed'
          }`}
        >
          <div className="flex items-center space-x-2">
            <Target className="w-3.5 h-3.5" />
            <span>Focus Selected</span>
          </div>
          <span className="text-[9px] font-mono text-gray-400">F</span>
        </button>
        <button 
          onClick={onResetView}
          className="w-full flex items-center justify-between px-2 py-1.5 text-gray-700 hover:text-black hover:bg-gray-100 rounded-md transition-colors"
        >
          <div className="flex items-center space-x-2">
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset View</span>
          </div>
          <span className="text-[9px] font-mono text-gray-400">R</span>
        </button>
        <button 
          onClick={onTopView}
          className="w-full flex items-center justify-between px-2 py-1.5 text-gray-700 hover:text-black hover:bg-gray-100 rounded-md transition-colors"
        >
          <div className="flex items-center space-x-2">
            <Compass className="w-3.5 h-3.5" />
            <span>Top-Down View</span>
          </div>
          <span className="text-[9px] font-mono text-gray-400">T</span>
        </button>
        <div className="grid grid-cols-2 gap-1 pt-1">
          <button 
            onClick={onExpandAllTop}
            className="flex items-center justify-center space-x-1 px-2 py-1 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded text-[10px] text-gray-700 font-medium transition-colors"
          >
            <Maximize2 className="w-3 h-3" />
            <span>Expand Top</span>
          </button>
          <button 
            onClick={onCollapseAll}
            className="flex items-center justify-center space-x-1 px-2 py-1 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded text-[10px] text-gray-700 font-medium transition-colors"
          >
            <Minimize2 className="w-3 h-3" />
            <span>Collapse</span>
          </button>
        </div>
      </div>

      {/* Display Options */}
      <div className="space-y-1.5 border-t border-gray-100 pt-2">
        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Display</span>
        
        {/* Labels Toggle */}
        <div className="flex items-center justify-between py-0.5">
          <span className="text-gray-600">Labels</span>
          <button
            onClick={() => setShowLabels(!showLabels)}
            className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold transition-colors ${
              showLabels ? 'bg-black text-white' : 'bg-gray-100 text-gray-500'
            }`}
          >
            {showLabels ? 'ON' : 'OFF'}
          </button>
        </div>

        {/* Boundaries Toggle */}
        <div className="flex items-center justify-between py-0.5">
          <span className="text-gray-600">Boundaries</span>
          <button
            onClick={() => setShowBoundaries(!showBoundaries)}
            className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold transition-colors ${
              showBoundaries ? 'bg-black text-white' : 'bg-gray-100 text-gray-500'
            }`}
          >
            {showBoundaries ? 'ON' : 'OFF'}
          </button>
        </div>

        {/* Edge Density */}
        <div className="pt-1">
          <div className="flex items-center justify-between text-[10px] text-gray-500 mb-1">
            <span>Edge Density</span>
            <span className="font-mono font-bold text-black">{edgeDensity}</span>
          </div>
          <div className="grid grid-cols-3 gap-1">
            {(['LOW', 'MEDIUM', 'HIGH'] as const).map(d => (
              <button
                key={d}
                onClick={() => setEdgeDensity(d)}
                className={`py-1 rounded text-[10px] font-medium transition-colors ${
                  edgeDensity === d ? 'bg-black text-white font-semibold' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {d === 'LOW' ? 'Low' : d === 'MEDIUM' ? 'Med' : 'High'}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
