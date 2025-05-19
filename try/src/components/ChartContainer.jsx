import React from 'react';
import './ChartContainer.css';

const ChartContainer = ({ title, children, filter }) => {
  return (
    <div className="chart-container">
      <div className="chart-header">
        <h3>{title}</h3>
        {filter && <div className="chart-filter">{filter}</div>}
      </div>
      <div className="chart-content">
        {children}
      </div>
    </div>
  );
};

export default ChartContainer;
