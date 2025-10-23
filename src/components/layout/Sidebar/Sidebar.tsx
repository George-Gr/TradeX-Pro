import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../../lib/utils';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  href: string;
  badge?: string | number;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

interface SidebarProps {
  navigation: NavGroup[];
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ navigation, isCollapsed = false, onToggle }) => {
  const [hoveredGroup, setHoveredGroup] = useState<string | null>(null);
  const location = useLocation();

  return (
    <aside
      className={cn(
        'flex flex-col bg-white border-r border-neutral-200 transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-neutral-200">
        {!isCollapsed && <span className="text-lg font-semibold">TradeX Pro</span>}
        <button
          onClick={onToggle}
          className="p-2 rounded-md hover:bg-neutral-100"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto">
        {navigation.map((group) => (
          <div
            key={group.label}
            onMouseEnter={() => setHoveredGroup(group.label)}
            onMouseLeave={() => setHoveredGroup(null)}
          >
            {!isCollapsed && (
              <div className="px-3 py-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                {group.label}
              </div>
            )}
            <ul className="space-y-1 px-2">
              {group.items.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      to={item.href}
                      className={cn(
                        'flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-primary-50 text-primary-900'
                          : 'text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900'
                      )}
                    >
                      <span className="flex items-center justify-center w-5 h-5 mr-3">
                        {item.icon}
                      </span>
                      {(!isCollapsed || hoveredGroup === group.label) && (
                        <>
                          <span>{item.label}</span>
                          {item.badge && (
                            <span className="ml-auto bg-primary-100 text-primary-900 py-0.5 px-2 rounded-full text-xs">
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {!isCollapsed && (
        <div className="p-4 border-t border-neutral-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-neutral-200" />
            <div className="flex-1">
              <p className="text-sm font-medium">John Doe</p>
              <p className="text-xs text-neutral-500">Pro Trader</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
