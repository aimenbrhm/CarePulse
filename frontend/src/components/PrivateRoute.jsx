import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const { token, userData } = useContext(AppContext);
  if (!token || !userData) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default PrivateRoute;
