'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  CheckSquare, 
  Plus, 
  Calendar, 
  User,
  Trash2,
  Check,
  MoreVertical
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import api from '@/lib/api';
import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';

interface Assignee {
  id: string;
  name: string;
}

interface ActionItem {
  id: string;
  meeting_id: string;
  description: string;
  due_date: string | null;
  completed: boolean;
  completed_at: string | null;
  assignee?: Assignee;
}

interface ActionItemsProps {
  meetingId: string;
}

export default function ActionItems({ meetingId }: ActionItemsProps) {
  const [items, setItems] = useState<ActionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newDescription, setNewDescription] = useState('');
  const [newDueDate, setNewDueDate] = useState('');

  useEffect(() => {
    if (meetingId) {
      fetchItems();
    }
  }, [meetingId]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/meetings/${meetingId}/action-items`);
      setItems(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newDescription) return;
    try {
      await api.post(`/meetings/${meetingId}/action-items`, {
        description: newDescription,
        due_date: newDueDate || null,
        completed: false,
      });
      setNewDescription('');
      setNewDueDate('');
      setShowCreateDialog(false);
      fetchItems();
    } catch (err) {
      console.error(err);
      alert('액션 아이템 생성에 실패했습니다');
    }
  };

  const handleToggleComplete = async (itemId: string, completed: boolean) => {
    try {
      await api.put(`/action-items/${itemId}`, {
        completed: !completed,
        completed_at: !completed ? new Date().toISOString() : null,
      });
      fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (itemId: string) => {
    try {
      await api.delete(`/action-items/${itemId}`);
      fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CheckSquare className="w-5 h-5 text-indigo-600" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">액션 아이템</h3>
          <Badge variant="secondary">{items.filter(i => !i.completed).length}개 대기</Badge>
        </div>
        <Button size="sm" variant="outline" onClick={() => setShowCreateDialog(true)}>
          <Plus className="w-4 h-4 mr-1" /> 항목 추가
        </Button>
      </div>

      <div className="space-y-2">
        {loading ? (
          <div className="text-center text-slate-500 py-4">액션 아이템 불러오는 중...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
            <CheckSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-slate-500">아직 액션 아이템이 없습니다</p>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-lg border transition-all ${
                item.completed
                  ? 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 opacity-60'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => handleToggleComplete(item.id, item.completed)}
                  className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                    item.completed
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'border-slate-300 hover:border-indigo-500 dark:border-slate-600'
                  }`}
                >
                  {item.completed && <Check className="w-3 h-3" />}
                </button>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${item.completed ? 'line-through text-slate-500' : 'text-slate-900 dark:text-white'}`}>
                    {item.description}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    {item.due_date && (
                      <div className={`flex items-center gap-1 text-xs ${
                        new Date(item.due_date) < new Date() && !item.completed
                          ? 'text-red-500'
                          : 'text-slate-500'
                      }`}>
                        <Calendar className="w-3 h-3" />
                        {format(parseISO(item.due_date), 'yyyy년 M월 d일', { locale: ko })}
                      </div>
                    )}
                    {item.assignee && (
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <User className="w-3 h-3" />
                        {item.assignee.name}
                      </div>
                    )}
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>수정</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-500" onClick={() => handleDelete(item.id)}>
                      <Trash2 className="w-4 h-4 mr-2" /> 삭제
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))
        )}
      </div>

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>액션 아이템 추가</DialogTitle>
            <DialogDescription>
              이 회의에 대한 새 작업 또는 액션 아이템을 생성하세요.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">설명</label>
              <Input
                placeholder="무엇을 해야 하나요?"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">마감일 (선택사항)</label>
              <Input
                type="date"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowCreateDialog(false)}>
              취소
            </Button>
            <Button onClick={handleCreate} disabled={!newDescription}>
              항목 추가
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
