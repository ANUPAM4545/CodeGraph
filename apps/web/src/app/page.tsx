import React from 'react';
import type { Metadata } from 'next';
import LandingNavbar from '../components/landing/LandingNavbar';
import Hero from '../components/landing/Hero';
import ProductPreview from '../components/landing/ProductPreview';
import TrustStrip from '../components/landing/TrustStrip';
import ProblemSection from '../components/landing/ProblemSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import GraphExplorerShowcase from '../components/landing/GraphExplorerShowcase';
import AIShowcase from '../components/landing/AIShowcase';
import ImpactShowcase from '../components/landing/ImpactShowcase';
import RepositoryIntelligenceShowcase from '../components/landing/RepositoryIntelligenceShowcase';
import UniverseShowcase from '../components/landing/UniverseShowcase';
import ContinuousIntelligence from '../components/landing/ContinuousIntelligence';
import IDEShowcase from '../components/landing/IDEShowcase';
import EnterpriseArchitecture from '../components/landing/EnterpriseArchitecture';
import SecuritySection from '../components/landing/SecuritySection';
import DeveloperWorkflow from '../components/landing/DeveloperWorkflow';
import AudienceSection from '../components/landing/AudienceSection';
import FinalCTA from '../components/landing/FinalCTA';
import LandingFooter from '../components/landing/LandingFooter';

export const metadata: Metadata = {
  title: 'CodeGraph — Understand Any Codebase Instantly',
  description: 'CodeGraph turns repositories into living architectural intelligence — mapping code, dependencies, impact, history, and AI-powered insights.',
  openGraph: {
    title: 'CodeGraph — Understand Any Codebase Instantly',
    description: 'Transform your repository into a living architectural knowledge graph with grounded AI and blast-radius simulation.',
    url: 'https://codegraph.dev',
    siteName: 'CodeGraph',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CodeGraph — Understand Any Codebase Instantly',
    description: 'Living architectural code intelligence for developers, architects, and engineering teams.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-black selection:text-white">
      {/* Global Sticky Navigation */}
      <LandingNavbar />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* 1. Hero Section */}
        <Hero />

        {/* 2. Live Interactive Product Window */}
        <ProductPreview />

        {/* 3. Tech Foundations Trust Strip */}
        <TrustStrip />

        {/* 4. Problem & Structural Pipeline Flow */}
        <ProblemSection />

        {/* 5. 6 Core Intelligence Pillars */}
        <FeaturesSection />

        {/* 6. Full Graph Explorer Showcase */}
        <GraphExplorerShowcase />

        {/* 7. Grounded AI Intelligence & Citations */}
        <AIShowcase />

        {/* 8. Change Impact & Blast Radius Simulation */}
        <ImpactShowcase />

        {/* 9. Repository Intelligence Metadata Layer */}
        <RepositoryIntelligenceShowcase />

        {/* 10. 3D Codebase Universe View */}
        <UniverseShowcase />

        {/* 11. Continuous Webhook Intelligence Pipeline */}
        <ContinuousIntelligence />

        {/* 12. VS Code Extension & IDE Copilot */}
        <IDEShowcase />

        {/* 13. Enterprise Platform & Data Isolation */}
        <EnterpriseArchitecture />

        {/* 14. Defensive Security Architecture */}
        <SecuritySection />

        {/* 15. 8-Step Developer Workflow */}
        <DeveloperWorkflow />

        {/* 16. Targeted Audience Breakdown */}
        <AudienceSection />

        {/* 17. High-Conversion Final CTA */}
        <FinalCTA />
      </main>

      {/* Structured Footer */}
      <LandingFooter />
    </div>
  );
}
