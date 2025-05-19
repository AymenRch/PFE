import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Contracts.css';

const Contracts = () => {
  const [contracts, setContracts] = useState({ entrepreneurContracts: [], investorContracts: [] });
  const navigate = useNavigate();

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
      } catch (err) {
        console.error("Error fetching contracts:", err);
      }
    };

    fetchContracts();
  }, [navigate]);

  // Merge both arrays for display
  const allContracts = [
    ...(contracts.entrepreneurContracts || []),
    ...(contracts.investorContracts || [])
  ];

  return (
    <div className='container'>
      <h1 className='title'>Contracts</h1>
      <div className="contracts">
        {allContracts.length === 0 && <p>No contracts found.</p>}
        {allContracts.map((contract) => (
          <div className="contract" key={contract.id}>
            <h2>Project Title: {contract.projectTitle}</h2>
            <p><strong>Investment Model:</strong> {contract.investmentModel}</p>
            <p><strong>Equity Percentage:</strong> {contract.equityPercentage}%</p>
            <p><strong>Revenue Share Percentage:</strong> {contract.revenueSharePercentage}%</p>
            <div className="contract-footer">
               <p><strong>Duration:</strong> {contract.duration ? new Date(contract.duration).toLocaleDateString() : ''}</p>
            <p><strong>Status:</strong> {contract.signed}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Contracts;