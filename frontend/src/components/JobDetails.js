// frontend/src/components/JobDetails.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/JobDetails.css';

const JobDetails = () => {
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [applied, setApplied] = useState(false);

    useEffect(() => {
        axios.get(`http://localhost:5000/api/jobs/${id}`)
             .then(res => setJob(res.data));
    }, [id]);

    const handleApply = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/apply', 
                { job_id: id }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setApplied(true);
            alert("Application Successful!");
        } catch (err) {
            alert(err.response.data.msg || "Login required to apply.");
        }
    };

    if (!job) return <div className="loader">Loading...</div>;

    return (
        <div className="details-page">
            <header className="job-header">
                <h1>{job.title}</h1>
                <p className="company-meta">{job.company} • {job.location}</p>
                <div className="job-tags">
                    <span>Full-time</span>
                    <span>{job.salary}</span>
                </div>
            </header>

            <div className="details-grid">
                <main className="job-description">
                    <h3>Job Description</h3>
                    <p>{job.description}</p>
                    
                    <h3>Requirements</h3>
                    <ul>
                        {job.requirements.map((req, i) => <li key={i}>{req}</li>)}
                    </ul>
                </main>

                <aside className="apply-card">
                    <h4>Interested?</h4>
                    <p>Applications close in 5 days.</p>
                    <button 
                        disabled={applied} 
                        onClick={handleApply} 
                        className={applied ? "applied-btn" : "apply-btn"}
                    >
                        {applied ? "Application Sent" : "Apply for this Job"}
                    </button>
                </aside>
            </div>
        </div>
    );
};

export default JobDetails;