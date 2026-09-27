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
    <AuthProvider>
      <Router>
        <Routes>
          {/* Redirección inicial hacia el login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Rutas de Autenticación (Públicas) */}
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />

          {/* Ruta Principal del Sistema (Protegida para Pacientes) */}
          <Route 
            path="/evaluacion" 
            element={
              <ProtectedRoute allowedRoles={['Paciente']}>
                <EvaluationForm />
              </ProtectedRoute>
            } 
          />

          {/* ESPACIO PARA RUTAS DE ADMINISTRADOR */}
          {/* Descomenta y ajusta estas rutas cuando crees las vistas del Admin */}
          {/* 
          <Route 
            path="/admin/pacientes" 
            element={
              <ProtectedRoute allowedRoles={['Administrador']}>
                <AdminPacientesCRUD /> 
              </ProtectedRoute>
            } 
          />
          */}

          {/* Manejo de rutas no encontradas (404) */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;