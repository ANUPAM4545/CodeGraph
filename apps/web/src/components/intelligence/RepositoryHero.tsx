'use client';

import React from 'react';
import { 
  Sparkles, 
  Github, 
  GitBranch, 
  GitCommit, 
  Star, 
  GitFork, 
  Scale, 
  Lock, 
  Globe, 
  CheckCircle2 
} from 'lucide-react';
import { RepoIntelligence } from '../../lib/api/intelligence';
import { Badge } from '../ui/Badge';

interface RepositoryHeroProps {
  data: RepoIntelligence;
}

export default function RepositoryHero({ data }: RepositoryHeroProps) {
  const meta = data.github_metadata;
  const isPrivate = meta?.visibility === 'private';

  return (
    <div className="bg-white border border-border p-6 rounded-2xl shadow-xs space-y-4">
      {/* Top Tag & Version Pill */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Repository Intelligence</span>
          </div>
          <Badge variant="outline" className="text-xs font-mono">
            {data.primary_language}
          </Badge>
          {isPrivate ? (
            <Badge variant="secondary" className="bg-amber-50 text-amber-800 border-amber-200 text-xs gap-1">
              <Lock className="w-3 h-3" /> Private
            </Badge>
          ) : (
            <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200 text-xs gap-1">
              <Globe className="w-3 h-3" /> Public
            </Badge>
          )}
        </div>

        {/* Version & Sync Stamp */}
        <div className="flex items-center gap-2 text-xs text-muted font-mono bg-surface px-3 py-1.5 rounded-lg border border-border">
          <div className="flex items-center gap-1">
            <GitBranch className="w-3.5 h-3.5 text-gray-500" />
            <span className="font-semibold text-gray-800">{data.branch}</span>
          </div>
          <span>·</span>
          <div className="flex items-center gap-1">
            <GitCommit className="w-3.5 h-3.5 text-gray-500" />
            <span className="font-bold text-primary">{data.commit_sha.substring(0, 7)}</span>
          </div>
          <span>·</span>
          <span className="text-[11px]">Analyzed {new Date(data.generated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>

      {/* Main Title & Description */}
      <div className="space-y-1.5">
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
          {data.name}
        </h1>
        <p className="text-sm sm:text-base text-muted max-w-4xl leading-relaxed">
          {data.tagline}
        </p>
      </div>

      {/* GitHub Telemetry Bar */}
      {meta && (
        <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-muted border-t border-border/70">
          <a 
            href={meta.html_url || '#'} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-1.5 text-gray-900 font-semibold hover:text-primary transition-colors"
          >
            <Github className="w-4 h-4" />
            <span>{meta.full_name}</span>
          </a>
          
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span className="font-bold text-gray-800">{meta.stars.toLocaleString()}</span>
            <span>stars</span>
          </div>

          <div className="flex items-center gap-1">
            <GitFork className="w-3.5 h-3.5 text-gray-500" />
            <span className="font-bold text-gray-800">{meta.forks.toLocaleString()}</span>
            <span>forks</span>
          </div>

          {meta.license && (
            <div className="flex items-center gap-1">
              <Scale className="w-3.5 h-3.5 text-gray-500" />
              <span>{meta.license}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
