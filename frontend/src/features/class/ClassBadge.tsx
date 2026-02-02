import { Badge } from "../../ui/badge"
import { ClassStatus } from "@shared/src/enums/class.enum";

const STATUS_CONFIG: Record<ClassStatus, { label: string; variant: any }> = {
  OPEN: { label: "Đang mở", variant: "default" },
  CLOSED: { label: "Đã đóng", variant: "secondary" },
  ARCHIVED: { label: "Đã lưu trữ", variant: "destructive" },
}

export function ClassStatusBadge({ status }: { status: ClassStatus }) {
  const cfg = STATUS_CONFIG[status]
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>
}