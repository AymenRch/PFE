import React, { useEffect, useState } from 'react';
import ProjectCard from './ProjectCard';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Features.css';

const Features = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
       
        const response = await axios.get('http://localhost:9000/proj/all', );
        if (response.status === 200) {
          setProjects(response.data);
        } else {
          throw new Error('Failed to fetch projects');
        }
      } catch (err) {
        setError(err.response?.data?.error || err.message || 'Failed to fetch projects');
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (loading) return <div className="features-loading">Loading projects...</div>;
  if (error) return <div className="features-error">{error}</div>;

  return (
    <section className="features-section" id="features">
      <div className="features-row">
        {projects.slice(0, 3).map(project => (
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
            onClick={() => navigate(`/AllProjects/${project.id}`)}
          />
        ))}
      </div>
      <div className="features-view-all">
        <Link to="/AllProjects" className="features-view-all-link">View All Projects →</Link>
      </div>
    </section>
  );
};

export default Features;