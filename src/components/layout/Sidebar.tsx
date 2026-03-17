import { LucideIcon, LayoutDashboard, ImagePlus, Settings } from 'lucide-react';
import * as React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// 我们在这里更新 Sidebar，使用真实的 Lucide 图标来替换掉之前手写的 SVG
const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Tasks', href: '/tasks', icon: ImagePlus },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  return (
    <aside className="w-64 border-r bg-muted/40 hidden md:flex flex-col h-screen fixed left-0 top-0">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="text-lg tracking-tight hover:text-primary transition-colors">Ecom Visual Studio</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted/50",
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}
