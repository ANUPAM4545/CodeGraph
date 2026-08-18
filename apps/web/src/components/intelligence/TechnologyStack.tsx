'use client';

import React, { useState, useMemo } from 'react';
import { 
  Cpu, 
  Layers, 
  Database, 
  Server, 
  Cloud, 
  Wrench, 
  Code2 
} from 'lucide-react';
import { TechStackItem } from '../../lib/api/intelligence';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface TechnologyStackProps {
  items: TechStackItem[];
}

export default function TechnologyStack({ items }: TechnologyStackProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = useMemo(() => {
    const cats = new Set<string>();
    items.forEach(item => cats.add(item.category));
    return ['ALL', ...Array.from(cats)];
  }, [items]);

  const filteredItems = useMemo(() => {
    if (selectedCategory === 'ALL') return items;
    return items.filter(i => i.category === selectedCategory);
  }, [items, selectedCategory]);

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Frontend': return <Code2 className="w-3.5 h-3.5 text-blue-600" />;
      case 'Backend': return <Server className="w-3.5 h-3.5 text-purple-600" />;
      case 'Database': return <Database className="w-3.5 h-3.5 text-emerald-600" />;
      case 'Infrastructure': return <Cloud className="w-3.5 h-3.5 text-sky-600" />;
      default: return <Wrench className="w-3.5 h-3.5 text-amber-600" />;
    }
  };

  return (
    <Card className="bg-white border-border shadow-xs">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
              <Cpu className="w-4 h-4 text-primary" />
              <span>Technology Stack & Dependencies</span>
            </CardTitle>
            <p className="text-xs text-muted mt-0.5">
              Verified frameworks, libraries, and runtime engines extracted from codebase manifests and AST imports.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  selectedCategory === cat
                    ? 'bg-primary text-primary-foreground shadow-2xs'
                    : 'bg-surface hover:bg-surface/80 text-muted hover:text-foreground'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredItems.length === 0 ? (
          <div className="p-8 text-center text-muted text-xs">
            No technologies detected in this category.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {filteredItems.map((tech, idx) => (
              <div 
                key={idx}
                className="p-3 rounded-xl bg-surface/50 border border-border/80 hover:bg-surface hover:border-border transition-all flex flex-col justify-between space-y-2 shadow-2xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="p-1.5 rounded-lg bg-white border border-border/70 shadow-2xs flex-shrink-0">
                      {getCategoryIcon(tech.category)}
                    </div>
                    <span className="font-bold text-foreground text-xs truncate block">{tech.name}</span>
                  </div>
                  <Badge variant="outline" className="text-[9px] py-0 h-4 uppercase flex-shrink-0">
                    {tech.category}
                  </Badge>
                </div>
                
                <div className="pt-1 flex items-center justify-between text-[10px] text-muted font-mono border-t border-border/60">
                  <span className="truncate">Source: {tech.source_file}</span>
                  {tech.version && <span className="font-bold text-gray-800">v{tech.version}</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
