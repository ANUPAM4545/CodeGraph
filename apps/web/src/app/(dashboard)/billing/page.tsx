'use client';

import React from 'react';
import { 
  CreditCard, 
  Check, 
  Zap, 
  ShieldCheck, 
  Sparkles, 
  ArrowUpRight, 
  Layers, 
  Database, 
  Activity 
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { useAuth } from '../../../lib/auth/context';

export default function BillingPage() {
  const { organization } = useAuth();

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-border shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold text-foreground flex items-center gap-2.5">
              <CreditCard className="w-5 h-5 text-primary" />
              <span>Subscription & Billing</span>
            </h1>
            <Badge variant="secondary" className="bg-blue-50 text-blue-700 font-semibold text-xs">
              Developer Plan
            </Badge>
          </div>
          <p className="text-xs text-muted mt-1">
            Manage your workspace subscription tier, monthly graph indexing quotas, and invoices.
          </p>
        </div>
        <Button size="sm" className="text-xs gap-1.5 font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Upgrade to Enterprise</span>
        </Button>
      </div>

      {/* Current Quotas / Usage Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white border-border shadow-2xs">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-muted flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-primary" />
                <span>Analyzed AST Nodes</span>
              </span>
              <span className="font-mono font-bold text-gray-800">2,840 / 50,000</span>
            </div>
            <div className="w-full bg-surface rounded-full h-2 overflow-hidden border border-border">
              <div className="bg-primary h-full rounded-full" style={{ width: '5.6%' }} />
            </div>
            <span className="text-[10px] text-muted block">94.4% quota remaining this billing cycle</span>
          </CardContent>
        </Card>

        <Card className="bg-white border-border shadow-2xs">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-muted flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-blue-600" />
                <span>Connected Repositories</span>
              </span>
              <span className="font-mono font-bold text-gray-800">1 / 10 Repos</span>
            </div>
            <div className="w-full bg-surface rounded-full h-2 overflow-hidden border border-border">
              <div className="bg-blue-600 h-full rounded-full" style={{ width: '10%' }} />
            </div>
            <span className="text-[10px] text-muted block">9 repository slots available</span>
          </CardContent>
        </Card>

        <Card className="bg-white border-border shadow-2xs">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-muted flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-purple-600" />
                <span>AI Graph Reasoning Queries</span>
              </span>
              <span className="font-mono font-bold text-gray-800">142 / 1,000</span>
            </div>
            <div className="w-full bg-surface rounded-full h-2 overflow-hidden border border-border">
              <div className="bg-purple-600 h-full rounded-full" style={{ width: '14.2%' }} />
            </div>
            <span className="text-[10px] text-muted block">Resets on Sept 1, 2026</span>
          </CardContent>
        </Card>
      </div>

      {/* Subscription Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        {/* Free Plan */}
        <Card className="bg-white border-border shadow-xs flex flex-col justify-between">
          <CardHeader className="pb-3">
            <span className="text-xs font-bold uppercase text-muted tracking-wider">Free Starter</span>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl font-black text-foreground">$0</span>
              <span className="text-xs text-muted">/ forever</span>
            </div>
            <p className="text-xs text-muted mt-1">For exploring small open-source repositories.</p>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>1 Public Repository</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>Up to 5,000 Graph Nodes</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>Basic Graph Visualizer</span>
              </li>
            </ul>
            <Button variant="outline" size="sm" disabled className="w-full text-xs">
              Current Tier
            </Button>
          </CardContent>
        </Card>

        {/* Developer Pro Plan */}
        <Card className="bg-white border-primary shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-bold px-3 py-0.5 rounded-bl-lg">
            CURRENT PLAN
          </div>
          <CardHeader className="pb-3">
            <span className="text-xs font-bold uppercase text-primary tracking-wider">Developer Pro</span>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl font-black text-foreground">$29</span>
              <span className="text-xs text-muted">/ month</span>
            </div>
            <p className="text-xs text-muted mt-1">For developers analyzing full-stack codebases.</p>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>10 Private & Public Repositories</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>50,000 AST Nodes per repo</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>Architecture Health & PDF Reports</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>Hybrid Graph-RAG AI Assistant</span>
              </li>
            </ul>
            <Button variant="outline" size="sm" className="w-full text-xs font-bold text-primary border-primary/50">
              Manage Subscription
            </Button>
          </CardContent>
        </Card>

        {/* Enterprise Plan */}
        <Card className="bg-white border-border shadow-xs flex flex-col justify-between">
          <CardHeader className="pb-3">
            <span className="text-xs font-bold uppercase text-muted tracking-wider">Enterprise</span>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl font-black text-foreground">Custom</span>
            </div>
            <p className="text-xs text-muted mt-1">For engineering teams and monorepos.</p>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>Unlimited Repositories & Monorepos</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>Millions of Graph Nodes</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>Dedicated Neo4j & Qdrant Clusters</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>SAML SSO & Audit Logs</span>
              </li>
            </ul>
            <Button size="sm" className="w-full text-xs font-semibold">
              Contact Sales
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
