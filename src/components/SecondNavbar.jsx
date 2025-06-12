import { useState } from 'react';
import { Link } from 'react-router-dom';
import './SecondNavbar.css';

const SecondNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleToggle = () => setMenuOpen((open) => !open);

  return (
    <nav className="second-navbar">
      <div className="second-navbar-container">
        <div className="second-nav-links">
          <a href="#" className="second-nav-link">Phones</a>
          <a href="#" className="second-nav-link">Laptops</a>
          <a href="#" className="second-nav-link">Headphones</a>
          <a href="#" className="second-nav-link">Speakers</a>
          <a href="#" className="second-nav-link">Smart Watches</a>
          <a href="#" className="second-nav-link">Gaming</a>
          <a href="#" className="second-nav-link">Features</a>
        </div>
        <div className="second-contact-info">
          <p>Need Help? Call Us +84 2500 888 33</p>
        </div>
      </div>
    </nav>
  );
};

export default SecondNavbar;