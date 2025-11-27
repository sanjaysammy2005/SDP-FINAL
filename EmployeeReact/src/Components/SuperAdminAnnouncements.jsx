import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Form, Spinner, Alert } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Manager/ManagerDashboard.css';

const SuperAdminAnnouncements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ title: "", content: "" });
    const navigate = useNavigate();
    const location = useLocation();
    const baseUrl = `${import.meta.env.VITE_API_URL}`;

    const fetchAnnouncements = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${baseUrl}/api/announcements`);
            setAnnouncements(response.data);
        } catch (err) { console.error(err); } 
        finally { setLoading(false); }
    };

    useEffect(() => { fetchAnnouncements(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await axios.post(`${baseUrl}/api/announcements/create`, formData);
        fetchAnnouncements();
        setFormData({ title: "", content: "" });
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
                    <h1 className="fw-bold mb-1">Announcements</h1>
                    <p className="text-muted">Broadcast updates to the entire organization.</p>
                </div>

                <Row className="g-4">
                    <Col lg={4}>
                        <div className="card-brave p-4 sticky-top" style={{top: '20px'}}>
                            <h5 className="fw-bold mb-4">Create Post</h5>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Control 
                                        className="bg-light border-0 p-3 rounded-3" 
                                        placeholder="Title" 
                                        value={formData.title} 
                                        onChange={e => setFormData({...formData, title: e.target.value})} 
                                        required 
                                    />
                                </Form.Group>
                                <Form.Group className="mb-4">
                                    <Form.Control 
                                        as="textarea" 
                                        rows={6} 
                                        className="bg-light border-0 p-3 rounded-3" 
                                        placeholder="Write your announcement..." 
                                        value={formData.content} 
                                        onChange={e => setFormData({...formData, content: e.target.value})} 
                                        required 
                                    />
                                </Form.Group>
                                <Button type="submit" className="btn-brave w-100 py-3">Publish Now</Button>
                            </Form>
                        </div>
                    </Col>

                    <Col lg={8}>
                        <div className="card-brave h-100">
                            <div className="card-header-brave">Recent Updates</div>
                            <div className="p-0">
                                {loading ? <div className="text-center py-5"><Spinner animation="border" variant="danger"/></div> : (
                                    announcements.length > 0 ? announcements.map((item, idx) => (
                                        <div key={item.id} className={`p-4 ${idx !== announcements.length - 1 ? 'border-bottom' : ''}`}>
                                            <div className="d-flex justify-content-between mb-2">
                                                <h5 className="fw-bold text-dark mb-0">{item.title}</h5>
                                                <small className="text-muted bg-light px-2 py-1 rounded">{new Date(item.date).toLocaleDateString()}</small>
                                            </div>
                                            <p className="text-secondary mb-0" style={{lineHeight: '1.6'}}>{item.content}</p>
                                        </div>
                                    )) : <div className="p-5 text-center text-muted">No announcements yet.</div>
                                )}
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
            <AdminDock />
        </div>
    );
};

export default SuperAdminAnnouncements;