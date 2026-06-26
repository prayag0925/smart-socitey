import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Spinner, Row, Col, Badge } from 'react-bootstrap';
import Layout from '../../components/layout/Layout';
import API from '../../services/api';
import { toast } from 'react-toastify';

const AdminResidents = () => {
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '', flatNumber: '', role: 'resident'
  });
  const [resForm, setResForm] = useState({
    occupancyType: 'owner', moveInDate: '', emergencyContact: ''
  });

  useEffect(() => { fetchResidents(); }, []);

  const fetchResidents = () => {
    setLoading(true);
    API.get('/residents').then(r => setResidents(r.data)).finally(() => setLoading(false));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const userRes = await API.post('/auth/register', form);
      await API.post('/residents', {
        userId: userRes.data._id,
        flatNumber: form.flatNumber,
        ...resForm
      });
      toast.success('Resident added successfully!');
      setShow(false);
      setForm({ name: '', email: '', password: '', phone: '', flatNumber: '', role: 'resident' });
      fetchResidents();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add resident');
    }
  };

  return (
    <Layout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold">Residents Management</h4>
        <Button onClick={() => setShow(true)}>+ Add Resident</Button>
      </div>

      {loading ? <div className="text-center"><Spinner /></div> : (
        <div className="table-responsive">
          <Table striped hover className="bg-white shadow-sm rounded">
            <thead className="table-dark">
              <tr>
                <th>#</th><th>Name</th><th>Flat</th><th>Phone</th>
                <th>Occupancy</th><th>Family</th><th>Vehicles</th>
              </tr>
            </thead>
            <tbody>
              {residents.map((r, i) => (
                <tr key={r._id}>
                  <td>{i + 1}</td>
                  <td>{r.user?.name}</td>
                  <td><Badge bg="primary">{r.flatNumber}</Badge></td>
                  <td>{r.user?.phone || '-'}</td>
                  <td className="text-capitalize">{r.occupancyType}</td>
                  <td>{r.familyMembers?.length || 0} members</td>
                  <td>{r.vehicles?.length || 0} vehicles</td>
                </tr>
              ))}
              {residents.length === 0 && (
                <tr><td colSpan={7} className="text-center text-muted py-3">No residents found</td></tr>
              )}
            </tbody>
          </Table>
        </div>
      )}

      <Modal show={show} onHide={() => setShow(false)} size="lg">
        <Modal.Header closeButton><Modal.Title>Add New Resident</Modal.Title></Modal.Header>
        <Form onSubmit={handleCreate}>
          <Modal.Body>
            <h6 className="text-muted mb-3">Account Details</h6>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control placeholder="Resident name" value={form.name}
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
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" placeholder="Email" value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })} required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" placeholder="Password" value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })} required />
                </Form.Group>
              </Col>
            </Row>
            <hr />
            <h6 className="text-muted mb-3">Flat Details</h6>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Flat Number</Form.Label>
                  <Form.Control placeholder="e.g. A-101" value={form.flatNumber}
                    onChange={e => setForm({ ...form, flatNumber: e.target.value })} required />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Occupancy Type</Form.Label>
                  <Form.Select value={resForm.occupancyType}
                    onChange={e => setResForm({ ...resForm, occupancyType: e.target.value })}>
                    <option value="owner">Owner</option>
                    <option value="tenant">Tenant</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Move In Date</Form.Label>
                  <Form.Control type="date" value={resForm.moveInDate}
                    onChange={e => setResForm({ ...resForm, moveInDate: e.target.value })} />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group>
              <Form.Label>Emergency Contact</Form.Label>
              <Form.Control placeholder="Emergency contact number" value={resForm.emergencyContact}
                onChange={e => setResForm({ ...resForm, emergencyContact: e.target.value })} />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShow(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Add Resident</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Layout>
  );
};

export default AdminResidents;
