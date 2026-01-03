import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import { ClassStatus } from '../types';
import { toast } from 'sonner';

export const ClassesPage: React.FC = () => {
  const { classes, addClass, updateClass, deleteClass } = useData();
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    defaultTuition: '',
    status: ClassStatus.OPEN,
  });

  const filteredClasses = classes.filter((cls) =>
    cls.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenDialog = (cls?: any) => {
    if (cls) {
      setEditingClass(cls);
      setFormData({
        name: cls.name,
        description: cls.description || '',
        defaultTuition: cls.defaultTuition?.toString() || '',
        status: cls.status,
      });
    } else {
      setEditingClass(null);
      setFormData({
        name: '',
        description: '',
        defaultTuition: '',
        status: ClassStatus.OPEN,
      });
    }
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const classData = {
      ...formData,
      defaultTuition: formData.defaultTuition ? parseFloat(formData.defaultTuition) : undefined,
    };

    if (editingClass) {
      updateClass(editingClass.classId, {
        ...classData,
        updatedAt: new Date().toISOString(),
      });
      toast.success('Cập nhật lớp học thành công!');
    } else {
      addClass({
        ...classData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      toast.success('Thêm lớp học thành công!');
    }
    
    setDialogOpen(false);
  };

  const handleDelete = (classId: number, className: string) => {
    if (confirm(`Bạn có chắc muốn xóa lớp học "${className}"?`)) {
      deleteClass(classId);
      toast.success('Xóa lớp học thành công!');
    }
  };

  const getStatusBadge = (status: ClassStatus) => {
    const variants: Record<ClassStatus, any> = {
      OPEN: 'default',
      CLOSED: 'secondary',
      ARCHIVED: 'destructive',
    };
    const labels = {
      OPEN: 'Đang mở',
      CLOSED: 'Đã đóng',
      ARCHIVED: 'Lưu trữ',
    };
    return <Badge variant={variants[status]}>{labels[status]}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl">Quản Lý Lớp Học</h1>
          <p className="text-gray-500 mt-1">Quản lý danh sách lớp học trong hệ thống</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="size-4 mr-2" />
              Thêm lớp học
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingClass ? 'Chỉnh sửa lớp học' : 'Thêm lớp học mới'}
              </DialogTitle>
              <DialogDescription>
                {editingClass
                  ? 'Cập nhật thông tin lớp học'
                  : 'Điền thông tin để thêm lớp học mới'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Tên lớp học *</Label>
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
                <Label htmlFor="defaultTuition">Học phí mặc định (VNĐ)</Label>
                <Input
                  id="defaultTuition"
                  type="number"
                  value={formData.defaultTuition}
                  onChange={(e) => setFormData({ ...formData, defaultTuition: e.target.value })}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Trạng thái *</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: ClassStatus) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ClassStatus.OPEN}>Đang mở</SelectItem>
                    <SelectItem value={ClassStatus.CLOSED}>Đã đóng</SelectItem>
                    <SelectItem value={ClassStatus.ARCHIVED}>Lưu trữ</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Hủy
                </Button>
                <Button type="submit">
                  {editingClass ? 'Cập nhật' : 'Thêm mới'}
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
                placeholder="Tìm kiếm lớp học..."
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
                <TableHead>Tên lớp học</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead>Học phí</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClasses.map((cls) => (
                <TableRow key={cls.classId}>
                  <TableCell>{cls.classId}</TableCell>
                  <TableCell>{cls.name}</TableCell>
                  <TableCell>{cls.description || '-'}</TableCell>
                  <TableCell>
                    {cls.defaultTuition
                      ? new Intl.NumberFormat('vi-VN').format(cls.defaultTuition) + ' đ'
                      : '-'}
                  </TableCell>
                  <TableCell>{getStatusBadge(cls.status)}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/classes/${cls.classId}`}>
                        <Eye className="size-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(cls)}>
                      <Edit className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(cls.classId, cls.name)}
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