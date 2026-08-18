'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import UniverseCanvas from './UniverseCanvas';
import UniverseToolbar from './ui/UniverseToolbar';
import UniverseSidebar from './ui/UniverseSidebar';
import UniverseBreadcrumb from './ui/UniverseBreadcrumb';
import UniverseMinimap from './ui/UniverseMinimap';
import UniverseFloatingCard from './ui/UniverseFloatingCard';
import NodeInspector from '../explorer/NodeInspector';
import AIAssistant from '../explorer/AIAssistant';
import { graphService } from '../../lib/graph/api';
import { buildUniverseHierarchy } from './adapters/graphToUniverse';
import { UniverseHierarchy } from '../../types/universe';
import { GraphOverviewDTO, GraphNodeDTO, GraphEdgeDTO } from '../../types/graph';
import { RealtimeProvider } from '../providers/RealtimeProvider';
import VersionNotification from '../explorer/VersionNotification';
import { AlertCircle, RefreshCw, X } from 'lucide-react';

interface Props {
  repositoryId: string;
  versionId: string;
  initialNodeId?: string | null;
}

export default function UniverseLayout({ repositoryId, versionId, initialNodeId }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Raw Graph Data from API
  const [rawNodes, setRawNodes] = useState<GraphNodeDTO[]>([]);
  const [rawEdges, setRawEdges] = useState<GraphEdgeDTO[]>([]);
  const [overview, setOverview] = useState<GraphOverviewDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Progressive Expansion State (Set of expanded node IDs)
  const [expandedNodeIds, setExpandedNodeIds] = useState<Set<string>>(new Set());

  // UI / View State
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(initialNodeId || null);
  const [explorationLevel, setExplorationLevel] = useState<'architecture' | 'file' | 'symbol'>('architecture');
  const [viewMode, setViewMode] = useState<'ARCHITECTURE' | 'DEPENDENCIES' | 'IMPACT'>('ARCHITECTURE');
  const [edgeDensity, setEdgeDensity] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM');
  const [focusMode, setFocusMode] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [showBoundaries, setShowBoundaries] = useState(true);
  const [aiOpen, setAiOpen] = useState(false);

  // Camera Signals
  const [resetSignal, setResetSignal] = useState(0);
  const [focusSignal, setFocusSignal] = useState(0);
  const [topViewSignal, setTopViewSignal] = useState(0);

  // Impact Analysis State
  const [impactData, setImpactData] = useState<any>(null);
  const [impactNodeIds, setImpactNodeIds] = useState<Set<string>>(new Set());

  // Load Overview Metrics
  useEffect(() => {
    async function loadOverview() {
      try {
        const ov = await graphService.fetchGraphOverview(repositoryId, versionId);
        setOverview(ov);
      } catch (err) {
        console.error('Failed to load graph overview', err);
      }
    }
    loadOverview();
  }, [repositoryId, versionId]);

  // Load Raw Graph from API
  const loadGraph = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await graphService.fetchGraph(repositoryId, versionId, explorationLevel);
      setRawNodes(data.nodes);
      setRawEdges(data.edges);
    } catch (e: any) {
      console.error('Error loading universe graph:', e);
      setError(e?.message || 'Unable to load Codebase Universe.');
    } finally {
      setLoading(false);
    }
  }, [repositoryId, versionId, explorationLevel]);

  useEffect(() => {
    loadGraph();
  }, [loadGraph]);

  // Reset states on version change
  useEffect(() => {
    setSelectedNodeId(null);
    setExpandedNodeIds(new Set());
    setImpactData(null);
    setImpactNodeIds(new Set());
  }, [versionId]);

  // Progressive Expansion Toggle
  const handleToggleExpand = useCallback((nodeId: string) => {
    setExpandedNodeIds(prev => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  }, []);

  // Compute 3D Hierarchy deterministically from raw data and expansion state
  const hierarchy: UniverseHierarchy | null = useMemo(() => {
    if (rawNodes.length === 0) return null;
    return buildUniverseHierarchy(rawNodes, rawEdges, expandedNodeIds, viewMode, selectedNodeId);
  }, [rawNodes, rawEdges, expandedNodeIds, viewMode, selectedNodeId]);

  // Sync URL State when selecting node & auto-expand children on select
  const handleNodeSelect = useCallback((id: string | null) => {
    setSelectedNodeId(id);
    if (id && hierarchy) {
      const node = hierarchy.allNodes.get(id);
      if (node && (node.hasChildren || node.children.length > 0)) {
        setExpandedNodeIds(prev => new Set(prev).add(id));
      }
    }
    const params = new URLSearchParams(searchParams.toString());
    if (id) {
      params.set('node', id);
    } else {
      params.delete('node');
    }
    router.replace(`${pathname}?${params.toString()}`);
  }, [router, pathname, searchParams, hierarchy]);

  // Search Selection: Auto-expand required ancestor hierarchy so target node is visible in 3D
  const handleSelectSearchResult = useCallback((nodeId: string) => {
    if (!hierarchy) return;

    // Trace all ancestor IDs up to root
    const ancestors = new Set<string>();
    let curr = hierarchy.allNodes.get(nodeId);
    while (curr && curr.parentId) {
      ancestors.add(curr.parentId);
      curr = hierarchy.allNodes.get(curr.parentId);
    }

    setExpandedNodeIds(prev => {
      const next = new Set(prev);
      ancestors.forEach(a => next.add(a));
      return next;
    });

    handleNodeSelect(nodeId);
    setFocusSignal(prev => prev + 1);
  }, [hierarchy, handleNodeSelect]);

  // Expand all top-level directories
  const handleExpandAllTop = useCallback(() => {
    if (!hierarchy) return;
    const topIds = hierarchy.root.children.filter(c => c.type === 'Directory').map(c => c.id);
    setExpandedNodeIds(new Set(topIds));
  }, [hierarchy]);

  // Collapse all
  const handleCollapseAll = useCallback(() => {
    setExpandedNodeIds(new Set());
  }, []);

  // Handle Impact mode activation
  useEffect(() => {
    if (viewMode === 'IMPACT' && selectedNodeId) {
      const runImpact = async () => {
        try {
          const res = await graphService.analyzeImpact(repositoryId, versionId, selectedNodeId!);
          setImpactData(res);
          const affected = new Set<string>();
          if (res?.affected_nodes) {
            res.affected_nodes.forEach((n: any) => affected.add(n.id || n));
          }
          if (selectedNodeId) affected.add(selectedNodeId);
          setImpactNodeIds(affected);
        } catch (err) {
          console.error('Impact analysis error:', err);
        }
      };
      runImpact();
    } else if (viewMode !== 'IMPACT') {
      setImpactNodeIds(new Set());
    }
  }, [viewMode, selectedNodeId, repositoryId, versionId]);

  const selectedNode = selectedNodeId && hierarchy ? hierarchy.allNodes.get(selectedNodeId) || null : null;
  const visibleCount = hierarchy ? hierarchy.visibleNodes.length : 0;
  const edgeCount = hierarchy ? hierarchy.visibleEdges.length : 0;
  const totalCount = overview ? overview.total_nodes : (hierarchy ? hierarchy.allNodes.size : 0);

  return (
    <RealtimeProvider repositoryId={repositoryId} versionId={versionId}>
      <div className="relative w-full h-full bg-[#fafafa] overflow-hidden flex flex-col select-none font-sans">
        <VersionNotification repositoryId={repositoryId} currentVersionId={versionId} />
        
        {/* Main 3D Canvas Area */}
        <div className="flex-1 relative flex overflow-hidden">
          {loading ? (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50/80 space-y-3">
              <div className="w-7 h-7 border-2 border-black border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-semibold text-gray-600">Loading 3D Codebase Universe...</span>
            </div>
          ) : error || !hierarchy ? (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 p-6 text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                <AlertCircle className="w-5 h-5" />
              </div>
              <p className="text-sm font-semibold text-gray-900">Unable to load Codebase Universe</p>
              <p className="text-xs text-gray-500 max-w-sm">{error || 'No architectural graph available for this repository version.'}</p>
              <button
                onClick={loadGraph}
                className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium bg-black text-white rounded-md hover:bg-gray-800 transition-colors shadow-sm"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry</span>
              </button>
            </div>
          ) : (
            <>
              {/* 3D Scene */}
              <div className="flex-1 relative h-full">
                <UniverseCanvas 
                  hierarchy={hierarchy}
                  selectedNodeId={selectedNodeId}
                  onNodeSelect={handleNodeSelect}
                  onToggleExpand={handleToggleExpand}
                  explorationLevel={explorationLevel}
                  setExplorationLevel={setExplorationLevel}
                  edgeDensity={edgeDensity}
                  focusMode={focusMode}
                  showLabels={showLabels}
                  showBoundaries={showBoundaries}
                  impactNodeIds={impactNodeIds}
                  resetSignal={resetSignal}
                  focusSignal={focusSignal}
                  topViewSignal={topViewSignal}
                />

                {/* Top Toolbar */}
                <UniverseToolbar 
                  repositoryId={repositoryId}
                  versionId={versionId}
                  selectedNodeId={selectedNodeId}
                  explorationLevel={explorationLevel}
                  setExplorationLevel={setExplorationLevel}
                  viewMode={viewMode}
                  setViewMode={setViewMode}
                  edgeDensity={edgeDensity}
                  setEdgeDensity={setEdgeDensity}
                  focusMode={focusMode}
                  setFocusMode={setFocusMode}
                  onSelectSearchResult={handleSelectSearchResult}
                  onFocusSelected={() => setFocusSignal(prev => prev + 1)}
                  onResetView={() => setResetSignal(prev => prev + 1)}
                />

                {/* Left Navigation Sidebar */}
                <UniverseSidebar 
                  repositoryId={repositoryId}
                  versionId={versionId}
                  selectedNodeId={selectedNodeId}
                  explorationLevel={explorationLevel}
                  setExplorationLevel={setExplorationLevel}
                  viewMode={viewMode}
                  setViewMode={setViewMode}
                  edgeDensity={edgeDensity}
                  setEdgeDensity={setEdgeDensity}
                  showLabels={showLabels}
                  setShowLabels={setShowLabels}
                  showBoundaries={showBoundaries}
                  setShowBoundaries={setShowBoundaries}
                  onFocusSelected={() => setFocusSignal(prev => prev + 1)}
                  onResetView={() => setResetSignal(prev => prev + 1)}
                  onTopView={() => setTopViewSignal(prev => prev + 1)}
                  onExpandAllTop={handleExpandAllTop}
                  onCollapseAll={handleCollapseAll}
                  onOpenAI={() => setAiOpen(true)}
                />

                {/* Breadcrumb Path */}
                <UniverseBreadcrumb 
                  node={selectedNode} 
                  allNodes={hierarchy.allNodes} 
                  onNavigate={handleNodeSelect} 
                />

                {/* 3D Architecture Minimap */}
                <UniverseMinimap 
                  hierarchy={hierarchy} 
                  selectedNodeId={selectedNodeId} 
                  onSelectNode={handleNodeSelect} 
                />

                {/* Floating Node Information Card */}
                {selectedNode && (
                  <UniverseFloatingCard
                    node={selectedNode}
                    hierarchy={hierarchy}
                    onFocus={() => setFocusSignal(prev => prev + 1)}
                    onInspect={() => {}}
                    onToggleExpand={() => handleToggleExpand(selectedNode.id)}
                  />
                )}
              </div>

              {/* Right Sidebar: Real Node Inspector */}
              {selectedNodeId && (
                <div className="w-80 border-l border-gray-200 bg-white flex-shrink-0 flex flex-col shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)] z-40">
                  <NodeInspector 
                    nodeId={selectedNodeId} 
                    repositoryId={repositoryId} 
                    versionId={versionId}
                    onClose={() => handleNodeSelect(null)} 
                    onSelectNode={handleSelectSearchResult}
                  />
                </div>
              )}

              {/* AI Assistant Drawer Modal */}
              {aiOpen && (
                <div className="w-96 border-l border-gray-200 bg-white shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-200">
                  <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-white">
                    <span className="font-bold text-gray-900 text-xs uppercase tracking-wider">AI ASSISTANT</span>
                    <button 
                      onClick={() => setAiOpen(false)} 
                      className="text-gray-400 hover:text-black p-1 rounded hover:bg-gray-100 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <AIAssistant 
                      repoId={repositoryId} 
                      versionId={versionId} 
                      selectedNodeId={selectedNodeId || undefined} 
                      aiReady={true}
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Bottom Status Bar */}
        <div className="h-7 border-t border-gray-200 bg-white/95 backdrop-blur-sm px-4 flex items-center justify-between text-[11px] font-mono text-gray-500 flex-shrink-0 z-30 select-none">
          <div className="flex items-center space-x-3">
            <span className="font-semibold text-gray-800">{visibleCount} visible nodes</span>
            <span>&bull;</span>
            <span>{edgeCount} relationships</span>
            <span>&bull;</span>
            <span>{totalCount.toLocaleString()} total nodes</span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1.5">
              <span className="text-gray-400">View:</span>
              <span className="text-gray-900 font-semibold uppercase">{viewMode}</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="text-gray-400">Branch:</span>
              <span className="text-gray-900 font-semibold">main</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="text-gray-400">Version:</span>
              <span className="text-gray-900 font-semibold">{versionId === 'latest' ? 'latest' : versionId.substring(0, 7)}</span>
            </div>
            <div className="flex items-center space-x-1 text-emerald-600 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
              <span>CONNECTED</span>
            </div>
          </div>
        </div>
      </div>
    </RealtimeProvider>
  );
}
