import { ContentPublicDTO } from "@shared/src/types/content.types";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogCancel, AlertDialogAction } from "../../ui/alert-dialog";
import { Button } from "../../ui/button";
import { useContent } from "./ContentContext";
import { toast } from "sonner";
import { SessionPublicDTO } from "@shared/src/types/session.types";
import { WithPermission } from "@shared/src/types/permission.types";

export function DeleteContentDialog({
  session,
  content,
  open,
  onOpenChange,
  onSuccess
}: {
  session: WithPermission<SessionPublicDTO>
  content: WithPermission<ContentPublicDTO>
  open: boolean,
  onOpenChange: (open: boolean) => void,
  onSuccess: () => void;
}) {
  const { detachContent } = useContent();
  const handleSubmit = async () => {
    try {
      await detachContent(session.data.sessionId, content.data.contentId);
      toast.success("Xóa nội dung thành công");
      onSuccess();
    }
    catch (err) {}
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận xóa nội dung</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4">
              <p>Bạn có chắc chắn muốn xóa nội dung sau?</p>
              <div className="max-h-60 overflow-y-auto border rounded-lg p-4 bg-gray-50">
                <div className="flex-1">
                  <div className="font-medium">{content.data.name}</div>
                  {content.data.description && <div className="text-sm text-muted-foreground">
                    Mô tả: {content.data.description}
                  </div>}
                  <div className="text-sm text-muted-foreground">
                    Ngày tạo: {content.data.createdAt.toLocaleDateString('vi-VN')}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Cập nhật lần cuối: {content.data.updatedAt.toLocaleDateString('vi-VN')}
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
            Xóa nội dung
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}