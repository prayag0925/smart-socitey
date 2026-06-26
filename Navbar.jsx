import React from 'react';
import { Navbar, Nav, Container, Badge, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';

const AppNavbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const { list } = useSelector(state => state.notifications);
  const unread = list.filter(n => !n.isRead).length;

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    const map = { admin: '/admin/dashboard', resident: '/resident/dashboard', security: '/security/dashboard', maintenance: '/maintenance/dashboard' };
    return map[user.role] || '/login';
  };

  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to={getDashboardLink()} className="fw-bold">
          🏢 Smart Society
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="ms-auto align-items-center gap-2">
            {user ? (
              <>
                <Nav.Link as={Link} to="/notifications" className="text-white">
                  🔔 {unread > 0 && <Badge bg="danger">{unread}</Badge>}
                </Nav.Link>
                <span className="text-white-50 small">Hi, {user.name}</span>
                <Button variant="outline-light" size="sm" onClick={handleLogout}>Logout</Button>
              </>
            ) : (
              <Nav.Link as={Link} to="/login" className="text-white">Login</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
