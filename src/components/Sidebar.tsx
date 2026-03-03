import React from 'react';
import { LayoutDashboard, FileText, Database, Settings, PieChart, TrendingUp, Layers } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

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
  { id: 'templates', label: 'Templates', icon: Layers },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange }) => {
  const { theme } = useTheme();

  return (
    <aside className="w-64 bg-sap-shell text-white h-screen flex flex-col">
      <div className="p-4 border-b border-gray-600">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <PieChart size={24} />
          Analytics Cloud
        </h1>
        <p className="text-xs text-gray-400 mt-1">SAC Clone v2.0</p>
      </div>
      <nav className="flex-1 p-2 overflow-y-auto">
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
      <div className="p-4 border-t border-gray-600">
        <div className="text-xs text-gray-400">
          <p>Theme: {theme.mode === 'light' ? 'Light' : 'Dark'}</p>
          <p className="mt-1">© 2024 SAC Clone</p>
        </div>
      </div>
    </aside>
  );
};
