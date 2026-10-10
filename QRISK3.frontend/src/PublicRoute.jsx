import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';


const PublicRoute = () => {
  const token = localStorage.getItem('token');

  if (token) {
    try {
      const decoded = jwtDecode(token);

      // Si el usuario ya esta autenticado, lo enviamos a su panel
      if (decoded.rol === 'Administrador') {
        return <Navigate to="/admin/pacientes" replace />;
      } else {
        return <Navigate to="/dashboard" replace />;
      }
    } catch (error) {
      // Si el token existe pero está corrupto o expirado, lo limpiamos
      // y permitimos que el usuario vea el Login
      localStorage.removeItem('token');
    }
  }

  // Si no hay token, mostramos las rutas hijas (Login o Registro)
  return <Outlet />;
};


export default PublicRoute;