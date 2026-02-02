import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Plus, Edit, Trash2, Calendar, Eye } from 'lucide-react';
import { useSession } from './SessionContext';
import { CreateSessionDialog } from '../../features/session/CreateSessionDialog';
import { UpdateSessionDialog } from '../../features/session/UpdateSessionDialog';
import { SessionPublicDTO } from '@shared/src/types/session.types';
import { WithPermission } from '@shared/src/types/permission.types';
import { Label } from '@/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select';
import { useClass } from '../class/ClassContext';
import { DeleteSessionDialog } from './DeleteSessionDialog';
import { useAuth } from '../auth/AuthContext';

export const SessionsPage: React.FC = () => {
  const { permissions } = useAuth();
  const { classes, fetchClasses } = useClass();
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const { sessions, fetchSessions } = useSession();

  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedSession, setSelectedSession] = useState<WithPermission<SessionPublicDTO> | null>(null);

  useEffect(() => {
    const fetchData = fetchClasses;
    fetchData();
  }, []);

  useEffect(() => {
    if (classes.length > 0) setSelectedClassId(classes[0].data.classId);
    else setSelectedClassId(null);
  }, [classes]);

  useEffect(() => {
    if (selectedClassId) fetchSessions(selectedClassId);
  }, [selectedClassId]);

  const handleCreate = () => {
    setSelectedSession(null);
    setOpenCreate(true);
  }

  const handleUpdate = (session: WithPermission<SessionPublicDTO>) => {
    setSelectedSession(session);
    setOpenUpdate(true);
  }

  const handleDelete = (session: WithPermission<SessionPublicDTO>) => {
    setSelectedSession(session);
    setOpenDelete(true);
  }

  const handleSuccess = () => {
    if (selectedClassId) fetchSessions(selectedClassId);
    setOpenCreate(false);
    setOpenUpdate(false);
    setOpenDelete(false);
  }

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return 'Chưa xác định';
    return new Date(dateString).toLocaleString('vi-VN');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl">Quản Lý Buổi Học</h1>
          <p className="text-gray-500 mt-1">Quản lý các buổi học trong lớp</p>
        </div>
        {permissions?.session.create && <Button onClick={() => handleCreate()}>
          <Plus className="size-4 mr-2" />
          Thêm buổi học
        </Button>}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label>Chọn lớp học</Label>
              {classes.length > 0 && selectedClassId && (
                <Select
                  value={selectedClassId.toString()}
                  onValueChange={(value) => {
                    setSelectedClassId(parseInt(value));
                  }}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((cls) => (
                      <SelectItem key={cls.data.classId} value={cls.data.classId.toString()}>
                        {cls.data.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên buổi học</TableHead>
                <TableHead>Lớp học</TableHead>
                <TableHead>Thời gian</TableHead>
                <TableHead>Thời lượng</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.map((session) => (
                <TableRow key={session.data.sessionId}>
                  <TableCell>{session.data.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{session.data.class.name}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="size-4 text-gray-400" />
                      {formatDateTime(session.data.startTime ? session.data.startTime.toLocaleString('vi-VN') : '')}
                    </div>
                  </TableCell>
                  <TableCell>{session.data.duration ? `${session.data.duration} phút` : '-'}</TableCell>
                  <TableCell className="text-right space-x-2">
                    {session.permission.canGet && <Button variant="ghost" size="sm" asChild>
                      <Link to={`/sessions/${session.data.sessionId}`}>
                        <Eye className="size-4" />
                      </Link>
                    </Button>}
                    {session.permission.canDelete && <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleUpdate(session)}
                    >
                      <Edit className="size-4" />
                    </Button>}
                    {session.permission.canDelete && <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(session)}
                    >
                      <Trash2 className="size-4 text-red-600" />
                    </Button>}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {!selectedSession && <CreateSessionDialog open={openCreate} onOpenChange={setOpenCreate} onSuccess={handleSuccess} />}
      {selectedSession && <UpdateSessionDialog open={openUpdate} onOpenChange={setOpenUpdate} session={selectedSession} onSuccess={handleSuccess} />}
      {selectedSession && <DeleteSessionDialog open={openDelete} onOpenChange={setOpenDelete} session={selectedSession} onSuccess={handleSuccess} />}
    </div>
  );
};