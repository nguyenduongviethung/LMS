import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from './UserContext';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Card, CardContent, CardHeader } from '../../ui/card';
import { UserStatusBadge, UserRoleBadge } from '../../features/user/UserBadge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import { UserPublicDTO } from '@shared/src/types/user.types';
import { WithPermission } from '@shared/src/types/permission.types';
import { UpdateUserDialog } from '../../features/user/UpdateUserDialog';
import { CreateUserDialog } from '../../features/user/CreateUserDialog';
import { DeleteUserDialog } from '../../features/user/DeleteUserDialog';
import { useAuth } from '../auth/AuthContext';

export const UsersPage: React.FC = () => {
  const { users, fetchUsers } = useUser();
  const { permissions } = useAuth();

  const [search, setSearch] = useState('');
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedUser, setSelectedUser] = useState<WithPermission<UserPublicDTO> | null>(null);

  useEffect(() => {
    const fetchData = fetchUsers;
    fetchData()
  }, []);

  const filteredUsers = users.filter(
    (user: WithPermission<UserPublicDTO>) =>
      user.data.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = () => {
    setSelectedUser(null);
    setOpenCreate(true);
  };

  const handleEdit = (user: WithPermission<UserPublicDTO>) => {
    setSelectedUser(user);
    setOpenUpdate(true);
  }

  const handleDelete = (user: WithPermission<UserPublicDTO>) => {
    setSelectedUser(user);
    setOpenDelete(true);
  }

  const handleSuccess = () => {
    fetchUsers();
    setOpenCreate(false);
    setOpenUpdate(false);
    setOpenDelete(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl">Quản Lý Người Dùng</h1>
          <p className="text-gray-500 mt-1">Quản lý danh sách người dùng trong hệ thống</p>
        </div>
        {permissions?.user.create && <Button onClick={() => handleCreate()}>
          <Plus className="size-4 mr-2" />
          Thêm người dùng
        </Button>}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-gray-400" />
              <Input
                id="search"
                placeholder="Tìm kiếm theo tên hoặc email..."
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
                <TableHead>Họ và tên</TableHead>
                <TableHead>Nơi học tập</TableHead>
                <TableHead>Nơi làm việc</TableHead>
                <TableHead>Vai trò</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead>Cập nhật lần cuối</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.data.userId}>
                  <TableCell>{user.data.name}</TableCell>
                  <TableCell>{user.data.studyPlace}</TableCell>
                  <TableCell>{user.data.workPlace}</TableCell>
                  <TableCell><UserRoleBadge role={user.data.role} /></TableCell>
                  <TableCell><UserStatusBadge status={user.data.status} /></TableCell>
                  <TableCell>{user.data.createdAt.toLocaleDateString('vi-VN')}</TableCell>
                  <TableCell>{user.data.updatedAt.toLocaleDateString('vi-VN')}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/users/${user.data.userId}`}>
                        <Eye className="size-4" />
                      </Link>
                    </Button>
                    {user.permission.canUpdate && (<Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(user)}
                    >
                      <Edit className="size-4" />
                    </Button>)}
                    {user.permission.canDelete && (<Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(user)}
                    >
                      <Trash2 className="size-4 text-red-600" />
                    </Button>)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {!selectedUser && <CreateUserDialog open={openCreate} onOpenChange={setOpenCreate} onSuccess={handleSuccess}/>}
      {selectedUser && <UpdateUserDialog open={openUpdate} onOpenChange={setOpenUpdate} user={selectedUser} onSuccess={handleSuccess} />}
      {selectedUser && <DeleteUserDialog open={openDelete} onOpenChange={setOpenDelete} user={selectedUser} onSuccess={handleSuccess} />}
    </div>
  );
};