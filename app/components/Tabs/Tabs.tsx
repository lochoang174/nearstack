import React from 'react';

interface TabItem {
  id: string;
  label: string;
  icon?: React.ElementType;
}

interface TabsProps {
  items: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const Tabs: React.FC<TabsProps> = ({ items, activeTab, onTabChange }) => {
  return (
    <div className="flex bg-[#0B1123] rounded-lg overflow-hidden mb-2">
      {items.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              flex items-center gap-2 px-2 py-2 text-sm font-medium
              transition-colors duration-400
              ${activeTab === tab.id 
                ? 'bg-[#00B862] text-white' 
                : 'text-gray-300 hover:text-white hover:bg-[#00B862]/10'
              }
            `}
          >
            {Icon && <Icon className="w-4 h-auto" />}
            <span className='text-sm'>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default Tabs; 