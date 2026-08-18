import React from 'react';
import Link from 'next/link';
import { Navbar } from '../components/public/Navbar';
import { Footer } from '../components/public/Footer';
import { Button } from '../components/ui/Button';
import { Network, BrainCircuit, ActivitySquare, Cuboid, RefreshCw, ShieldCheck } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import the Heavy React Flow canvas so it doesn't block first render
const GraphCanvas = dynamic(() => import('../components/explorer/GraphCanvas'), {
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center bg-surface"><div className="animate-pulse w-8 h-8 rounded-full bg-border" /></div>
});

const FEATURES = [
  {
    icon: Network,
    title: 'Knowledge Graph Intelligence',
    description: 'We parse your AST and construct a Canonical Code Graph in Neo4j, exposing every hidden architectural dependency.',
  },
  {
    icon: BrainCircuit,
    title: 'AI Code Intelligence',
    description: 'Grounded AI answers with exact source citations. Ask complex architectural questions and get context-aware reasoning.',
  },
  {
    icon: ActivitySquare,
    title: 'Impact Analysis',
    description: 'Understand the exact risk before changing code. CodeGraph highlights downstream consumers and upstream dependencies instantly.',
  },
  {
    icon: Cuboid,
    title: '3D Code Universe',
    description: 'Navigate large systems visually. Zoom out to see the galaxy of microservices, or zoom in to inspect a single class.',
  },
  {
    icon: RefreshCw,
    title: 'Continuous Intelligence',
    description: 'Repository updates automatically synchronize via GitHub webhooks. Your architecture maps are never out of date.',
  }
];

import { redirect } from 'next/navigation';

export default function LandingPage() {
  redirect('/dashboard');
}
