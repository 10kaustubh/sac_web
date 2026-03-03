import React from 'react';
import { LayoutDashboard, FileText, Database, Settings, PieChart, TrendingUp } from 'lucide-react';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

const menuItems = [
  { id: 'home', label: 'Home', icon: LayoutDashboard },
  { id: 'stories', label: 'Stories', icon: FileText },
  { id: 'models', label: 'Models', icon: Database },
  { id: 'analytics', label: 'Analytics', icon: PieChart },
  { id: 'planning', label: 'Planning', icon: TrendingUp },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange }) => {
  return (
    <aside className="w-64 bg-sap-shell text-white h-screen flex flex-col">
      <div className="p-4 border-b border-gray-600">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <PieChart size={24} />
          Analytics Cloud
        </h1>
      </div>
      <nav className="flex-1 p-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
              activeView === item.id
                ? 'bg-sap-blue text-white'
                : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            <item.icon size={20} />
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
};
