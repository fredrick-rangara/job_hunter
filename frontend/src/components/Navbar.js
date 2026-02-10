// frontend/src/components/Navbar.js
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <Link to="/" className="logo">Recruit<span>Connect</span></Link>
            <div className="nav-links">
                <Link to="/jobs">Browse Jobs</Link>
                {token ? (
                    <>
                        <Link to="/dashboard">Dashboard</Link>
                        {role === 'employer' && <Link to="/post-job" className="nav-btn-alt">Post a Job</Link>}
                        <button onClick={handleLogout} className="logout-link">Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/signup" className="nav-btn">Sign Up</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;