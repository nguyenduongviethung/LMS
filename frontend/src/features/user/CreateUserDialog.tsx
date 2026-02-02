import React, { useState } from "react"
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from "../../ui/dialog"
import { CreateUserDTO } from "@shared/src/types/user.types"
import { useUser } from "./UserContext"
import { UserStatus, UserRole } from "@shared/src/enums/user.enum"
import { Label } from "../../ui/label"
import { Input } from "../../ui/input"
import { Button } from "../../ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../ui/select"
import { UserRoleBadge, UserStatusBadge } from "./UserBadge"
import { toast } from "sonner"
import { toDatetimeLocal } from "../../lib/DateTime"

/* =======================
   1. Hook: form logic
   ======================= */
function useCreateUserForm(onSuccess: () => void) {
  const { addUser } = useUser();
  const [formData, setFormData] = useState<CreateUserDTO>({
    name: '',
    email: '',
    password: '',
    role: UserRole.USER,
    status: UserStatus.ACTIVE,
    phone: "",
    birthDate: null,
    studyPlace: "",
    workPlace: ""
  })

  const handleChange =
    <K extends keyof CreateUserDTO>(key: K) =>
      (value: CreateUserDTO[K]) => {
        setFormData(prev => ({ ...prev, [key]: value }))
      }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addUser(formData)

      toast.success("Thêm người dùng thành công")
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
function CreateUserForm({
  onSuccess,
  onCancel
}: {
  onSuccess: () => void,
  onCancel: () => void
}) {
  const { formData, handleChange, handleSubmit } =
    useCreateUserForm(onSuccess)

  return (
    // <form onSubmit={handleSubmit}>
    //   {/* toàn bộ Input / Select ở đây */}
    // </form>
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Label htmlFor="name">Tên</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={e => handleChange("name")(e.target.value)}
            className="col-span-2"
            autoComplete="off"
          />
        </div>
        <div className="col-span-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            value={formData.email}
            onChange={e => handleChange("email")(e.target.value)}
            className="col-span-2"
            autoComplete="off"
          />
        </div>
        <div className="col-span-2">
          <Label htmlFor="phone">Số điện thoại</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={e => handleChange("phone")(e.target.value)}
            className="col-span-2"
            autoComplete="off"
          />
        </div>
        <div className="col-span-2">
          <Label htmlFor="password">Mật khẩu *</Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => handleChange("password")(e.target.value)}
            required={true}
          />
        </div>
        <div className="col-span-2">
          <Label htmlFor="birthDate">Ngày sinh</Label>
          <Input
            id="birthDate"
            type="date"
            value={toDatetimeLocal(formData.birthDate)}
            onChange={e => handleChange("birthDate")(e.target.value ? new Date(e.target.value) : null)}
            className="col-span-2"
          />
        </div>
        <div className="col-span-2">
          <Label htmlFor="studyPlace">Nơi học</Label>
          <Input
            id="studyPlace"
            value={formData.studyPlace}
            onChange={e => handleChange("studyPlace")(e.target.value)}
            className="col-span-2"
          />
        </div>
        <div className="col-span-2">
          <Label htmlFor="workPlace">Nơi làm việc</Label>
          <Input
            id="workPlace"
            value={formData.workPlace}
            onChange={e => handleChange("workPlace")(e.target.value)}
            className="col-span-2"
          />
        </div>
        <div className="col-span-2">
          <Label htmlFor="status">Trạng thái</Label>
          <Select
            name="status"
            value={formData.status}
            onValueChange={(value: UserStatus) => handleChange("status")(value)}
          >
            <SelectTrigger className="w-full" id="status">
              <SelectValue placeholder="Chọn trạng thái">
                <UserStatusBadge status={formData.status} />
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {Object.values(UserStatus).map(status => (
                <SelectItem key={status} value={status}>
                  <UserStatusBadge status={status} />
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-2">
          <Label htmlFor="role">Vai trò</Label>
          <Select
            name="role"
            value={formData.role}
            onValueChange={(value: UserRole) => handleChange("role")(value)}
          >
            <SelectTrigger className="w-full" id="role">
              <SelectValue placeholder="Chọn vai trò">
                <UserRoleBadge role={formData.role} />
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {Object.values(UserRole).map(role => (
                <SelectItem key={role} value={role}>
                  <UserRoleBadge role={role} />
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
export function CreateUserDialog({
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
          <DialogTitle>Thêm người dùng mới</DialogTitle>
          <DialogDescription>
            Điền thông tin để thêm người dùng mới vào hệ thống.
          </DialogDescription>
        </DialogHeader>

        <CreateUserForm
          onSuccess={onSuccess}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
