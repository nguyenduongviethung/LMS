import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { ArrowLeft, Plus, Pencil, Trash2, FileText, Calendar, Clock, Link as LinkIcon, Upload, FileCheck, Edit, ClipboardCheck } from 'lucide-react';
import { toast } from 'sonner';
import { useSession } from './SessionContext';
import { SessionPublicDTO } from '@shared/src/types/session.types';
import { WithPermission } from '@shared/src/types/permission.types';
import { UpdateSessionDialog } from '../../features/session/UpdateSessionDialog';
import { useContent } from '../content/ContentContext';
import { ContentPublicDTO } from '@shared/src/types/content.types';
import { ContentTypeBadge } from '../../features/content/ContentBadge';
import { CreateContentDialog } from '../../features/content/CreateContentDialog';
import { UpdateContentDialog } from '../../features/content/UpdateContentDialog';
import { FileType } from '@shared/src/enums/file.enum';
import { ContentFileRole } from '@shared/src/enums/contentFile.enum';
import { FilePublicDTO } from '@shared/src/types/file.types';
import { AttendanceProvider, useAttendance } from '../attendance/AttendanceContext';
import { AttendanceStatusBadge } from '../../features/attendance/AttendanceBadge';
import { AttendancePublicDTO } from '@shared/src/types/attendance.types';
import { UpdateAttendanceDialog } from '../../features/attendance/UpdateAttendanceDialog';
import { DeleteSessionDialog } from '../../features/session/DeleteSessionDialog';
import { DeleteContentDialog } from '../../features/content/DeleteSessionDialog';
import { ContentType } from '@shared/src/enums/content.enum';
import { TaskResultProvider, useTaskResult } from '../taskResult/TaskResultContext';
import { TaskResultStatusBadge } from '../../features/taskResult/TaskResultBadge';
import { TaskResultPublicDTO } from '@shared/src/types/taskResult.types';
import { UpdateTaskResultDialog } from '../../features/taskResult/UpdateAttendanceDialog';
import { useFile } from '../file/FileContext';

const ContentFileSection: React.FC<{
  title: string
  icon: React.ReactNode
  role: ContentFileRole
  contentFiles: {
    file: FilePublicDTO,
    role: ContentFileRole
  }[]
  openFile: (file: FilePublicDTO) => void
}> = ({
  title,
  icon,
  role,
  contentFiles,
  openFile,
}) => {
    const filteredContentFiles = contentFiles.filter(contentFile => contentFile.role === role)

    return (
      <div>
        <div className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
          {icon}
          {title}
        </div>

        {filteredContentFiles.length > 0 ? (
          <div className="space-y-1">
            {filteredContentFiles.map(contentFile => (
              <div key={contentFile.file.fileId} className="flex items-center gap-1">
                {contentFile.file.filetype === FileType.FILE ? (
                  <button
                    onClick={() => openFile(contentFile.file)}
                    className="text-sm text-blue-600 hover:underline truncate text-left"
                    title={contentFile.file.filename}
                  >
                    📄 {contentFile.file.filename}
                  </button>
                ) : (
                  <a
                    href={contentFile.file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline truncate"
                    title={contentFile.file.filename}
                  >
                    📄 {contentFile.file.filename}
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-gray-500 italic">Chưa có file</div>
        )}
      </div>
    )
  }


const SessionContentsCard: React.FC<{ session: WithPermission<SessionPublicDTO>, contents: WithPermission<ContentPublicDTO>[], openFile: (file: FilePublicDTO) => void, onChange: () => void }> = ({ session, contents, openFile, onChange }) => {
  const [selectedContent, setSelectedContent] = useState<WithPermission<ContentPublicDTO> | null>(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const handleCreate = () => {
    setSelectedContent(null);
    setOpenCreate(true);
  }
  const handleUpdate = (content: WithPermission<ContentPublicDTO>) => {
    setSelectedContent(content);
    setOpenUpdate(true);
  }

  const handleDelete = (content: WithPermission<ContentPublicDTO>) => {
    setSelectedContent(content);
    setOpenDelete(true);
  }

  const handleSuccess = () => {
    onChange();
    setOpenCreate(false);
    setOpenUpdate(false);
    setOpenDelete(false);
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-xl">Nội dung buổi học ({contents.length})</h2>
          {session.permission.canUpdate && <Button onClick={handleCreate}>
            <Plus className="size-4 mr-2" />
            Thêm nội dung
          </Button>}
        </div>
      </CardHeader>
      <CardContent>
        {contents.length > 0 ? (
          <div className="space-y-4">
            {contents.map((content, index) => (
              <div
                key={content.data.contentId}
                className="p-4 border-l-4 border-blue-500 bg-blue-50 rounded relative"
              >
                <div className="absolute top-2 right-2 flex gap-1">
                  {content.permission.canUpdate && <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleUpdate(content)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>}
                  {content.permission.canUpdate && <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(content)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>}
                </div>

                <div className="space-y-3 pr-20">
                  <div className="flex items-start gap-2">
                    <h4 className="font-medium">
                      {index + 1}. {content.data.name}
                    </h4>
                    <ContentTypeBadge type={content.data.type} />
                  </div>

                  {content.data.description && (
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-1">
                        📝 Mô tả:
                      </div>
                      <div className="text-sm text-gray-600 whitespace-pre-wrap pl-4">
                        {content.data.description}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    {content.data.type != ContentType.LECTURE_MATERIAL && content.data.deadline && (
                      <div>
                        <span className="font-medium text-gray-700">Hạn nộp:</span>{' '}
                        <span className="text-gray-600">
                          {content.data.deadline?.toLocaleString('vi-VN')}
                        </span>
                      </div>
                    )}
                    {content.data.type != ContentType.LECTURE_MATERIAL && (
                      <div>
                        <span className="font-medium text-gray-700">Điểm chuẩn:</span>{' '}
                        <span className="text-gray-600">{content.data.cutoffScore ?? "Chưa xác định"}</span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-2 border-t">
                    <ContentFileSection title="File bài học" icon={<Upload className="h-4 w-4" />} role={ContentFileRole.LESSON_FILE} contentFiles={content.data.contentFiles} openFile={openFile} />
                    <ContentFileSection title="File bài chữa" icon={<FileCheck className="h-4 w-4" />} role={ContentFileRole.CORRECTION_FILE} contentFiles={content.data.contentFiles} openFile={openFile} />
                    <ContentFileSection title="Link nộp bài" icon={<LinkIcon className="h-4 w-4" />} role={ContentFileRole.SUBMISSION_LINK} contentFiles={content.data.contentFiles} openFile={openFile} />

                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            Buổi học chưa có nội dung nào
          </div>
        )}
      </CardContent>
      {!selectedContent && <CreateContentDialog open={openCreate} onOpenChange={setOpenCreate} onSuccess={handleSuccess} session={session} />}
      {selectedContent && <UpdateContentDialog open={openUpdate} onOpenChange={setOpenUpdate} onSuccess={handleSuccess} content={selectedContent} />}
      {selectedContent && <DeleteContentDialog open={openDelete} onOpenChange={setOpenDelete} onSuccess={handleSuccess} content={selectedContent} session={session} />}
    </Card>
  )
}

const SessionAttendancesCard: React.FC<{ session: WithPermission<SessionPublicDTO> }> = ({ session }) => {
  const { attendances, fetchSessionAttendance, ensureAttendance } = useAttendance();


  useEffect(() => {
    fetchSessionAttendance(session.data.sessionId)
  }, [session.data.sessionId]);

  const [selectedAttendance, setSelectedAttendance] = useState<AttendancePublicDTO | null>(null);
  const [openUpdate, setOpenUpdate] = useState(false);
  const handleEnsure = async () => {
    try {
      await ensureAttendance(session.data.sessionId);
      await fetchSessionAttendance(session.data.sessionId);
      toast.success("Khởi tạo điểm danh thành công");
    }
    catch (err) {}
  }
  const handleUpdate = (attendance: AttendancePublicDTO) => {
    setSelectedAttendance(attendance);
    setOpenUpdate(true);
  }
  const handleSuccess = () => {
    fetchSessionAttendance(session.data.sessionId);
    setOpenUpdate(false);
  }

  return attendances && (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Điểm danh</CardTitle>
          {session.permission.canManageAttendance && <Button
            variant="outline"
            onClick={handleEnsure}
          >
            <ClipboardCheck className="size-4 mr-2" />
            Khởi tạo điểm danh
          </Button>}
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Học sinh</TableHead>
              <TableHead>Nơi học tập</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Ghi chú</TableHead>
              <TableHead className='text-right'>Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attendances
              .map(attendance => {
                if (!attendance) return null;
                return (
                  <TableRow key={`attendance-${attendance.user.userId}-${session.data.sessionId}`}>
                    <TableCell>{attendance.user.name}</TableCell>
                    <TableCell>{attendance.user.studyPlace}</TableCell>
                    <TableCell>
                      <AttendanceStatusBadge status={attendance.status} />
                    </TableCell>
                    <TableCell>{attendance.note}</TableCell>
                    <TableCell className='text-right space-x-2'>
                      {session.permission.canManageAttendance && <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUpdate(attendance)}
                      >
                        <Edit className='size-4' />
                      </Button>}
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </CardContent>
      {selectedAttendance && <UpdateAttendanceDialog open={openUpdate} onOpenChange={setOpenUpdate} attendance={selectedAttendance} onSuccess={handleSuccess} />}
    </Card>
  )
}

const SessionTaskResultTable: React.FC<{ session: WithPermission<SessionPublicDTO>, content: WithPermission<ContentPublicDTO> }> = ({ session, content }) => {
  const { taskResults, fetchSessionContentTaskResult, ensureTaskResult } = useTaskResult();
  useEffect(() => {
    fetchSessionContentTaskResult(session.data.sessionId, content.data.contentId);
  }, [session.data.sessionId, content.data.contentId]);

  const [selectedTaskResult, setSelectedTaskResult] = useState<TaskResultPublicDTO | null>(null);
  const [openUpdate, setOpenUpdate] = useState(false);
  const handleEnsure = async () => {
    try {
      await ensureTaskResult(session.data.sessionId, content.data.contentId);
      await fetchSessionContentTaskResult(session.data.sessionId, content.data.contentId);
      toast.success("Khởi tạo kết quả thành công")
    }
    catch (err) {}
  }

  const handleUpdate = (taskResult: TaskResultPublicDTO) => {
    setSelectedTaskResult(taskResult);
    setOpenUpdate(true);
  }
  const handleSuccess = () => {
    fetchSessionContentTaskResult(session.data.sessionId, content.data.contentId);
    setOpenUpdate(false);
  }

  return (
    <div key={content.data.contentId}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold mb-4 pb-2 border-b">
          {content.data.name}
        </h3>
        {content.permission.canManageTaskResult && <Button
          variant="outline"
          onClick={handleEnsure}
        >
          <ClipboardCheck className="size-4 mr-2" />
          Khởi tạo kết quả
        </Button>}
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Học sinh</TableHead>
            <TableHead>Nội dung</TableHead>
            <TableHead>Điểm</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Nhận xét</TableHead>
            <TableHead className='text-right'>Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {taskResults.map((taskResult) => {
            return (
              <TableRow key={taskResult.user.userId}>
                <TableCell>
                  <Link
                    to={`/users/${taskResult.user.userId}`}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    {taskResult.user.name}
                  </Link>
                </TableCell>
                <TableCell>{taskResult.content.name}</TableCell>
                <TableCell>{taskResult.score}</TableCell>
                <TableCell><TaskResultStatusBadge status={taskResult.status} /></TableCell>
                <TableCell className="text-sm text-gray-500">
                  {taskResult.reviews || '-'}
                </TableCell>
                <TableCell className='text-right space-x-2'>
                  {content.permission.canManageTaskResult && <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleUpdate(taskResult)}
                  >
                    <Edit className='size-4' />
                  </Button>}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {selectedTaskResult && <UpdateTaskResultDialog open={openUpdate} onOpenChange={setOpenUpdate} onSuccess={handleSuccess} taskResult={selectedTaskResult} />}
    </div>
  )
}

const SessionTaskResultCard: React.FC<{ session: WithPermission<SessionPublicDTO>, contents: WithPermission<ContentPublicDTO>[], type: ContentType, title: string }> = ({ session, contents, type, title }) => {
  const filteredContents = contents.filter(content => content.data.type === type);
  const [selectedContentId, setSelectedContentId] = useState<string | 'all'>('all')

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Chọn nội dung:</span>
            <Select value={selectedContentId} onValueChange={setSelectedContentId}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem key="all" value="all">
                  Tất cả
                </SelectItem>
                {filteredContents.length > 0 ? (
                  filteredContents.map(content => (
                    <SelectItem key={`${session.data.sessionId}-${content.data.contentId}`} value={content.data.contentId.toString()}>
                      {content.data.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>
                    Chưa có nội dung
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {Object.keys(filteredContents).length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            Không có nội dung nào
          </div>
        ) : selectedContentId !== 'all' && filteredContents.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            Không có lần điểm danh nào trong tháng này
          </div>
        ) : (
          <div className="space-y-8">
            {filteredContents.map((content) => (selectedContentId === 'all' || selectedContentId === content.data.contentId.toString()) && (

              <TaskResultProvider key={content.data.contentId}>
                <SessionTaskResultTable session={session} content={content} />
              </TaskResultProvider>

            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export const SessionDetailPage: React.FC = () => {
  const { sessionId: sessionIdString } = useParams();
  const sessionId = Number(sessionIdString);
  if (Number.isNaN(sessionId)) throw new Error("Invalid sessionId: NaN");

  const { currentSession: session, fetchSession } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      await fetchSession(sessionId);
    }
    fetchData();
  }, []);


  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const handleEdit = () => {
    setOpenEdit(true);
  }
  const handleDelete = () => {
    setOpenDelete(true);
  }
  const handleSuccess = () => {
    fetchSession(sessionId);
    setOpenEdit(false);
    setOpenDelete(false);
  }

  const { contents, fetchContents } = useContent();
  const { openFile } = useFile();
  useEffect(() => {
    fetchContents(sessionId);
  }, []);
  const handleContentChange = () => {
    fetchContents(sessionId);
  }

  return session && (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" asChild>
          <Link to="/sessions">
            <ArrowLeft className='size-4 mr-2' />
            Quay lại
          </Link>
        </Button>
        <div className='flex-1'>
          <h1 className="text-3xl">{session.data.name}</h1>
          <div className="space-y-2">
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <FileText className="size-4" />
                {session.data.class.name}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="size-4" />
                {session.data.startTime?.toLocaleDateString('vi-VN') ?? 'Chưa xác định'}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="size-4" />
                {session.data.duration ? `${session.data.duration} phút` : "Chưa xác định"}
              </div>
            </div>
          </div>
        </div>

        {session.permission.canUpdate && <Button
          variant="outline"
          size="sm"
          onClick={handleEdit}
        >
          <Edit className='size-4 mr-2' />
          Sửa
        </Button>}
        {session.permission.canDelete && <Button
          variant="destructive"
          size="sm"
          onClick={handleDelete}
        >
          <Trash2 className="size-4 mr-2" />
          Xóa
        </Button>}
        <UpdateSessionDialog open={openEdit} onOpenChange={setOpenEdit} session={session} onSuccess={handleSuccess} />
        <DeleteSessionDialog open={openDelete} onOpenChange={setOpenDelete} session={session} onSuccess={handleSuccess} />
      </div>

      {/* Session Info Card */}
      <Card>
        <CardHeader>
          <h2 className="text-xl">Thông tin buổi học</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          {session.data.description.length > 0 && (
            <div>
              <div className="text-base font-medium">Mô tả</div>
              <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">
                {session.data.description}
              </p>
            </div>

          )}
        </CardContent>
      </Card>

      {/* Contents */}
      <SessionContentsCard session={session} contents={contents} onChange={handleContentChange} openFile={openFile} />

      {/* Attendance Section */}
      <AttendanceProvider>
        <SessionAttendancesCard session={session} />
      </AttendanceProvider>

      {/* Task Results Section */}
      <SessionTaskResultCard session={session} contents={contents} type={ContentType.ASSIGNMENT} title="Kết quả bài tập" />
      <SessionTaskResultCard session={session} contents={contents} type={ContentType.QUIZ} title="Kết quả bài kiểm tra" />
      <SessionTaskResultCard session={session} contents={contents} type={ContentType.HOMEWORK} title="Kết quả bài tập về nhà" />

    </div>
  );
};