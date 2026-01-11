'use client';

import { JSONContent } from '@tiptap/react';
import { Check, X, Minus } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DiffViewProps {
  currentContent: JSONContent;
  previousContent: JSONContent;
}

export default function DiffView({ currentContent, previousContent }: DiffViewProps) {
  const renderDiff = () => {
    // Simple text diff for demonstration
    // In production, use a proper diff library like diff-match-patch or similar
    const currentText = JSON.stringify(currentContent, null, 2);
    const previousText = JSON.stringify(previousContent, null, 2);

    return (
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-200">
            <X className="w-4 h-4 text-red-500" />
            <span className="text-sm font-medium text-slate-700">Previous Version</span>
          </div>
          <ScrollArea className="h-[400px] w-full rounded-md border border-slate-200 p-4">
            <pre className="text-xs text-slate-600 whitespace-pre-wrap">
              {previousText}
            </pre>
          </ScrollArea>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-200">
            <Check className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium text-slate-700">Current Version</span>
          </div>
          <ScrollArea className="h-[400px] w-full rounded-md border border-slate-200 p-4">
            <pre className="text-xs text-slate-600 whitespace-pre-wrap">
              {currentText}
            </pre>
          </ScrollArea>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
      <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Version Comparison</h3>
      {renderDiff()}
    </div>
  );
}
