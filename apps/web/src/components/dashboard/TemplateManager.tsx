'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  FileText,
  Plus,
  Edit,
  Trash2,
  Loader2,
  Copy
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card } from '@/components/ui/card';
import api from '@/lib/api';
import Editor from '@/components/editor/Editor';
import { JSONContent } from '@tiptap/react';

interface Template {
  id: string;
  name: string;
  content: JSONContent;
  is_default: boolean;
  creator?: { name: string };
}

interface TemplateManagerProps {
  open: boolean;
  onClose: () => void;
  onSelectTemplate?: (content: JSONContent) => void;
}

export default function TemplateManager({ open, onClose, onSelectTemplate }: TemplateManagerProps) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [templateName, setTemplateName] = useState('');
  const [templateContent, setTemplateContent] = useState<JSONContent | undefined>(undefined);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      fetchTemplates();
    }
  }, [open]);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const res = await api.get('/meetings/templates/all');
      setTemplates(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTemplate = async () => {
    if (!templateName) return;
    setSaving(true);
    try {
      await api.post('/meetings/templates', {
        name: templateName,
        content: templateContent,
        is_default: false,
      });
      setTemplateName('');
      setTemplateContent(undefined);
      setShowCreateDialog(false);
      fetchTemplates();
    } catch (err) {
      console.error(err);
      alert('템플릿 생성에 실패했습니다');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateTemplate = async () => {
    if (!editingTemplate || !templateName) return;
    setSaving(true);
    try {
      await api.put(`/meetings/templates/${editingTemplate.id}`, {
        name: templateName,
        content: templateContent,
      });
      setEditingTemplate(null);
      setTemplateName('');
      setTemplateContent(undefined);
      fetchTemplates();
    } catch (err) {
      console.error(err);
      alert('템플릿 수정에 실패했습니다');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    if (!confirm('정말로 이 템플릿을 삭제하시겠습니까?')) return;
    try {
      await api.delete(`/meetings/templates/${templateId}`);
      fetchTemplates();
    } catch (err) {
      console.error(err);
      alert('템플릿 삭제에 실패했습니다');
    }
  };

  const handleUseTemplate = (template: Template) => {
    if (onSelectTemplate) {
      onSelectTemplate(template.content);
      onClose();
    }
  };

  const openEditDialog = (template: Template) => {
    setEditingTemplate(template);
    setTemplateName(template.name);
    setTemplateContent(template.content);
    setShowCreateDialog(true);
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                회의 템플릿
              </DialogTitle>
              <DialogDescription>
                재사용 가능한 회의록 템플릿을 관리하세요
              </DialogDescription>
            </div>
            <Button size="sm" onClick={() => setShowCreateDialog(true)}>
              <Plus className="w-4 h-4 mr-1" /> 새 템플릿
            </Button>
          </div>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          </div>
        ) : templates.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 mb-2">아직 템플릿이 없습니다</p>
            <p className="text-sm text-slate-400">첫 번째 템플릿을 만들어 시작하세요!</p>
          </div>
        ) : (
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
            {templates.map((template) => (
              <Card key={template.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-sm">{template.name}</h3>
                      {template.is_default && <Badge variant="secondary">기본</Badge>}
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-900/50 rounded p-3 mb-3">
                      <div className="text-xs text-slate-500 line-clamp-2">
                        {JSON.stringify(template.content).slice(0, 100)}...
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1 ml-4">
                    {onSelectTemplate && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUseTemplate(template)}
                      >
                        <Copy className="w-4 h-4" /> 사용
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(template)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteTemplate(template.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Create/Edit Template Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>
                {editingTemplate ? '템플릿 수정' : '템플릿 만들기'}
              </DialogTitle>
              <DialogDescription>
                {editingTemplate ? '템플릿 내용을 수정하세요.' : '새 회의 템플릿을 만드세요.'}
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 flex flex-col min-h-0">
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">템플릿 이름</label>
                  <Input
                    placeholder="주간 스탠드업"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                  />
                </div>
                <div className="flex-1 min-h-[400px] border rounded-lg overflow-hidden">
                  <Editor
                    content={templateContent}
                    onChange={(json) => setTemplateContent(json)}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => {
                setShowCreateDialog(false);
                setEditingTemplate(null);
                setTemplateName('');
                setTemplateContent(undefined);
              }}>
                취소
              </Button>
              <Button onClick={editingTemplate ? handleUpdateTemplate : handleCreateTemplate} disabled={saving || !templateName}>
                {saving ? '저장 중...' : editingTemplate ? '수정' : '생성'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
}
