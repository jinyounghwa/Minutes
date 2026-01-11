'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
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
  MoreVertical, 
  Users,
  UserPlus,
  Shield,
  Calendar,
  X,
  Trash2,
  Settings,
  Search,
  Loader2
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
import api from '@/lib/api';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TeamMember {
  id: string;
  user: { id: string; name: string };
  role: string;
}

interface Team {
  id: string;
  name: string;
  description: string;
  leader?: { name: string };
  members?: TeamMember[];
  created_at: string;
  updated_at: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Create Team State
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamDescription, setNewTeamDescription] = useState('');
  const [creating, setCreating] = useState(false);

  // Add Member State
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [memberSearchQuery, setMemberSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    fetchTeams();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (memberSearchQuery) {
        handleSearchUsers();
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [memberSearchQuery]);

  const fetchTeams = async () => {
    try {
      const res = await api.get('/teams');
      setTeams(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async () => {
    if (!newTeamName) return;
    setCreating(true);
    try {
      await api.post('/teams', {
        name: newTeamName,
        description: newTeamDescription,
      });
      setNewTeamName('');
      setNewTeamDescription('');
      setShowCreateDialog(false);
      fetchTeams();
    } catch (err) {
      console.error(err);
      alert('팀 생성에 실패했습니다');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteTeam = async (id: string) => {
    if (!confirm('정말로 이 팀을 삭제하시겠습니까?')) return;
    try {
      await api.delete(`/teams/${id}`);
      fetchTeams();
    } catch (err) {
      console.error(err);
      alert('팀 삭제에 실패했습니다');
    }
  };

  const handleSearchUsers = async () => {
    setSearching(true);
    try {
      const res = await api.get(`/users/search?q=${memberSearchQuery}`);
      setSearchResults(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setSearching(false);
    }
  };

  const handleAddMember = async (userId: string) => {
    if (!selectedTeamId) return;
    try {
      await api.post(`/teams/${selectedTeamId}/members`, {
        user_id: userId,
        role: 'member'
      });
      setShowAddMemberDialog(false);
      setMemberSearchQuery('');
      setSearchResults([]);
      fetchTeams();
    } catch (err) {
      console.error(err);
      alert('멤버 추가에 실패했습니다');
    }
  };

  const handleRemoveMember = async (teamId: string, userId: string) => {
    if (!confirm('이 멤버를 팀에서 제거하시겠습니까?')) return;
    try {
      await api.delete(`/teams/${teamId}/members/${userId}`);
      fetchTeams();
    } catch (err) {
      console.error(err);
      alert('멤버 제거에 실패했습니다');
    }
  };

  const openAddMemberDialog = (teamId: string) => {
    setSelectedTeamId(teamId);
    setShowAddMemberDialog(true);
  };

  const getRoleName = (role: string) => {
    switch (role) {
      case 'leader': return '리더';
      case 'member': return '멤버';
      case 'viewer': return '뷰어';
      default: return role;
    }
  };

  return (
    <div className="p-8">
      <Breadcrumbs />
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">팀</h1>
          <p className="text-slate-500 dark:text-slate-400">팀과 멤버를 관리하세요</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              <Plus className="w-4 h-4 mr-2" />
              새 팀
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>새 팀 만들기</DialogTitle>
              <DialogDescription>
                프로젝트와 회의록을 함께 협업할 새 팀을 설정하세요.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">팀 이름</label>
                <Input
                  placeholder="개발팀"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">설명 (선택사항)</label>
                <Input
                  placeholder="이 팀은 무엇을 담당하나요?"
                  value={newTeamDescription}
                  onChange={(e) => setNewTeamDescription(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setShowCreateDialog(false)}>
                취소
              </Button>
              <Button onClick={handleCreateTeam} disabled={creating || !newTeamName}>
                {creating ? '생성 중...' : '팀 생성'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {loading ? (
          <Card className="p-8 text-center">
            <p className="text-slate-500">팀 불러오는 중...</p>
          </Card>
        ) : teams.length === 0 ? (
          <Card className="p-8 text-center">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 mb-2">팀이 없습니다.</p>
            <p className="text-sm text-slate-400">첫 번째 팀을 만들어 시작하세요!</p>
          </Card>
        ) : (
          teams.map((team) => (
            <Card key={team.id}>
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                        <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{team.name}</h3>
                        <p className="text-sm text-slate-500">{team.description || '설명 없음'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-4 text-sm text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Shield className="w-4 h-4" />
                        리더: {team.leader?.name || '미지정'}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="w-4 h-4" />
                        {team.members?.length || 0}명의 멤버
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        {format(new Date(team.created_at), 'yyyy년 M월 d일', { locale: ko })}
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="gap-2" onClick={() => openAddMemberDialog(team.id)}>
                        <UserPlus className="w-4 h-4" /> 멤버 추가
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2">
                        <Settings className="w-4 h-4" /> 설정
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-500 gap-2" onClick={() => handleDeleteTeam(team.id)}>
                        <Trash2 className="w-4 h-4" /> 팀 삭제
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {team.members && team.members.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                    <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-3">팀 멤버</h4>
                    <div className="flex flex-wrap gap-2">
                      {team.members.map((member) => (
                        <Badge key={member.id} variant="secondary" className="gap-1.5 pl-2 pr-1 py-1">
                          {member.user.name}
                          <span className="text-xs text-slate-500 border-l border-slate-300 dark:border-slate-600 pl-1 ml-1">{getRoleName(member.role)}</span>
                          <button 
                            className="hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full p-0.5 ml-1"
                            onClick={() => handleRemoveMember(team.id, member.user.id)}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Add Member Dialog */}
      <Dialog open={showAddMemberDialog} onOpenChange={setShowAddMemberDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>팀 멤버 추가</DialogTitle>
            <DialogDescription>이 팀에 추가할 사용자를 검색하세요.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  className="pl-9" 
                  placeholder="이름 또는 이메일로 검색..." 
                  value={memberSearchQuery}
                  onChange={(e) => setMemberSearchQuery(e.target.value)}
                />
             </div>
             
             <div className="border rounded-md min-h-[100px] max-h-[200px] overflow-y-auto p-2 space-y-1">
                {searching ? (
                   <div className="flex items-center justify-center h-full text-slate-500 gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> 검색 중...
                   </div>
                ) : searchResults.length > 0 ? (
                   searchResults.map((user) => (
                      <div 
                        key={user.id} 
                        className="flex items-center justify-between p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md cursor-pointer"
                        onClick={() => handleAddMember(user.id)}
                      >
                         <div className="flex flex-col">
                            <span className="font-medium text-sm">{user.name}</span>
                            <span className="text-xs text-slate-500">{user.email}</span>
                         </div>
                         <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                            <Plus className="w-4 h-4" />
                         </Button>
                      </div>
                   ))
                ) : memberSearchQuery ? (
                   <div className="text-center py-4 text-slate-500 text-sm">사용자를 찾을 수 없습니다.</div>
                ) : (
                   <div className="text-center py-4 text-slate-400 text-sm">검색어를 입력하세요</div>
                )}
             </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}