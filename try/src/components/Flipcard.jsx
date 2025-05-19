import React from 'react';
import './FlipCard.css';

const FlipCard = () => {
  return (
    <div className="flip-card">
      <div className="flip-card-inner">
        {/* Front Side */}
        <div className="flip-card-front">
          <p className="heading">MASTERCARD</p>

          {/* Mastercard Logo */}
          <svg className="logo" xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 48 48">
            <path fill="#ff9800" d="M32 10A14 14 0 1 0 32 38A14 14 0 1 0 32 10Z" />
            <path fill="#d50000" d="M16 10A14 14 0 1 0 16 38A14 14 0 1 0 16 10Z" />
            <path fill="#ff3d00" d="M18,24c0,4.755,2.376,8.95,6,11.48c3.624-2.53,6-6.725,6-11.48s-2.376-8.95-6-11.48 C20.376,15.05,18,19.245,18,24z" />
          </svg>

          {/* Chip */}
          <svg className="chip" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="30" height="30">
            <rect width="50" height="35" rx="5" ry="5" fill="#c0c0c0" />
            <line x1="0" y1="10" x2="50" y2="10" stroke="#999" strokeWidth="2" />
            <line x1="0" y1="25" x2="50" y2="25" stroke="#999" strokeWidth="2" />
          </svg>

          {/* Contactless */}
          <svg className="contactless" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
            <path fill="white" d="M7.05 3.05a7 7 0 0 1 0 9.9l1.414 1.414a9 9 0 0 0 0-12.728L7.05 3.05zm4.243 4.243a1 1 0 0 1 0 1.414l1.414 1.414a3 3 0 0 0 0-4.243l-1.414 1.415z" />
          </svg>
        </div>

        {/* Back Side */}
        <div className="flip-card-back">
          <p className="heading">CARD BACK</p>
          <p className="cvv">CVV: ***</p>
        </div>
      </div>
    </div>
  );
};

export default FlipCard;
