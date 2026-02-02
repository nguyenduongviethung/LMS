import { Badge } from "../../ui/badge"
import { TaskResultStatus } from "@shared/src/enums/taskResult.enum";

const STATUS_CONFIG: Record<TaskResultStatus, { label: string; variant: any }> = {
  COMPLETED: { label: "Hoàn thành", variant: "default" },
  PENDING: { label: "Chưa hoàn thành", variant: "secondary" },
  OVERDUE: { label: "Quá hạn", variant: "destructive"},
  NOT_TAKEN: { label: "Chưa chấm điểm", variant: "outline" },
}

export function TaskResultStatusBadge({ status }: { status: TaskResultStatus }) {
  const cfg = STATUS_CONFIG[status]
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>
}