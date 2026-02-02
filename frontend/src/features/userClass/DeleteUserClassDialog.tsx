import { UserClassPublicDTO } from "@shared/src/types/userClass.types";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogCancel, AlertDialogAction } from "../../ui/alert-dialog";
import { Button } from "../../ui/button";
import { useUserClass } from "./UserClassContext";
import { toast } from "sonner";
import { WithPermission } from "@shared/src/types/permission.types";

export function DeleteUserClassDialog({
  userClass,
  open,
  onOpenChange,
  onSuccess
}: {
  userClass: WithPermission<UserClassPublicDTO>
  open: boolean,
  onOpenChange: (open: boolean) => void,
  onSuccess: () => void;
}) {
  const { deleteUserClass } = useUserClass();
  const handleSubmit = async () => {
    try {
      deleteUserClass(userClass.data.userClassId);
      toast.success("Xóa người dùng khỏi lớp học thành công")
      onSuccess();
    }
    catch (err) {}
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận xóa người dùng khỏi lớp học</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4">
              <p>Bạn có chắc chắn muốn xóa người dùng khỏi lớp học sau?</p>
              <div className="max-h-60 overflow-y-auto border rounded-lg p-4 bg-gray-50">
                <div className="flex-1">
                  <div className="font-medium">{userClass.data.user.name}</div>
                  {userClass.data.user.studyPlace && <div className="text-sm text-muted-foreground">
                    Nơi học tập: {userClass.data.user.studyPlace}
                  </div>}
                  {userClass.data.user.workPlace && <div className="text-sm text-muted-foreground">
                    Nơi làm việc: {userClass.data.user.workPlace}
                  </div>}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{userClass.data.class.name}</div>
                  {userClass.data.class.description && <div className="text-sm text-muted-foreground">
                    Mô tả: {userClass.data.class.description}
                  </div>}
                  <div className="text-sm text-muted-foreground">
                    Ngày tạo: {userClass.data.class.createdAt.toLocaleDateString('vi-VN')}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Cập nhật lần cuối: {userClass.data.class.updatedAt.toLocaleDateString('vi-VN')}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-sm text-muted-foreground">
                    Ngày vào học: {userClass.data.enrolledAt.toLocaleDateString('vi-VN')}
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
              Xóa
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}