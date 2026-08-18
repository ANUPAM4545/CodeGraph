'use client';

import React from 'react';
import { UniverseHierarchy, UniverseNode } from '../../../types/universe';
import { MapPin, Compass } from 'lucide-react';

interface Props {
  hierarchy: UniverseHierarchy;
  selectedNodeId: string | null;
  onSelectNode: (id: string) => void;
}

export default function UniverseMinimap({ hierarchy, selectedNodeId, onSelectNode }: Props) {
  const visibleNodes = hierarchy.visibleNodes;
  if (visibleNodes.length === 0) return null;

  // Calculate bounding box in XZ plane
  let minX = -60, maxX = 60, minZ = -120, maxZ = 20;
  visibleNodes.forEach(n => {
    minX = Math.min(minX, n.position.x - 10);
    maxX = Math.max(maxX, n.position.x + 10);
    minZ = Math.min(minZ, n.position.z - 10);
    maxZ = Math.max(maxZ, n.position.z + 10);
  });

  const spanX = Math.max(80, maxX - minX);
  const spanZ = Math.max(80, maxZ - minZ);

  // Map 3D coordinate to Minimap 140x90 px
  const mapWidth = 150;
  const mapHeight = 100;

  const toMapX = (x: number) => ((x - minX) / spanX) * (mapWidth - 16) + 8;
  const toMapY = (z: number) => ((z - minZ) / spanZ) * (mapHeight - 16) + 8;

  return (
    <div className="absolute bottom-10 left-4 w-[166px] bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl shadow-md p-2 z-40 select-none">
      <div className="flex items-center justify-between pb-1 border-b border-gray-100 text-[9px] font-bold text-gray-400 uppercase tracking-wider">
        <div className="flex items-center space-x-1">
          <Compass className="w-3 h-3 text-gray-500" />
          <span>Architecture Map</span>
        </div>
      </div>

      <div className="relative w-[150px] h-[100px] mt-1.5 bg-slate-50/80 rounded border border-gray-100 overflow-hidden">
        {/* Draw subtle cluster boxes */}
        {hierarchy.clusterBoundaries.map(b => {
          const cx = toMapX(b.center.x);
          const cy = toMapY(b.center.z);
          const bw = (b.size.width / spanX) * mapWidth;
          const bh = (b.size.depth / spanZ) * mapHeight;
          return (
            <div
              key={`mini-b-${b.nodeId}`}
              style={{
                left: `${cx - bw / 2}px`,
                top: `${cy - bh / 2}px`,
                width: `${bw}px`,
                height: `${bh}px`
              }}
              className="absolute border border-blue-300/50 bg-blue-100/30 rounded pointer-events-none"
            />
          );
        })}

        {/* Draw visible nodes */}
        {visibleNodes.map(n => {
          const nx = toMapX(n.position.x);
          const ny = toMapY(n.position.z);
          const isSelected = selectedNodeId === n.id;
          const isRoot = n.type === 'RepositoryVersion';
          const isDir = n.type === 'Directory';

          return (
            <button
              key={`mini-n-${n.id}`}
              onClick={() => onSelectNode(n.id)}
              style={{ left: `${nx - 3}px`, top: `${ny - 3}px` }}
              className={`absolute rounded-full transition-transform hover:scale-150 ${
                isSelected 
                  ? 'w-2.5 h-2.5 bg-black ring-2 ring-blue-500 z-10' 
                  : isRoot
                  ? 'w-2 h-2 bg-slate-900'
                  : isDir
                  ? 'w-1.5 h-1.5 bg-blue-600'
                  : 'w-1 h-1 bg-slate-400'
              }`}
              title={`${n.type}: ${n.label}`}
            />
          );
        })}
      </div>
    </div>
  );
}
