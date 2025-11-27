import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Badge, Button, Spinner, Alert, ButtonGroup } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './ManagerDashboard.css';

const ManagerLeavePage = () => {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState('PENDING');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const managerId = localStorage.getItem("managerId");
  const baseUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!managerId) { navigate("/login"); return; }
    fetchRequests();
  }, [managerId, filter]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/api/leave-requests/manager/${managerId}`);
      const data = filter === 'ALL' ? response.data : response.data.filter(r => r.status === filter);
      setRequests(data);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  const handleAction = async (id, status) => {
    await axios.put(`${baseUrl}/api/leave-requests/${id}/status?status=${status}`);
    fetchRequests();
  };

  // Fixed Dock with data-label
  const ManagerDock = () => (
    <div className="brave-dock-container">
      <div className="brave-dock">
        <Link to="/managerdashboard" className={`dock-item ${location.pathname === '/managerdashboard' ? 'active' : ''}`} data-label="Dashboard">
          <i className="bi bi-speedometer2"></i>
        </Link>
        <Link to="/leave/approvals" className={`dock-item ${location.pathname === '/leave/approvals' ? 'active' : ''}`} data-label="Approvals">
          <i className="bi bi-calendar-check"></i>
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
        <div className="d-flex justify-content-between align-items-center mb-5">
          <h1 className="fw-bold mb-0">Leave Approvals</h1>
          <ButtonGroup className="bg-white rounded-pill p-1 shadow-sm border">
            {['PENDING', 'APPROVED', 'REJECTED', 'ALL'].map(status => (
              <Button 
                key={status}
                variant={filter === status ? 'dark' : 'light'}
                className={`rounded-pill px-4 border-0 fw-bold small ${filter !== status ? 'text-muted bg-transparent' : ''}`}
                onClick={() => setFilter(status)}
              >
                {status}
              </Button>
            ))}
          </ButtonGroup>
        </div>

        {loading ? <div className="text-center py-5"><Spinner animation="border" variant="danger"/></div> : (
          <Row className="g-3">
            {requests.length > 0 ? requests.map(req => (
              <Col md={6} key={req.id}>
                <div className="card-brave p-4 h-100 d-flex flex-column">
                  <div className="d-flex justify-content-between mb-3">
                    <div className="d-flex align-items-center gap-3">
                      <div className="bg-light rounded-circle p-2 text-primary fw-bold" style={{width:40, height:40, textAlign:'center'}}>
                        {req.employeeName ? req.employeeName.charAt(0) : 'E'}
                      </div>
                      <div>
                        <h6 className="fw-bold mb-0">{req.employeeName || `ID: ${req.employeeId}`}</h6>
                        <small className="text-muted">{Math.ceil((new Date(req.endDate) - new Date(req.startDate)) / (1000 * 60 * 60 * 24) + 1)} Days Leave</small>
                      </div>
                    </div>
                    <Badge bg={req.status === 'PENDING' ? 'warning' : req.status === 'APPROVED' ? 'success' : 'danger'} className="align-self-start px-3 py-2 rounded-pill text-dark border bg-opacity-25">
                      {req.status}
                    </Badge>
                  </div>
                  
                  <div className="bg-light rounded-3 p-3 mb-3 flex-grow-1">
                    <p className="text-secondary small mb-2 fw-bold">REASON</p>
                    <p className="mb-0 text-dark small">{req.description || "No description provided."}</p>
                  </div>

                  <div className="d-flex justify-content-between align-items-center border-top pt-3">
                    <small className="text-muted fw-bold">
                      {new Date(req.startDate).toLocaleDateString()} <i className="bi bi-arrow-right mx-1"></i> {new Date(req.endDate).toLocaleDateString()}
                    </small>
                    
                    {req.status === 'PENDING' && (
                      <div className="d-flex gap-2">
                        <Button variant="outline-danger" size="sm" className="rounded-pill px-3 fw-bold" onClick={() => handleAction(req.id, 'REJECTED')}>Reject</Button>
                        <Button variant="dark" size="sm" className="rounded-pill px-3 fw-bold" onClick={() => handleAction(req.id, 'APPROVED')}>Approve</Button>
                      </div>
                    )}
                  </div>
                </div>
              </Col>
            )) : (
              <Col xs={12}><div className="text-center py-5 text-muted">No requests found.</div></Col>
            )}
          </Row>
        )}
      </Container>
      <ManagerDock />
    </div>
  );
};

export default ManagerLeavePage;