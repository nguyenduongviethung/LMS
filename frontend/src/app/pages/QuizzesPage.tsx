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

export const QuizzesPage: React.FC = () => {
  const { contents, addContent, updateContent, deleteContent } = useData();
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    contentType: 'PDF',
    deadline: '',
    cutoffScore: 0,
  });

  // Filter only quizzes
  const quizzes = contents.filter(c => c.role === ContentRole.QUIZ);
  
  const filteredQuizzes = quizzes.filter(
    (quiz) =>
      quiz.name.toLowerCase().includes(search.toLowerCase()) ||
      (quiz.description || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenDialog = (content?: any) => {
    if (content) {
      setEditingContent(content);
      setFormData({
        name: content.name,
        description: content.description || '',
        contentType: content.contentType,
        deadline: content.deadline ? new Date(content.deadline).toISOString().slice(0, 16) : '',
        cutoffScore: content.cutoffScore || 0,
      });
    } else {
      setEditingContent(null);
      setFormData({
        name: '',
        description: '',
        contentType: 'PDF',
        deadline: '',
        cutoffScore: 0,
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
      toast.success('Cập nhật bài kiểm tra thành công!');
    } else {
      addContent({
        ...formData,
        role: ContentRole.QUIZ,
        deadline: formData.deadline ? new Date(formData.deadline).toISOString() : undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      toast.success('Thêm bài kiểm tra thành công!');
    }
    
    setDialogOpen(false);
  };

  const handleDelete = (contentId: number, contentName: string) => {
    if (confirm(`Bạn có chắc muốn xóa bài kiểm tra "${contentName}"?`)) {
      deleteContent(contentId);
      toast.success('Xóa bài kiểm tra thành công!');
    }
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return 'Không có';
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const isUpcoming = (deadline?: string) => {
    if (!deadline) return false;
    const date = new Date(deadline);
    const now = new Date();
    return date > now && date.getTime() - now.getTime() < 7 * 24 * 60 * 60 * 1000; // Within 7 days
  };

  const isPast = (deadline?: string) => {
    if (!deadline) return false;
    return new Date(deadline) < new Date();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl">Quản Lý Bài Kiểm Tra</h1>
          <p className="text-gray-500 mt-1">Quản lý bài kiểm tra và đánh giá</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="size-4 mr-2" />
              Thêm bài kiểm tra
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingContent ? 'Chỉnh sửa bài kiểm tra' : 'Thêm bài kiểm tra mới'}
              </DialogTitle>
              <DialogDescription>
                {editingContent
                  ? 'Cập nhật thông tin bài kiểm tra'
                  : 'Điền thông tin để thêm bài kiểm tra mới'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Tên bài kiểm tra *</Label>
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
                    placeholder="PDF, Online, etc."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cutoffScore">Điểm đạt</Label>
                  <Input
                    id="cutoffScore"
                    type="number"
                    step="0.1"
                    value={formData.cutoffScore}
                    onChange={(e) => setFormData({ ...formData, cutoffScore: parseFloat(e.target.value) })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="deadline">Thời gian thi</Label>
                <Input
                  id="deadline"
                  type="datetime-local"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                />
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
                placeholder="Tìm kiếm bài kiểm tra..."
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
                <TableHead>Tên bài kiểm tra</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Thời gian</TableHead>
                <TableHead>Điểm đạt</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredQuizzes.map((quiz) => (
                <TableRow key={quiz.contentId}>
                  <TableCell>{quiz.contentId}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FileText className="size-4 text-gray-400" />
                      <div>
                        <div>{quiz.name}</div>
                        {quiz.description && (
                          <div className="text-sm text-gray-500 mt-1">{quiz.description}</div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{quiz.contentType}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="size-4 text-gray-400" />
                      <div>
                        <div>{formatDateTime(quiz.deadline)}</div>
                        {isUpcoming(quiz.deadline) && (
                          <Badge variant="default" className="mt-1">Sắp tới</Badge>
                        )}
                        {isPast(quiz.deadline) && (
                          <Badge variant="secondary" className="mt-1">Đã qua</Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{quiz.cutoffScore || '-'}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenDialog(quiz)}
                    >
                      <Edit className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(quiz.contentId, quiz.name)}
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
