import { Badge } from "../../ui/badge"
import { UserRole, UserStatus } from "@shared/src/enums/user.enum"

const STATUS_CONFIG: Record<UserStatus, { label: string; variant: any }> = {
  ACTIVE: { label: "Hoạt động", variant: "default" },
  INACTIVE: { label: "Không hoạt động", variant: "secondary" },
  SUSPENDED: { label: "Đã khóa", variant: "destructive" },
}

export function UserStatusBadge({ status }: { status: UserStatus }) {
  const cfg = STATUS_CONFIG[status]
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>
}

const ROLE_CONFIG: Record<UserRole, { label: string, variant: any}> = {
  ADMIN: { label: "Quản trị viên", variant: "default"},
  USER: { label: "Người dùng", variant: "outline"}
}

export function UserRoleBadge({ role }: { role: UserRole }) {
  const cfg = ROLE_CONFIG[role]
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>
}