import React from 'react';
// import { useData } from '../contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Users, BookOpen, Calendar, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  // const { users, classes, sessions, tuitions } = useData();

  const stats = [
    {
      title: 'Tổng số người dùng',
      value: 100,
      icon: Users,
      link: '/users',
      color: 'bg-blue-500',
    },
    {
      title: 'Tổng số lớp học',
      value: 10,
      icon: BookOpen,
      link: '/classes',
      color: 'bg-green-500',
    },
    {
      title: 'Tổng số buổi học',
      value: 1000,
      icon: Calendar,
      link: '/sessions',
      color: 'bg-purple-500',
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

      
    </div>
  );
};
