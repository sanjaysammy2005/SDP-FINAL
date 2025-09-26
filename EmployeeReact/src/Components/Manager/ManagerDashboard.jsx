import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Spinner,
  Nav,
  Button,
  Badge,
} from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import AddEmployee from "../Manager/AddEmployee";
import "./ManagerDashboard.css";

const ManagerDashboard = () => {
  const [managerId, setManagerId] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    pendingLeaves: 0,
    recentLeaves: [],
  });
  const navigate = useNavigate();
  const location = useLocation();
  const managerName = localStorage.getItem("userName") || "Manager";
  //const API_BASE_URL = 'http://localhost:8080';
  //
  const baseUrl = `${import.meta.env.VITE_API_URL}`;

  useEffect(() => {
    const storedManagerId = localStorage.getItem("managerId");
    if (storedManagerId) {
      setManagerId(storedManagerId);
      fetchEmployees(storedManagerId);
      fetchDashboardStats(storedManagerId);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const fetchEmployees = async (id) => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/employees/byManager/${id}`
      );
      setEmployees(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching employees:", error);
      setLoading(false);
    }
  };

  const fetchDashboardStats = async (id) => {
    try {
      const [employeesRes, leavesRes] = await Promise.all([
        axios.get(`${baseUrl}/api/employees/byManager/${id}`), // Correct endpoint
        axios.get(`${baseUrl}/api/leave-requests/status/PENDING`),
      ]);

      const employeesInTeam = employeesRes.data.filter(emp => emp.manager.id == id);
      const pendingLeavesForTeam = leavesRes.data.filter(leave => 
        employeesInTeam.some(emp => emp.id === leave.employee.id)
      );
      
      setStats({
        totalEmployees: employeesInTeam.length,
        pendingLeaves: pendingLeavesForTeam.length,
        recentLeaves: pendingLeavesForTeam.slice(0, 3),
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <Container fluid className="dashboard-container">
      <Row className="g-0">
        {/* Sidebar */}
        <Col md={2} className="sidebar bg-primary text-white vh-100 sticky-top">
          <div className="sidebar-header p-4 text-center">
            <h4 className="text-white">Manager Portal</h4>
            <div className="employee-info mt-4">
              <div 
                className="avatar bg-white text-primary rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                style={{ width: "70px", height: "70px" }}
              >
                <span className="fs-3 fw-bold">{managerName.charAt(0)}</span>
              </div>
              <h5 className="mb-0 text-white">{managerName}</h5>
              <small className="text-white-50">Manager</small>
            </div>
          </div>

          <Nav className="flex-column p-3">
            <Nav.Item className="mb-2">
              <Nav.Link as={Link} to="/managerdashboard" className={`text-white hover-bg-primary-dark rounded ${location.pathname === '/managerdashboard' ? 'active bg-primary-dark' : ''}`}>
                <i className="bi bi-speedometer2 me-2"></i>Dashboard
              </Nav.Link>
            </Nav.Item>
            <Nav.Item className="mb-2">
              <Nav.Link as={Link} to="/leave/approvals" className={`text-white hover-bg-primary-dark rounded ${location.pathname === '/leave/approvals' ? 'active bg-primary-dark' : ''}`}>
                <i className="bi bi-calendar-event me-2"></i>Leave Approvals
                {stats.pendingLeaves > 0 && (
                  <Badge pill bg="danger" className="ms-2">
                    {stats.pendingLeaves}
                  </Badge>
                )}
              </Nav.Link>
            </Nav.Item>
            <Nav.Item className="mb-2">
              <Nav.Link as={Link} to="/attendance/manage" className={`text-white hover-bg-primary-dark rounded ${location.pathname === '/attendance/manage' ? 'active bg-primary-dark' : ''}`}>
                <i className="bi bi-clock-history me-2"></i>Attendance
              </Nav.Link>
            </Nav.Item>
            {/* New Nav.Item for Task Management */}
            <Nav.Item className="mb-2">
              <Nav.Link as={Link} to="/manager/tasks" className={`text-white hover-bg-primary-dark rounded ${location.pathname === '/manager/tasks' ? 'active bg-primary-dark' : ''}`}>
                <i className="bi bi-list-task me-2"></i>Task Management
              </Nav.Link>
            </Nav.Item>
            <Nav.Item className="mb-2">
              <Nav.Link as={Link} to="#" className="text-white hover-bg-primary-dark rounded">
                <i className="bi bi-people-fill me-2"></i>Team Management
              </Nav.Link>
            </Nav.Item>
            <Nav.Item className="mt-4">
              <Button
                variant="outline-light"
                size="sm"
                className="w-100"
                onClick={handleLogout}
              >
                <i className="bi bi-box-arrow-left me-2"></i>Logout
              </Button>
            </Nav.Item>
          </Nav>
        </Col>

        {/* Main Content Area */}
        <Col md={10} className="main-content p-4">
          {/* Top Navigation */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="text-primary fw-bold">Welcome, {managerName}</h2>
            <div className="d-flex align-items-center">
              <Button variant="outline-primary" size="sm" className="me-2 notification-btn">
                <i className="bi bi-bell-fill"></i>
              </Button>
              <Button variant="outline-primary" size="sm" className="me-3 notification-btn">
                <i className="bi bi-envelope-fill"></i>
              </Button>
              <span className="text-muted date-display">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>

          {/* Stats Cards */}
          <Row className="mb-4 g-3">
            <Col md={4}>
              <Card className="stat-card shadow-sm h-100">
                <Card.Body className="d-flex align-items-center">
                  <div className="icon-circle bg-blue-light me-3">
                    <i className="bi bi-people-fill text-primary fs-4"></i>
                  </div>
                  <div>
                    <h6 className="text-muted mb-1">Team Members</h6>
                    <h3 className="text-primary mb-0">{stats.totalEmployees}</h3>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="stat-card shadow-sm h-100">
                <Card.Body className="d-flex align-items-center">
                  <div className="icon-circle bg-orange-light me-3">
                    <i className="bi bi-calendar-x text-warning fs-4"></i>
                  </div>
                  <div>
                    <h6 className="text-muted mb-1">Pending Leaves</h6>
                    <h3 className="text-warning mb-0">{stats.pendingLeaves}</h3>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="stat-card shadow-sm h-100">
                <Card.Body className="d-flex align-items-center">
                  <div className="icon-circle bg-green-light me-3">
                    <i className="bi bi-check-circle text-success fs-4"></i>
                  </div>
                  <div>
                    <h6 className="text-muted mb-1">Active Members</h6>
                    <h3 className="text-success mb-0">
                      {employees.filter(e => e.status === "ACCEPTED").length}
                    </h3>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Main Content Sections */}
          <Row className="g-3">
            {/* Recent Leave Requests */}
            <Col md={6}>
              <Card className="shadow-sm h-100">
                <Card.Header className="bg-white border-0 d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Recent Leave Requests</h5>
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    as={Link} 
                    to="/leave/approvals"
                  >
                    View All
                  </Button>
                </Card.Header>
                <Card.Body>
                  {stats.recentLeaves.length > 0 ? (
                    <div className="table-responsive">
                      <Table hover className="mb-0">
                        <thead>
                          <tr>
                            <th>Employee</th>
                            <th>Dates</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stats.recentLeaves.map((leave) => (
                            <tr key={leave.id}>
                              <td>{leave.employee?.name || `Employee #${leave.employeeId}`}</td>
                              <td>{new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}</td>
                              <td>
                                <Badge bg="warning" className="text-white">Pending</Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <i className="bi bi-calendar-x text-muted fs-1"></i>
                      <p className="text-muted mt-2">No pending leave requests</p>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>

            {/* Team Members */}
            <Col md={6}>
              <Card className="shadow-sm h-100" style={{ height: "400px", width: "100%" }}>
                <Card.Header className="bg-white border-0 d-flex justify-content-between align-items-center" style={{marginRight: "20px"}}>
                  <h5 className="mb-0">Your Team</h5>
                  <AddEmployee managerId={managerId} onEmployeeAdded={fetchEmployees} />
                </Card.Header>
                <Card.Body>
                  {loading ? (
                    <div className="text-center py-4">
                      <Spinner animation="border" variant="primary" />
                    </div>
                  ) : employees.length > 0 ? (
                    <div className="table-responsive" style={{ maxHeight: "300px", overflowY: "auto" }}>
                      <Table hover className="mb-0">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {employees.map((employee) => (
                            <tr key={employee.id}>
                              <td>{employee.id}</td>
                              <td>{employee.name}</td>
                              <td>{employee.email}</td>
                              <td>
                                <Badge bg={employee.status === 'ACCEPTED' ? "success" : "secondary"}>
                                  {employee.status === 'ACCEPTED' ? "Active" : "Inactive"}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <i className="bi bi-people text-muted fs-1"></i>
                      <p className="text-muted mt-2">No employees found</p>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default ManagerDashboard;
