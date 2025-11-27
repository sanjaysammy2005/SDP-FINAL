import React, { useState } from "react";
import axios from "axios";
import { Form, Button, Alert } from "react-bootstrap";

const AddEmployee = ({ managerId, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [status, setStatus] = useState({ type: "", msg: "" });
  const baseUrl = `${import.meta.env.VITE_API_URL}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", msg: "" });
    
    try {
      await axios.post(
        `${baseUrl}/api/employees/addEmployee?managerId=${managerId}`,
        { ...formData, manager: { id: managerId } },
        { headers: { "Content-Type": "application/json" } }
      );
      setStatus({ type: "success", msg: "Employee added successfully!" });
      setTimeout(() => onSuccess && onSuccess(), 1000);
    } catch (error) {
      setStatus({ type: "danger", msg: "Failed to add employee. Email might be duplicate." });
    }
  };

  return (
    <div className="p-4">
      <div className="text-center mb-4">
        <div className="bg-light rounded-circle d-inline-flex p-3 mb-3">
          <i className="bi bi-person-badge text-primary fs-3"></i>
        </div>
        <h4 className="fw-bold">Onboard New Talent</h4>
        <p className="text-muted small">Create an account for your new team member.</p>
      </div>

      {status.msg && <Alert variant={status.type} className="rounded-3 border-0 small">{status.msg}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label className="small fw-bold text-secondary">FULL NAME</Form.Label>
          <Form.Control 
            type="text" 
            className="bg-light border-0 p-3 rounded-3" 
            placeholder="e.g. Sanjay"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.Label className="small fw-bold text-secondary">EMAIL ADDRESS</Form.Label>
          <Form.Control 
            type="email" 
            className="bg-light border-0 p-3 rounded-3" 
            placeholder="sanjay@company.com"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label className="small fw-bold text-secondary">TEMPORARY PASSWORD</Form.Label>
          <Form.Control 
            type="password" 
            className="bg-light border-0 p-3 rounded-3" 
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />
        </Form.Group>

        <div className="d-flex gap-2">
          <Button variant="light" className="w-50 py-3 fw-bold" onClick={onCancel}>Cancel</Button>
          <Button type="submit" className="btn-brave w-50 py-3">Create Account</Button>
        </div>
      </Form>
    </div>
  );
};

export default AddEmployee;