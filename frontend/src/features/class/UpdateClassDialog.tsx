import React, { useState } from "react"
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from "../../ui/dialog"
import { UpdateClassDTO, ClassPublicDTO } from "@shared/src/types/class.types"
import { WithPermission } from "@shared/src/types/permission.types"
import { Label } from "../../ui/label"
import { Input } from "../../ui/input"
import { Button } from "../../ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../ui/select"
import { toast } from "sonner"
import { useClass } from "./ClassContext"
import { ClassStatus } from "@shared/src/enums/class.enum"
import { ClassStatusBadge } from "./ClassBadge"

/* =======================
   1. Hook: form logic
   ======================= */
function useUpdateClassForm(cls: ClassPublicDTO, onSuccess: () => void) {
  const { updateClass } = useClass();
  const [formData, setFormData] = useState<UpdateClassDTO>({
    name: cls.name,
    description: cls.description,
    defaultTuition: cls.defaultTuition,
    status: cls.status
  })

  const handleChange =
    <K extends keyof UpdateClassDTO>(key: K) =>
      (value: UpdateClassDTO[K]) => {
        setFormData(prev => ({ ...prev, [key]: value }))
      }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateClass(cls.classId, formData)

      toast.success("Cập nhật lớp học thành công")
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
function UpdateClassForm({
  cls,
  onSuccess,
  onCancel
}: {
  cls: ClassPublicDTO
  onSuccess: () => void,
  onCancel: () => void
}) {
  const { formData, handleChange, handleSubmit } =
    useUpdateClassForm(cls, onSuccess)

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Label htmlFor="name">Tên lớp học *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={e => handleChange("name")(e.target.value)}
            className="col-span-2"
            autoComplete="off"
          />
        </div>
        <div className="col-span-2">
          <Label htmlFor="description">Mô tả</Label>
          <Input
            id="description"
            value={formData.description}
            onChange={e => handleChange("description")(e.target.value)}
            className="col-span-2"
          />
        </div>
        <div className="col-span-2">
          <Label htmlFor="defaultTuition">Học phí mặc định / buổi (VNĐ)</Label>
          <Input
            id="defaultTuition"
            value={formData.defaultTuition ?? ""}
            onChange={e => handleChange("defaultTuition")(Number.isNaN(parseInt(e.target.value)) ? null : parseInt(e.target.value))}
            className="col-span-2"
          />
          <div className="col-span-2">
            <Label htmlFor="status">Trạng thái *</Label>
            <Select
              name="status"
              value={formData.status}
              onValueChange={(value: ClassStatus) => handleChange("status")(value)}
            >
              <SelectTrigger className="w-full" id="status">
                <SelectValue placeholder="Chọn trạng thái">
                  <ClassStatusBadge status={formData.status} />
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {Object.values(ClassStatus).map(status => (
                  <SelectItem key={status} value={status}>
                    <ClassStatusBadge status={status} />
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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
export function UpdateClassDialog({
  cls,
  open,
  onOpenChange,
  onSuccess
}: {
  cls: WithPermission<ClassPublicDTO>
  open: boolean,
  onOpenChange: (open: boolean) => void,
  onSuccess: () => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chỉnh sửa lớp học</DialogTitle>
          <DialogDescription>
            Chỉnh sửa thông tin của lớp học {cls.data.name}.
          </DialogDescription>
        </DialogHeader>
        <UpdateClassForm
          cls={cls.data}
          onSuccess={onSuccess}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
