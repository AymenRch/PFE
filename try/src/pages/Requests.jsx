import React, { useState, useEffect } from 'react';
import { MessageSquareMore, Filter, Search } from 'lucide-react';
import axios from 'axios';
import './Requests.css';
import { Link , useNavigate } from 'react-router-dom';

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate()

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line
  }, []);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get(`http://localhost:9000/request/mine/${token}`);
      setRequests(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching requests:', error);
      setError(error.response?.data?.error || 'Failed to fetch requests');
      setLoading(false);
    }
  };

  const handleAccept = async (dealId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      await axios.put(`http://localhost:9000/request/accept/${dealId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Refresh requests after accepting
      fetchRequests();
    } catch (error) {
      console.error('Error accepting request:', error);
      setError(error.response?.data?.error || 'Failed to accept request');
    }
  };

  const handleReject = async (dealId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      await axios.put(`http://localhost:9000/request/reject/${dealId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Refresh requests after rejecting
      fetchRequests();
    } catch (error) {
      console.error('Error rejecting request:', error);
      setError(error.response?.data?.error || 'Failed to reject request');
    }
  };

  // Update filtering logic and field names to match your API response
  const filteredRequests = requests.filter(request => {
    const matchesSearch =
      request.investmentModel?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(request.investorId).includes(searchTerm) ||
      String(request.entrepreneurId).includes(searchTerm);
    const matchesStatus =
      statusFilter === 'all' ||
      request.dealStatus?.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'accepted':
        return { backgroundColor: 'rgba(76, 175, 80, 0.1)', color: '#4CAF50' };
      case 'rejected':
        return { backgroundColor: 'rgba(244, 67, 54, 0.1)', color: '#F44336' };
      case 'pending':
        return { backgroundColor: 'rgba(251, 140, 0, 0.1)', color: '#FB8C00' };
      default:
        return { backgroundColor: 'rgba(117, 117, 117, 0.1)', color: '#757575' };
    }
  };

  if (loading) {
    return <div className="loading">Loading requests...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="requests-container">
      <div className="requests-header">
        <div className="header-left">
          <MessageSquareMore size={24} />
          <h1>Requests</h1>
          <span className="request-count">{requests.length} Total</span>
        </div>
        <div className="header-right">
          <div className="search-container">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="filter-btn">
            <Filter size={18} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
          </button>
        </div>
      </div>

      <div className="requests-grid">
        {filteredRequests.slice().reverse().map(request => (
          <div key={request.id} className="request-card">
            <div className="request-header">
              <div className="request-title-section">
                <h3>{request.projectTitle}</h3>
                <div className="request-details">
                  <span className="amount">{request.investmentAmount}$</span>
                  <span className="business-model">
                   {request.investmentModel} 
                  </span>
                </div>
              </div>
              <span
                className="status-badge"
                style={getStatusStyle(request.dealStatus)}
              >
                {request.dealStatus}
              </span>
            </div>
            <div className="request-footer">
              <div className="requester-info">
                <Link to={`/user/${request.investorId}`} className="requester-name">See The Investor Profile</Link>
                <span className="request-date">
                  {request.duration ? new Date(request.duration).toLocaleDateString() : ''}
                </span>
              </div>
              {request.dealStatus === "pending" && (
                <div className="action-buttons">
                  <button
                    className="accept-btn"
                    onClick={() => handleAccept(request.id)}
                  >
                    Accept
                  </button>
                  <button
                    className="decline-btn"
                    onClick={() => handleReject(request.id)}
                  >
                    Decline
                  </button>
                </div>
              )}
              {request.dealStatus === "accepted" && (
                <button onClick={()=>{navigate(`/contracts`)}} className="view-contract-btn">View Contract</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Requests;