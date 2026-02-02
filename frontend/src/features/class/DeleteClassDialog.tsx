import { ClassPublicDTO } from "@shared/src/types/class.types";
import { WithPermission } from "@shared/src/types/permission.types";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogCancel, AlertDialogAction } from "../../ui/alert-dialog";
import { useClass } from "./ClassContext";
import { toast } from "sonner";
import { Button } from "../../ui/button";

export function DeleteClassDialog({
  cls,
  open,
  onOpenChange,
  onSuccess
}: {
  cls: WithPermission<ClassPublicDTO>,
  open: boolean,
  onOpenChange: (open: boolean) => void,
  onSuccess: () => void;
}) {
  const { deleteClass } = useClass();
  const handleSubmit = async () => {
    try {
      await deleteClass(cls.data.classId);
      toast("Xóa lớp học thành công")
      onSuccess();
    }
    catch (err) {}
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận xóa lớp học</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4">
              <p>Bạn có chắc chắn muốn xóa lớp học sau?</p>
              <div className="max-h-60 overflow-y-auto border rounded-lg p-4 bg-gray-50">
                <div className="flex-1">
                  <div className="font-medium">{cls.data.name}</div>
                  {cls.data.description && <div className="text-sm text-muted-foreground">
                    Mô tả: {cls.data.description}
                  </div>}
                  <div className="text-sm text-muted-foreground">
                    Ngày tạo: {cls.data.createdAt.toLocaleDateString('vi-VN')}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Cập nhật lần cuối: {cls.data.updatedAt.toLocaleDateString('vi-VN')}
                  </div>
                </div>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button onClick={handleSubmit} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Xóa lớp học
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}