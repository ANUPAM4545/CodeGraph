'use client';

import React from 'react';
import { Layers, Activity } from 'lucide-react';

interface GraphFiltersProps {
  allNodeTypes: string[];
  allRelTypes: string[];
  activeNodeTypes: Set<string>;
  activeRelTypes: Set<string>;
  onToggleNodeType: (type: string) => void;
  onToggleRelType: (type: string) => void;
}

export default function GraphFilters({
  allNodeTypes,
  allRelTypes,
  activeNodeTypes,
  activeRelTypes,
  onToggleNodeType,
  onToggleRelType,
}: GraphFiltersProps) {
  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="h-9 border-b border-gray-200 flex items-center px-4 bg-gray-50 flex-shrink-0 sticky top-0 z-10">
        <h2 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Filters</h2>
      </div>
      <div className="p-3 space-y-4">
        <div>
          <h3 className="text-[11px] font-semibold text-gray-700 mb-2 flex items-center">
            <Layers className="w-3 h-3 mr-1.5 text-gray-400" /> Node Types
          </h3>
          <div className="space-y-1.5">
            {allNodeTypes.map((type) => {
              const checked = activeNodeTypes.has(type);
              return (
                <label
                  key={type}
                  className="flex items-center space-x-2 text-xs text-gray-700 hover:text-black cursor-pointer select-none"
                >
                  <input
                    type="checkbox"
                    className="w-3.5 h-3.5 rounded border-gray-300 text-black focus:ring-0 cursor-pointer"
                    checked={checked}
                    onChange={() => onToggleNodeType(type)}
                  />
                  <span>{type}</span>
                </label>
              );
            })}
          </div>
        </div>

        <div className="border-t border-gray-100 pt-3">
          <h3 className="text-[11px] font-semibold text-gray-700 mb-2 flex items-center">
            <Activity className="w-3 h-3 mr-1.5 text-gray-400" /> Relationships
          </h3>
          <div className="space-y-1.5">
            {allRelTypes.map((type) => {
              const checked = activeRelTypes.has(type);
              return (
                <label
                  key={type}
                  className="flex items-center space-x-2 text-xs text-gray-700 hover:text-black cursor-pointer select-none"
                >
                  <input
                    type="checkbox"
                    className="w-3.5 h-3.5 rounded border-gray-300 text-black focus:ring-0 cursor-pointer"
                    checked={checked}
                    onChange={() => onToggleRelType(type)}
                  />
                  <span>{type}</span>
                </label>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
