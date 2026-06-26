import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Button, Modal, Form, Badge, Spinner, Table } from 'react-bootstrap';
import Layout from '../../components/layout/Layout';
import API from '../../services/api';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const ResidentProfile = () => {
  const { user } = useSelector(s => s.auth);
  const [resident, setResident] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFamily, setShowFamily] = useState(false);
  const [showVehicle, setShowVehicle] = useState(false);
  const [familyForm, setFamilyForm] = useState({ name: '', relation: '', age: '', phone: '' });
  const [vehicleForm, setVehicleForm] = useState({ vehicleNumber: '', vehicleType: 'car', vehicleName: '' });

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = () => {
    setLoading(true);
    API.get(`/residents/${user._id}`).then(r => setResident(r.data)).catch(() => setResident(null)).finally(() => setLoading(false));
  };

  const handleAddFamily = async (e) => {
    e.preventDefault();
    try {
      await API.post('/residents/family', familyForm);
      toast.success('Family member added!');
      setShowFamily(false);
      setFamilyForm({ name: '', relation: '', age: '', phone: '' });
      fetchProfile();
    } catch { toast.error('Failed to add family member'); }
  };

  const handleRemoveFamily = async (memberId) => {
    if (!window.confirm('Remove this family member?')) return;
    try {
      await API.delete(`/residents/family/${memberId}`);
      toast.success('Removed!');
      fetchProfile();
    } catch { toast.error('Failed'); }
  };

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    try {
      await API.post('/residents/vehicle', vehicleForm);
      toast.success('Vehicle registered!');
      setShowVehicle(false);
      setVehicleForm({ vehicleNumber: '', vehicleType: 'car', vehicleName: '' });
      fetchProfile();
    } catch { toast.error('Failed to register vehicle'); }
  };

  const handleRemoveVehicle = async (vehicleId) => {
    if (!window.confirm('Remove this vehicle?')) return;
    try {
      await API.delete(`/residents/vehicle/${vehicleId}`);
      toast.success('Vehicle removed!');
      fetchProfile();
    } catch { toast.error('Failed'); }
  };

  if (loading) return <Layout><div className="text-center mt-5"><Spinner /></div></Layout>;

  return (
    <Layout>
      <h4 className="fw-bold mb-4">My Profile</h4>

      {/* Profile Info */}
      <Card className="shadow-sm border-0 mb-4">
        <Card.Body>
          <Row>
            <Col md={2} className="text-center">
              <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto"
                style={{ width: 80, height: 80, fontSize: 32 }}>
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            </Col>
            <Col md={10}>
              <h5 className="fw-bold">{user?.name}</h5>
              <p className="text-muted mb-1">📧 {user?.email}</p>
              <p className="text-muted mb-1">📞 {user?.phone || 'Not provided'}</p>
              <p className="text-muted mb-1">🏠 Flat: <Badge bg="primary">{user?.flatNumber || 'Not assigned'}</Badge></p>
              {resident && (
                <>
                  <p className="text-muted mb-1">👤 Occupancy: <span className="text-capitalize">{resident.occupancyType}</span></p>
                  {resident.moveInDate && <p className="text-muted mb-1">📅 Move In: {new Date(resident.moveInDate).toLocaleDateString()}</p>}
                  {resident.emergencyContact && <p className="text-muted mb-0">🆘 Emergency: {resident.emergencyContact}</p>}
                </>
              )}
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Row className="g-4">
        {/* Family Members */}
        <Col md={6}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Header className="bg-white d-flex justify-content-between align-items-center">
              <h6 className="fw-bold mb-0">👨‍👩‍👧 Family Members</h6>
              <Button size="sm" onClick={() => setShowFamily(true)}>+ Add</Button>
            </Card.Header>
            <Card.Body>
              {resident?.familyMembers?.length > 0 ? (
                <Table size="sm" hover>
                  <thead><tr><th>Name</th><th>Relation</th><th>Age</th><th></th></tr></thead>
                  <tbody>
                    {resident.familyMembers.map(m => (
                      <tr key={m._id}>
                        <td>{m.name}</td>
                        <td className="text-capitalize">{m.relation}</td>
                        <td>{m.age || '-'}</td>
                        <td>
                          <Button size="sm" variant="outline-danger" onClick={() => handleRemoveFamily(m._id)}>✕</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p className="text-muted text-center py-3">No family members added</p>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Vehicles */}
        <Col md={6}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Header className="bg-white d-flex justify-content-between align-items-center">
              <h6 className="fw-bold mb-0">🚗 My Vehicles</h6>
              <Button size="sm" onClick={() => setShowVehicle(true)}>+ Register</Button>
            </Card.Header>
            <Card.Body>
              {resident?.vehicles?.length > 0 ? (
                <Table size="sm" hover>
                  <thead><tr><th>Number</th><th>Type</th><th>Name</th><th></th></tr></thead>
                  <tbody>
                    {resident.vehicles.map(v => (
                      <tr key={v._id}>
                        <td><Badge bg="secondary">{v.vehicleNumber}</Badge></td>
                        <td className="text-capitalize">{v.vehicleType}</td>
                        <td>{v.vehicleName || '-'}</td>
                        <td>
                          <Button size="sm" variant="outline-danger" onClick={() => handleRemoveVehicle(v._id)}>✕</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p className="text-muted text-center py-3">No vehicles registered</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Add Family Modal */}
      <Modal show={showFamily} onHide={() => setShowFamily(false)}>
        <Modal.Header closeButton><Modal.Title>Add Family Member</Modal.Title></Modal.Header>
        <Form onSubmit={handleAddFamily}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control placeholder="Full name" value={familyForm.name}
                    onChange={e => setFamilyForm({ ...familyForm, name: e.target.value })} required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Relation</Form.Label>
                  <Form.Control placeholder="e.g. Spouse, Son" value={familyForm.relation}
                    onChange={e => setFamilyForm({ ...familyForm, relation: e.target.value })} required />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Age</Form.Label>
                  <Form.Control type="number" placeholder="Age" value={familyForm.age}
                    onChange={e => setFamilyForm({ ...familyForm, age: e.target.value })} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control placeholder="Phone number" value={familyForm.phone}
                    onChange={e => setFamilyForm({ ...familyForm, phone: e.target.value })} />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowFamily(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Add Member</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Add Vehicle Modal */}
      <Modal show={showVehicle} onHide={() => setShowVehicle(false)}>
        <Modal.Header closeButton><Modal.Title>Register Vehicle</Modal.Title></Modal.Header>
        <Form onSubmit={handleAddVehicle}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Vehicle Number</Form.Label>
              <Form.Control placeholder="e.g. GJ01AB1234" value={vehicleForm.vehicleNumber}
                onChange={e => setVehicleForm({ ...vehicleForm, vehicleNumber: e.target.value })} required />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Vehicle Type</Form.Label>
                  <Form.Select value={vehicleForm.vehicleType}
                    onChange={e => setVehicleForm({ ...vehicleForm, vehicleType: e.target.value })}>
                    <option value="car">Car</option>
                    <option value="bike">Bike</option>
                    <option value="scooter">Scooter</option>
                    <option value="other">Other</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Vehicle Name</Form.Label>
                  <Form.Control placeholder="e.g. Honda City" value={vehicleForm.vehicleName}
                    onChange={e => setVehicleForm({ ...vehicleForm, vehicleName: e.target.value })} />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowVehicle(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Register</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Layout>
  );
};

export default ResidentProfile;
