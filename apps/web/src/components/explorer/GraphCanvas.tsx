'use client';

import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap, 
  useNodesState, 
  useEdgesState,
  Node,
  Edge,
  ReactFlowInstance
} from 'reactflow';
import 'reactflow/dist/style.css';
import { graphService } from '../../lib/graph/api';
import { adaptGraphToReactFlow } from '../../lib/graph/adapter';
import CustomGraphNode from './GraphNode';
import { GraphDTO, GraphOverviewDTO } from '../../types/graph';
import { Folder, FileCode2, Box, SquareFunction, TerminalSquare, RefreshCw } from 'lucide-react';

interface GraphCanvasProps {
  repositoryId: string;
  versionId: string;
  explorationLevel: 'architecture' | 'file' | 'symbol';
  onNodeClick?: (nodeId: string | null) => void;
  selectedNodeId: string | null;
  expandedNodeIds: Set<string>;
  onToggleExpand: (nodeId: string) => void;
  nodeFilters?: string[];
  edgeFilters?: string[];
}

const nodeTypes = { custom: CustomGraphNode };

export default function GraphCanvas({ 
  repositoryId, 
  versionId, 
  explorationLevel, 
  onNodeClick, 
  selectedNodeId, 
  expandedNodeIds,
  onToggleExpand,
  nodeFilters, 
  edgeFilters 
}: GraphCanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rawGraph, setRawGraph] = useState<GraphDTO | null>(null);
  const [overview, setOverview] = useState<GraphOverviewDTO | null>(null);
  const [edgeDensity, setEdgeDensity] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('LOW');

  const rfInstanceRef = useRef<ReactFlowInstance | null>(null);
  const initialCenteredRef = useRef(false);

  // Load raw graph data and overview
  const loadGraph = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [graphDTO, overviewDTO] = await Promise.all([
        graphService.fetchGraph(
          repositoryId, 
          versionId, 
          explorationLevel, 
          nodeFilters, 
          edgeFilters
        ),
        graphService.fetchGraphOverview(repositoryId, versionId).catch(() => null)
      ]);
      setRawGraph(graphDTO);
      if (overviewDTO) setOverview(overviewDTO);
    } catch (err: any) {
      console.error('Failed to load graph:', err);
      setError(err?.message || 'Unable to load repository architecture.');
      setRawGraph(null);
    } finally {
      setLoading(false);
    }
  }, [explorationLevel, repositoryId, versionId, nodeFilters, edgeFilters]);

  useEffect(() => {
    initialCenteredRef.current = false;
    loadGraph();
  }, [loadGraph]);

  // Compute progressive layout whenever rawGraph, expandedNodeIds, density, level or selection changes
  useEffect(() => {
    if (!rawGraph) {
      setNodes([]);
      setEdges([]);
      return;
    }

    const { nodes: layoutedNodes, edges: layoutedEdges } = adaptGraphToReactFlow(rawGraph, {
      edgeDensity,
      expandedNodeIds,
      explorationLevel,
      selectedNodeId
    });

    // Inject onToggleExpand callback into node data
    const nodesWithCallbacks = layoutedNodes.map(n => ({
      ...n,
      data: {
        ...n.data,
        onToggleExpand
      }
    }));

    setNodes(nodesWithCallbacks);
    setEdges(layoutedEdges);

    // Initial camera centering on Root Node at 1.0x readable zoom (No global fitView collapse!)
    if (!initialCenteredRef.current && layoutedNodes.length > 0 && rfInstanceRef.current) {
      initialCenteredRef.current = true;
      const root = layoutedNodes[0];
      setTimeout(() => {
        rfInstanceRef.current?.setCenter(root.position.x + 90, root.position.y + 120, {
          zoom: 1.0,
          duration: 400
        });
      }, 50);
    }
  }, [rawGraph, expandedNodeIds, edgeDensity, explorationLevel, selectedNodeId, onToggleExpand, setNodes, setEdges]);

  // Handle single node click -> selects node for Inspector & Focus mode
  const handleNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    onNodeClick?.(node.id);
  }, [onNodeClick]);

  // Handle pane click -> clears selection
  const handlePaneClick = useCallback(() => {
    onNodeClick?.(null);
  }, [onNodeClick]);

  // Smoothly center camera when a node is expanded or selected
  const focusOnNode = useCallback((nodeId: string) => {
    const targetNode = nodes.find(n => n.id === nodeId);
    if (targetNode && rfInstanceRef.current) {
      rfInstanceRef.current.setCenter(targetNode.position.x + 90, targetNode.position.y + 70, {
        zoom: 1.0,
        duration: 350
      });
    }
  }, [nodes]);

  useEffect(() => {
    if (selectedNodeId) {
      focusOnNode(selectedNodeId);
    }
  }, [selectedNodeId, focusOnNode]);

  // Apply Focus & Dim styling when a node is selected
  const displayNodes = useMemo(() => {
    if (!selectedNodeId) return nodes;

    const activeIds = new Set<string>([selectedNodeId]);
    edges.forEach(e => {
      if (e.source === selectedNodeId) activeIds.add(e.target);
      if (e.target === selectedNodeId) activeIds.add(e.source);
    });

    return nodes.map(n => {
      const isSelected = n.id === selectedNodeId;
      const isConnected = activeIds.has(n.id);

      return {
        ...n,
        selected: isSelected,
        style: {
          ...n.style,
          opacity: isSelected || isConnected ? 1 : 0.18,
          transition: 'opacity 0.25s ease, transform 0.25s ease'
        }
      };
    });
  }, [nodes, edges, selectedNodeId]);

  const displayEdges = useMemo(() => {
    if (!selectedNodeId) return edges;

    return edges.map(e => {
      const isRelevant = e.source === selectedNodeId || e.target === selectedNodeId;

      return {
        ...e,
        style: {
          ...e.style,
          strokeWidth: isRelevant ? 2.5 : 1,
          opacity: isRelevant ? 1 : 0.12,
          transition: 'all 0.25s ease'
        },
        animated: isRelevant || e.animated
      };
    });
  }, [edges, selectedNodeId]);

  return (
    <div className="w-full h-full relative flex flex-col bg-white overflow-hidden select-none">
      {/* Floating Center-Top Legend (Reference Image A) */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 flex items-center space-x-2 bg-white/95 backdrop-blur-sm border border-gray-200/90 rounded-full px-3.5 py-1 shadow-sm select-none">
        <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium text-amber-900 bg-amber-50 border border-amber-200/60">
          <Folder className="w-3 h-3 text-amber-600" />
          <span>Directory</span>
        </div>
        <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium text-blue-900 bg-blue-50 border border-blue-200/60">
          <FileCode2 className="w-3 h-3 text-blue-600" />
          <span>File</span>
        </div>
        <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium text-emerald-900 bg-emerald-50 border border-emerald-200/60">
          <Box className="w-3 h-3 text-emerald-600" />
          <span>Class</span>
        </div>
        <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium text-purple-900 bg-purple-50 border border-purple-200/60">
          <SquareFunction className="w-3 h-3 text-purple-600" />
          <span>Function</span>
        </div>
        <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium text-orange-900 bg-orange-50 border border-orange-200/60">
          <TerminalSquare className="w-3 h-3 text-orange-600" />
          <span>External Package</span>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 relative">
        {loading && (
          <div className="absolute inset-0 bg-white/80 z-20 flex items-center justify-center backdrop-blur-xs transition-opacity">
            <div className="flex flex-col items-center space-y-3">
              <div className="w-7 h-7 border-2 border-black border-t-transparent rounded-full animate-spin" />
              <span className="text-xs text-gray-700 font-medium tracking-wide">Loading repository architecture...</span>
            </div>
          </div>
        )}
        
        {error && !loading && (
          <div className="absolute inset-0 bg-gray-50/90 z-20 flex flex-col items-center justify-center p-6 text-center">
            <p className="text-sm font-semibold text-gray-900 mb-1">Architecture unavailable</p>
            <p className="text-xs text-gray-500 max-w-sm mb-4">This repository version has not completed graph analysis yet.</p>
            <button 
              onClick={loadGraph}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium bg-black text-white rounded-md hover:bg-gray-800 transition-colors shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Analysis</span>
            </button>
          </div>
        )}

        {!loading && !error && nodes.length === 0 && (
          <div className="absolute inset-0 bg-white z-20 flex flex-col items-center justify-center text-center p-6 space-y-2">
            <span className="text-sm font-medium text-gray-700">
              {overview?.total_nodes === 0 ? 'No architectural entities indexed yet.' : 'No entities match the selected filters.'}
            </span>
            <span className="text-xs text-gray-400 max-w-sm">
              {overview?.total_nodes === 0
                ? 'The repository analysis may be pending, running, or failed. Use the Sync button above to run or retry analysis.'
                : 'Try enabling more node types or adjusting the exploration level above.'}
            </span>
          </div>
        )}

        <ReactFlow
          nodes={displayNodes}
          edges={displayEdges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={handleNodeClick}
          onPaneClick={handlePaneClick}
          onInit={(instance) => { rfInstanceRef.current = instance; }}
          defaultViewport={{ x: 250, y: 60, zoom: 1.0 }}
          minZoom={0.4}
          maxZoom={1.6}
          className="bg-transparent"
        >
          <Background color="#CBD5E1" gap={20} size={1} />
          <Controls 
            showInteractive={false}
            className="fill-black shadow-sm rounded-md overflow-hidden bg-white border border-gray-200" 
          />
          <MiniMap 
            nodeStrokeColor="#000" 
            nodeColor={(n) => {
              if (n.data?.type === 'Directory') return '#fef3c7';
              if (n.data?.type === 'File') return '#dbeafe';
              if (n.data?.type === 'Class') return '#d1fae5';
              if (n.data?.type === 'Function') return '#f3e8ff';
              return '#f1f5f9';
            }}
            maskColor="rgba(0,0,0,0.04)" 
            className="rounded-lg overflow-hidden shadow-sm border border-gray-200 !bottom-3 !right-3"
          />
        </ReactFlow>
      </div>
      
      {/* Bottom Status Bar */}
      <div className="h-8 border-t border-gray-200 bg-white flex items-center px-4 justify-between text-[11px] text-gray-500 font-mono flex-shrink-0 relative z-10 select-none whitespace-nowrap overflow-hidden">
        <div className="flex items-center space-x-2.5 flex-shrink-0">
          <span className="font-semibold text-gray-900">{nodes.length} visible</span>
          <span className="text-gray-300">&middot;</span>
          <span>{(overview?.total_nodes ?? 0).toLocaleString()} total nodes</span>
          <span className="text-gray-300">&middot;</span>
          <span>{(overview?.total_edges ?? edges.length).toLocaleString()} relationships</span>
          <span className="text-gray-300">&middot;</span>
          <div className="flex items-center space-x-1 border border-gray-200 rounded px-1.5 py-0.5 bg-gray-50 text-[10px]">
            <span className="text-gray-400 font-bold">DENSITY:</span>
            <button
              onClick={() => setEdgeDensity('LOW')}
              className={`px-1.5 py-0.5 rounded font-medium transition-colors ${edgeDensity === 'LOW' ? 'bg-black text-white' : 'text-gray-600 hover:text-black'}`}
            >
              Low
            </button>
            <button
              onClick={() => setEdgeDensity('MEDIUM')}
              className={`px-1.5 py-0.5 rounded font-medium transition-colors ${edgeDensity === 'MEDIUM' ? 'bg-black text-white' : 'text-gray-600 hover:text-black'}`}
            >
              Med
            </button>
            <button
              onClick={() => setEdgeDensity('HIGH')}
              className={`px-1.5 py-0.5 rounded font-medium transition-colors ${edgeDensity === 'HIGH' ? 'bg-black text-white' : 'text-gray-600 hover:text-black'}`}
            >
              High
            </button>
          </div>
        </div>
        <div className="flex items-center space-x-2.5 text-gray-500 flex-shrink-0 ml-4">
          <span>
            Version: {overview?.repository_version_id ? overview.repository_version_id.substring(0, 7) : (versionId === 'latest' ? 'latest' : versionId.substring(0, 7))}
          </span>
          <span className="text-gray-300">&middot;</span>
          <span>Branch: main</span>
          <span className="text-gray-300">&middot;</span>
          <span className="capitalize">{explorationLevel} Level</span>
          <span className="text-gray-300">&middot;</span>
          <span className="flex items-center space-x-1 text-emerald-600 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
            <span>Connected</span>
          </span>
        </div>
      </div>
    </div>
  );
}
