import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import HomeNavbar from "../NavBars/HomeNavbar";
import Footer from "./Footer";
import "../css/HomePage.css";

const HomePage = () => {
  const featureCards = [
    {
      icon: "bi-shield-lock",
      title: "Secure Access",
      text: "Enterprise-grade security with role-based permissions."
    },
    {
      icon: "bi-people",
      title: "Team Management",
      text: "Organize departments and manage hierarchies efficiently."
    },
    {
      icon: "bi-calendar-check",
      title: "Smart Attendance",
      text: "Automated tracking with geo-fencing capabilities."
    },
    {
      icon: "bi-cash-coin",
      title: "Automated Payroll",
      text: "One-click salary processing and slip generation."
    },
    {
      icon: "bi-graph-up",
      title: "Analytics",
      text: "Real-time insights into workforce productivity."
    },
    {
      icon: "bi-file-earmark-text",
      title: "Digital Docs",
      text: "Paperless document storage and management."
    }
  ];

  return (
    <div className="brave-landing">
      <HomeNavbar />

      {/* --- HERO SECTION --- */}
      <section className="hero-section" id="home">
        <Container className="text-center hero-content">
          <div className="hero-badge">
            <span className="badge-dot"></span>
            v2.0 is now live
          </div>
          <h1 className="hero-title">
            The Employee System <br />
            <span className="hero-highlight">Built for Speed</span>
          </h1>
          <p className="hero-subtitle">
            Experience the future of workforce management. Secure, private, and 
            incredibly fast. Join the new standard of HR technology.
          </p>
          <div className="hero-actions">
            <Link to="/signup">
              <Button className="hero-btn-primary">
                Start Free Trial
              </Button>
            </Link>
            <Link to="/contact">
              <Button className="hero-btn-outline">
                Book Demo
              </Button>
            </Link>
          </div>
          
          {/* Dashboard Graphic with Image Support */}
          <div className="hero-visual">
            <div className="dashboard-mockup">
              <div className="mockup-header">
                <div className="dot red"></div>
                <div className="dot yellow"></div>
                <div className="dot green"></div>
              </div>
              <div className="mockup-screen">
                {/* REPLACE THIS SRC WITH YOUR DASHBOARD SCREENSHOT */}
                <img 
                  src="/images/bg-Image-1.jpg" 
                  alt="App Dashboard" 
                  className="dashboard-img" 
                />
                {/* Optional overlay to make it look professional if image is just a placeholder */}
                <div className="img-overlay"></div> 
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* --- FEATURES GRID --- */}
      <section className="features-section" id="features">
        <Container>
          <div className="section-header text-center">
            <h2 className="section-title">Everything you need</h2>
            <p className="section-desc">Powerful features wrapped in a beautiful interface.</p>
          </div>
          
          <Row className="g-4">
            {featureCards.map((feature, index) => (
              <Col lg={4} md={6} key={index}>
                <div className="feature-card-brave">
                  <div className="feature-icon">
                    <i className={`bi ${feature.icon}`}></i>
                  </div>
                  <h4>{feature.title}</h4>
                  <p>{feature.text}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* --- ABOUT SECTION --- */}
      <section className="about-section" id="about">
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <div className="about-content">
                <h6 className="text-uppercase text-danger fw-bold ls-1 mb-2">About Us</h6>
                <h2 className="section-title text-start mb-4">Empowering Teams to Achieve More</h2>
                <p className="section-desc text-start mb-4">
                  We built EMS with a single mission: to remove the friction from human resources. 
                  Traditional tools are clunky, slow, and hard to use. We are changing that with 
                  a platform that is as beautiful as it is powerful.
                </p>
                <div className="about-stats d-flex gap-5 mt-4">
                  <div>
                    <h3 className="fw-bold text-dark">500+</h3>
                    <p className="text-muted">Companies</p>
                  </div>
                  <div>
                    <h3 className="fw-bold text-dark">98%</h3>
                    <p className="text-muted">Satisfaction</p>
                  </div>
                </div>
              </div>
            </Col>
            <Col lg={6} className="mt-5 mt-lg-0">
              <div className="about-image-wrapper">
                <img src="/images/about-image.jpg" alt="Team" className="img-fluid rounded-4 shadow-lg" />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* --- CONTACT SECTION --- */}
      <section className="contact-section" id="contact">
        <Container>
          <div className="contact-card p-5 rounded-5">
            <Row className="justify-content-center">
              <Col lg={8} className="text-center">
                <h2 className="text-white fw-bold mb-3">Get in Touch</h2>
                <p className="text-white-50 mb-5">Have questions? We're here to help.</p>
                
                <Form className="contact-form text-start bg-white p-4 rounded-4 shadow">
                  <Row>
                    <Col md={6} className="mb-3">
                      <Form.Label className="fw-bold small">Name</Form.Label>
                      <Form.Control type="text" placeholder="JSK" className="brave-input" />
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Label className="fw-bold small">Email</Form.Label>
                      <Form.Control type="email" placeholder="ems@example.com" className="brave-input" />
                    </Col>
                  </Row>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold small">Message</Form.Label>
                    <Form.Control as="textarea" rows={4} placeholder="How can we help?" className="brave-input" />
                  </Form.Group>
                  <Button className="w-100 hero-btn-primary">Send Message</Button>
                </Form>
              </Col>
            </Row>
          </div>
        </Container>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;