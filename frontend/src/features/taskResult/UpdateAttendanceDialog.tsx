import React, { useState } from "react"
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from "../../ui/dialog"
import { UpdateTaskResultDTO, TaskResultPublicDTO } from "@shared/src/types/taskResult.types"
import { Label } from "../../ui/label"
import { Input } from "../../ui/input"
import { Button } from "../../ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../ui/select"
import { toast } from "sonner"
import { useTaskResult } from "./TaskResultContext"
import { TaskResultStatus } from "@shared/src/enums/taskResult.enum"
import { TaskResultStatusBadge } from "./TaskResultBadge"

/* =======================
   1. Hook: form logic
   ======================= */
function useUpdateTaskResultForm(taskResult: TaskResultPublicDTO, onSuccess: () => void) {
  const { updateTaskResult } = useTaskResult();
  const [formData, setFormData] = useState<UpdateTaskResultDTO>({
    score: taskResult.score,
    status: taskResult.status,
    reviews: taskResult.reviews
  })

  const handleChange =
    <K extends keyof UpdateTaskResultDTO>(key: K) =>
      (value: UpdateTaskResultDTO[K]) => {
        setFormData(prev => ({ ...prev, [key]: value }))
      }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateTaskResult(taskResult.content.contentId, taskResult.user.userId, formData)

      toast.success("Cập nhật kết quả thành công");
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
function UpdateTaskResultForm({
  taskResult,
  onSuccess,
  onCancel
}: {
  taskResult: TaskResultPublicDTO
  onSuccess: () => void,
  onCancel: () => void
}) {
  const { formData, handleChange, handleSubmit } =
    useUpdateTaskResultForm(taskResult, onSuccess)

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <div className="col-span-2">
            <div className="col-span-2">
              <Label htmlFor="score">Điểm</Label>
              <Input
                id="score"
                value={formData.score?.toString()}
                onChange={e => {
                  if (taskResult.content.cutoffScore && Number(e.target.value)) {
                    if (Number(e.target.value) >= taskResult.content.cutoffScore) handleChange("status")(TaskResultStatus.COMPLETED);
                    else handleChange("status")(TaskResultStatus.PENDING);
                  }
                  handleChange("score")(Number(e.target.value) ?? null)}
                }
                className="col-span-2"
              />
            </div>
            <Label htmlFor="status">Trạng thái *</Label>
            <Select
              value={formData.status}
              onValueChange={(value: TaskResultStatus) => handleChange("status")(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn trạng thái">
                  <TaskResultStatusBadge status={formData.status} />
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {Object.values(TaskResultStatus).map((status) => (
                  <SelectItem key={status} value={status}>
                    <TaskResultStatusBadge status={status} />
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="col-span-2">
          <Label htmlFor="name">Nhận xét</Label>
          <Input
            id="name"
            value={formData.reviews}
            onChange={e => handleChange("reviews")(e.target.value)}
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
export function UpdateTaskResultDialog({
  taskResult,
  open,
  onOpenChange,
  onSuccess
}: {
  taskResult: TaskResultPublicDTO
  open: boolean,
  onOpenChange: (open: boolean) => void,
  onSuccess: () => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chỉnh sửa điểm danh</DialogTitle>
          <DialogDescription>
            Chỉnh sửa thông tin điểm danh.
          </DialogDescription>
        </DialogHeader>
        <UpdateTaskResultForm
          taskResult={taskResult}
          onSuccess={onSuccess}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
