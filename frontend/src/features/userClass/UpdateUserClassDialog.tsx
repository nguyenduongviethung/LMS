import React, { useState } from "react"
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from "../../ui/dialog"
import { UpdateUserClassDTO, UserClassPublicDTO } from "@shared/src/types/userClass.types"
import { useUserClass } from "./UserClassContext"
import { UserClassRole } from "@shared/src/enums/userClass.enum"
import { Label } from "../../ui/label"
import { Button } from "../../ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../ui/select"
import { UserClassRoleBadge } from "./UserClassBadge"
import { toast } from "sonner"
import { Input } from "../../ui/input"
import { toDatetimeLocal } from "../../lib/DateTime"
import { WithPermission } from "@shared/src/types/permission.types"

/* =======================
   1. Hook: form logic
   ======================= */
function useUpdateUserClassForm(onSuccess: () => void, userClass: UserClassPublicDTO) {
  const { updateUserClass } = useUserClass();
  const [formData, setFormData] = useState<Omit<UpdateUserClassDTO, "userId" | "classId">>({
    role: userClass.role,
    enrolledAt: new Date()
  })

  const handleChange =
    <K extends keyof UpdateUserClassDTO>(key: K) =>
      (value: UpdateUserClassDTO[K]) => {
        setFormData(prev => ({ ...prev, [key]: value }))
      }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUserClass(userClass.userClassId, formData)

      toast.success("Cập nhật người dùng trong lớp học thành công")
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
function UpdateUserClassForm({
  userClass,
  onSuccess,
  onCancel
}: {
  userClass: UserClassPublicDTO,
  onSuccess: () => void,
  onCancel: () => void
}) {
  const { formData, handleChange, handleSubmit } = useUpdateUserClassForm(onSuccess, userClass)

  return (
    // <form onSubmit={handleSubmit}>
    //   {/* toàn bộ Input / Select ở đây */}
    // </form>
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Label htmlFor="role">Vai trò</Label>
          <Select
            name="role"
            value={formData.role}
            onValueChange={(value: UserClassRole) => handleChange("role")(value)}
          >
            <SelectTrigger className="w-full" id="role">
              <SelectValue placeholder="Chọn trạng thái">
                <UserClassRoleBadge role={formData.role} />
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {Object.values(UserClassRole).map((role) => (
                <SelectItem key={role} value={role}>
                  <UserClassRoleBadge role={role} />
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-2">
          <Label htmlFor="enrolledAt">Thời gian vào lớp</Label>
          <Input
            id="enrolledAt"
            type="datetime-local"
            value={toDatetimeLocal(formData.enrolledAt)}
            onChange={e => handleChange("enrolledAt")(new Date(e.target.value))}
            className="col-span-2"
            required
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
export function UpdateUserClassDialog({
  open,
  onOpenChange,
  userClass,
  onSuccess,
}: {
  open: boolean,
  onOpenChange: (open: boolean) => void,
  userClass: WithPermission<UserClassPublicDTO>,
  onSuccess: () => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cập nhật người dùng trong lớp học</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin người dùng trong lớp học.
          </DialogDescription>
        </DialogHeader>

        <UpdateUserClassForm
          userClass={userClass.data}
          onSuccess={onSuccess}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
