# JobHunter - Full Stack Job Portal

A modern job board built with React, Node.js, and PostgreSQL.

## 🚀 Features
- **Job Seekers:** Browse jobs, upload CVs (PDF), and track application status.
- **Employers:** Post jobs and manage a hiring pipeline (Pending/Accepted/Rejected).
- **Security:** JWT Authentication and protected routes.

## 🛠️ Setup

### 1. Database (PostgreSQL)
Run the following in your `psql` terminal:
```sql
CREATE DATABASE job_hunter;
-- Run the table creation scripts found in /database/schema.sql

cd backend
npm install
# Create a .env file with your DB credentials
node server.js

cd frontend
npm install
npm run dev

📂 Project Structure
/frontend: React + Tailwind CSS

/backend: Express + Multer + PG Pool

/uploads: Storage for seeker CVs

---

### Final Project Architecture


### What's next for you?
You have built a functional MVP (Minimum Viable Product). From here, you could:
1. **Deploy:** Use Render or Railway.app to put this online.
2. **Refine:** Add a "Search" bar to filter jobs by title.
3. **Notify:** Use an email service (like Nodemailer) to email the seeker when they get "Accepted."