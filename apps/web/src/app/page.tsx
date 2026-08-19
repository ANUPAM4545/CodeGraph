import React from 'react';
import type { Metadata } from 'next';
import LandingNavbar from '../components/landing/LandingNavbar';
import Hero from '../components/landing/Hero';
import ProductPreview from '../components/landing/ProductPreview';
import CoreCapabilities from '../components/landing/CoreCapabilities';
import ArchitectureSection from '../components/landing/ArchitectureSection';
import RepositoryIntelligenceSection from '../components/landing/RepositoryIntelligenceSection';
import AIShowcase from '../components/landing/AIShowcase';
import DeveloperWorkflow from '../components/landing/DeveloperWorkflow';
import TrustCTASection from '../components/landing/TrustCTASection';
import LandingFooter from '../components/landing/LandingFooter';

export const metadata: Metadata = {
  title: 'CodeGraph — AI-Powered Code Intelligence',
  description: 'Understand complex codebases with knowledge graphs, repository intelligence, AI-powered code analysis, impact analysis, and interactive architecture visualization.',
  openGraph: {
    title: 'CodeGraph — AI-Powered Code Intelligence',
    description: 'Transform your repository into a living architectural knowledge graph with grounded AI and blast-radius simulation.',
    url: 'https://codegraph.dev',
    siteName: 'CodeGraph',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CodeGraph — AI-Powered Code Intelligence',
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
      {/* 1. Navigation */}
      <LandingNavbar />

      {/* Main Content Area: Exactly 8 sections between Navigation and Footer */}
      <main className="flex-1">
        {/* 2. Hero Section */}
        <Hero />

        {/* 3. Product / Platform Preview */}
        <ProductPreview />

        {/* 4. Core Capabilities */}
        <CoreCapabilities />

        {/* 5. Architecture / Knowledge Graph */}
        <ArchitectureSection />

        {/* 6. Repository Intelligence */}
        <RepositoryIntelligenceSection />

        {/* 7. AI Codebase Assistant */}
        <AIShowcase />

        {/* 8. Developer Workflow / How CodeGraph Works */}
        <DeveloperWorkflow />

        {/* 9. Trust + Final CTA */}
        <TrustCTASection />
      </main>

      {/* 10. Footer */}
      <LandingFooter />
    </div>
  );
}
