'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, Layers, Box, Code, BoxSelect, Loader2 } from 'lucide-react';
import Link from 'next/link';
import SyncStatus from '../ui/SyncStatus';
import { graphService } from '../../lib/graph/api';
import { GraphNodeDTO } from '../../types/graph';

interface GraphToolbarProps {
  level: 'architecture' | 'file' | 'symbol';
  setLevel: (level: 'architecture' | 'file' | 'symbol') => void;
  repositoryId: string;
  versionId: string;
  onSelectNode: (nodeId: string) => void;
  selectedNodeId?: string | null;
}

export default function GraphToolbar({ 
  level, 
  setLevel, 
  repositoryId, 
  versionId, 
  onSelectNode,
  selectedNodeId 
}: GraphToolbarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GraphNodeDTO[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await graphService.searchNodes(repositoryId, versionId, searchQuery);
        setSearchResults(results);
        setShowResults(true);
      } catch (err) {
        console.error('Search failed', err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, repositoryId, versionId]);

  return (
    <div className="h-14 border-b border-gray-200 bg-white flex items-center justify-between px-4 select-none">
      {/* Exploration Level Pills */}
      <div className="flex items-center space-x-1 border border-gray-200 rounded-lg p-1 bg-gray-50/80">
        <button 
          onClick={() => setLevel('architecture')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${level === 'architecture' ? 'bg-white shadow-xs border border-gray-200/90 text-black font-semibold' : 'text-gray-500 hover:text-black hover:bg-gray-100'}`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Architecture</span>
        </button>
        <button 
          onClick={() => setLevel('file')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${level === 'file' ? 'bg-white shadow-xs border border-gray-200/90 text-black font-semibold' : 'text-gray-500 hover:text-black hover:bg-gray-100'}`}
        >
          <Box className="w-3.5 h-3.5" />
          <span>File</span>
        </button>
        <button 
          onClick={() => setLevel('symbol')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${level === 'symbol' ? 'bg-white shadow-xs border border-gray-200/90 text-black font-semibold' : 'text-gray-500 hover:text-black hover:bg-gray-100'}`}
        >
          <Code className="w-3.5 h-3.5" />
          <span>Symbol</span>
        </button>
      </div>

      {/* Version Dropdown & History */}
      <div className="flex items-center space-x-3 mx-4">
        <span className="text-xs font-medium text-gray-500">Version:</span>
        <select 
          className="text-xs border-gray-200 rounded-md py-1 pl-2.5 pr-6 border bg-white focus:outline-none focus:ring-1 focus:ring-black font-mono font-medium text-gray-800 shadow-xs cursor-pointer"
          value={versionId}
          onChange={(e) => window.location.href = `/repositories/${repositoryId}?version=${e.target.value}`}
        >
          <option value={versionId}>{versionId === 'latest' ? 'latest version' : `version (${versionId.substring(0, 7)})`}</option>
          <option value="history">Browse History...</option>
        </select>
        <Link href={`/repositories/${repositoryId}/history`} className="text-xs font-medium text-blue-600 hover:underline">
          History
        </Link>
        <div className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
          <span>CONNECTED</span>
        </div>
      </div>

      {/* Search & View in 3D */}
      <div className="flex items-center space-x-3">
        <div className="relative" ref={searchRef}>
          {isSearching ? (
            <Loader2 className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 animate-spin" />
          ) : (
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          )}
          <input 
            type="text" 
            placeholder="Search nodes..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
            className="pl-8 pr-4 py-1.5 text-xs border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black w-60 shadow-xs placeholder:text-gray-400"
          />
          
          {showResults && (
            <div className="absolute top-full mt-1 w-80 right-0 bg-white border border-gray-200 shadow-lg rounded-md overflow-hidden z-50 max-h-80 overflow-y-auto">
              {searchResults.length === 0 ? (
                <div className="p-4 text-center text-xs text-gray-500">No nodes found.</div>
              ) : (
                <div className="py-1">
                  {searchResults.map(node => (
                    <button 
                      key={node.id}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50 flex flex-col items-start border-b border-gray-50 last:border-0"
                      onClick={() => {
                        onSelectNode(node.id);
                        setShowResults(false);
                      }}
                    >
                      <div className="flex items-center space-x-1.5">
                        <span className="text-[9px] uppercase font-bold text-gray-500 bg-gray-100 px-1 py-0.5 rounded">{node.type}</span>
                        <span className="text-xs font-semibold text-black truncate max-w-[200px]">{node.label}</span>
                      </div>
                      {node.metadata?.file_path && (
                        <span className="text-[10px] text-gray-400 font-mono mt-0.5 truncate max-w-full">
                          {node.metadata.file_path}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <Link href={`/repositories/${repositoryId}/universe?version=${versionId}${selectedNodeId ? `&node=${selectedNodeId}` : ''}`}>
          <button className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-black hover:bg-gray-800 rounded-md transition-colors shadow-xs">
            <Box className="w-3.5 h-3.5" />
            <span>View in 3D</span>
          </button>
        </Link>
      </div>
    </div>
  );
}
