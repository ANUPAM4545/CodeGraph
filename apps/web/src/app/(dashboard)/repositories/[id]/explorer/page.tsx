import React from 'react';
import ExplorerLayout from '../../../../../components/explorer/ExplorerLayout';

export default function ExplorerPage({ params }: { params: { id: string } }) {
  // In a real app we'd fetch the latest version_id here, but for now we'll pass it down or let the layout handle it
  return (
    <div className="h-[calc(100vh-100px)] w-full border border-gray-200 rounded-xl overflow-hidden bg-white flex flex-col">
      <ExplorerLayout repositoryId={params.id} versionId="latest" />
    </div>
  );
}
