'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { Plus, FileText, Clock, Lock, MoreVertical, Unlock, ShieldAlert } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
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

interface Statistics {
  totalMeetings: number;
  recentMeetings: number;
  byAccessLevel: {
    public: number;
    team: number;
    private: number;
  };
  topProjects: Array<{ id: string; name: string; count: number }>;
  dailyStats: Array<{ date: string; count: number }>;
}

export default function DashboardPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // 회의록 데이터 (필수)
      const meetingsRes = await api.get('/meetings');
      setMeetings(meetingsRes.data || []);

      // 통계 데이터 (선택)
      try {
        const statsRes = await api.get('/meetings/stats/overview');
        setStatistics(statsRes.data);
      } catch (statsErr) {
        console.warn('Failed to fetch statistics', statsErr);
        // 통계 로드 실패해도 대시보드는 계속 표시
        setStatistics(null);
      }
    } catch (err) {
      console.error('Failed to fetch meetings data', err);
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

      {/* Statistics Cards */}
      {statistics && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">통계</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">전체 회의록</p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                      {statistics.totalMeetings}
                    </p>
                  </div>
                  <FileText className="w-12 h-12 text-indigo-600 opacity-20" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">공개</p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                      {statistics.byAccessLevel.public}
                    </p>
                  </div>
                  <Unlock className="w-12 h-12 text-green-600 opacity-20" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">팀</p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                      {statistics.byAccessLevel.team}
                    </p>
                  </div>
                  <Lock className="w-12 h-12 text-blue-600 opacity-20" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">비공개</p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                      {statistics.byAccessLevel.private}
                    </p>
                  </div>
                  <ShieldAlert className="w-12 h-12 text-red-600 opacity-20" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Projects */}
          {statistics.topProjects.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">상위 프로젝트</h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                {statistics.topProjects.map((project) => (
                  <Card key={project.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
                        {project.name}
                      </p>
                      <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-2">
                        {project.count}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Access Level Distribution Chart */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">접근 수준 분포</h3>
            <Card>
              <CardContent className="p-6">
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: '공개', value: statistics.byAccessLevel.public, fill: '#10b981' },
                          { name: '팀', value: statistics.byAccessLevel.team, fill: '#3b82f6' },
                          { name: '비공개', value: statistics.byAccessLevel.private, fill: '#ef4444' },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }: any) => `${name}: ${value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        <Cell fill="#10b981" />
                        <Cell fill="#3b82f6" />
                        <Cell fill="#ef4444" />
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Daily Stats Chart */}
          {statistics.dailyStats.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">최근 7일 회의록 추세</h3>
              <Card>
                <CardContent className="p-6">
                  <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={statistics.dailyStats.map((stat) => ({
                        ...stat,
                        date: new Date(stat.date).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }),
                      }))}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#6366f1" name="회의록 수" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}

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
