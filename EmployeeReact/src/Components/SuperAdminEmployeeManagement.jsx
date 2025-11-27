import React, { useState, useEffect } from 'react';
import { Container, Table, Spinner, Button, Alert, Accordion, Badge } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Manager/ManagerDashboard.css';

const SuperAdminEmployeeManagement = () => {
    const [managers, setManagers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const baseUrl = `${import.meta.env.VITE_API_URL}`;

    const fetchManagersWithEmployees = async () => {
        try {
            setLoading(true);
            const managersResponse = await axios.get(`${baseUrl}/manager/allManagers`);
            const managersWithEmployees = await Promise.all(
                managersResponse.data.map(async (manager) => {
                    const employeesResponse = await axios.get(`${baseUrl}/api/employees/byManager/${manager.id}`);
                    return { ...manager, employees: employeesResponse.data || [] };
                })
            );
            setManagers(managersWithEmployees);
        } catch (err) {
            setError("Failed to fetch data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchManagersWithEmployees(); }, []);

    const handleUpdateStatus = async (id, status) => {
        await axios.post(`${baseUrl}/api/employees/updateEmployeeStatus/${id}`, null, { params: { status } });
        fetchManagersWithEmployees();
    };

    const getStatusBadge = (status) => {
        const colors = { 'ACCEPTED': 'success', 'PENDING': 'warning', 'REJECTED': 'danger' };
        return <Badge bg={colors[status] || 'secondary'} className="px-3 py-2 rounded-pill">{status}</Badge>;
    };

    const AdminDock = () => (
        <div className="brave-dock-container">
            <div className="brave-dock">
                <Link to="/superadmindashboard" className={`dock-item ${location.pathname === '/superadmindashboard' ? 'active' : ''}`} data-label="Managers">
                    <i className="bi bi-person-gear"></i>
                </Link>
                <Link to="/superadmin/employees" className={`dock-item ${location.pathname === '/superadmin/employees' ? 'active' : ''}`} data-label="Employees">
                    <i className="bi bi-people"></i>
                </Link>
                <Link to="/superadmin/announcements" className={`dock-item ${location.pathname === '/superadmin/announcements' ? 'active' : ''}`} data-label="Announcements">
                    <i className="bi bi-megaphone"></i>
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
                    <h1 className="fw-bold mb-1">Employee Directory</h1>
                    <p className="text-muted">Monitor employee status across all departments.</p>
                </div>

                {error && <Alert variant="danger">{error}</Alert>}

                {loading ? <div className="text-center py-5"><Spinner animation="border" variant="danger"/></div> : (
                    <div className="d-grid gap-4">
                        {managers.map((manager) => (
                            <div key={manager.id} className="card-brave">
                                <div className="card-header-brave d-flex justify-content-between align-items-center">
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="bg-light rounded-circle p-2 d-flex"><i className="bi bi-building text-danger"></i></div>
                                        <div>
                                            <div>{manager.org}</div>
                                            <div className="small text-muted fw-normal">Manager: {manager.name}</div>
                                        </div>
                                    </div>
                                    <Badge bg="light" text="dark" className="border rounded-pill px-3">{manager.employees.length} Staff</Badge>
                                </div>
                                <div className="p-0">
                                    <Table className="table-brave mb-0" responsive>
                                        <thead>
                                            <tr><th className="ps-4">Name</th><th>Email</th><th>Status</th><th className="text-end pe-4">Actions</th></tr>
                                        </thead>
                                        <tbody>
                                            {manager.employees.map(emp => (
                                                <tr key={emp.id}>
                                                    <td className="ps-4 fw-bold">{emp.name}</td>
                                                    <td className="text-muted">{emp.email}</td>
                                                    <td>{getStatusBadge(emp.status)}</td>
                                                    <td className="text-end pe-4">
                                                        {emp.status === 'PENDING' && (
                                                            <>
                                                                <Button size="sm" variant="success" className="rounded-pill px-3 me-2" onClick={() => handleUpdateStatus(emp.id, 'ACCEPTED')}>Approve</Button>
                                                                <Button size="sm" variant="outline-danger" className="rounded-pill px-3" onClick={() => handleUpdateStatus(emp.id, 'REJECTED')}>Reject</Button>
                                                            </>
                                                        )}
                                                        {emp.status === 'ACCEPTED' && (
                                                            <Button size="sm" variant="outline-secondary" className="rounded-pill px-3" onClick={() => handleUpdateStatus(emp.id, 'DEACTIVATED')}>Deactivate</Button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                            {manager.employees.length === 0 && <tr><td colSpan="4" className="text-center py-4 text-muted">No employees found.</td></tr>}
                                        </tbody>
                                    </Table>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Container>
            <AdminDock />
        </div>
    );
};

export default SuperAdminEmployeeManagement;