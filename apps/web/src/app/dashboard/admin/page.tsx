'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Users, 
  FileText, 
  Settings, 
  ShieldCheck, 
  Activity,
  AlertTriangle,
  ArrowUpRight
} from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default function AdminDashboardPage() {
  const [stats] = useState({
    totalUsers: 127,
    activeUsers: 98,
    totalMeetings: 1432,
    newMeetingsThisWeek: 45
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">관리자 대시보드</h1>
        <p className="text-slate-500 dark:text-slate-400">시스템 개요 및 관리</p>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-10">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">전체 사용자</CardTitle>
            <Users className="w-4 h-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-green-500 flex items-center gap-1 mt-1">
               <ArrowUpRight className="w-3 h-3" /> 지난달 대비 +12%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">활성 사용자</CardTitle>
            <Activity className="w-4 h-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeUsers}</div>
            <p className="text-xs text-slate-500 mt-1">전체의 77%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">전체 회의록</CardTitle>
            <FileText className="w-4 h-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMeetings}</div>
            <p className="text-xs text-green-500 flex items-center gap-1 mt-1">
               <ArrowUpRight className="w-3 h-3" /> 지난달 대비 +5%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">주의 필요</CardTitle>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-slate-500 mt-1">휴지통/접근 요청</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
         <Card>
            <CardHeader>
               <CardTitle>사용자 관리</CardTitle>
               <CardDescription>최근 가입 및 상태</CardDescription>
            </CardHeader>
            <CardContent>
               <Table>
                  <TableHeader>
                     <TableRow>
                        <TableHead>사용자</TableHead>
                        <TableHead>역할</TableHead>
                        <TableHead>상태</TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {[
                        { name: '진영화', role: '최고 관리자', status: '활성' },
                        { name: '홍길동', role: '멤버', status: '활성' },
                        { name: '김철수', role: '뷰어', status: '비활성' },
                     ].map((u, i) => (
                        <TableRow key={i}>
                           <TableCell className="font-medium text-sm">{u.name}</TableCell>
                           <TableCell><Badge variant="secondary" className="font-normal">{u.role}</Badge></TableCell>
                           <TableCell>
                              <div className="flex items-center gap-2">
                                 <div className={`w-2 h-2 rounded-full ${u.status === '활성' ? 'bg-green-500' : 'bg-slate-300'}`} />
                                 <span className="text-xs">{u.status}</span>
                              </div>
                           </TableCell>
                        </TableRow>
                     ))}
                  </TableBody>
               </Table>
            </CardContent>
         </Card>

         <Card>
            <CardHeader>
               <CardTitle>권한 매트릭스</CardTitle>
               <CardDescription>역할 기반 접근 제어 설정</CardDescription>
            </CardHeader>
            <CardContent>
               <div className="space-y-4">
                  {[
                     { feature: '회의록 생성', super: true, admin: true, member: true, viewer: false },
                     { feature: '회의록 삭제', super: true, admin: true, member: true, viewer: false },
                     { feature: '사용자 관리', super: true, admin: true, member: false, viewer: false },
                     { feature: '시스템 설정', super: true, admin: false, member: false, viewer: false },
                  ].map((p, i) => (
                     <div key={i} className="flex items-center justify-between p-2 rounded hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <span className="text-sm font-medium">{p.feature}</span>
                        <div className="flex gap-1">
                           <Badge variant={p.super ? 'default' : 'outline'} className="text-[10px]">S</Badge>
                           <Badge variant={p.admin ? 'default' : 'outline'} className="text-[10px]">A</Badge>
                           <Badge variant={p.member ? 'default' : 'outline'} className="text-[10px]">M</Badge>
                           <Badge variant={p.viewer ? 'default' : 'outline'} className="text-[10px]">V</Badge>
                        </div>
                     </div>
                  ))}
               </div>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}
