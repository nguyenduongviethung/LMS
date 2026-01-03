import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import {
  GraduationCap,
  Users,
  BookOpen,
  Calendar,
  ClipboardCheck,
  BookCheck,
  FileText,
  DollarSign,
  MessageSquare,
  FolderTree,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './ui/breadcrumb';

const menuItems = [
  { icon: Users, label: 'Người dùng', path: '/users' },
  { icon: BookOpen, label: 'Lớp học', path: '/classes' },
  { icon: Calendar, label: 'Buổi học', path: '/sessions' },
  { icon: ClipboardCheck, label: 'Điểm danh', path: '/attendance' },
  { icon: BookCheck, label: 'Bài tập', path: '/assignments' },
  { icon: FileText, label: 'Bài tập về nhà', path: '/homework' },
  { icon: FileText, label: 'Bài kiểm tra', path: '/quizzes' },
  { icon: MessageSquare, label: 'Nhận xét', path: '/reviews' },
  { icon: DollarSign, label: 'Học phí', path: '/tuitions' },
  { icon: FolderTree, label: 'Chương trình', path: '/programs' },
];

export const Layout: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const getBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter(Boolean);
    const breadcrumbs = [];

    for (let i = 0; i < paths.length; i++) {
      const path = `/${paths.slice(0, i + 1).join('/')}`;
      const label = paths[i].charAt(0).toUpperCase() + paths[i].slice(1);
      breadcrumbs.push({ label, path });
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-0'
        } bg-white border-r border-gray-200 transition-all duration-300 overflow-hidden`}
      >
        <div className="h-full flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <GraduationCap className="size-6 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="font-semibold">Quản Lý Học Tập</h2>
                <p className="text-xs text-gray-500">{currentUser?.name}</p>
              </div>
            </div>
          </div>

          <ScrollArea className="flex-1 p-4">
            <nav className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname.startsWith(item.path);
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="size-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </ScrollArea>

          <div className="p-4 border-t border-gray-200">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={logout}
            >
              <LogOut className="size-4 mr-2" />
              Đăng xuất
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? (
                  <X className="size-5" />
                ) : (
                  <Menu className="size-5" />
                )}
              </Button>

              {/* Breadcrumb */}
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link to="/">Trang chủ</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {breadcrumbs.flatMap((crumb, index) => [
                    <BreadcrumbSeparator key={`sep-${crumb.path}`}>
                      <ChevronRight className="size-4" />
                    </BreadcrumbSeparator>,
                    index === breadcrumbs.length - 1 ? (
                      <BreadcrumbItem key={crumb.path}>
                        <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                      </BreadcrumbItem>
                    ) : (
                      <BreadcrumbItem key={crumb.path}>
                        <BreadcrumbLink asChild>
                          <Link to={crumb.path}>{crumb.label}</Link>
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                    )
                  ])}
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            <div className="text-sm text-gray-600">
              {currentUser?.email}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};