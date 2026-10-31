import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Layers,
  PlusCircle,
  Package,
  FileText,
  MessageSquare,
  CreditCard,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { cn } from '../../utils/cn';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}) => {
  const { user } = useAuth();
  const { unreadCount, chats } = useApp();

  // Active negotiation count
  const pendingNegotiations = Object.values(chats).filter(
    (c) => c.status.includes('Revision') || c.status.includes('Review')
  ).length;

  const navItems = [
    { section: 'Operations' },
    { name: 'Overview', to: '/client/dashboard', icon: LayoutDashboard },
    { name: 'Product Catalogue', to: '/client/products', icon: Layers },
    { name: 'Create New Order', to: '/client/orders/new', icon: PlusCircle },
    { name: 'My Orders', to: '/client/orders', icon: Package },
    { section: 'Commercials' },
    {
      name: 'Quotations',
      to: '/client/quotations',
      icon: FileText,
      badge: pendingNegotiations > 0 ? pendingNegotiations : undefined,
    },
    { name: 'Messages & Chat', to: '/client/messages', icon: MessageSquare },
    { name: 'Payments & Invoices', to: '/client/payments', icon: CreditCard },
    { section: 'Account' },
    {
      name: 'Notifications',
      to: '/client/notifications',
      icon: Bell,
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
    { name: 'Settings & Mill', to: '/client/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-charcoal/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          'fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-charcoal text-ivory border-r border-white/10 transition-all duration-300',
          collapsed ? 'w-20' : 'w-64',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Header / Brand Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/10">
          <Link
            to="/client/dashboard"
            className="flex items-center gap-3 overflow-hidden"
            onClick={onCloseMobile}
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-vermilion to-vermilion-hover flex items-center justify-center text-white shadow-vermilion flex-shrink-0">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <path d="M4 6h16M4 12h16M4 18h16" />
                <line x1="8" y1="3" x2="8" y2="21" />
                <line x1="16" y1="3" x2="16" y2="21" />
                <circle cx="12" cy="12" r="2" fill="currentColor" />
              </svg>
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="font-bold text-base tracking-tight text-white leading-tight">
                  Loom<span className="text-vermilion">Pilot</span>
                </span>
                <span className="text-[10px] uppercase tracking-wider text-muted-light font-semibold">
                  Client Portal
                </span>
              </div>
            )}
          </Link>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex w-7 h-7 rounded items-center justify-center text-muted-light hover:text-white hover:bg-white/10 transition-colors"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
          {navItems.map((item, idx) => {
            if ('section' in item && item.section) {
              if (collapsed) return null;
              return (
                <div
                  key={idx}
                  className="px-3 pt-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-muted-light"
                >
                  {item.section}
                </div>
              );
            }

            const Icon = item.icon!;
            return (
              <NavLink
                key={item.to}
                to={item.to!}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group relative',
                    isActive
                      ? 'bg-vermilion text-white shadow-vermilion font-semibold'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  )
                }
              >
                <Icon size={19} className="flex-shrink-0" />
                {!collapsed && (
                  <span className="truncate flex-1 text-left">{item.name}</span>
                )}
                {!collapsed && item.badge !== undefined && (
                  <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-white/20 text-white">
                    {item.badge}
                  </span>
                )}
                {collapsed && item.badge !== undefined && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-vermilion ring-2 ring-charcoal" />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Client Account Info Footer */}
        <div className="p-3 border-t border-white/10 bg-black/20">
          <div
            className={cn(
              'flex items-center gap-3 p-2 rounded-lg bg-white/5 border border-white/5',
              collapsed && 'justify-center p-1.5'
            )}
          >
            <div className="w-8 h-8 rounded-lg bg-charcoal-light border border-white/10 flex items-center justify-center font-bold text-xs text-ivory flex-shrink-0">
              {user?.company.slice(0, 2).toUpperCase() || 'RA'}
            </div>
            {!collapsed && (
              <div className="overflow-hidden flex-1">
                <div className="text-xs font-semibold text-white truncate">
                  {user?.company || 'Raymond Apparel'}
                </div>
                <div className="text-[10px] font-mono text-muted-light flex items-center gap-1">
                  <ShieldCheck size={11} className="text-success" />
                  {user?.clientCode || 'RAY-IND-8842'}
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

