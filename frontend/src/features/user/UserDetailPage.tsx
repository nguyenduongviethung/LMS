import React, { useEffect } from 'react';
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useUser } from './UserContext';
import { UserPublicDTO } from '@shared/src/types/user.types';
import { WithPermission } from '@shared/src/types/permission.types';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../ui/table';
import { ArrowLeft, Mail, Phone, Calendar, GraduationCap, Briefcase, CircleCheck, CircleX, Plus, Edit, Trash2 } from 'lucide-react';
import { UpdateUserDialog } from '../../features/user/UpdateUserDialog';
import { UserRoleBadge, UserStatusBadge } from '../../features/user/UserBadge';
import { UserClassRoleBadge } from '../../features/userClass/UserClassBadge';
import { DeleteUserDialog } from '../../features/user/DeleteUserDialog';
import { useUserClass } from '../userClass/UserClassContext';
import { UserClassPublicDTO } from '@shared/src/types/userClass.types';
import { CreateUserClassDialog } from '../../features/userClass/CreateUserClassDialog';
import { DeleteUserClassDialog } from '../../features/userClass/DeleteUserClassDialog';
import { UpdateUserClassDialog } from '../../features/userClass/UpdateUserClassDialog';
import { useClass } from '../class/ClassContext';

const UserClassesSection: React.FC<{ user: WithPermission<UserPublicDTO>, userClasses: WithPermission<UserClassPublicDTO>[], onChange: () => void }> = ({ user, userClasses, onChange }) => {
  const { classes, fetchClasses } = useClass();
  const [selectedUserClass, setSelectedUserClass] = useState<WithPermission<UserClassPublicDTO> | null>(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  useEffect(() => {
    const fetchData = fetchClasses;
    fetchData();
  }, []);
  const classOptions = classes.filter(cls => cls.permission.canCreateUserClass);

  const handleCreate = async () => {
    setSelectedUserClass(null);
    setOpenCreate(true);
  }

  const handleUpdate = async (userClass: WithPermission<UserClassPublicDTO>) => {
    setSelectedUserClass(userClass);
    setOpenUpdate(true);
  }

  const handleDelete = async (userClass: WithPermission<UserClassPublicDTO>) => {
    setSelectedUserClass(userClass);
    setOpenDelete(true);
  }

  const handleSuccess = async () => {
    onChange();
    setOpenCreate(false);
    setOpenUpdate(false);
    setOpenDelete(false);
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Danh sách lớp học</CardTitle>
          {classOptions.length > 0 && <Button
            variant="outline"
            size="sm"
            onClick={handleCreate}
          >
            <Plus className="size-4 mr-2" />
            Thêm
          </Button>}
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên lớp</TableHead>
              <TableHead>Vai trò</TableHead>
              <TableHead>Ngày tham gia</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userClasses.map((userClass) => (
              <TableRow key={userClass.data.userClassId}>
                <TableCell>
                  <Link
                    to={`/classes/${userClass.data.class.classId}`}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    {userClass.data.class.name}
                  </Link>
                </TableCell>
                <TableCell><UserClassRoleBadge role={userClass.data.role} /></TableCell>
                <TableCell>{new Date(userClass.data.enrolledAt).toLocaleDateString('vi-VN')}</TableCell>
                <TableCell className="text-right">
                  {userClass.permission.canGet && <Button variant="outline" size="sm" asChild>
                    <Link to={`/user-classes/${userClass.data.userClassId}`}>Xem chi tiết</Link>
                  </Button>}
                  {userClass.permission.canUpdate && <Button
                    variant="outline"
                    size="sm"
                    className="ml-2"
                    onClick={() => handleUpdate(userClass)}
                  >
                    <Edit className="size-4" />
                  </Button>}
                  {userClass.permission.canDelete && <Button
                    variant="outline"
                    size="sm"
                    className="ml-2 text-red-600"
                    onClick={() => handleDelete(userClass)}
                  >
                    <Trash2 className="size-4" />
                  </Button>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      {!selectedUserClass && <CreateUserClassDialog open={openCreate} onOpenChange={setOpenCreate} onSuccess={handleSuccess} fixedUser={user} classOptions={classOptions} />}
      {selectedUserClass && <UpdateUserClassDialog open={openUpdate} onOpenChange={setOpenUpdate} onSuccess={handleSuccess} userClass={selectedUserClass} />}
      {selectedUserClass && <DeleteUserClassDialog open={openDelete} onOpenChange={setOpenDelete} onSuccess={handleSuccess} userClass={selectedUserClass} />}
    </Card>
  )
}

export const UserDetailPage: React.FC = () => {

  const { userId: userIdString } = useParams();
  const userId = Number(userIdString);
  if (Number.isNaN(userId)) throw new Error("Invalid currentUserId: NaN");

  const { currentUser, fetchUser } = useUser();
  const { userClasses, fetchUserClasses } = useUserClass();

  useEffect(() => {
    const fetchData = async () => {
      fetchUser(userId);
      fetchUserClasses({ userId });
    };
    fetchData();
  }, []);

  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const handleEdit = () => {
    setOpenEdit(true);
  }
  const handleDelete = () => {
    setOpenDelete(true);
  }

  const handleSuccess = () => {
    fetchUser(userId);
    setOpenEdit(false);
    setOpenDelete(false);
  }

  const handleUserClassChanged = async () => {
    await fetchUserClasses({ userId });
  };


  return currentUser ? (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" asChild>
          <Link to="/users">
            <ArrowLeft className="size-4 mr-2" />
            Quay lại
          </Link>
        </Button>
        <div className='flex-1'>
          <h1 className="text-3xl">{currentUser.data.name}</h1>
          <p className="text-gray-500 mt-1">Chi tiết thông tin người dùng</p>
        </div>
        {currentUser.permission.canUpdate && <Button
          variant="outline"
          size="sm"
          onClick={handleEdit}
        >
          <Edit className="size-4 mr-2" />
          Sửa
        </Button>}
        {currentUser.permission.canDelete && <Button
          variant="destructive"
          size="sm"
          onClick={handleDelete}
        >
          <Trash2 className="size-4 mr-2" />
          Xóa
        </Button>}
        {currentUser.permission.canUpdate && <UpdateUserDialog open={openEdit} onOpenChange={setOpenEdit} user={currentUser} onSuccess={handleSuccess} />}
        {currentUser.permission.canDelete && <DeleteUserDialog open={openDelete} onOpenChange={setOpenDelete} user={currentUser} onSuccess={handleSuccess} />}
      </div>

      <div className="grid grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Thông tin cơ bản</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {currentUser.data.email && (
              <div className="flex items-center gap-2">
                <Mail className="size-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p>{currentUser.data.email}</p>
                </div>
              </div>
            )}
            {currentUser.data.phone && (
              <div className="flex items-center gap-2">
                <Phone className="size-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Số điện thoại</p>
                  <p>{currentUser.data.phone}</p>
                </div>
              </div>
            )}
            {currentUser.data.birthDate && (
              <div className="flex items-center gap-2">
                <Calendar className="size-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Ngày sinh</p>
                  <p>{new Date(currentUser.data.birthDate).toLocaleDateString('vi-VN')}</p>
                </div>
              </div>
            )}
            {currentUser.data.studyPlace && (
              <div className="flex items-center gap-2">
                <GraduationCap className="size-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Nơi học</p>
                  <p>{currentUser.data.studyPlace}</p>
                </div>
              </div>
            )}
            {currentUser.data.workPlace && (
              <div className="flex items-center gap-2">
                <Briefcase className="size-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Nơi làm việc</p>
                  <p>{currentUser.data.workPlace}</p>
                </div>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-500 mb-1">Vai trò</p>
              <UserRoleBadge role={currentUser.data.role} />
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Trạng thái</p>
              <UserStatusBadge status={currentUser.data.status} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Thống kê học tập</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Lớp học tham gia</p>
              <p className="text-2xl font-bold">{userClasses.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Tỷ lệ điểm danh</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold">{80}%</p>
                <span className="text-sm text-gray-400">({8}/{10})</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Bài tập hoàn thành</p>
              <p className="text-2xl font-bold">{20}/{25}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Điểm trung bình</p>
              <p className="text-2xl font-bold">{8.5}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Học phí</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CircleCheck className="size-4 text-green-600" />
                <span className="text-sm text-gray-500">Đã thanh toán</span>
              </div>
              <p className="font-bold text-green-600">{0}</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CircleX className="size-4 text-red-600" />
                <span className="text-sm text-gray-500">Chưa thanh toán</span>
              </div>
              <p className="font-bold text-red-600">{0}</p>
            </div>
            <div className="flex items-center justify-between pt-2 border-t">
              <span className="text-sm text-gray-500">Tổng cộng</span>
              <p className="font-bold">{0}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <UserClassesSection user={currentUser} userClasses={userClasses} onChange={handleUserClassChanged} />
    </div>
  ) : null;
};