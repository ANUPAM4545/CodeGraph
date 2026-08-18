'use client';

import React, { useState, useEffect } from 'react';
import GraphCanvas from './GraphCanvas';
import GraphToolbar from './GraphToolbar';
import RepositoryTree from './RepositoryTree';
import NodeInspector from './NodeInspector';
import AIAssistant from './AIAssistant';
import GraphFilters from './GraphFilters';
import { RealtimeProvider } from '../providers/RealtimeProvider';
import VersionNotification from './VersionNotification';

interface ExplorerLayoutProps {
  repositoryId: string;
  versionId: string;
}

const ALL_NODE_TYPES = ['RepositoryVersion', 'Directory', 'File', 'Class', 'Function', 'Method', 'Parameter', 'Variable', 'ExternalPackage'];
const ALL_REL_TYPES = ['CONTAINS', 'DEFINES', 'INHERITS', 'HAS_PARAMETER', 'CALLS', 'IMPORTS'];

const LEVEL_DEFAULT_NODES: Record<string, string[]> = {
  architecture: ['RepositoryVersion', 'Directory', 'File', 'ExternalPackage'],
  file: ['RepositoryVersion', 'Directory', 'File', 'Class', 'Function', 'Method', 'ExternalPackage'],
  symbol: ['RepositoryVersion', 'Class', 'Function', 'Method', 'Variable', 'Parameter']
};

const LEVEL_DEFAULT_RELS: Record<string, string[]> = {
  architecture: ['CONTAINS', 'IMPORTS'],
  file: ['CONTAINS', 'DEFINES', 'IMPORTS'],
  symbol: ['DEFINES', 'CALLS', 'INHERITS', 'HAS_PARAMETER']
};

export default function ExplorerLayout({ repositoryId, versionId }: ExplorerLayoutProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [expandedNodeIds, setExpandedNodeIds] = useState<Set<string>>(new Set());
  const [explorationLevel, setExplorationLevel] = useState<'architecture' | 'file' | 'symbol'>('architecture');
  const [aiTabOpen, setAiTabOpen] = useState<boolean>(false);
  
  // Option A: Level-appropriate filters checked by default
  const [activeNodeTypes, setActiveNodeTypes] = useState<Set<string>>(
    new Set(LEVEL_DEFAULT_NODES.architecture)
  );
  const [activeRelTypes, setActiveRelTypes] = useState<Set<string>>(
    new Set(LEVEL_DEFAULT_RELS.architecture)
  );

  const handleToggleExpand = (nodeId: string) => {
    setExpandedNodeIds(prev => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  };

  // When exploration level changes, re-initialize default checked filters
  const handleLevelChange = (newLevel: 'architecture' | 'file' | 'symbol') => {
    setExplorationLevel(newLevel);
    setActiveNodeTypes(new Set(LEVEL_DEFAULT_NODES[newLevel]));
    setActiveRelTypes(new Set(LEVEL_DEFAULT_RELS[newLevel]));
    setSelectedNodeId(null);
  };

  // Reset selected node, expanded nodes, and filters when versionId changes
  useEffect(() => {
    setSelectedNodeId(null);
    setExpandedNodeIds(new Set());
    setActiveNodeTypes(new Set(LEVEL_DEFAULT_NODES[explorationLevel]));
    setActiveRelTypes(new Set(LEVEL_DEFAULT_RELS[explorationLevel]));
  }, [versionId]);

  const toggleNodeType = (type: string) => {
    setActiveNodeTypes(prev => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  };

  const toggleRelType = (type: string) => {
    setActiveRelTypes(prev => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  };

  return (
    <RealtimeProvider repositoryId={repositoryId} versionId={versionId}>
      <div className="flex flex-col h-full w-full bg-white relative">
        <VersionNotification repositoryId={repositoryId} currentVersionId={versionId} />
        
        {/* Top Toolbar */}
        <GraphToolbar 
          level={explorationLevel} 
          setLevel={handleLevelChange} 
          repositoryId={repositoryId} 
          versionId={versionId}
          selectedNodeId={selectedNodeId}
          onSelectNode={(nodeId) => {
            setSelectedNodeId(nodeId);
            if (nodeId) {
              setExpandedNodeIds(prev => new Set(prev).add(nodeId));
            }
          }}
        />

        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar: 240px */}
          <div className="w-60 border-r border-gray-200 bg-gray-50 flex-shrink-0 flex flex-col">
            {/* Top 60%: Repository Tree */}
            <div className="h-3/5 border-b border-gray-200 overflow-hidden">
              <RepositoryTree 
                repositoryId={repositoryId} 
                versionId={versionId} 
                onSelectNode={setSelectedNodeId}
                selectedNodeId={selectedNodeId}
                expandedNodeIds={expandedNodeIds}
                onToggleExpand={handleToggleExpand}
              />
            </div>
            
            {/* Bottom 40%: Graph Filters */}
            <div className="h-2/5 overflow-hidden">
              <GraphFilters 
                allNodeTypes={ALL_NODE_TYPES}
                allRelTypes={ALL_REL_TYPES}
                activeNodeTypes={activeNodeTypes}
                activeRelTypes={activeRelTypes}
                onToggleNodeType={toggleNodeType}
                onToggleRelType={toggleRelType}
              />
            </div>
          </div>

          {/* Center Main Canvas: Flexible and dominant */}
          <div className="flex-1 relative bg-white min-w-0">
            <GraphCanvas 
              repositoryId={repositoryId}
              versionId={versionId}
              explorationLevel={explorationLevel}
              onNodeClick={setSelectedNodeId}
              selectedNodeId={selectedNodeId}
              expandedNodeIds={expandedNodeIds}
              onToggleExpand={handleToggleExpand}
              nodeFilters={Array.from(activeNodeTypes)}
              edgeFilters={Array.from(activeRelTypes)}
            />
          </div>

          {/* Right Sidebar: Contextual Node Inspector / AI (320px) */}
          {selectedNodeId ? (
            <div className="w-80 border-l border-gray-200 bg-white flex-shrink-0 flex flex-col shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)] z-10">
              <NodeInspector 
                nodeId={selectedNodeId} 
                repositoryId={repositoryId} 
                versionId={versionId}
                onClose={() => setSelectedNodeId(null)}
                onSelectNode={setSelectedNodeId}
              />
            </div>
          ) : (
            <div className="w-72 border-l border-gray-200 bg-gray-50/50 flex-shrink-0 flex flex-col items-center justify-center p-6 text-center text-xs text-gray-400 select-none">
              <div className="w-8 h-8 rounded-full border border-gray-200 bg-white flex items-center justify-center mb-2 text-gray-300">
                &bull;
              </div>
              <p className="font-medium text-gray-600 mb-1">Node Inspector</p>
              <p>Select any node in the graph or tree to inspect metadata, incoming/outgoing relationships, or run AI explain.</p>
            </div>
          )}
        </div>
      </div>
    </RealtimeProvider>
  );
}
