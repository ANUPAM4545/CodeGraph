'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/Table';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { FileCode, Network, ArrowRight } from 'lucide-react';
import { CodeDenseFile } from '../../types/analytics';

interface Props {
  files: CodeDenseFile[];
  repositoryId?: string | null;
  isLoading?: boolean;
}

export default function CodeDensityTable({ files, repositoryId, isLoading }: Props) {
  return (
    <Card className="shadow-2xs">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-base font-bold text-foreground">Code Density & Structural Complexity</CardTitle>
          <p className="text-xs text-muted mt-0.5">Files with the highest concentration of declared symbols and functions</p>
        </div>
        {repositoryId && (
          <Link href={`/repositories/${repositoryId}`}>
            <Button variant="ghost" size="sm" className="text-xs text-muted hover:text-foreground">
              <span>View in Graph</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        )}
      </CardHeader>

      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border/80 text-[11px] uppercase tracking-wider text-muted">
              <TableHead className="py-2.5 px-4">File Name</TableHead>
              <TableHead className="py-2.5 px-4 text-center">Functions</TableHead>
              <TableHead className="py-2.5 px-4 text-center">Classes / Types</TableHead>
              <TableHead className="py-2.5 px-4 text-right">Total Symbols</TableHead>
              <TableHead className="py-2.5 px-4 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [1, 2, 3, 4, 5].map(i => (
                <TableRow key={i} className="animate-pulse">
                  <TableCell className="py-3 px-4">
                    <div className="h-4 w-40 bg-gray-200 rounded" />
                  </TableCell>
                  <TableCell className="text-center py-3 px-4">
                    <div className="h-4 w-12 bg-gray-100 rounded mx-auto" />
                  </TableCell>
                  <TableCell className="text-center py-3 px-4">
                    <div className="h-4 w-12 bg-gray-100 rounded mx-auto" />
                  </TableCell>
                  <TableCell className="text-right py-3 px-4">
                    <div className="h-4 w-16 bg-gray-200 rounded ml-auto" />
                  </TableCell>
                  <TableCell className="text-right py-3 px-4">
                    <div className="h-6 w-16 bg-gray-100 rounded ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : files.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-xs text-muted">
                  No code-dense files analyzed yet.
                </TableCell>
              </TableRow>
            ) : (
              files.map(file => (
                <TableRow key={file.file_name} className="hover:bg-surface/50 transition-colors">
                  <TableCell className="py-3 px-4 font-mono text-xs font-semibold text-foreground">
                    <div className="flex items-center space-x-2">
                      <FileCode className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span className="truncate">{file.file_name}</span>
                    </div>
                  </TableCell>

                  <TableCell className="py-3 px-4 text-center font-mono text-xs text-blue-700 font-medium">
                    {file.functions_count}
                  </TableCell>

                  <TableCell className="py-3 px-4 text-center font-mono text-xs text-purple-700 font-medium">
                    {file.classes_count}
                  </TableCell>

                  <TableCell className="py-3 px-4 text-right">
                    <Badge variant="secondary" className="font-mono text-xs font-bold py-0.5 px-2 bg-surface border border-border">
                      {file.symbol_count} symbols
                    </Badge>
                  </TableCell>

                  <TableCell className="py-3 px-4 text-right">
                    {repositoryId ? (
                      <Link href={`/repositories/${repositoryId}`}>
                        <Button variant="outline" size="sm" className="h-7 text-xs px-2 gap-1 shadow-2xs">
                          <Network className="w-3 h-3 text-muted" />
                          <span>Graph</span>
                        </Button>
                      </Link>
                    ) : (
                      <span className="text-muted text-xs">—</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
