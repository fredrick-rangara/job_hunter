const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// backend/server.js
const pool = new Pool({
  // Railway provides the DATABASE_URL automatically
  connectionString: process.env.DATABASE_URL || `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  ssl: process.env.DATABASE_URL 
    ? { rejectUnauthorized: false } // Required for cloud connections
    : false // No SSL for local development
});

// 2. Multer Storage (CV Uploads)
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// --- ROUTES ---

// A. Apply for Job
app.post('/api/apply', async (req, res) => {
    const { jobId, userId } = req.body; // In production, get userId from JWT
    try {
        await pool.query(
            'INSERT INTO applications (user_id, job_id, status, applied_at) VALUES ($1, $2, $3, NOW())',
            [userId, jobId, 'Pending']
        );
        res.status(201).json({ message: "Application successful!" });
    } catch (err) {
        if (err.code === '23505') return res.status(400).json({ message: "Already applied!" });
        res.status(500).json({ message: "Server error" });
    }
});

// B. Employer Pipeline (The Logic)
app.get('/api/employer/pipeline', async (req, res) => {
    try {
        const query = `
            SELECT 
                a.id as app_id, a.status, u.name, u.email, u.cv_url, j.title as job_title
            FROM applications a
            JOIN users u ON a.user_id = u.id
            JOIN jobs j ON a.job_id = j.id
            ORDER BY a.applied_at DESC;
        `;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: "Fetch failed" });
    }
});

// C. Update Pipeline Status (Accept/Reject)
app.put('/api/applications/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        await pool.query('UPDATE applications SET status = $1 WHERE id = $2', [status, id]);
        res.json({ message: "Status updated" });
    } catch (err) {
        res.status(500).json({ message: "Update failed" });
    }
});

app.listen(5000, () => console.log('🚀 Backend active on port 5000'));