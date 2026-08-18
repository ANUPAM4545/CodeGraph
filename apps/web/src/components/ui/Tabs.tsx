import React, { useState, useEffect } from 'react';

export interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
}

export function Tabs({ tabs, defaultTab, activeTab: controlledTab, onTabChange }: TabsProps) {
  const [internalTab, setInternalTab] = useState(defaultTab || tabs[0]?.id);
  const currentTab = controlledTab !== undefined ? controlledTab : internalTab;

  const handleTabClick = (tabId: string) => {
    if (controlledTab === undefined) {
      setInternalTab(tabId);
    }
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  return (
    <div className="w-full flex flex-col h-full">
      <div className="flex border-b border-border gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`px-4 py-2.5 text-xs font-semibold transition-colors border-b-2 -mb-[1px] ${
              currentTab === tab.id
                ? 'border-primary text-primary font-bold'
                : 'border-transparent text-muted hover:text-foreground hover:border-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="flex-1 mt-4 relative">
        {tabs.find((t) => t.id === currentTab)?.content}
      </div>
    </div>
  );
}
