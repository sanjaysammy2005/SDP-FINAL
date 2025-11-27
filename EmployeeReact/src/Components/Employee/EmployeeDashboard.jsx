import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Alert, Badge } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './EmployeeDashboard.css';

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const employeeName = localStorage.getItem('userName') || 'Employee';
  const employeeId = localStorage.getItem('employeeId');
  
  const [data, setData] = useState({
    leaves: [],
    attendance: { present: 0, total: 0, percentage: 0 },
    tasks: [],
    announcements: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const baseUrl = `${import.meta.env.VITE_API_URL}`;

  useEffect(() => {
    if (!employeeId) { navigate('/login'); return; }
    fetchData();
  }, [employeeId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const year = new Date().getFullYear();
      const month = new Date().getMonth() + 1;
      
      const [leaveRes, attRes, taskRes, announceRes] = await Promise.all([
        axios.get(`${baseUrl}/api/leave-requests/employee/${employeeId}`),
        axios.get(`${baseUrl}/api/attendance/employee/${employeeId}/month?year=${year}&month=${month}`),
        axios.get(`${baseUrl}/api/tasks/employee/${employeeId}`),
        axios.get(`${baseUrl}/api/announcements`)
      ]);

      const attendance = attRes.data || [];
      const present = attendance.filter(a => a.status === 'PRESENT').length;
      
      setData({
        leaves: leaveRes.data.filter(l => l.status === 'PENDING').slice(0, 3),
        attendance: {
          present,
          total: attendance.length,
          percentage: attendance.length ? Math.round((present / attendance.length) * 100) : 0
        },
        tasks: taskRes.data.filter(t => t.status !== 'COMPLETED').slice(0, 3),
        announcements: announceRes.data.slice(0, 3)
      });
    } catch (err) { setError("Failed to load dashboard data."); } 
    finally { setLoading(false); }
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
        <div className="d-flex justify-content-between align-items-end mb-5">
          <div>
            <h6 className="text-uppercase text-secondary fw-bold small mb-2">Employee Portal</h6>
            <h1 className="fw-bold mb-0">Welcome, {employeeName}</h1>
          </div>
          <div className="text-end text-muted">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}

        {loading ? <div className="text-center py-5"><Spinner animation="border" variant="danger"/></div> : (
          <>
            <Row className="g-4 mb-4">
              <Col md={4}>
                <div className="card-brave p-4 d-flex align-items-center justify-content-between">
                  <div>
                    <h2 className="fw-bold mb-0 text-primary">{data.attendance.percentage}%</h2>
                    <p className="text-muted mb-0 small fw-bold">ATTENDANCE</p>
                  </div>
                  <div className="bg-light rounded-circle p-3 text-primary"><i className="bi bi-pie-chart fs-4"></i></div>
                </div>
              </Col>
              <Col md={4}>
                <div className="card-brave p-4 d-flex align-items-center justify-content-between">
                  <div>
                    <h2 className="fw-bold mb-0 text-warning">{data.tasks.length}</h2>
                    <p className="text-muted mb-0 small fw-bold">PENDING TASKS</p>
                  </div>
                  <div className="bg-light rounded-circle p-3 text-warning"><i className="bi bi-list-check fs-4"></i></div>
                </div>
              </Col>
              <Col md={4}>
                <div className="card-brave p-4 d-flex align-items-center justify-content-between">
                  <div>
                    <h2 className="fw-bold mb-0 text-success">{data.leaves.length}</h2>
                    <p className="text-muted mb-0 small fw-bold">LEAVE REQUESTS</p>
                  </div>
                  <div className="bg-light rounded-circle p-3 text-success"><i className="bi bi-calendar-minus fs-4"></i></div>
                </div>
              </Col>
            </Row>

            <Row className="g-4">
              <Col lg={8}>
                <div className="card-brave h-100">
                  <div className="card-header-brave">Announcements</div>
                  <div className="p-0">
                    {data.announcements.length > 0 ? data.announcements.map((ann, i) => (
                      <div key={ann.id} className={`p-4 ${i !== data.announcements.length - 1 ? 'border-bottom' : ''}`}>
                        <div className="d-flex justify-content-between mb-2">
                          <h6 className="fw-bold mb-0">{ann.title}</h6>
                          <small className="text-muted">{new Date(ann.date).toLocaleDateString()}</small>
                        </div>
                        <p className="text-muted small mb-0">{ann.content}</p>
                      </div>
                    )) : <div className="p-5 text-center text-muted">No announcements.</div>}
                  </div>
                </div>
              </Col>
              <Col lg={4}>
                <div className="card-brave h-100">
                  <div className="card-header-brave">Quick Actions</div>
                  <div className="p-4 d-grid gap-3">
                    <Link to="/leave" className="btn btn-light text-start p-3 fw-bold border">
                      <i className="bi bi-plus-circle me-2 text-primary"></i> Apply for Leave
                    </Link>
                    <Link to="/tasks" className="btn btn-light text-start p-3 fw-bold border">
                      <i className="bi bi-check2-square me-2 text-success"></i> Update Tasks
                    </Link>
                    <Link to="/profile" className="btn btn-light text-start p-3 fw-bold border">
                      <i className="bi bi-person-gear me-2 text-dark"></i> Edit Profile
                    </Link>
                  </div>
                </div>
              </Col>
            </Row>
          </>
        )}
      </Container>
      <EmployeeDock />
    </div>
  );
};

export default EmployeeDashboard;