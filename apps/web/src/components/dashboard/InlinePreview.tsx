'use client';

import { useState, useEffect } from 'react';
import { 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  FileText,
  Calendar,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import api from '@/lib/api';
import { format, parseISO } from 'date-fns';

interface Meeting {
  id: string;
  title: string;
  content_text: string;
  created_at: string;
  creator?: { name: string };
}

interface InlinePreviewProps {
  meetingId: string;
  onClose: () => void;
}

export default function InlinePreview({ meetingId, onClose }: InlinePreviewProps) {
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    fetchMeeting();
  }, [meetingId]);

  const fetchMeeting = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/meetings/${meetingId}`);
      setMeeting(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-800">
        <div className="animate-pulse">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full mb-1"></div>
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (!meeting) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-200 dark:border-red-900">
        <p className="text-sm text-red-600 dark:text-red-400">Failed to load meeting preview</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-indigo-600 flex-shrink-0" />
            <h4 className="font-semibold text-sm text-slate-900 dark:text-white truncate">
              {meeting.title}
            </h4>
          </div>
          
          <div className="flex items-center gap-3 text-xs text-slate-500 mb-2">
            <div className="flex items-center gap-1">
              <User className="w-3 h-3" />
              {meeting.creator?.name}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {format(parseISO(meeting.created_at), 'MMM d, yyyy')}
            </div>
          </div>

          {expanded && meeting.content_text && (
            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-4">
                {meeting.content_text}
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={onClose}
          >
            ×
          </Button>
        </div>
      </div>
    </div>
  );
}
