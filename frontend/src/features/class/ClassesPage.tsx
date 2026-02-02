import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useClass } from './ClassContext';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Card, CardContent, CardHeader } from '../../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import { CreateClassDialog } from '../../features/class/CreateClassDialog';
import { ClassPublicDTO } from '@shared/src/types/class.types';
import { WithPermission } from '@shared/src/types/permission.types';
import { ClassStatusBadge } from '../../features/class/ClassBadge';
import { UpdateClassDialog } from '../../features/class/UpdateClassDialog';
import { DeleteClassDialog } from '../../features/class/DeleteClassDialog';
import { useAuth } from '../auth/AuthContext';

export const ClassesPage: React.FC = () => {
  const { permissions } = useAuth();
  const { classes, fetchClasses } = useClass();
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchData = fetchClasses;
    fetchData();
  }, []);

  const filteredClasses = classes.filter((cls) =>
    cls.data.name.toLowerCase().includes(search.toLowerCase())
  );

  const [selectedClass, setSelectedClass] = useState<WithPermission<ClassPublicDTO> | null>(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const handleCreate = () => {
    setSelectedClass(null);
    setOpenCreate(true);
  };
  const handleUpdate = (cls: WithPermission<ClassPublicDTO>) => {
    setSelectedClass(cls);
    setOpenUpdate(true);
  }
  const handleDelete = (cls: WithPermission<ClassPublicDTO>) => {
    setSelectedClass(cls);
    setOpenDelete(true);
  };
  const handleSuccess = () => {
    fetchClasses();
    setOpenCreate(false);
    setOpenUpdate(false);
    setOpenDelete(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl">Quản Lý Lớp Học</h1>
          <p className="text-gray-500 mt-1">Quản lý danh sách lớp học trong hệ thống</p>
        </div>
        {permissions?.class.create && <Button onClick={handleCreate}>
          <Plus className="size-4 mr-2" />
          Thêm lớp học
        </Button>}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-gray-400" />
              <Input
                id="search"
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
                <TableHead>Tên lớp học</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead>Học phí / buổi</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead>Cập nhật lần cuối</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClasses.map((cls) => (
                <TableRow key={cls.data.classId}>
                  <TableCell>{cls.data.name}</TableCell>
                  <TableCell>{cls.data.description || '-'}</TableCell>
                  <TableCell>
                    {cls.data.defaultTuition
                      ? new Intl.NumberFormat('vi-VN').format(cls.data.defaultTuition) + ' đ'
                      : '-'}
                  </TableCell>
                  <TableCell><ClassStatusBadge status={cls.data.status} /></TableCell>
                  <TableCell>{cls.data.createdAt.toLocaleDateString('vi-VN')}</TableCell>
                  <TableCell>{cls.data.updatedAt.toLocaleDateString('vi-VN')}</TableCell>
                  <TableCell className="text-right space-x-2">
                    {cls.permission.canGet && <Button variant="ghost" size="sm" asChild>
                      <Link to={`/classes/${cls.data.classId}`}>
                        <Eye className="size-4" />
                      </Link>
                    </Button>}
                    {cls.permission.canUpdate && <Button variant="ghost" size="sm" onClick={() => handleUpdate(cls)}>
                      <Edit className="size-4" />
                    </Button>}
                    {cls.permission.canDelete && <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(cls)}
                    >
                      <Trash2 className="size-4 text-red-600" />
                    </Button>}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {!selectedClass && <CreateClassDialog open={openCreate} onOpenChange={setOpenCreate} onSuccess={handleSuccess} />}
      {selectedClass && <UpdateClassDialog open={openUpdate} onOpenChange={setOpenUpdate} onSuccess={handleSuccess} cls={selectedClass} />}
      {selectedClass && <DeleteClassDialog open={openDelete} onOpenChange={setOpenDelete} onSuccess={handleSuccess} cls={selectedClass} />}
    </div>
  );
};