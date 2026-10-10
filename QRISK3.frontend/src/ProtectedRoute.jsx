import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';


const ProtectedRoute = ({ requiredRole }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);

    // Si la ruta exige un rol (ej. "Administrador") y el usuario no lo es
    if (requiredRole && decoded.rol !== requiredRole) {
      // Lo expulsamos a su vista predeterminada
      return <Navigate to="/" replace />;
    }
  } catch (error) {
    localStorage.removeItem('token');
    return <Navigate to="/login" replace />;
  }

  
  // Si pasa todas las validaciones, renderiza la vista
  return <Outlet />;
};


export default ProtectedRoute;