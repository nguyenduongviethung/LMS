import React from 'react';
import { useData } from '../contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Users, BookOpen, Calendar, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const { users, classes, sessions, tuitions } = useData();

  const stats = [
    {
      title: 'Tổng số người dùng',
      value: users.length,
      icon: Users,
      link: '/users',
      color: 'bg-blue-500',
    },
    {
      title: 'Tổng số lớp học',
      value: classes.length,
      icon: BookOpen,
      link: '/classes',
      color: 'bg-green-500',
    },
    {
      title: 'Tổng số buổi học',
      value: sessions.length,
      icon: Calendar,
      link: '/sessions',
      color: 'bg-purple-500',
    },
    {
      title: 'Học phí chưa thu',
      value: tuitions.filter(t => t.status === 'UNPAID').length,
      icon: DollarSign,
      link: '/tuitions',
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl">Dashboard</h1>
        <p className="text-gray-500 mt-1">Tổng quan hệ thống quản lý học tập</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.title} to={stat.link}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm">{stat.title}</CardTitle>
                  <div className={`${stat.color} p-2 rounded-lg`}>
                    <Icon className="size-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl">{stat.value}</div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Người dùng mới nhất</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {users.slice(-5).reverse().map((user) => (
                <div key={user.userId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <Link to={`/users/${user.userId}`}>
                    <div className="text-sm text-blue-600 hover:underline">Xem chi tiết</div>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lớp học đang mở</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {classes.filter(c => c.status === 'OPEN').map((cls) => (
                <div key={cls.classId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{cls.name}</p>
                    <p className="text-sm text-gray-500">{cls.description}</p>
                  </div>
                  <Link to={`/classes/${cls.classId}`}>
                    <div className="text-sm text-blue-600 hover:underline">Xem chi tiết</div>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
