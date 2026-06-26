import React, { useState } from 'react';
import { Form, Button, Card, Container, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../redux/slices/authSlice';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(state => state.auth);
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', flatNumber: '', role: 'resident' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(registerUser(form));
    if (!result.error) {
      const map = { admin: '/admin/dashboard', resident: '/resident/dashboard', security: '/security/dashboard', maintenance: '/maintenance/dashboard' };
      navigate(map[form.role] || '/');
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center py-5">
      <Card style={{ width: '100%', maxWidth: '520px' }} className="shadow-lg">
        <Card.Body className="p-4">
          <div className="text-center mb-4">
            <h2 className="text-primary fw-bold">🏢 Smart Society</h2>
            <p className="text-muted">Create your account</p>
          </div>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control placeholder="Your name" value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })} required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control placeholder="Phone number" value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })} />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="Email address" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })} required />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Flat Number</Form.Label>
                  <Form.Control placeholder="e.g. A-101" value={form.flatNumber}
                    onChange={e => setForm({ ...form, flatNumber: e.target.value })} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Role</Form.Label>
                  <Form.Select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                    <option value="resident">Resident</option>
                    <option value="admin">Admin</option>
                    <option value="security">Security</option>
                    <option value="maintenance">Maintenance</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Button type="submit" variant="primary" className="w-100" disabled={loading}>
              {loading ? <Spinner size="sm" /> : 'Register'}
            </Button>
          </Form>
          <div className="text-center mt-3">
            <Link to="/login" className="text-decoration-none">Already have an account? Login</Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Register;
