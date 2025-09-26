import { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Table, Alert, Modal, Row, Col, Nav } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EmployeeLeavePage = () => {
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        startDate: '',
        endDate: '',
        description: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const employeeId = localStorage.getItem('employeeId'); // Get employeeId once
    const navigate = useNavigate();
    const employeeName = localStorage.getItem('userName') || 'Employee';

    const baseUrl = `${import.meta.env.VITE_API_URL}`;
    
    // Fetch employee's leave requests
    useEffect(() => {
        // We can trust that employeeId exists here because of the ProtectedRoute.
        const fetchLeaveRequests = async () => {
            try {
                const response = await axios.get(`${baseUrl}/api/leave-requests/employee/${employeeId}`);
                setLeaveRequests(response.data);
            } catch {
                setError('Failed to fetch leave requests');
            }
        };
        fetchLeaveRequests();
    }, [employeeId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!employeeId) {
            setError('Employee ID not found. Please log in again.');
            return;
        }

        try {
            const params = new URLSearchParams();
            params.append('employeeId', employeeId);
            params.append('startDate', formData.startDate);
            params.append('endDate', formData.endDate);
            params.append('description', formData.description);

            const response = await axios.post(`${baseUrl}/api/leave-requests`, params, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            setLeaveRequests([...leaveRequests, response.data]);
            setSuccess('Leave request submitted successfully!');
            setShowModal(false);
            setFormData({ startDate: '', endDate: '', description: '' });
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to submit leave request');
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <Container fluid className="dashboard-container px-0">
            {/* Sidebar and Main Content Layout */}
            <Row className="g-0">
                {/* Sidebar */}
                <Col md={2} className="sidebar bg-dark text-white vh-100 sticky-top">
                    <div className="sidebar-header p-3 text-center">
                        <h4>Employee Portal</h4>
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
                            <Nav.Link as={Link} to="/leave" className="text-white active">
                                <i className="bi bi-calendar-event me-2"></i>Leave Management
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link as={Link} to="/attendance" className="text-white">
                                <i className="bi bi-clock-history me-2"></i>Attendance
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link as={Link} to="/payroll" className="text-white">
                                <i className="bi bi-cash-stack me-2"></i>Payroll
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
                    <h2 className="mb-4">My Leave Requests</h2>
                    
                    {error && <Alert variant="danger">{error}</Alert>}
                    {success && <Alert variant="success">{success}</Alert>}

                    <Button variant="primary" onClick={() => setShowModal(true)} className="mb-3">
                        Request Leave
                    </Button>

                    <Card>
                        <Card.Body>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Start Date</th>
                                        <th>End Date</th>
                                        <th>Status</th>
                                        <th>Description</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {Array.isArray(leaveRequests) && leaveRequests.map(request => (
                                    <tr key={request.id}>
                                        <td>{request.startDate}</td>
                                        <td>{request.endDate}</td>
                                        <td>
                                            <span className={`badge ${
                                                request.status === 'APPROVED' ? 'bg-success' : 
                                                request.status === 'REJECTED' ? 'bg-danger' : 'bg-warning'
                                            }`}>
                                                {request.status}
                                            </span>
                                        </td>
                                        <td>{request.description}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>

                    {/* Leave Request Modal */}
                    <Modal show={showModal} onHide={() => setShowModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>New Leave Request</Modal.Title>
                        </Modal.Header>
                        <Form onSubmit={handleSubmit}>
                            <Modal.Body>
                                <Form.Group className="mb-3">
                                    <Form.Label>Start Date</Form.Label>
                                    <Form.Control 
                                        type="date" 
                                        name="startDate"
                                        value={formData.startDate}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>End Date</Form.Label>
                                    <Form.Control 
                                        type="date" 
                                        name="endDate"
                                        value={formData.endDate}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control 
                                        as="textarea" 
                                        rows={3}
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Form.Group>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => setShowModal(false)}>
                                    Cancel
                                </Button>
                                <Button variant="primary" type="submit">
                                    Submit Request
                                </Button>
                            </Modal.Footer>
                        </Form>
                    </Modal>
                </Col>
            </Row>
        </Container>
    );
};

export default EmployeeLeavePage;
