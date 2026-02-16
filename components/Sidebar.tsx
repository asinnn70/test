import React from 'react';
import { LayoutDashboard, Package, MessageSquareText, LogOut, User as UserIcon } from 'lucide-react';
import { AppView, User, UserRole } from '../types';

interface SidebarProps {
  currentView: AppView;
  onChangeView: (view: AppView) => void;
  user: User;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, user, onLogout }) => {
  const navItems = [
    { view: AppView.DASHBOARD, label: 'Dasbor', icon: LayoutDashboard },
    { view: AppView.INVENTORY, label: 'Inventaris', icon: Package },
    { view: AppView.AI_CHAT, label: 'Asisten AI', icon: MessageSquareText },
  ];

  return (
    <div className="w-20 lg:w-64 bg-white h-screen border-r border-gray-200 flex flex-col fixed left-0 top-0 z-20 transition-all duration-300">
      <div className="h-16 flex items-center justify-center lg:justify-start lg:px-6 border-b border-gray-100 bg-gray-50/50">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-sm shadow-primary/30">
          I
        </div>
        <span className="ml-3 font-bold text-gray-800 hidden lg:block text-lg">InvenAI</span>
      </div>

      <div className="p-4 border-b border-gray-100 lg:block hidden">
        <div className="bg-gray-50 rounded-xl p-3 flex items-center border border-gray-100">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm ${user.role === UserRole.ADMIN ? 'bg-primary' : 'bg-green-500'}`}>
            {user.name.charAt(0)}
          </div>
          <div className="ml-3 overflow-hidden">
            <p className="text-sm font-bold text-gray-800 truncate">{user.name}</p>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{user.role}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 py-6 space-y-2 px-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.view;
          return (
            <button
              key={item.view}
              onClick={() => onChangeView(item.view)}
              className={`w-full flex items-center justify-center lg:justify-start px-3 py-3 rounded-xl transition-all duration-200 group relative
                ${isActive 
                  ? 'bg-primary/10 text-primary font-medium' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
            >
              <Icon size={22} className={isActive ? 'text-primary' : 'text-gray-400 group-hover:text-gray-600'} />
              <span className={`ml-3 hidden lg:block ${isActive ? 'text-primary' : ''}`}>
                {item.label}
              </span>
              
              {/* Tooltip for mobile */}
              <div className="lg:hidden absolute left-14 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                {item.label}
              </div>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-center lg:justify-start px-3 py-3 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
        >
          <LogOut size={22} />
          <span className="ml-3 hidden lg:block font-medium">Keluar</span>
        </button>
      </div>
    </div>
  );
};