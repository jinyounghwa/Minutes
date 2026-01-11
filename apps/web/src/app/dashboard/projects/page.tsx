'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Breadcrumbs from '@/components/dashboard/Breadcrumbs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Plus, 
  Search, 
  MoreVertical, 
  FolderOpen,
  Users,
  Calendar,
  Lock,
  Pencil,
  Trash2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import api from '@/lib/api';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface Project {
  id: string;
  name: string;
  description: string;
  team?: { name: string };
  owner?: { name: string };
  default_access_level: string;
  created_at: string;
  updated_at: string;
}

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Create Dialog State
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [creating, setCreating] = useState(false);

  // Edit Dialog State
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editProjectName, setEditProjectName] = useState('');
  const [editProjectDescription, setEditProjectDescription] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const lower = searchQuery.toLowerCase();
      setFilteredProjects(projects.filter(p => 
        p.name.toLowerCase().includes(lower) || 
        p.description?.toLowerCase().includes(lower)
      ));
    } else {
      setFilteredProjects(projects);
    }
  }, [searchQuery, projects]);

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data);
      setFilteredProjects(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async () => {
    if (!newProjectName) return;
    setCreating(true);
    try {
      await api.post('/projects', {
        name: newProjectName,
        description: newProjectDescription,
        default_access_level: 'team',
      });
      setNewProjectName('');
      setNewProjectDescription('');
      setShowCreateDialog(false);
      fetchProjects();
    } catch (err) {
      console.error(err);
      alert('프로젝트 생성에 실패했습니다');
    } finally {
      setCreating(false);
    }
  };

  const handleEditClick = (project: Project) => {
    setEditingProject(project);
    setEditProjectName(project.name);
    setEditProjectDescription(project.description || '');
    setShowEditDialog(true);
  };

  const handleUpdateProject = async () => {
    if (!editingProject || !editProjectName) return;
    setSaving(true);
    try {
      await api.put(`/projects/${editingProject.id}`, {
        name: editProjectName,
        description: editProjectDescription,
      });
      setShowEditDialog(false);
      fetchProjects();
    } catch (err) {
      console.error(err);
      alert('프로젝트 수정에 실패했습니다');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('정말로 이 프로젝트를 삭제하시겠습니까?')) return;
    try {
      await api.delete(`/projects/${id}`);
      fetchProjects();
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

  return (
    <div className="p-8">
      <Breadcrumbs />
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">프로젝트</h1>
          <p className="text-slate-500 dark:text-slate-400">팀의 프로젝트와 워크스페이스를 관리하세요</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              <Plus className="w-4 h-4 mr-2" />
              새 프로젝트
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>새 프로젝트 만들기</DialogTitle>
              <DialogDescription>
                회의록과 문서를 정리할 새 프로젝트를 설정하세요.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">프로젝트 이름</label>
                <Input
                  placeholder="Q4 전략 기획"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">설명 (선택사항)</label>
                <Input
                  placeholder="이 프로젝트는 무엇에 관한 것인가요?"
                  value={newProjectDescription}
                  onChange={(e) => setNewProjectDescription(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setShowCreateDialog(false)}>
                취소
              </Button>
              <Button onClick={handleCreateProject} disabled={creating || !newProjectName}>
                {creating ? '생성 중...' : '프로젝트 생성'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              className="w-full pl-9 pr-4 py-2 text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="프로젝트 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>프로젝트</TableHead>
              <TableHead>설명</TableHead>
              <TableHead>팀</TableHead>
              <TableHead>소유자</TableHead>
              <TableHead>접근</TableHead>
              <TableHead>최근 수정</TableHead>
              <TableHead className="text-right">작업</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-slate-500">프로젝트 불러오는 중...</TableCell>
              </TableRow>
            ) : filteredProjects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-slate-500">프로젝트를 찾을 수 없습니다.</TableCell>
              </TableRow>
            ) : (
              filteredProjects.map((project) => (
                <TableRow key={project.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 group">
                  <TableCell className="font-medium cursor-pointer" onClick={() => router.push(`/dashboard/projects/${project.id}`)}>
                    <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 transition-colors">
                      <FolderOpen className="w-4 h-4 text-indigo-500" />
                      {project.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-slate-500 max-w-xs truncate">
                    {project.description || '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400">
                      <Users className="w-4 h-4" />
                      {project.team?.name || '팀 없음'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                       <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold">
                          {project.owner?.name?.charAt(0)}
                       </div>
                       <span className="text-sm">{project.owner?.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="gap-1.5 font-normal capitalize">
                      <Lock className="w-3 h-3" />
                      {getAccessLevelName(project.default_access_level)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-500 text-sm">
                    {format(new Date(project.updated_at), 'yyyy년 M월 d일', { locale: ko })}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditClick(project)}>
                          <Pencil className="w-4 h-4 mr-2" /> 프로젝트 수정
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => handleDeleteProject(project.id)}>
                          <Trash2 className="w-4 h-4 mr-2" /> 프로젝트 삭제
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

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