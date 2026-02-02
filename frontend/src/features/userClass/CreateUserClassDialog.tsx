import React, { useState } from "react"
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from "../../ui/dialog"
import { CreateUserClassDTO } from "@shared/src/types/userClass.types"
import { useUserClass } from "./UserClassContext"
import { UserClassRole } from "@shared/src/enums/userClass.enum"
import { Label } from "../../ui/label"
import { Button } from "../../ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../ui/select"
import { UserClassRoleBadge } from "./UserClassBadge"
import { toast } from "sonner"
import { UserPublicDTO } from "@shared/src/types/user.types"
import { ClassPublicDTO } from "@shared/src/types/class.types"
import { Input } from "../../ui/input"
import { toDatetimeLocal } from "../../lib/DateTime"
import { WithPermission } from "@shared/src/types/permission.types"

/* =======================
   1. Hook: form logic
   ======================= */
function useCreateUserClassForm(onSuccess: () => void, fixedUser?: WithPermission<UserPublicDTO>, fixedClass?: WithPermission<ClassPublicDTO>, role?: UserClassRole) {
  const { createUserClass } = useUserClass();
  const [formData, setFormData] = useState<Omit<CreateUserClassDTO, "userId" | "classId"> & { userId: number | null; classId: number | null }>({
    userId: fixedUser?.data.userId ?? null,
    classId: fixedClass?.data.classId ?? null,
    role: role ?? UserClassRole.STUDENT,
    enrolledAt: new Date()
  })

  const handleChange =
    <K extends keyof CreateUserClassDTO>(key: K) =>
      (value: CreateUserClassDTO[K]) => {
        setFormData(prev => ({ ...prev, [key]: value }))
      }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.userId === null) {
      alert("Chưa chọn người dùng");
      return;
    }
    if (formData.classId === null) {
      alert("Chưa chọn lớp học");
      return;
    }
    try {
      await createUserClass({
        ...formData,
        userId: formData.userId,
        classId: formData.classId,
      })

      toast.success("Thêm người dùng vào lớp học thành công")
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
function CreateUserClassForm({
  fixedUser,
  fixedClass,
  userOptions,
  classOptions,
  role,
  onSuccess,
  onCancel
}: {
  fixedUser?: WithPermission<UserPublicDTO>,
  fixedClass?: WithPermission<ClassPublicDTO>,
  userOptions?: WithPermission<UserPublicDTO>[],
  classOptions?: WithPermission<ClassPublicDTO>[],
  role?: UserClassRole,
  onSuccess: () => void,
  onCancel: () => void
}) {
  const { formData, handleChange, handleSubmit } = useCreateUserClassForm(onSuccess, fixedUser, fixedClass, role)

  return (
    // <form onSubmit={handleSubmit}>
    //   {/* toàn bộ Input / Select ở đây */}
    // </form>
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          {userOptions && <Label htmlFor="user">Người dùng</Label>}
          {userOptions && <Select
            name="user"
            value={formData.userId?.toString()}
            onValueChange={(value: string) => handleChange("userId")(Number(value))}
          >
            <SelectTrigger className="w-full" id="user">
              <SelectValue placeholder="Chọn người dùng" />
            </SelectTrigger>
            <SelectContent>
              {userOptions.map(user => (
                <SelectItem key={user.data.userId} value={user.data.userId.toString()}>
                  {user.data.name} {user.data.studyPlace ? `({${user.data.studyPlace})` : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>}
          {classOptions && <Label htmlFor="class">Lớp học</Label>}
          {classOptions && <Select
            name="class"
            value={formData.classId?.toString()}
            onValueChange={(value: string) => handleChange("classId")(Number(value))}
          >
            <SelectTrigger className="w-full" id="class">
              <SelectValue placeholder="Chọn lớp học" />
            </SelectTrigger>
            <SelectContent>
              {classOptions.map(cls => (
                <SelectItem key={cls.data.classId} value={cls.data.classId.toString()}>
                  {cls.data.name} {cls.data.description ? `({${cls.data.description})` : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>}
        </div>
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
        <Button type="submit">Thêm</Button>
      </DialogFooter>
    </form>

  )
}

/* =======================
   3. Dialog: export
   ======================= */
export function CreateUserClassDialog({
  open,
  onOpenChange,
  onSuccess,
  fixedUser,
  fixedClass,
  userOptions,
  classOptions,
  role
}: {
  open: boolean,
  onOpenChange: (open: boolean) => void,
  onSuccess: () => void,
  fixedUser?: WithPermission<UserPublicDTO>,
  fixedClass?: WithPermission<ClassPublicDTO>,
  userOptions?: WithPermission<UserPublicDTO>[],
  classOptions?: WithPermission<ClassPublicDTO>[],
  role?: UserClassRole
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thêm người dùng mới vào lớp học</DialogTitle>
          <DialogDescription>
            Điền thông tin để thêm người dùng mới vào lớp học.
          </DialogDescription>
        </DialogHeader>

        <CreateUserClassForm
          fixedUser={fixedUser}
          fixedClass={fixedClass}
          userOptions={userOptions}
          classOptions={classOptions}
          role={role}
          onSuccess={onSuccess}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
