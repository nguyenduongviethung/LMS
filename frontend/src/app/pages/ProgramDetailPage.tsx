import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { ArrowLeft, Users, BookOpen, FileText, ExternalLink } from 'lucide-react';
import { ProgramStatus } from '../types';

export const ProgramDetailPage: React.FC = () => {
  const { programId } = useParams<{ programId: string }>();
  const { programs, users, userPrograms, templateSessions, contents, templateSessionContents } = useData();

  const program = programs.find(p => p.programId === parseInt(programId || '0'));

  if (!program) {
    return (
      <div className="p-6">
        <h1 className="text-3xl">Chương trình không tồn tại</h1>
        <Button asChild className="mt-4">
          <Link to="/programs">
            <ArrowLeft className="size-4 mr-2" />
            Quay lại
          </Link>
        </Button>
      </div>
    );
  }

  // Get program members
  const programMembers = userPrograms
    .filter(up => up.programId === program.programId)
    .map(up => ({
      ...up,
      user: users.find(u => u.userId === up.userId),
    }));

  // Get template sessions
  const programTemplateSessions = templateSessions.filter(ts => ts.programId === program.programId);

  // Get all contents for this program
  const programContents = templateSessionContents
    .filter(tsc => programTemplateSessions.some(ts => ts.templateSessionId === tsc.templateSessionId))
    .map(tsc => contents.find(c => c.contentId === tsc.contentId))
    .filter(Boolean);

  const getStatusBadge = (status: ProgramStatus) => {
    const config: Record<ProgramStatus, { variant: any; label: string }> = {
      DRAFT: { variant: 'outline', label: 'Nháp' },
      ACTIVE: { variant: 'default', label: 'Hoạt động' },
      DEPRECATED: { variant: 'secondary', label: 'Lỗi thời' },
      ARCHIVED: { variant: 'destructive', label: 'Đã lưu trữ' },
    };
    const { variant, label } = config[status];
    return <Badge variant={variant}>{label}</Badge>;
  };

  const getRoleBadge = (role: string) => {
    const config: Record<string, { variant: any; label: string }> = {
      OWNER: { variant: 'default', label: 'Chủ sở hữu' },
      EDITOR: { variant: 'secondary', label: 'Biên tập viên' },
      VIEWER: { variant: 'outline', label: 'Người xem' },
    };
    const { variant, label } = config[role] || { variant: 'outline', label: role };
    return <Badge variant={variant}>{label}</Badge>;
  };

  const getContentRoleBadge = (role: string) => {
    const config: Record<string, { variant: any; label: string }> = {
      LECTURE_MATERIAL: { variant: 'default', label: 'Tài liệu giảng' },
      ASSIGNMENT: { variant: 'secondary', label: 'Bài tập' },
      HOMEWORK: { variant: 'outline', label: 'Bài tập về nhà' },
      QUIZ: { variant: 'destructive', label: 'Kiểm tra' },
    };
    const { variant, label } = config[role] || { variant: 'outline', label: role };
    return <Badge variant={variant}>{label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" asChild>
          <Link to="/programs">
            <ArrowLeft className="size-4 mr-2" />
            Quay lại
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl">{program.name}</h1>
          <p className="text-gray-500 mt-1">{program.description || 'Không có mô tả'}</p>
        </div>
        <div>{getStatusBadge(program.status)}</div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Thành viên</p>
                <p className="text-2xl font-bold">{programMembers.length}</p>
              </div>
              <Users className="size-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Buổi học mẫu</p>
                <p className="text-2xl font-bold">{programTemplateSessions.length}</p>
              </div>
              <BookOpen className="size-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Nội dung</p>
                <p className="text-2xl font-bold">{programContents.length}</p>
              </div>
              <FileText className="size-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Thông tin chương trình</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-sm text-gray-500">Trạng thái</p>
            <div className="mt-1">{getStatusBadge(program.status)}</div>
          </div>
          <div>
            <p className="text-sm text-gray-500">Ngày tạo</p>
            <p className="font-semibold">{new Date(program.createdAt).toLocaleDateString('vi-VN')}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Cập nhật lần cuối</p>
            <p className="font-semibold">{new Date(program.updatedAt).toLocaleDateString('vi-VN')}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Thành viên chương trình ({programMembers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Họ và tên</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Vai trò</TableHead>
                <TableHead>Ngày tham gia</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {programMembers.map((member) => (
                <TableRow key={member.userProgramId}>
                  <TableCell>{member.user?.name || 'N/A'}</TableCell>
                  <TableCell>{member.user?.email || 'N/A'}</TableCell>
                  <TableCell>{getRoleBadge(member.role)}</TableCell>
                  <TableCell>{new Date(member.createdAt).toLocaleDateString('vi-VN')}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/users/${member.userId}`}>Xem chi tiết</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách buổi học mẫu ({programTemplateSessions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Tên buổi học</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead>Nội dung</TableHead>
                <TableHead>File</TableHead>
                <TableHead>Ngày tạo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {programTemplateSessions.map((ts) => (
                <TableRow key={ts.templateSessionId}>
                  <TableCell>{ts.templateSessionId}</TableCell>
                  <TableCell>{ts.name}</TableCell>
                  <TableCell>{ts.description || '-'}</TableCell>
                  <TableCell>
                    <div className="max-w-xs text-sm text-gray-600">
                      {ts.content ? (
                        <p className="line-clamp-2">{ts.content}</p>
                      ) : (
                        '-'
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {ts.fileUrl ? (
                      <a 
                        href={ts.fileUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-blue-600 hover:underline text-sm"
                      >
                        Xem file
                        <ExternalLink className="size-3" />
                      </a>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell>{new Date(ts.createdAt).toLocaleDateString('vi-VN')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {programContents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Nội dung chương trình ({programContents.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Tên nội dung</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Vai trò</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {programContents.map((content: any) => (
                  <TableRow key={content.contentId}>
                    <TableCell>{content.contentId}</TableCell>
                    <TableCell>{content.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{content.contentType}</Badge>
                    </TableCell>
                    <TableCell>{getContentRoleBadge(content.role)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};