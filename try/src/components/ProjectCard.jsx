import React from 'react';
import PropTypes from 'prop-types';
import './ProjectCard.css';

const ProjectCard = ({ 
  title, 
  description, 
  image = 'https://via.placeholder.com/300x200', 
  location = 'Location not specified', 
  price = 'Price not specified',
  onClick,
}) => {
  return (
    <div className="project-card" onClick={onClick}>
      <div className="project-card-image">
        <img src={image} alt={title} />
      </div>
      <div className="project-card-content">
        <div className="project-card-header">
          <h3>{title}</h3>
          <p className="project-location">{location}</p>
        </div>
        <p className="project-description">{description}</p>
        <div className="project-card-footer">
          <span className="project-price">{price}</span>
          <button className="btn-secondary" onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}>View Details</button>
        </div>
      </div>
    </div>
  );
};

ProjectCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  image: PropTypes.string,
  location: PropTypes.string,
  price: PropTypes.string,
  onClick: PropTypes.func.isRequired
};

export default ProjectCard;
