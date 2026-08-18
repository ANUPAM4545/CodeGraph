import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { 
  Folder, 
  FileCode2, 
  PackageOpen, 
  Box, 
  ArrowRightLeft, 
  SquareFunction, 
  Brackets, 
  TerminalSquare,
  ChevronDown
} from 'lucide-react';

interface NodeStyleConfig {
  icon: React.ReactNode;
  bgClass: string;
  borderClass: string;
  textClass: string;
  badgeClass: string;
  iconContainerClass: string;
  label: string;
}

const nodeTypeConfigs: Record<string, NodeStyleConfig> = {
  RepositoryVersion: {
    icon: <PackageOpen className="w-4 h-4 text-slate-700" />,
    bgClass: 'bg-slate-50',
    borderClass: 'border-slate-300',
    textClass: 'text-slate-900',
    badgeClass: 'text-slate-500',
    iconContainerClass: 'bg-slate-200/70',
    label: 'RepositoryVersion'
  },
  Directory: {
    icon: <Folder className="w-4 h-4 text-amber-600" />,
    bgClass: 'bg-amber-50/40',
    borderClass: 'border-amber-200',
    textClass: 'text-amber-950',
    badgeClass: 'text-amber-700/70',
    iconContainerClass: 'bg-amber-100/60',
    label: 'Directory'
  },
  File: {
    icon: <FileCode2 className="w-4 h-4 text-blue-600" />,
    bgClass: 'bg-blue-50/40',
    borderClass: 'border-blue-200',
    textClass: 'text-blue-950',
    badgeClass: 'text-blue-700/70',
    iconContainerClass: 'bg-blue-100/60',
    label: 'File'
  },
  Class: {
    icon: <Box className="w-4 h-4 text-emerald-600" />,
    bgClass: 'bg-emerald-50/40',
    borderClass: 'border-emerald-200',
    textClass: 'text-emerald-950',
    badgeClass: 'text-emerald-700/70',
    iconContainerClass: 'bg-emerald-100/60',
    label: 'Class'
  },
  Function: {
    icon: <SquareFunction className="w-4 h-4 text-purple-600" />,
    bgClass: 'bg-purple-50/40',
    borderClass: 'border-purple-200',
    textClass: 'text-purple-950',
    badgeClass: 'text-purple-700/70',
    iconContainerClass: 'bg-purple-100/60',
    label: 'Function'
  },
  Method: {
    icon: <ArrowRightLeft className="w-4 h-4 text-indigo-600" />,
    bgClass: 'bg-indigo-50/40',
    borderClass: 'border-indigo-200',
    textClass: 'text-indigo-950',
    badgeClass: 'text-indigo-700/70',
    iconContainerClass: 'bg-indigo-100/60',
    label: 'Method'
  },
  Variable: {
    icon: <Brackets className="w-4 h-4 text-gray-600" />,
    bgClass: 'bg-gray-50/40',
    borderClass: 'border-gray-200',
    textClass: 'text-gray-900',
    badgeClass: 'text-gray-500',
    iconContainerClass: 'bg-gray-100',
    label: 'Variable'
  },
  Parameter: {
    icon: <Brackets className="w-4 h-4 text-gray-500" />,
    bgClass: 'bg-gray-50/30',
    borderClass: 'border-gray-200',
    textClass: 'text-gray-800',
    badgeClass: 'text-gray-400',
    iconContainerClass: 'bg-gray-100',
    label: 'Parameter'
  },
  ExternalPackage: {
    icon: <TerminalSquare className="w-4 h-4 text-orange-600" />,
    bgClass: 'bg-orange-50/40',
    borderClass: 'border-orange-200',
    textClass: 'text-orange-950',
    badgeClass: 'text-orange-700/70',
    iconContainerClass: 'bg-orange-100/60',
    label: 'External Package'
  }
};

function CustomGraphNode({ id, data, selected }: { id: string; data: any; selected?: boolean }) {
  const config = nodeTypeConfigs[data.type] || {
    icon: <Box className="w-4 h-4 text-gray-500" />,
    bgClass: 'bg-white',
    borderClass: 'border-gray-200',
    textClass: 'text-gray-900',
    badgeClass: 'text-gray-500',
    iconContainerClass: 'bg-gray-100',
    label: data.type || 'Node'
  };

  const isExpanded = data.isExpanded;
  const hasChildren = data.hasChildren;

  const handleExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (data.onToggleExpand) {
      data.onToggleExpand(id);
    }
  };

  return (
    <div 
      onDoubleClick={handleExpandClick}
      className={`relative px-3 py-2 flex items-center space-x-2.5 rounded-lg border ${config.bgClass} ${config.borderClass} ${selected ? 'ring-2 ring-black shadow-md border-black' : 'shadow-[0_1px_3px_rgba(0,0,0,0.04)]'} hover:shadow-md transition-all duration-150 select-none min-w-[155px] max-w-[210px] cursor-pointer`}
    >
      <Handle 
        type="target" 
        position={Position.Top} 
        className="w-2 h-2 !bg-slate-300 !border !border-white rounded-full transition-colors" 
      />
      
      <div className={`flex-shrink-0 w-7 h-7 rounded-md ${config.iconContainerClass} flex items-center justify-center`}>
        {config.icon}
      </div>

      <div className="flex flex-col min-w-0 flex-1 pr-1">
        <span 
          className={`text-xs font-semibold ${config.textClass} truncate leading-tight tracking-tight`}
          title={data.label}
        >
          {data.label}
        </span>
        <span className={`text-[10px] font-medium ${config.badgeClass} leading-none mt-0.5 tracking-normal`}>
          {config.label}
        </span>
      </div>

      {hasChildren && (
        <button
          onClick={handleExpandClick}
          title={isExpanded ? 'Collapse children' : 'Expand children'}
          className={`flex-shrink-0 w-5 h-5 rounded-md hover:bg-black/5 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all duration-200 ${isExpanded ? 'rotate-180 text-black bg-black/5' : ''}`}
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      )}

      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="w-2 h-2 !bg-slate-300 !border !border-white rounded-full transition-colors" 
      />
    </div>
  );
}

export default memo(CustomGraphNode);
