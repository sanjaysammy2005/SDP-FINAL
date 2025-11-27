import React, { useEffect, useState } from "react";
import { Container, Row, Col, Table, Spinner, Button, Badge, Alert, Modal } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import AddEmployee from "./AddEmployee";
import 'bootstrap-icons/font/bootstrap-icons.css';
import './ManagerDashboard.css';

const ManagerDashboard = () => {
  const [managerId, setManagerId] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, pendingLeaves: 0, active: 0 });
  const [showAddModal, setShowAddModal] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const managerName = localStorage.getItem("userName") || "Manager";
  const baseUrl = `${import.meta.env.VITE_API_URL}`;

  useEffect(() => {
    const storedManagerId = localStorage.getItem("managerId");
    if (storedManagerId) {
      setManagerId(storedManagerId);
      fetchData(storedManagerId);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const fetchData = async (id) => {
    try {
      setLoading(true);
      const [empRes, leaveRes] = await Promise.all([
        axios.get(`${baseUrl}/api/employees/byManager/${id}`),
        axios.get(`${baseUrl}/api/leave-requests/status/PENDING`)
      ]);

      const team = empRes.data;
      const teamIds = team.map(e => e.id);
      const teamLeaves = leaveRes.data.filter(l => teamIds.includes(l.employeeId || l.employee?.id));

      setEmployees(team);
      setStats({
        total: team.length,
        active: team.filter(e => e.status === 'ACCEPTED').length,
        pendingLeaves: teamLeaves.length
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const ManagerDock = () => (
    <div className="brave-dock-container">
      <div className="brave-dock">
        <Link to="/managerdashboard" className={`dock-item ${location.pathname === '/managerdashboard' ? 'active' : ''}`} data-label="Dashboard">
          <i className="bi bi-speedometer2"></i>
        </Link>
        <Link to="/leave/approvals" className={`dock-item ${location.pathname === '/leave/approvals' ? 'active' : ''}`} data-label="Approvals">
          <i className="bi bi-calendar-check"></i>
          {stats.pendingLeaves > 0 && <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{fontSize: '0.6rem'}}>{stats.pendingLeaves}</span>}
        </Link>
        <Link to="/attendance/manage" className={`dock-item ${location.pathname === '/attendance/manage' ? 'active' : ''}`} data-label="Attendance">
          <i className="bi bi-clock-history"></i>
        </Link>
        <Link to="/manager/tasks" className={`dock-item ${location.pathname === '/manager/tasks' ? 'active' : ''}`} data-label="Tasks">
          <i className="bi bi-list-check"></i>
        </Link>
        <Link to="/managerprofile" className={`dock-item ${location.pathname === '/managerprofile' ? 'active' : ''}`} data-label="Profile">
          <i className="bi bi-person"></i>
        </Link>
        <div className="dock-separator"></div>
        <div className="dock-item text-danger" onClick={() => { localStorage.clear(); navigate("/login"); }} style={{cursor:'pointer'}} data-label="Logout">
          <i className="bi bi-box-arrow-right"></i>
        </div>
      </div>
    </div>
  );

  return (
    <div className="dashboard-container">
      <Container className="main-content">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-end mb-5">
          <div>
            <h6 className="text-uppercase text-secondary fw-bold small mb-2">Manager Portal</h6>
            <h1 className="fw-bold mb-0">Hello, {managerName}</h1>
          </div>
          <div className="text-end">
            <p className="text-muted mb-0">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>

        {/* Stats Grid */}
        <Row className="g-4 mb-5">
          <Col md={4}>
            <div className="card-brave p-4 d-flex align-items-center justify-content-between">
              <div>
                <h2 className="fw-bold mb-0 text-primary">{stats.total}</h2>
                <p className="text-muted mb-0 small fw-bold">TOTAL MEMBERS</p>
              </div>
              <div className="bg-light rounded-circle p-3 text-primary"><i className="bi bi-people fs-4"></i></div>
            </div>
          </Col>
          <Col md={4}>
            <div className="card-brave p-4 d-flex align-items-center justify-content-between">
              <div>
                <h2 className="fw-bold mb-0 text-warning">{stats.pendingLeaves}</h2>
                <p className="text-muted mb-0 small fw-bold">PENDING LEAVES</p>
              </div>
              <div className="bg-light rounded-circle p-3 text-warning"><i className="bi bi-calendar-event fs-4"></i></div>
            </div>
          </Col>
          <Col md={4}>
            <div className="card-brave p-4 d-flex align-items-center justify-content-between">
              <div>
                <h2 className="fw-bold mb-0 text-success">{stats.active}</h2>
                <p className="text-muted mb-0 small fw-bold">ACTIVE STATUS</p>
              </div>
              <div className="bg-light rounded-circle p-3 text-success"><i className="bi bi-check-circle fs-4"></i></div>
            </div>
          </Col>
        </Row>

        {/* Team Section */}
        <div className="card-brave">
          <div className="card-header-brave d-flex justify-content-between align-items-center">
            <span>My Team</span>
            <Button className="btn-brave" onClick={() => setShowAddModal(true)}>
              <i className="bi bi-person-plus me-2"></i>Add Employee
            </Button>
          </div>
          <div className="p-0">
            {loading ? (
              <div className="text-center py-5"><Spinner animation="border" variant="danger"/></div>
            ) : employees.length > 0 ? (
              <Table hover responsive className="table-brave mb-0">
                <thead>
                  <tr>
                    <th className="ps-4">Name</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th className="text-end pe-4">ID</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map(emp => (
                    <tr key={emp.id}>
                      <td className="ps-4 fw-bold">{emp.name}</td>
                      <td className="text-muted">{emp.email}</td>
                      <td>
                        <Badge bg={emp.status === 'ACCEPTED' ? 'success' : 'secondary'} className="px-3 py-2 rounded-pill">
                          {emp.status}
                        </Badge>
                      </td>
                      <td className="text-end pe-4 text-muted">#{emp.id}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <div className="text-center py-5 text-muted">No employees found. Start by adding one!</div>
            )}
          </div>
        </div>
      </Container>

      {/* Add Employee Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered contentClassName="border-0 rounded-4 shadow">
        <Modal.Body className="p-0">
          <AddEmployee managerId={managerId} onSuccess={() => { setShowAddModal(false); fetchData(managerId); }} onCancel={() => setShowAddModal(false)} />
        </Modal.Body>
      </Modal>

      <ManagerDock />
    </div>
  );
};

export default ManagerDashboard;