'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  Package,
  Users,
  FileText,
  ShoppingCart,
  Settings,
  Home,
  TrendingUp,
  Package2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Products', href: '/products', icon: Package },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Suppliers', href: '/suppliers', icon: Package2 },
  { name: 'Invoices', href: '/invoices', icon: FileText },
  { name: 'POS', href: '/pos', icon: ShoppingCart },
  { name: 'Inventory', href: '/inventory', icon: BarChart3 },
  { name: 'Reports', href: '/reports', icon: TrendingUp },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden h-screen w-64 border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:fixed md:left-0 md:top-0 md:flex md:flex-col">
      {/* Logo Area */}
      <div className="border-b border-sidebar-border px-6 py-6">
        <h1 className="text-2xl font-bold text-sidebar-primary">ShopPro</h1>
        <p className="text-xs text-sidebar-foreground/60 mt-1">
          Management System
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-sidebar-primary/10 text-sidebar-primary'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent/30'
                  )}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border px-4 py-4">
        <div className="flex items-center gap-3 rounded-lg bg-sidebar-primary/10 px-4 py-3">
          <div className="h-8 w-8 rounded-full bg-sidebar-primary" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-primary truncate">Admin</p>
            <p className="text-xs text-sidebar-foreground/60 truncate">
              system@shop.local
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
