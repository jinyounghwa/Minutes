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
  Search,
  MoreVertical,
  Unlock,
  Lock,
  ShieldAlert,
  ChevronDown,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import api from '@/lib/api';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface Meeting {
  id: string;
  title: string;
  project?: { name: string };
  creator?: { name: string };
  created_at: string;
  access_level: string;
}

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [allMeetings, setAllMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'title'>('date-desc');
  const [filterAccessLevel, setFilterAccessLevel] = useState<string | null>(null);

  useEffect(() => {
    fetchMeetings();
  }, []);

  useEffect(() => {
    // 검색 쿼리가 변경될 때마다 디바운싱 적용
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      if (searchQuery.trim()) {
        searchMeetings(searchQuery);
      } else {
        fetchMeetings();
      }
    }, 300);

    setSearchTimeout(timeout);

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [searchQuery]);

  useEffect(() => {
    // 필터/정렬이 변경될 때 재적용
    applyFiltersAndSort(allMeetings);
  }, [sortBy, filterAccessLevel]);

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/meetings');
      setAllMeetings(res.data);
      applyFiltersAndSort(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const searchMeetings = async (query: string) => {
    try {
      setLoading(true);
      const res = await api.get('/meetings/search', { params: { q: query } });
      setAllMeetings(res.data);
      applyFiltersAndSort(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = (data: Meeting[]) => {
    let filtered = [...data];

    // 접근 수준으로 필터링
    if (filterAccessLevel) {
      filtered = filtered.filter(m => m.access_level === filterAccessLevel);
    }

    // 정렬
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-asc':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'date-desc':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'title':
          return a.title.localeCompare(b.title, 'ko');
        default:
          return 0;
      }
    });

    setMeetings(filtered);
  };

  const getStatusIcon = (level: string) => {
    switch (level) {
      case 'public': return <Unlock className="w-3 h-3" />;
      case 'team': return <Lock className="w-3 h-3" />;
      case 'private': return <ShieldAlert className="w-3 h-3" />;
      default: return <Unlock className="w-3 h-3" />;
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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">회의록</h1>
          <p className="text-slate-500 dark:text-slate-400">모든 회의록을 관리하고 확인하세요</p>
        </div>
        <Link href="/dashboard/meetings/new">
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="w-4 h-4 mr-2" />
            새 회의록
          </Button>
        </Link>
      </div>

      <Card className="overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="회의록 검색..."
            />
          </div>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  필터 {filterAccessLevel && `(${filterAccessLevel})`}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setFilterAccessLevel(null)}>
                  모두 보기
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterAccessLevel('public')}>
                  공개
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterAccessLevel('team')}>
                  팀
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterAccessLevel('private')}>
                  비공개
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  정렬
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSortBy('date-desc')}>
                  최신순 {sortBy === 'date-desc' && '✓'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('date-asc')}>
                  오래된순 {sortBy === 'date-asc' && '✓'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('title')}>
                  제목순 {sortBy === 'title' && '✓'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>제목</TableHead>
              <TableHead>프로젝트</TableHead>
              <TableHead>작성자</TableHead>
              <TableHead>날짜</TableHead>
              <TableHead>접근</TableHead>
              <TableHead className="text-right">작업</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-slate-500">회의록 불러오는 중...</TableCell>
              </TableRow>
            ) : meetings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-slate-500">회의록이 없습니다. 첫 번째 회의록을 만들어 보세요!</TableCell>
              </TableRow>
            ) : (
              meetings.map((meeting) => (
                <TableRow key={meeting.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 cursor-pointer">
                  <TableCell className="font-medium">
                    <Link href={`/dashboard/meetings/${meeting.id}`} className="hover:text-indigo-600">
                       {meeting.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-normal">
                      {meeting.project?.name || '일반'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                       <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold">
                          {meeting.creator?.name?.charAt(0)}
                       </div>
                       <span className="text-sm">{meeting.creator?.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-500 text-sm">
                    {format(new Date(meeting.created_at), 'yyyy년 M월 d일', { locale: ko })}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="gap-1.5 font-normal capitalize">
                      {getStatusIcon(meeting.access_level)}
                      {getAccessLevelName(meeting.access_level)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
