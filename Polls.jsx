import React, { useEffect, useState } from 'react';
import { Card, Button, Badge, Row, Col, Spinner, ProgressBar } from 'react-bootstrap';
import Layout from '../../components/layout/Layout';
import API from '../../services/api';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const ResidentPolls = () => {
  const { user } = useSelector(s => s.auth);
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchPolls(); }, []);

  const fetchPolls = () => {
    setLoading(true);
    API.get('/polls').then(r => setPolls(r.data)).finally(() => setLoading(false));
  };

  const handleVote = async (pollId, optionId) => {
    try {
      await API.put(`/polls/${pollId}/vote`, { optionId });
      toast.success('Vote recorded!');
      fetchPolls();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Voting failed');
    }
  };

  const hasVoted = (poll) => poll.options.some(o => o.votes.includes(user._id));
  const getTotalVotes = (poll) => poll.options.reduce((sum, o) => sum + o.votes.length, 0);

  return (
    <Layout>
      <h4 className="fw-bold mb-4">Polls & Voting</h4>

      {loading ? <div className="text-center"><Spinner /></div> : (
        <Row className="g-3">
          {polls.map(poll => {
            const voted = hasVoted(poll);
            const total = getTotalVotes(poll);
            return (
              <Col md={6} key={poll._id}>
                <Card className="shadow-sm border-0 h-100">
                  <Card.Body>
                    <div className="d-flex justify-content-between mb-3">
                      <Badge bg={voted ? 'success' : 'primary'}>
                        {voted ? '✓ Voted' : 'Open'}
                      </Badge>
                      <small className="text-muted">
                        {poll.expiresAt ? `Expires: ${new Date(poll.expiresAt).toLocaleDateString()}` : 'No expiry'}
                      </small>
                    </div>
                    <h6 className="fw-bold mb-3">{poll.question}</h6>

                    {poll.options.map(opt => {
                      const pct = total > 0 ? Math.round((opt.votes.length / total) * 100) : 0;
                      return (
                        <div key={opt._id} className="mb-3">
                          {!voted ? (
                            <Button
                              variant="outline-primary"
                              size="sm"
                              className="w-100 text-start mb-1"
                              onClick={() => handleVote(poll._id, opt._id)}
                            >
                              {opt.text}
                            </Button>
                          ) : (
                            <>
                              <div className="d-flex justify-content-between small mb-1">
                                <span>{opt.text}</span>
                                <span>{opt.votes.length} votes ({pct}%)</span>
                              </div>
                              <ProgressBar now={pct} variant="primary" style={{ height: '10px' }} />
                            </>
                          )}
                        </div>
                      );
                    })}
                    <small className="text-muted">Total votes: {total}</small>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
          {polls.length === 0 && <p className="text-muted">No active polls at the moment.</p>}
        </Row>
      )}
    </Layout>
  );
};

export default ResidentPolls;
