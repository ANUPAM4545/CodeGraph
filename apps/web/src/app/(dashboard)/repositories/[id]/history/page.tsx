'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

import { RealtimeProvider, useRealtime } from '../../../../../components/providers/RealtimeProvider';

interface Version {
  id: string;
  commit_sha: string;
  parent_commit_sha: string | null;
  status: string;
  created_at: string;
}

function HistoryContent({ params, initialVersions }: { params: { id: string }, initialVersions: Version[] }) {
  const { events } = useRealtime();
  const [versions, setVersions] = useState<Version[]>(initialVersions);

  useEffect(() => {
    // Append new versions as they arrive via realtime
    const newReadyEvents = events.filter(e => e.event_type === 'VERSION_READY');
    if (newReadyEvents.length > 0) {
      const latestEvent = newReadyEvents[newReadyEvents.length - 1];
      // Basic deduplication
      if (!versions.find(v => v.id === latestEvent.repository_version_id)) {
        setVersions(prev => [{
          id: latestEvent.repository_version_id,
          commit_sha: latestEvent.repository_version_id.substring(0, 7), // mock
          parent_commit_sha: prev.length > 0 ? prev[0].commit_sha : null,
          status: 'completed',
          created_at: new Date().toISOString()
        }, ...prev]);
      }
    }
  }, [events, versions]);

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-black font-sans p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8 border-b border-gray-200 pb-4">
          <h1 className="text-2xl font-bold tracking-tight">Repository History</h1>
          <Link href={`/repositories/${params.id}`} className="text-sm font-medium hover:underline text-gray-500 hover:text-black">
            ← Back to Explorer
          </Link>
        </div>

        <div className="space-y-4">
          {versions.map((v, i) => (
            <div key={v.id} className="border border-gray-200 bg-white rounded-lg p-5 shadow-sm flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <span className="font-mono font-medium text-lg">{v.commit_sha.substring(0, 7)}</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wider ${v.status === 'completed' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'}`}>
                    {v.status}
                  </span>
                  {i === 0 && (
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Latest</span>
                  )}
                </div>
                <div className="text-sm text-gray-500">
                  Analyzed on {new Date(v.created_at).toLocaleString()}
                </div>
              </div>
              <div className="flex flex-col space-y-2 text-right">
                <Link href={`/repositories/${params.id}?version=${v.id}`} className="text-sm font-medium hover:underline">
                  View 2D Explorer
                </Link>
                <Link href={`/repositories/${params.id}/universe?version=${v.id}`} className="text-sm font-medium hover:underline">
                  View 3D Universe
                </Link>
                {v.parent_commit_sha && (
                  <Link href={`/repositories/${params.id}/history/diff?version=${v.id}`} className="text-sm font-medium text-gray-500 hover:text-black hover:underline">
                    View Architecture Diff
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HistoryPage({ params }: { params: { id: string } }) {
  const [initialVersions, setInitialVersions] = useState<Version[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock fetch for history
    setInitialVersions([
      {
        id: "v-new",
        commit_sha: "def5678",
        parent_commit_sha: "abc1234",
        status: "completed",
        created_at: new Date().toISOString()
      },
      {
        id: "v-old",
        commit_sha: "abc1234",
        parent_commit_sha: null,
        status: "completed",
        created_at: new Date(Date.now() - 86400000).toISOString()
      }
    ]);
    setLoading(false);
  }, [params.id]);

  if (loading) return <div className="p-8">Loading history...</div>;

  return (
    <RealtimeProvider repositoryId={params.id} versionId={initialVersions[0]?.id || "unknown"}>
      <HistoryContent params={params} initialVersions={initialVersions} />
    </RealtimeProvider>
  );
}
