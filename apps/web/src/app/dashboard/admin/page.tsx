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
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400">System overview and management</p>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-10">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Users</CardTitle>
            <Users className="w-4 h-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-green-500 flex items-center gap-1 mt-1">
               <ArrowUpRight className="w-3 h-3" /> +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Active Users</CardTitle>
            <Activity className="w-4 h-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeUsers}</div>
            <p className="text-xs text-slate-500 mt-1">77% of total base</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Meetings</CardTitle>
            <FileText className="w-4 h-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMeetings}</div>
            <p className="text-xs text-green-500 flex items-center gap-1 mt-1">
               <ArrowUpRight className="w-3 h-3" /> +5% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Attention Required</CardTitle>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-slate-500 mt-1">Trash/Access requests</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
         <Card>
            <CardHeader>
               <CardTitle>User Management</CardTitle>
               <CardDescription>Recent registrations and status</CardDescription>
            </CardHeader>
            <CardContent>
               <Table>
                  <TableHeader>
                     <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {[
                        { name: 'Jin Younghwa', role: 'Super Admin', status: 'Active' },
                        { name: 'Hong Gil-dong', role: 'Member', status: 'Active' },
                        { name: 'Kim Chul-su', role: 'Viewer', status: 'Inactive' },
                     ].map((u, i) => (
                        <TableRow key={i}>
                           <TableCell className="font-medium text-sm">{u.name}</TableCell>
                           <TableCell><Badge variant="secondary" className="font-normal">{u.role}</Badge></TableCell>
                           <TableCell>
                              <div className="flex items-center gap-2">
                                 <div className={`w-2 h-2 rounded-full ${u.status === 'Active' ? 'bg-green-500' : 'bg-slate-300'}`} />
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
               <CardTitle>Permission Matrix</CardTitle>
               <CardDescription>Role-based access control settings</CardDescription>
            </CardHeader>
            <CardContent>
               <div className="space-y-4">
                  {[
                     { feature: 'Create Meeting', super: true, admin: true, member: true, viewer: false },
                     { feature: 'Delete Meeting', super: true, admin: true, member: true, viewer: false },
                     { feature: 'User Management', super: true, admin: true, member: false, viewer: false },
                     { feature: 'System Settings', super: true, admin: false, member: false, viewer: false },
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
