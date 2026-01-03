import React, { createContext, useContext, useState, ReactNode } from 'react';
import * as T from '../types';

interface DataContextType {
  users: T.User[];
  classes: T.Class[];
  userClasses: T.UserClass[];
  reviews: T.Review[];
  tuitions: T.Tuition[];
  schedules: T.Schedule[];
  sessions: T.Session[];
  attendances: T.Attendance[];
  taskResults: T.TaskResult[];
  programs: T.Program[];
  userPrograms: T.UserProgram[];
  templateSessions: T.TemplateSession[];
  contents: T.Content[];
  sessionContents: T.SessionContent[];
  templateSessionContents: T.TemplateSessionContent[];
  files: T.File[];
  contentFiles: T.ContentFile[];
  
  // CRUD operations
  addUser: (user: Omit<T.User, 'userId'>) => void;
  updateUser: (userId: number, user: Partial<T.User>) => void;
  deleteUser: (userId: number) => void;
  
  addClass: (cls: Omit<T.Class, 'classId'>) => void;
  updateClass: (classId: number, cls: Partial<T.Class>) => void;
  deleteClass: (classId: number) => void;
  
  addUserClass: (userClass: Omit<T.UserClass, 'userClassId'>) => void;
  updateUserClass: (userClassId: number, userClass: Partial<T.UserClass>) => void;
  deleteUserClass: (userClassId: number) => void;
  
  addUserProgram: (userProgram: Omit<T.UserProgram, 'userProgramId'>) => void;
  updateUserProgram: (userProgramId: number, userProgram: Partial<T.UserProgram>) => void;
  deleteUserProgram: (userProgramId: number) => void;
  
  addProgram: (program: Omit<T.Program, 'programId'>) => void;
  updateProgram: (programId: number, program: Partial<T.Program>) => void;
  deleteProgram: (programId: number) => void;
  
  addTemplateSession: (templateSession: Omit<T.TemplateSession, 'templateSessionId'>) => void;
  updateTemplateSession: (templateSessionId: number, templateSession: Partial<T.TemplateSession>) => void;
  deleteTemplateSession: (templateSessionId: number) => void;
  
  addSession: (session: Omit<T.Session, 'sessionId'>) => void;
  updateSession: (sessionId: number, session: Partial<T.Session>) => void;
  deleteSession: (sessionId: number) => void;
  
  addContent: (content: Omit<T.Content, 'contentId'>) => void;
  updateContent: (contentId: number, content: Partial<T.Content>) => void;
  deleteContent: (contentId: number) => void;
  
  updateAttendance: (userId: number, sessionId: number, attendance: Partial<T.Attendance>) => void;
  updateTaskResult: (userId: number, contentId: number, taskResult: Partial<T.TaskResult>) => void;
  updateTuition: (userId: number, classId: number, month: number, year: number, tuition: Partial<T.Tuition>) => void;
  updateReview: (studentId: number, classId: number, reviewerId: number, month: number, year: number, review: Partial<T.Review>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};

// Mock Data
const initialUsers: T.User[] = [
  {
    userId: 1,
    status: T.UserStatus.ACTIVE,
    role: T.UserRole.ADMIN,
    name: 'Nguyễn Văn Admin',
    email: 'admin@example.com',
    phone: '0912345678',
    password: 'admin123',
    birthDate: '1985-01-15',
    studyPlace: 'ĐH Bách Khoa',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    userId: 2,
    status: T.UserStatus.ACTIVE,
    role: T.UserRole.USER,
    name: 'Trần Thị B',
    email: 'tran.b@example.com',
    phone: '0923456789',
    password: 'user123',
    birthDate: '2000-05-20',
    studyPlace: 'ĐH Công Nghệ',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
  },
  {
    userId: 3,
    status: T.UserStatus.ACTIVE,
    role: T.UserRole.USER,
    name: 'Lê Văn C',
    email: 'le.c@example.com',
    phone: '0934567890',
    password: 'user123',
    birthDate: '2001-08-10',
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z',
  },
];

const initialClasses: T.Class[] = [
  {
    classId: 1,
    status: T.ClassStatus.OPEN,
    name: 'Lớp Toán Cao Cấp',
    description: 'Lớp học toán cao cấp cho sinh viên năm nhất',
    defaultTuition: 2000000,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    classId: 2,
    status: T.ClassStatus.OPEN,
    name: 'Lớp Lập Trình Python',
    description: 'Khóa học lập trình Python từ cơ bản đến nâng cao',
    defaultTuition: 3000000,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

const initialUserClasses: T.UserClass[] = [
  {
    userClassId: 1,
    userId: 2,
    classId: 1,
    role: T.UserClassRole.STUDENT,
    enrolledAt: '2024-01-05T00:00:00Z',
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-05T00:00:00Z',
  },
  {
    userClassId: 2,
    userId: 3,
    classId: 1,
    role: T.UserClassRole.STUDENT,
    enrolledAt: '2024-01-06T00:00:00Z',
    createdAt: '2024-01-06T00:00:00Z',
    updatedAt: '2024-01-06T00:00:00Z',
  },
  {
    userClassId: 3,
    userId: 1,
    classId: 1,
    role: T.UserClassRole.TEACHER,
    enrolledAt: '2024-01-01T00:00:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    userClassId: 4,
    userId: 2,
    classId: 2,
    role: T.UserClassRole.STUDENT,
    enrolledAt: '2024-01-07T00:00:00Z',
    createdAt: '2024-01-07T00:00:00Z',
    updatedAt: '2024-01-07T00:00:00Z',
  },
];

const initialPrograms: T.Program[] = [
  {
    programId: 1,
    name: 'Chương Trình Toán Học Cơ Bản',
    description: 'Chương trình giảng dạy toán học cơ bản',
    status: T.ProgramStatus.ACTIVE,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    programId: 2,
    name: 'Chương Trình Python Nâng Cao',
    description: 'Chương trình học Python từ cơ bản đến nâng cao',
    status: T.ProgramStatus.ACTIVE,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

const initialUserPrograms: T.UserProgram[] = [
  {
    userProgramId: 1,
    userId: 1,
    programId: 1,
    role: T.UserProgramRole.OWNER,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    userProgramId: 2,
    userId: 2,
    programId: 1,
    role: T.UserProgramRole.VIEWER,
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
  },
];

const initialTemplateSessions: T.TemplateSession[] = [
  {
    templateSessionId: 1,
    name: 'Bài 1: Giới thiệu Toán học',
    description: 'Buổi học giới thiệu về toán học',
    content: 'Nội dung bài học:\n1. Khái niệm toán học\n2. Các phép toán cơ bản\n3. Ứng dụng toán học trong đời sống\n\nMục tiêu:\n- Hiểu được tầm quan trọng của toán học\n- Nắm vững các phép toán cơ bản\n- Biết cách áp dụng toán học vào thực tế',
    fileUrl: 'https://example.com/files/math-intro.pdf',
    programId: 1,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    templateSessionId: 2,
    name: 'Bài 2: Đạo hàm',
    description: 'Buổi học về đạo hàm và ứng dụng',
    content: 'Nội dung bài học:\n1. Định nghĩa đạo hàm\n2. Công thức tính đạo hàm\n3. Các quy tắc đạo hàm\n4. Ứng dụng của đạo hàm\n\nBài tập:\n- Tính đạo hàm các hàm số cơ bản\n- Vẽ đồ thị và tìm cực trị',
    fileUrl: 'https://example.com/files/derivatives.pdf',
    programId: 1,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

const initialSessions: T.Session[] = [
  {
    sessionId: 1,
    templateSessionId: 1,
    classId: 1,
    name: 'Buổi 1: Giới thiệu môn học',
    description: 'Giới thiệu về môn toán cao cấp',
    content: 'Nội dung buổi học:\n\n1. Giới thiệu khái quát về môn Toán cao cấp\n   - Tầm quan trọng của Toán trong khoa học và đời sống\n   - Các chủ đề chính sẽ học trong khóa\n\n2. Phương pháp học tập hiệu quả\n   - Làm bài tập đầy đủ\n   - Thảo luận nhóm\n   - Ôn tập thường xuyên\n\n3. Quy định lớp học\n   - Điểm danh và điều kiện thi\n   - Cách tính điểm\n   - Lịch học và lịch thi',
    fileUrl: 'https://example.com/files/session1-intro.pdf',
    startTime: '2024-01-10T08:00:00Z',
    duration: 120,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    sessionId: 2,
    classId: 1,
    name: 'Buổi 2: Hàm số',
    description: 'Học về hàm số và đồ thị',
    content: 'Nội dung buổi học:\n\n1. Định nghĩa hàm số\n   - Khái niệm tập xác định\n   - Miền giá trị\n   - Các loại hàm số cơ bản\n\n2. Đồ thị hàm số\n   - Cách vẽ đồ thị\n   - Phân tích đồ thị\n   - Tính chất của hàm số qua đồ thị\n\n3. Bài tập thực hành\n   - Tìm tập xác định\n   - Vẽ đồ thị các hàm cơ bản\n   - Xét tính đơn điệu',
    fileUrl: 'https://example.com/files/session2-functions.pdf',
    startTime: '2024-01-12T08:00:00Z',
    duration: 120,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    sessionId: 3,
    classId: 2,
    name: 'Buổi 1: Python cơ bản',
    description: 'Giới thiệu Python',
    content: 'Nội dung buổi học:\n\n1. Giới thiệu về Python\n   - Lịch sử và ứng dụng\n   - Cài đặt môi trường\n   - IDE và công cụ phát triển\n\n2. Cú pháp cơ bản\n   - Biến và kiểu dữ liệu\n   - Toán tử\n   - Cấu trúc điều khiển\n\n3. Bài tập\n   - Viết chương trình Hello World\n   - Tính toán cơ bản\n   - Vòng lặp và điều kiện',
    fileUrl: 'https://example.com/files/python-basics.pdf',
    startTime: '2024-02-01T14:00:00Z',
    duration: 90,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

const initialContents: T.Content[] = [
  {
    contentId: 1,
    name: 'Bài giảng: Giới thiệu',
    description: 'Slide giới thiệu môn học',
    contentType: 'PDF',
    role: T.ContentRole.LECTURE_MATERIAL,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    contentId: 2,
    name: 'Bài tập 1',
    description: 'Bài tập về hàm số',
    contentType: 'PDF',
    deadline: '2024-01-15T23:59:59Z',
    cutoffScore: 5,
    role: T.ContentRole.ASSIGNMENT,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    contentId: 3,
    name: 'Bài tập về nhà tuần 1',
    description: 'Bài tập về nhà',
    contentType: 'PDF',
    deadline: '2024-01-17T23:59:59Z',
    role: T.ContentRole.HOMEWORK,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    contentId: 4,
    name: 'Bài kiểm tra giữa kỳ',
    description: 'Kiểm tra giữa kỳ',
    contentType: 'PDF',
    deadline: '2024-02-01T10:00:00Z',
    cutoffScore: 6,
    role: T.ContentRole.QUIZ,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

const initialSessionContents: T.SessionContent[] = [
  { sessionId: 1, contentId: 1 },
  { sessionId: 2, contentId: 2 },
  { sessionId: 2, contentId: 3 },
];

const initialAttendances: T.Attendance[] = [
  {
    userId: 2,
    sessionId: 1,
    status: T.AttendanceStatus.PRESENT,
  },
  {
    userId: 3,
    sessionId: 1,
    status: T.AttendanceStatus.PRESENT,
  },
  {
    userId: 2,
    sessionId: 2,
    status: T.AttendanceStatus.ABSENT,
    note: 'Ốm',
  },
  {
    userId: 3,
    sessionId: 2,
    status: T.AttendanceStatus.PRESENT,
  },
];

const initialTaskResults: T.TaskResult[] = [
  {
    userId: 2,
    contentId: 2,
    status: T.TaskResultStatus.COMPLETED,
    score: 8.5,
    reviews: 'Làm tốt!',
  },
  {
    userId: 3,
    contentId: 2,
    status: T.TaskResultStatus.PENDING,
  },
];

const initialTuitions: T.Tuition[] = [
  {
    userId: 2,
    classId: 1,
    status: T.TuitionStatus.PAID,
    month: 1,
    year: 2026,
    amount: 2000000,
  },
  {
    userId: 3,
    classId: 1,
    status: T.TuitionStatus.UNPAID,
    month: 1,
    year: 2026,
    amount: 2000000,
  },
];

const initialReviews: T.Review[] = [
  {
    studentId: 2,
    reviewerId: 1,
    classId: 1,
    month: 1,
    year: 2026,
    goodAttitude: 'Học sinh chăm chỉ, tích cực',
    badAttitude: 'Đôi khi đi muộn',
    goodSkills: 'Giải toán tốt',
    badSkills: 'Cần cải thiện kỹ năng trình bày',
    goodKnowledge: 'Nắm vững kiến thức cơ bản',
    badKnowledge: 'Cần học thêm phần nâng cao',
  },
];

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<T.User[]>(initialUsers);
  const [classes, setClasses] = useState<T.Class[]>(initialClasses);
  const [userClasses, setUserClasses] = useState<T.UserClass[]>(initialUserClasses);
  const [reviews, setReviews] = useState<T.Review[]>(initialReviews);
  const [tuitions, setTuitions] = useState<T.Tuition[]>(initialTuitions);
  const [schedules] = useState<T.Schedule[]>([]);
  const [sessions, setSessions] = useState<T.Session[]>(initialSessions);
  const [attendances, setAttendances] = useState<T.Attendance[]>(initialAttendances);
  const [taskResults, setTaskResults] = useState<T.TaskResult[]>(initialTaskResults);
  const [programs, setPrograms] = useState<T.Program[]>(initialPrograms);
  const [userPrograms, setUserPrograms] = useState<T.UserProgram[]>(initialUserPrograms);
  const [templateSessions, setTemplateSessions] = useState<T.TemplateSession[]>(initialTemplateSessions);
  const [contents, setContents] = useState<T.Content[]>(initialContents);
  const [sessionContents] = useState<T.SessionContent[]>(initialSessionContents);
  const [templateSessionContents] = useState<T.TemplateSessionContent[]>([]);
  const [files] = useState<T.File[]>([]);
  const [contentFiles] = useState<T.ContentFile[]>([]);

  const addUser = (user: Omit<T.User, 'userId'>) => {
    const newUser = { ...user, userId: Math.max(...users.map(u => u.userId), 0) + 1 };
    setUsers([...users, newUser]);
  };

  const updateUser = (userId: number, userData: Partial<T.User>) => {
    setUsers(users.map(u => u.userId === userId ? { ...u, ...userData } : u));
  };

  const deleteUser = (userId: number) => {
    setUsers(users.filter(u => u.userId !== userId));
  };

  const addClass = (cls: Omit<T.Class, 'classId'>) => {
    const newClass = { ...cls, classId: Math.max(...classes.map(c => c.classId), 0) + 1 };
    setClasses([...classes, newClass]);
  };

  const updateClass = (classId: number, classData: Partial<T.Class>) => {
    setClasses(classes.map(c => c.classId === classId ? { ...c, ...classData } : c));
  };

  const deleteClass = (classId: number) => {
    setClasses(classes.filter(c => c.classId !== classId));
  };

  const addUserClass = (userClass: Omit<T.UserClass, 'userClassId'>) => {
    const newUserClass = { ...userClass, userClassId: Math.max(...userClasses.map(uc => uc.userClassId), 0) + 1 };
    setUserClasses([...userClasses, newUserClass]);
  };

  const updateUserClass = (userClassId: number, userClassData: Partial<T.UserClass>) => {
    setUserClasses(userClasses.map(uc => uc.userClassId === userClassId ? { ...uc, ...userClassData } : uc));
  };

  const deleteUserClass = (userClassId: number) => {
    setUserClasses(userClasses.filter(uc => uc.userClassId !== userClassId));
  };

  const addUserProgram = (userProgram: Omit<T.UserProgram, 'userProgramId'>) => {
    const newUserProgram = { ...userProgram, userProgramId: Math.max(...userPrograms.map(up => up.userProgramId), 0) + 1 };
    setUserPrograms([...userPrograms, newUserProgram]);
  };

  const updateUserProgram = (userProgramId: number, userProgramData: Partial<T.UserProgram>) => {
    setUserPrograms(userPrograms.map(up => up.userProgramId === userProgramId ? { ...up, ...userProgramData } : up));
  };

  const deleteUserProgram = (userProgramId: number) => {
    setUserPrograms(userPrograms.filter(up => up.userProgramId !== userProgramId));
  };

  const addProgram = (program: Omit<T.Program, 'programId'>) => {
    const newProgram = { ...program, programId: Math.max(...programs.map(p => p.programId), 0) + 1 };
    setPrograms([...programs, newProgram]);
  };

  const updateProgram = (programId: number, programData: Partial<T.Program>) => {
    setPrograms(programs.map(p => p.programId === programId ? { ...p, ...programData } : p));
  };

  const deleteProgram = (programId: number) => {
    setPrograms(programs.filter(p => p.programId !== programId));
  };

  const addTemplateSession = (templateSession: Omit<T.TemplateSession, 'templateSessionId'>) => {
    const newTemplateSession = { ...templateSession, templateSessionId: Math.max(...templateSessions.map(ts => ts.templateSessionId), 0) + 1 };
    setTemplateSessions([...templateSessions, newTemplateSession]);
  };

  const updateTemplateSession = (templateSessionId: number, templateSessionData: Partial<T.TemplateSession>) => {
    setTemplateSessions(templateSessions.map(ts => ts.templateSessionId === templateSessionId ? { ...ts, ...templateSessionData } : ts));
  };

  const deleteTemplateSession = (templateSessionId: number) => {
    setTemplateSessions(templateSessions.filter(ts => ts.templateSessionId !== templateSessionId));
  };

  const addSession = (session: Omit<T.Session, 'sessionId'>) => {
    const newSession = { ...session, sessionId: Math.max(...sessions.map(s => s.sessionId), 0) + 1 };
    setSessions([...sessions, newSession]);
  };

  const updateSession = (sessionId: number, sessionData: Partial<T.Session>) => {
    setSessions(sessions.map(s => s.sessionId === sessionId ? { ...s, ...sessionData } : s));
  };

  const deleteSession = (sessionId: number) => {
    setSessions(sessions.filter(s => s.sessionId !== sessionId));
  };

  const addContent = (content: Omit<T.Content, 'contentId'>) => {
    const newContent = { ...content, contentId: Math.max(...contents.map(c => c.contentId), 0) + 1 };
    setContents([...contents, newContent]);
  };

  const updateContent = (contentId: number, contentData: Partial<T.Content>) => {
    setContents(contents.map(c => c.contentId === contentId ? { ...c, ...contentData } : c));
  };

  const deleteContent = (contentId: number) => {
    setContents(contents.filter(c => c.contentId !== contentId));
  };

  const updateAttendance = (userId: number, sessionId: number, attendanceData: Partial<T.Attendance>) => {
    const existing = attendances.find(a => a.userId === userId && a.sessionId === sessionId);
    if (existing) {
      setAttendances(attendances.map(a => 
        a.userId === userId && a.sessionId === sessionId ? { ...a, ...attendanceData } : a
      ));
    } else {
      setAttendances([...attendances, { userId, sessionId, status: T.AttendanceStatus.ABSENT, ...attendanceData }]);
    }
  };

  const updateTaskResult = (userId: number, contentId: number, taskResultData: Partial<T.TaskResult>) => {
    const existing = taskResults.find(tr => tr.userId === userId && tr.contentId === contentId);
    if (existing) {
      setTaskResults(taskResults.map(tr => 
        tr.userId === userId && tr.contentId === contentId ? { ...tr, ...taskResultData } : tr
      ));
    } else {
      setTaskResults([...taskResults, { userId, contentId, status: T.TaskResultStatus.PENDING, ...taskResultData }]);
    }
  };

  const updateTuition = (userId: number, classId: number, month: number, year: number, tuitionData: Partial<T.Tuition>) => {
    const existing = tuitions.find(t => t.userId === userId && t.classId === classId && t.month === month && t.year === year);
    if (existing) {
      setTuitions(tuitions.map(t => 
        t.userId === userId && t.classId === classId && t.month === month && t.year === year ? { ...t, ...tuitionData } : t
      ));
    } else {
      setTuitions([...tuitions, { userId, classId, month, year, status: T.TuitionStatus.UNPAID, amount: 0, ...tuitionData }]);
    }
  };

  const updateReview = (studentId: number, classId: number, reviewerId: number, month: number, year: number, reviewData: Partial<T.Review>) => {
    const existing = reviews.find(r => r.studentId === studentId && r.classId === classId && r.reviewerId === reviewerId && r.month === month && r.year === year);
    if (existing) {
      setReviews(reviews.map(r => 
        r.studentId === studentId && r.classId === classId && r.reviewerId === reviewerId && r.month === month && r.year === year ? { ...r, ...reviewData } : r
      ));
    } else {
      setReviews([...reviews, { studentId, classId, reviewerId, month, year, ...reviewData }]);
    }
  };

  const value: DataContextType = {
    users,
    classes,
    userClasses,
    reviews,
    tuitions,
    schedules,
    sessions,
    attendances,
    taskResults,
    programs,
    userPrograms,
    templateSessions,
    contents,
    sessionContents,
    templateSessionContents,
    files,
    contentFiles,
    addUser,
    updateUser,
    deleteUser,
    addClass,
    updateClass,
    deleteClass,
    addUserClass,
    updateUserClass,
    deleteUserClass,
    addUserProgram,
    updateUserProgram,
    deleteUserProgram,
    addProgram,
    updateProgram,
    deleteProgram,
    addTemplateSession,
    updateTemplateSession,
    deleteTemplateSession,
    addSession,
    updateSession,
    deleteSession,
    addContent,
    updateContent,
    deleteContent,
    updateAttendance,
    updateTaskResult,
    updateTuition,
    updateReview,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};