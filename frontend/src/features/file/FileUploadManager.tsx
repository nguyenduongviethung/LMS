import React, { useState } from 'react';
import { FilePublicDTO } from '@shared/src/types/file.types';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Card } from '../../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Plus, Trash2, FileText, Download, Upload } from 'lucide-react';

interface FileUploadManagerProps {
  label: string;
  files: FilePublicDTO[];
  placeholder?: string;
  onUploadFile: (file: File) => Promise<void>;
  onAddLink: (link: { name: string, url: string }) => Promise<void>;
  onRemoveFile: (fileId: number) => Promise<void>;
  onOpenFile: (file: FilePublicDTO) => void;
}

export function FileUploadManager({ label, files, placeholder, onUploadFile, onAddLink, onRemoveFile, onOpenFile }: FileUploadManagerProps) {
  const [fileName, setFileName] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [uploadMethod, setUploadMethod] = useState<'upload' | 'url'>('upload');

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return 'N/A';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onAddLink({ name: fileName, url: fileUrl });
    }
  };

  return (
    <div className="space-y-3">
      <div className="font-medium text-sm">
        {label}
      </div>


      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file) => (
            <Card key={file.fileId} className="p-3">
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-blue-600 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{file.filename}</div>
                  <div className="text-xs text-muted-foreground">
                    {formatFileSize(file.filesize ? file.filesize : 0)}
                    {file.url && (
                      <span className="ml-2 text-blue-600 truncate block">
                        {file.url}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => onOpenFile(file)}
                    title={file ? "Tải xuống" : "Mở file"}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => onRemoveFile(file.fileId)}
                    title="Xóa file"
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add file form */}
      <div className="border rounded-lg p-3 bg-gray-50">
        <Tabs value={uploadMethod} onValueChange={(v) => setUploadMethod(v as 'upload' | 'url')}>
          <TabsList className="grid w-full grid-cols-2 mb-3">
            <TabsTrigger value="upload">
              <Upload className="h-4 w-4 mr-2" />
              Upload File
            </TabsTrigger>
            <TabsTrigger value="url">
              <FileText className="h-4 w-4 mr-2" />
              Link URL
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-3 mt-0">
            <div className="space-y-2">
              <Input
                type="file"
                onChange={(e) => {
                  if (e.target.files) {
                    Array.from(e.target.files).forEach(file => onUploadFile(file));
                  }
                }}
                accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.xlsx,.xls"
                multiple
              />
              <div className="text-xs text-muted-foreground">
                💡 Tải lên file từ máy tính (PDF, Word, PowerPoint, Excel, hình ảnh, v.v.) - Tối đa 10MB mỗi file
              </div>
            </div>
          </TabsContent>

          <TabsContent value="url" className="space-y-3 mt-0">
            <div className="space-y-2">
              <Input
                placeholder={placeholder || "Tên file (VD: Bài giảng tuần 1.pdf)"}
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <Input
                placeholder="URL file (VD: https://drive.google.com/...)"
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                onKeyPress={handleKeyPress}
                type="url"
              />
            </div>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => onAddLink({ name: fileName, url: fileUrl })}
              disabled={!fileName.trim() || !fileUrl.trim()}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Thêm link file
            </Button>
            <div className="text-xs text-muted-foreground">
              💡 Nhập tên và URL của file (Google Drive, Dropbox, OneDrive, v.v.)
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}