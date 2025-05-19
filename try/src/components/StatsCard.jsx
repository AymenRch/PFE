import React from 'react';
import './StatsCard.css';

const StatsCard = ({ title, value, icon: Icon, trend, color = '#7665F1', iconBg}) => {
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ backgroundColor: iconBg }}>
        <Icon size={28} color={color} />
      </div>
      <div className="stat-content">
        <h3>{title}</h3>
        <div className="stat-value">{value}</div>
        {trend && <div className={`stat-trend${trend.positive ? ' positive' : trend.negative ? ' negative' : ''}`}>{trend.label || trend}</div>}
      </div>
    </div>
  );
};

export default StatsCard;
