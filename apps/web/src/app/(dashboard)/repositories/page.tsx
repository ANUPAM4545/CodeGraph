'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Card, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Search, Github, Plus, Clock, LayoutGrid, X, Box, Network, ArrowUpDown, Filter, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { repositoriesService, Repository } from '../../../lib/api/repositories';
import { formatRelativeTime } from '../../../lib/utils/formatDate';

type SortOption = 'updated' | 'name' | 'created';
type VisibilityFilter = 'all' | 'public' | 'private';

export default function RepositoriesPage() {
  const router = useRouter();
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [repoInput, setRepoInput] = useState('');
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('updated');
  const [visibilityFilter, setVisibilityFilter] = useState<VisibilityFilter>('all');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);

  useEffect(() => {
    repositoriesService.list()
      .then(setRepositories)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    let repoName = repoInput.trim();
    
    if (repoName.includes('github.com/')) {
      try {
        const urlObj = new URL(repoName.startsWith('http') ? repoName : `https://${repoName}`);
        repoName = urlObj.pathname.replace(/^\//, '').replace(/\/$/, '');
      } catch (err) {
        const parts = repoName.split('github.com/');
        if (parts.length > 1) {
          repoName = parts[1].replace(/\/$/, '');
        }
      }
    }
    
    if (repoName.endsWith('.git')) {
      repoName = repoName.slice(0, -4);
    }

    if (repoName) {
      router.push(`/repositories/import?repo=${encodeURIComponent(repoName)}`);
    }
  };

  // Filtered and Sorted Repositories
  const filteredRepositories = useMemo(() => {
    return repositories
      .filter(repo => {
        // Search query filter
        const query = searchQuery.toLowerCase().trim();
        const matchesQuery = !query || 
          repo.name.toLowerCase().includes(query) ||
          (repo as any).full_name?.toLowerCase().includes(query) ||
          (repo as any).description?.toLowerCase().includes(query);

        // Visibility filter
        const matchesVisibility = 
          visibilityFilter === 'all' || 
          (visibilityFilter === 'private' ? repo.is_private : !repo.is_private);

        return matchesQuery && matchesVisibility;
      })
      .sort((a, b) => {
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        }
        if (sortBy === 'created') {
          const dateA = new Date(a.created_at || 0).getTime();
          const dateB = new Date(b.created_at || 0).getTime();
          return dateB - dateA;
        }
        // default: updated
        const dateA = new Date(a.updated_at || a.created_at || 0).getTime();
        const dateB = new Date(b.updated_at || b.created_at || 0).getTime();
        return dateB - dateA;
      });
  }, [repositories, searchQuery, sortBy, visibilityFilter]);

  return (
    <div className="max-w-7xl mx-auto space-y-6 relative select-none pb-12">
      {/* Connect Repo Modal Overlay */}
      {isConnectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-background rounded-2xl border border-border shadow-2xl p-6 w-full max-w-md relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setIsConnectModalOpen(false)}
              className="absolute top-4 right-4 text-muted hover:text-foreground transition-colors p-1 rounded-md"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold mb-2">Connect Repository</h2>
            <p className="text-sm text-muted mb-6">Enter the full GitHub repository name or URL (e.g., owner/repo).</p>
            <form onSubmit={handleConnect} className="space-y-4">
              <div>
                <input 
                  autoFocus
                  type="text" 
                  value={repoInput}
                  onChange={e => setRepoInput(e.target.value)}
                  placeholder="e.g. facebook/react or https://github.com/..." 
                  className="w-full px-3.5 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-surface text-sm font-medium"
                />
              </div>
              <div className="flex justify-end gap-2.5 pt-2">
                <Button type="button" variant="ghost" onClick={() => setIsConnectModalOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={!repoInput.trim()}>Import & Analyze</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/40">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Repositories</h1>
          <p className="text-muted text-xs sm:text-sm mt-1">Manage and explore connected codebases.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Link href="/repositories/import">
            <Button size="md" className="gap-1.5 text-xs sm:text-sm font-semibold shadow-xs">
              <Plus className="w-4 h-4" />
              <span>Connect Repository</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search repositories by name, owner, or description..." 
            className="pl-10 pr-9 py-2 w-full text-xs sm:text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-surface placeholder:text-muted transition-all shadow-2xs"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Dropdown */}
        <div className="relative">
          <Button 
            variant="outline" 
            size="sm" 
            className={`text-xs gap-1.5 h-9 shadow-2xs ${visibilityFilter !== 'all' ? 'border-primary text-foreground font-semibold' : ''}`}
            onClick={() => {
              setShowFilterMenu(!showFilterMenu);
              setShowSortMenu(false);
            }}
          >
            <Filter className="w-3.5 h-3.5 text-muted" />
            <span>Filter{visibilityFilter !== 'all' ? `: ${visibilityFilter}` : ''}</span>
          </Button>

          {showFilterMenu && (
            <div className="absolute right-0 mt-1.5 w-40 bg-background border border-border rounded-xl shadow-lg p-1.5 z-20 space-y-1 text-xs">
              <button
                onClick={() => { setVisibilityFilter('all'); setShowFilterMenu(false); }}
                className={`w-full text-left px-2.5 py-1.5 rounded-md flex items-center justify-between ${visibilityFilter === 'all' ? 'bg-surface font-semibold text-foreground' : 'text-muted hover:text-foreground hover:bg-surface/50'}`}
              >
                <span>All Visibility</span>
                {visibilityFilter === 'all' && <CheckCircle2 className="w-3.5 h-3.5 text-primary" />}
              </button>
              <button
                onClick={() => { setVisibilityFilter('public'); setShowFilterMenu(false); }}
                className={`w-full text-left px-2.5 py-1.5 rounded-md flex items-center justify-between ${visibilityFilter === 'public' ? 'bg-surface font-semibold text-foreground' : 'text-muted hover:text-foreground hover:bg-surface/50'}`}
              >
                <span>Public only</span>
                {visibilityFilter === 'public' && <CheckCircle2 className="w-3.5 h-3.5 text-primary" />}
              </button>
              <button
                onClick={() => { setVisibilityFilter('private'); setShowFilterMenu(false); }}
                className={`w-full text-left px-2.5 py-1.5 rounded-md flex items-center justify-between ${visibilityFilter === 'private' ? 'bg-surface font-semibold text-foreground' : 'text-muted hover:text-foreground hover:bg-surface/50'}`}
              >
                <span>Private only</span>
                {visibilityFilter === 'private' && <CheckCircle2 className="w-3.5 h-3.5 text-primary" />}
              </button>
            </div>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="relative">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs gap-1.5 h-9 shadow-2xs"
            onClick={() => {
              setShowSortMenu(!showSortMenu);
              setShowFilterMenu(false);
            }}
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-muted" />
            <span>
              Sort: {sortBy === 'updated' ? 'Recent' : sortBy === 'name' ? 'Name' : 'Created'}
            </span>
          </Button>

          {showSortMenu && (
            <div className="absolute right-0 mt-1.5 w-44 bg-background border border-border rounded-xl shadow-lg p-1.5 z-20 space-y-1 text-xs">
              <button
                onClick={() => { setSortBy('updated'); setShowSortMenu(false); }}
                className={`w-full text-left px-2.5 py-1.5 rounded-md flex items-center justify-between ${sortBy === 'updated' ? 'bg-surface font-semibold text-foreground' : 'text-muted hover:text-foreground hover:bg-surface/50'}`}
              >
                <span>Recently Updated</span>
                {sortBy === 'updated' && <CheckCircle2 className="w-3.5 h-3.5 text-primary" />}
              </button>
              <button
                onClick={() => { setSortBy('name'); setShowSortMenu(false); }}
                className={`w-full text-left px-2.5 py-1.5 rounded-md flex items-center justify-between ${sortBy === 'name' ? 'bg-surface font-semibold text-foreground' : 'text-muted hover:text-foreground hover:bg-surface/50'}`}
              >
                <span>Repository Name</span>
                {sortBy === 'name' && <CheckCircle2 className="w-3.5 h-3.5 text-primary" />}
              </button>
              <button
                onClick={() => { setSortBy('created'); setShowSortMenu(false); }}
                className={`w-full text-left px-2.5 py-1.5 rounded-md flex items-center justify-between ${sortBy === 'created' ? 'bg-surface font-semibold text-foreground' : 'text-muted hover:text-foreground hover:bg-surface/50'}`}
              >
                <span>Creation Date</span>
                {sortBy === 'created' && <CheckCircle2 className="w-3.5 h-3.5 text-primary" />}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Grid of Repository Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          [1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse bg-surface/50">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-200" />
                  <div className="space-y-1.5 flex-1">
                    <div className="h-4 w-32 bg-gray-200 rounded" />
                    <div className="h-3 w-20 bg-gray-100 rounded" />
                  </div>
                </div>
                <div className="h-4 w-full bg-gray-100 rounded" />
                <div className="border-t border-border pt-3 flex justify-between">
                  <div className="h-3 w-24 bg-gray-200 rounded" />
                  <div className="h-3 w-16 bg-gray-200 rounded" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : repositories.length === 0 ? (
          <div className="col-span-full py-16 flex flex-col items-center justify-center text-muted border border-dashed border-border rounded-2xl p-8 bg-surface/30">
            <div className="w-12 h-12 rounded-full bg-surface border border-border flex items-center justify-center mb-4 text-muted">
              <Github className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-foreground mb-1">No repositories connected yet</h3>
            <p className="text-xs text-muted mb-5 max-w-sm text-center">
              Connect your GitHub repository to generate code knowledge graphs and explore 3D architectural universes.
            </p>
            <Link href="/repositories/import">
              <Button className="gap-2 text-xs font-semibold">
                <Plus className="w-4 h-4" />
                <span>Connect your first repository</span>
              </Button>
            </Link>
          </div>
        ) : filteredRepositories.length === 0 ? (
          <div className="col-span-full py-12 flex flex-col items-center justify-center text-muted border border-dashed border-border rounded-2xl p-6">
            <Search className="w-8 h-8 mb-2 opacity-40" />
            <p className="text-sm font-semibold text-foreground">No matching repositories found</p>
            <p className="text-xs text-muted mt-1 mb-4">No results for &quot;{searchQuery}&quot;</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => { setSearchQuery(''); setVisibilityFilter('all'); }}
            >
              Clear filters
            </Button>
          </div>
        ) : (
          filteredRepositories.map(repo => {
            const isPrivate = repo.is_private || (repo as any).visibility === 'private';
            const updatedDate = formatRelativeTime(repo.updated_at || repo.created_at);

            return (
              <Card 
                key={repo.id} 
                className="hover:border-border/90 transition-all hover:shadow-xs group h-full flex flex-col justify-between bg-background"
              >
                <CardContent className="p-5 space-y-4 flex flex-col h-full justify-between">
                  <div>
                    {/* Top Row: Title & Badges */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-9 h-9 rounded-lg bg-surface border border-border flex items-center justify-center flex-shrink-0 text-foreground">
                          <Github className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <Link 
                            href={`/repositories/${repo.id}`}
                            className="font-bold text-sm text-foreground hover:underline truncate block"
                          >
                            {repo.name}
                          </Link>
                          <p className="text-xs text-muted mt-0.5 font-mono">
                            branch: <span className="text-foreground">{repo.default_branch || 'main'}</span>
                          </p>
                        </div>
                      </div>

                      <Badge 
                        variant={isPrivate ? 'secondary' : 'outline'} 
                        className="text-[9px] uppercase font-bold py-0 h-4 flex-shrink-0"
                      >
                        {isPrivate ? 'Private' : 'Public'}
                      </Badge>
                    </div>

                    {/* Repository Description (if any) */}
                    {(repo as any).description && (
                      <p className="text-xs text-muted mt-3 line-clamp-2 leading-relaxed">
                        {(repo as any).description}
                      </p>
                    )}
                  </div>

                  {/* Bottom Footer & Direct Actions */}
                  <div className="space-y-3 pt-3 border-t border-border/80">
                    <div className="flex items-center justify-between text-xs text-muted">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-muted" />
                        <span>Updated {updatedDate}</span>
                      </div>

                      {repo.status === 'failed' ? (
                        <div className="flex items-center gap-1" title={repo.error || 'Analysis failed'}>
                          <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
                          <span className="text-[11px] font-medium text-red-700">Failed</span>
                        </div>
                      ) : (repo.status === 'analyzing' || repo.status === 'pending') ? (
                        <div className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse inline-block" />
                          <span className="text-[11px] font-medium text-blue-700">Analyzing</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                          <span className="text-[11px] font-medium text-emerald-700">Active</span>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <Link href={`/repositories/${repo.id}`} className="block">
                        <Button variant="outline" size="sm" className="w-full text-xs gap-1.5 h-8 shadow-2xs">
                          <Network className="w-3.5 h-3.5 text-muted" />
                          <span>Graph</span>
                        </Button>
                      </Link>

                      <Link href={`/repositories/${repo.id}/universe`} className="block">
                        <Button variant="outline" size="sm" className="w-full text-xs gap-1.5 h-8 shadow-2xs text-blue-600 border-blue-100 hover:bg-blue-50/50">
                          <Box className="w-3.5 h-3.5" />
                          <span>3D Universe</span>
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
