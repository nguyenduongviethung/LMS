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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { Plus, Search, Edit, Trash2, Calendar } from 'lucide-react';
import { toast } from 'sonner';

export const SessionsPage: React.FC = () => {
  const { sessions, classes, addSession, updateSession, deleteSession, templateSessions } = useData();
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<any>(null);
  const [formData, setFormData] = useState({
    classId: 0,
    templateSessionId: undefined as number | undefined,
    name: '',
    description: '',
    content: '',
    fileUrl: '',
    startTime: '',
    duration: 120,
  });

  const filteredSessions = sessions.filter(
    (session) =>
      session.name.toLowerCase().includes(search.toLowerCase()) ||
      classes.find(c => c.classId === session.classId)?.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenDialog = (session?: any) => {
    if (session) {
      setEditingSession(session);
      setFormData({
        classId: session.classId,
        templateSessionId: session.templateSessionId,
        name: session.name,
        description: session.description || '',
        content: session.content || '',
        fileUrl: session.fileUrl || '',
        startTime: session.startTime ? new Date(session.startTime).toISOString().slice(0, 16) : '',
        duration: session.duration || 120,
      });
    } else {
      setEditingSession(null);
      setFormData({
        classId: classes[0]?.classId || 0,
        templateSessionId: undefined,
        name: '',
        description: '',
        content: '',
        fileUrl: '',
        startTime: '',
        duration: 120,
      });
    }
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingSession) {
      updateSession(editingSession.sessionId, {
        ...formData,
        startTime: formData.startTime ? new Date(formData.startTime).toISOString() : undefined,
        updatedAt: new Date().toISOString(),
      });
      toast.success('Cập nhật buổi học thành công!');
    } else {
      addSession({
        ...formData,
        startTime: formData.startTime ? new Date(formData.startTime).toISOString() : undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      toast.success('Thêm buổi học thành công!');
    }
    
    setDialogOpen(false);
  };

  const handleDelete = (sessionId: number, sessionName: string) => {
    if (confirm(`Bạn có chắc muốn xóa buổi học "${sessionName}"?`)) {
      deleteSession(sessionId);
      toast.success('Xóa buổi học thành công!');
    }
  };

  const getClassName = (classId: number) => {
    return classes.find(c => c.classId === classId)?.name || 'N/A';
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return 'Chưa xác định';
    return new Date(dateString).toLocaleString('vi-VN');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl">Quản Lý Buổi Học</h1>
          <p className="text-gray-500 mt-1">Quản lý các buổi học trong lớp</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="size-4 mr-2" />
              Thêm buổi học
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingSession ? 'Chỉnh sửa buổi học' : 'Thêm buổi học mới'}
              </DialogTitle>
              <DialogDescription>
                {editingSession
                  ? 'Cập nhật thông tin buổi học'
                  : 'Điền thông tin để thêm buổi học mới'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="classId">Lớp học *</Label>
                <Select
                  value={formData.classId.toString()}
                  onValueChange={(value) => setFormData({ ...formData, classId: parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((cls) => (
                      <SelectItem key={cls.classId} value={cls.classId.toString()}>
                        {cls.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Tên buổi học *</Label>
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
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Nội dung</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fileUrl">URL File</Label>
                <Input
                  id="fileUrl"
                  value={formData.fileUrl}
                  onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Thời gian bắt đầu</Label>
                  <Input
                    id="startTime"
                    type="datetime-local"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Thời lượng (phút)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Hủy
                </Button>
                <Button type="submit">
                  {editingSession ? 'Cập nhật' : 'Thêm mới'}
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
                placeholder="Tìm kiếm buổi học..."
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
                <TableHead>Tên buổi học</TableHead>
                <TableHead>Lớp học</TableHead>
                <TableHead>Thời gian</TableHead>
                <TableHead>Thời lượng</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSessions.map((session) => (
                <TableRow key={session.sessionId}>
                  <TableCell>{session.sessionId}</TableCell>
                  <TableCell>{session.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{getClassName(session.classId)}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="size-4 text-gray-400" />
                      {formatDateTime(session.startTime)}
                    </div>
                  </TableCell>
                  <TableCell>{session.duration ? `${session.duration} phút` : '-'}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenDialog(session)}
                    >
                      <Edit className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(session.sessionId, session.name)}
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