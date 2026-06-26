import React, { useEffect, useState } from 'react';
import { Table, Badge, Button, Modal, Form, Spinner, Row, Col } from 'react-bootstrap';
import Layout from '../../components/layout/Layout';
import API from '../../services/api';
import { toast } from 'react-toastify';

const statusColor = { open: 'danger', assigned: 'warning', inprogress: 'info', resolved: 'success', closed: 'secondary' };

const ResidentComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', category: 'electrical', priority: 'medium' });
  const [images, setImages] = useState([]);

  useEffect(() => { fetchComplaints(); }, []);

  const fetchComplaints = () => {
    setLoading(true);
    API.get('/complaints/my').then(r => setComplaints(r.data)).finally(() => setLoading(false));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      images.forEach(img => fd.append('images', img));
      await API.post('/complaints', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Complaint raised successfully!');
      setShow(false);
      setForm({ title: '', description: '', category: 'electrical', priority: 'medium' });
      setImages([]);
      fetchComplaints();
    } catch { toast.error('Failed to raise complaint'); }
  };

  return (
    <Layout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold">My Complaints</h4>
        <Button onClick={() => setShow(true)}>+ Raise Complaint</Button>
      </div>
      {loading ? <Spinner /> : (
        <div className="table-responsive">
          <Table striped hover className="bg-white shadow-sm">
            <thead className="table-dark">
              <tr><th>#</th><th>Title</th><th>Category</th><th>Priority</th><th>Status</th><th>Date</th></tr>
            </thead>
            <tbody>
              {complaints.map((c, i) => (
                <tr key={c._id}>
                  <td>{i + 1}</td><td>{c.title}</td>
                  <td className="text-capitalize">{c.category}</td>
                  <td><Badge bg={c.priority === 'high' ? 'danger' : c.priority === 'medium' ? 'warning' : 'success'}>{c.priority}</Badge></td>
                  <td><Badge bg={statusColor[c.status]}>{c.status}</Badge></td>
                  <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {complaints.length === 0 && <tr><td colSpan={6} className="text-center text-muted">No complaints raised yet</td></tr>}
            </tbody>
          </Table>
        </div>
      )}

      <Modal show={show} onHide={() => setShow(false)} size="lg">
        <Modal.Header closeButton><Modal.Title>Raise New Complaint</Modal.Title></Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control placeholder="Short title" value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={3} placeholder="Describe the issue" value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })} required />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    <option value="electrical">Electrical</option>
                    <option value="plumbing">Plumbing</option>
                    <option value="water">Water Supply</option>
                    <option value="cleaning">Cleaning</option>
                    <option value="security">Security</option>
                    <option value="parking">Parking</option>
                    <option value="lift">Lift</option>
                    <option value="other">Other</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Priority</Form.Label>
                  <Form.Select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group>
              <Form.Label>Upload Images (optional)</Form.Label>
              <Form.Control type="file" multiple accept="image/*"
                onChange={e => setImages(Array.from(e.target.files))} />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShow(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Submit Complaint</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Layout>
  );
};

export default ResidentComplaints;
