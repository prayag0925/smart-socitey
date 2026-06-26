import React, { useEffect, useState } from 'react';
import { Table, Badge, Button, Modal, Form, Spinner } from 'react-bootstrap';
import Layout from '../../components/layout/Layout';
import API from '../../services/api';
import { toast } from 'react-toastify';

const MaintenanceTasks = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [show, setShow] = useState(false);
  const [status, setStatus] = useState('');
  const [remarks, setRemarks] = useState('');

  useEffect(() => { fetchTasks(); }, []);

  const fetchTasks = () => {
    setLoading(true);
    API.get('/complaints/assigned').then(r => setComplaints(r.data)).finally(() => setLoading(false));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/complaints/${selected._id}/status`, { status, remarks });
      toast.success('Status updated!');
      setShow(false);
      fetchTasks();
    } catch { toast.error('Update failed'); }
  };

  const statusColor = { open: 'danger', assigned: 'warning', inprogress: 'info', resolved: 'success', closed: 'secondary' };

  return (
    <Layout>
      <h4 className="fw-bold mb-4">My Assigned Tasks</h4>
      {loading ? <Spinner /> : (
        <div className="table-responsive">
          <Table striped hover className="bg-white shadow-sm">
            <thead className="table-dark">
              <tr><th>#</th><th>Title</th><th>Category</th><th>Flat</th><th>Priority</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              {complaints.map((c, i) => (
                <tr key={c._id}>
                  <td>{i + 1}</td><td>{c.title}</td>
                  <td className="text-capitalize">{c.category}</td>
                  <td>{c.flatNumber}</td>
                  <td><Badge bg={c.priority === 'high' ? 'danger' : 'warning'}>{c.priority}</Badge></td>
                  <td><Badge bg={statusColor[c.status]}>{c.status}</Badge></td>
                  <td>
                    <Button size="sm" variant="primary" onClick={() => { setSelected(c); setStatus(c.status); setRemarks(c.remarks || ''); setShow(true); }}>
                      Update
                    </Button>
                  </td>
                </tr>
              ))}
              {complaints.length === 0 && <tr><td colSpan={7} className="text-center text-muted">No tasks assigned</td></tr>}
            </tbody>
          </Table>
        </div>
      )}

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton><Modal.Title>Update Task Status</Modal.Title></Modal.Header>
        <Form onSubmit={handleUpdate}>
          <Modal.Body>
            <p><strong>{selected?.title}</strong></p>
            <p className="text-muted small">{selected?.description}</p>
            <Form.Group className="mb-3">
              <Form.Label>Update Status</Form.Label>
              <Form.Select value={status} onChange={e => setStatus(e.target.value)}>
                <option value="inprogress">In Progress</option>
                <option value="resolved">Resolved</option>
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Label>Remarks / Work Done</Form.Label>
              <Form.Control as="textarea" rows={3} placeholder="Describe work done" value={remarks}
                onChange={e => setRemarks(e.target.value)} />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShow(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Update</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Layout>
  );
};

export default MaintenanceTasks;
