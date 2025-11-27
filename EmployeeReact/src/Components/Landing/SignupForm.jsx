import React, { useState } from "react";
import HomeNavbar from "../NavBars/HomeNavbar";
import { Link } from "react-router-dom";
import { Container, Card, Form, Button, Alert, Row, Col } from "react-bootstrap";
import "../css/SignupForm.css"; // Reuse similar styles or specific ones

const baseUrl = `${import.meta.env.VITE_API_URL}`;

const SignupForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    org: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${baseUrl}/manager/addManager`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          org: formData.org,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (response.ok) {
        setSuccess("Manager account created successfully! Please log in.");
        setFormData({ name: "", org: "", email: "", password: "", confirmPassword: "" });
      } else {
        setError("Signup failed. Email may already exist.");
      }
    } catch (error) {
      setError("Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <HomeNavbar />
      <Container className="d-flex align-items-center justify-content-center h-100 mt-4">
        <Card className="auth-card border-0 shadow-lg">
          <Card.Body className="p-5">
            <div className="text-center mb-4">
              <div className="auth-icon-wrapper mb-3">
                <i className="bi bi-person-plus-fill"></i>
              </div>
              <h2 className="fw-bold">Create Account</h2>
              <p className="text-muted">Start managing your team efficiently.</p>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold small text-muted">Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="auth-input"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold small text-muted">Organization</Form.Label>
                    <Form.Control
                      type="text"
                      name="org"
                      value={formData.org}
                      onChange={handleChange}
                      className="auth-input"
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label className="fw-bold small text-muted">Email Address</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="auth-input"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-bold small text-muted">Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="auth-input"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="fw-bold small text-muted">Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="auth-input"
                  required
                />
              </Form.Group>

              <Button type="submit" className="w-100 auth-btn mb-4" disabled={loading}>
                {loading ? "Creating Account..." : "Create Manager Account"}
              </Button>

              <div className="text-center">
                <span className="text-muted">Already have an account? </span>
                <Link to="/login" className="auth-link">Log in</Link>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default SignupForm;