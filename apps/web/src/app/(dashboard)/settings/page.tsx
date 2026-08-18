'use client';

import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Key, 
  Database, 
  Bell, 
  Shield, 
  User, 
  Save, 
  CheckCircle2, 
  Github, 
  Cpu, 
  Sliders, 
  Layers
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { useAuth } from '../../../lib/auth/context';

export default function SettingsPage() {
  const { user, organization } = useAuth();
  const [activeTab, setActiveTab] = useState<'general' | 'integrations' | 'analysis' | 'security'>('general');
  const [githubToken, setGithubToken] = useState('');
  const [saved, setSaved] = useState(false);
  const [astDepth, setAstDepth] = useState('3');
  const [enableSemanticSearch, setEnableSemanticSearch] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-border shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2.5">
            <SettingsIcon className="w-5 h-5 text-primary" />
            <span>Workspace Settings</span>
          </h1>
          <p className="text-xs text-muted mt-1">
            Configure repository integrations, graph analysis engines, API keys, and workspace preferences.
          </p>
        </div>
        {saved && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Settings updated successfully</span>
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1 border-b border-border pb-1">
        {[
          { id: 'general', label: 'General & Profile', icon: User },
          { id: 'integrations', label: 'GitHub & Integrations', icon: Github },
          { id: 'analysis', label: 'Graph Engine & AST', icon: Cpu },
          { id: 'security', label: 'API Keys & Security', icon: Key },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
                isActive 
                  ? 'bg-primary text-primary-foreground shadow-2xs' 
                  : 'text-muted hover:text-foreground hover:bg-surface'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: General Settings */}
      {activeTab === 'general' && (
        <div className="space-y-6">
          <Card className="bg-white border-border shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-foreground">Workspace Profile</CardTitle>
              <p className="text-xs text-muted">Manage your organization and team workspace name.</p>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-gray-700">Workspace Name</label>
                  <input 
                    type="text" 
                    defaultValue={organization?.name || 'Personal Workspace'}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-gray-700">Primary Contact Email</label>
                  <input 
                    type="email" 
                    defaultValue={user?.email || 'anupam@codegraph.com'}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <Button size="sm" onClick={handleSave} className="text-xs gap-1.5">
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tab 2: Integrations */}
      {activeTab === 'integrations' && (
        <div className="space-y-6">
          <Card className="bg-white border-border shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-gray-900 text-white flex items-center justify-center">
                    <Github className="w-4 h-4" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-bold text-foreground">GitHub Integration</CardTitle>
                    <p className="text-xs text-muted">Configure GitHub Personal Access Token to avoid rate limits and import private repositories.</p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">Connected</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-gray-700">GitHub Personal Access Token (PAT)</label>
                <input 
                  type="password" 
                  value={githubToken}
                  onChange={(e) => setGithubToken(e.target.value)}
                  placeholder="ghp_************************************"
                  className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-xs font-mono focus:ring-1 focus:ring-primary focus:outline-none"
                />
                <p className="text-[11px] text-muted">
                  Requires <code className="bg-surface px-1 py-0.5 rounded border border-border">repo</code> scope for private repositories or public repo read permissions.
                </p>
              </div>

              <div className="pt-2 flex justify-end">
                <Button size="sm" onClick={handleSave} className="text-xs gap-1.5">
                  <Save className="w-3.5 h-3.5" />
                  <span>Update Token</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tab 3: Analysis Engine */}
      {activeTab === 'analysis' && (
        <div className="space-y-6">
          <Card className="bg-white border-border shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-foreground">Graph Analysis & AST Pipeline</CardTitle>
              <p className="text-xs text-muted">Configure graph resolution depth, symbol indexing, and vector semantic stores.</p>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-gray-700">Graph Database Engine</label>
                  <input 
                    type="text" 
                    disabled 
                    value="Neo4j v5.28 (Graph AST + Cypher)" 
                    className="w-full px-3 py-2 rounded-lg border border-border bg-surface/50 text-xs font-mono text-muted"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-gray-700">Vector Store Backend</label>
                  <input 
                    type="text" 
                    disabled 
                    value="Qdrant Vector DB (Cosine 1536-dim)" 
                    className="w-full px-3 py-2 rounded-lg border border-border bg-surface/50 text-xs font-mono text-muted"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-border/80 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-gray-800 block">Hybrid Semantic Code Retrieval</span>
                  <span className="text-[11px] text-muted">Index code symbols in Qdrant for AI reasoning and contextual search.</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={enableSemanticSearch} 
                  onChange={e => setEnableSemanticSearch(e.target.checked)}
                  className="w-4 h-4 rounded text-primary border-border focus:ring-primary"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <Button size="sm" onClick={handleSave} className="text-xs gap-1.5">
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Engine Settings</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tab 4: Security & API Keys */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <Card className="bg-white border-border shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-foreground">CodeGraph API Keys</CardTitle>
              <p className="text-xs text-muted">Use API keys to trigger graph syncs and query architecture metrics programmatically.</p>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="p-3.5 rounded-lg bg-surface border border-border flex items-center justify-between">
                <div>
                  <span className="font-bold font-mono text-xs block text-gray-900">cg_live_98f12a38b4c09d71e28</span>
                  <span className="text-[10px] text-muted">Created Aug 2026 · Full Read/Write Access</span>
                </div>
                <Badge variant="outline" className="text-[10px] font-mono">Active</Badge>
              </div>

              <div className="pt-2 flex justify-end">
                <Button size="sm" variant="outline" className="text-xs gap-1.5">
                  <Key className="w-3.5 h-3.5" />
                  <span>Generate New Key</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
