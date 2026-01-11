'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { Plus, FileText, Clock, MoreVertical } from 'lucide-react';
import api from '@/lib/api';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useAuthStore } from '@/store/authStore';

interface Meeting {
  id: string;
  title: string;
  created_at: string;
  access_level: string;
  content_text?: string;
}

export default function DashboardPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/meetings');
      setMeetings(res.data || []);
    } catch (err) {
      console.error('Failed to fetch meetings', err);
    } finally {
      setLoading(false);
    }
  };

  const getAccessLevelIcon = (level: string) => {
    switch (level) {
      case 'public':
        return '🔓';
      case 'team':
        return '🔒';
      case 'private':
        return '🔐';
      default:
        return '🔓';
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{user?.name}님, 환영합니다!</h1>
        <p className="text-slate-500 dark:text-slate-400">회의록을 관리하고 팀과 협업하세요</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Button
          className="h-20 bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center gap-3 text-lg"
          onClick={() => router.push('/dashboard/meetings/new')}
        >
          <Plus className="w-6 h-6" />
          <span>새 회의록</span>
        </Button>
        <Button
          variant="outline"
          className="h-20 flex items-center justify-center gap-3 text-lg"
          onClick={() => router.push('/dashboard/meetings')}
        >
          <FileText className="w-6 h-6" />
          <span>전체 회의록</span>
        </Button>
        <Button
          variant="outline"
          className="h-20 flex items-center justify-center gap-3 text-lg"
          onClick={() => router.push('/dashboard/trash')}
        >
          <Clock className="w-6 h-6" />
          <span>휴지통</span>
        </Button>
      </div>


      {/* Recent Meetings */}
      <div>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">최근 회의록</h2>
        {loading ? (
          <div className="text-center py-10 text-slate-500">
            <p>회의록 불러오는 중...</p>
          </div>
        ) : meetings.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 mb-4">아직 회의록이 없습니다</p>
              <Button
                className="bg-indigo-600 hover:bg-indigo-700 gap-2"
                onClick={() => router.push('/dashboard/meetings/new')}
              >
                <Plus className="w-4 h-4" />
                첫 번째 회의록 만들기
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {meetings.slice(0, 5).map((meeting) => (
              <Card
                key={meeting.id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => router.push(`/dashboard/meetings/${meeting.id}`)}
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <FileText className="w-5 h-5 text-indigo-600 mt-1 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900 dark:text-white truncate">
                        {meeting.title}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                        {meeting.content_text?.substring(0, 100) || '내용 없음'}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        {format(new Date(meeting.created_at), 'yyyy년 M월 d일', { locale: ko })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-lg">{getAccessLevelIcon(meeting.access_level)}</span>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {meetings.length > 5 && (
          <div className="mt-4 text-center">
            <Button
              variant="outline"
              onClick={() => router.push('/dashboard/meetings')}
            >
              전체 {meetings.length}개 회의록 보기
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
