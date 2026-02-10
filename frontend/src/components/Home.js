// frontend/src/components/Home.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
    const [keyword, setKeyword] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        // Redirect to /jobs with the search query as a parameter
        navigate(`/jobs?search=${keyword}`);
    };

    return (
        <div className="home-container">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-overlay">
                    <h1>Find Your Dream Job Today!</h1>
                    <p>Connecting talent with opportunity across the globe.</p>
                    
                    <form className="search-bar" onSubmit={handleSearch}>
                        <input 
                            type="text" 
                            placeholder="Job title or keyword" 
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                        <input type="text" placeholder="Location" />
                        <button type="submit" className="search-btn">Search Jobs</button>
                    </form>
                </div>
            </section>

            {/* Featured Section (Placeholder for now) */}
            <section className="featured-listings">
                <h2>Recent Job Listings</h2>
                <div className="listing-grid">
                    {/* We will map through jobs here in the next step */}
                    <p>Loading the latest opportunities...</p>
                </div>
            </section>
        </div>
    );
};

export default Home;