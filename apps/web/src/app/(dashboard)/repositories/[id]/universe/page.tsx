import React from 'react';
import UniverseLayout from '../../../../../components/universe/UniverseLayout';

export default function UniversePage({ 
  params, 
  searchParams 
}: { 
  params: { id: string }, 
  searchParams: { version?: string; node?: string } 
}) {
  const versionId = searchParams.version || 'latest';
  const initialNodeId = searchParams.node || null;

  return (
    <div className="w-full h-full overflow-hidden">
      <UniverseLayout 
        repositoryId={params.id} 
        versionId={versionId} 
        initialNodeId={initialNodeId}
      />
    </div>
  );
}
