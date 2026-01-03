import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Button } from '../components/ui/button';
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
import { CircleCheck, CircleX, CircleAlert, Pencil } from 'lucide-react';
import { AttendanceStatus } from '../types';
import { toast } from 'sonner';

export const AttendancePage: React.FC = () => {
  const { attendances, sessions, users, classes, userClasses, updateAttendance } = useData();
  const [selectedClassId, setSelectedClassId] = useState<number>(classes[0]?.classId || 0);
  const [selectedSessionId, setSelectedSessionId] = useState<number>(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAttendance, setEditingAttendance] = useState<any>(null);
  const [formData, setFormData] = useState({
    status: AttendanceStatus.PRESENT,
    note: '',
  });

  // Filter sessions by selected class
  const classSessions = sessions.filter(s => s.classId === selectedClassId);
  
  // Get students in the selected class
  const classStudents = userClasses
    .filter(uc => uc.classId === selectedClassId && uc.role === 'STUDENT')
    .map(uc => users.find(u => u.userId === uc.userId))
    .filter(Boolean);

  const handleOpenDialog = (userId: number, sessionId: number) => {
    const attendance = attendances.find(a => a.userId === userId && a.sessionId === sessionId);
    setEditingAttendance({ userId, sessionId });
    setFormData({
      status: attendance?.status || AttendanceStatus.ABSENT,
      note: attendance?.note || '',
    });
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingAttendance) {
      updateAttendance(editingAttendance.userId, editingAttendance.sessionId, formData);
      toast.success('Cập nhật điểm danh thành công!');
    }
    
    setDialogOpen(false);
  };

  const getStatusBadge = (status: AttendanceStatus) => {
    const config = {
      PRESENT: { variant: 'default' as const, label: 'Có mặt', icon: CircleCheck },
      ABSENT: { variant: 'destructive' as const, label: 'Vắng', icon: CircleX },
      EXCUSED: { variant: 'secondary' as const, label: 'Có phép', icon: CircleAlert },
    };
    const { variant, label, icon: Icon } = config[status];
    return (
      <Badge variant={variant}>
        <Icon className="size-3 mr-1" />
        {label}
      </Badge>
    );
  };

  const getAttendanceForStudent = (userId: number, sessionId: number) => {
    return attendances.find(a => a.userId === userId && a.sessionId === sessionId);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl">Quản Lý Điểm Danh</h1>
        <p className="text-gray-500 mt-1">Theo dõi và quản lý điểm danh học sinh</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label>Chọn lớp học</Label>
              <Select
                value={selectedClassId.toString()}
                onValueChange={(value) => {
                  setSelectedClassId(parseInt(value));
                  setSelectedSessionId(0);
                }}
              >
                <SelectTrigger className="mt-1">
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
            <div className="flex-1">
              <Label>Chọn buổi học (tùy chọn)</Label>
              <Select
                value={selectedSessionId.toString()}
                onValueChange={(value) => setSelectedSessionId(parseInt(value))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Tất cả buổi học" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Tất cả buổi học</SelectItem>
                  {classSessions.map((session) => (
                    <SelectItem key={session.sessionId} value={session.sessionId.toString()}>
                      {session.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {selectedSessionId === 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Học sinh</TableHead>
                    {classSessions.map((session) => (
                      <TableHead key={session.sessionId} className="text-center min-w-[120px]">
                        {session.name}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classStudents.map((student: any) => (
                    <TableRow key={student.userId}>
                      <TableCell>{student.name}</TableCell>
                      {classSessions.map((session) => {
                        const attendance = getAttendanceForStudent(student.userId, session.sessionId);
                        return (
                          <TableCell key={session.sessionId} className="text-center">
                            <div className="flex items-center justify-center gap-2">
                              {attendance ? getStatusBadge(attendance.status) : '-'}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleOpenDialog(student.userId, session.sessionId)}
                              >
                                <Pencil className="size-4" />
                              </Button>
                            </div>
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Học sinh</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ghi chú</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classStudents.map((student: any) => {
                  const attendance = getAttendanceForStudent(student.userId, selectedSessionId);
                  return (
                    <TableRow key={student.userId}>
                      <TableCell>{student.userId}</TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>
                        {attendance ? getStatusBadge(attendance.status) : '-'}
                      </TableCell>
                      <TableCell>{attendance?.note || '-'}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenDialog(student.userId, selectedSessionId)}
                        >
                          <Pencil className="size-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cập nhật điểm danh</DialogTitle>
            <DialogDescription>
              Cập nhật trạng thái điểm danh cho học sinh
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="status">Trạng thái *</Label>
              <Select
                value={formData.status}
                onValueChange={(value: AttendanceStatus) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={AttendanceStatus.PRESENT}>Có mặt</SelectItem>
                  <SelectItem value={AttendanceStatus.ABSENT}>Vắng</SelectItem>
                  <SelectItem value={AttendanceStatus.EXCUSED}>Có phép</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="note">Ghi chú</Label>
              <Textarea
                id="note"
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                rows={3}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Hủy
              </Button>
              <Button type="submit">
                Cập nhật
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};