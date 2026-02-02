import React, { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from "../../ui/dialog"
import { SessionPublicDTO, UpdateSessionDTO } from "@shared/src/types/session.types"
import { WithPermission } from "@shared/src/types/permission.types"
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
function useUpdateSessionForm(session: SessionPublicDTO, onSuccess: () => void) {
  const { updateSession } = useSession();
  const [formData, setFormData] = useState<UpdateSessionDTO>({
    classId: session.class.classId,
    name: session.name,
    description: session.description,
    startTime: session.startTime,
    duration: session.duration,
    templateSessionId: session.templateSession?.templateSessionId ?? null
  });

  const handleChange =
    <K extends keyof UpdateSessionDTO>(key: K) =>
      (value: UpdateSessionDTO[K]) => {
        setFormData(prev => ({ ...prev, [key]: value }))
      }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {

      await updateSession(session.sessionId, formData);

      toast.success("Cập nhật buổi học thành công");
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
function UpdateSessionForm({
  session,
  onSuccess,
  onCancel
}: {
  session: SessionPublicDTO,
  onSuccess: () => void,
  onCancel: () => void
}) {
  const { formData, handleChange, handleSubmit } =
    useUpdateSessionForm(session, onSuccess)
  const { classes, fetchClasses } = useClass();

  useEffect(() => {
    fetchClasses();
  }, [session]);

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
              <SelectValue />
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
            value={`${formData.duration ?? ""}`}
            onChange={e => handleChange("duration")(e.target.value ? Number(e.target.value) ?? null : null)}
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
export function UpdateSessionDialog({
  open,
  onOpenChange,
  session,
  onSuccess
}: {
  open: boolean,
  onOpenChange: (open: boolean) => void,
  session: WithPermission<SessionPublicDTO>,
  onSuccess: () => void
}) {
  return session && (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cập nhật thông tin buổi học</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin buổi học {session.data.name}.
          </DialogDescription>
        </DialogHeader>

        <UpdateSessionForm
          session={session.data}
          onSuccess={onSuccess}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
