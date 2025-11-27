import React, { useState, useEffect } from "react";
import { Container, Row, Col, Table, Button, Modal, Form, Spinner, Alert } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Manager/ManagerDashboard.css';

const SuperAdminDashboard = () => {
    const [managers, setManagers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState("add"); 
    const [formData, setFormData] = useState({ id: null, name: "", org: "", email: "", password: "" });
    
    const navigate = useNavigate();
    const location = useLocation();
    const baseUrl = `${import.meta.env.VITE_API_URL}`;

    const fetchManagers = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${baseUrl}/manager/allManagers`);
            setManagers(response.data);
            setLoading(false);
        } catch (err) {
            setError("Failed to fetch managers.");
            setLoading(false);
        }
    };

    useEffect(() => { fetchManagers(); }, []);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            if (modalMode === "add") await axios.post(`${baseUrl}/manager/addManager`, formData);
            else await axios.put(`${baseUrl}/manager/update/${formData.id}`, formData);
            setShowModal(false);
            fetchManagers();
        } catch (err) {
            setError(err.response?.data || "Error occurred.");
        }
    };

    const handleDelete = async (id) => {
        if(window.confirm("Delete this manager?")) {
            await axios.delete(`${baseUrl}/managers/delete/${id}`);
            fetchManagers();
        }
    };

    // Navigation Dock Component (Internal for simplicity as per request context)
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
                <div className="d-flex justify-content-between align-items-center mb-5">
                    <div>
                        <h1 className="fw-bold mb-1">Manager Overview</h1>
                        <p className="text-muted">Manage system access and organizations.</p>
                    </div>
                    <Button className="btn-brave" onClick={() => { setModalMode("add"); setFormData({ id: null, name: "", org: "", email: "", password: "" }); setShowModal(true); }}>
                        <i className="bi bi-plus-lg me-2"></i>New Manager
                    </Button>
                </div>

                {error && <Alert variant="danger" className="rounded-3 border-0 shadow-sm">{error}</Alert>}

                <div className="card-brave">
                    {loading ? (
                        <div className="text-center py-5"><Spinner animation="border" variant="danger" /></div>
                    ) : (
                        <Table hover responsive className="table-brave mb-0">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Organization</th>
                                    <th>Email</th>
                                    <th className="text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {managers.map((manager) => (
                                    <tr key={manager.id}>
                                        <td className="fw-bold">{manager.name}</td>
                                        <td><span className="badge bg-light text-dark border px-3 py-2 rounded-pill">{manager.org}</span></td>
                                        <td className="text-muted">{manager.email}</td>
                                        <td className="text-end">
                                            <Button variant="link" className="text-primary p-0 me-3" onClick={() => { setModalMode("edit"); setFormData(manager); setShowModal(true); }}>
                                                <i className="bi bi-pencil-fill"></i>
                                            </Button>
                                            <Button variant="link" className="text-danger p-0" onClick={() => handleDelete(manager.id)}>
                                                <i className="bi bi-trash-fill"></i>
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </div>
            </Container>

            <Modal show={showModal} onHide={() => setShowModal(false)} centered contentClassName="border-0 rounded-4 shadow">
                <Modal.Header closeButton className="border-bottom-0 pb-0">
                    <Modal.Title className="fw-bold">{modalMode === "add" ? "Add Manager" : "Edit Manager"}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    <Form onSubmit={handleFormSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label className="small fw-bold text-secondary">FULL NAME</Form.Label>
                            <Form.Control className="rounded-3 p-3 bg-light border-0" type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="small fw-bold text-secondary">ORGANIZATION</Form.Label>
                            <Form.Control className="rounded-3 p-3 bg-light border-0" type="text" value={formData.org} onChange={(e) => setFormData({ ...formData, org: e.target.value })} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="small fw-bold text-secondary">EMAIL</Form.Label>
                            <Form.Control className="rounded-3 p-3 bg-light border-0" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                        </Form.Group>
                        {modalMode === "add" && (
                            <Form.Group className="mb-4">
                                <Form.Label className="small fw-bold text-secondary">PASSWORD</Form.Label>
                                <Form.Control className="rounded-3 p-3 bg-light border-0" type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
                            </Form.Group>
                        )}
                        <Button type="submit" className="btn-brave w-100 py-3">Save Changes</Button>
                    </Form>
                </Modal.Body>
            </Modal>

            <AdminDock />
        </div>
    );
};

export default SuperAdminDashboard;