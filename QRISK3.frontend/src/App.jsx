import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Importación de las vistas
import Login from './Login';
import Register from './Register';
import EvaluationForm from './EvaluationForm';


const devServerUrl = import.meta.env.VITE_DEV_SERVER_URL;

const App = () => {
  useEffect(() => {
    async function initialPing() {
      await fetch(`${devServerUrl}/api/auth/ping`);
    }

    initialPing();
  }, []);
  
  return (
    <Router>
      <Routes>
        {/* Redirección inicial hacia el login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Rutas de Autenticación */}
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />

        {/* Ruta Principal del Sistema */}
        <Route path="/evaluacion" element={<EvaluationForm />} />

        {/* Manejo de rutas no encontradas (404) */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;