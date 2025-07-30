import React from 'react';
import Widget from '../Widget';

const ManagerDashboard = () => {
  return (
    <div className="dashboard-grid">
      <Widget title="Tasks for Approval" content="3" />
      <Widget title="Team's Active Tasks" content="8" />
      <Widget title="Team Activity" content="'Bob' started Task T002" />
    </div>
  );
};

export default ManagerDashboard;
