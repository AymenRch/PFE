import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MessageSquareMore, Filter } from 'lucide-react';
import { useNavigate , Link } from 'react-router-dom';
import './Contracts.css';

const Contracts = () => {
  const [contracts, setContracts] = useState({ entrepreneurContracts: [], investorContracts: [] });
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error,setError] = useState('')
  
  

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate("/auth");
      return;
    }

    const fetchContracts = async () => {
      try {
        const res = await axios.get(`http://localhost:9000/request/contracts/${token}`);
        setContracts(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching contracts:", err);
        setError(error.response?.data?.error || 'Failed to reject request');

      }
    };

    fetchContracts();
  }, [navigate]);

  // Merge both arrays for display
  const allContracts = [
    ...(contracts.entrepreneurContracts || []),
    ...(contracts.investorContracts || [])
  ];

  const filteredRequests = allContracts.filter(contract => {
    const matchesStatus =
      statusFilter === 'all' ||
      contract.signed?.toLowerCase() === statusFilter.toLowerCase();
    return matchesStatus;
  });

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'signed':
        return { backgroundColor: 'rgba(76, 175, 80, 0.1)', color: '#4CAF50' };
      case 'unsigned':
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
          <h1>Contracts</h1>
          <span className="request-count">{allContracts.length} Total</span>
        </div>
        <div className="header-right">
          <button className="filter-btn">
            <Filter size={18} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="signed">signed</option>
              <option value="unsigned">unsigned</option>
            </select>
          </button>
        </div>
      </div>

      <div className="requests-grid">
        {filteredRequests.map(contract => (
          <div key={contract.id} className="request-card">
            <div className="request-header">
              <div className="request-title-section">
                <h3>Project: {contract.projectTitle}</h3>
                <div className="request-details">
                </div>
              </div>
              <span
                className="status-badge"
                style={getStatusStyle(contract.signed)}
              >
                {contract.signed}
              </span>
            </div>
            <div className="request-footer">
              <div className="requester-info">
                <Link to={`/user/${contract.investorId}`} className="requester-name">See The Investor Profile</Link>
              </div>
                <button className="view-contract-btn" style={{marginTop:"10px"}} onClick={()=>{navigate(`/contract/${contract.id}`)}} >View Contract</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Contracts;