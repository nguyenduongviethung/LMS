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
import { Input } from '../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Pencil, DollarSign, CircleCheck, CircleX, Clock } from 'lucide-react';
import { TuitionStatus } from '../types';
import { toast } from 'sonner';

export const TuitionsPage: React.FC = () => {
  const { tuitions, users, classes, userClasses, updateTuition } = useData();
  const [selectedClassId, setSelectedClassId] = useState<number>(classes[0]?.classId || 0);
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTuition, setEditingTuition] = useState<any>(null);
  const [formData, setFormData] = useState({
    amount: 0,
    status: TuitionStatus.UNPAID,
  });

  // Get students in the selected class
  const classStudents = userClasses
    .filter(uc => uc.classId === selectedClassId && uc.role === 'STUDENT')
    .map(uc => users.find(u => u.userId === uc.userId))
    .filter(Boolean);

  const selectedClass = classes.find(c => c.classId === selectedClassId);

  const handleOpenDialog = (studentId: number) => {
    const tuition = tuitions.find(
      t => t.userId === studentId && 
      t.classId === selectedClassId && 
      t.month === selectedMonth && 
      t.year === selectedYear
    );
    
    setEditingTuition({
      userId: studentId,
      classId: selectedClassId,
      month: selectedMonth,
      year: selectedYear,
    });
    
    setFormData({
      amount: tuition?.amount || selectedClass?.defaultTuition || 0,
      status: tuition?.status || TuitionStatus.UNPAID,
    });
    
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingTuition) {
      updateTuition(
        editingTuition.userId,
        editingTuition.classId,
        editingTuition.month,
        editingTuition.year,
        formData
      );
      toast.success('Cập nhật học phí thành công!');
    }
    
    setDialogOpen(false);
  };

  const getTuitionForStudent = (studentId: number) => {
    return tuitions.find(
      t => t.userId === studentId && 
      t.classId === selectedClassId && 
      t.month === selectedMonth && 
      t.year === selectedYear
    );
  };

  const getStatusBadge = (status: TuitionStatus) => {
    const config = {
      PAID: { variant: 'default' as const, label: 'Đã thanh toán', icon: CircleCheck },
      UNPAID: { variant: 'destructive' as const, label: 'Chưa thanh toán', icon: CircleX },
      PENDING: { variant: 'secondary' as const, label: 'Chờ xác nhận', icon: Clock },
    };
    const { variant, label, icon: Icon } = config[status];
    return (
      <Badge variant={variant}>
        <Icon className="size-3 mr-1" />
        {label}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const getTotalPaid = () => {
    return tuitions
      .filter(
        t => t.classId === selectedClassId && 
        t.month === selectedMonth && 
        t.year === selectedYear && 
        t.status === TuitionStatus.PAID
      )
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getTotalUnpaid = () => {
    return tuitions
      .filter(
        t => t.classId === selectedClassId && 
        t.month === selectedMonth && 
        t.year === selectedYear && 
        t.status === TuitionStatus.UNPAID
      )
      .reduce((sum, t) => sum + t.amount, 0);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl">Quản Lý Học Phí</h1>
        <p className="text-gray-500 mt-1">Theo dõi và quản lý học phí của học sinh</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Đã thu</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(getTotalPaid())}</p>
              </div>
              <CircleCheck className="size-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Chưa thu</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(getTotalUnpaid())}</p>
              </div>
              <CircleX className="size-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Tổng cộng</p>
                <p className="text-2xl font-bold">{formatCurrency(getTotalPaid() + getTotalUnpaid())}</p>
              </div>
              <DollarSign className="size-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Chọn lớp học</Label>
              <Select
                value={selectedClassId.toString()}
                onValueChange={(value) => setSelectedClassId(parseInt(value))}
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
            <div>
              <Label>Tháng</Label>
              <Select
                value={selectedMonth.toString()}
                onValueChange={(value) => setSelectedMonth(parseInt(value))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                    <SelectItem key={month} value={month.toString()}>
                      Tháng {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Năm</Label>
              <Select
                value={selectedYear.toString()}
                onValueChange={(value) => setSelectedYear(parseInt(value))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[2024, 2025, 2026].map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Học sinh</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Số tiền</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classStudents.map((student: any) => {
                const tuition = getTuitionForStudent(student.userId);
                return (
                  <TableRow key={student.userId}>
                    <TableCell>{student.userId}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>
                      {tuition ? formatCurrency(tuition.amount) : formatCurrency(selectedClass?.defaultTuition || 0)}
                    </TableCell>
                    <TableCell>
                      {tuition ? getStatusBadge(tuition.status) : getStatusBadge(TuitionStatus.UNPAID)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenDialog(student.userId)}
                      >
                        <Pencil className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cập nhật học phí</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin học phí cho học sinh
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Số tiền *</Label>
              <Input
                id="amount"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: parseInt(e.target.value) })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Trạng thái *</Label>
              <Select
                value={formData.status}
                onValueChange={(value: TuitionStatus) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={TuitionStatus.PAID}>Đã thanh toán</SelectItem>
                  <SelectItem value={TuitionStatus.UNPAID}>Chưa thanh toán</SelectItem>
                  <SelectItem value={TuitionStatus.PENDING}>Chờ xác nhận</SelectItem>
                </SelectContent>
              </Select>
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