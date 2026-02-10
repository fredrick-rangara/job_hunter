import React, { useState } from 'react';
import { signIn } from '../api';
import { useNavigate } from 'react-router-dom';
import '../styles/Auth.css';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await signIn(formData);
            localStorage.setItem('token', data.access_token);
            localStorage.setItem('role', data.role);
            navigate('/dashboard'); // Go to dashboard after login
        } catch (error) {
            alert("Login failed. Check your credentials.");
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-form-side">
                <div className="auth-header">
                    <h2>Welcome back!</h2>
                    <p>Please enter your details to log in.</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="auth-input-group">
                        <label>Email</label>
                        <input type="email" onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                    </div>
                    <div className="auth-input-group">
                        <label>Password</label>
                        <input type="password" onChange={(e) => setFormData({...formData, password: e.target.value})} required />
                    </div>
                    <button type="submit" className="auth-btn">Log in</button>
                </form>
            </div>
            <div className="auth-image-side"></div>
        </div>
    );
};

export default Login;