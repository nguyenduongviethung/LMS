import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogCancel, AlertDialogAction } from "../../ui/alert-dialog";
import { Button } from "../../ui/button";
import { useUser } from "./UserContext";
import { toast } from "sonner";
import { UserPublicDTO } from "@shared/src/types/user.types";
import { WithPermission } from "@shared/src/types/permission.types";

export function DeleteUserDialog({
  user,
  open,
  onOpenChange,
  onSuccess
}: {
  user: WithPermission<UserPublicDTO>;
  open: boolean,
  onOpenChange: (open: boolean) => void,
  onSuccess: () => void;
}) {
  const { deleteUser } = useUser();
  const handleSubmit = async () => {
    if (!user) return;
    try {
      await deleteUser(user.data.userId);
      toast("Xóa người dùng thành công")
      onSuccess();
    }
    catch (err) {
      toast("Xóa người dùng thất bại")
    }
  }

  return user && (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận xóa người dùng</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4">
              <p>Bạn có chắc chắn muốn xóa người dùng sau?</p>
              <div className="max-h-60 overflow-y-auto border rounded-lg p-4 bg-gray-50">
                <div className="flex-1">
                  <div className="font-medium">{user.data.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {user.data.email}{user.data.phone ? ` • ${user.data.phone}` : ""}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Ngày tạo: {new Date(user.data.createdAt).toLocaleDateString("vi-VN")}
                  </div>
                  {user.data.studyPlace && (
                    <div className="text-sm text-muted-foreground">
                      Nơi học tập: {user.data.studyPlace}
                    </div>
                  )}
                  {user.data.workPlace && (
                    <div className="text-sm text-muted-foreground">
                      Nơi làm việc: {user.data.workPlace}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button onClick={handleSubmit} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Xóa người dùng
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}