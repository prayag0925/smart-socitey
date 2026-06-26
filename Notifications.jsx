import React, { useEffect } from 'react';
import { ListGroup, Badge, Button, Spinner } from 'react-bootstrap';
import Layout from '../components/layout/Layout';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications, markAllRead } from '../redux/slices/notificationSlice';

const typeIcon = { visitor: '🚪', complaint: '📋', payment: '💰', booking: '🏋️', notice: '📢', general: '🔔' };

const Notifications = () => {
  const dispatch = useDispatch();
  const { list, loading } = useSelector(s => s.notifications);

  useEffect(() => { dispatch(fetchNotifications()); }, [dispatch]);

  return (
    <Layout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold">Notifications</h4>
        <Button variant="outline-primary" size="sm" onClick={() => dispatch(markAllRead())}>Mark All Read</Button>
      </div>
      {loading ? <Spinner /> : (
        <ListGroup>
          {list.map(n => (
            <ListGroup.Item key={n._id} className={`d-flex justify-content-between align-items-start ${!n.isRead ? 'border-start border-primary border-3' : ''}`}>
              <div className="d-flex gap-3 align-items-center">
                <span className="fs-4">{typeIcon[n.type] || '🔔'}</span>
                <div>
                  <div className="fw-semibold">{n.title}</div>
                  <div className="text-muted small">{n.message}</div>
                  <div className="text-muted" style={{ fontSize: '0.75rem' }}>{new Date(n.createdAt).toLocaleString()}</div>
                </div>
              </div>
              {!n.isRead && <Badge bg="primary" pill>New</Badge>}
            </ListGroup.Item>
          ))}
          {list.length === 0 && <p className="text-muted text-center py-4">No notifications yet</p>}
        </ListGroup>
      )}
    </Layout>
  );
};

export default Notifications;
