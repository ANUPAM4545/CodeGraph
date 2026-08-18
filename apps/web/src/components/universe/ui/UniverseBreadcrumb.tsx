'use client';

import React from 'react';
import { ChevronRight } from 'lucide-react';
import { UniverseNode } from '../../../types/universe';

interface Props {
  node: UniverseNode | null;
  allNodes: Map<string, UniverseNode>;
  onNavigate: (nodeId: string) => void;
}

export default function UniverseBreadcrumb({ node, allNodes, onNavigate }: Props) {
  if (!node) return null;

  // Build breadcrumb path
  const path: UniverseNode[] = [];
  let current: UniverseNode | undefined = node;
  while (current) {
    path.unshift(current);
    current = current.parentId ? allNodes.get(current.parentId) : undefined;
  }

  return (
    <div className="absolute top-18 left-4 flex items-center bg-white/90 backdrop-blur-sm border border-gray-200 shadow-xs rounded-lg px-3 py-1.5 z-40 text-xs select-none">
      <span className="font-bold text-gray-900 mr-1.5">Universe</span>
      {path.map((n, idx) => (
        <React.Fragment key={n.id}>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400 mx-1 flex-shrink-0" />
          <button
            onClick={() => onNavigate(n.id)}
            className={`hover:text-black transition-colors truncate max-w-[140px] ${
              idx === path.length - 1 ? 'font-bold text-black' : 'text-gray-500'
            }`}
            title={n.label}
          >
            {n.label}
          </button>
        </React.Fragment>
      ))}
    </div>
  );
}
