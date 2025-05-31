import React, { useState, useEffect } from 'react';
import './Profile.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import OwnerCard from '../components/ownerCard';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({}); // Changed from null
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');

        const res = await axios.get(`http://localhost:9000/auth/profile/${token}`);
        setUser(res.data.user);
        setStats(res.data.stats || {}); // Safe default
       // console.log("Fetched stats:", res.data.stats);

        const projRes = await axios.get('http://localhost:9000/proj/mine', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProjects(projRes.data || []);
      } catch (err) {
        setError(err.response?.data?.error || err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <div className="profile-page"><div className="loading">Loading profile...</div></div>;
  if (error) return <div className="profile-page"><div className="error">{error}</div></div>;
  if (!user) return null;

  const avatar = user.ProfilePicture ? `http://localhost:9000/${user.ProfilePicture}` : '/default-avatar.png';
  const joinDate = user.registerDate ? new Date(user.registerDate).toLocaleDateString() : '';

  return (
    <div className="profile-page">
      <div className="profile-banner" />

      <div className="profile-card">
        <img src={avatar} alt="User Avatar" className="profile-avatar-lg" />
        <div className="profile-info-main">
          <div className="profile-header-row">
            <h1 className="profile-name-lg">{user.name || 'Unnamed User'}</h1>
            <span className="profile-username">{user.email}</span>
          </div>
          <p className="profile-bio">{user.bio || 'Full-stack developer passionate about building useful applications.'}</p>
          <div className="profile-details-row">
            <span className="profile-detail">
              <i className="fas fa-map-marker-alt" />Location: {user.adress || 'Unknown Location'}
            </span>
            <span className="profile-detail">
              <i className="fas fa-briefcase" />joined: {joinDate || 'Today'}
            </span>
            <span className="profile-detail">
              <i className="fas fa-briefcase" />Phone: {user.phone ? `(+213) ${user.phone}` : 'Phone Not Provided'}
            </span>
          </div>
        </div>
      </div>

      <div className="profile-stats-section">
        <h2 className="profile-stats-title">Statistics</h2>
        <div className="profile-stats-grid">

          <div className="profile-stat-card">
            <div className="profile-stat-value">{stats.activeProjects ?? 'N/A'}</div>
            <div className="profile-stat-label">Active Projects</div>
          </div>

          <div className="profile-stat-card">
            <div className="profile-stat-value">{stats.totalInvestmentAmount ?? 'N/A'}</div>
            <div className="profile-stat-label">Total Investment</div>
          </div>

          <div className="profile-stat-card">
            <div className="profile-stat-value">{stats.totalReturns ?? 'N/A'}</div>
            <div className="profile-stat-label">Total Returns</div>
          </div>

          <div className="profile-stat-card">
            <div className="profile-stat-value">{stats.activeInvestments ?? 'N/A'}</div>
            <div className="profile-stat-label">Active Investments</div>
          </div>

          <div className="profile-stat-card">
            <div className="profile-stat-value">{stats.completedInvestements ?? 'N/A'}</div>
            <div className="profile-stat-label">Completed Investments</div>
          </div>

          <div className="profile-stat-card">
            <div className="profile-stat-value">{stats.totalFundingRaised ?? 'N/A'}</div>
            <div className="profile-stat-label">Total Funding Raised</div>
          </div>

          <div className="profile-stat-card">
            <div className="profile-stat-value">{stats.completedprojects ?? 'N/A'}</div>
            <div className="profile-stat-label">Completed Projects</div>
          </div>

        </div>
      </div>

      <div className="profile-projects-section">
        <h2 className="profile-projects-title">Projects</h2>
        {projects.map(project => (
          <OwnerCard 
            key={project.id}
            title={project.title}
            description={project.description}
            image={project.picture ? `http://localhost:9000${project.picture}` : 'https://via.placeholder.com/300x200'}
            location={project.location}
            price={`$${project.fundingGoal}`}
            status={project.projectStatus}
            type={project.type}
            duration={project.duration}
            onClick={() => navigate(`/projects/${project.id}`)}
            onClick2={() => {
              axios.delete(`http://localhost:9000/proj/delete/${project.id}`).then(() => {
                setProjects(prev => prev.filter(p => p.id !== project.id));
              });
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Profile;
