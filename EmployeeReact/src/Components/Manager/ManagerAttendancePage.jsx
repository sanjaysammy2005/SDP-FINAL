import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Spinner, Form, Row, Col, Badge } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './ManagerDashboard.css';

const ManagerAttendancePage = () => {
  const [attendances, setAttendances] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const managerId = localStorage.getItem("managerId");
  const baseUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!managerId) { navigate("/login"); return; }
    fetchAttendance();
  }, [selectedDate, managerId]);

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      const [empRes, attRes] = await Promise.all([
        axios.get(`${baseUrl}/api/employees/byManager/${managerId}`),
        axios.get(`${baseUrl}/api/attendance/date/${dateStr}`)
      ]);
      
      const team = empRes.data;
      const records = attRes.data.filter(r => team.some(e => e.id === r.employeeId));
      
      const mergedData = team.map(emp => {
        const record = records.find(r => r.employeeId === emp.id);
        return {
          employeeId: emp.id,
          employeeName: emp.name,
          status: record ? record.status : 'NOT MARKED',
          id: record ? record.id : null
        };
      });
      
      setAttendances(mergedData);
    } catch (error) { console.error(error); } 
    finally { setLoading(false); }
  };

  const markStatus = async (employeeId, status) => {
    const dateStr = selectedDate.toISOString().split('T')[0];
    await axios.post(`${baseUrl}/api/attendance?employeeId=${employeeId}&date=${dateStr}&status=${status}`);
    fetchAttendance();
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
        <Row className="align-items-center mb-5">
          <Col>
            <h1 className="fw-bold mb-1">Attendance</h1>
            <p className="text-muted">Track and manage daily team presence.</p>
          </Col>
          <Col md="auto">
            <div className="bg-white p-2 rounded-pill shadow-sm border d-flex align-items-center">
              <span className="text-muted small fw-bold px-3">DATE</span>
              <DatePicker 
                selected={selectedDate} 
                onChange={(date) => setSelectedDate(date)} 
                className="border-0 bg-transparent fw-bold text-primary"
                dateFormat="MMM d, yyyy"
              />
            </div>
          </Col>
        </Row>

        <div className="card-brave">
          <div className="p-0">
            {loading ? <div className="text-center py-5"><Spinner animation="border" variant="danger"/></div> : (
              <Table hover responsive className="table-brave mb-0">
                <thead>
                  <tr><th className="ps-4">Employee</th><th>Status</th><th className="text-end pe-4">Quick Actions</th></tr>
                </thead>
                <tbody>
                  {attendances.map(row => (
                    <tr key={row.employeeId}>
                      <td className="ps-4 fw-bold">{row.employeeName}</td>
                      <td>
                        <Badge bg={
                          row.status === 'PRESENT' ? 'success' : 
                          row.status === 'ABSENT' ? 'danger' : 
                          row.status === 'LEAVE' ? 'info' : 'secondary'
                        } className="px-3 py-2 rounded-pill">
                          {row.status}
                        </Badge>
                      </td>
                      <td className="text-end pe-4">
                        <div className="d-flex justify-content-end gap-2">
                          <Button size="sm" variant={row.status === 'PRESENT' ? 'success' : 'outline-secondary'} className="rounded-pill px-3 fw-bold" onClick={() => markStatus(row.employeeId, 'PRESENT')}>P</Button>
                          <Button size="sm" variant={row.status === 'ABSENT' ? 'danger' : 'outline-secondary'} className="rounded-pill px-3 fw-bold" onClick={() => markStatus(row.employeeId, 'ABSENT')}>A</Button>
                          <Button size="sm" variant={row.status === 'LEAVE' ? 'info' : 'outline-secondary'} className="rounded-pill px-3 fw-bold text-white" onClick={() => markStatus(row.employeeId, 'LEAVE')}>L</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </div>
        </div>
      </Container>
      <ManagerDock />
    </div>
  );
};

export default ManagerAttendancePage;