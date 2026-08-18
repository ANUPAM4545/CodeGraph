'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2, X } from 'lucide-react';
import { graphService } from '../../../lib/graph/api';
import { GraphNodeDTO } from '../../../types/graph';

interface Props {
  repositoryId: string;
  versionId: string;
  onSelectResult: (nodeId: string) => void;
}

export default function UniverseSearch({ repositoryId, versionId, onSelectResult }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GraphNodeDTO[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await graphService.searchNodes(repositoryId, versionId, query);
        setResults(res);
        setShowResults(true);
      } catch {
        // Fallback
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query, repositoryId, versionId]);

  return (
    <div className="relative w-64 shadow-xs" ref={searchRef}>
      <div className="relative">
        {isSearching ? (
          <Loader2 className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 animate-spin" />
        ) : (
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        )}
        <input 
          type="text" 
          placeholder="Search 3D universe..." 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setShowResults(true)}
          className="w-full pl-8.5 pr-7 py-1.5 text-xs bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-xs focus:outline-none focus:ring-1 focus:ring-black placeholder:text-gray-400 font-sans"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
              setShowResults(false);
            }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>
      
      {showResults && (
        <div className="absolute top-full mt-1.5 right-0 w-80 bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl shadow-xl overflow-hidden max-h-80 overflow-y-auto z-50">
          {results.length === 0 ? (
            <div className="p-4 text-center text-xs text-gray-400">No matching entities found in this version.</div>
          ) : (
            <div className="py-1">
              {results.map(r => (
                <button
                  key={r.id}
                  onClick={() => {
                    onSelectResult(r.id);
                    setShowResults(false);
                    setQuery('');
                  }}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 flex flex-col items-start border-b border-gray-50 last:border-0 transition-colors group"
                >
                  <div className="flex items-center space-x-1.5 w-full">
                    <span className="text-[9px] uppercase font-bold text-gray-500 bg-gray-100 px-1 py-0.5 rounded flex-shrink-0">
                      {r.type}
                    </span>
                    <span className="font-semibold text-gray-900 group-hover:text-black truncate flex-1">{r.label}</span>
                  </div>
                  {r.metadata?.file_path && (
                    <span className="text-[10px] text-gray-400 font-mono mt-0.5 truncate max-w-full">
                      {r.metadata.file_path}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
