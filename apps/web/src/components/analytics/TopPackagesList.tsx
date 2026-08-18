'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Box, ExternalLink } from 'lucide-react';
import { TopPackage } from '../../types/analytics';

interface Props {
  packages: TopPackage[];
  isLoading?: boolean;
}

export default function TopPackagesList({ packages, isLoading }: Props) {
  if (isLoading) {
    return (
      <Card className="shadow-2xs animate-pulse">
        <CardHeader className="pb-3">
          <div className="h-4 w-44 bg-gray-200 rounded" />
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-10 bg-gray-100 rounded-lg" />
          ))}
        </CardContent>
      </Card>
    );
  }

  const maxImportCount = packages.length > 0 ? Math.max(...packages.map(p => p.import_count)) : 1;

  return (
    <Card className="shadow-2xs h-full flex flex-col justify-between">
      <div>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-bold text-foreground">Top Dependencies & Packages</CardTitle>
            <span className="text-xs text-muted font-mono">{packages.length} tracked packages</span>
          </div>
          <p className="text-xs text-muted mt-0.5">Most imported external and internal modular packages</p>
        </CardHeader>

        <CardContent className="space-y-3">
          {packages.length === 0 ? (
            <div className="py-8 text-center text-xs text-muted">
              No package imports detected yet.
            </div>
          ) : (
            packages.map((pkg, index) => {
              const fillPct = (pkg.import_count / maxImportCount) * 100;

              return (
                <div 
                  key={pkg.package_name} 
                  className="p-2.5 rounded-xl bg-surface/60 border border-border/80 space-y-1.5 hover:border-border transition-colors shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 min-w-0">
                      <span className="w-5 h-5 rounded-md bg-surface flex items-center justify-center text-[10px] font-bold text-muted border border-border">
                        {index + 1}
                      </span>
                      <span className="text-xs font-mono font-semibold text-foreground truncate">
                        {pkg.package_name}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono font-bold text-foreground">
                        {pkg.import_count} <span className="text-[10px] font-normal text-muted">imports</span>
                      </span>
                    </div>
                  </div>

                  {/* Relative progress bar */}
                  <div className="h-1.5 w-full bg-surface rounded-full overflow-hidden border border-border/40">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(fillPct, 3)}%` }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </div>
    </Card>
  );
}
