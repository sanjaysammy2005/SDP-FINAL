import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Alert, Spinner, Badge } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./ManagerDashboard.css";

const ManagerTaskAssignment = () => {
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [taskData, setTaskData] = useState({ title: "", description: "", dueDate: new Date(), employeeId: "" });

  const navigate = useNavigate();
  const location = useLocation();
  const managerId = localStorage.getItem("managerId");
  const baseUrl = `${import.meta.env.VITE_API_URL}`;

  useEffect(() => {
    if (!managerId) { navigate("/login"); return; }
    fetchData();
  }, [managerId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const empRes = await axios.get(`${baseUrl}/api/employees/byManager/${managerId}`);
      setEmployees(empRes.data);

      const allTasks = [];
      await Promise.all(empRes.data.map(async (emp) => {
        const taskRes = await axios.get(`${baseUrl}/api/tasks/employee/${emp.id}`);
        taskRes.data.forEach(t => allTasks.push({ ...t, employeeName: emp.name }));
      }));
      setTasks(allTasks);
    } catch (err) { setError("Fetch error"); } 
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${baseUrl}/api/tasks/create/${taskData.employeeId}`, {
        title: taskData.title,
        description: taskData.description,
        dueDate: taskData.dueDate.toISOString().split("T")[0],
      }, { headers: { "Content-Type": "application/json" } });
      fetchData();
      setTaskData({ title: "", description: "", dueDate: new Date(), employeeId: "" });
      alert("Task Assigned!");
    } catch (err) { alert("Failed to assign task."); }
  };

  const handleDelete = async (id) => {
    if(window.confirm("Delete task?")) {
      await axios.delete(`${baseUrl}/api/tasks/${id}`);
      fetchData();
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
        <div className="mb-5">
          <h1 className="fw-bold mb-1">Task Management</h1>
          <p className="text-muted">Assign and track team deliverables.</p>
        </div>

        <Row className="g-4">
          <Col lg={4}>
            <div className="card-brave p-4 sticky-top" style={{top: '20px'}}>
              <h5 className="fw-bold mb-4">Assign New Task</h5>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold text-secondary">TASK TITLE</Form.Label>
                  <Form.Control type="text" className="bg-light border-0 p-3 rounded-3" value={taskData.title} onChange={e => setTaskData({...taskData, title: e.target.value})} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold text-secondary">ASSIGN TO</Form.Label>
                  <Form.Select className="bg-light border-0 p-3 rounded-3" value={taskData.employeeId} onChange={e => setTaskData({...taskData, employeeId: e.target.value})} required>
                    <option value="">Select Employee</option>
                    {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold text-secondary">DUE DATE</Form.Label>
                  <DatePicker selected={taskData.dueDate} onChange={d => setTaskData({...taskData, dueDate: d})} className="form-control bg-light border-0 p-3 rounded-3 w-100" />
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Label className="small fw-bold text-secondary">DESCRIPTION</Form.Label>
                  <Form.Control as="textarea" rows={3} className="bg-light border-0 p-3 rounded-3" value={taskData.description} onChange={e => setTaskData({...taskData, description: e.target.value})} required />
                </Form.Group>
                <Button type="submit" className="btn-brave w-100 py-3">Assign Task</Button>
              </Form>
            </div>
          </Col>

          <Col lg={8}>
            <div className="card-brave h-100">
              <div className="card-header-brave">Team Tasks</div>
              <div className="p-0">
                {loading ? <div className="text-center py-5"><Spinner animation="border" variant="danger"/></div> : (
                  tasks.length > 0 ? tasks.map((task, i) => (
                    <div key={task.id} className={`p-4 d-flex justify-content-between align-items-start ${i !== tasks.length - 1 ? 'border-bottom' : ''}`}>
                      <div>
                        <h6 className="fw-bold mb-1">{task.title}</h6>
                        <p className="text-secondary small mb-2">{task.description}</p>
                        <div className="d-flex gap-3 small">
                          <span className="text-muted"><i className="bi bi-person me-1"></i>{task.employeeName}</span>
                          <span className="text-danger fw-bold"><i className="bi bi-flag me-1"></i>{task.dueDate}</span>
                        </div>
                      </div>
                      <div className="text-end">
                        <Badge bg={task.status === 'COMPLETED' ? 'success' : 'light'} text={task.status === 'COMPLETED' ? 'white' : 'dark'} className="border px-2 mb-2 d-block">
                          {task.status.replace('_', ' ')}
                        </Badge>
                        <Button variant="link" className="text-danger p-0 small text-decoration-none" onClick={() => handleDelete(task.id)}>Remove</Button>
                      </div>
                    </div>
                  )) : <div className="p-5 text-center text-muted">No tasks assigned yet.</div>
                )}
              </div>
            </div>
          </Col>
        </Row>
      </Container>
      <ManagerDock />
    </div>
  );
};

export default ManagerTaskAssignment;