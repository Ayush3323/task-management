import React from 'react';
import './Widget.css';

const Widget = ({ title, children }) => {
  return (
    <div className="widget">
      <div className="widget-header">
        <h3 className="widget-title">{title}</h3>
      </div>
      <div className="widget-content">
        {children}
      </div>
    </div>
  );
};

export default Widget;
