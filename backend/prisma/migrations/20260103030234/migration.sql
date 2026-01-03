/*
  Warnings:

  - The primary key for the `Attendance` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `session_id` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the column `status_id` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Attendance` table. All the data in the column will be lost.
  - The primary key for the `Class` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `class_id` on the `Class` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Class` table. All the data in the column will be lost.
  - You are about to drop the column `default_tuition` on the `Class` table. All the data in the column will be lost.
  - You are about to drop the column `is_deleted` on the `Class` table. All the data in the column will be lost.
  - You are about to drop the column `state_id` on the `Class` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Class` table. All the data in the column will be lost.
  - The primary key for the `Content` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `content_id` on the `Content` table. All the data in the column will be lost.
  - You are about to drop the column `content_type` on the `Content` table. All the data in the column will be lost.
  - You are about to drop the column `cutoff_score` on the `Content` table. All the data in the column will be lost.
  - The primary key for the `File` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `file_id` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `uploaded_at` on the `File` table. All the data in the column will be lost.
  - The primary key for the `Review` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `bad_attitude` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `bad_knowledge` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `bad_skills` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `class_id` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `good_attitude` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `good_knowledge` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `good_skills` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `review_id` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Review` table. All the data in the column will be lost.
  - The primary key for the `Schedule` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `class_id` on the `Schedule` table. All the data in the column will be lost.
  - You are about to drop the column `schedule_id` on the `Schedule` table. All the data in the column will be lost.
  - You are about to drop the column `start_time` on the `Schedule` table. All the data in the column will be lost.
  - The primary key for the `Session` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `class_id` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `is_deleted` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `session_id` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `start_time` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `template_session_id` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Session` table. All the data in the column will be lost.
  - The primary key for the `Tuition` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `class_id` on the `Tuition` table. All the data in the column will be lost.
  - You are about to drop the column `state_id` on the `Tuition` table. All the data in the column will be lost.
  - You are about to drop the column `tuition_id` on the `Tuition` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Tuition` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `birth_date` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `is_deleted` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `role_id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `state_id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `study_place` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `work_place` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Content_File` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Role` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Session_Content` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `State` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Task_Result` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Template_Session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Template_Session_Content` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User_Class` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `sessionId` to the `Attendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Attendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Class` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contentType` to the `Content` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Content` table without a default value. This is not possible if the table is not empty.
  - Added the required column `classId` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reviewerId` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `studentId` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `classId` to the `Schedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `Schedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `classId` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `classId` to the `Tuition` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Tuition` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
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
CREATE TYPE "AttendanceStatus" AS ENUM ('PRESENT', 'ABSENT', 'EXCUSED');

-- CreateEnum
CREATE TYPE "TaskResultStatus" AS ENUM ('COMPLETED', 'PENDING', 'OVERDUE');

-- CreateEnum
CREATE TYPE "ProgramStatus" AS ENUM ('DRAFT', 'ACTIVE', 'DEPRECATED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "UserProgramRole" AS ENUM ('OWNER', 'EDITOR', 'VIEWER');

-- CreateEnum
CREATE TYPE "ContentRole" AS ENUM ('LECTURE_MATERIAL', 'ASSIGNMENT', 'HOMEWORK', 'QUIZ');

-- CreateEnum
CREATE TYPE "ContentFileRole" AS ENUM ('LECTURE_NOTE', 'ASSIGNMENT', 'SUBMISSION_LINK');

-- DropForeignKey
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_session_id_fkey";

-- DropForeignKey
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_status_id_fkey";

-- DropForeignKey
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Class" DROP CONSTRAINT "Class_state_id_fkey";

-- DropForeignKey
ALTER TABLE "Content_File" DROP CONSTRAINT "Content_File_content_id_fkey";

-- DropForeignKey
ALTER TABLE "Content_File" DROP CONSTRAINT "Content_File_file_id_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_class_id_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Schedule" DROP CONSTRAINT "Schedule_class_id_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_class_id_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_template_session_id_fkey";

-- DropForeignKey
ALTER TABLE "Session_Content" DROP CONSTRAINT "Session_Content_content_id_fkey";

-- DropForeignKey
ALTER TABLE "Session_Content" DROP CONSTRAINT "Session_Content_session_id_fkey";

-- DropForeignKey
ALTER TABLE "Task_Result" DROP CONSTRAINT "Task_Result_content_id_fkey";

-- DropForeignKey
ALTER TABLE "Task_Result" DROP CONSTRAINT "Task_Result_state_id_fkey";

-- DropForeignKey
ALTER TABLE "Task_Result" DROP CONSTRAINT "Task_Result_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Template_Session_Content" DROP CONSTRAINT "Template_Session_Content_content_id_fkey";

-- DropForeignKey
ALTER TABLE "Template_Session_Content" DROP CONSTRAINT "Template_Session_Content_template_session_id_fkey";

-- DropForeignKey
ALTER TABLE "Tuition" DROP CONSTRAINT "Tuition_class_id_fkey";

-- DropForeignKey
ALTER TABLE "Tuition" DROP CONSTRAINT "Tuition_state_id_fkey";

-- DropForeignKey
ALTER TABLE "Tuition" DROP CONSTRAINT "Tuition_user_id_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_role_id_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_state_id_fkey";

-- DropForeignKey
ALTER TABLE "User_Class" DROP CONSTRAINT "User_Class_class_id_fkey";

-- DropForeignKey
ALTER TABLE "User_Class" DROP CONSTRAINT "User_Class_role_id_fkey";

-- DropForeignKey
ALTER TABLE "User_Class" DROP CONSTRAINT "User_Class_state_id_fkey";

-- DropForeignKey
ALTER TABLE "User_Class" DROP CONSTRAINT "User_Class_user_id_fkey";

-- AlterTable
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_pkey",
DROP COLUMN "session_id",
DROP COLUMN "status_id",
DROP COLUMN "user_id",
ADD COLUMN     "sessionId" INTEGER NOT NULL,
ADD COLUMN     "status" "AttendanceStatus" NOT NULL DEFAULT 'ABSENT',
ADD COLUMN     "statusStatusId" INTEGER,
ADD COLUMN     "userId" INTEGER NOT NULL,
ADD CONSTRAINT "Attendance_pkey" PRIMARY KEY ("userId", "sessionId");

-- AlterTable
ALTER TABLE "Class" DROP CONSTRAINT "Class_pkey",
DROP COLUMN "class_id",
DROP COLUMN "created_at",
DROP COLUMN "default_tuition",
DROP COLUMN "is_deleted",
DROP COLUMN "state_id",
DROP COLUMN "updated_at",
ADD COLUMN     "classId" SERIAL NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "defaultTuition" DOUBLE PRECISION,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "status" "ClassStatus" NOT NULL DEFAULT 'OPEN',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD CONSTRAINT "Class_pkey" PRIMARY KEY ("classId");

-- AlterTable
ALTER TABLE "Content" DROP CONSTRAINT "Content_pkey",
DROP COLUMN "content_id",
DROP COLUMN "content_type",
DROP COLUMN "cutoff_score",
ADD COLUMN     "contentId" SERIAL NOT NULL,
ADD COLUMN     "contentType" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "cutoffScore" DOUBLE PRECISION,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "role" "ContentRole" NOT NULL DEFAULT 'LECTURE_MATERIAL',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "deadline" DROP NOT NULL,
ADD CONSTRAINT "Content_pkey" PRIMARY KEY ("contentId");

-- AlterTable
ALTER TABLE "File" DROP CONSTRAINT "File_pkey",
DROP COLUMN "file_id",
DROP COLUMN "uploaded_at",
ADD COLUMN     "fileId" SERIAL NOT NULL,
ADD COLUMN     "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD CONSTRAINT "File_pkey" PRIMARY KEY ("fileId");

-- AlterTable
ALTER TABLE "Review" DROP CONSTRAINT "Review_pkey",
DROP COLUMN "bad_attitude",
DROP COLUMN "bad_knowledge",
DROP COLUMN "bad_skills",
DROP COLUMN "class_id",
DROP COLUMN "good_attitude",
DROP COLUMN "good_knowledge",
DROP COLUMN "good_skills",
DROP COLUMN "review_id",
DROP COLUMN "user_id",
ADD COLUMN     "badAttitude" TEXT,
ADD COLUMN     "badKnowledge" TEXT,
ADD COLUMN     "badSkills" TEXT,
ADD COLUMN     "classId" INTEGER NOT NULL,
ADD COLUMN     "goodAttitude" TEXT,
ADD COLUMN     "goodKnowledge" TEXT,
ADD COLUMN     "goodSkills" TEXT,
ADD COLUMN     "reviewId" SERIAL NOT NULL,
ADD COLUMN     "reviewerId" INTEGER NOT NULL,
ADD COLUMN     "studentId" INTEGER NOT NULL,
ADD CONSTRAINT "Review_pkey" PRIMARY KEY ("studentId", "classId", "reviewerId", "month", "year");

-- AlterTable
ALTER TABLE "Schedule" DROP CONSTRAINT "Schedule_pkey",
DROP COLUMN "class_id",
DROP COLUMN "schedule_id",
DROP COLUMN "start_time",
ADD COLUMN     "classId" INTEGER NOT NULL,
ADD COLUMN     "scheduleId" SERIAL NOT NULL,
ADD COLUMN     "startTime" TEXT NOT NULL,
ADD CONSTRAINT "Schedule_pkey" PRIMARY KEY ("scheduleId");

-- AlterTable
ALTER TABLE "Session" DROP CONSTRAINT "Session_pkey",
DROP COLUMN "class_id",
DROP COLUMN "created_at",
DROP COLUMN "is_deleted",
DROP COLUMN "session_id",
DROP COLUMN "start_time",
DROP COLUMN "template_session_id",
DROP COLUMN "updated_at",
ADD COLUMN     "classId" INTEGER NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "sessionId" SERIAL NOT NULL,
ADD COLUMN     "startTime" TIMESTAMP(3),
ADD COLUMN     "templateSessionId" INTEGER,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD CONSTRAINT "Session_pkey" PRIMARY KEY ("sessionId");

-- AlterTable
ALTER TABLE "Tuition" DROP CONSTRAINT "Tuition_pkey",
DROP COLUMN "class_id",
DROP COLUMN "state_id",
DROP COLUMN "tuition_id",
DROP COLUMN "user_id",
ADD COLUMN     "classId" INTEGER NOT NULL,
ADD COLUMN     "status" "TuitionStatus" NOT NULL DEFAULT 'UNPAID',
ADD COLUMN     "tuitionId" SERIAL NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL,
ADD CONSTRAINT "Tuition_pkey" PRIMARY KEY ("userId", "classId", "month", "year");

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "birth_date",
DROP COLUMN "created_at",
DROP COLUMN "is_deleted",
DROP COLUMN "role_id",
DROP COLUMN "state_id",
DROP COLUMN "study_place",
DROP COLUMN "updated_at",
DROP COLUMN "user_id",
DROP COLUMN "work_place",
ADD COLUMN     "birthDate" TIMESTAMP(3),
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "otp" TEXT,
ADD COLUMN     "refreshToken" TEXT,
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'USER',
ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "studyPlace" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" SERIAL NOT NULL,
ADD COLUMN     "workPlace" TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("userId");

-- DropTable
DROP TABLE "Content_File";

-- DropTable
DROP TABLE "Role";

-- DropTable
DROP TABLE "Session_Content";

-- DropTable
DROP TABLE "State";

-- DropTable
DROP TABLE "Task_Result";

-- DropTable
DROP TABLE "Template_Session";

-- DropTable
DROP TABLE "Template_Session_Content";

-- DropTable
DROP TABLE "User_Class";

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
CREATE TABLE "TaskResult" (
    "userId" INTEGER NOT NULL,
    "contentId" INTEGER NOT NULL,
    "status" "TaskResultStatus" NOT NULL DEFAULT 'PENDING',
    "score" DOUBLE PRECISION,
    "reviews" TEXT,

    CONSTRAINT "TaskResult_pkey" PRIMARY KEY ("userId","contentId")
);

-- CreateTable
CREATE TABLE "Program" (
    "programId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
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
    "description" TEXT,
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
CREATE TABLE "ContentFile" (
    "contentId" INTEGER NOT NULL,
    "fileId" INTEGER NOT NULL,
    "role" "ContentFileRole" NOT NULL DEFAULT 'LECTURE_NOTE',

    CONSTRAINT "ContentFile_pkey" PRIMARY KEY ("contentId","fileId")
);

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
