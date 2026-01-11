'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  History, 
  ChevronLeft, 
  ChevronRight,
  Clock,
  User,
  RotateCcw,
  GitCompare
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import api from '@/lib/api';
import { format } from 'date-fns';

interface MeetingVersion {
  id: string;
  version: number;
  created_at: string;
  change_description: string;
  creator: { name: string };
}

interface VersionHistoryPanelProps {
  meetingId: string;
  open: boolean;
  onClose: () => void;
  onRestore: (versionId: string) => void;
}

export default function VersionHistoryPanel({ meetingId, open, onClose, onRestore }: VersionHistoryPanelProps) {
  const [versions, setVersions] = useState<MeetingVersion[]>([]);
  const [loading, setLoading] = useState(false);
  const [comparing, setComparing] = useState<string | null>(null);

  useEffect(() => {
    if (open && meetingId) {
      fetchVersions();
    }
  }, [open, meetingId]);

  const fetchVersions = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/meetings/${meetingId}/versions`);
      setVersions(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed right-0 top-0 bottom-0 w-96 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 z-20 shadow-xl flex flex-col">
      <div className="h-14 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-indigo-600" />
          <h3 className="font-semibold text-sm">Version History</h3>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <ChevronLeft className="w-4 h-4 rotate-180" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          {loading ? (
            <div className="text-center text-slate-500 py-8">Loading versions...</div>
          ) : versions.length === 0 ? (
            <div className="text-center text-slate-500 py-8">No versions yet</div>
          ) : (
            <div className="space-y-4">
              {versions.map((version, index) => (
                <div
                  key={version.id}
                  className={`p-4 rounded-lg border transition-colors ${
                    comparing === version.id
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        v{version.version}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <Clock className="w-3 h-3" />
                        {format(new Date(version.created_at), 'MMM d, yyyy • HH:mm')}
                      </div>
                    </div>
                    {index > 0 && (
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => setComparing(comparing === version.id ? null : version.id)}
                          title="Compare"
                        >
                          <GitCompare className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => onRestore(version.id)}
                          title="Restore this version"
                        >
                          <RotateCcw className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 mb-2">
                    <User className="w-3 h-3" />
                    {version.creator.name}
                  </div>

                  {version.change_description && (
                    <p className="text-xs text-slate-700 dark:text-slate-300">
                      {version.change_description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>

      {comparing && (
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
          <p className="text-sm font-medium mb-2">Comparing with current version</p>
          <Button
            size="sm"
            className="w-full"
            onClick={() => setComparing(null)}
          >
            Close Comparison
          </Button>
        </div>
      )}
    </div>
  );
}
