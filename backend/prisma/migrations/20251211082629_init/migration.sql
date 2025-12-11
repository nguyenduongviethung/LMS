-- CreateTable
CREATE TABLE "User" (
    "user_id" SERIAL NOT NULL,
    "state_id" INTEGER NOT NULL,
    "role_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "birth_date" TIMESTAMP(3),
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "password" TEXT NOT NULL,
    "study_place" TEXT,
    "work_place" TEXT,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Class" (
    "class_id" SERIAL NOT NULL,
    "state_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "default_tuition" DOUBLE PRECISION,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Class_pkey" PRIMARY KEY ("class_id")
);

-- CreateTable
CREATE TABLE "User_Class" (
    "user_id" INTEGER NOT NULL,
    "class_id" INTEGER NOT NULL,
    "state_id" INTEGER NOT NULL,
    "role_id" INTEGER NOT NULL,
    "enrolled_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_Class_pkey" PRIMARY KEY ("user_id","class_id")
);

-- CreateTable
CREATE TABLE "State" (
    "state_id" SERIAL NOT NULL,
    "state_type" TEXT NOT NULL,

    CONSTRAINT "State_pkey" PRIMARY KEY ("state_id")
);

-- CreateTable
CREATE TABLE "Role" (
    "role_id" SERIAL NOT NULL,
    "role_type" TEXT NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("role_id")
);

-- CreateTable
CREATE TABLE "Review" (
    "review_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "class_id" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "good_attitude" TEXT,
    "bad_attitude" TEXT,
    "good_skills" TEXT,
    "bad_skills" TEXT,
    "good_knowledge" TEXT,
    "bad_knowledge" TEXT,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("user_id","class_id","month","year")
);

-- CreateTable
CREATE TABLE "Tuition" (
    "tuition_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "class_id" INTEGER NOT NULL,
    "state_id" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Tuition_pkey" PRIMARY KEY ("user_id","class_id","month","year")
);

-- CreateTable
CREATE TABLE "Schedule" (
    "schedule_id" SERIAL NOT NULL,
    "class_id" INTEGER NOT NULL,
    "weekday" INTEGER NOT NULL,
    "start_time" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("schedule_id")
);

-- CreateTable
CREATE TABLE "Session" (
    "session_id" SERIAL NOT NULL,
    "template_session_id" INTEGER,
    "class_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "start_time" TIMESTAMP(3),
    "duration" INTEGER,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("session_id")
);

-- CreateTable
CREATE TABLE "Attendance" (
    "user_id" INTEGER NOT NULL,
    "session_id" INTEGER NOT NULL,
    "status_id" INTEGER NOT NULL,
    "note" TEXT,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("user_id","session_id")
);

-- CreateTable
CREATE TABLE "Task_Result" (
    "user_id" INTEGER NOT NULL,
    "content_id" INTEGER NOT NULL,
    "state_id" INTEGER NOT NULL,
    "score" DOUBLE PRECISION,
    "reivews" TEXT,

    CONSTRAINT "Task_Result_pkey" PRIMARY KEY ("user_id","content_id")
);

-- CreateTable
CREATE TABLE "Template_Session" (
    "template_session_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Template_Session_pkey" PRIMARY KEY ("template_session_id")
);

-- CreateTable
CREATE TABLE "Session_Content" (
    "session_content_id" SERIAL NOT NULL,
    "session_id" INTEGER NOT NULL,
    "content_id" INTEGER NOT NULL,

    CONSTRAINT "Session_Content_pkey" PRIMARY KEY ("session_content_id")
);

-- CreateTable
CREATE TABLE "Template_Session_Content" (
    "template_session_content_id" SERIAL NOT NULL,
    "template_session_id" INTEGER NOT NULL,
    "content_id" INTEGER NOT NULL,

    CONSTRAINT "Template_Session_Content_pkey" PRIMARY KEY ("template_session_content_id")
);

-- CreateTable
CREATE TABLE "Content" (
    "content_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "content_type" TEXT NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "cutoff_score" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Content_pkey" PRIMARY KEY ("content_id")
);

-- CreateTable
CREATE TABLE "File" (
    "file_id" SERIAL NOT NULL,
    "filename" TEXT NOT NULL,
    "filetype" TEXT NOT NULL,
    "filepath" TEXT NOT NULL,
    "filesize" INTEGER NOT NULL,
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "File_pkey" PRIMARY KEY ("file_id")
);

-- CreateTable
CREATE TABLE "Content_File" (
    "content_id" INTEGER NOT NULL,
    "file_id" INTEGER NOT NULL,
    "file_role" TEXT NOT NULL,

    CONSTRAINT "Content_File_pkey" PRIMARY KEY ("content_id","file_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "State"("state_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Role"("role_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "State"("state_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Class" ADD CONSTRAINT "User_Class_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Class" ADD CONSTRAINT "User_Class_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "Class"("class_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Class" ADD CONSTRAINT "User_Class_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "State"("state_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Class" ADD CONSTRAINT "User_Class_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Role"("role_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "Class"("class_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tuition" ADD CONSTRAINT "Tuition_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tuition" ADD CONSTRAINT "Tuition_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "Class"("class_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tuition" ADD CONSTRAINT "Tuition_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "State"("state_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "Class"("class_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_template_session_id_fkey" FOREIGN KEY ("template_session_id") REFERENCES "Template_Session"("template_session_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "Class"("class_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "Session"("session_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "State"("state_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task_Result" ADD CONSTRAINT "Task_Result_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task_Result" ADD CONSTRAINT "Task_Result_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "Content"("content_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task_Result" ADD CONSTRAINT "Task_Result_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "State"("state_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session_Content" ADD CONSTRAINT "Session_Content_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "Session"("session_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session_Content" ADD CONSTRAINT "Session_Content_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "Content"("content_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Template_Session_Content" ADD CONSTRAINT "Template_Session_Content_template_session_id_fkey" FOREIGN KEY ("template_session_id") REFERENCES "Template_Session"("template_session_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Template_Session_Content" ADD CONSTRAINT "Template_Session_Content_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "Content"("content_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Content_File" ADD CONSTRAINT "Content_File_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "Content"("content_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Content_File" ADD CONSTRAINT "Content_File_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "File"("file_id") ON DELETE RESTRICT ON UPDATE CASCADE;
