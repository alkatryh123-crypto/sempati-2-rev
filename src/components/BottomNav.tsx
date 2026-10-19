import React from 'react';
import { Compass, CalendarDays, Gift, Settings, Heart } from 'lucide-react';

export type TabType = 'today' | 'calendar' | 'gifts' | 'settings';

interface BottomNavProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onChangeTab }) => {
  const tabs: { id: TabType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'today', label: 'Bugün', icon: Heart },
    { id: 'calendar', label: 'Döngü & Takvim', icon: CalendarDays },
    { id: 'gifts', label: 'Hediye & Destek', icon: Gift },
    { id: 'settings', label: 'Kişiler & Ayar', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 pb-safe">
      <div className="w-full max-w-full md:max-w-4xl mx-auto grid grid-cols-4 items-center h-16 px-1 sm:px-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChangeTab(tab.id)}
              className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-all relative ${
                isActive
                  ? 'text-rose-600 dark:text-rose-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium'
              }`}
            >
              <div
                className={`p-1 rounded-xl transition-all ${
                  isActive ? 'bg-rose-50 dark:bg-rose-950/50 scale-110' : ''
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] tracking-tight mt-0.5 truncate max-w-full px-1">
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-rose-600 dark:bg-rose-400" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
