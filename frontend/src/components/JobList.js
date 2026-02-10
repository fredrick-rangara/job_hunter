// frontend/src/components/JobsList.js
import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/Jobs.css';

const JobsList = () => {
    const [jobs, setJobs] = useState([]);
    const { search } = useLocation(); // Gets the ?search=... from the URL

    useEffect(() => {
        const fetchJobs = async () => {
            const res = await axios.get(`http://localhost:5000/api/jobs${search}`);
            setJobs(res.data);
        };
        fetchJobs();
    }, [search]);

    return (
        <div className="jobs-page">
            {/* Sidebar Filters */}
            <aside className="filters-sidebar">
                <h3>Filters</h3>
                <div className="filter-group">
                    <label>Job Type</label>
                    <div><input type="checkbox" /> Full-time</div>
                    <div><input type="checkbox" /> Remote</div>
                </div>
            </aside>

            {/* Main Job List */}
            <main className="jobs-container">
                <h2>Available Opportunities ({jobs.length})</h2>
                {jobs.map(job => (
                    <div key={job.id} className="job-card">
                        <div className="job-info">
                            <h4>{job.title}</h4>
                            <p>{job.company} • {job.location}</p>
                            <span className="salary-tag">{job.salary}</span>
                        </div>
                        <Link to={`/job/${job.id}`} className="view-btn">View Details</Link>
                    </div>
                ))}
            </main>
        </div>
    );
};

export default JobsList;