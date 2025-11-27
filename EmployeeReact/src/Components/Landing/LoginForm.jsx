import { useState } from "react";
import "../css/LoginForm.css";
import HomeNavbar from "../NavBars/HomeNavbar";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Card, Form, Button, Alert, Spinner } from "react-bootstrap";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const baseUrl = `${import.meta.env.VITE_API_URL}`;

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setLoading(true);
    setError("");

    try {
      // API call parameters
      const params = new URLSearchParams();
      params.append('email', email);
      params.append('password', password);

      const response = await axios.post(`${baseUrl}/auth/login`, params);

      if (response.data.error) {
        setError(response.data.error);
      } else {
        const { id, role, name } = response.data;

        localStorage.setItem("id", id);
        localStorage.setItem("role", role);
        localStorage.setItem("userName", name || (role === "MANAGER" ? "Manager" : "Employee"));
        
        if (role === "EMPLOYEE") {
          localStorage.setItem("employeeId", id);
          navigate("/employeedashboard");
        } else if (role === "MANAGER") {
          localStorage.setItem("managerId", id);
          navigate("/managerdashboard");
        } else if (role === "SUPER_ADMIN") {
          navigate("/superadmindashboard");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <HomeNavbar />
      <Container className="d-flex align-items-center justify-content-center h-100">
        <Card className="auth-card border-0 shadow-lg">
          <Card.Body className="p-5">
            <div className="text-center mb-4">
              <div className="auth-icon-wrapper mb-3">
                <i className="bi bi-box-arrow-in-right"></i>
              </div>
              <h2 className="fw-bold">Welcome back</h2>
              <p className="text-muted">Please enter your details to sign in.</p>
            </div>

            {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

            <Form onSubmit={handleLogin}>
              <Form.Group className="mb-4">
                <Form.Label className="fw-bold small text-uppercase text-muted">Email Address</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="auth-input"
                  placeholder="name@company.com"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="fw-bold small text-uppercase text-muted">Password</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="auth-input"
                  placeholder="••••••••"
                  required
                />
              </Form.Group>

              <Button 
                type="submit" 
                className="w-100 auth-btn mb-4" 
                disabled={loading}
              >
                {loading ? <Spinner animation="border" size="sm" /> : "Sign in"}
              </Button>

              <div className="text-center">
                <span className="text-muted">Don't have an account? </span>
                <Link to="/signup" className="auth-link">Sign up</Link>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default LoginForm;