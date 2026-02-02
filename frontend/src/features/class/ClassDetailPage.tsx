import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Edit } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../ui/table';
import { ArrowLeft, Users, Calendar, DollarSign, BookOpen, Plus, Eye, Trash2 } from 'lucide-react';
import { WithPermission } from '@shared/src/types/permission.types';
import { useSession } from '../session/SessionContext';
import { SessionPublicDTO } from '@shared/src/types/session.types';
import { CreateSessionDialog } from '../../features/session/CreateSessionDialog';
import { UpdateSessionDialog } from '../../features/session/UpdateSessionDialog';
import { UserProvider, useUser } from '../user/UserContext';
import { useClass } from './ClassContext';
import { ClassPublicDTO } from '@shared/src/types/class.types';
import { ClassStatusBadge } from '../../features/class/ClassBadge';
import { UpdateClassDialog } from '../../features/class/UpdateClassDialog';
import { DeleteClassDialog } from '../../features/class/DeleteClassDialog';
import { DeleteSessionDialog } from '../../features/session/DeleteSessionDialog';
import { useUserClass } from '../userClass/UserClassContext';
import { UserClassPublicDTO } from '@shared/src/types/userClass.types';
import { UserClassRole } from '@shared/src/enums/userClass.enum';
import { UserClassRoleBadge } from '../../features/userClass/UserClassBadge';
import { CreateUserClassDialog } from '../../features/userClass/CreateUserClassDialog';
import { UpdateUserClassDialog } from '../../features/userClass/UpdateUserClassDialog';
import { DeleteUserClassDialog } from '../../features/userClass/DeleteUserClassDialog';
import { useAuth } from '../auth/AuthContext';

const ClassUsersSection: React.FC<{ cls: WithPermission<ClassPublicDTO>, AllUserClasses: WithPermission<UserClassPublicDTO>[], role: UserClassRole, title: string, onChange: () => void }> = ({ cls, AllUserClasses, role, title, onChange }) => {
  const userClasses = AllUserClasses.filter(userClass => userClass.data.role === role);
  const [selectedUserClass, setSelectedUserClass] = useState<WithPermission<UserClassPublicDTO> | null>(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const { users, fetchUsers } = useUser();

  useEffect(() => {
    const fetchData = fetchUsers;
    fetchData();
  }, []);

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
          <CardTitle>{title} ({userClasses.length})</CardTitle>
          {cls.permission.canCreateUserClass && <Button
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
              <TableHead>Họ và tên</TableHead>
              <TableHead>Vai trò</TableHead>
              <TableHead>Ngày tham gia</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userClasses.map((userClass) => (
              <TableRow key={userClass.data.user.userId}>
                <TableCell>
                  {userClass.permission.canGetUser ? (<Link
                    to={`/users/${userClass.data.user.userId}`}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    {userClass.data.user.name}
                  </Link>) : userClass.data.user.name}
                </TableCell>
                <TableCell>{<UserClassRoleBadge role={userClass.data.role} />}</TableCell>
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
      <UserProvider>
        {!selectedUserClass && <CreateUserClassDialog open={openCreate} onOpenChange={setOpenCreate} onSuccess={handleSuccess} fixedClass={cls} userOptions={users} role={role} />}
        {selectedUserClass && <UpdateUserClassDialog open={openUpdate} onOpenChange={setOpenUpdate} onSuccess={handleSuccess} userClass={selectedUserClass} />}
        {selectedUserClass && <DeleteUserClassDialog open={openDelete} onOpenChange={setOpenDelete} onSuccess={handleSuccess} userClass={selectedUserClass} />}
      </UserProvider>
    </Card >
  )
}

const ClassSessionsSection: React.FC<{ cls: WithPermission<ClassPublicDTO>, sessions: WithPermission<SessionPublicDTO>[], onChange: () => void }> = ({ cls, sessions, onChange }) => {
  const [selectedSession, setSelectedSession] = useState<WithPermission<SessionPublicDTO> | null>(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const handleCreate = () => {
    setSelectedSession(null);
    setOpenCreate(true);
  }

  const handleUpdate = (session: WithPermission<SessionPublicDTO>) => {
    setSelectedSession(session);
    setOpenUpdate(true);
  }

  const handleDelete = (session: WithPermission<SessionPublicDTO>) => {
    setSelectedSession(session);
    setOpenDelete(true);
  }

  const handleSuccess = () => {
    onChange();
    setOpenCreate(false);
    setOpenUpdate(false);
    setOpenDelete(false);
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Danh sách buổi học ({sessions.length})</CardTitle>
          {cls.permission.canCreateSession && <Button
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
              <TableHead>Tên buổi học</TableHead>
              <TableHead>Thời gian</TableHead>
              <TableHead>Thời lượng</TableHead>
              <TableHead className='text-right'>Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sessions.map((session) => (
              <TableRow key={session.data.sessionId}>
                <TableCell>
                  {session.permission.canGet ? (
                    <Link
                      to={`/sessions/${session.data.sessionId}`}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      {session.data.name}
                    </Link>
                  ) : session.data.name}
                </TableCell>
                <TableCell>
                  {session.data.startTime
                    ? new Date(session.data.startTime).toLocaleDateString('vi-VN')
                    : 'Chưa xác định'
                  }
                </TableCell>
                <TableCell>{session.data.duration ? `${session.data.duration} phút` : '-'}</TableCell>
                <TableCell className="text-right">
                  {session.permission.canGet && <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <Link to={`/sessions/${session.data.sessionId}`}>
                      <Eye className="size-4 mr-2" />
                      Xem
                    </Link>
                  </Button>}
                  {session.permission.canUpdate && <Button
                    variant="outline"
                    size="sm"
                    className="ml-2"
                    onClick={() => handleUpdate(session)}
                  >
                    <Edit className="size-4" />
                  </Button>}
                  {session.permission.canDelete && <Button
                    variant="outline"
                    size="sm"
                    className="ml-2 text-red-600"
                    onClick={() => handleDelete(session)}
                  >
                    <Trash2 className="size-4" />
                  </Button>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      {!selectedSession && <CreateSessionDialog open={openCreate} onOpenChange={setOpenCreate} onSuccess={handleSuccess} />}
      {selectedSession && <UpdateSessionDialog open={openUpdate} onOpenChange={setOpenUpdate} session={selectedSession} onSuccess={handleSuccess} />}
      {selectedSession && <DeleteSessionDialog open={openDelete} onOpenChange={setOpenDelete} session={selectedSession} onSuccess={handleSuccess} />}
    </Card>
  )
}

export const ClassDetailPage: React.FC = () => {
  const { classId: classIdString } = useParams();
  const classId = Number(classIdString);
  if (Number.isNaN(classId)) throw new Error("Invalid classId: NaN");

  const { currentClass, fetchClass } = useClass();
  useEffect(() => {
    const fetchData = async () => {
      fetchClass(classId);
    }
    fetchData();
  }, []);

  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const handleEdit = () => {
    setOpenUpdate(true);
  }
  const handleDelete = () => {
    setOpenDelete(true);
  }
  const handleSuccess = () => {
    fetchClass(classId);
    setOpenUpdate(false);
    setOpenDelete(false);
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const { sessions, fetchSessions } = useSession();
  useEffect(() => {
    fetchSessions(classId);
  }, [classId]);

  const handleSessionChange = () => {
    fetchSessions(classId);
  }

  const { userClasses, fetchUserClasses } = useUserClass();

  useEffect(() => {
    fetchUserClasses({ classId });
  }, []);

  const handleUserClassChange = () => {
    fetchUserClasses({ classId });
  };

  return currentClass && (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" asChild>
          <Link to="/classes">
            <ArrowLeft className="size-4 mr-2" />
            Quay lại
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl">{currentClass.data.name}</h1>
          <p className="text-gray-500 mt-1">{"Chi tiết thông tin lớp học"}</p>
        </div>
        <div>{<ClassStatusBadge status={currentClass.data.status} />}</div>
        {currentClass.permission.canUpdate && <Button
          variant="outline"
          size="sm"
          onClick={handleEdit}
        >
          <Edit className="size-4 mr-2" />
          Sửa
        </Button>}
        {currentClass.permission.canDelete && <Button
          variant="destructive"
          size="sm"
          onClick={handleDelete}
        >
          <Trash2 className="size-4 mr-2" />
          Xóa
        </Button>}
        <UpdateClassDialog open={openUpdate} onOpenChange={setOpenUpdate} cls={currentClass} onSuccess={handleSuccess} />
        <DeleteClassDialog open={openDelete} onOpenChange={setOpenDelete} cls={currentClass} onSuccess={handleSuccess} />
      </div>


      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Học sinh</p>
                <p className="text-2xl font-bold">{userClasses.filter(uc => uc.data.role === UserClassRole.STUDENT).length}</p>
              </div>
              <Users className="size-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Buổi học</p>
                <p className="text-2xl font-bold">{sessions.length}</p>
              </div>
              <BookOpen className="size-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Tỷ lệ điểm danh</p>
                <p className="text-2xl font-bold">{50}%</p>
              </div>
              <Calendar className="size-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Doanh thu</p>
                <p className="text-xl font-bold">{formatCurrency(0)}</p>
              </div>
              <DollarSign className="size-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Thông tin lớp học</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {currentClass.data.defaultTuition && <div>
              <p className="text-sm text-gray-500">Học phí mặc định</p>
              <p className="font-semibold">{currentClass.data.defaultTuition}</p>
            </div>}
            <div>
              <p className="text-sm text-gray-500">Ngày tạo</p>
              <p className="font-semibold">{new Date(currentClass.data.createdAt).toLocaleDateString('vi-VN')}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Cập nhật lần cuối</p>
              <p className="font-semibold">{new Date(currentClass.data.updatedAt).toLocaleDateString('vi-VN')}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Thống kê học phí</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Đã thanh toán</span>
              <span className="font-semibold text-green-600">{10}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Chưa thanh toán</span>
              <span className="font-semibold text-red-600">{10}</span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t">
              <span className="text-sm text-gray-500">Tổng doanh thu</span>
              <span className="font-semibold">{formatCurrency(100000)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <ClassUsersSection cls={currentClass} AllUserClasses={userClasses} role='TEACHER' title='Danh sách giáo viên' onChange={handleUserClassChange} />
      <ClassUsersSection cls={currentClass} AllUserClasses={userClasses} role='TEACHER_ASSISTANT' title='Danh sách trợ giảng' onChange={handleUserClassChange} />
      <ClassUsersSection cls={currentClass} AllUserClasses={userClasses} role='STUDENT' title='Danh sách học sinh' onChange={handleUserClassChange} />

      <ClassSessionsSection cls={currentClass} sessions={sessions} onChange={handleSessionChange} />
    </div >
  );
};
