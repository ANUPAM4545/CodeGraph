'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Table, TableBody, TableCell, TableRow } from '../ui/Table';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Github, ArrowRight, Box, Network, CheckCircle2, Clock, AlertCircle, Plus } from 'lucide-react';
import { RecentRepository } from '../../types/dashboard';
import { formatRelativeTime } from '../../lib/utils/formatDate';

interface Props {
  repositories: RecentRepository[];
  isLoading?: boolean;
}

export default function RecentRepositories({ repositories, isLoading }: Props) {
  return (
    <Card className="shadow-2xs">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-base font-bold text-foreground">Connected Repositories</CardTitle>
          <p className="text-xs text-muted mt-0.5">Active repositories analyzed in your organization</p>
        </div>
        <Link href="/repositories">
          <Button variant="ghost" size="sm" className="text-xs text-muted hover:text-foreground">
            <span>View all</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableBody>
            {isLoading ? (
              [1, 2, 3].map(i => (
                <TableRow key={i} className="animate-pulse">
                  <TableCell className="py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200" />
                      <div className="space-y-1.5 flex-1">
                        <div className="h-4 w-40 bg-gray-200 rounded" />
                        <div className="h-3 w-28 bg-gray-100 rounded" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right py-4">
                    <div className="h-8 w-24 bg-gray-100 rounded inline-block" />
                  </TableCell>
                </TableRow>
              ))
            ) : repositories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} className="py-12 text-center">
                  <div className="max-w-sm mx-auto space-y-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mx-auto text-gray-400">
                      <Github className="w-5 h-5" />
                    </div>
                    <div className="text-sm font-semibold text-foreground">No repositories connected</div>
                    <p className="text-xs text-muted">
                      Connect your first GitHub repository to start building your code intelligence knowledge graph.
                    </p>
                    <Link href="/repositories/import" className="inline-block pt-1">
                      <Button size="sm" className="gap-1.5 text-xs">
                        <Plus className="w-3.5 h-3.5" />
                        <span>Import Repository</span>
                      </Button>
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              repositories.map(repo => {
                const isCompleted = repo.latest_status === 'completed';
                const isAnalyzing = repo.latest_status === 'analyzing' || repo.latest_status === 'pending';
                const isFailed = repo.latest_status === 'failed';

                return (
                  <TableRow key={repo.id} className="hover:bg-surface/60 transition-colors">
                    <TableCell className="py-3.5">
                      <div className="flex items-center space-x-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center border border-border/80 flex-shrink-0 text-foreground">
                          <Github className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                            <Link 
                              href={`/repositories/${repo.id}`} 
                              className="font-semibold text-sm text-foreground hover:underline truncate max-w-[220px] sm:max-w-xs"
                            >
                              {repo.name}
                            </Link>
                            <Badge 
                              variant={repo.visibility === 'private' ? 'secondary' : 'outline'} 
                              className="text-[9px] uppercase font-bold py-0 h-4"
                            >
                              {repo.visibility}
                            </Badge>
                            {isCompleted && (
                              <Badge variant="secondary" className="text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 flex items-center gap-1 py-0 h-4">
                                <CheckCircle2 className="w-2.5 h-2.5" />
                                <span>Synced</span>
                              </Badge>
                            )}
                            {isAnalyzing && (
                              <Badge variant="secondary" className="text-[9px] font-bold text-blue-700 bg-blue-50 border border-blue-100 flex items-center gap-1 py-0 h-4">
                                <Clock className="w-2.5 h-2.5 animate-spin" />
                                <span>Analyzing</span>
                              </Badge>
                            )}
                            {isFailed && (
                              <Badge variant="secondary" className="text-[9px] font-bold text-red-700 bg-red-50 border border-red-100 flex items-center gap-1 py-0 h-4">
                                <AlertCircle className="w-2.5 h-2.5" />
                                <span>Failed</span>
                              </Badge>
                            )}
                          </div>
                          
                          <div className="text-xs text-muted mt-0.5 flex items-center space-x-2 truncate">
                            <span>Branch: <span className="font-mono text-foreground font-medium">{repo.default_branch}</span></span>
                            <span>•</span>
                            <span>Updated {formatRelativeTime(repo.updated_at || repo.created_at)}</span>
                            {repo.files_count !== null && (
                              <>
                                <span>•</span>
                                <span className="font-medium text-foreground">{repo.files_count.toLocaleString()} files</span>
                              </>
                            )}
                            {repo.entities_count !== null && (
                              <>
                                <span>•</span>
                                <span className="font-medium text-foreground">{repo.entities_count.toLocaleString()} entities</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="text-right py-3.5">
                      <div className="flex items-center justify-end space-x-2">
                        <Link href={`/repositories/${repo.id}`}>
                          <Button variant="outline" size="sm" className="h-7 text-xs px-2.5 gap-1 shadow-2xs">
                            <Network className="w-3 h-3 text-muted" />
                            <span>Graph</span>
                          </Button>
                        </Link>

                        <Link href={`/repositories/${repo.id}/universe?version=${repo.latest_version_id || 'latest'}`}>
                          <Button variant="outline" size="sm" className="h-7 text-xs px-2.5 gap-1 shadow-2xs">
                            <Box className="w-3 h-3 text-blue-600" />
                            <span>3D</span>
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
