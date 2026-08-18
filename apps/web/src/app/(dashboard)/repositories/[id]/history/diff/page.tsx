'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface DiffData {
  files_changed: { status: string; path: string }[];
  symbols_added: number;
  symbols_removed: number;
  relationships_added: number;
  relationships_removed: number;
}

export default function DiffPage({ params, searchParams }: { params: { id: string }, searchParams: { version?: string } }) {
  const versionId = searchParams.version;
  const [diff, setDiff] = useState<DiffData | null>(null);

  useEffect(() => {
    // Mock fetch diff API
    setDiff({
      files_changed: [
        { status: 'MODIFIED', path: 'src/main.py' },
        { status: 'ADDED', path: 'src/utils.py' }
      ],
      symbols_added: 2,
      symbols_removed: 0,
      relationships_added: 5,
      relationships_removed: 1
    });
  }, [versionId]);

  if (!versionId) return <div className="p-8">No version specified.</div>;
  if (!diff) return <div className="p-8">Loading diff...</div>;

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-black font-sans p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8 border-b border-gray-200 pb-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Architecture Diff</h1>
            <p className="text-sm text-gray-500 mt-1">Version: <span className="font-mono">{versionId}</span></p>
          </div>
          <Link href={`/repositories/${params.id}/history`} className="text-sm font-medium hover:underline text-gray-500 hover:text-black">
            ← Back to History
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="border border-gray-200 bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Files</h3>
            <div className="text-3xl font-light">{diff.files_changed.length}</div>
          </div>
          <div className="border border-gray-200 bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Symbols</h3>
            <div className="text-sm space-y-1">
              <div className="flex justify-between font-mono">
                <span className="text-black">+ Added</span>
                <span>{diff.symbols_added}</span>
              </div>
              <div className="flex justify-between font-mono">
                <span className="text-gray-400">- Removed</span>
                <span>{diff.symbols_removed}</span>
              </div>
            </div>
          </div>
          <div className="border border-gray-200 bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Relationships</h3>
            <div className="text-sm space-y-1">
              <div className="flex justify-between font-mono">
                <span className="text-black">+ Added</span>
                <span>{diff.relationships_added}</span>
              </div>
              <div className="flex justify-between font-mono">
                <span className="text-gray-400">- Removed</span>
                <span>{diff.relationships_removed}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border border-gray-200 bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 font-semibold text-sm">
            Files Changed
          </div>
          <div className="divide-y divide-gray-100">
            {diff.files_changed.map((f, i) => (
              <div key={i} className="flex items-center px-4 py-3 text-sm">
                <span className={`w-20 font-semibold text-xs tracking-wider uppercase ${f.status === 'ADDED' ? 'text-black' : f.status === 'DELETED' ? 'text-gray-400 line-through' : 'text-gray-600'}`}>
                  {f.status}
                </span>
                <span className="font-mono text-gray-800">{f.path}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
