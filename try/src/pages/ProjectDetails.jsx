import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './ProjectDetails.css';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const token = localStorage.getItem('token');


  const fetchProject = async () => {
    try {
     

      const response = await axios.get(`http://localhost:9000/proj/one/${id}`);

      console.log('Project response:', response.data); // Debug log

      if (response.status === 200) {
        // Check if response.data is an array and get the first item
        const projectData = Array.isArray(response.data) ? response.data[0] : response.data;
        console.log('Project data:', projectData); // Debug log
        setProject(projectData);
        
        // Fetch user data
        const userResponse = await axios.get(`http://localhost:9000/proj/owner/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (userResponse.status === 200) {
          console.log('User response:', userResponse.data); // Debug log
          setUser(userResponse.data);
        }
      } else {
        throw new Error('Failed to fetch project');
      }
    } catch (error) {
      console.error('Error fetching project:', error);
      setError(error.response?.data?.error || 'Failed to load project details');
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    fetchProject();
  }, [id]);

const handleMakeOffer = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Please log in to make an offer');
    return;
  }

  try {
    const cardRes = await axios.get(`http://localhost:9000/auth/checkCard/${token}`);

    // Si la carte existe, on tente de faire une offre
    const offerRes = await axios.post(
      `http://localhost:9000/request/make/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (offerRes.status === 201) {
      alert(offerRes);
      navigate('/dashboard');
    }else {
      alert('Failed to make offer');
    }

  } catch (error) {
    // Axios place la réponse dans error.response
    if (error.response?.status === 404) {
      alert('Please add a card to make an offer');
      navigate('/payment');
    } else {
      console.error('Error making offer:', error);
      alert('Failed to make offer.');
    }
  }
};



  

  if (loading) {
    return <div className="loading">Loading project details...</div>;
  }

  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
        <button 
          className="retry-btn"
          onClick={() => {
            setError(null);
            setLoading(true);
            fetchProject();
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  if (!project) {
    return <div className="error">Project not found</div>;
  }

  return (
    <div className="project-details-flex-container">
      <div className="project-details-image-col">
        <img 
          src={project.picture ? `http://localhost:9000${project.picture}` : 'https://via.placeholder.com/600x400'} 
          alt={project.title} 
          className="project-details-image-large" 
        />
      </div>
      <div className="project-details-info-col">
        {user && (
          <Link to={token ? `/user/${user.id}` : `/owner/${user.id}`} className="project-details-user-profile">
            <img 
              src={user.ProfilePicture ? `http://localhost:9000/${user.ProfilePicture}` : 'https://via.placeholder.com/50x50'} 
              alt={user.name} 
              className="project-details-user-avatar" 
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/50x50';
              }}
            />
            <div>
              <div className="project-details-user-name">{user.name}</div>
              <div className="project-details-user-username">{user.email}</div>
            </div>
          </Link>
        )}
        
        <h1 className="project-details-title">{project.title}</h1>
        <div className="project-details-meta">
          <span>{project.location}</span> | 
          <span>${project.fundingGoal}</span> | 
          <span>{project.equetyPercentage}% equity</span>
        </div>
        <p className="project-details-description">{project.description}</p>
        <div className="project-details-extra">
          <span><strong>Type:</strong> {project.type}</span>
          <span><strong>Status:</strong> {project.projectStatus}</span>
          <span>
           <strong>Duration:</strong>{' '}
           to {project.duration ? new Date(project.duration).toLocaleDateString() : ''} 
          </span>
          <span><strong>Revenue Share:</strong> {project.revenueSharePercentage}%</span>
        </div>
        <button className="make-offer-btn" onClick={handleMakeOffer}>Accept The Terms</button>
        <Link className='counter' to={`/conter/${id}`}>Make a Counter Offer</Link>
      </div>
    </div>

  );
};

export default ProjectDetails; 