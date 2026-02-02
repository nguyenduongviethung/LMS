import React, { useState } from "react"
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from "../../ui/dialog"
import { CreateSessionDTO } from "@shared/src/types/session.types"
import { Label } from "../../ui/label"
import { Input } from "../../ui/input"
import { Button } from "../../ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../ui/select"
import { toast } from "sonner"
import { useSession } from "./SessionContext"
import { useClass } from "../class/ClassContext"
import { toDatetimeLocal } from "../../lib/DateTime"

/* =======================
   1. Hook: form logic
   ======================= */
function useCreateSessionForm(onSuccess: () => void) {
  const { addSession } = useSession();
  const [formData, setFormData] = useState<Omit<CreateSessionDTO, "classId"> & { classId: number | null }>({
    classId: null,
    name: '',
    description: '',
    startTime: null,
    duration: null,
    templateSessionId: null
  })

  const handleChange =
    <K extends keyof CreateSessionDTO>(key: K) =>
      (value: CreateSessionDTO[K]) => {
        setFormData(prev => ({ ...prev, [key]: value }))
      }

  const handleSubmit = async (e: React.FormEvent) => {
    if (formData.classId === null) {
      alert("Chưa chọn lớp học");
      return;
    }
    e.preventDefault();
    try {
      await addSession({
        ...formData,
        classId: formData.classId
      });
      toast.success("Thêm buổi học thành công");
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
function CreateSessionForm({
  onSuccess,
  onCancel,
}: {
  onSuccess: () => void,
  onCancel: () => void,
}) {
  const { formData, handleChange, handleSubmit } =
    useCreateSessionForm(onSuccess)
  const { classes } = useClass();

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Label htmlFor="class">Lớp học *</Label>
          <Select
            name="class"
            value={formData.classId?.toString()}
            onValueChange={(value: string) => handleChange("classId")(Number(value))}
            required
          >
            <SelectTrigger className="w-full" id="class">
              <SelectValue placeholder="Chọn lớp học" />
            </SelectTrigger>
            <SelectContent>
              {classes.map((cls) => (
                <SelectItem key={cls.data.classId} value={cls.data.classId.toString()}>
                  {cls.data.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-2">
          <Label htmlFor="name">Tên buổi học *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={e => handleChange("name")(e.target.value)}
            className="col-span-2"
            required
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
          <Label htmlFor="startTime">Thời gian bắt đầu</Label>
          <Input
            id="startTime"
            type="datetime-local"
            value={toDatetimeLocal(formData.startTime)}
            onChange={e => handleChange("startTime")(e.target.value ? new Date(e.target.value) : null)}
            className="col-span-2"
          />
        </div>
        <div className="col-span-2">
          <Label htmlFor="duration">Thời lượng (phút)</Label>
          <Input
            id="duration"
            value={formData.description}
            onChange={e => handleChange("duration")(Number(e.target.value))}
            className="col-span-2"
          />
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
export function CreateSessionDialog({
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
          <DialogTitle>Thêm buổi học mới</DialogTitle>
          <DialogDescription>
            Điền thông tin để thêm buổi học mới.
          </DialogDescription>
        </DialogHeader>

        <CreateSessionForm
          onSuccess={onSuccess}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
