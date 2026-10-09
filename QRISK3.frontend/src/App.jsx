import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Importación de las vistas
import Login from './Login';
import Register from './Register';
import EvaluationForm from './EvaluationForm';

// Importación de los componentes de seguridad (Asegúrate de crear estos archivos)
import { AuthProvider } from './AuthContext';
import ProtectedRoute from './ProtectedRoute';

const devServerUrl = import.meta.env.VITE_DEV_SERVER_URL;

const App = () => {
  useEffect(() => {
    async function initialPing() {
      try {
        await fetch(`${devServerUrl}/api/auth/ping`);
      } catch (error) {
        console.error("Error al contactar con el servidor:", error);
      }
    }

    initialPing();
  }, []);
  
  return (
    <Router>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />

        {/* Redirección por defecto para la raíz */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Rutas Protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route path="/evaluacion" element={<EvaluationForm />} />
          {/* <Route path="/historial" element={<Historial />} /> */}

          {/* Puedes agregar aquí cualquier otra ruta que requiera autenticación */}
        </Route>
      </Routes>
    </Router>
  );
};

export default App;