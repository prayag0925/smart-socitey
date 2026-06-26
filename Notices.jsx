import React, { useEffect, useState } from 'react';
import { Card, Button, Modal, Form, Badge, Row, Col, Spinner } from 'react-bootstrap';
import Layout from '../../components/layout/Layout';
import API from '../../services/api';
import { toast } from 'react-toastify';

const typeColor = { general: 'primary', emergency: 'danger', event: 'success', meeting: 'warning', maintenance: 'info' };

const Notices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', type: 'general' });

  useEffect(() => { fetchNotices(); }, []);

  const fetchNotices = () => {
    setLoading(true);
    API.get('/notices').then(r => setNotices(r.data)).finally(() => setLoading(false));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await API.post('/notices', form);
      toast.success('Notice published!');
      setShow(false);
      setForm({ title: '', content: '', type: 'general' });
      fetchNotices();
    } catch { toast.error('Failed to publish notice'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this notice?')) return;
    await API.delete(`/notices/${id}`);
    toast.success('Notice deleted');
    fetchNotices();
  };

  return (
    <Layout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold">Notices & Announcements</h4>
        <Button onClick={() => setShow(true)}>+ New Notice</Button>
      </div>
      {loading ? <Spinner /> : (
        <Row className="g-3">
          {notices.map(n => (
            <Col md={6} key={n._id}>
              <Card className="shadow-sm h-100">
                <Card.Body>
                  <div className="d-flex justify-content-between mb-2">
                    <Badge bg={typeColor[n.type] || 'secondary'} className="text-capitalize">{n.type}</Badge>
                    <small className="text-muted">{new Date(n.createdAt).toLocaleDateString()}</small>
                  </div>
                  <Card.Title>{n.title}</Card.Title>
                  <Card.Text className="text-muted">{n.content}</Card.Text>
                  <Button size="sm" variant="outline-danger" onClick={() => handleDelete(n._id)}>Delete</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
          {notices.length === 0 && <p className="text-muted">No notices yet.</p>}
        </Row>
      )}

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton><Modal.Title>New Notice</Modal.Title></Modal.Header>
        <Form onSubmit={handleCreate}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control placeholder="Notice title" value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Content</Form.Label>
              <Form.Control as="textarea" rows={4} placeholder="Notice content" value={form.content}
                onChange={e => setForm({ ...form, content: e.target.value })} required />
            </Form.Group>
            <Form.Group>
              <Form.Label>Type</Form.Label>
              <Form.Select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                <option value="general">General</option>
                <option value="emergency">Emergency</option>
                <option value="event">Event</option>
                <option value="meeting">Meeting</option>
                <option value="maintenance">Maintenance</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShow(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Publish</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Layout>
  );
};

export default Notices;
