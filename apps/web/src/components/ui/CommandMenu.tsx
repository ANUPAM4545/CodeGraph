'use client';

import React, { useEffect, useState } from 'react';
import { Search, Folder, Share2, Box, Brain, CornerDownLeft } from 'lucide-react';
// @ts-ignore
import { motion, AnimatePresence } from 'framer-motion';

export function CommandMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  if (!isOpen) return null;

  const commands = [
    { icon: Folder, title: 'Open Repository', desc: 'Navigate to a codebase' },
    { icon: Search, title: 'Find Symbol', desc: 'Search for a function or class globally' },
    { icon: Share2, title: 'Open Graph Explorer', desc: 'View 2D architecture graph' },
    { icon: Box, title: 'Open 3D Universe', desc: 'Explore codebase in 3D' },
    { icon: Brain, title: 'Ask AI', desc: 'Query CodeGraph AI Assistant' },
  ];

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-start justify-center pt-[15vh]"
        onClick={() => setIsOpen(false)}
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-xl bg-background border border-border rounded-xl shadow-2xl overflow-hidden"
        >
          <div className="flex items-center px-4 py-3 border-b border-border">
            <Search className="w-5 h-5 text-muted mr-3" />
            <input 
              autoFocus
              className="flex-1 bg-transparent text-foreground placeholder:text-muted focus:outline-none"
              placeholder="Search CodeGraph or type a command..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <kbd className="hidden sm:inline-flex px-1.5 py-0.5 text-xs font-medium bg-surface border border-border rounded text-muted">
              ESC
            </kbd>
          </div>
          
          <div className="p-2 max-h-96 overflow-y-auto">
            <div className="px-2 py-1.5 text-xs font-medium text-muted">Suggestions</div>
            {commands.map((cmd, i) => (
              <button 
                key={i}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-md hover:bg-surface text-left transition-colors group"
                onClick={() => setIsOpen(false)}
              >
                <div className="flex items-center gap-3">
                  <div className="bg-background border border-border p-1.5 rounded-md group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors">
                    <cmd.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">{cmd.title}</div>
                    <div className="text-xs text-muted mt-0.5">{cmd.desc}</div>
                  </div>
                </div>
                <CornerDownLeft className="w-4 h-4 text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
