import React, { useState } from "react"
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from "../../ui/dialog"
import { CreateContentDTO } from "@shared/src/types/content.types"
import { useContent } from "./ContentContext"
import { Label } from "../../ui/label"
import { Input } from "../../ui/input"
import { Button } from "../../ui/button"
import { toast } from "sonner"
import { ContentType } from "@shared/src/enums/content.enum"
import { FileUploadManager } from "../file/FileUploadManager"
import { ContentFileRole } from "@shared/src/enums/contentFile.enum"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../ui/select"
import { ContentTypeBadge } from "./ContentBadge"
import { toDatetimeLocal } from "../../lib/DateTime"
import { SessionPublicDTO } from "@shared/src/types/session.types"
import { WithPermission } from "@shared/src/types/permission.types"
import { useFile } from "../file/FileContext"

/* =======================
   1. Hook: form logic
   ======================= */
function useCreateContentForm(session: SessionPublicDTO, onSuccess: () => void) {
  const { addContent, attachContent } = useContent();
  const { addFile, addLink, openFile } = useFile();
  const [formData, setFormData] = useState<CreateContentDTO>({
    name: '',
    description: '',
    deadline: null,
    cutoffScore: null,
    type: ContentType.LECTURE_MATERIAL,
    contentFiles: []
  })

  const handleChange =
    <K extends keyof CreateContentDTO>(key: K) =>
      (value: CreateContentDTO[K]) => {
        setFormData(prev => ({ ...prev, [key]: value }))
      }

  const handleUploadFile = async (file: File, role: ContentFileRole) => {
    const uploaded = await addFile(file);

    setFormData(prev => ({
      ...prev,
      contentFiles: [
        ...(prev.contentFiles ?? []),
        {
          file: uploaded,
          role: role
        }
      ]
    }));
  };

  const handleAddLink = async ({ name, url }: { name: string, url: string }, role: ContentFileRole) => {
    const newLink = await addLink({ name, url });
    setFormData(prev => ({
      ...prev,
      contentFiles: [
        ...(prev.contentFiles ?? []),
        {
          file: newLink,
          role: role
        }
      ]
    }));
  };

  const handleRemoveFile = async (fileId: number) => {
    setFormData(prev => ({
      ...prev,
      files: formData.contentFiles.filter(contentFile => contentFile.file.fileId != fileId)
    }));
  };

  const handleOpenFile = openFile;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const contentId = await addContent(formData).then(content => content.contentId);
      await attachContent(session.sessionId, contentId);
      toast.success("Thêm nội dung thành công");
      onSuccess();
    } catch (err) {}
  };

  return {
    formData,
    handleChange,
    handleUploadFile,
    handleAddLink,
    handleRemoveFile,
    handleOpenFile,
    handleSubmit,
  }
}

/* =======================
   2. Form: chỉ render
   ======================= */
function CreateContentForm({
  onSuccess,
  onCancel,
  session
}: {
  onSuccess: () => void,
  onCancel: () => void,
  session: SessionPublicDTO
}) {
  const { formData, handleChange, handleUploadFile, handleAddLink, handleRemoveFile, handleOpenFile, handleSubmit } =
    useCreateContentForm(session, onSuccess)

  return (
    <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 min-h-0 overflow-y-auto pr-2">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Label htmlFor="name">Tiêu đề</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={e => handleChange("name")(e.target.value)}
              className="col-span-2"
              autoComplete="off"
            />
          </div>
          <div className="col-span-2">
            <Label htmlFor="content-description">Mô tả nội dung</Label>
            <Input
              id="content-description"
              value={formData.description}
              onChange={e => handleChange("description")(e.target.value)}
              className="col-span-2"
              autoComplete="off"
            />
          </div>
          <div className="col-span-2">
            <Label htmlFor="type">Loại nội dung</Label>
            <Select
              name="type"
              value={formData.type}
              onValueChange={(value: ContentType) => handleChange("type")(value)}
            >
              <SelectTrigger className="w-full" id="type">
                <SelectValue placeholder="Chọn loại nội dung">
                  <ContentTypeBadge type={formData.type} />
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {Object.values(ContentType).map(type => (
                  <SelectItem key={type} value={type}>
                    <ContentTypeBadge type={type} />
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {formData.type != ContentType.LECTURE_MATERIAL && <div className="col-span-2">
            <Label htmlFor="deadline">Hạn nộp</Label>
            <Input
              id="deadline"
              type="datetime-local"
              value={toDatetimeLocal(formData.deadline)}
              onChange={e => handleChange("deadline")(e.target.value ? new Date(e.target.value) : null)}
              className="col-span-2"
            />
          </div>}
          {formData.type != ContentType.LECTURE_MATERIAL && <div className="col-span-2">
            <Label htmlFor="cutoffScore">Điểm chuẩn</Label>
            <Input
              id="cutoffScore"
              value={formData.cutoffScore?.toString() ?? ""}
              onChange={e => handleChange("cutoffScore")(e.target.value ? Number(e.target.value) ?? null : null)}
              className="col-span-2"
            />
          </div>}
          <div className="col-span-2">
            <FileUploadManager
              label="📚 File bài học"
              files={formData.contentFiles.filter(contentFile => contentFile.role === ContentFileRole.LESSON_FILE).map(contentFile => contentFile.file)}
              placeholder="Tên file bài học (VD: Slide bài giảng.pdf)"
              onUploadFile={async (file: File) => handleUploadFile(file, ContentFileRole.LESSON_FILE)}
              onAddLink={async ({ name, url }) => handleAddLink({ name, url }, ContentFileRole.LESSON_FILE)}
              onOpenFile={handleOpenFile}
              onRemoveFile={async (fileId: number) => handleRemoveFile(fileId)}
            />
          </div>
          <div className="col-span-2">
            <FileUploadManager
              label="✅ File bài chữa"
              files={formData.contentFiles.filter(contentFile => contentFile.role === ContentFileRole.CORRECTION_FILE).map(contentFile => contentFile.file)}
              placeholder="Tên file bài chữa (VD: Đáp án bài tập.pdf)"
              onUploadFile={async (file: File) => handleUploadFile(file, ContentFileRole.CORRECTION_FILE)}
              onAddLink={async ({ name, url }) => handleAddLink({ name, url }, ContentFileRole.CORRECTION_FILE)}
              onOpenFile={handleOpenFile}
              onRemoveFile={async (fileId: number) => handleRemoveFile(fileId)}
            />
          </div>
          <div className="col-span-2">
            <FileUploadManager
              label="🔗 Link nộp bài"
              files={formData.contentFiles.filter(contentFile => contentFile.role === ContentFileRole.SUBMISSION_LINK).map(contentFile => contentFile.file)}
              placeholder="Link Google Form, Google Drive, hoặc nền tảng nộp bài khác"
              onUploadFile={async (file: File) => handleUploadFile(file, ContentFileRole.SUBMISSION_LINK)}
              onAddLink={async ({ name, url }) => handleAddLink({ name, url }, ContentFileRole.SUBMISSION_LINK)}
              onOpenFile={handleOpenFile}
              onRemoveFile={async (fileId: number) => handleRemoveFile(fileId)}
            />
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Hủy bỏ
        </Button>
        <Button type="submit">Thêm</Button>
      </DialogFooter>
    </form>

  )
}

/* =======================
   3. Dialog: export
   ======================= */
export function CreateContentDialog({
  open,
  onOpenChange,
  onSuccess,
  session,
}: {
  open: boolean,
  onOpenChange: (open: boolean) => void,
  onSuccess: () => void,
  session: WithPermission<SessionPublicDTO>
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle>Thêm nội dung mới</DialogTitle>
          <DialogDescription>
            Điền thông tin để thêm nội dung mới vào hệ thống.
          </DialogDescription>
        </DialogHeader>

        <CreateContentForm
          onSuccess={onSuccess}
          onCancel={() => onOpenChange(false)}
          session={session.data}
        />
      </DialogContent>
    </Dialog>
  )
}
