import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { ArrowLeft, User, BookOpen, Calendar, Edit, Trash2 } from 'lucide-react';
import { AttendanceStatus } from '@shared/src/enums/attendance.enum';
import { useUserClass } from './UserClassContext';
import { UserClassRoleBadge } from '../../features/userClass/UserClassBadge';
import { useSession } from '../session/SessionContext';
import { useAttendance } from '../attendance/AttendanceContext';
import { AttendancePublicDTO } from '@shared/src/types/attendance.types';
import { toDatetimeLocal } from '../../lib/DateTime';
import { AttendanceStatusBadge } from '../attendance/AttendanceBadge';
import { UpdateUserClassDialog } from './UpdateUserClassDialog';
import { DeleteUserClassDialog } from './DeleteUserClassDialog';

type MonthKey = string; // "YYYY-MM"

type MonthMeta = {
  label: string;
  year: number;
  month: number;
};


const UserClassAttendanceCard: React.FC<{
  attendances: AttendancePublicDTO[];
  filteredAttendances: AttendancePublicDTO[];
  filterAttendancesByMonth: (attendances: AttendancePublicDTO[], selectedMonth: string) => AttendancePublicDTO[];
  monthMap: Record<MonthKey, MonthMeta>;
  monthKeysDesc: string[];
  selectedMonth: string;
  onMonthChange: (v: string) => void;
}> = ({
  attendances,
  filteredAttendances,
  filterAttendancesByMonth,
  monthMap,
  monthKeysDesc,
  selectedMonth,
  onMonthChange
}) => {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Bảng điểm danh</CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Chọn tháng:</span>
              <Select value={selectedMonth} onValueChange={onMonthChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem key="all" value="all">
                    Tất cả
                  </SelectItem>
                  {monthKeysDesc.length > 0 ? (
                    monthKeysDesc.map(key => (
                      <SelectItem key={key} value={key}>
                        {monthMap[key].label}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>
                      Chưa có buổi học
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {Object.keys(attendances).length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              Không có lần điểm danh nào
            </div>
          ) : selectedMonth !== 'all' && filteredAttendances.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              Không có lần điểm danh nào trong tháng này
            </div>
          ) : (
            <div className="space-y-8">
              {/* Show all months as sections */}
              {(selectedMonth === 'all' ? monthKeysDesc : [selectedMonth]).map((key) => (
                <div key={key}>
                  <h3 className="text-lg font-semibold mb-4 pb-2 border-b">
                    {monthMap[key].label}
                  </h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Buổi học</TableHead>
                        <TableHead>Thời gian</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead>Ghi chú</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filterAttendancesByMonth(attendances, key).map((attendance) => {
                        return (
                          <TableRow key={attendance.session.sessionId}>
                            <TableCell>
                              <Link
                                to={`/sessions/${attendance.session.sessionId}`}
                                className="text-blue-600 hover:underline font-medium"
                              >
                                {attendance.session.name}
                              </Link>
                            </TableCell>
                            <TableCell>{toDatetimeLocal(attendance.session.startTime)}</TableCell>
                            <TableCell><AttendanceStatusBadge status={attendance.status} /></TableCell>
                            <TableCell className="text-sm text-gray-500">
                              {attendance?.note || '-'}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

export const UserClassPage: React.FC = () => {
  const { userClassId: userClassIdString } = useParams<{ userClassId: string }>();
  const { sessions, fetchSessions } = useSession();
  const userClassId = Number(userClassIdString);

  const { currentUserClass, fetchUserClass } = useUserClass()

  useEffect(() => {
    fetchUserClass(userClassId);
  }, [userClassId]);

  useEffect(() => {
    if (currentUserClass) fetchSessions(currentUserClass.data.class.classId);
  }, [currentUserClass]);

  const { attendances, fetchUserClassAttendance } = useAttendance();
  useEffect(() => {
    fetchUserClassAttendance(userClassId);
  }, [userClassId]);

  const filterAttendancesByMonth = (
    attendances: AttendancePublicDTO[],
    selectedMonth: string
  ) => {
    if (!selectedMonth) return attendances; // Tất cả tháng
    if (selectedMonth === 'all') return attendances;

    return attendances.filter(a => {
      if (!a.session.startTime) return false;
      const d = a.session.startTime;
      const month = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      return d.getFullYear() === monthMap[selectedMonth].year && d.getMonth() + 1 === monthMap[selectedMonth].month;
    });
  };


  type MonthKey = string; // "YYYY-MM"

  type MonthMeta = {
    label: string;
    year: number;
    month: number;
  };

  const monthMap: Record<MonthKey, MonthMeta> = useMemo(() => {
    const map: Record<MonthKey, MonthMeta> = {};

    attendances.forEach(a => {
      if (!a.session.startTime) return;

      const d = a.session.startTime;
      const year = d.getFullYear();
      const month = d.getMonth() + 1;
      const key = `${year}-${String(month).padStart(2, '0')}`;

      if (!map[key]) {
        map[key] = {
          year,
          month,
          label: `Tháng ${String(month).padStart(2, '0')}/${year}`
        };
      }
    });

    return map;
  }, [attendances]);

  const monthKeysDesc = useMemo(
    () =>
      Object.keys(monthMap).sort((a, b) => b.localeCompare(a)),
    [monthMap]
  );
  const [selectedMonth, setSelectedMonth] = useState<string>("all");

  const filteredAttendances = useMemo(
    () => filterAttendancesByMonth(attendances, selectedMonth),
    [attendances, selectedMonth]
  );

  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const handleEdit = () => {
    setOpenUpdate(true);
  }
  const handleDelete = () => {
    setOpenDelete(true);
  }
  const handleSuccess = () => {
    fetchUserClass(userClassId);
    setOpenUpdate(false);
    setOpenDelete(false);
  }
  const stats = useMemo(() => {
    const present = filteredAttendances.filter(a => a.status === AttendanceStatus.PRESENT).length;
    const absent = filteredAttendances.filter(a => a.status === AttendanceStatus.ABSENT).length;
    const notTaken = filteredAttendances.filter(a => a.status === AttendanceStatus.NOT_TAKEN).length;

    return {
      present,
      absent,
      notTaken,
      rate: present + absent > 0
        ? ((present / (present + absent)) * 100).toFixed(1)
        : '0'
    };
  }, [filteredAttendances]);

  return currentUserClass && (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        {currentUserClass.permission.canGetUser && <Button variant="outline" asChild>
          <Link to={`/users/${currentUserClass.data.user.userId}`}>
            <ArrowLeft className="size-4 mr-2" />
            Quay lại
          </Link>
        </Button>}
        <div className='flex-1'>
          <h1 className="text-3xl">{currentUserClass.data.user.name} - {currentUserClass.data.class.name}</h1>
          <p className="text-gray-500 mt-1">Thông tin người dùng trong lớp học</p>
        </div>
        {currentUserClass.permission.canUpdate && <Button
          variant="outline"
          size="sm"
          onClick={handleEdit}
        >
          <Edit className="size-4 mr-2" />
          Sửa
        </Button>}
        {currentUserClass.permission.canDelete && <Button
          variant="destructive"
          size="sm"
          onClick={handleDelete}
        >
          <Trash2 className="size-4 mr-2" />
          Xóa
        </Button>}
        {currentUserClass && <UpdateUserClassDialog open={openUpdate} onOpenChange={setOpenUpdate} userClass={currentUserClass} onSuccess={handleSuccess} />}
        {currentUserClass && <DeleteUserClassDialog open={openDelete} onOpenChange={setOpenDelete} userClass={currentUserClass} onSuccess={handleSuccess} />}
      </div>

      {/* User Info in Class */}
      <div className="grid grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="size-5" />
              Thông tin
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Người dùng</p>
              <p className="font-medium">{currentUserClass.data.user.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{currentUserClass.data.user.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Vai trò</p>
              {<UserClassRoleBadge role={currentUserClass.data.role} />}
            </div>
            <div>
              <p className="text-sm text-gray-500">Ngày tham gia</p>
              <p className="font-medium">
                {new Date(currentUserClass.data.enrolledAt).toLocaleDateString('vi-VN')}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="size-5" />
              Lớp học
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Tên lớp</p>
              <p className="font-medium">{currentUserClass.data.class.name}</p>
            </div>
            {currentUserClass.data.class.description && (
              <div>
                <p className="text-sm text-gray-500">Mô tả</p>
                <p className="text-sm">{currentUserClass.data.class.description}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-500">Tổng số buổi học</p>
              <p className="text-2xl font-bold">{sessions.length}</p>
            </div>
          </CardContent>
        </Card>


        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="size-5" />
              Thống kê ({selectedMonth === 'all' ? 'Tất cả' : monthMap[selectedMonth].label})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Tỷ lệ có mặt</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold text-green-600">{stats.rate}%</p>
                <span className="text-sm text-gray-400">
                  ({stats.present}/{stats.present + stats.absent})
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-gray-500">Vắng mặt</p>
                <p className="font-bold text-red-600">{stats.absent}</p>
              </div>
              <div>
                <p className="text-gray-500">Chưa điểm danh</p>
                <p className="font-bold text-orange-600">{stats.notTaken}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Table */}
      <UserClassAttendanceCard attendances={attendances} filteredAttendances={filteredAttendances} filterAttendancesByMonth={filterAttendancesByMonth} monthMap={monthMap} monthKeysDesc={monthKeysDesc} selectedMonth={selectedMonth} onMonthChange={setSelectedMonth} />
    </div >
  );
};