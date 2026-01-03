import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { ArrowLeft, Users, Calendar, DollarSign, BookOpen } from 'lucide-react';
import { ClassStatus } from '../types';

export const ClassDetailPage: React.FC = () => {
  const { classId } = useParams<{ classId: string }>();
  const { classes, users, userClasses, sessions, attendances, tuitions } = useData();

  const classData = classes.find(c => c.classId === parseInt(classId || '0'));

  if (!classData) {
    return (
      <div className="p-6">
        <h1 className="text-3xl">Lớp học không tồn tại</h1>
        <Button asChild className="mt-4">
          <Link to="/classes">
            <ArrowLeft className="size-4 mr-2" />
            Quay lại
          </Link>
        </Button>
      </div>
    );
  }

  // Get class members
  const classMembers = userClasses
    .filter(uc => uc.classId === classData.classId)
    .map(uc => ({
      ...uc,
      user: users.find(u => u.userId === uc.userId),
    }));

  const students = classMembers.filter(m => m.role === 'STUDENT');
  const teachers = classMembers.filter(m => m.role === 'TEACHER' || m.role === 'TEACHER_ASSISTANT');

  // Get class sessions
  const classSessions = sessions.filter(s => s.classId === classData.classId);

  // Get tuition stats
  const classTuitions = tuitions.filter(t => t.classId === classData.classId);
  const paidTuitions = classTuitions.filter(t => t.status === 'PAID');
  const unpaidTuitions = classTuitions.filter(t => t.status === 'UNPAID');
  const totalRevenue = paidTuitions.reduce((sum, t) => sum + t.amount, 0);

  // Get attendance stats
  const classAttendances = attendances.filter(a => 
    classSessions.some(s => s.sessionId === a.sessionId)
  );
  const presentCount = classAttendances.filter(a => a.status === 'PRESENT').length;
  const attendanceRate = classAttendances.length > 0 
    ? ((presentCount / classAttendances.length) * 100).toFixed(1)
    : '0';

  const getStatusBadge = (status: ClassStatus) => {
    const config: Record<ClassStatus, { variant: any; label: string }> = {
      OPEN: { variant: 'default', label: 'Đang mở' },
      CLOSED: { variant: 'secondary', label: 'Đã đóng' },
      ARCHIVED: { variant: 'outline', label: 'Đã lưu trữ' },
    };
    const { variant, label } = config[status];
    return <Badge variant={variant}>{label}</Badge>;
  };

  const getRoleBadge = (role: string) => {
    const config: Record<string, { variant: any; label: string }> = {
      STUDENT: { variant: 'default', label: 'Học sinh' },
      TEACHER: { variant: 'secondary', label: 'Giáo viên' },
      TEACHER_ASSISTANT: { variant: 'outline', label: 'Trợ giảng' },
    };
    const { variant, label } = config[role] || { variant: 'outline', label: role };
    return <Badge variant={variant}>{label}</Badge>;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" asChild>
          <Link to="/classes">
            <ArrowLeft className="size-4 mr-2" />
            Quay lại
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl">{classData.name}</h1>
          <p className="text-gray-500 mt-1">{classData.description || 'Không có mô tả'}</p>
        </div>
        <div>{getStatusBadge(classData.status)}</div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Học sinh</p>
                <p className="text-2xl font-bold">{students.length}</p>
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
                <p className="text-2xl font-bold">{classSessions.length}</p>
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
                <p className="text-2xl font-bold">{attendanceRate}%</p>
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
                <p className="text-xl font-bold">{formatCurrency(totalRevenue)}</p>
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
            <div>
              <p className="text-sm text-gray-500">Học phí mặc định</p>
              <p className="font-semibold">{formatCurrency(classData.defaultTuition || 0)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Ngày tạo</p>
              <p className="font-semibold">{new Date(classData.createdAt).toLocaleDateString('vi-VN')}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Cập nhật lần cuối</p>
              <p className="font-semibold">{new Date(classData.updatedAt).toLocaleDateString('vi-VN')}</p>
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
              <span className="font-semibold text-green-600">{paidTuitions.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Chưa thanh toán</span>
              <span className="font-semibold text-red-600">{unpaidTuitions.length}</span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t">
              <span className="text-sm text-gray-500">Tổng doanh thu</span>
              <span className="font-semibold">{formatCurrency(totalRevenue)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Giáo viên & Trợ giảng</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Họ và tên</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Vai trò</TableHead>
                <TableHead>Ngày tham gia</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teachers.map((member) => (
                <TableRow key={member.userClassId}>
                  <TableCell>{member.user?.name || 'N/A'}</TableCell>
                  <TableCell>{member.user?.email || 'N/A'}</TableCell>
                  <TableCell>{getRoleBadge(member.role)}</TableCell>
                  <TableCell>{new Date(member.enrolledAt).toLocaleDateString('vi-VN')}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/users/${member.userId}`}>Xem chi tiết</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách học sinh ({students.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Họ và tên</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Ngày tham gia</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((member) => (
                <TableRow key={member.userClassId}>
                  <TableCell>{member.userId}</TableCell>
                  <TableCell>{member.user?.name || 'N/A'}</TableCell>
                  <TableCell>{member.user?.email || 'N/A'}</TableCell>
                  <TableCell>{new Date(member.enrolledAt).toLocaleDateString('vi-VN')}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/users/${member.userId}`}>Xem chi tiết</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách buổi học ({classSessions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Tên buổi học</TableHead>
                <TableHead>Thời gian</TableHead>
                <TableHead>Thời lượng</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classSessions.map((session) => (
                <TableRow key={session.sessionId}>
                  <TableCell>{session.sessionId}</TableCell>
                  <TableCell>{session.name}</TableCell>
                  <TableCell>
                    {session.startTime 
                      ? new Date(session.startTime).toLocaleString('vi-VN')
                      : 'Chưa xác định'
                    }
                  </TableCell>
                  <TableCell>{session.duration ? `${session.duration} phút` : '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
