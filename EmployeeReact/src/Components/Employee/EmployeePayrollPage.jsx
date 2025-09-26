import { useState, useEffect } from 'react';
import { Container, Card, Table, Alert, Spinner, Button, Row, Col, Form, Nav } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './EmployeeDashboard.css'; // Import the new CSS file

const baseUrl = `${import.meta.env.VITE_API_URL}`;

const EmployeePayrollPage = () => {
    const [payrollData, setPayrollData] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(new Date());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [employeeId, setEmployeeId] = useState(null);
    const navigate = useNavigate();
    const employeeName = localStorage.getItem('userName') || 'Employee';

    // Get employee ID from localStorage
    useEffect(() => {
        const storedEmployeeId = localStorage.getItem('employeeId');
        if (!storedEmployeeId) {
            navigate('/login');
            return;
        }
        setEmployeeId(storedEmployeeId);
    }, [navigate]);

    // Fetch payroll data from the new backend API
    useEffect(() => {
        if (!employeeId) return;

        const fetchPayrollData = async () => {
            setLoading(true);
            setError('');
            try {
                const year = selectedMonth.getFullYear();
                const month = selectedMonth.getMonth() + 1;
                
                const response = await axios.get(`${baseUrl}/api/payroll/employee/${employeeId}/month?year=${year}&month=${month}`);
                
                setPayrollData(response.data);
            } catch (err) {
                console.error("Error fetching payroll data:", err);
                setError(err.response?.data?.message || 'Failed to fetch payroll data');
            } finally {
                setLoading(false);
            }
        };
        
        fetchPayrollData();
    }, [employeeId, selectedMonth]);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const handlePrintPayslip = () => {
        window.print();
    };

    return (
        <Container fluid className="dashboard-container px-0">
            {/* Sidebar and Main Content Layout */}
            <Row className="g-0">
                {/* Sidebar - Now with proper styling and logout placement */}
                <Col md={2} className="sidebar vh-100 sticky-top">
                    <div className="sidebar-header p-3 text-center">
                        <h4>EMPLOYEE Portal</h4>
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
                            <Nav.Link as={Link} to="/attendance" className="text-white">
                                <i className="bi bi-clock-history me-2"></i>Attendance
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link as={Link} to="/payroll" className="text-white active">
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
                    </Nav>
                    <div className="logout-container">
                        <Button 
                            variant="outline-light" 
                            size="sm" 
                            className="w-100"
                            onClick={handleLogout}
                        >
                            <i className="bi bi-box-arrow-left me-2"></i>Logout
                        </Button>
                    </div>
                </Col>

                {/* Main Content Area */}
                <Col md={10} className="main-content p-4">
                    <h2 className="mb-4">My Payroll</h2>
                    
                    {error && <Alert variant="danger">{error}</Alert>}

                    <div className="mb-4">
                        <Form.Group>
                            <Form.Label>Select Month</Form.Label>
                            <DatePicker
                                selected={selectedMonth}
                                onChange={(date) => setSelectedMonth(date)}
                                className="form-control"
                                dateFormat="MMMM yyyy"
                                showMonthYearPicker
                            />
                        </Form.Group>
                    </div>

                    {loading ? (
                        <div className="text-center py-4">
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                        </div>
                    ) : payrollData ? (
                        <Card className="mb-4 printable-area">
                            <Card.Header className="d-flex justify-content-between align-items-center">
                                <h5>Payroll for {payrollData.month}</h5>
                                <Button variant="primary" onClick={handlePrintPayslip}>
                                    <i className="bi bi-printer me-2"></i>Print Payslip
                                </Button>
                            </Card.Header>
                            <Card.Body>
                                <Row>
                                    <Col md={6}>
                                        <h6 className="mb-3">Employee Information</h6>
                                        <Table borderless>
                                            <tbody>
                                                <tr>
                                                    <th>Name:</th>
                                                    <td>{employeeName}</td>
                                                </tr>
                                                <tr>
                                                    <th>Employee ID:</th>
                                                    <td>{employeeId}</td>
                                                </tr>
                                                <tr>
                                                    <th>Pay Period:</th>
                                                    <td>{payrollData.month}</td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                        
                                        <h6 className="mt-4 mb-3">Attendance Summary</h6>
                                        <Table bordered>
                                            <tbody>
                                                <tr>
                                                    <th>Present Days</th>
                                                    <td>{payrollData.presentDays}</td>
                                                </tr>
                                                <tr>
                                                    <th>Leave Days</th>
                                                    <td>{payrollData.leaveDays}</td>
                                                </tr>
                                                <tr>
                                                    <th>Absent Days</th>
                                                    <td>{payrollData.absentDays}</td>
                                                </tr>
                                                <tr>
                                                    <th>Daily Wage</th>
                                                    <td>₹{payrollData.dailyWage.toFixed(2)}</td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                    </Col>
                                    <Col md={6}>
                                        <h6 className="mb-3">Salary Breakdown</h6>
                                        <Table bordered>
                                            <tbody>
                                                <tr>
                                                    <th>Basic Salary</th>
                                                    <td>₹{payrollData.basicSalary.toFixed(2)}</td>
                                                </tr>
                                                <tr>
                                                    <th>Total Deductions</th>
                                                    <td>₹{payrollData.totalDeductions.toFixed(2)}</td>
                                                </tr>
                                                <tr className="table-primary">
                                                    <th>Net Salary</th>
                                                    <td>₹{payrollData.netSalary.toFixed(2)}</td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    ) : (
                        <Alert variant="info">No payroll data available for selected month</Alert>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default EmployeePayrollPage;
