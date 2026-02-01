import axios from "axios";
import { toast } from "sonner";

const ERROR_MESSAGE_VI: Record<string, string> = {
    "USER.EMAIL_EXISTS": "Email đã tồn tại",
    "USER.NOT_FOUND": "Không tìm thấy người dùng",
    "AUTH.FORBIDDEN": "Bạn không có quyền thực hiện hành động này",
    "VALIDATION.INVALID_EMAIL": "Email không hợp lệ",
};

function toastError(err: { status: number; errorCode?: string }) {
    if (err.status === 403) {
        toast.error("Bạn không có quyền");
        return;
    }
    if (err.status >= 500) {
        toast.error("Lỗi hệ thống, vui lòng thử lại sau");
        return;
    }
    if (err.errorCode && ERROR_MESSAGE_VI[err.errorCode]) {
        toast.error(ERROR_MESSAGE_VI[err.errorCode]);
        return;
    }
    toast.error("Thao tác thất bại");
}

export function handleApiError(error: unknown) {
    if (!error) {
        toast.error("Đã xảy ra lỗi không xác định");
        return;
    }
    if (axios.isAxiosError(error)) {
        const status = error.response?.status ?? 500;
        const errorCode = error.response?.data?.error;
        toastError({ status, errorCode });
    } else {
        const status = 500;
        const errorCode = undefined;
        toastError({ status, errorCode });
    }
}
