'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  ShieldCheck, 
  Layers, 
  Flame, 
  Repeat, 
  DoorOpen, 
  Activity, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Download, 
  Zap, 
  FileCode2, 
  FolderTree, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  Search,
  Sliders,
  Filter,
  X,
  Radio
} from 'lucide-react';
import { architectureService, ArchitectureReport, Subsystem, Hotspot, EntryPoint, Cycle } from '../../lib/api/architecture';
import { generateArchitecturePdf } from '../../lib/pdf/architecturePdf';
import { RealtimeClient } from '../../lib/api/realtime';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import Link from 'next/link';

interface ArchitectureDashboardProps {
  repositoryId: string;
  versionId: string;
  repoName?: string;
}

export default function ArchitectureDashboard({ repositoryId, versionId, repoName }: ArchitectureDashboardProps) {
  const [report, setReport] = useState<ArchitectureReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiveConnected, setIsLiveConnected] = useState(false);
  const [isLiveSyncing, setIsLiveSyncing] = useState(false);

  // Subsystem filter state (realtime cross-filtering)
  const [selectedSubsystem, setSelectedSubsystem] = useState<string | null>(null);
  const [hotspotSearch, setHotspotSearch] = useState('');

  // Change impact simulator state
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [impactDepth, setImpactDepth] = useState<number>(2);
  const [impactResult, setImpactResult] = useState<any>(null);
  const [impactLoading, setImpactLoading] = useState(false);

  // Expanded dropdown state
  const [expandedHotspotId, setExpandedHotspotId] = useState<string | null>(null);

  const fetchReport = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const data = await architectureService.getReport(repositoryId, versionId);
      setReport(data);
      if (data.hotspots && data.hotspots.length > 0 && !selectedHotspot) {
        setSelectedHotspot(data.hotspots[0]);
      }
    } catch (err: any) {
      console.error('Failed to load architecture report:', err);
      if (!silent) setError(err?.message || 'Unable to generate architecture report.');
    } finally {
      if (!silent) setLoading(false);
    }
  }, [repositoryId, versionId, selectedHotspot]);

  // Realtime WebSocket integration
  useEffect(() => {
    fetchReport();

    if (!repositoryId || !versionId || versionId === 'latest') return;

    const wsClient = new RealtimeClient(repositoryId, versionId);
    wsClient.connect();
    setIsLiveConnected(true);

    wsClient.on('PROCESSING', () => {
      setIsLiveSyncing(true);
    });

    wsClient.on('GRAPH_ANALYSIS_COMPLETED', () => {
      fetchReport(true);
    });

    wsClient.on('SEMANTIC_INDEX_COMPLETED', () => {
      fetchReport(true);
    });

    wsClient.on('VERSION_READY', () => {
      setIsLiveSyncing(false);
      fetchReport(true);
    });

    return () => {
      wsClient.disconnect();
      setIsLiveConnected(false);
    };
  }, [repositoryId, versionId, fetchReport]);

  const handleSimulateImpact = useCallback(async (hotspot: Hotspot, depth: number) => {
    setSelectedHotspot(hotspot);
    setImpactLoading(true);
    try {
      const res = await architectureService.analyzeChange(repositoryId, versionId, hotspot.id);
      setImpactResult(res);
    } catch (err) {
      console.error('Impact simulation failed:', err);
    } finally {
      setImpactLoading(false);
    }
  }, [repositoryId, versionId]);

  useEffect(() => {
    if (selectedHotspot) {
      handleSimulateImpact(selectedHotspot, impactDepth);
    }
  }, [selectedHotspot?.id, impactDepth, handleSimulateImpact]);

  const toggleHotspot = (hotspot: Hotspot) => {
    setSelectedHotspot(hotspot);
    setExpandedHotspotId(prev => prev === hotspot.id ? null : hotspot.id);
  };

  const exportPdfReport = () => {
    if (!report) return;
    generateArchitecturePdf(report, repoName || 'Repository');
  };

  // Filtered hotspots based on selected subsystem and search
  const filteredHotspots = useMemo(() => {
    if (!report?.hotspots) return [];
    return report.hotspots.filter(h => {
      const matchesSubsystem = !selectedSubsystem || (h.file && h.file.startsWith(selectedSubsystem));
      const matchesSearch = !hotspotSearch || 
        h.name.toLowerCase().includes(hotspotSearch.toLowerCase()) || 
        h.file.toLowerCase().includes(hotspotSearch.toLowerCase());
      return matchesSubsystem && matchesSearch;
    });
  }, [report?.hotspots, selectedSubsystem, hotspotSearch]);

  // Filtered entry points based on selected subsystem
  const filteredEntryPoints = useMemo(() => {
    if (!report?.entry_points) return [];
    return report.entry_points.filter(e => {
      if (!selectedSubsystem) return true;
      return e.file && e.file.startsWith(selectedSubsystem);
    });
  }, [report?.entry_points, selectedSubsystem]);

  if (loading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center space-y-3 text-muted">
        <RefreshCw className="w-6 h-6 animate-spin text-primary" />
        <span className="text-sm font-medium">Analyzing architectural subsystems, coupling boundaries, and hotspots...</span>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="p-8 border border-red-200 rounded-xl bg-red-50/50 text-red-800 space-y-3 text-center">
        <AlertTriangle className="w-8 h-8 text-red-600 mx-auto" />
        <p className="font-bold text-base">Unable to generate architecture report</p>
        <p className="text-xs font-mono text-red-600 max-w-lg mx-auto">{error || 'Make sure the repository has been analyzed.'}</p>
        <Button size="sm" variant="outline" onClick={() => fetchReport()} className="mt-2 text-xs">
          <RefreshCw className="w-3.5 h-3.5 mr-1" />
          Retry Analysis
        </Button>
      </div>
    );
  }

  const getHealthBadge = (health: string) => {
    switch (health) {
      case 'EXCELLENT':
        return <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">Low Coupling</Badge>;
      case 'MODERATE':
        return <Badge variant="secondary" className="bg-amber-50 text-amber-700 border-amber-200 text-[10px]">Moderate Coupling</Badge>;
      case 'HIGH_COUPLING':
        return <Badge variant="secondary" className="bg-red-50 text-red-700 border-red-200 text-[10px]">High Coupling</Badge>;
      default:
        return <Badge variant="outline" className="text-[10px]">{health}</Badge>;
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Banner & Real-time Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-border shadow-xs">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-foreground">Architecture & Structural Health</h2>
            <Badge variant="secondary" className="bg-blue-50 text-blue-700 font-mono text-xs">
              Grade {report.health_grade}
            </Badge>
            {/* Realtime Pulse */}
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{isLiveSyncing ? 'Syncing...' : 'Realtime Sync Active'}</span>
            </div>
          </div>
          <p className="text-xs text-muted mt-1">
            Real-time graph decomposition, live coupling metrics, and interactive blast radius simulator.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => fetchReport()} className="text-xs gap-1.5 h-8">
            <RefreshCw className={`w-3.5 h-3.5 text-muted ${loading ? 'animate-spin' : ''}`} />
            <span>Re-evaluate</span>
          </Button>
          <Button variant="outline" size="sm" onClick={exportPdfReport} className="text-xs gap-1.5 h-8 font-semibold shadow-2xs text-foreground hover:border-primary/50">
            <Download className="w-3.5 h-3.5 text-primary" />
            <span>Export PDF Report</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Architecture Health Score */}
        <Card className="bg-white border-border shadow-2xs">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-muted uppercase tracking-wider">Health Score</span>
              <ShieldCheck className={`w-4 h-4 ${report.health_score >= 80 ? 'text-emerald-600' : 'text-amber-600'}`} />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-foreground">{report.health_score}</span>
              <span className="text-xs font-semibold text-muted">/ 100</span>
            </div>
            <p className="text-[10px] text-muted mt-1">
              {report.health_score >= 85 ? 'Clean modular boundaries' : 'Some coupling detected'}
            </p>
          </CardContent>
        </Card>

        {/* Subsystems */}
        <Card className="bg-white border-border shadow-2xs">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-muted uppercase tracking-wider">Subsystems</span>
              <Layers className="w-4 h-4 text-blue-600" />
            </div>
            <div className="mt-2">
              <span className="text-2xl font-black text-foreground">{report.subsystems_count}</span>
            </div>
            <p className="text-[10px] text-muted mt-1">Top-level modules mapped</p>
          </CardContent>
        </Card>

        {/* Hotspots */}
        <Card className="bg-white border-border shadow-2xs">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-muted uppercase tracking-wider">Hotspots</span>
              <Flame className="w-4 h-4 text-orange-600" />
            </div>
            <div className="mt-2">
              <span className="text-2xl font-black text-foreground">{report.hotspots_count}</span>
            </div>
            <p className="text-[10px] text-muted mt-1">High fan-in dependencies</p>
          </CardContent>
        </Card>

        {/* Circular Dependencies */}
        <Card className="bg-white border-border shadow-2xs">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-muted uppercase tracking-wider">Cycles</span>
              <Repeat className={`w-4 h-4 ${report.cycles_count === 0 ? 'text-emerald-600' : 'text-red-600'}`} />
            </div>
            <div className="mt-2">
              <span className={`text-2xl font-black ${report.cycles_count === 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                {report.cycles_count}
              </span>
            </div>
            <p className="text-[10px] text-muted mt-1">
              {report.cycles_count === 0 ? 'No circular imports' : 'Circular loops found'}
            </p>
          </CardContent>
        </Card>

        {/* Entry Points */}
        <Card className="bg-white border-border shadow-2xs">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-muted uppercase tracking-wider">Entry Points</span>
              <DoorOpen className="w-4 h-4 text-purple-600" />
            </div>
            <div className="mt-2">
              <span className="text-2xl font-black text-foreground">{report.entry_points_count}</span>
            </div>
            <p className="text-[10px] text-muted mt-1">App gateways & roots</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: Subsystems Breakdown & Change Impact Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Subsystems & Modularity Table */}
        <div className="lg:col-span-2 space-y-6">
          {/* Subsystems Decomposition */}
          <Card className="bg-white border-border shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
                    <FolderTree className="w-4 h-4 text-primary" />
                    <span>Subsystem Decomposition & Modularity</span>
                  </CardTitle>
                  <p className="text-xs text-muted mt-0.5">
                    Click any subsystem to filter hotspots, entry points, and dependencies in real-time.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {selectedSubsystem && (
                    <button
                      onClick={() => setSelectedSubsystem(null)}
                      className="px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-bold flex items-center gap-1 hover:bg-blue-100 transition-colors"
                    >
                      <span>Filtered: {selectedSubsystem}</span>
                      <X className="w-3 h-3" />
                    </button>
                  )}
                  <Badge variant="outline" className="text-xs font-mono">
                    {report.subsystems.length} Modules
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-border/80 text-muted uppercase font-bold text-[10px] tracking-wider">
                      <th className="pb-2.5 font-semibold">Subsystem</th>
                      <th className="pb-2.5 font-semibold text-right">Files</th>
                      <th className="pb-2.5 font-semibold text-right">Symbols</th>
                      <th className="pb-2.5 font-semibold text-right">Cross Imports</th>
                      <th className="pb-2.5 font-semibold text-right">Coupling</th>
                      <th className="pb-2.5 font-semibold text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 font-mono">
                    {report.subsystems.map((sub) => {
                      const isSubSelected = selectedSubsystem === sub.name;
                      return (
                        <tr 
                          key={sub.id} 
                          onClick={() => setSelectedSubsystem(isSubSelected ? null : sub.name)}
                          className={`cursor-pointer transition-colors ${
                            isSubSelected 
                              ? 'bg-primary/10 font-bold' 
                              : 'hover:bg-surface/70'
                          }`}
                        >
                          <td className="py-3 font-semibold text-foreground flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${isSubSelected ? 'bg-primary scale-125' : 'bg-blue-500'}`} />
                            <span>{sub.name}</span>
                            {isSubSelected && (
                              <Badge variant="secondary" className="text-[9px] py-0 h-4 bg-primary/20 text-primary border-primary/30">Active Filter</Badge>
                            )}
                          </td>
                          <td className="py-3 text-right text-gray-700">{sub.files}</td>
                          <td className="py-3 text-right text-gray-700">{sub.symbols}</td>
                          <td className="py-3 text-right text-gray-700">{sub.external_dependency_count}</td>
                          <td className="py-3 text-right font-medium text-gray-900">{sub.coupling_ratio}</td>
                          <td className="py-3 text-center">{getHealthBadge(sub.health)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Architectural Hotspots Table */}
          <Card className="bg-white border-border shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Flame className="w-4 h-4 text-orange-600" />
                    <span>Top Architectural Hotspots (High Fan-In)</span>
                  </CardTitle>
                  <p className="text-xs text-muted mt-0.5">
                    Click any hotspot to open its real-time dependents dropdown and change simulator.
                  </p>
                </div>

                {/* Real-time search filter */}
                <div className="relative w-full sm:w-48">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted" />
                  <input
                    type="text"
                    value={hotspotSearch}
                    onChange={e => setHotspotSearch(e.target.value)}
                    placeholder="Search hotspots..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-border bg-surface text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredHotspots.length === 0 ? (
                <div className="p-6 text-center text-muted text-xs border border-dashed border-border rounded-xl">
                  No hotspots match the current filter {selectedSubsystem && `(${selectedSubsystem})`}.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {filteredHotspots.map((hotspot) => {
                    const isExpanded = expandedHotspotId === hotspot.id;
                    const isSelected = selectedHotspot?.id === hotspot.id;
                    const deps = hotspot.dependents || [];

                    return (
                      <div 
                        key={hotspot.id}
                        className={`rounded-xl border transition-all overflow-hidden ${
                          isExpanded || isSelected
                            ? 'border-primary/80 bg-white shadow-xs' 
                            : 'border-border/80 bg-surface/30 hover:bg-surface hover:border-border'
                        }`}
                      >
                        {/* Hotspot Header / Click target */}
                        <div
                          onClick={() => toggleHotspot(hotspot)}
                          className="p-3.5 cursor-pointer flex items-center justify-between text-xs select-none"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-7 h-7 rounded-lg bg-orange-50 border border-orange-200 text-orange-700 flex items-center justify-center flex-shrink-0 font-bold text-[10px]">
                              {hotspot.fan_in}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-foreground font-mono truncate text-xs">{hotspot.name}</span>
                                <Badge variant="outline" className="text-[9px] py-0 h-4 uppercase font-semibold">{hotspot.type}</Badge>
                              </div>
                              <p className="text-[11px] text-muted truncate font-mono mt-0.5">{hotspot.file}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2.5 flex-shrink-0 ml-3">
                            <span className="text-[11px] font-semibold text-gray-700">
                              {hotspot.fan_in} {hotspot.fan_in === 1 ? 'dependent' : 'dependents'}
                            </span>
                            <div className={`w-5 h-5 rounded flex items-center justify-center transition-transform ${isExpanded ? 'rotate-90 text-primary' : 'text-muted'}`}>
                              <ChevronRight className="w-4 h-4" />
                            </div>
                          </div>
                        </div>

                        {/* Dropdown: Real Dependents List */}
                        {isExpanded && (
                          <div className="border-t border-border/80 bg-surface/40 p-3 space-y-2 text-xs animate-in fade-in-50 duration-150">
                            <div className="flex items-center justify-between px-1">
                              <span className="text-[10px] uppercase font-bold text-muted tracking-wider flex items-center gap-1.5">
                                <Layers className="w-3 h-3 text-primary" />
                                <span>Incoming Dependents ({deps.length > 0 ? deps.length : hotspot.fan_in})</span>
                              </span>
                              <span className="text-[10px] text-muted font-mono">Real Graph Relationships</span>
                            </div>

                            {deps.length === 0 ? (
                              <div className="p-3 text-center text-muted text-[11px]">
                                No direct dependent metadata found.
                              </div>
                            ) : (
                              <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                                {deps.map((dep, idx) => (
                                  <div 
                                    key={dep.id || idx}
                                    className="p-2 rounded-lg bg-white border border-border/70 hover:border-primary/40 transition-colors flex items-center justify-between gap-2 shadow-2xs"
                                  >
                                    <div className="flex items-center gap-2.5 min-w-0">
                                      <FileCode2 className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                                      <div className="min-w-0">
                                        <span className="font-bold font-mono text-gray-900 truncate block text-[11px]">
                                          {dep.name}
                                        </span>
                                        {dep.file_path && dep.file_path !== dep.name && (
                                          <span className="text-[10px] text-muted font-mono truncate block">
                                            {dep.file_path}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                    <Badge 
                                      variant="secondary" 
                                      className={`text-[9px] uppercase font-mono font-bold py-0 h-4 flex-shrink-0 ${
                                        dep.rel_type === 'CALLS'
                                          ? 'bg-purple-50 text-purple-700 border-purple-200' 
                                          : 'bg-blue-50 text-blue-700 border-blue-200'
                                      }`}
                                    >
                                      {dep.rel_type || 'IMPORTS'}
                                    </Badge>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Col: Change Impact Simulator & Entry Points */}
        <div className="space-y-6">
          {/* Change Impact Simulator Card with Depth Control */}
          <Card className="bg-white border-border shadow-xs border-t-2 border-t-primary">
            <CardHeader className="pb-3">
              <div className="space-y-1">
                <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  <span>Change Impact Simulator</span>
                </CardTitle>
                <p className="text-xs text-muted leading-relaxed">
                  Real-time blast radius and architectural risk calculation.
                </p>
              </div>

              {/* Depth Selector */}
              <div className="flex items-center justify-between pt-2 border-t border-border/60">
                <span className="text-[10px] uppercase font-bold text-muted">Analysis Depth</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3].map(d => (
                    <button
                      key={d}
                      onClick={() => setImpactDepth(d)}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-colors ${
                        impactDepth === d
                          ? 'bg-primary text-primary-foreground shadow-2xs'
                          : 'bg-surface hover:bg-surface/80 text-muted'
                      }`}
                    >
                      Depth {d}
                    </button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              {selectedHotspot ? (
                <div className="space-y-3.5">
                  <div className="p-3 rounded-lg bg-surface border border-border space-y-1">
                    <span className="text-[10px] uppercase font-bold text-muted block">Selected Target</span>
                    <span className="font-bold text-foreground font-mono text-xs block truncate">{selectedHotspot.name}</span>
                    <span className="text-[10px] text-muted font-mono block truncate">{selectedHotspot.file}</span>
                  </div>

                  {impactLoading ? (
                    <div className="p-4 text-center text-muted flex items-center justify-center gap-2">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-primary" />
                      <span>Simulating realtime graph propagation...</span>
                    </div>
                  ) : impactResult ? (
                    <div className="space-y-3">
                      {/* Risk Assessment */}
                      <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-200 text-amber-900 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs flex items-center gap-1.5">
                            <Activity className="w-3.5 h-3.5 text-amber-700" />
                            <span>Risk Score: {impactResult.risk_signals?.score ?? 35}/100</span>
                          </span>
                          <Badge variant="secondary" className="bg-amber-100 text-amber-800 text-[10px]">
                            {impactResult.risk_signals?.score > 60 ? 'High Impact' : 'Moderate Impact'}
                          </Badge>
                        </div>
                        <p className="text-[11px] text-amber-800 leading-relaxed pt-1">
                          Modifications to this entity propagate across{' '}
                          <strong>{selectedHotspot.fan_in} dependent components</strong> up to Depth {impactDepth}.
                        </p>
                      </div>

                      {/* Top Callers / Dependents */}
                      {selectedHotspot.top_callers && selectedHotspot.top_callers.length > 0 && (
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">Direct Callers & Importers</span>
                          <div className="space-y-1 max-h-32 overflow-y-auto">
                            {selectedHotspot.top_callers.map((caller, idx) => (
                              <div key={idx} className="p-1.5 rounded bg-surface/70 border border-border/70 text-[11px] font-mono truncate text-gray-800">
                                {caller}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="p-6 text-center text-muted">
                  Select a hotspot from the list to simulate change impact.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Circular Dependencies Status */}
          <Card className="bg-white border-border shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
                <Repeat className="w-4 h-4 text-purple-600" />
                <span>Circular Dependency Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs">
              {report.cycles.length === 0 ? (
                <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-emerald-800 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <div>
                    <p className="font-bold">No Circular Dependencies</p>
                    <p className="text-[11px] text-emerald-700 mt-0.5">
                      All import and call relationships form a clean directed acyclic hierarchy.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-800">
                    <p className="font-bold text-xs">{report.cycles.length} Circular Loops Detected</p>
                  </div>
                  {report.cycles.map((c, i) => (
                    <div key={i} className="p-2.5 rounded bg-surface border border-border font-mono text-[11px] space-y-1">
                      <span className="text-muted text-[10px] block">Cycle #{i + 1} (Length {c.length})</span>
                      <p className="text-red-700 break-all">{c.summary}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Discovered Entry Points */}
          <Card className="bg-white border-border shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
                  <DoorOpen className="w-4 h-4 text-primary" />
                  <span>Application Entry Points</span>
                </CardTitle>
                <Badge variant="outline" className="text-[10px] font-mono">
                  {filteredEntryPoints.length} Found
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              {filteredEntryPoints.length === 0 ? (
                <p className="text-muted text-xs">No entry points match the current filter.</p>
              ) : (
                filteredEntryPoints.slice(0, 8).map((entry) => (
                  <div key={entry.id} className="p-2.5 rounded-lg border border-border/80 bg-surface/40 flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <FileCode2 className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                        <span className="font-bold font-mono text-foreground truncate">{entry.name}</span>
                      </div>
                      <p className="text-[10px] text-muted mt-0.5 font-mono truncate">{entry.file}</p>
                    </div>
                    <Badge variant="secondary" className="text-[9px] py-0 h-4 flex-shrink-0 bg-purple-50 text-purple-700 border-purple-100 font-semibold">
                      {entry.type}
                    </Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
