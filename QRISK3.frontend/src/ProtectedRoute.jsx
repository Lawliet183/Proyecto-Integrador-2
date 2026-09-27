import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.rol)) {
   
    return <Navigate to={user.rol === 'Paciente' ? '/evaluacion' : '/dashboard'} replace />;
  }

  return children;
};

export default ProtectedRoute;