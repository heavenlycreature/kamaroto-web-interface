import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../App';

const GuestRoute = ({ children }) => {
    const { isLoggedIn, user } = useAuth();
  const location = useLocation();

  if (isLoggedIn && user) {
    if (user.status === 'pending' || user.status === 'rejected') {
      return <Navigate to="/status" replace state={{ from: location }} />;
    }

    if (user.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace state={{ from: location }} />;
    } else if (user.role === 'co') {
      return <Navigate to="/captain/profile" replace state={{ from: location }} />;
    } else if (user.role === 'mitra') {
      return <Navigate to="/mitra/profile" replace state={{ from: location }} />;
    }

    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return children;
};

export default GuestRoute;