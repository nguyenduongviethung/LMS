import { Badge } from "../../ui/badge"
import { UserClassRole } from "@shared/src/enums/userClass.enum";

const STATUS_CONFIG: Record<UserClassRole, { label: string; variant: any }> = {
  TEACHER: { label: "Giáo viên", variant: "default" },
  TEACHER_ASSISTANT: { label: "Trợ giảng", variant: "secondary" },
  STUDENT: { label: "Học sinh", variant: "outline" },
}

export function UserClassRoleBadge({ role }: { role: UserClassRole }) {
  const cfg = STATUS_CONFIG[role]
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>
}