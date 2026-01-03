import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Plus, Search, Edit, Trash2, Calendar, FileText } from 'lucide-react';
import { ContentRole } from '../types';
import { toast } from 'sonner';

export const HomeworkPage: React.FC = () => {
  const { contents, addContent, updateContent, deleteContent } = useData();
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    contentType: 'PDF',
    deadline: '',
  });

  // Filter only homework
  const homework = contents.filter(c => c.role === ContentRole.HOMEWORK);
  
  const filteredHomework = homework.filter(
    (hw) =>
      hw.name.toLowerCase().includes(search.toLowerCase()) ||
      (hw.description || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenDialog = (content?: any) => {
    if (content) {
      setEditingContent(content);
      setFormData({
        name: content.name,
        description: content.description || '',
        contentType: content.contentType,
        deadline: content.deadline ? new Date(content.deadline).toISOString().slice(0, 16) : '',
      });
    } else {
      setEditingContent(null);
      setFormData({
        name: '',
        description: '',
        contentType: 'PDF',
        deadline: '',
      });
    }
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingContent) {
      updateContent(editingContent.contentId, {
        ...formData,
        deadline: formData.deadline ? new Date(formData.deadline).toISOString() : undefined,
        updatedAt: new Date().toISOString(),
      });
      toast.success('Cập nhật bài tập về nhà thành công!');
    } else {
      addContent({
        ...formData,
        role: ContentRole.HOMEWORK,
        deadline: formData.deadline ? new Date(formData.deadline).toISOString() : undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      toast.success('Thêm bài tập về nhà thành công!');
    }
    
    setDialogOpen(false);
  };

  const handleDelete = (contentId: number, contentName: string) => {
    if (confirm(`Bạn có chắc muốn xóa bài tập về nhà "${contentName}"?`)) {
      deleteContent(contentId);
      toast.success('Xóa bài tập về nhà thành công!');
    }
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return 'Không có';
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const isOverdue = (deadline?: string) => {
    if (!deadline) return false;
    return new Date(deadline) < new Date();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl">Quản Lý Bài Tập Về Nhà</h1>
          <p className="text-gray-500 mt-1">Quản lý bài tập về nhà cho học sinh</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="size-4 mr-2" />
              Thêm bài tập về nhà
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingContent ? 'Chỉnh sửa bài tập về nhà' : 'Thêm bài tập về nhà mới'}
              </DialogTitle>
              <DialogDescription>
                {editingContent
                  ? 'Cập nhật thông tin bài tập về nhà'
                  : 'Điền thông tin để thêm bài tập về nhà mới'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Tên bài tập *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contentType">Loại nội dung</Label>
                  <Input
                    id="contentType"
                    value={formData.contentType}
                    onChange={(e) => setFormData({ ...formData, contentType: e.target.value })}
                    placeholder="PDF, DOCX, etc."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deadline">Hạn nộp</Label>
                  <Input
                    id="deadline"
                    type="datetime-local"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Hủy
                </Button>
                <Button type="submit">
                  {editingContent ? 'Cập nhật' : 'Thêm mới'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm bài tập về nhà..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Tên bài tập</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Hạn nộp</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHomework.map((hw) => (
                <TableRow key={hw.contentId}>
                  <TableCell>{hw.contentId}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FileText className="size-4 text-gray-400" />
                      <div>
                        <div>{hw.name}</div>
                        {hw.description && (
                          <div className="text-sm text-gray-500 mt-1">{hw.description}</div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{hw.contentType}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="size-4 text-gray-400" />
                      <div>
                        <div>{formatDateTime(hw.deadline)}</div>
                        {isOverdue(hw.deadline) && (
                          <Badge variant="destructive" className="mt-1">Quá hạn</Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenDialog(hw)}
                    >
                      <Edit className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(hw.contentId, hw.name)}
                    >
                      <Trash2 className="size-4 text-red-600" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
