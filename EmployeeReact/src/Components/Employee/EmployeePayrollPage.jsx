import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Alert, Button, Form, Table } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './EmployeeDashboard.css';

const EmployeePayrollPage = () => {
  const [data, setData] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const employeeId = localStorage.getItem('employeeId');
  const employeeName = localStorage.getItem('userName');
  const baseUrl = `${import.meta.env.VITE_API_URL}`;

  useEffect(() => {
    if (!employeeId) { navigate("/login"); return; }
    fetchPayroll();
  }, [employeeId, selectedMonth]);

  const fetchPayroll = async () => {
    setLoading(true);
    try {
      const year = selectedMonth.getFullYear();
      const month = selectedMonth.getMonth() + 1;
      const res = await axios.get(`${baseUrl}/api/payroll/employee/${employeeId}/month?year=${year}&month=${month}`);
      setData(res.data);
    } catch (err) { console.error(err); } 
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
        <Row className="align-items-center mb-5">
          <Col>
            <h1 className="fw-bold mb-1">Payroll</h1>
            <p className="text-muted">View your salary slip and breakdown.</p>
          </Col>
          <Col md="auto">
            <div className="bg-white p-2 rounded-pill shadow-sm border d-flex align-items-center">
              <span className="text-muted small fw-bold px-3">PERIOD</span>
              <DatePicker 
                selected={selectedMonth} 
                onChange={(date) => setSelectedMonth(date)} 
                dateFormat="MMMM yyyy"
                showMonthYearPicker
                className="border-0 bg-transparent fw-bold text-primary"
              />
            </div>
          </Col>
        </Row>

        {loading ? <div className="text-center py-5"><Spinner animation="border" variant="danger"/></div> : data ? (
          <div className="card-brave p-5">
            <div className="d-flex justify-content-between border-bottom pb-4 mb-4">
              <div>
                <h4 className="fw-bold text-dark">Payslip</h4>
                <p className="text-muted mb-0">{data.month}</p>
              </div>
              <div className="text-end">
                <h5 className="fw-bold mb-0">{employeeName}</h5>
                <small className="text-muted">ID: {employeeId}</small>
              </div>
            </div>

            <Row className="g-5">
              <Col md={6}>
                <h6 className="text-uppercase text-secondary fw-bold small mb-3">Earnings</h6>
                <Table borderless size="sm">
                  <tbody>
                    <tr><td className="text-muted">Daily Wage</td><td className="text-end fw-bold">₹{data.dailyWage}</td></tr>
                    <tr><td className="text-muted">Present Days</td><td className="text-end fw-bold">{data.presentDays}</td></tr>
                    <tr className="border-top"><td className="pt-3">Basic Salary</td><td className="text-end fw-bold pt-3">₹{data.basicSalary.toFixed(2)}</td></tr>
                  </tbody>
                </Table>
              </Col>
              <Col md={6}>
                <h6 className="text-uppercase text-secondary fw-bold small mb-3">Deductions</h6>
                <Table borderless size="sm">
                  <tbody>
                    <tr><td className="text-muted">Absent Days</td><td className="text-end fw-bold">{data.absentDays}</td></tr>
                    <tr><td className="text-muted text-danger">Total Deductions</td><td className="text-end fw-bold text-danger">- ₹{data.totalDeductions.toFixed(2)}</td></tr>
                  </tbody>
                </Table>
              </Col>
            </Row>

            <div className="bg-light p-4 rounded-3 mt-4 d-flex justify-content-between align-items-center">
              <span className="fw-bold text-dark">NET SALARY</span>
              <h3 className="fw-bold text-success mb-0">₹{data.netSalary.toFixed(2)}</h3>
            </div>

            <div className="text-center mt-5">
              <Button variant="outline-dark" className="rounded-pill px-4" onClick={() => window.print()}>
                <i className="bi bi-printer me-2"></i> Print Payslip
              </Button>
            </div>
          </div>
        ) : (
          <Alert variant="light" className="text-center text-muted">No payroll data available for this month.</Alert>
        )}
      </Container>
      <EmployeeDock />
    </div>
  );
};

export default EmployeePayrollPage;