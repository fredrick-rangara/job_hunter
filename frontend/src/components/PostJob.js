import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Auth.css'; // Reusing your purple-themed form styles

const PostJob = () => {
    const [jobData, setJobData] = useState({
        title: '', company: '', location: '', salary: '', description: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/jobs', jobData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Job posted successfully!");
        } catch (err) {
            alert("Failed to post job. Ensure you are logged in as an employer.");
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-form-side">
                <h2>Post a New Job</h2>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Job Title" onChange={e => setJobData({...jobData, title: e.target.value})} required />
                    <input type="text" placeholder="Company" onChange={e => setJobData({...jobData, company: e.target.value})} required />
                    <input type="text" placeholder="Location" onChange={e => setJobData({...jobData, location: e.target.value})} required />
                    <input type="text" placeholder="Salary" onChange={e => setJobData({...jobData, salary: e.target.value})} />
                    <textarea placeholder="Job Description" onChange={e => setJobData({...jobData, description: e.target.value})} required />
                    <button type="submit" className="auth-btn">Publish Listing</button>
                </form>
            </div>
        </div>
    );
};

export default PostJob;