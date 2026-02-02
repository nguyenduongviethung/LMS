import { Badge } from "../../ui/badge"
import { AttendanceStatus } from "@shared/src/enums/attendance.enum";

const STATUS_CONFIG: Record<AttendanceStatus, { label: string; variant: any }> = {
  PRESENT: { label: "Có mặt", variant: "default" },
  ABSENT: { label: "Vắng mặt", variant: "destructive" },
  NOT_TAKEN: { label: "Chưa điểm danh", variant: "outline" },
}

export function AttendanceStatusBadge({ status }: { status: AttendanceStatus }) {
  const cfg = STATUS_CONFIG[status]
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>
}