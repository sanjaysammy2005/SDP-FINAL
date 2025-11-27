import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "react-bootstrap";
import "../css/HomeNavbar.css";

const HomeNavbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  
  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Helper to scroll to section if on home page, otherwise redirect home
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className={`brave-navbar ${scrolled || isAuthPage ? "scrolled" : ""}`}>
      <div className="nav-container">
        {/* Logo Left */}
        <Link to="/" className="nav-brand" onClick={() => window.scrollTo(0, 0)}>
          <i className="bi bi-shield-check brand-icon"></i>
          <span>EMS<span className="brand-dot">.</span></span>
        </Link>

        {/* Right Side Content */}
        <div className="nav-right">
          {/* Desktop Menu - Updated Links */}
          <div className="nav-links-wrapper d-none d-md-flex">
            <Link to="/" className="nav-link" onClick={() => window.scrollTo(0, 0)}>Home</Link>
            <a href="#features" className="nav-link" onClick={(e) => {
              if (location.pathname !== '/') return; // Let default link behavior handle redirect if not on home
              e.preventDefault();
              scrollToSection('features');
            }}>Features</a>
            <a href="#about" className="nav-link" onClick={(e) => {
              if (location.pathname !== '/') return;
              e.preventDefault();
              scrollToSection('about');
            }}>About</a>
            <a href="#contact" className="nav-link" onClick={(e) => {
              if (location.pathname !== '/') return;
              e.preventDefault();
              scrollToSection('contact');
            }}>Contact</a>
          </div>

          {/* Auth Buttons Extreme Right */}
          <div className="nav-actions">
            <Link to="/login" className="login-link">
              Log in
            </Link>
            <Link to="/signup">
              <Button className="signup-btn">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default HomeNavbar;