# LMS – Learning Management System

A full‑stack Learning Management System built with modern web technologies, supporting class management, sessions, attendance, permissions, and file uploads.

---

## ✨ Features

* User management (admin, teacher, student roles)
* Class & enrollment management
* Session scheduling
* Automatic attendance initialization
* Permission‑based access control
* File upload & management
* JWT authentication with refresh tokens
* Dockerized development environment

---

## 🧱 Tech Stack

### Backend

* Node.js + Express
* TypeScript
* Prisma ORM
* PostgreSQL
* JWT Authentication

### Frontend

* React (Vite)
* TypeScript
* Tailwind CSS
* Axios

### DevOps

* Docker
* Docker Compose

---

## 📦 Requirements

* Docker
* Docker Compose
* Git

---

## 🚀 Setup

Clone repository:

```bash
git clone https://github.com/nguyenduongviethung/LMS.git
cd LMS
```

Environment configuration:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Start containers:

```bash
docker compose up -d --build
```

---

## 🗄️ Database Setup

### Run migrations

```bash
docker compose exec backend npx prisma migrate deploy
```

### Seed initial data

```bash
docker compose exec backend npx prisma db seed
```

---

## 🌐 Access Services

| Service       | URL                                            |
| ------------- | ---------------------------------------------- |
| Frontend      | [http://localhost:5173](http://localhost:5173) |
| Backend API   | [http://localhost:3000](http://localhost:3000) |
| Prisma Studio | [http://localhost:5555](http://localhost:5555) |

---

## 🔑 Demo Accounts

After seeding database, you can login using following accounts:

### Admin
Email: admin@lms.local  
Password: 123456  

### Teachers
Email: teacher1@lms.local → teacher5@lms.local  
Password: 123456  

### Teaching Assistants
Email: ta1@lms.local → ta5@lms.local  
Password: 123456  

### Students
Email: student1@lms.local → student20@lms.local  
Password: 123456  

---

## 📁 Project Structure

```
LMS/
├─ backend/
│  ├─ src/
│  ├─ prisma/
│  ├─ Dockerfile
│  └─ .env
├─ frontend/
│  ├─ src/
│  ├─ Dockerfile
│  └─ .env
├─ docker-compose.yml
└─ README.md
```

---

## 🔐 Environment Variables

### Backend (.env)

```env
DATABASE_URL=
JWT_SECRET=
REFRESH_TOKEN_SECRET=
PORT=3000
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:3000
```

---

## 🧪 Useful Commands

Backend shell:

```bash
docker compose exec backend sh
```

Run Prisma Studio:

```bash
docker compose exec backend npx prisma studio
```

Rebuild containers:

```bash
docker compose up -d --build
```

Stop services:

```bash
docker compose down
```

---

## 📌 Development Notes

* Backend runs in watch mode inside container
* Frontend hot reload supported
* API base path: `/api`
* Auth uses httpOnly refresh token cookies

---

## 🧩 Roadmap

* [ ] Grade management
* [ ] Assignment submission
* [ ] Notifications
* [ ] Real‑time session tracking
* [ ] Mobile responsive improvements

---

## 📄 License

MIT License

---

## 📬 Contact

Author: Nguyễn Dương Việt Hùng  
GitHub: [https://github.com/nguyenduongviethung](https://github.com/nguyenduongviethung)

---

If you find this project useful, consider giving it a ⭐ on GitHub!
