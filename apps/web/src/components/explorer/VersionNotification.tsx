'use client';

import React, { useEffect, useState } from 'react';
import { useRealtime } from '../providers/RealtimeProvider';
import { useRouter } from 'next/navigation';

interface Props {
  repositoryId: string;
  currentVersionId: string;
}

export default function VersionNotification({ repositoryId, currentVersionId }: Props) {
  const { events } = useRealtime();
  const [newVersion, setNewVersion] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // Find the latest VERSION_READY event
    const readyEvents = events.filter(e => e.event_type === 'VERSION_READY');
    if (readyEvents.length > 0) {
      const latest = readyEvents[readyEvents.length - 1];
      if (latest.repository_version_id !== currentVersionId) {
        setNewVersion(latest);
      }
    }
  }, [events, currentVersionId]);

  if (!newVersion) return null;

  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-black text-white px-4 py-3 rounded-lg shadow-2xl flex items-center space-x-4 border border-gray-700 animate-fade-in-down">
      <div>
        <h4 className="text-sm font-semibold">Repository Updated</h4>
        <p className="text-xs text-gray-300">A new version has been analyzed.</p>
      </div>
      <div className="flex space-x-2">
        <button 
          onClick={() => {
            const params = new URLSearchParams(window.location.search);
            params.set('version', newVersion.repository_version_id);
            router.push(`${window.location.pathname}?${params.toString()}`);
            setNewVersion(null);
          }}
          className="px-3 py-1.5 bg-white text-black text-xs font-semibold rounded hover:bg-gray-200"
        >
          Switch Version
        </button>
        <button 
          onClick={() => setNewVersion(null)}
          className="px-3 py-1.5 bg-gray-800 text-gray-300 text-xs font-medium rounded hover:bg-gray-700"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
