import React from 'react';
import Widget from '../Widget';

const EmployeeDashboard = () => {
  return (
    <div className="dashboard-grid">
      <Widget title="My Assigned Tasks" content="2" />
      <Widget title="My Machine Status" content="'CNC Mill' is Operational" />
      <Widget title="My Recent Activity" content="Completed Task T003" />
    </div>
  );
};

export default EmployeeDashboard;
