import React, { useState } from "react"
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from "../../ui/dialog"
import { CreateClassDTO } from "@shared/src/types/class.types"
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
function useCreateClassForm(onSuccess: () => void) {
  const { addClass } = useClass();
  const [formData, setFormData] = useState<CreateClassDTO>({
    name: '',
    description: '',
    defaultTuition: null,
    status: ClassStatus.OPEN
  })

  const handleChange =
    <K extends keyof CreateClassDTO>(key: K) =>
      (value: CreateClassDTO[K]) => {
        setFormData(prev => ({ ...prev, [key]: value }))
      }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addClass(formData)
      toast.success("Thêm lớp học thành công")
      onSuccess();
    } catch (err) { }
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
function CreateClassForm({
  onSuccess,
  onCancel
}: {
  onSuccess: () => void,
  onCancel: () => void
}) {
  const { formData, handleChange, handleSubmit } =
    useCreateClassForm(onSuccess)

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
            autoComplete="off"
          />
        </div>
        <div className="col-span-2">
          <Label htmlFor="defaultTuition">Học phí mặc định / buổi (VNĐ)</Label>
          <Input
            id="defaultTuition"
            value={formData.defaultTuition ?? ""}
            onChange={e => handleChange("defaultTuition")(Number.isNaN(parseInt(e.target.value)) ? null : parseInt(e.target.value))}
            className="col-span-2"
            autoComplete="off"
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
        <Button type="submit">Thêm</Button>
      </DialogFooter>
    </form>
  )
}

/* =======================
   3. Dialog: export
   ======================= */
export function CreateClassDialog({
  open,
  onOpenChange,
  onSuccess
}: {
  open: boolean,
  onOpenChange: (open: boolean) => void,
  onSuccess: () => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thêm lớp học mới</DialogTitle>
          <DialogDescription>
            Điền thông tin để thêm lớp học mới.
          </DialogDescription>
        </DialogHeader>

        <CreateClassForm
          onSuccess={onSuccess}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
