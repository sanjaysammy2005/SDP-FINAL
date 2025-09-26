import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Alert,
  ButtonGroup,
  Button,
  Badge,
  Nav,
  Spinner
} from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './ManagerDashboard.css';

const ManagerLeavePage = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [filter, setFilter] = useState('PENDING');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();
  const managerId = localStorage.getItem("managerId");
  const managerName = localStorage.getItem("userName") || "Manager";

  const baseUrl = import.meta.env.VITE_API_URL;

  const getLinkClass = (path) =>
    `text-white hover-bg-primary-dark rounded ${
      location.pathname === path ? "active bg-primary-dark" : ""
    }`;

  const fetchLeaveRequests = async () => {
    try {
      if (!managerId) {
        navigate("/login");
        return;
      }

      setLoading(true);
      setError('');
      setSuccess('');

      const url = `${baseUrl}/api/leave-requests/manager/${managerId}`;
      
      const response = await axios.get(url);
      
      let leaveRequests = Array.isArray(response.data) ? response.data : [];

      // Filter by status if a filter is selected
      if (filter !== 'ALL') {
        leaveRequests = leaveRequests.filter(req => req.status === filter);
      }
      
      setLeaveRequests(leaveRequests);

    } catch (err) {
      console.error("Error fetching leave requests:", err);
      setError('Failed to fetch leave requests');
      setLeaveRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveRequests();
  }, [filter, managerId, navigate]);

  const handleStatusChange = async (id, status) => {
    setError('');
    setSuccess('');

    try {
      await axios.put(`${baseUrl}/api/leave-requests/${id}/status?status=${status}`);
      setSuccess(`Leave request ${status.toLowerCase()} successfully!`);
      fetchLeaveRequests(); // Refresh the list
    } catch (err) {
      console.error("Error updating leave request status:", err);
      setError(`Failed to ${status.toLowerCase()} leave request`);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  const pendingCount = leaveRequests.filter(r => r.status === 'PENDING').length;

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
              <Nav.Link as={Link} to="/managerdashboard" className={getLinkClass("/managerdashboard")}>
                <i className="bi bi-speedometer2 me-2"></i>Dashboard
              </Nav.Link>
            </Nav.Item>
            <Nav.Item className="mb-2">
              <Nav.Link as={Link} to="/leave/approvals" className={getLinkClass("/leave/approvals")}>
                <i className="bi bi-calendar-event me-2"></i>Leave Approvals
                 {pendingCount > 0 && <Badge pill bg="danger" className="ms-2">{pendingCount}</Badge>}
              </Nav.Link>
            </Nav.Item>
            <Nav.Item className="mb-2">
              <Nav.Link as={Link} to="/attendance/manage" className={getLinkClass("/attendance/manage")}>
                <i className="bi bi-clock-history me-2"></i>Attendance
              </Nav.Link>
            </Nav.Item>
            <Nav.Item className="mb-2">
              <Nav.Link as={Link} to="/manager/tasks" className={getLinkClass("/manager/tasks")}>
                <i className="bi bi-list-task me-2"></i>Task Management
              </Nav.Link>
            </Nav.Item>
            <Nav.Item className="mb-2">
              <Nav.Link as={Link} to="#" className={getLinkClass("#")}>
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
        <Col md={10} className="main-content p-4 bg-light">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="text-primary">Leave Approvals</h2>
          </div>

          <Row className="mb-4 g-3">
            <Col md={12}>
              <Card.Body style={{ padding: '1.5rem', maxHeight: '100px',maxWidth: '800px' }}>
                <div className="d-flex justify-content-between align-items-center">
                  <ButtonGroup>
                    <Button 
                      variant={filter === 'PENDING' ? 'primary' : 'outline-primary'}
                      onClick={() => setFilter('PENDING')}
                    >
                      <i className="bi bi-hourglass-split me-2"></i> Pending
                    </Button>
                    <Button 
                      variant={filter === 'APPROVED' ? 'success' : 'outline-success'}
                      onClick={() => setFilter('APPROVED')}
                    >
                      <i className="bi bi-check-circle me-2"></i> Approved
                    </Button>
                    <Button 
                      variant={filter === 'REJECTED' ? 'danger' : 'outline-danger'}
                      onClick={() => setFilter('REJECTED')}
                    >
                      <i className="bi bi-x-circle me-2"></i> Rejected
                    </Button>
                    <Button 
                      variant={filter === 'ALL' ? 'secondary' : 'outline-secondary'}
                      onClick={() => setFilter('ALL')}
                    >
                      <i className="bi bi-list-ul me-2"></i> All
                    </Button>
                  </ButtonGroup>
                  
                  <div className="d-flex gap-3">
                    <div className="text-center">
                      <small className="text-muted">Total Requests</small>
                      <h4 className="mb-0">{leaveRequests.length}</h4>
                    </div>
                    <div className="text-center">
                      <small className="text-muted">Pending</small>
                      <h4 className="mb-0 text-warning">
                        {pendingCount}
                      </h4>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Col>
          </Row>

          {error && (
            <Alert variant="danger" onClose={() => setError('')} dismissible>
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}
            </Alert>
          )}
          {success && (
            <Alert variant="success" onClose={() => setSuccess('')} dismissible>
              <i className="bi bi-check-circle-fill me-2"></i>
              {success}
            </Alert>
          )}

          <Row>
            <Col md={12}>
              <Card className="shadow-sm border-0">
                <Card.Body className="p-3">
                  {loading ? (
                    <div className="text-center py-5">
                      <Spinner animation="border" variant="primary" />
                      <p className="mt-2">Loading leave requests...</p>
                    </div>
                  ) : leaveRequests.length > 0 ? (
                    <div className="table-responsive" style={{ maxHeight: 'calc(100vh - 300px)', overflowY: 'auto' }}>
                      <Table hover className="mb-0">
                        <thead className="bg-light position-sticky top-0">
                          <tr>
                            <th style={{ width: '20%' }}>Employee</th>
                            <th style={{ width: '12%' }}>Leave Type</th>
                            <th style={{ width: '12%' }}>Start Date</th>
                            <th style={{ width: '12%' }}>End Date</th>
                            <th style={{ width: '8%' }}>Days</th>
                            <th style={{ width: '12%' }}>Status</th>
                            <th style={{ width: '24%' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {leaveRequests.map(request => (
                            <tr key={request.id}>
                              <td>
                                <div className="d-flex align-items-center">
                                  <div className="avatar-sm bg-light rounded-circle me-2">
                                    <span className="avatar-text">
                                      {request.employeeName?.charAt(0) || 'E'}
                                    </span>
                                  </div>
                                  <div>
                                    <div className="fw-medium">{request.employeeName || `Employee #${request.employeeId}`}</div>
                                  </div>
                                </div>
                              </td>
                              <td>{request.description || 'N/A'}</td>
                              <td>{formatDate(request.startDate)}</td>
                              <td>{formatDate(request.endDate)}</td>
                              <td>
                                {Math.ceil((new Date(request.endDate) - new Date(request.startDate)) / (1000 * 60 * 60 * 24) + 1)}
                              </td>
                              <td>
                                <Badge 
                                  bg={
                                    request.status === 'APPROVED' ? 'success' : 
                                    request.status === 'REJECTED' ? 'danger' : 'warning'
                                  }
                                  className="rounded-pill"
                                >
                                  {request.status}
                                </Badge>
                              </td>
                              <td>
                                {request.status === 'PENDING' ? (
                                  <div className="d-flex gap-2">
                                    <Button 
                                      variant="outline-success" 
                                      size="sm"
                                      onClick={() => handleStatusChange(request.id, 'APPROVED')}
                                    >
                                      <i className="bi bi-check"></i> Approve
                                    </Button>
                                    <Button 
                                      variant="outline-danger" 
                                      size="sm"
                                      onClick={() => handleStatusChange(request.id, 'REJECTED')}
                                    >
                                      <i className="bi bi-x"></i> Reject
                                    </Button>
                                  </div>
                                ) : (
                                  <small className="text-muted">No actions</small>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-5">
                      <i className="bi bi-calendar-x text-muted fs-1"></i>
                      <h5 className="mt-3">No leave requests found</h5>
                      <p className="text-muted">
                        {filter === 'PENDING' ? 'You have no pending leave requests' : 
                         `No ${filter.toLowerCase()} leave requests`}
                      </p>
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

export default ManagerLeavePage;