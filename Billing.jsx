import React, { useEffect, useState } from 'react';
import { Table, Badge, Button, Modal, Form, Spinner } from 'react-bootstrap';
import Layout from '../../components/layout/Layout';
import API from '../../services/api';
import { toast } from 'react-toastify';

const ResidentBilling = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [show, setShow] = useState(false);
  const [payForm, setPayForm] = useState({ paymentMethod: 'online', transactionId: '' });

  useEffect(() => { fetchBills(); }, []);

  const fetchBills = () => {
    setLoading(true);
    API.get('/billing/my').then(r => setBills(r.data)).finally(() => setLoading(false));
  };

  const handlePay = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/billing/${selected._id}/pay`, payForm);
      toast.success('Payment successful!');
      setShow(false);
      fetchBills();
    } catch { toast.error('Payment failed'); }
  };

  const statusColor = { pending: 'warning', paid: 'success', overdue: 'danger' };

  return (
    <Layout>
      <h4 className="fw-bold mb-4">My Maintenance Bills</h4>
      {loading ? <Spinner /> : (
        <div className="table-responsive">
          <Table striped hover className="bg-white shadow-sm">
            <thead className="table-dark">
              <tr><th>#</th><th>Month</th><th>Year</th><th>Amount</th><th>Penalty</th><th>Total</th><th>Due Date</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              {bills.map((b, i) => (
                <tr key={b._id}>
                  <td>{i + 1}</td><td>{b.month}</td><td>{b.year}</td>
                  <td>₹{b.amount}</td><td>₹{b.penalty}</td><td>₹{b.totalAmount}</td>
                  <td>{new Date(b.dueDate).toLocaleDateString()}</td>
                  <td><Badge bg={statusColor[b.status]}>{b.status}</Badge></td>
                  <td>
                    {b.status !== 'paid' && (
                      <Button size="sm" variant="success" onClick={() => { setSelected(b); setShow(true); }}>Pay Now</Button>
                    )}
                    {b.status === 'paid' && <span className="text-success">✓ Paid</span>}
                  </td>
                </tr>
              ))}
              {bills.length === 0 && <tr><td colSpan={9} className="text-center text-muted">No bills found</td></tr>}
            </tbody>
          </Table>
        </div>
      )}

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton><Modal.Title>Pay Bill</Modal.Title></Modal.Header>
        <Form onSubmit={handlePay}>
          <Modal.Body>
            <p>Amount Due: <strong>₹{selected?.totalAmount}</strong></p>
            <Form.Group className="mb-3">
              <Form.Label>Payment Method</Form.Label>
              <Form.Select value={payForm.paymentMethod} onChange={e => setPayForm({ ...payForm, paymentMethod: e.target.value })}>
                <option value="online">Online Transfer</option>
                <option value="cash">Cash</option>
                <option value="cheque">Cheque</option>
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Label>Transaction ID (optional)</Form.Label>
              <Form.Control placeholder="Transaction reference" value={payForm.transactionId}
                onChange={e => setPayForm({ ...payForm, transactionId: e.target.value })} />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShow(false)}>Cancel</Button>
            <Button type="submit" variant="success">Confirm Payment</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Layout>
  );
};

export default ResidentBilling;
