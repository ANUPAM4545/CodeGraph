'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Github, Network, Box, Activity } from 'lucide-react';
import { RecentRepository } from '../../types/dashboard';

interface Props {
  primaryRepo?: RecentRepository;
}

export default function QuickActions({ primaryRepo }: Props) {
  return (
    <Card className="shadow-2xs">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-bold text-foreground">Quick Actions</CardTitle>
        <p className="text-xs text-muted mt-0.5">Direct workflow shortcuts</p>
      </CardHeader>

      <CardContent className="space-y-2.5">
        <Link href="/repositories/import" className="block">
          <Button variant="outline" className="w-full justify-start text-xs font-medium h-9 shadow-2xs gap-2">
            <Github className="w-4 h-4 text-muted" />
            <span>Import GitHub Repository</span>
          </Button>
        </Link>

        {primaryRepo ? (
          <>
            <Link href={`/repositories/${primaryRepo.id}`} className="block">
              <Button variant="outline" className="w-full justify-start text-xs font-medium h-9 shadow-2xs gap-2">
                <Network className="w-4 h-4 text-muted" />
                <span className="truncate">Explore Graph ({primaryRepo.name})</span>
              </Button>
            </Link>

            <Link 
              href={`/repositories/${primaryRepo.id}/universe?version=${primaryRepo.latest_version_id || 'latest'}`} 
              className="block"
            >
              <Button variant="outline" className="w-full justify-start text-xs font-medium h-9 shadow-2xs gap-2">
                <Box className="w-4 h-4 text-blue-600" />
                <span className="truncate">Explore 3D Universe</span>
              </Button>
            </Link>
          </>
        ) : (
          <>
            <Button variant="outline" disabled className="w-full justify-start text-xs font-medium h-9 gap-2 opacity-50">
              <Network className="w-4 h-4 text-muted" />
              <span>Explore Graph (No repo)</span>
            </Button>
            <Button variant="outline" disabled className="w-full justify-start text-xs font-medium h-9 gap-2 opacity-50">
              <Box className="w-4 h-4 text-muted" />
              <span>Explore 3D Universe (No repo)</span>
            </Button>
          </>
        )}

        <Link href="/repositories" className="block">
          <Button variant="outline" className="w-full justify-start text-xs font-medium h-9 shadow-2xs gap-2">
            <Activity className="w-4 h-4 text-muted" />
            <span>Manage Repositories</span>
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
