'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  RotateCcw, 
  Trash2,
  Calendar,
  AlertCircle
} from 'lucide-react';
import api from '@/lib/api';
import { format, differenceInDays, addDays } from 'date-fns';
import { ko } from 'date-fns/locale';

export default function TrashPage() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrash();
  }, []);

  const fetchTrash = async () => {
    try {
      const res = await api.get('/meetings/trash');
      setMeetings(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (id: string) => {
    try {
      await api.post(`/meetings/${id}/restore`);
      fetchTrash();
    } catch (err) {
      console.error(err);
    }
  };

  const handlePermanentDelete = async (id: string) => {
    if (!confirm('정말로 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) return;
    try {
      await api.delete(`/meetings/${id}/permanent`);
      fetchTrash();
    } catch (err) {
      console.error(err);
    }
  };

  const getRemainingDays = (deletedAt: string) => {
    const expirationDate = addDays(new Date(deletedAt), 30);
    const daysLeft = differenceInDays(expirationDate, new Date());
    return Math.max(0, daysLeft);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">휴지통</h1>
        <p className="text-slate-500 dark:text-slate-400">이곳의 문서는 30일 후 영구 삭제됩니다</p>
      </div>

      <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 p-4 rounded-lg flex items-start gap-3 mb-6">
         <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-500 mt-0.5" />
         <div className="text-sm">
            <p className="font-semibold text-amber-900 dark:text-amber-400">30일 복구 기간</p>
            <p className="text-amber-700 dark:text-amber-500">이 목록의 모든 회의록을 복구할 수 있습니다. 30일이 지나면 파일은 영구적으로 삭제됩니다.</p>
         </div>
      </div>

      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>제목</TableHead>
              <TableHead>삭제 날짜</TableHead>
              <TableHead>남은 일수</TableHead>
              <TableHead className="text-right">작업</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10 text-slate-500">휴지통 불러오는 중...</TableCell>
              </TableRow>
            ) : meetings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10 text-slate-500">휴지통이 비어있습니다. 삭제된 문서가 없습니다.</TableCell>
              </TableRow>
            ) : (
              meetings.map((meeting: any) => (
                <TableRow key={meeting.id}>
                  <TableCell className="font-medium text-slate-400 italic">
                    {meeting.title}
                  </TableCell>
                  <TableCell className="text-slate-500 text-sm">
                    {format(new Date(meeting.deleted_at), 'yyyy년 M월 d일', { locale: ko })}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                       <span className={`text-sm font-semibold ${getRemainingDays(meeting.deleted_at) < 5 ? 'text-red-500' : 'text-slate-700 dark:text-slate-300'}`}>
                          {getRemainingDays(meeting.deleted_at)}일
                       </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                       <Button variant="ghost" size="sm" className="gap-2" onClick={() => handleRestore(meeting.id)}>
                          <RotateCcw className="w-4 h-4" /> 복구
                       </Button>
                       <Button variant="ghost" size="sm" className="gap-2 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handlePermanentDelete(meeting.id)}>
                          <Trash2 className="w-4 h-4" /> 영구 삭제
                       </Button>
                    </div>
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
