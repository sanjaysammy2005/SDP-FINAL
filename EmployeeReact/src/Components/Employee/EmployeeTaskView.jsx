import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Badge, Button, Spinner } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './EmployeeDashboard.css';

const EmployeeTaskView = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const employeeId = localStorage.getItem('employeeId');
  const baseUrl = `${import.meta.env.VITE_API_URL}`;

  useEffect(() => {
    if (!employeeId) { navigate('/login'); return; }
    fetchTasks();
  }, [employeeId]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseUrl}/api/tasks/employee/${employeeId}`);
      setTasks(res.data);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  const updateStatus = async (id, status) => {
    await axios.put(`${baseUrl}/api/tasks/${id}/status?status=${status}`);
    fetchTasks();
  };

  const getStatusBadge = (status) => {
    const map = { 'NOT_STARTED': 'secondary', 'IN_PROGRESS': 'primary', 'COMPLETED': 'success' };
    return <Badge bg={map[status]} className="px-3 py-2 rounded-pill">{status.replace('_', ' ')}</Badge>;
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
        <div className="mb-5">
          <h1 className="fw-bold mb-1">My Tasks</h1>
          <p className="text-muted">Track your assignments and progress.</p>
        </div>

        {loading ? <div className="text-center py-5"><Spinner animation="border" variant="danger"/></div> : (
          <Row className="g-3">
            {tasks.length > 0 ? tasks.map(task => (
              <Col md={6} lg={4} key={task.id}>
                <div className="card-brave p-4 h-100 d-flex flex-column">
                  <div className="d-flex justify-content-between mb-3">
                    <span className="text-muted small fw-bold">DUE: {task.dueDate}</span>
                    {getStatusBadge(task.status)}
                  </div>
                  <h5 className="fw-bold mb-2">{task.title}</h5>
                  <p className="text-secondary small flex-grow-1">{task.description}</p>
                  
                  <div className="mt-3 pt-3 border-top d-flex gap-2">
                    {task.status !== 'COMPLETED' && (
                      <>
                        {task.status === 'NOT_STARTED' && (
                          <Button size="sm" className="btn-brave w-100" onClick={() => updateStatus(task.id, 'IN_PROGRESS')}>Start Task</Button>
                        )}
                        <Button size="sm" variant="success" className="w-100 rounded-pill fw-bold" onClick={() => updateStatus(task.id, 'COMPLETED')}>Complete</Button>
                      </>
                    )}
                    {task.status === 'COMPLETED' && <span className="text-success small fw-bold mx-auto"><i className="bi bi-check-all me-1"></i> Done</span>}
                  </div>
                </div>
              </Col>
            )) : <Col xs={12}><div className="text-center py-5 text-muted">No tasks assigned.</div></Col>}
          </Row>
        )}
      </Container>
      <EmployeeDock />
    </div>
  );
};

export default EmployeeTaskView;