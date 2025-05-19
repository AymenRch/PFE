import React from 'react';
import PropTypes from 'prop-types';
import './ProjectCard.css';

const OwnerCard = ({ 
  title, 
  description, 
  image = 'https://via.placeholder.com/300x200', 
  location = 'Location not specified', 
  price = 'Price not specified',
  onClick,
  onClick2
}) => {
  return (
    <div className="project-card" style={{cursor:"pointer"}} onClick={onClick}>
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
          <div className="buttons" style={{display:"flex",alignItems:"centre",justifyContent:"space-around",gap:"10px"}}>
          <button className="btn-secondary" onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}>View Details</button>
           <button className="btn-secondary btn-canc" style={{background : "red" , color: "white"}} onClick={(e) => {
            e.stopPropagation();
            onClick2();
          }}>Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
};

OwnerCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  image: PropTypes.string,
  location: PropTypes.string,
  price: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  onClick2: PropTypes.func.isRequired

};

export default OwnerCard;
