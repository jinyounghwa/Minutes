'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  ChevronLeft, 
  MoreVertical, 
  Pencil, 
  Trash2, 
  Calendar,
  Users,
  Lock,
  FileText,
  Plus
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import api from '@/lib/api';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface Meeting {
  id: string;
  title: string;
  created_at: string;
  creator: { name: string };
  access_level: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  team?: { name: string };
  owner?: { name: string };
  default_access_level: string;
  created_at: string;
  updated_at: string;
  meetings: Meeting[];
}

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  // Edit State
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editProjectName, setEditProjectName] = useState('');
  const [editProjectDescription, setEditProjectDescription] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const res = await api.get(`/projects/${id}`);
      setProject(res.data);
      setEditProjectName(res.data.name);
      setEditProjectDescription(res.data.description || '');
    } catch (err) {
      console.error(err);
      router.push('/dashboard/projects');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProject = async () => {
    if (!project || !editProjectName) return;
    setSaving(true);
    try {
      await api.put(`/projects/${project.id}`, {
        name: editProjectName,
        description: editProjectDescription,
      });
      setShowEditDialog(false);
      fetchProject();
    } catch (err) {
      console.error(err);
      alert('프로젝트 수정에 실패했습니다');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!confirm('정말로 이 프로젝트를 삭제하시겠습니까? 연결된 회의록들의 프로젝트 할당이 해제될 수 있습니다.')) return;
    try {
      await api.delete(`/projects/${id}`);
      router.push('/dashboard/projects');
    } catch (err) {
      console.error(err);
      alert('프로젝트 삭제에 실패했습니다');
    }
  };

  const getAccessLevelName = (level: string) => {
    switch (level) {
      case 'public': return '공개';
      case 'team': return '팀';
      case 'private': return '비공개';
      default: return level;
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500">프로젝트 불러오는 중...</div>;
  }

  if (!project) return null;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard/projects')}>
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            {project.name}
            <Badge variant="outline" className="text-xs font-normal">
              {getAccessLevelName(project.default_access_level)}
            </Badge>
          </h1>
          <p className="text-slate-500 dark:text-slate-400">{project.description || '설명이 없습니다'}</p>
        </div>
        <div className="flex gap-2">
           <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={() => router.push('/dashboard/meetings/new')}>
              <Plus className="w-4 h-4 mr-2" />
              새 회의록
           </Button>
           <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                <Pencil className="w-4 h-4 mr-2" /> 프로젝트 수정
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={handleDeleteProject}>
                <Trash2 className="w-4 h-4 mr-2" /> 프로젝트 삭제
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Content: Meetings List */}
        <div className="md:col-span-2 space-y-6">
           <Card>
              <CardHeader>
                 <CardTitle>회의록</CardTitle>
                 <CardDescription>이 프로젝트에 연결된 문서</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                 <Table>
                    <TableHeader>
                       <TableRow>
                          <TableHead>제목</TableHead>
                          <TableHead>날짜</TableHead>
                          <TableHead>작성자</TableHead>
                       </TableRow>
                    </TableHeader>
                    <TableBody>
                       {project.meetings && project.meetings.length > 0 ? (
                          project.meetings.map((meeting) => (
                             <TableRow key={meeting.id} className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/50" onClick={() => router.push(`/dashboard/meetings/${meeting.id}`)}>
                                <TableCell className="font-medium text-indigo-600 dark:text-indigo-400">
                                   <FileText className="w-4 h-4 inline-block mr-2" />
                                   {meeting.title}
                                </TableCell>
                                <TableCell className="text-sm text-slate-500">
                                   {format(new Date(meeting.created_at), 'yyyy년 M월 d일', { locale: ko })}
                                </TableCell>
                                <TableCell className="text-sm">
                                   {meeting.creator?.name || '알 수 없음'}
                                </TableCell>
                             </TableRow>
                          ))
                       ) : (
                          <TableRow>
                             <TableCell colSpan={3} className="text-center py-8 text-slate-500">
                                이 프로젝트에 회의록이 없습니다.
                             </TableCell>
                          </TableRow>
                       )}
                    </TableBody>
                 </Table>
              </CardContent>
           </Card>
        </div>

        {/* Sidebar: Details */}
        <div className="space-y-6">
           <Card>
              <CardHeader>
                 <CardTitle className="text-base">프로젝트 상세</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="flex items-center gap-3 text-sm">
                    <Users className="w-4 h-4 text-slate-400" />
                    <div>
                       <p className="font-medium">팀</p>
                       <p className="text-slate-500">{project.team?.name || '지정된 팀 없음'}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-3 text-sm">
                    <Users className="w-4 h-4 text-slate-400" />
                    <div>
                       <p className="font-medium">소유자</p>
                       <p className="text-slate-500">{project.owner?.name || '알 수 없음'}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-3 text-sm">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <div>
                       <p className="font-medium">생성일</p>
                       <p className="text-slate-500">{format(new Date(project.created_at), 'yyyy년 M월 d일', { locale: ko })}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-3 text-sm">
                    <Lock className="w-4 h-4 text-slate-400" />
                    <div>
                       <p className="font-medium">기본 접근</p>
                       <p className="text-slate-500 capitalize">{getAccessLevelName(project.default_access_level)}</p>
                    </div>
                 </div>
              </CardContent>
           </Card>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>프로젝트 수정</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">프로젝트 이름</label>
              <Input
                value={editProjectName}
                onChange={(e) => setEditProjectName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">설명</label>
              <Input
                value={editProjectDescription}
                onChange={(e) => setEditProjectDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowEditDialog(false)}>
              취소
            </Button>
            <Button onClick={handleUpdateProject} disabled={saving || !editProjectName}>
              {saving ? '저장 중...' : '변경사항 저장'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
