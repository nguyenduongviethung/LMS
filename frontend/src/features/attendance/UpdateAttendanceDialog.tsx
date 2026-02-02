import React, { useState } from "react"
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from "../../ui/dialog"
import { UpdateAttendanceDTO, AttendancePublicDTO } from "@shared/src/types/attendance.types"
import { Label } from "../../ui/label"
import { Input } from "../../ui/input"
import { Button } from "../../ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../ui/select"
import { toast } from "sonner"
import { useAttendance } from "./AttendanceContext"
import { AttendanceStatus } from "@shared/src/enums/attendance.enum"
import { AttendanceStatusBadge } from "./AttendanceBadge"

/* =======================
   1. Hook: form logic
   ======================= */
function useUpdateAttendanceForm(attendance: AttendancePublicDTO, onSuccess: () => void) {
  const { updateAttendance } = useAttendance();
  const [formData, setFormData] = useState<UpdateAttendanceDTO>({
    status: attendance.status,
    note: attendance.note
  })

  const handleChange =
    <K extends keyof UpdateAttendanceDTO>(key: K) =>
      (value: UpdateAttendanceDTO[K]) => {
        setFormData(prev => ({ ...prev, [key]: value }))
      }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateAttendance(attendance.session.sessionId, attendance.user.userId, formData)
      toast.success("Cập nhật điểm danh thành công")
      onSuccess();
    } catch (err) {}
  }

  return {
    formData,
    handleChange,
    handleSubmit,
  }
}

/* =======================
   2. Form: chỉ render
   ======================= */
function UpdateAttendanceForm({
  attendance,
  onSuccess,
  onCancel
}: {
  attendance: AttendancePublicDTO
  onSuccess: () => void,
  onCancel: () => void
}) {
  const { formData, handleChange, handleSubmit } =
    useUpdateAttendanceForm(attendance, onSuccess)

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <div className="col-span-2">
            <Label htmlFor="status">Trạng thái *</Label>
            <Select
              value={formData.status}
              onValueChange={(value: AttendanceStatus) => handleChange("status")(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn trạng thái">
                  <AttendanceStatusBadge status={formData.status} />
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {Object.values(AttendanceStatus).map((status) => (
                  <SelectItem key={status} value={status}>
                    <AttendanceStatusBadge status={status}/>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="col-span-2">
          <Label htmlFor="name">Ghi chú</Label>
          <Input
            id="name"
            value={formData.note}
            onChange={e => handleChange("note")(e.target.value)}
            className="col-span-2"
          />
        </div>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Hủy bỏ
        </Button>
        <Button type="submit">Lưu</Button>
      </DialogFooter>
    </form>
  )
}

/* =======================
   3. Dialog: export
   ======================= */
export function UpdateAttendanceDialog({
  attendance,
  open,
  onOpenChange,
  onSuccess
}: {
  attendance: AttendancePublicDTO
  open: boolean,
  onOpenChange: (open: boolean) => void,
  onSuccess: () => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chỉnh sửa điểm danh</DialogTitle>
          <DialogDescription>
            Chỉnh sửa thông tin điểm danh.
          </DialogDescription>
        </DialogHeader>
        <UpdateAttendanceForm
          attendance={attendance}
          onSuccess={onSuccess}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
