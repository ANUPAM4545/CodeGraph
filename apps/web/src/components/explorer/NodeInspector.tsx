'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { 
  X, 
  FileCode2, 
  Copy, 
  Check, 
  Sparkles, 
  Zap, 
  ExternalLink, 
  Folder, 
  Box, 
  SquareFunction, 
  TerminalSquare, 
  ArrowRightLeft, 
  PackageOpen,
  GitBranch,
  FileText,
  AlertCircle,
  RefreshCw,
  Layers,
  ArrowDownLeft,
  ArrowUpRight
} from 'lucide-react';
import { graphService } from '../../lib/graph/api';
import { NodeDetailDTO, NodeRelationshipDTO } from '../../types/graph';

interface NodeInspectorProps {
  nodeId: string;
  repositoryId: string;
  versionId: string;
  onClose: () => void;
  onSelectNode?: (nodeId: string) => void;
}

export default function NodeInspector({ 
  nodeId, 
  repositoryId, 
  versionId, 
  onClose,
  onSelectNode 
}: NodeInspectorProps) {
  const [nodeDetail, setNodeDetail] = useState<NodeDetailDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'relationships' | 'code'>('overview');
  const [copiedId, setCopiedId] = useState(false);
  
  const [explaining, setExplaining] = useState(false);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  const [impactLoading, setImpactLoading] = useState(false);
  const [impactData, setImpactData] = useState<any>(null);
  const [impactError, setImpactError] = useState<string | null>(null);

  // Fetch real node details from backend
  const loadDetails = useCallback(async () => {
    let active = true;
    setLoading(true);
    setError(null);
    setNodeDetail(null);
    setAiExplanation(null);
    setAiError(null);
    setImpactData(null);
    setImpactError(null);
    try {
      const data = await graphService.fetchNodeDetails(repositoryId, versionId, nodeId);
      if (active) {
        setNodeDetail(data);
      }
    } catch (err: any) {
      if (active) {
        console.error('Failed to load node details:', err);
        setError(err?.message || 'Unable to retrieve metadata for this node.');
        setNodeDetail(null);
      }
    } finally {
      if (active) {
        setLoading(false);
      }
    }
    return () => { active = false; };
  }, [nodeId, repositoryId, versionId]);

  useEffect(() => {
    loadDetails();
  }, [loadDetails]);

  const copyNodeId = () => {
    navigator.clipboard.writeText(nodeId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleExplainAI = async () => {
    setExplaining(true);
    setAiError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/repositories/${repositoryId}/ai/explain`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repository_version_id: versionId,
          node_id: nodeId,
        })
      });
      if (res.ok) {
        const json = await res.json();
        setAiExplanation(json.explanation || json.message || 'AI analysis completed.');
      } else {
        setAiError('Unable to generate AI explanation for this node.');
      }
    } catch {
      setAiError('Unable to connect to AI service.');
    } finally {
      setExplaining(false);
    }
  };

  const handleAnalyzeImpact = async () => {
    setImpactLoading(true);
    setImpactError(null);
    try {
      const data = await graphService.analyzeImpact(repositoryId, versionId, nodeId);
      setImpactData(data);
      setActiveTab('relationships');
    } catch (err: any) {
      setImpactError(err?.message || 'Impact analysis unavailable for this entity.');
    } finally {
      setImpactLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col h-full bg-white select-none">
        <div className="h-14 border-b border-gray-200 flex items-center justify-between px-4 flex-shrink-0">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">NODE INSPECTOR</span>
          <button onClick={onClose} className="text-gray-400 hover:text-black">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 p-8 flex flex-col items-center justify-center space-y-3">
          <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-gray-500 font-medium">Loading node details...</span>
        </div>
      </div>
    );
  }

  if (error || !nodeDetail) {
    return (
      <div className="flex flex-col h-full bg-white select-none">
        <div className="h-14 border-b border-gray-200 flex items-center justify-between px-4 flex-shrink-0">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">NODE INSPECTOR</span>
          <button onClick={onClose} className="text-gray-400 hover:text-black">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-3">
          <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
            <AlertCircle className="w-5 h-5" />
          </div>
          <p className="text-sm font-semibold text-gray-900">Node details unavailable</p>
          <p className="text-xs text-gray-500 max-w-xs">{error || 'Node not found in this repository version.'}</p>
          <button
            onClick={loadDetails}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium bg-black text-white rounded-md hover:bg-gray-800 transition-colors shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        </div>
      </div>
    );
  }

  const incoming = nodeDetail.incoming_relationships || [];
  const outgoing = nodeDetail.outgoing_relationships || [];
  const totalRelationships = incoming.length + outgoing.length;

  const getIcon = () => {
    switch (nodeDetail.type) {
      case 'RepositoryVersion': return <GitBranch className="w-5 h-5 text-purple-600" />;
      case 'Directory': return <Folder className="w-5 h-5 text-amber-600" />;
      case 'File': return <FileCode2 className="w-5 h-5 text-blue-600" />;
      case 'Class': return <Box className="w-5 h-5 text-emerald-600" />;
      case 'Function': return <SquareFunction className="w-5 h-5 text-violet-600" />;
      case 'Method': return <ArrowRightLeft className="w-5 h-5 text-indigo-600" />;
      case 'ExternalPackage': return <TerminalSquare className="w-5 h-5 text-orange-600" />;
      default: return <PackageOpen className="w-5 h-5 text-slate-700" />;
    }
  };

  const getRelBadgeStyle = (type: string) => {
    switch (type) {
      case 'CONTAINS': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'DEFINES': return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'IMPORTS': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'CALLS': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'INHERITS': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const renderRelationshipItem = (rel: NodeRelationshipDTO, idx: number) => {
    const isIncoming = rel.direction === 'INCOMING';
    return (
      <div 
        key={`${rel.connected_node_id}-${rel.type}-${idx}`}
        onClick={() => onSelectNode?.(rel.connected_node_id)}
        className="flex items-center justify-between p-2 rounded-lg border border-gray-100 hover:border-gray-300 hover:bg-gray-50/80 cursor-pointer transition-colors group"
      >
        <div className="flex items-center space-x-2 min-w-0 flex-1">
          <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase flex-shrink-0 flex items-center space-x-1 ${getRelBadgeStyle(rel.type)}`}>
            {isIncoming ? <ArrowDownLeft className="w-2.5 h-2.5 inline mr-0.5" /> : null}
            <span>{rel.type}</span>
            {!isIncoming ? <ArrowUpRight className="w-2.5 h-2.5 inline ml-0.5" /> : null}
          </span>
          <span className="text-xs font-semibold text-gray-800 truncate group-hover:text-black" title={rel.connected_node_name || 'Unnamed'}>
            {rel.connected_node_name || 'Unnamed'}
          </span>
        </div>
        <span className="text-[10px] font-medium text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded ml-2 flex-shrink-0">
          {rel.connected_node_type || 'Node'}
        </span>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-white select-none overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex-shrink-0 bg-white">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3 min-w-0 flex-1 pr-2">
            <div className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center flex-shrink-0">
              {getIcon()}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-bold text-gray-900 truncate leading-tight" title={nodeDetail.name || 'Unnamed'}>
                {nodeDetail.name || 'Unnamed'}
              </h3>
              <span className="text-[11px] font-medium text-gray-500 leading-none mt-0.5 block">
                {nodeDetail.type}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-1 flex-shrink-0">
            <button 
              onClick={copyNodeId} 
              title="Copy Node ID"
              className="flex items-center space-x-1 px-1.5 py-1 text-[10px] text-gray-500 hover:text-black hover:bg-gray-100 rounded border border-gray-200 transition-colors"
            >
              {copiedId ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              <span className="font-mono">{nodeId.substring(0, 6)}...</span>
            </button>
            <button onClick={onClose} className="p-1 text-gray-400 hover:text-black rounded hover:bg-gray-100 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tabs: Overview, Relationships, Code */}
        <div className="flex items-center space-x-2 border-b border-gray-100 mt-4 pt-1 text-xs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-2 px-1 font-medium border-b-2 transition-colors ${activeTab === 'overview' ? 'border-black text-black font-semibold' : 'border-transparent text-gray-500 hover:text-black'}`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('relationships')}
            className={`pb-2 px-1 font-medium border-b-2 transition-colors ${activeTab === 'relationships' ? 'border-black text-black font-semibold' : 'border-transparent text-gray-500 hover:text-black'}`}
          >
            Relationships ({totalRelationships})
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`pb-2 px-1 font-medium border-b-2 transition-colors ${activeTab === 'code' ? 'border-black text-black font-semibold' : 'border-transparent text-gray-500 hover:text-black'}`}
          >
            Code
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {/* TYPE SPECIFIC FIELDS */}

            {/* RepositoryVersion Specific */}
            {nodeDetail.type === 'RepositoryVersion' && (
              <div className="space-y-3">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">Commit SHA</span>
                  <span className="text-xs font-mono text-gray-800 break-all bg-gray-50 p-1.5 rounded border border-gray-100 block">
                    {nodeDetail.commit_sha || nodeDetail.name || 'Not available'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">Branch</span>
                    <span className="text-xs font-medium text-gray-800 block">
                      {nodeDetail.branch || 'main'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">Status</span>
                    <span className="text-xs font-medium text-emerald-600 block">
                      {nodeDetail.status || 'Completed'}
                    </span>
                  </div>
                </div>
                {nodeDetail.children_count !== null && nodeDetail.children_count !== undefined && (
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">Root Items</span>
                    <span className="text-xs font-mono text-gray-800 block">
                      {nodeDetail.children_count} items
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Directory Specific */}
            {nodeDetail.type === 'Directory' && (
              <div className="space-y-3">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">Path</span>
                  <span className="text-xs font-mono text-gray-800 break-all bg-gray-50 p-1.5 rounded border border-gray-100 block">
                    {nodeDetail.file_path || nodeDetail.name || 'Not available'}
                  </span>
                </div>
                {nodeDetail.children_count !== null && nodeDetail.children_count !== undefined && (
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">Contained Children</span>
                    <span className="text-xs font-mono text-gray-800 block">
                      {nodeDetail.children_count} items
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* File Specific */}
            {nodeDetail.type === 'File' && (
              <div className="space-y-3">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">File Path</span>
                  <span className="text-xs font-mono text-gray-800 break-all bg-gray-50 p-1.5 rounded border border-gray-100 block">
                    {nodeDetail.file_path || 'Not available'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">Language</span>
                    <span className="text-xs font-medium text-gray-800 block">
                      {nodeDetail.language || 'Not available'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">Lines</span>
                    <span className="text-xs font-mono text-gray-800 block">
                      {nodeDetail.line_start !== null && nodeDetail.line_end !== null
                        ? `${nodeDetail.line_start} – ${nodeDetail.line_end}`
                        : (nodeDetail.line_start !== null ? `${nodeDetail.line_start}` : 'Not available')}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Class Specific */}
            {nodeDetail.type === 'Class' && (
              <div className="space-y-3">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">Qualified Name</span>
                  <span className="text-xs font-mono text-gray-800 break-all bg-gray-50 p-1.5 rounded border border-gray-100 block">
                    {nodeDetail.qualified_name || nodeDetail.name || 'Not available'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">File Path</span>
                  <span className="text-xs font-mono text-gray-700 break-all block">
                    {nodeDetail.file_path || 'Not available'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">Language</span>
                    <span className="text-xs font-medium text-gray-800 block">
                      {nodeDetail.language || 'Not available'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">Lines</span>
                    <span className="text-xs font-mono text-gray-800 block">
                      {nodeDetail.line_start !== null && nodeDetail.line_end !== null
                        ? `${nodeDetail.line_start} – ${nodeDetail.line_end}`
                        : (nodeDetail.line_start !== null ? `${nodeDetail.line_start}` : 'Not available')}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Function / Method Specific */}
            {(nodeDetail.type === 'Function' || nodeDetail.type === 'Method') && (
              <div className="space-y-3">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">Qualified Name</span>
                  <span className="text-xs font-mono text-gray-800 break-all bg-gray-50 p-1.5 rounded border border-gray-100 block">
                    {nodeDetail.qualified_name || nodeDetail.name || 'Not available'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">File Path</span>
                  <span className="text-xs font-mono text-gray-700 break-all block">
                    {nodeDetail.file_path || 'Not available'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">Language</span>
                    <span className="text-xs font-medium text-gray-800 block">
                      {nodeDetail.language || 'Not available'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">Lines</span>
                    <span className="text-xs font-mono text-gray-800 block">
                      {nodeDetail.line_start !== null && nodeDetail.line_end !== null
                        ? `${nodeDetail.line_start} – ${nodeDetail.line_end}`
                        : (nodeDetail.line_start !== null ? `${nodeDetail.line_start}` : 'Not available')}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* ExternalPackage Specific */}
            {nodeDetail.type === 'ExternalPackage' && (
              <div className="space-y-3">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">Package Name</span>
                  <span className="text-xs font-mono text-gray-800 break-all bg-gray-50 p-1.5 rounded border border-gray-100 block">
                    {nodeDetail.name || 'Not available'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">Imported By</span>
                  <span className="text-xs font-mono text-gray-800 block">
                    {incoming.length} dependent files
                  </span>
                </div>
              </div>
            )}

            {/* Real Description if present */}
            {nodeDetail.description && (
              <div className="border-t border-gray-100 pt-3">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">Description</span>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {nodeDetail.description}
                </p>
              </div>
            )}

            {/* AI Explanation in Overview if requested */}
            {aiExplanation && (
              <div className="border-t border-gray-100 pt-3 space-y-1.5">
                <div className="flex items-center space-x-1 text-xs font-bold text-gray-900">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>AI Explanation</span>
                </div>
                <p className="text-xs text-gray-700 bg-amber-50/40 p-3 rounded-lg border border-amber-200/60 leading-relaxed">
                  {aiExplanation}
                </p>
                <span className="text-[10px] text-gray-400 italic block">
                  AI-generated explanation based on repository graph evidence.
                </span>
              </div>
            )}

            {aiError && (
              <div className="border-t border-gray-100 pt-3">
                <p className="text-xs text-red-600 bg-red-50 p-2 rounded border border-red-100">
                  {aiError}
                </p>
              </div>
            )}

            {impactError && (
              <div className="border-t border-gray-100 pt-3">
                <p className="text-xs text-red-600 bg-red-50 p-2 rounded border border-red-100">
                  {impactError}
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'relationships' && (
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                Incoming Connections ({incoming.length})
              </span>
              {incoming.length === 0 ? (
                <span className="text-xs text-gray-400 italic">No incoming connections</span>
              ) : (
                <div className="space-y-1.5">
                  {incoming.map((rel, idx) => renderRelationshipItem(rel, idx))}
                </div>
              )}
            </div>

            <div className="border-t border-gray-100 pt-3">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                Outgoing Connections ({outgoing.length})
              </span>
              {outgoing.length === 0 ? (
                <span className="text-xs text-gray-400 italic">No outgoing connections</span>
              ) : (
                <div className="space-y-1.5">
                  {outgoing.map((rel, idx) => renderRelationshipItem(rel, idx))}
                </div>
              )}
            </div>

            {impactData && (
              <div className="border-t border-gray-100 pt-3">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Impact Analysis Result</span>
                <pre className="text-[11px] font-mono bg-gray-900 text-green-400 p-2.5 rounded overflow-x-auto">
                  {JSON.stringify(impactData, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}

        {activeTab === 'code' && (
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Source Definition</span>
            {nodeDetail.source_code ? (
              <pre className="bg-gray-900 text-gray-100 p-3 rounded-lg font-mono text-xs overflow-x-auto leading-relaxed border border-gray-800">
                {nodeDetail.source_code}
              </pre>
            ) : (
              <div className="p-6 rounded-lg bg-gray-50 border border-gray-100 text-center space-y-2">
                <FileText className="w-6 h-6 text-gray-300 mx-auto" />
                <p className="text-xs text-gray-500">Source content is not available for this node.</p>
                {nodeDetail.github_url && (
                  <button
                    onClick={() => window.open(nodeDetail.github_url!, '_blank')}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold bg-black text-white rounded hover:bg-gray-800 transition-colors shadow-xs"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>View on GitHub</span>
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50/60 flex-shrink-0 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleExplainAI}
            disabled={explaining}
            className="flex items-center justify-center space-x-1.5 px-3 py-2 text-xs font-semibold rounded-md border border-gray-200 bg-white hover:bg-gray-50 text-gray-800 shadow-xs transition-colors"
          >
            {explaining ? (
              <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            )}
            <span>{explaining ? 'Analyzing...' : 'Explain with AI'}</span>
          </button>
          <button
            onClick={handleAnalyzeImpact}
            disabled={impactLoading}
            className="flex items-center justify-center space-x-1.5 px-3 py-2 text-xs font-semibold rounded-md border border-gray-200 bg-white hover:bg-gray-50 text-gray-800 shadow-xs transition-colors"
          >
            {impactLoading ? (
              <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <Zap className="w-3.5 h-3.5 text-blue-500" />
            )}
            <span>{impactLoading ? 'Calculating...' : 'Analyze Impact'}</span>
          </button>
        </div>

        <button
          onClick={() => {
            if (nodeDetail.github_url) {
              window.open(nodeDetail.github_url, '_blank');
            }
          }}
          disabled={!nodeDetail.github_url}
          className={`w-full flex items-center justify-center space-x-2 px-3 py-2 text-xs font-semibold rounded-md shadow-xs transition-colors ${nodeDetail.github_url ? 'bg-black text-white hover:bg-gray-800' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>{nodeDetail.github_url ? 'Open Source' : 'Source Location Unavailable'}</span>
        </button>
      </div>
    </div>
  );
}
