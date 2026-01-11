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
      alert('Failed to create template');
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
      alert('Failed to update template');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return;
    try {
      await api.delete(`/meetings/templates/${templateId}`);
      fetchTemplates();
    } catch (err) {
      console.error(err);
      alert('Failed to delete template');
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
                Meeting Templates
              </DialogTitle>
              <DialogDescription>
                Manage reusable meeting note templates
              </DialogDescription>
            </div>
            <Button size="sm" onClick={() => setShowCreateDialog(true)}>
              <Plus className="w-4 h-4 mr-1" /> New Template
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
            <p className="text-slate-500 mb-2">No templates yet</p>
            <p className="text-sm text-slate-400">Create your first template to get started!</p>
          </div>
        ) : (
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
            {templates.map((template) => (
              <Card key={template.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-sm">{template.name}</h3>
                      {template.is_default && <Badge variant="secondary">Default</Badge>}
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
                        <Copy className="w-4 h-4" /> Use
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
                {editingTemplate ? 'Edit Template' : 'Create Template'}
              </DialogTitle>
              <DialogDescription>
                {editingTemplate ? 'Update your template content.' : 'Create a new meeting template.'}
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 flex flex-col min-h-0">
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Template Name</label>
                  <Input
                    placeholder="Weekly Standup"
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
                Cancel
              </Button>
              <Button onClick={editingTemplate ? handleUpdateTemplate : handleCreateTemplate} disabled={saving || !templateName}>
                {saving ? 'Saving...' : editingTemplate ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
}
