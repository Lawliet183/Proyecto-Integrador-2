import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // Verificamos si existe el token en el almacenamiento local
  const token = localStorage.getItem('token');

  if (!token) {
    // replace=true evita que el usuario pueda usar el botón "Atrás" del 
    // navegador para volver a la ruta bloqueada, evitando bucles infinitos.
    return <Navigate to="/login" replace />;
  }

  // Si el token existe, permitimos que se rendericen los componentes hijos
  return <Outlet />;
};

export default ProtectedRoute;