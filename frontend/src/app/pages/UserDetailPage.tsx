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
import { ArrowLeft, Mail, Phone, Calendar, GraduationCap, Briefcase, CircleCheck, CircleX } from 'lucide-react';
import { UserRole, UserStatus, AttendanceStatus } from '../types';

export const UserDetailPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { users, classes, userClasses, sessions, attendances, taskResults, contents, tuitions } = useData();

  const user = users.find(u => u.userId === parseInt(userId || '0'));

  if (!user) {
    return (
      <div className="p-6">
        <h1 className="text-3xl">Người dùng không tồn tại</h1>
        <Button asChild className="mt-4">
          <Link to="/users">
            <ArrowLeft className="size-4 mr-2" />
            Quay lại
          </Link>
        </Button>
      </div>
    );
  }

  // Get user's classes
  const userClassList = userClasses
    .filter(uc => uc.userId === user.userId)
    .map(uc => ({
      ...uc,
      class: classes.find(c => c.classId === uc.classId),
    }));

  // Get user's attendance
  const userAttendances = attendances.filter(a => a.userId === user.userId);
  const totalSessions = sessions.filter(s => 
    userClassList.some(uc => uc.classId === s.classId)
  ).length;
  const presentCount = userAttendances.filter(a => a.status === AttendanceStatus.PRESENT).length;
  const attendanceRate = totalSessions > 0 ? ((presentCount / totalSessions) * 100).toFixed(1) : '0';

  // Get user's task results
  const userTaskResults = taskResults.filter(tr => tr.userId === user.userId);
  const completedTasks = userTaskResults.filter(tr => tr.status === 'COMPLETED').length;
  const averageScore = userTaskResults.length > 0
    ? (userTaskResults.reduce((sum, tr) => sum + (tr.score || 0), 0) / userTaskResults.length).toFixed(1)
    : '0';

  // Get user's tuitions
  const userTuitions = tuitions.filter(t => t.userId === user.userId);
  const paidTuitions = userTuitions.filter(t => t.status === 'PAID').length;
  const unpaidTuitions = userTuitions.filter(t => t.status === 'UNPAID').length;

  const getStatusBadge = (status: UserStatus) => {
    const variants: Record<UserStatus, any> = {
      ACTIVE: 'default',
      INACTIVE: 'secondary',
      SUSPENDED: 'destructive',
    };
    const labels = {
      ACTIVE: 'Hoạt động',
      INACTIVE: 'Không hoạt động',
      SUSPENDED: 'Đã khóa',
    };
    return <Badge variant={variants[status]}>{labels[status]}</Badge>;
  };

  const getRoleBadge = (role: UserRole) => {
    return role === UserRole.ADMIN ? (
      <Badge variant="default">Quản trị viên</Badge>
    ) : (
      <Badge variant="outline">Người dùng</Badge>
    );
  };

  const getClassRoleBadge = (role: string) => {
    const config: Record<string, { variant: any; label: string }> = {
      STUDENT: { variant: 'default', label: 'Học sinh' },
      TEACHER: { variant: 'secondary', label: 'Giáo viên' },
      TEACHER_ASSISTANT: { variant: 'outline', label: 'Trợ giảng' },
    };
    const { variant, label } = config[role] || { variant: 'outline', label: role };
    return <Badge variant={variant}>{label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" asChild>
          <Link to="/users">
            <ArrowLeft className="size-4 mr-2" />
            Quay lại
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl">{user.name}</h1>
          <p className="text-gray-500 mt-1">Chi tiết thông tin người dùng</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Thông tin cơ bản</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <Mail className="size-4 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p>{user.email}</p>
              </div>
            </div>
            {user.phone && (
              <div className="flex items-center gap-2">
                <Phone className="size-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Số điện thoại</p>
                  <p>{user.phone}</p>
                </div>
              </div>
            )}
            {user.birthDate && (
              <div className="flex items-center gap-2">
                <Calendar className="size-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Ngày sinh</p>
                  <p>{new Date(user.birthDate).toLocaleDateString('vi-VN')}</p>
                </div>
              </div>
            )}
            {user.studyPlace && (
              <div className="flex items-center gap-2">
                <GraduationCap className="size-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Nơi học</p>
                  <p>{user.studyPlace}</p>
                </div>
              </div>
            )}
            {user.workPlace && (
              <div className="flex items-center gap-2">
                <Briefcase className="size-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Nơi làm việc</p>
                  <p>{user.workPlace}</p>
                </div>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-500 mb-1">Vai trò</p>
              {getRoleBadge(user.role)}
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Trạng thái</p>
              {getStatusBadge(user.status)}
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
              <p className="text-2xl font-bold">{userClassList.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Tỷ lệ điểm danh</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold">{attendanceRate}%</p>
                <span className="text-sm text-gray-400">({presentCount}/{totalSessions})</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Bài tập hoàn thành</p>
              <p className="text-2xl font-bold">{completedTasks}/{userTaskResults.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Điểm trung bình</p>
              <p className="text-2xl font-bold">{averageScore}</p>
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
              <p className="font-bold text-green-600">{paidTuitions}</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CircleX className="size-4 text-red-600" />
                <span className="text-sm text-gray-500">Chưa thanh toán</span>
              </div>
              <p className="font-bold text-red-600">{unpaidTuitions}</p>
            </div>
            <div className="flex items-center justify-between pt-2 border-t">
              <span className="text-sm text-gray-500">Tổng cộng</span>
              <p className="font-bold">{userTuitions.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách lớp học</CardTitle>
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
              {userClassList.map((uc) => (
                <TableRow key={uc.userClassId}>
                  <TableCell>{uc.class?.name || 'N/A'}</TableCell>
                  <TableCell>{getClassRoleBadge(uc.role)}</TableCell>
                  <TableCell>{new Date(uc.enrolledAt).toLocaleDateString('vi-VN')}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/classes/${uc.classId}`}>Xem chi tiết</Link>
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
          <CardTitle>Kết quả bài tập</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên bài tập</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Điểm</TableHead>
                <TableHead>Nhận xét</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userTaskResults.map((tr) => {
                const content = contents.find(c => c.contentId === tr.contentId);
                return (
                  <TableRow key={tr.contentId}>
                    <TableCell>{content?.name || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge variant={tr.status === 'COMPLETED' ? 'default' : 'secondary'}>
                        {tr.status === 'COMPLETED' ? 'Hoàn thành' : 'Đang làm'}
                      </Badge>
                    </TableCell>
                    <TableCell>{tr.score || '-'}</TableCell>
                    <TableCell>{tr.reviews || '-'}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};