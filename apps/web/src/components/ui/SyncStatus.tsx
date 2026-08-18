'use client';

import React from 'react';
import { useRealtime } from '../providers/RealtimeProvider';

export default function SyncStatus() {
  const { status } = useRealtime();

  const getStatusDisplay = () => {
    switch (status) {
      case 'CONNECTED':
        return { label: 'Connected', icon: 'M5 13l4 4L19 7', opacity: 'opacity-100' };
      case 'SYNCING':
        return { label: 'Syncing...', icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15', opacity: 'opacity-80 animate-spin-slow' };
      case 'READY':
        return { label: 'Version Ready', icon: 'M5 13l4 4L19 7', opacity: 'opacity-100 font-bold text-black border-black' };
      case 'DEGRADED':
        return { label: 'Degraded', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z', opacity: 'opacity-70' };
      case 'DISCONNECTED':
      case 'CONNECTING':
      case 'AUTHENTICATING':
        return { label: 'Disconnected', icon: 'M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a2 2 0 112.828 2.828', opacity: 'opacity-50' };
      case 'FAILED':
        return { label: 'Auth Failed', icon: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', opacity: 'opacity-100 border-black' };
      default:
        return { label: 'Unknown', icon: '', opacity: 'opacity-50' };
    }
  };

  const display = getStatusDisplay();

  return (
    <div className={`flex items-center space-x-2 px-3 py-1.5 border border-gray-300 rounded-md bg-white text-xs font-mono uppercase tracking-wide transition-all ${display.opacity}`}>
      <svg className={`w-3.5 h-3.5 text-gray-700 ${status === 'SYNCING' ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={display.icon} />
      </svg>
      <span className="text-gray-700">{display.label}</span>
    </div>
  );
}
