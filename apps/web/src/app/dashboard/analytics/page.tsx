'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Unlock, Lock, ShieldAlert } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import api from '@/lib/api';
import Breadcrumbs from '@/components/dashboard/Breadcrumbs';

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

export default function AnalyticsPage() {
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const res = await api.get('/meetings/stats/overview');
      setStatistics(res.data);
    } catch (err) {
      console.error('Failed to fetch statistics', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <Breadcrumbs />
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">분석</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">회의록 통계 및 분석</p>
      </div>

      {loading ? (
        <div className="text-center py-10 text-slate-500">
          <p>데이터를 불러오는 중...</p>
        </div>
      ) : statistics ? (
        <div className="space-y-8">
          {/* KPI Cards */}
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">핵심 지표</h2>
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
          </div>

          {/* Top Projects */}
          {statistics.topProjects.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">상위 프로젝트</h2>
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
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">접근 수준 분포</h2>
            <Card>
              <CardContent className="p-6">
                <div style={{ width: '100%', height: 400 }}>
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
                        outerRadius={100}
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
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">최근 7일 회의록 추세</h2>
              <Card>
                <CardContent className="p-6">
                  <div style={{ width: '100%', height: 400 }}>
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
      ) : (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-slate-500">통계 데이터를 불러올 수 없습니다.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
