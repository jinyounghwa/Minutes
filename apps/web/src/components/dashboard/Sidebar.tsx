'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  Zap, 
  Home, 
  FileText, 
  Users, 
  Settings, 
  Trash2, 
  Plus, 
  FolderOpen
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';

export default function Sidebar() {
  const pathname = usePathname();
  const userName = useAuthStore((state) => state.user?.name);

  const navItems = [
    { name: 'Home', href: '/dashboard', icon: Home },
    { name: 'Meetings', href: '/dashboard/meetings', icon: FileText },
    { name: 'Projects', href: '/dashboard/projects', icon: FolderOpen },
    { name: 'Teams', href: '/dashboard/teams', icon: Users },
    { name: 'Trash', href: '/dashboard/trash', icon: Trash2 },
  ];

  return (
    <div className="w-64 h-screen border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col pt-4">
      <div className="px-6 mb-8 flex items-center gap-2">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
          <Zap className="text-white w-5 h-5" />
        </div>
        <span className="text-xl font-bold text-slate-900 dark:text-white">Minutes</span>
      </div>

      <div className="px-4 mb-6">
        <Link href="/dashboard/meetings/new">
          <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white justify-start gap-2 shadow-sm">
            <Plus className="w-4 h-4" />
            <span>New Meeting</span>
          </Button>
        </Link>
      </div>

      <nav className="flex-1 px-2 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
              pathname === item.href 
                ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400" 
                : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800"
            )}
          >
            <item.icon className="w-4 h-4" />
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold">
            {userName?.charAt(0)}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{userName}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">Workspace Admin</p>
          </div>
          <Link href="/dashboard/settings">
            <Settings className="w-4 h-4 text-slate-400 hover:text-slate-600 cursor-pointer" />
          </Link>
        </div>
      </div>
    </div>
  );
}
