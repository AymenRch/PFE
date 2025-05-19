import React, { useState, useEffect  } from 'react';
import './Profile.css';
import axios from 'axios';
import ProjectCard from '../components/ProjectCard';
import { useNavigate , useParams} from 'react-router-dom';

const User = () => {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [stats, setStats] = useState({});
  const {id} = useParams()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');

        await axios.get(`http://localhost:9000/auth/owner/${id}`).then((res)=>{
          if (res.data.error) {
            throw new Error(res.data.error);
          }
          setUser(res.data.user[0]);
          setStats(res.data.stats[0] || {})
        })
       

        const projRes = await axios.get(`http://localhost:9000/proj/him/${id}`);
        setProjects(projRes.data || []);
      } catch (err) {
        setError(err.response?.data?.error || err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (loading) return <div className="profile-page"><div className="loading">Loading profile...</div></div>;
  if (error) return <div className="profile-page"><div className="error">{error}</div></div>;
  if (!user) return null;

  // Fallbacks and formatting
  const avatar = user.ProfilePicture ? `http://localhost:9000/${user.ProfilePicture}` : '/default-avatar.png';
  const joinDate = user.registerDate ? new Date(user.registerDate).toLocaleDateString() : '';
 

  return (
    <div className="profile-page">
      <div className="profile-banner" />

      <div className="profile-card">
        <img
          src={avatar}
          alt="User Avatar"
          className="profile-avatar-lg"
        />
        <div className="profile-info-main">
          <div className="profile-header-row">
            <h1 className="profile-name-lg">{user.name || 'Unnamed User'}</h1>
            <span className="profile-username">{user.email}</span>
          </div>
          <p className="profile-bio">{user.bio || 'Full-stack developer passionate about building useful applications.'}</p>
          <div className="profile-details-row">
            <span className="profile-detail">
              <i className="fas fa-map-marker-alt" />Locactio:  {user.adress || 'Unknown Location'}
            </span>
            <span className="profile-detail">
              <i className="fas fa-briefcase" />Joined : {joinDate || 'Software Engineer'}
            </span>
            <span className="profile-detail">
              <i className="fas fa-briefcase" /> {"Phone: (+213) " + user.phone || 'Software Engineer'}
            </span>
          </div>
        </div>
      </div>

      <div className="profile-stats-section">
        <h2 className="profile-stats-title">Statistics</h2>
        <div className="profile-stats-grid">
         
          <div className="profile-stat-card">
              <div className="profile-stat-value">{stats.activeProjects ?? null}</div>
              <div className="profile-stat-label">Active Projects</div>
            </div> 

            <div className="profile-stat-card">
              <div className="profile-stat-value">{stats.totalInvestmentAmount ?? null}</div>
              <div className="profile-stat-label">Total Investment</div>
            </div>

            <div className="profile-stat-card">
              <div className="profile-stat-value">{stats.totalReturns ?? null}</div>
              <div className="profile-stat-label">Total Returns</div>
            </div>

            <div className="profile-stat-card">
              <div className="profile-stat-value">{stats.activeInvestments ?? null}</div>
              <div className="profile-stat-label">Active Investements</div>
            </div>

            <div className="profile-stat-card">
              <div className="profile-stat-value">{stats.completedInvestements ?? null}</div>
              <div className="profile-stat-label">Completed Investements</div>
            </div>

            <div className="profile-stat-card">
              <div className="profile-stat-value">{stats.totalFundingRaised ?? null}</div>
              <div className="profile-stat-label">Total Funding Raised</div>
            </div>

            <div className="profile-stat-card">
              <div className="profile-stat-value">{stats.completedprojects ?? null}</div>
              <div className="profile-stat-label">Completed Projects</div>
            </div>
        </div>
      </div>

      <div className="profile-projects-section">
        <h2 className="profile-projects-title">Projects</h2>
        {projects.map(project => (
                 <ProjectCard 
                   key={project.id}
                   title={project.title}
                   description={project.description}
                   image={project.picture ? `http://localhost:9000${project.picture}` : 'https://via.placeholder.com/300x200'}
                   location={project.location}
                   price={`$${project.fundingGoal}`}
                   status={project.projectStatus}
                   type={project.type}
                   duration={project.duration}
                   onClick={() => {
                     console.log('Navigating to project:', project.id);
                     navigate(`/projects/${project.id}`);
                   }}
                   onClick2={()=>{
                    axios.delete(`http://localhost:9000/proj/delete/${project.id}`)
                   }}
                 />
               ))}
      </div>
    </div>
  );
};

export default User;
