import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader } from '../components/ui/card';
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
import { Pencil, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

export const ReviewsPage: React.FC = () => {
  const { reviews, users, classes, userClasses, updateReview } = useData();
  const [selectedClassId, setSelectedClassId] = useState<number>(classes[0]?.classId || 0);
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<any>(null);
  const [formData, setFormData] = useState({
    goodAttitude: '',
    badAttitude: '',
    goodSkills: '',
    badSkills: '',
    goodKnowledge: '',
    badKnowledge: '',
  });

  // Get students in the selected class
  const classStudents = userClasses
    .filter(uc => uc.classId === selectedClassId && uc.role === 'STUDENT')
    .map(uc => users.find(u => u.userId === uc.userId))
    .filter(Boolean);

  const handleOpenDialog = (studentId: number) => {
    const review = reviews.find(
      r => r.studentId === studentId && 
      r.classId === selectedClassId && 
      r.month === selectedMonth && 
      r.year === selectedYear
    );
    
    const currentUser = users.find(u => u.userId === 1); // Assuming logged in user
    setEditingReview({
      studentId,
      classId: selectedClassId,
      reviewerId: currentUser?.userId || 1,
      month: selectedMonth,
      year: selectedYear,
    });
    
    setFormData({
      goodAttitude: review?.goodAttitude || '',
      badAttitude: review?.badAttitude || '',
      goodSkills: review?.goodSkills || '',
      badSkills: review?.badSkills || '',
      goodKnowledge: review?.goodKnowledge || '',
      badKnowledge: review?.badKnowledge || '',
    });
    
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingReview) {
      updateReview(
        editingReview.studentId,
        editingReview.classId,
        editingReview.reviewerId,
        editingReview.month,
        editingReview.year,
        formData
      );
      toast.success('Cập nhật nhận xét thành công!');
    }
    
    setDialogOpen(false);
  };

  const getReviewForStudent = (studentId: number) => {
    return reviews.find(
      r => r.studentId === studentId && 
      r.classId === selectedClassId && 
      r.month === selectedMonth && 
      r.year === selectedYear
    );
  };

  const getStudentName = (userId: number) => {
    return users.find(u => u.userId === userId)?.name || 'N/A';
  };

  const hasReview = (studentId: number) => {
    const review = getReviewForStudent(studentId);
    return review && (
      review.goodAttitude || 
      review.badAttitude || 
      review.goodSkills || 
      review.badSkills || 
      review.goodKnowledge || 
      review.badKnowledge
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl">Quản Lý Nhận Xét</h1>
        <p className="text-gray-500 mt-1">Quản lý nhận xét và đánh giá học sinh</p>
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
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classStudents.map((student: any) => (
                <TableRow key={student.userId}>
                  <TableCell>{student.userId}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>
                    {hasReview(student.userId) ? (
                      <span className="text-green-600 flex items-center gap-1">
                        <MessageSquare className="size-4" />
                        Đã nhận xét
                      </span>
                    ) : (
                      <span className="text-gray-400">Chưa nhận xét</span>
                    )}
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
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nhận xét học sinh</DialogTitle>
            <DialogDescription>
              Nhận xét về thái độ, kỹ năng và kiến thức của học sinh
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Thái độ</h3>
                <div className="space-y-2">
                  <div>
                    <Label htmlFor="goodAttitude">Điểm tốt</Label>
                    <Textarea
                      id="goodAttitude"
                      value={formData.goodAttitude}
                      onChange={(e) => setFormData({ ...formData, goodAttitude: e.target.value })}
                      rows={2}
                      placeholder="Những điểm tốt về thái độ..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="badAttitude">Cần cải thiện</Label>
                    <Textarea
                      id="badAttitude"
                      value={formData.badAttitude}
                      onChange={(e) => setFormData({ ...formData, badAttitude: e.target.value })}
                      rows={2}
                      placeholder="Những điểm cần cải thiện về thái độ..."
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Kỹ năng</h3>
                <div className="space-y-2">
                  <div>
                    <Label htmlFor="goodSkills">Điểm tốt</Label>
                    <Textarea
                      id="goodSkills"
                      value={formData.goodSkills}
                      onChange={(e) => setFormData({ ...formData, goodSkills: e.target.value })}
                      rows={2}
                      placeholder="Những điểm tốt về kỹ năng..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="badSkills">Cần cải thiện</Label>
                    <Textarea
                      id="badSkills"
                      value={formData.badSkills}
                      onChange={(e) => setFormData({ ...formData, badSkills: e.target.value })}
                      rows={2}
                      placeholder="Những điểm cần cải thiện về kỹ năng..."
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Kiến thức</h3>
                <div className="space-y-2">
                  <div>
                    <Label htmlFor="goodKnowledge">Điểm tốt</Label>
                    <Textarea
                      id="goodKnowledge"
                      value={formData.goodKnowledge}
                      onChange={(e) => setFormData({ ...formData, goodKnowledge: e.target.value })}
                      rows={2}
                      placeholder="Những điểm tốt về kiến thức..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="badKnowledge">Cần cải thiện</Label>
                    <Textarea
                      id="badKnowledge"
                      value={formData.badKnowledge}
                      onChange={(e) => setFormData({ ...formData, badKnowledge: e.target.value })}
                      rows={2}
                      placeholder="Những điểm cần cải thiện về kiến thức..."
                    />
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Hủy
              </Button>
              <Button type="submit">
                Lưu nhận xét
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};