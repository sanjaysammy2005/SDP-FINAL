import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Spinner, Badge, ButtonGroup, Button } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './EmployeeDashboard.css';

const EmployeeAttendancePage = () => {
  const [data, setData] = useState([]);
  const [dateRange, setDateRange] = useState([new Date(new Date().setDate(new Date().getDate() - 30)), new Date()]);
  const [startDate, endDate] = dateRange;
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const employeeId = localStorage.getItem('employeeId');
  const baseUrl = `${import.meta.env.VITE_API_URL}`;

  useEffect(() => {
    if (!employeeId) { navigate("/login"); return; }
    fetchData();
  }, [employeeId, dateRange]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const start = startDate.toISOString().split('T')[0];
      const end = endDate.toISOString().split('T')[0];
      const res = await axios.get(`${baseUrl}/api/attendance/employee/${employeeId}/range?startDate=${start}&endDate=${end}`);
      setData(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const getStatusBadge = (status) => {
    const colors = { 'PRESENT': 'success', 'ABSENT': 'danger', 'LEAVE': 'info' };
    return <Badge bg={colors[status] || 'secondary'} className="px-3 py-2 rounded-pill">{status}</Badge>;
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
            <h1 className="fw-bold mb-1">My Attendance</h1>
            <p className="text-muted">History of your work days.</p>
          </div>
          <div className="bg-white p-2 rounded-pill shadow-sm border d-flex align-items-center">
            <span className="text-muted small fw-bold px-3">RANGE</span>
            <DatePicker 
              selectsRange={true}
              startDate={startDate}
              endDate={endDate}
              onChange={(update) => setDateRange(update)}
              className="border-0 bg-transparent fw-bold text-primary"
              dateFormat="MMM d"
            />
          </div>
        </div>

        <div className="card-brave">
          {loading ? <div className="text-center py-5"><Spinner animation="border" variant="danger"/></div> : (
            <Table hover responsive className="table-brave mb-0">
              <thead>
                <tr>
                  <th className="ps-4">Date</th>
                  <th>Day</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? data.map(record => (
                  <tr key={record.id}>
                    <td className="ps-4 fw-bold text-dark">{record.date}</td>
                    <td className="text-muted">{new Date(record.date).toLocaleDateString('en-US', { weekday: 'long' })}</td>
                    <td>{getStatusBadge(record.status)}</td>
                  </tr>
                )) : <tr><td colSpan="3" className="text-center py-5 text-muted">No records found for this range.</td></tr>}
              </tbody>
            </Table>
          )}
        </div>
      </Container>
      <EmployeeDock />
    </div>
  );
};

export default EmployeeAttendancePage;