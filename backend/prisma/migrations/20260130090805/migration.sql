-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "ClassStatus" AS ENUM ('OPEN', 'CLOSED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "UserClassRole" AS ENUM ('STUDENT', 'TEACHER', 'TEACHER_ASSISTANT');

-- CreateEnum
CREATE TYPE "TuitionStatus" AS ENUM ('PAID', 'UNPAID', 'PENDING');

-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('PRESENT', 'ABSENT', 'NOT_TAKEN');

-- CreateEnum
CREATE TYPE "TaskResultStatus" AS ENUM ('COMPLETED', 'PENDING', 'OVERDUE', 'NOT_TAKEN');

-- CreateEnum
CREATE TYPE "ProgramStatus" AS ENUM ('DRAFT', 'ACTIVE', 'DEPRECATED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "UserProgramRole" AS ENUM ('OWNER', 'EDITOR', 'VIEWER');

-- CreateEnum
CREATE TYPE "ContentType" AS ENUM ('LECTURE_MATERIAL', 'ASSIGNMENT', 'HOMEWORK', 'QUIZ');

-- CreateEnum
CREATE TYPE "FileType" AS ENUM ('FILE', 'LINK');

-- CreateEnum
CREATE TYPE "ContentFileRole" AS ENUM ('LESSON_FILE', 'CORRECTION_FILE', 'SUBMISSION_LINK');

-- CreateTable
CREATE TABLE "User" (
    "userId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3),
    "studyPlace" TEXT NOT NULL,
    "workPlace" TEXT NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "refreshToken" TEXT,
    "otp" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Class" (
    "classId" SERIAL NOT NULL,
    "status" "ClassStatus" NOT NULL DEFAULT 'OPEN',
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "defaultTuition" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Class_pkey" PRIMARY KEY ("classId")
);

-- CreateTable
CREATE TABLE "UserClass" (
    "userClassId" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "classId" INTEGER NOT NULL,
    "role" "UserClassRole" NOT NULL DEFAULT 'STUDENT',
    "enrolledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "UserClass_pkey" PRIMARY KEY ("userClassId")
);

-- CreateTable
CREATE TABLE "Review" (
    "reviewId" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "reviewerId" INTEGER NOT NULL,
    "classId" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "goodAttitude" TEXT NOT NULL,
    "badAttitude" TEXT NOT NULL,
    "goodSkills" TEXT NOT NULL,
    "badSkills" TEXT NOT NULL,
    "goodKnowledge" TEXT NOT NULL,
    "badKnowledge" TEXT NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("studentId","classId","reviewerId","month","year")
);

-- CreateTable
CREATE TABLE "Tuition" (
    "tuitionId" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "classId" INTEGER NOT NULL,
    "status" "TuitionStatus" NOT NULL DEFAULT 'UNPAID',
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Tuition_pkey" PRIMARY KEY ("userId","classId","month","year")
);

-- CreateTable
CREATE TABLE "Schedule" (
    "scheduleId" SERIAL NOT NULL,
    "classId" INTEGER NOT NULL,
    "weekday" INTEGER NOT NULL,
    "startTime" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("scheduleId")
);

-- CreateTable
CREATE TABLE "Session" (
    "sessionId" SERIAL NOT NULL,
    "templateSessionId" INTEGER,
    "classId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "startTime" TIMESTAMP(3),
    "duration" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Session_pkey" PRIMARY KEY ("sessionId")
);

-- CreateTable
CREATE TABLE "Attendance" (
    "userId" INTEGER NOT NULL,
    "sessionId" INTEGER NOT NULL,
    "status" "AttendanceStatus" NOT NULL DEFAULT 'ABSENT',
    "note" TEXT NOT NULL,
    "statusStatusId" INTEGER,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("userId","sessionId")
);

-- CreateTable
CREATE TABLE "TaskResult" (
    "userId" INTEGER NOT NULL,
    "contentId" INTEGER NOT NULL,
    "status" "TaskResultStatus" NOT NULL DEFAULT 'PENDING',
    "score" DOUBLE PRECISION,
    "reviews" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "TaskResult_pkey" PRIMARY KEY ("userId","contentId")
);

-- CreateTable
CREATE TABLE "Program" (
    "programId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "ProgramStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "statusStatusId" INTEGER,

    CONSTRAINT "Program_pkey" PRIMARY KEY ("programId")
);

-- CreateTable
CREATE TABLE "UserProgram" (
    "userProgramId" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "programId" INTEGER NOT NULL,
    "role" "UserProgramRole" NOT NULL DEFAULT 'VIEWER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "UserProgram_pkey" PRIMARY KEY ("userProgramId")
);

-- CreateTable
CREATE TABLE "TemplateSession" (
    "templateSessionId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "programId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "TemplateSession_pkey" PRIMARY KEY ("templateSessionId")
);

-- CreateTable
CREATE TABLE "SessionContent" (
    "sessionId" INTEGER NOT NULL,
    "contentId" INTEGER NOT NULL,

    CONSTRAINT "SessionContent_pkey" PRIMARY KEY ("sessionId","contentId")
);

-- CreateTable
CREATE TABLE "TemplateSessionContent" (
    "templateSessionId" INTEGER NOT NULL,
    "contentId" INTEGER NOT NULL,

    CONSTRAINT "TemplateSessionContent_pkey" PRIMARY KEY ("templateSessionId","contentId")
);

-- CreateTable
CREATE TABLE "Content" (
    "contentId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "deadline" TIMESTAMP(3),
    "cutoffScore" DOUBLE PRECISION,
    "type" "ContentType" NOT NULL DEFAULT 'LECTURE_MATERIAL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Content_pkey" PRIMARY KEY ("contentId")
);

-- CreateTable
CREATE TABLE "File" (
    "fileId" SERIAL NOT NULL,
    "filename" TEXT NOT NULL,
    "filetype" "FileType" NOT NULL,
    "filepath" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "filesize" INTEGER,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "File_pkey" PRIMARY KEY ("fileId")
);

-- CreateTable
CREATE TABLE "ContentFile" (
    "contentId" INTEGER NOT NULL,
    "fileId" INTEGER NOT NULL,
    "role" "ContentFileRole" NOT NULL DEFAULT 'LESSON_FILE',

    CONSTRAINT "ContentFile_pkey" PRIMARY KEY ("contentId","fileId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "UserClass" ADD CONSTRAINT "UserClass_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserClass" ADD CONSTRAINT "UserClass_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("classId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("classId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tuition" ADD CONSTRAINT "Tuition_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tuition" ADD CONSTRAINT "Tuition_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("classId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("classId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_templateSessionId_fkey" FOREIGN KEY ("templateSessionId") REFERENCES "TemplateSession"("templateSessionId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("classId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("sessionId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskResult" ADD CONSTRAINT "TaskResult_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskResult" ADD CONSTRAINT "TaskResult_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("contentId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProgram" ADD CONSTRAINT "UserProgram_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProgram" ADD CONSTRAINT "UserProgram_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("programId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemplateSession" ADD CONSTRAINT "TemplateSession_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("programId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionContent" ADD CONSTRAINT "SessionContent_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("sessionId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionContent" ADD CONSTRAINT "SessionContent_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("contentId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemplateSessionContent" ADD CONSTRAINT "TemplateSessionContent_templateSessionId_fkey" FOREIGN KEY ("templateSessionId") REFERENCES "TemplateSession"("templateSessionId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemplateSessionContent" ADD CONSTRAINT "TemplateSessionContent_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("contentId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentFile" ADD CONSTRAINT "ContentFile_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("contentId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentFile" ADD CONSTRAINT "ContentFile_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("fileId") ON DELETE RESTRICT ON UPDATE CASCADE;
