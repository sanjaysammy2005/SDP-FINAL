import { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert, Row, Col, Spinner } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Manager/ManagerDashboard.css';

const ProfilePage = () => {
    const [userData, setUserData] = useState({ name: '', email: '', org: '', password: '' });
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const id = localStorage.getItem('id');
    const role = localStorage.getItem('role');
    const baseUrl = `${import.meta.env.VITE_API_URL}`;
    const isEmployee = role === 'EMPLOYEE';
    const API_URL = isEmployee ? `${baseUrl}/api/employees/profile/${id}` : `${baseUrl}/manager/profile/${id}`;

    useEffect(() => {
        if (!id) { navigate('/login'); return; }
        const fetchProfile = async () => {
            try {
                const response = await axios.get(API_URL);
                setUserData({ ...response.data, password: '' });
            } catch (err) { console.error(err); } 
            finally { setLoading(false); }
        };
        fetchProfile();
    }, [id, API_URL, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await axios.put(API_URL, { name: userData.name, password: userData.password });
            localStorage.setItem('userName', userData.name);
            setSuccess('Profile updated successfully!');
            setUserData(prev => ({ ...prev, password: '' }));
        } catch (err) { alert('Update failed.'); } 
        finally { setIsSaving(false); }
    };

    // Shared Dock Component logic for Profile Page
    const SharedDock = () => {
        const items = isEmployee ? [
            { to: '/employeedashboard', icon: 'bi-speedometer2', label: 'Dashboard' },
            { to: '/leave', icon: 'bi-calendar-event', label: 'Leave' },
            { to: '/attendance', icon: 'bi-clock-history', label: 'Attendance' },
            { to: '/payroll', icon: 'bi-cash-stack', label: 'Payroll' },
            { to: '/profile', icon: 'bi-person', label: 'Profile', active: true },
        ] : [
            { to: '/managerdashboard', icon: 'bi-speedometer2', label: 'Dashboard' },
            { to: '/leave/approvals', icon: 'bi-check-circle', label: 'Approvals' },
            { to: '/attendance/manage', icon: 'bi-people', label: 'Attendance' },
            { to: '/manager/tasks', icon: 'bi-list-check', label: 'Tasks' },
            { to: '/managerprofile', icon: 'bi-person', label: 'Profile', active: true },
        ];

        return (
            <div className="brave-dock-container">
                <div className="brave-dock">
                    {items.map((item, idx) => (
                        <Link key={idx} to={item.to} className={`dock-item ${item.active ? 'active' : ''}`} data-label={item.label}>
                            <i className={`bi ${item.icon}`}></i>
                        </Link>
                    ))}
                    <div className="dock-separator"></div>
                    <div className="dock-item text-danger" onClick={() => { localStorage.clear(); navigate('/login') }} style={{cursor:'pointer'}} data-label="Logout">
                        <i className="bi bi-box-arrow-right"></i>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="dashboard-container">
            <Container className="main-content">
                <div className="row justify-content-center">
                    <Col lg={6} className="pt-5">
                        <div className="card-brave p-5">
                            <div className="text-center mb-5">
                                <div className="bg-light rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{width: '100px', height: '100px'}}>
                                    <i className="bi bi-person text-secondary" style={{fontSize: '3rem'}}></i>
                                </div>
                                <h2 className="fw-bold">{userData.name}</h2>
                                <p className="text-muted">{userData.email}</p>
                            </div>

                            {success && <Alert variant="success" className="rounded-3">{success}</Alert>}

                            {loading ? <div className="text-center"><Spinner animation="border" variant="danger"/></div> : (
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-4">
                                        <Form.Label className="small fw-bold text-secondary">FULL NAME</Form.Label>
                                        <Form.Control type="text" className="bg-light border-0 p-3 rounded-3" value={userData.name} onChange={e => setUserData({...userData, name: e.target.value})} />
                                    </Form.Group>
                                    <Form.Group className="mb-4">
                                        <Form.Label className="small fw-bold text-secondary">ORGANIZATION</Form.Label>
                                        <Form.Control type="text" className="bg-light border-0 p-3 rounded-3" value={userData.org} disabled />
                                    </Form.Group>
                                    <Form.Group className="mb-5">
                                        <Form.Label className="small fw-bold text-secondary">NEW PASSWORD</Form.Label>
                                        <Form.Control type="password" className="bg-light border-0 p-3 rounded-3" placeholder="Enter only to change" value={userData.password} onChange={e => setUserData({...userData, password: e.target.value})} />
                                    </Form.Group>
                                    <Button type="submit" className="btn-brave w-100 py-3" disabled={isSaving}>
                                        {isSaving ? 'Updating...' : 'Save Profile Changes'}
                                    </Button>
                                </Form>
                            )}
                        </div>
                    </Col>
                </div>
            </Container>
            <SharedDock />
        </div>
    );
};

export default ProfilePage;