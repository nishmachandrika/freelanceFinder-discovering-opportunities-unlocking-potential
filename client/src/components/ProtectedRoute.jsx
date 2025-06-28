import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import { GeneralContext, GeneralContextProvider } from '../context/GeneralContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { auth } = useContext(GeneralContext);
  const userType = sessionStorage.getItem('usertype');
  
  if (!auth?.email || !allowedRoles.includes(userType)) {
    return <Navigate to="/authenticate" replace />;
  }
  return children;
}
