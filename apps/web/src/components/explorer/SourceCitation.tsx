import React from 'react';
import { FileCode2, Box, ArrowRightToLine, MessageSquareQuote } from 'lucide-react';

interface AISourceCitationProps {
  sourceType: string;
  filePath?: string;
  symbolName?: string;
  lineStart?: number;
  lineEnd?: number;
  onClick?: () => void;
}

export default function SourceCitation({ sourceType, filePath, symbolName, lineStart, lineEnd, onClick }: AISourceCitationProps) {
  let Icon = MessageSquareQuote;
  if (sourceType === 'CODE_CHUNK') Icon = FileCode2;
  else if (sourceType === 'GRAPH_NODE') Icon = Box;
  else if (sourceType === 'GRAPH_RELATIONSHIP') Icon = ArrowRightToLine;

  return (
    <button 
      onClick={onClick}
      className="flex flex-col text-left text-xs bg-gray-50 border border-gray-200 rounded p-2 hover:bg-gray-100 hover:border-gray-300 transition-colors w-full"
    >
      <div className="flex items-center space-x-1.5 text-gray-500 font-semibold uppercase tracking-wider mb-1">
        <Icon className="w-3 h-3" />
        <span className="text-[9px]">{sourceType}</span>
      </div>
      
      {symbolName && <div className="text-black font-medium truncate w-full">{symbolName}</div>}
      
      {(filePath || (lineStart && lineEnd)) && (
        <div className="flex items-center justify-between w-full mt-1 text-gray-500">
          <span className="truncate font-mono mr-2">{filePath}</span>
          {lineStart && lineEnd && (
            <span className="flex-shrink-0 font-mono">L{lineStart}-{lineEnd}</span>
          )}
        </div>
      )}
    </button>
  );
}
