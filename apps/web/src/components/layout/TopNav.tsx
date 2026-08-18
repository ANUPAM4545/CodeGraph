import React from 'react';

export default function TopNav() {
  return (
    <header className="h-14 bg-background border-b border-border flex items-center justify-between px-6 flex-shrink-0">
      <div className="flex-1">
        {/* Empty space or breadcrumbs */}
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white font-bold text-xs cursor-pointer shadow-2xs">
          A
        </div>
      </div>
    </header>
  );
}
