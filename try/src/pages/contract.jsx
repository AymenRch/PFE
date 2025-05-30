import React, { useState, useEffect , useRef} from 'react';
import axios from 'axios';
import { MessageSquareMore } from 'lucide-react';
import './Contracts.css';
import { useParams , useNavigate } from 'react-router-dom';
import html2pdf from 'html2pdf.js';


const Contract = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message , setMessage] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();
  const contractRef = useRef(null);


  const [data, setData] = useState({
    investorName: '',
    entrepreneurName: '',
    projectTitle: '',
    businessModel: '',
    amount: '',
    equity: '',
    revenue: '',
    duration: '',
    signed: '',
  });

  useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate("/auth");
      }
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:9000/request/contract/${id}`);
        const { contract, investorData, entrepreneurData } = res.data;

        setData({
          investorName: investorData.name || 'Investor',
          entrepreneurName: entrepreneurData.name || 'Entrepreneur',
          projectTitle: contract.projectTitle || '',
          businessModel: contract.investmentModel || '',
          amount: contract.amount || '',
          equity: contract.equityPercentage || '',
          revenue: contract.revenueSharePercentage || '',
          duration: contract.duration || '',
          signed: contract.signed || '',
        });
      } catch (err) {
        setError('Failed to load contract.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSign = () => {
  const token = localStorage.getItem('token');

  axios.put(
    `http://localhost:9000/request/contract/accept/${id}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  ).then((res) => {
    setMessage(res.data.message);
  }).catch((err) => {
    if (err.response && err.response.data) {
      setError(err.response.data.message || err.response.data.error);
    } else {
      setError("Something went wrong");
    }
  });
};

const handleDecline = () => {
  const token = localStorage.getItem('token')
  const response = axios.delete(`http://localhost:9000/request/contract/decline/${id}`,{}).then((res)=>{
    setError(res.data.message)
  }).catch((err) => {
    if (err.response && err.response.data) {
      setError(err.response.data.message || err.response.data.error);
    } else {
      setError("Something went wrong");
    }
  });
};

const handlePrint = () => {
  const element = contractRef.current;
  const opt = {
    margin:       0.5,
    filename:     `contract-${id}.pdf`,
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2 },
    jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
  };
  html2pdf().set(opt).from(element).save();
};



  const getStatusStyle = (signed) => {
    switch (signed?.toLowerCase()) {
      case 'signed':
        return { backgroundColor: 'rgba(76, 175, 80, 0.1)', color: '#4CAF50' };
      case 'unsigned':
        return { backgroundColor: 'rgba(251, 140, 0, 0.1)', color: '#FB8C00' };
      default:
        return { backgroundColor: 'rgba(117, 117, 117, 0.1)', color: '#757575' };
    }
  };

  if (loading) {
    return <div className="loading">Loading contract...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }
  if (message) {
    return <div className="error" style={{backgroundColor:"#d4edda",color:"green"}}>{message}</div>;
  }

  return (
    <div className="requests-container">
      <div className="requests-header">
        <div className="header-left">
          <MessageSquareMore size={24} />
          <h1>Status :</h1>
          <span className="status-badge" style={getStatusStyle(data.signed)}>
            {data.signed}
          </span>
        </div>
        {data.signed === "unsigned" && (
                <div className="action-buttons">
                  <button
                    className="accept-btn"
                    onClick={handleSign}
                  >
                    Sign
                  </button>
                  <button
                    className="decline-btn"
                    onClick={handleDecline}
                  >
                    Decline
                  </button>
                </div>
              )}
          {data.signed === 'signed' && (
           <button className="view-contract-btn" style={{marginTop:"10px"}} onClick={handlePrint} >Print Contract</button>

          ) }
      </div>
        <h1 style={{marginLeft:"400px"}}>Contract</h1>

<div className="contract-details professional-contract" ref={contractRef}>
  <h2>Investment Agreement</h2>

  <p>This Investment Agreement (“Agreement”) is made between <strong>{data.investorName}</strong>, hereinafter referred to as “Investor”, and <strong>{data.entrepreneurName}</strong>, hereinafter referred to as “Entrepreneur”.</p>

  <p><strong>Project Title:</strong> <em>{data.projectTitle}</em></p>

  <p><strong>1. Purpose of Agreement:</strong><br/>
  The Entrepreneur seeks funding for the above-mentioned project. The Investor agrees to provide capital under the terms specified herein.</p>

  <p><strong>2. Business Model:</strong><br/>
  The project will operate under the following model: <em>{data.businessModel}</em>.</p>

  <p><strong>3. Investment Details:</strong><br/>
  The Investor agrees to invest a total amount of <strong>${data.amount}</strong> in exchange for <strong>{data.equity}%</strong> equity in the project.</p>

  <p><strong>4. Revenue Sharing:</strong><br/>
  The Entrepreneur agrees to share <strong>{data.revenue}%</strong> of the project’s monthly gross revenue with the Investor during the active duration of this agreement.</p>

  <p><strong>5. Duration:</strong><br/>
  This agreement will remain in effect for a period of <strong>{data.duration}</strong> months from the date of signing unless otherwise terminated by mutual consent or breach of terms.</p>

  <p><strong>6. Signatures:</strong><br/>
  This agreement shall be considered binding once signed by both parties.</p>

  <div className="signature-section">
    <div className="signature-box">
      <p>__________________________</p>
      <p><strong>{data.investorName}</strong></p>
      <p>Investor</p>
    </div>
    <div className="signature-box">
      <p>__________________________</p>
      <p><strong>{data.entrepreneurName}</strong></p>
      <p>Entrepreneur</p>
    </div>
  </div>
</div>

    </div>
  );
};

export default Contract;
