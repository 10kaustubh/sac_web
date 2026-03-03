import React from 'react';
import { Search, Bell, User, HelpCircle } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="h-14 bg-white border-b flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search stories, models, data..."
            className="pl-10 pr-4 py-2 border rounded-lg w-80 focus:outline-none focus:ring-2 focus:ring-sap-blue"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <HelpCircle size={20} className="text-gray-600" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-full relative">
          <Bell size={20} className="text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <button className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg">
          <div className="w-8 h-8 bg-sap-blue rounded-full flex items-center justify-center">
            <User size={16} className="text-white" />
          </div>
        </button>
      </div>
    </header>
  );
};
