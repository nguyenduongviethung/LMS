import { Badge } from "../../ui/badge"
import { ContentType } from "@shared/src/enums/content.enum";

const TYPE_CONFIG: Record<ContentType, { label: string; variant: any }> = {
  LECTURE_MATERIAL: { label: "Tài liệu giảng dạy", variant: "default" },
  ASSIGNMENT: { label: "Bài tập", variant: "secondary" },
  HOMEWORK: { label: "Bài tập về nhà", variant: "outline" },
  QUIZ: { label: "Bài kiểm tra", variant: "destructive" },
}

export function ContentTypeBadge({ type }: { type: ContentType }) {
  const cfg = TYPE_CONFIG[type]
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>
}