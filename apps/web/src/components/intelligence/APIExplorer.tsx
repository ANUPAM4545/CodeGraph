'use client';

import React, { useState, useMemo } from 'react';
import { 
  Network, 
  Search, 
  FileCode2, 
  ExternalLink, 
  Tag 
} from 'lucide-react';
import { ApiEndpoint } from '../../lib/api/intelligence';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface APIExplorerProps {
  endpoints: ApiEndpoint[];
}

export default function APIExplorer({ endpoints }: APIExplorerProps) {
  const [search, setSearch] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<string>('ALL');

  const filteredEndpoints = useMemo(() => {
    return endpoints.filter((ep) => {
      const matchesMethod = selectedMethod === 'ALL' || ep.method.includes(selectedMethod);
      const matchesSearch = !search || 
        ep.path.toLowerCase().includes(search.toLowerCase()) || 
        ep.handler.toLowerCase().includes(search.toLowerCase()) ||
        ep.source_file.toLowerCase().includes(search.toLowerCase());
      return matchesMethod && matchesSearch;
    });
  }, [endpoints, search, selectedMethod]);

  const getMethodBadge = (method: string) => {
    switch (method.toUpperCase()) {
      case 'GET':
        return <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200 font-bold font-mono text-[10px] py-0 h-4">GET</Badge>;
      case 'POST':
        return <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200 font-bold font-mono text-[10px] py-0 h-4">POST</Badge>;
      case 'PUT':
      case 'PATCH':
        return <Badge variant="secondary" className="bg-amber-50 text-amber-700 border-amber-200 font-bold font-mono text-[10px] py-0 h-4">{method}</Badge>;
      case 'DELETE':
        return <Badge variant="secondary" className="bg-red-50 text-red-700 border-red-200 font-bold font-mono text-[10px] py-0 h-4">DELETE</Badge>;
      default:
        return <Badge variant="outline" className="font-mono text-[10px] py-0 h-4">{method}</Badge>;
    }
  };

  if (!endpoints || endpoints.length === 0) {
    return (
      <Card className="bg-white border-border shadow-xs">
        <CardContent className="p-8 text-center text-muted text-xs">
          No explicit REST / HTTP API endpoints detected in this repository version.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white border-border shadow-xs">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
              <Network className="w-4 h-4 text-blue-600" />
              <span>Discovered API Endpoints & Routes</span>
            </CardTitle>
            <p className="text-xs text-muted mt-0.5">
              REST endpoints, serverless handlers, and controllers indexed directly from the AST.
            </p>
          </div>

          {/* Search & Method Filters */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {['ALL', 'GET', 'POST', 'PUT', 'DELETE'].map((m) => (
                <button
                  key={m}
                  onClick={() => setSelectedMethod(m)}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-colors ${
                    selectedMethod === m
                      ? 'bg-primary text-primary-foreground shadow-2xs'
                      : 'bg-surface hover:bg-surface/80 text-muted'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>

            <div className="relative w-44">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search endpoints..."
                className="w-full pl-8 pr-3 py-1 rounded-lg border border-border bg-surface text-xs focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredEndpoints.length === 0 ? (
          <div className="p-6 text-center text-muted text-xs">
            No endpoints match your filter query.
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {filteredEndpoints.map((ep, idx) => (
              <div 
                key={idx}
                className="p-3 rounded-xl bg-surface/30 border border-border/80 hover:bg-surface hover:border-border transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {getMethodBadge(ep.method)}
                  <span className="font-bold font-mono text-foreground text-xs truncate">
                    {ep.path}
                  </span>
                  {ep.summary && (
                    <span className="text-muted text-[11px] truncate hidden md:inline">
                      — {ep.summary}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-[10px] text-muted font-mono flex-shrink-0">
                  <span className="font-bold text-gray-800">{ep.handler}()</span>
                  <span>in</span>
                  <div className="flex items-center gap-1 text-primary">
                    <FileCode2 className="w-3 h-3" />
                    <span className="truncate max-w-[200px]">{ep.source_file}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
