import React from 'react';
import Widget from '../Widget';

const AdminDashboard = () => {
  return (
    <div className="dashboard-grid">
      <Widget title="Active Tasks" content="12" />
      <Widget title="Machine Status" content="3 Operational, 1 Offline" />
      <Widget title="Recent Activity" content="User 'Alice' completed Task T001" />
      <Widget title="Inventory Levels" content="Low stock on 2 items" />
    </div>
  );
};

export default AdminDashboard;
