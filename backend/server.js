const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// 1. Database Connection (Local-First Logic)
const pool = new Pool({
  // This will grab the long string from Railway variables automatically
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // This is mandatory for Railway external connections
  }
});

// 2. Multer Storage (CV Uploads)
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// --- ROUTES ---

// A. Fetch all jobs
app.get('/api/jobs', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM jobs ORDER BY id DESC');
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching jobs:", err);
        res.status(500).json({ message: "Error fetching jobs" });
    }
});

// B. Fetch single job details (With Fix for "404" and ":id" formatting)
app.get('/api/jobs/:id', async (req, res) => {
    try {
        let { id } = req.params;
        
        // Fix: Remove leading colon if React accidentally sends ":1" or "1:1"
        if (id.includes(':')) {
            id = id.split(':').pop(); 
        }

        const jobId = parseInt(id);
        
        if (isNaN(jobId)) {
            return res.status(400).json({ message: "Invalid Job ID format" });
        }

        console.log(`Backend searching for Job ID: ${jobId}`);

        const result = await pool.query('SELECT * FROM jobs WHERE id = $1', [jobId]);
        
        if (result.rows.length === 0) {
            console.log(`Job ID ${jobId} not found in database.`);
            return res.status(404).json({ message: "Job not found in database" });
        }
        
        res.json(result.rows[0]);
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ message: "Server error fetching job details" });
    }
});

// C. Apply for Job
app.post('/api/apply', async (req, res) => {
    const { jobId, userId } = req.body; 
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

// D. Employer Pipeline
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
        console.error("Pipeline error:", err);
        res.status(500).json({ message: "Fetch failed" });
    }
});

// E. Update Pipeline Status
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

// F. Health Check
app.get('/api/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ message: "Database connected!", time: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend active on port ${PORT}`));