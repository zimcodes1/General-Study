import { Upload, Bookmark, Activity, BarChart3 } from 'lucide-react';

export type TabType = 'resources' | 'bookmarks' | 'activity' | 'stats';

interface ProfileTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export default function ProfileTabs({ activeTab, onTabChange }: ProfileTabsProps) {
  const tabs = [
    { id: 'resources' as TabType, label: 'My Resources', icon: Upload },
    { id: 'bookmarks' as TabType, label: 'Bookmarks', icon: Bookmark },
    { id: 'activity' as TabType, label: 'Activity', icon: Activity },
    { id: 'stats' as TabType, label: 'Stats', icon: BarChart3 },
  ];

  return (
    <div className="mb-8">
      <div className="bg-surface-container-low rounded-2xl p-1.5 border border-outline-variant/10 inline-flex gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all font-jakarta text-sm ${
                activeTab === tab.id
                  ? 'bg-surface-container-high text-on-surface shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
