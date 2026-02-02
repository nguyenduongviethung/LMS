import { SessionPublicDTO } from "@shared/src/types/session.types";
import { WithPermission } from "@shared/src/types/permission.types";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogCancel, AlertDialogAction } from "../../ui/alert-dialog";
import { Button } from "../../ui/button";
import { useSession } from "./SessionContext";
import { toast } from "sonner";

export function DeleteSessionDialog({
  session,
  open,
  onOpenChange,
  onSuccess
}: {
  session: WithPermission<SessionPublicDTO>
  open: boolean,
  onOpenChange: (open: boolean) => void,
  onSuccess: () => void;
}) {
  const { deleteSession } = useSession();
  const handleSubmit = async () => {
    try {
      await deleteSession(session.data.sessionId);
      toast.success("Xóa buổi học thành công")
      onSuccess();
    }
    catch (err) {}
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận xóa buổi học</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4">
              <p>Bạn có chắc chắn muốn xóa buổi học sau?</p>
              <div className="max-h-60 overflow-y-auto border rounded-lg p-4 bg-gray-50">
                <div className="flex-1">
                  <div className="font-medium">{session.data.name}</div>
                  {session.data.description && <div className="text-sm text-muted-foreground">
                    Mô tả: {session.data.description}
                  </div>}
                  <div className="text-sm text-muted-foreground">
                    Ngày tạo: {session.data.createdAt.toLocaleDateString('vi-VN')}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Cập nhật lần cuối: {session.data.updatedAt.toLocaleDateString('vi-VN')}
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
            Xóa buổi học
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}