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
import { ProgramStatus } from '../types';
import { toast } from 'sonner';

export const ProgramsPage: React.FC = () => {
  const { programs, addProgram, updateProgram, deleteProgram } = useData();
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: ProgramStatus.DRAFT,
  });

  const filteredPrograms = programs.filter((program) =>
    program.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenDialog = (program?: any) => {
    if (program) {
      setEditingProgram(program);
      setFormData({
        name: program.name,
        description: program.description || '',
        status: program.status,
      });
    } else {
      setEditingProgram(null);
      setFormData({
        name: '',
        description: '',
        status: ProgramStatus.DRAFT,
      });
    }
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingProgram) {
      updateProgram(editingProgram.programId, {
        ...formData,
        updatedAt: new Date().toISOString(),
      });
      toast.success('Cập nhật chương trình thành công!');
    } else {
      addProgram({
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      toast.success('Thêm chương trình thành công!');
    }

    setDialogOpen(false);
  };

  const handleDelete = (programId: number, programName: string) => {
    if (confirm(`Bạn có chắc muốn xóa chương trình "${programName}"?`)) {
      deleteProgram(programId);
      toast.success('Xóa chương trình thành công!');
    }
  };

  const getStatusBadge = (status: ProgramStatus) => {
    const variants: Record<ProgramStatus, any> = {
      DRAFT: 'secondary',
      ACTIVE: 'default',
      DEPRECATED: 'outline',
      ARCHIVED: 'destructive',
    };
    const labels = {
      DRAFT: 'Nháp',
      ACTIVE: 'Hoạt động',
      DEPRECATED: 'Đã lỗi thời',
      ARCHIVED: 'Lưu trữ',
    };
    return <Badge variant={variants[status]}>{labels[status]}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl">Quản Lý Chương Trình</h1>
          <p className="text-gray-500 mt-1">Quản lý danh sách chương trình giảng dạy</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="size-4 mr-2" />
              Thêm chương trình
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingProgram ? 'Chỉnh sửa chương trình' : 'Thêm chương trình mới'}
              </DialogTitle>
              <DialogDescription>
                {editingProgram
                  ? 'Cập nhật thông tin chương trình'
                  : 'Điền thông tin để thêm chương trình mới'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Tên chương trình *</Label>
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
                <Label htmlFor="status">Trạng thái *</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: ProgramStatus) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ProgramStatus.DRAFT}>Nháp</SelectItem>
                    <SelectItem value={ProgramStatus.ACTIVE}>Hoạt động</SelectItem>
                    <SelectItem value={ProgramStatus.DEPRECATED}>Đã lỗi thời</SelectItem>
                    <SelectItem value={ProgramStatus.ARCHIVED}>Lưu trữ</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Hủy
                </Button>
                <Button type="submit">{editingProgram ? 'Cập nhật' : 'Thêm mới'}</Button>
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
                placeholder="Tìm kiếm chương trình..."
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
                <TableHead>Tên chương trình</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPrograms.map((program) => (
                <TableRow key={program.programId}>
                  <TableCell>{program.programId}</TableCell>
                  <TableCell>{program.name}</TableCell>
                  <TableCell>{program.description || '-'}</TableCell>
                  <TableCell>{getStatusBadge(program.status)}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/programs/${program.programId}`}>
                        <Eye className="size-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenDialog(program)}
                    >
                      <Edit className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(program.programId, program.name)}
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