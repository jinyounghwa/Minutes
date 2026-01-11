'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumbs() {
  const pathname = usePathname();
  const paths = pathname.split('/').filter(p => p);

  return (
    <nav className="flex items-center space-x-2 text-xs text-slate-500 mb-6 bg-white dark:bg-slate-900 px-4 py-2 rounded-lg border border-slate-100 dark:border-slate-800 w-fit">
      <Link href="/dashboard" className="hover:text-indigo-600 transition-colors">
        <Home className="w-3.5 h-3.5" />
      </Link>
      {paths.map((path, index) => {
        const href = `/${paths.slice(0, index + 1).join('/')}`;
        const isLast = index === paths.length - 1;
        const label = path.charAt(0).toUpperCase() + path.slice(1);

        return (
          <div key={href} className="flex items-center space-x-2">
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            {isLast ? (
              <span className="font-semibold text-slate-900 dark:text-white capitalize">{label}</span>
            ) : (
              <Link href={href} className="hover:text-indigo-600 transition-colors capitalize">
                {label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
