// frontend/src/components/Dashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Dashboard.css';

const Dashboard = () => {
    const [data, setData] = useState(null);
    const role = localStorage.getItem('role');

    useEffect(() => {
        const fetchDashboard = async () => {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/dashboard', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setData(res.data);
        };
        fetchDashboard();
    }, []);

    if (!data) return <div className="loader">Loading Dashboard...</div>;

    return (
        <div className="dashboard-container">
            <h1>Welcome back, {role === 'employer' ? 'Hiring Manager' : 'Job Seeker'}</h1>
            
            {role === 'seeker' ? (
                <section>
                    <h3>My Applications</h3>
                    <table className="dash-table">
                        <thead>
                            <tr><th>Job</th><th>Company</th><th>Date</th><th>Status</th></tr>
                        </thead>
                        <tbody>
                            {data.applications.map((app, i) => (
                                <tr key={i}>
                                    <td>{app.job_title}</td>
                                    <td>{app.company}</td>
                                    <td>{app.applied_at}</td>
                                    <td><span className={`status ${app.status}`}>{app.status}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            ) : (
                <section>
                    <h3>My Active Listings (ATS)</h3>
                    {data.postings.map(post => (
                        <div key={post.job_id} className="posting-group">
                            <h4>{post.title} ({post.applicant_count} Applicants)</h4>
                            <table className="dash-table">
                                <thead>
                                    <tr><th>Candidate</th><th>Email</th><th>Action</th></tr>
                                </thead>
                                <tbody>
                                    {post.applicants.map(app => (
                                        <tr key={app.app_id}>
                                            <td>{app.candidate_name}</td>
                                            <td>{app.email}</td>
                                            <td><button className="view-btn-sm">Review</button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ))}
                </section>
            )}
        </div>
    );
};

export default Dashboard;