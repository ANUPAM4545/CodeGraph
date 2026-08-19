'use client';

import React from 'react';
import { 
  Cuboid, 
  Orbit, 
  Compass, 
  Layers, 
  Box, 
  Maximize2 
} from 'lucide-react';

export default function UniverseShowcase() {
  return (
    <section className="py-20 md:py-28 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-border bg-surface text-[10px] font-mono text-muted">
            <span>3D CODEBASE UNIVERSE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Explore your codebase as a universe.
          </h2>
          <p className="text-base sm:text-lg text-muted">
            Navigate complex software ecosystems in an interactive 3D WebGL viewport. Core architectural subsystems act as planetary bodies with density-based gravitational clustering.
          </p>
        </div>

        {/* 3D Mockup Container */}
        <div className="border border-border rounded-xl bg-surface overflow-hidden shadow-xl font-mono text-xs">
          
          {/* Top Bar */}
          <div className="h-11 bg-background border-b border-border px-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Orbit className="w-4 h-4 text-foreground" />
              <span className="font-bold text-foreground">3D Spatial Universe Explorer</span>
              <span className="text-[10px] text-muted font-normal">· Architecture Mode</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-muted">
              <span>Three.js / React Three Fiber</span>
            </div>
          </div>

          {/* 3D Visual Mockup Canvas */}
          <div className="relative h-[440px] bg-black text-white overflow-hidden flex items-center justify-center">
            
            {/* Background Grid & Stars Effect */}
            <div 
              className="absolute inset-0 opacity-20 pointer-events-none" 
              style={{ 
                backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`, 
                backgroundSize: '32px 32px' 
              }} 
            />

            {/* Simulated Planetary Subsystems */}
            <div className="relative w-full h-full max-w-xl mx-auto flex items-center justify-center">
              
              {/* Center Sun/Core Module: Engine */}
              <div className="w-28 h-28 rounded-full bg-neutral-900 border-2 border-emerald-500/80 shadow-[0_0_50px_rgba(16,185,129,0.3)] flex flex-col items-center justify-center text-center p-2 z-20 animate-pulse">
                <div className="w-3 h-3 rounded-full bg-emerald-400 mb-1" />
                <span className="text-xs font-bold text-white">Engine Core</span>
                <span className="text-[9px] text-emerald-400">14 Files</span>
              </div>

              {/* Orbit Ring 1 */}
              <div className="absolute w-64 h-64 rounded-full border border-neutral-800 pointer-events-none" />

              {/* Satellite 1: Rules Subsystem */}
              <div className="absolute top-12 left-20 p-2.5 rounded-full bg-neutral-950 border border-purple-500/60 shadow-[0_0_30px_rgba(168,85,247,0.2)] flex items-center gap-2 text-xs z-20">
                <div className="w-2 h-2 rounded-full bg-purple-400" />
                <span className="font-bold text-neutral-200">Rules (8)</span>
              </div>

              {/* Orbit Ring 2 */}
              <div className="absolute w-96 h-96 rounded-full border border-neutral-800/60 pointer-events-none" />

              {/* Satellite 2: Database Subsystem */}
              <div className="absolute bottom-16 right-20 p-2.5 rounded-full bg-neutral-950 border border-blue-500/60 shadow-[0_0_30px_rgba(59,130,246,0.2)] flex items-center gap-2 text-xs z-20">
                <div className="w-2 h-2 rounded-full bg-blue-400" />
                <span className="font-bold text-neutral-200">Database (12)</span>
              </div>

              {/* Satellite 3: API Gateway */}
              <div className="absolute top-20 right-28 p-2.5 rounded-full bg-neutral-950 border border-amber-500/60 shadow-[0_0_30px_rgba(245,158,11,0.2)] flex items-center gap-2 text-xs z-20">
                <div className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="font-bold text-neutral-200">API Gateway (6)</span>
              </div>

            </div>

            {/* Viewport Floating Controls */}
            <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-neutral-900/90 border border-neutral-800 px-3 py-1.5 rounded-lg text-[10px] text-neutral-300">
              <span>Mode: <strong className="text-white">Subsystems</strong></span>
              <span className="text-neutral-600">|</span>
              <span>Gravity: <strong className="text-white">Coupling-Weighted</strong></span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
