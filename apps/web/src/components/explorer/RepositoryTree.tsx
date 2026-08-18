'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Folder, FileCode2, ChevronRight, ChevronDown, PackageOpen } from 'lucide-react';
import { graphService } from '../../lib/graph/api';
import { GraphNodeDTO, GraphEdgeDTO } from '../../types/graph';

interface RepositoryTreeProps {
  repositoryId: string;
  versionId: string;
  onSelectNode: (nodeId: string) => void;
  selectedNodeId?: string | null;
  expandedNodeIds?: Set<string>;
  onToggleExpand?: (nodeId: string) => void;
}

interface TreeNode {
  id: string;
  label: string;
  type: string;
  children: TreeNode[];
}

export default function RepositoryTree({ 
  repositoryId, 
  versionId, 
  onSelectNode,
  selectedNodeId,
  expandedNodeIds,
  onToggleExpand
}: RepositoryTreeProps) {
  const [nodes, setNodes] = useState<GraphNodeDTO[]>([]);
  const [edges, setEdges] = useState<GraphEdgeDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [localExpanded, setLocalExpanded] = useState<Set<string>>(new Set());

  const effectiveExpanded = expandedNodeIds || localExpanded;

  useEffect(() => {
    let active = true;
    const loadTree = async () => {
      setLoading(true);
      try {
        const data = await graphService.fetchGraph(repositoryId, versionId, 'architecture');
        if (active) {
          setNodes(data.nodes);
          setEdges(data.edges);
        }
      } catch (err) {
        if (active) setError('Failed to load repository tree.');
      } finally {
        if (active) setLoading(false);
      }
    };
    loadTree();
    return () => { active = false; };
  }, [repositoryId, versionId]);

  const tree = useMemo(() => {
    const nodeMap = new Map<string, TreeNode>();
    const roots: TreeNode[] = [];

    // Create tree nodes
    nodes.forEach(n => {
      if (n.type === 'Directory' || n.type === 'File' || n.type === 'RepositoryVersion') {
        nodeMap.set(n.id, {
          id: n.id,
          label: n.label,
          type: n.type,
          children: []
        });
      }
    });

    // Build hierarchy using CONTAINS edges
    const childIds = new Set<string>();
    edges.forEach(e => {
      if (e.type === 'CONTAINS') {
        const parent = nodeMap.get(e.source);
        const child = nodeMap.get(e.target);
        if (parent && child) {
          parent.children.push(child);
          childIds.add(child.id);
        }
      }
    });

    // Find roots (nodes with no parents)
    nodeMap.forEach((node, id) => {
      if (!childIds.has(id)) {
        roots.push(node);
      }
    });

    // Sort children: Directories first, then alphabetical
    const sortTree = (nodes: TreeNode[]) => {
      nodes.sort((a, b) => {
        if (a.type === 'Directory' && b.type !== 'Directory') return -1;
        if (a.type !== 'Directory' && b.type === 'Directory') return 1;
        return a.label.localeCompare(b.label);
      });
      nodes.forEach(n => sortTree(n.children));
    };
    sortTree(roots);

    return roots;
  }, [nodes, edges]);

  const handleToggle = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (onToggleExpand) {
      onToggleExpand(id);
    } else {
      setLocalExpanded(prev => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
    }
  };

  const renderNode = (node: TreeNode, depth: number = 0) => {
    const isExpanded = effectiveExpanded.has(node.id) || node.type === 'RepositoryVersion';
    const isSelected = selectedNodeId === node.id;
    const isDir = node.type === 'Directory' || node.type === 'RepositoryVersion';
    const Icon = node.type === 'RepositoryVersion' ? PackageOpen : (node.type === 'Directory' ? Folder : FileCode2);

    return (
      <div key={node.id}>
        <div 
          className={`flex items-center py-1 pr-2 hover:bg-gray-100 cursor-pointer select-none transition-colors ${isSelected ? 'bg-gray-200/80 font-semibold text-black' : 'text-gray-700'}`}
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
          onClick={() => {
            onSelectNode(node.id);
            if (isDir && onToggleExpand) {
              onToggleExpand(node.id);
            }
          }}
        >
          <div 
            className="w-4 h-4 flex items-center justify-center mr-1 text-gray-400 hover:text-gray-700"
            onClick={isDir ? (e) => handleToggle(e, node.id) : undefined}
          >
            {isDir ? (isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />) : <div className="w-3.5 h-3.5" />}
          </div>
          <Icon className={`w-3.5 h-3.5 mr-2 ${isDir ? (node.type === 'RepositoryVersion' ? 'text-slate-700' : 'text-amber-600') : 'text-blue-500'}`} />
          <span className="text-xs truncate">{node.label}</span>
        </div>

        {isExpanded && node.children.length > 0 && (
          <div>
            {node.children.map(child => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-4 flex items-center space-x-2 text-xs text-gray-400">
        <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
        <span>Loading structure...</span>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-xs text-red-500">{error}</div>;
  }

  return (
    <div className="h-full overflow-y-auto py-2 font-mono">
      <div className="px-3 pb-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
        Repository Navigator
      </div>
      {tree.length === 0 ? (
        <div className="p-4 text-xs text-gray-400">
          No files indexed yet.
        </div>
      ) : (
        tree.map(root => renderNode(root))
      )}
    </div>
  );
}
