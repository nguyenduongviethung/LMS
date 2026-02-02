import axios from "axios";
import { toast } from "sonner";

const ERROR_MESSAGE_VI: Record<string, string> = {
    "USER.EMAIL_EXISTS": "Email đã tồn tại",
    "USER.FORBIDDEN_CREATE": "Bạn không có quyền thêm người dùng",
    "USER.FORBIDDEN_UPDATE": "Bạn không có quyền cập nhật người dùng này",
    "USER.FORBIDDEN_DELETE": "Bạn không có quyền xóa người dùng này",
    "USER.FORBIDDEN_GET_DETAIL": "Bạn không có quyền truy cập người dùng",
    "USER.NOT_FOUND": "Không tìm thấy người dùng",
    "CLASS.FORBIDDEN_GET": "Bạn không có quyền truy cập lớp học này",
    "CLASS.FORBIDDEN_CREATE": "Bạn không có quyền tạo lớp học",
    "CLASS.FORBIDDEN_UPDATE": "Bạn không có quyền cập nhật lớp học",
    "CLASS.FORBIDDEN_DELETE": "Bạn không có quyền xóa lớp học",
    "CLASS.NOT_FOUND": "Không tìm thấy lớp học",
    "USER_CLASS.FORBIDDEN_GET": "Bạn không có quyền truy cập người dùng trong lớp học này",
    "USER_CLASS.FORBIDDEN_CREATE": "Bạn không có quyền thêm người dùng vào lớp học",
    "USER_CLASS.FORBIDDEN_UPDATE": "Bạn không có quyền cập nhật người dùng trong lớp học",
    "USER_CLASS.FORBIDDEN_DELETE": "Bạn không có quyền xóa người dùng khỏi lớp học",
    "USER_CLASS.NOT_FOUND": "Không tìm thấy người dùng trong lớp học",
    "SESSION.FORBIDDEN_GET": "Bạn không có quyền truy cập buổi học này",
    "SESSION.FORBIDDEN_CREATE": "Bạn không có quyền tạo buổi học",
    "SESSION.FORBIDDEN_UPDATE": "Bạn không có quyền cập nhật buổi học",
    "SESSION.FORBIDDEN_DELETE": "Bạn không có quyền xóa buổi học",
    "SESSION.FORBIDDEN_ATTENDANCE_MANAGE": "Bạn không có quyền quản lý điểm danh",
    "SESSION.START_TIME_NOT_SET": "Chưa thiết lập thời gian bắt đầu buổi học",
    "SESSION.NOT_FOUND": "Không tìm thấy buổi học",
    "CONTENT.FORBIDDEN_CREATE": "Bạn không có quyền tạo nội dung buổi học",
    "CONTENT.FORBIDDEN_UPDATE": "Bạn không có quyền cập nhật nội dung buổi học",
    "SESSION_CONTENT.FORBIDDEN_GET": "Bạn không có quyền truy cập nội dung của buổi học",
    "SESSION_CONTENT.FORBIDDEN_CREATE": "Bạn không có quyền thêm nội dung vào buổi học",
    "SESSION_CONTENT.FORBIDDEN_DELETE": "Bạn không có quyền xóa nội dung khỏi buổi học",
    "SESSION_CONTENT.NOT_FOUND": "Không tìm thấy nội dung trong buổi học",
    "FILE.FILE_REQUIRED": "Không tìm thấy file tải lên",
    "FILE.FILENAME_AND_URL_REQUIRED": "Link và tên link không được để trống",
    "FILE.NOT_FOUND": "Không tìm thấy file",
    "FILE.FORBIDDEN_CREATE": "Bạn không có quyền upload file",
    "TASK_RESULT.FORBIDDEN_MANAGE": "Bạn không có quyền quản lý kết quả bài tập"
};

function toastError(err: { status: number; errorCode?: string }) {
    if (err.errorCode && ERROR_MESSAGE_VI[err.errorCode]) {
        toast.error(ERROR_MESSAGE_VI[err.errorCode]);
        return;
    }
    if (err.status === 403) {
        toast.error("Bạn không có quyền");
        return;
    }
    if (err.status >= 500) {
        toast.error("Lỗi hệ thống, vui lòng thử lại sau");
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
