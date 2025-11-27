import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Modal, Form, Badge, Spinner, Alert } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './EmployeeDashboard.css';

const EmployeeLeavePage = () => {
  const [leaves, setLeaves] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ startDate: '', endDate: '', description: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  const employeeId = localStorage.getItem('employeeId');
  const baseUrl = `${import.meta.env.VITE_API_URL}`;

  useEffect(() => {
    if (!employeeId) { navigate("/login"); return; }
    fetchLeaves();
  }, [employeeId]);

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseUrl}/api/leave-requests/employee/${employeeId}`);
      setLeaves(res.data);
    } catch (err) { setError("Failed to fetch leaves."); } 
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const params = new URLSearchParams();
      params.append('employeeId', employeeId);
      params.append('startDate', formData.startDate);
      params.append('endDate', formData.endDate);
      params.append('description', formData.description);
      
      await axios.post(`${baseUrl}/api/leave-requests`, params);
      setShowModal(false);
      setFormData({ startDate: '', endDate: '', description: '' });
      fetchLeaves();
    } catch (err) { alert("Failed to submit request."); }
  };

  const EmployeeDock = () => (
    <div className="brave-dock-container">
      <div className="brave-dock">
        <Link to="/employeedashboard" className={`dock-item ${location.pathname === '/employeedashboard' ? 'active' : ''}`} data-label="Dashboard">
          <i className="bi bi-speedometer2"></i>
        </Link>
        <Link to="/leave" className={`dock-item ${location.pathname === '/leave' ? 'active' : ''}`} data-label="Leave">
          <i className="bi bi-calendar-event"></i>
        </Link>
        <Link to="/attendance" className={`dock-item ${location.pathname === '/attendance' ? 'active' : ''}`} data-label="Attendance">
          <i className="bi bi-clock-history"></i>
        </Link>
        <Link to="/tasks" className={`dock-item ${location.pathname === '/tasks' ? 'active' : ''}`} data-label="Tasks">
          <i className="bi bi-list-task"></i>
        </Link>
        <Link to="/payroll" className={`dock-item ${location.pathname === '/payroll' ? 'active' : ''}`} data-label="Payroll">
          <i className="bi bi-cash-stack"></i>
        </Link>
        <Link to="/profile" className={`dock-item ${location.pathname === '/profile' ? 'active' : ''}`} data-label="Profile">
          <i className="bi bi-person"></i>
        </Link>
        <div className="dock-separator"></div>
        <div className="dock-item text-danger" onClick={() => { localStorage.clear(); navigate('/login'); }} style={{cursor:'pointer'}} data-label="Logout">
          <i className="bi bi-box-arrow-right"></i>
        </div>
      </div>
    </div>
  );

  return (
    <div className="dashboard-container">
      <Container className="main-content">
        <div className="d-flex justify-content-between align-items-center mb-5">
          <div>
            <h1 className="fw-bold mb-1">Leave Management</h1>
            <p className="text-muted">Request time off and track status.</p>
          </div>
          <Button className="btn-brave" onClick={() => setShowModal(true)}>
            <i className="bi bi-plus-lg me-2"></i>New Request
          </Button>
        </div>

        {loading ? <div className="text-center py-5"><Spinner animation="border" variant="danger"/></div> : (
          <Row className="g-3">
            {leaves.map(req => (
              <Col md={6} key={req.id}>
                <div className="card-brave p-4">
                  <div className="d-flex justify-content-between mb-3">
                    <Badge bg={req.status === 'APPROVED' ? 'success' : req.status === 'REJECTED' ? 'danger' : 'warning'} className="px-3 py-2 rounded-pill">
                      {req.status}
                    </Badge>
                    <small className="text-muted fw-bold">
                      {new Date(req.startDate).toLocaleDateString()} <i className="bi bi-arrow-right mx-1"></i> {new Date(req.endDate).toLocaleDateString()}
                    </small>
                  </div>
                  <p className="mb-0 text-secondary small">{req.description}</p>
                </div>
              </Col>
            ))}
            {leaves.length === 0 && <Col xs={12}><div className="text-center py-5 text-muted">No leave requests yet.</div></Col>}
          </Row>
        )}
      </Container>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered contentClassName="border-0 rounded-4 shadow">
        <Modal.Header closeButton className="border-0"><Modal.Title className="fw-bold">Request Leave</Modal.Title></Modal.Header>
        <Modal.Body className="p-4">
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold text-muted">START DATE</Form.Label>
                  <Form.Control type="date" className="bg-light border-0 p-3 rounded-3" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold text-muted">END DATE</Form.Label>
                  <Form.Control type="date" className="bg-light border-0 p-3 rounded-3" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} required />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-4">
              <Form.Label className="small fw-bold text-muted">REASON</Form.Label>
              <Form.Control as="textarea" rows={3} className="bg-light border-0 p-3 rounded-3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
            </Form.Group>
            <Button type="submit" className="btn-brave w-100 py-3">Submit Request</Button>
          </Form>
        </Modal.Body>
      </Modal>

      <EmployeeDock />
    </div>
  );
};

export default EmployeeLeavePage;