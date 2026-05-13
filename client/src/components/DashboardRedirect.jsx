import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const DashboardRedirect = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  switch (user.role) {
    case 'admin':
      return <Navigate to="/dashboard/admin" replace />;
    case 'owner':
      return <Navigate to="/dashboard/owner" replace />;
    case 'user':
    default:
      return <Navigate to="/dashboard/user" replace />;
  }
};

export default DashboardRedirect;
