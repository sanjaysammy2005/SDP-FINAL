import { useState, useEffect } from 'react';
import { Container, Card, Table, Alert, Spinner, ButtonGroup, Button, Form, Row, Col, Nav } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './EmployeeDashboard.css'; // Import the new CSS file

const baseUrl = `${import.meta.env.VITE_API_URL}`;

const EmployeeAttendancePage = () => {
  const [attendances, setAttendances] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [rangeStart, setRangeStart] = useState(new Date(new Date().setMonth(new Date().getMonth() - 1)));
  const [rangeEnd, setRangeEnd] = useState(new Date());
  const [viewMode, setViewMode] = useState('daily'); // 'daily' or 'range'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const employeeId = localStorage.getItem('employeeId');
  const navigate = useNavigate();
  const employeeName = localStorage.getItem('userName') || 'Employee';

  // Fetch attendance data
  //trying to rebuild image wihtout previous cache
  useEffect(() => {
    if (!employeeId) {
      navigate("/login");
      return;
    }
    const fetchAttendance = async () => {
      setLoading(true);
      setError('');
      try {
        let response;
        //const API_BASE_URL = 'http://localhost:8080';
        if (viewMode === 'daily') {
          const dateStr = selectedDate.toISOString().split('T')[0];
          // Correct API endpoint for fetching a single day's attendance
          response = await axios.get(`${baseUrl}/api/attendance/employee/${employeeId}/date?date=${dateStr}`);
          // The API returns a single object or null, so we wrap it in an array if it exists.
          setAttendances(response.data ? [response.data] : []);
        } else {
          const startStr = rangeStart.toISOString().split('T')[0];
          const endStr = rangeEnd.toISOString().split('T')[0];
          // Correct API endpoint for fetching a date range
          response = await axios.get(`${baseUrl}/api/attendance/employee/${employeeId}/range?startDate=${startStr}&endDate=${endStr}`);
          setAttendances(response.data);
        }
      } catch (err) {
        setError('Failed to fetch attendance records');
        console.error("Attendance fetch error:", err);
        setAttendances([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, [employeeId, selectedDate, rangeStart, rangeEnd, viewMode, navigate]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PRESENT': return 'success';
      case 'ABSENT': return 'danger';
      case 'LEAVE': return 'info';
      default: return 'secondary';
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <Container fluid className="dashboard-container px-0">
      <Row className="g-0">
        {/* Sidebar */}
        <Col md={2} className="sidebar bg-dark text-white vh-100 sticky-top">
          <div className="sidebar-header p-3 text-center">
            <h4>HR Portal</h4>
            <div className="employee-info mt-3">
              <div className="avatar bg-primary rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2" 
                   style={{ width: '60px', height: '60px' }}>
                <span className="fs-4">{employeeName.charAt(0)}</span>
              </div>
              <h6 className="mb-0">{employeeName}</h6>
              <small className="text-muted">Employee</small>
            </div>
          </div>

          <Nav className="flex-column p-3">
            <Nav.Item>
              <Nav.Link as={Link} to="/employeedashboard" className="text-white">
                <i className="bi bi-speedometer2 me-2"></i>Dashboard
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={Link} to="/leave" className="text-white">
                <i className="bi bi-calendar-event me-2"></i>Leave Management
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={Link} to="/attendance" className="text-white active">
                <i className="bi bi-clock-history me-2"></i>Attendance
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={Link} to="/payroll" className="text-white">
                <i className="bi bi-cash-stack me-2"></i>Payroll
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
                          <Nav.Link as={Link} to="/tasks" className={getLinkClass("/tasks")}>
                            <i className="bi bi-list-task me-2"></i>My Tasks
                          </Nav.Link>
                        </Nav.Item>
            <Nav.Item>
              <Nav.Link as={Link} to="/profile" className="text-white">
                <i className="bi bi-person-lines-fill me-2"></i>Profile
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={Link} to="/documents" className="text-white">
                <i className="bi bi-file-earmark-text me-2"></i>Documents
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
        <Col md={10} className="main-content p-4">
          <h2 className="mb-4">My Attendance</h2>
          
          {error && <Alert variant="danger">{error}</Alert>}

          <div className="mb-4">
            <ButtonGroup className="mb-3">
              <Button 
                variant={viewMode === 'daily' ? 'primary' : 'outline-primary'}
                onClick={() => setViewMode('daily')}
              >
                Daily View
              </Button>
              <Button 
                variant={viewMode === 'range' ? 'primary' : 'outline-primary'}
                onClick={() => setViewMode('range')}
              >
                Date Range
              </Button>
            </ButtonGroup>

            {viewMode === 'daily' ? (
              <div className="d-flex align-items-center gap-3">
                <Form.Group>
                  <Form.Label>Select Date</Form.Label>
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    className="form-control"
                    maxDate={new Date()}
                  />
                </Form.Group>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-3">
                <Form.Group>
                  <Form.Label>From</Form.Label>
                  <DatePicker
                    selected={rangeStart}
                    onChange={(date) => setRangeStart(date)}
                    className="form-control"
                    maxDate={rangeEnd}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>To</Form.Label>
                  <DatePicker
                    selected={rangeEnd}
                    onChange={(date) => setRangeEnd(date)}
                    className="form-control"
                    minDate={rangeStart}
                    maxDate={new Date()}
                  />
                </Form.Group>
              </div>
            )}
          </div>

          <Card>
            <Card.Body>
              {loading ? (
                <div className="text-center py-4">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div>
              ) : (
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Status</th>
                      {viewMode === 'range' && <th>Day</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {attendances.length > 0 ? (
                      attendances.map(attendance => (
                        <tr key={attendance.id}>
                          <td>{attendance.date}</td>
                          <td>
                            <span className={`badge bg-${getStatusBadge(attendance.status)}`}>
                              {attendance.status}
                            </span>
                          </td>
                          {viewMode === 'range' && (
                            <td>{new Date(attendance.date).toLocaleDateString('en-US', { weekday: 'long' })}</td>
                          )}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={viewMode === 'range' ? 3 : 2} className="text-center">
                          No attendance records found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default EmployeeAttendancePage;
