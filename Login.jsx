import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Container, Alert, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../../redux/slices/authSlice';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector(state => state.auth);
  const [form, setForm] = useState({ email: '', password: '' });

  useEffect(() => {
    if (user) {
      const map = { admin: '/admin/dashboard', resident: '/resident/dashboard', security: '/security/dashboard', maintenance: '/maintenance/dashboard' };
      navigate(map[user.role] || '/');
    }
  }, [user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(clearError());
    dispatch(loginUser(form));
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Card style={{ width: '100%', maxWidth: '420px' }} className="shadow-lg">
        <Card.Body className="p-4">
          <div className="text-center mb-4">
            <h2 className="text-primary fw-bold">🏢 Smart Society</h2>
            <p className="text-muted">Sign in to your account</p>
          </div>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email Address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })} required />
            </Form.Group>
            <Button type="submit" variant="primary" className="w-100 mt-2" disabled={loading}>
              {loading ? <Spinner size="sm" /> : 'Login'}
            </Button>
          </Form>
          <div className="text-center mt-3">
            <Link to="/register" className="text-decoration-none">Don't have an account? Register</Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Login;
