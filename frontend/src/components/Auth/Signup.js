// frontend/src/components/Auth/Signup.js
import React, { useState } from 'react';
import { signUp } from '../../api';
import { useNavigate } from 'react-router-dom';
import '../../styles/Auth.css';

const Signup = () => {
    const [formData, setFormData] = useState({ 
        full_name: '', 
        email: '', 
        password: '', 
        role: 'seeker' // Default value
    });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signUp(formData);
            alert("Account created! Please log in.");
            navigate('/login');
        } catch (error) {
            console.error(error);
            alert("Registration failed. Email might already be in use.");
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-form-side">
                <div className="auth-header">
                    <h2>Create Account</h2>
                    <p>Join RecruitConnect today.</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="auth-input-group">
                        <label>Full Name</label>
                        <input type="text" placeholder="John Doe" onChange={(e) => setFormData({...formData, full_name: e.target.value})} required />
                    </div>
                    
                    <div className="auth-input-group">
                        <label>Email</label>
                        <input type="email" placeholder="name@company.com" onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                    </div>

                    <div className="auth-input-group">
                        <label>Join as a:</label>
                        <select 
                            value={formData.role} 
                            onChange={(e) => setFormData({...formData, role: e.target.value})}
                            className="role-selector"
                        >
                            <option value="seeker">Job Seeker (Looking for work)</option>
                            <option value="employer">Employer (Hiring talent)</option>
                        </select>
                    </div>

                    <div className="auth-input-group">
                        <label>Password</label>
                        <input type="password" placeholder="Min. 8 characters" onChange={(e) => setFormData({...formData, password: e.target.value})} required />
                    </div>

                    <button type="submit" className="auth-btn">Sign up</button>
                </form>
                <p className="auth-footer">Already have an account? <a href="/login">Log in</a></p>
            </div>
            <div className="auth-image-side">
                {/* This side displays the office image from your Figma */}
            </div>
        </div>
    );
};

export default Signup;