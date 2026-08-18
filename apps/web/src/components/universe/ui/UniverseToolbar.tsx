'use client';

import React from 'react';
import { ArrowLeft, Target, RotateCcw, Zap, Share2, Layers } from 'lucide-react';
import Link from 'next/link';
import UniverseSearch from './UniverseSearch';

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
  focusMode: boolean;
  setFocusMode: (v: boolean) => void;
  onSelectSearchResult: (nodeId: string) => void;
  onFocusSelected: () => void;
  onResetView: () => void;
}

export default function UniverseToolbar({ 
  repositoryId,
  versionId,
  selectedNodeId,
  explorationLevel, 
  setExplorationLevel, 
  viewMode,
  setViewMode,
  edgeDensity, 
  setEdgeDensity, 
  focusMode, 
  setFocusMode,
  onSelectSearchResult,
  onFocusSelected,
  onResetView
}: Props) {
  return (
    <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-40 select-none pointer-events-none">
      {/* Left: 2D Switcher & View Modes */}
      <div className="flex items-center space-x-2 pointer-events-auto">
        <div className="flex items-center space-x-1 border border-gray-200 rounded-lg p-1 bg-white/95 backdrop-blur-sm shadow-xs">
          <Link 
            href={`/repositories/${repositoryId}?version=${versionId}${selectedNodeId ? `&node=${selectedNodeId}` : ''}`}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 text-xs font-semibold text-gray-700 hover:text-black hover:bg-gray-100 rounded-md transition-colors"
            title="Return to 2D Graph Explorer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>2D Graph</span>
          </Link>
          <div className="h-4 w-px bg-gray-200 mx-1" />
          <button
            onClick={() => {
              setViewMode('ARCHITECTURE');
              setExplorationLevel('architecture');
            }}
            className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              viewMode === 'ARCHITECTURE' 
                ? 'bg-black text-white font-semibold shadow-xs' 
                : 'text-gray-600 hover:text-black hover:bg-gray-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Architecture</span>
          </button>
          <button
            onClick={() => {
              setViewMode('DEPENDENCIES');
              setExplorationLevel('file');
              setEdgeDensity('MEDIUM');
            }}
            className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              viewMode === 'DEPENDENCIES' 
                ? 'bg-black text-white font-semibold shadow-xs' 
                : 'text-gray-600 hover:text-black hover:bg-gray-100'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Dependencies</span>
          </button>
          <button
            onClick={() => {
              setViewMode('IMPACT');
              setEdgeDensity('HIGH');
            }}
            className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              viewMode === 'IMPACT' 
                ? 'bg-amber-50 text-amber-900 border border-amber-300 font-semibold shadow-xs' 
                : 'text-gray-600 hover:text-black hover:bg-gray-100'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Impact</span>
          </button>
        </div>
      </div>

      {/* Center: Version Info */}
      <div className="hidden lg:flex items-center space-x-2 border border-gray-200 rounded-lg px-3 py-1.5 bg-white/95 backdrop-blur-sm shadow-xs text-xs pointer-events-auto">
        <span className="text-gray-400 font-medium">Version:</span>
        <span className="font-mono font-semibold text-gray-800">
          {versionId === 'latest' ? 'latest' : versionId.substring(0, 7)}
        </span>
        <div className="flex items-center space-x-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
          <span>CONNECTED</span>
        </div>
      </div>

      {/* Right: Search, Reset, Focus */}
      <div className="flex items-center space-x-2 pointer-events-auto">
        {/* Search */}
        <UniverseSearch 
          repositoryId={repositoryId}
          versionId={versionId}
          onSelectResult={onSelectSearchResult}
        />

        {/* Focus Mode Toggle */}
        <button
          onClick={() => setFocusMode(!focusMode)}
          className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg border text-xs font-semibold shadow-xs transition-colors ${
            focusMode 
              ? 'bg-black text-white border-black ring-2 ring-black/10' 
              : 'bg-white/95 backdrop-blur-sm text-gray-700 border-gray-200 hover:bg-gray-100'
          }`}
          title="Dim unrelated nodes"
        >
          <Target className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Focus</span>
        </button>

        {/* Reset Camera */}
        <button
          onClick={onResetView}
          className="p-1.5 bg-white/95 backdrop-blur-sm border border-gray-200 text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg shadow-xs transition-colors"
          title="Reset Camera (R)"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
