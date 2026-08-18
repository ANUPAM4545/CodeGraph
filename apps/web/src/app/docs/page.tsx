import React from 'react';
import { Navbar } from '../../components/public/Navbar';
import { Footer } from '../../components/public/Footer';

export default function DocsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto max-w-7xl px-4 sm:px-6 py-12 flex">
        <aside className="w-64 pr-8 hidden md:block">
          <h3 className="font-semibold mb-4">Getting Started</h3>
          <ul className="space-y-2 text-sm text-muted">
            <li><a href="#" className="text-foreground font-medium">Introduction</a></li>
            <li><a href="#" className="hover:text-foreground">Quickstart</a></li>
            <li><a href="#" className="hover:text-foreground">Supported Languages</a></li>
          </ul>
        </aside>
        
        <div className="flex-1 max-w-3xl prose prose-slate">
          <h1 className="text-4xl font-bold tracking-tight mb-6">Documentation</h1>
          <p className="text-lg text-muted mb-8">
            CodeGraph is a Continuous Code Intelligence platform. It parses your repositories, builds a Canonical Knowledge Graph, and surfaces architectural insights.
          </p>
          <div className="bg-surface border border-border rounded-lg p-6">
            <h3 className="font-semibold mb-2">Content Placeholder</h3>
            <p className="text-sm text-muted">Detailed documentation structure will be expanded in future iterations.</p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
