'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Cuboid, 
  Orbit, 
  Compass, 
  Layers, 
  Box, 
  Maximize2,
  Sparkles,
  Zap
} from 'lucide-react';

const PLANETS = [
  { name: 'Engine Core', symbols: 48, radius: 130, angle: 0, speed: 20, color: 'bg-emerald-500' },
  { name: 'Rules Pipeline', symbols: 24, radius: 95, angle: 120, speed: 25, color: 'bg-purple-500' },
  { name: 'Database Client', symbols: 36, radius: 160, angle: 240, speed: 30, color: 'bg-blue-500' },
];

export default function UniverseShowcase() {
  const [selectedBody, setSelectedBody] = useState('Engine Core');

  return (
    <section id="universe" className="py-24 md:py-32 bg-background border-b border-border relative overflow-hidden">
      
      {/* Background Architectural Grid */}
      <div 
        className="absolute inset-0 opacity-[0.035] pointer-events-none" 
        style={{ 
          backgroundImage: `radial-gradient(#000000 1px, transparent 1px)`, 
          backgroundSize: '24px 24px' 
        }} 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border bg-surface text-[11px] font-mono text-muted">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span>3D CODEBASE UNIVERSE</span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-foreground">
            Explore code as a universe.
          </h2>
          <p className="text-base sm:text-lg text-muted max-w-2xl mx-auto leading-relaxed">
            Navigate complex software ecosystems in an interactive 3D WebGL viewport. Core architectural subsystems act as planetary bodies with density-based gravitational clustering.
          </p>
        </div>

        {/* macOS Style 3D Viewport Window */}
        <div className="rounded-3xl border border-border bg-black text-white shadow-2xl overflow-hidden max-w-5xl mx-auto font-mono text-xs">
          
          {/* Top Window Bar */}
          <div className="h-12 bg-neutral-900 border-b border-neutral-800 px-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-neutral-700" />
              <div className="w-3 h-3 rounded-full bg-neutral-700" />
              <div className="w-3 h-3 rounded-full bg-neutral-700" />
            </div>

            {/* Address Pill */}
            <div className="px-4 py-1 rounded-full bg-neutral-800 border border-neutral-700 font-mono text-[11px] text-neutral-300 flex items-center gap-1.5 shadow-2xs">
              <Orbit className="w-3.5 h-3.5 text-blue-400" />
              <span>codegraph.dev/app/3d-universe-viewport</span>
            </div>

            <span className="text-neutral-400 text-[10px]">WebGL / R3F Engine</span>
          </div>

          {/* 3D Visual Viewport */}
          <div className="relative h-[460px] bg-neutral-950 overflow-hidden flex items-center justify-center p-6 select-none">
            
            {/* Ambient Cosmic Grid */}
            <div 
              className="absolute inset-0 opacity-15 pointer-events-none" 
              style={{ 
                backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`, 
                backgroundSize: '32px 32px' 
              }} 
            />

            {/* Orbiting Concentric Circles */}
            <div className="relative w-80 h-80 rounded-full border border-neutral-800 flex items-center justify-center">
              <div className="absolute inset-8 rounded-full border border-neutral-800/60" />
              <div className="absolute inset-16 rounded-full border border-neutral-800/40" />

              {/* Central Core Sun Node */}
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-neutral-800 to-neutral-700 border border-neutral-600 flex flex-col items-center justify-center text-center p-2 shadow-2xl z-10">
                <Cuboid className="w-6 h-6 text-white" />
                <span className="text-[9px] font-bold mt-0.5">REPO ROOT</span>
              </div>

              {/* Orbiting Planetary Subsystems */}
              {PLANETS.map((planet) => (
                <motion.div
                  key={planet.name}
                  animate={{ rotate: 360 }}
                  transition={{ duration: planet.speed, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                >
                  <div
                    style={{ transform: `translate(${planet.radius}px, 0)` }}
                    onClick={() => setSelectedBody(planet.name)}
                    className="pointer-events-auto cursor-pointer p-2.5 rounded-2xl bg-neutral-900 border border-neutral-700 shadow-xl flex items-center gap-2 hover:scale-110 transition-transform"
                  >
                    <span className={`w-2.5 h-2.5 rounded-full ${planet.color}`} />
                    <span className="font-bold text-[11px] text-white whitespace-nowrap">{planet.name}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Viewport Floating HUD Controls */}
            <div className="absolute bottom-5 left-6 right-6 p-3 rounded-2xl bg-neutral-900/90 backdrop-blur-sm border border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-neutral-400">Selected Body:</span>
                <span className="font-bold text-white bg-neutral-800 px-2.5 py-0.5 rounded border border-neutral-700">{selectedBody}</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-neutral-400">
                <span>Density-based gravity active</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
