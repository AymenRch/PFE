import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Filter } from 'lucide-react';
import ProjectCard from '../components/ProjectCard';
import axios from 'axios';
import './Projects.css';

const algerianWilayas = [
  "Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Béjaïa", "Biskra", "Béchar", "Blida", "Bouira",
  "Tamanrasset", "Tébessa", "Tlemcen", "Tiaret", "Tizi Ouzou", "Algiers", "Djelfa", "Jijel", "Sétif", "Saïda",
  "Skikda", "Sidi Bel Abbès", "Annaba", "Guelma", "Constantine", "Médéa", "Mostaganem", "M'Sila", "Mascara", "Ouargla",
  "Oran", "El Bayadh", "Illizi", "Bordj Bou Arréridj", "Boumerdès", "El Tarf", "Tindouf", "Tissemsilt", "El Oued", "Khenchela",
  "Souk Ahras", "Tipaza", "Mila", "Aïn Defla", "Naâma", "Aïn Témouchent", "Ghardaïa", "Relizane", "Timimoun", "Bordj Badji Mokhtar",
  "Ouled Djellal", "Béni Abbès", "In Salah", "In Guezzam", "Touggourt", "Djanet", "El M'Ghair", "El Meniaa"
];

const priceRanges = [
  "All Prices",
  "Under 100,000 DA",
  "10,0000 DA - 250,000 DA",
  "25,0000 DA - 500,000 DA",
  "50,0000DA - 1,000,000 DA",
  "Over 1,000,000 DA"
];

const businessModels = [
  "All Models",
  "partnership",
  "revenue share"
];

const Projects = () => {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [locationFilter, setLocationFilter] = useState("All Locations");
  const [priceFilter, setPriceFilter] = useState("All Prices");
  const [businessModelFilter, setBusinessModelFilter] = useState("All Models");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleCreateProject = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/auth');
      return;
    }
    navigate('/create-project');
  };

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      

      const response = await axios.get('http://localhost:9000/proj/all', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        setProjects(response.data);
      } else {
        throw new Error('Failed to fetch projects');
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError(error.response?.data?.error || error.message || 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const filteredProjects = projects.filter(project => {
    const matchesLocation = locationFilter === "All Locations" || project.location === locationFilter;
    
    const priceValue = project.fundingGoal || 0;
    const matchesPrice = priceFilter === "All Prices" || 
      (priceFilter === "Under 100,000 DA" && priceValue < 100000) ||
      (priceFilter === "100,000 DA - 250,000 DA" && priceValue >= 100000 && priceValue <= 250000) ||
      (priceFilter === "250,000 DA - 500,000 DA" && priceValue > 250000 && priceValue <= 500000) ||
      (priceFilter === "500,000 DA - 1,000,000 DA" && priceValue > 500000 && priceValue <= 1000000) ||
      (priceFilter === "Over 1,000,000 DA" && priceValue > 1000000);
    
    const matchesBusinessModel = businessModelFilter === "All Models" || project.model === businessModelFilter;

    return matchesLocation && matchesPrice && matchesBusinessModel;
  });

  if (loading) {
    return <div className="loading">Loading projects...</div>;
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
            fetchProjects();
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="projects-container">
      <div className="projects-header">
        <div className="header-left">
          <h1>Projects</h1>
          <span className="project-count">{filteredProjects.length} Total</span>
        </div>
        
        <div className="header-actions">
          <button 
            className="filter-btn"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={18} />
            <span>Filter</span>
          </button>

          <button 
            className="create-btn"
            onClick={handleCreateProject}
          >
            <Plus size={18} />
            <span>Create New Project</span>
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="filters-container">
          <div className="filter-group">
            <label>Location</label>
            <select 
              value={locationFilter} 
              onChange={(e) => setLocationFilter(e.target.value)}
              className="filter-select"
            >
              <option value="All Locations">All Locations</option>
              {algerianWilayas.map(wilaya => (
                <option key={wilaya} value={wilaya}>{wilaya}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Price Range</label>
            <select 
              value={priceFilter} 
              onChange={(e) => setPriceFilter(e.target.value)}
              className="filter-select"
            >
              {priceRanges.map(range => (
                <option key={range} value={range}>{range}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Business Model</label>
            <select 
              value={businessModelFilter} 
              onChange={(e) => setBusinessModelFilter(e.target.value)}
              className="filter-select"
            >
              {businessModels.map(model => (
                <option key={model} value={model}>{model}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div className="projects-grid">
        {filteredProjects.map(project => (
          <ProjectCard 
            key={project.id}
            title={project.title}
            description={project.description}
            image={project.picture ? `http://localhost:9000${project.picture}` : 'https://via.placeholder.com/300x200'}
            location={project.location}
            price={`${project.fundingGoal} DA`}
            status={project.projectStatus}
            type={project.type}
            duration={project.duration}
            onClick={() => {
              console.log('Navigating to project:', project.id);
              navigate(`/projects/${project.id}`);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Projects;
