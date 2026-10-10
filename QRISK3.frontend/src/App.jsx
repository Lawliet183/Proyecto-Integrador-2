import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Importación de las vistas
import Login from './Login';
import Register from './Register';
import EvaluationForm from './EvaluationForm';
import AdminPacientes from './AdminPacientes';
import Historial from './Historial';
import PacienteDashboard from './PacienteDashboard';
import EvaluacionDetalle from './EvaluacionDetalle';

// Importación de los componentes de seguridad
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';

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
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />
        </Route>

        {/* Redirección por defecto para la raíz */}
        <Route path="/" element={<Navigate to="/login" replace />} />


        {/* Rutas exclusivas del Paciente */}
        <Route element={<ProtectedRoute requiredRole="Paciente" />}>
          {/* Agregamos el dashboard */}
          <Route path="/dashboard" element={<PacienteDashboard />} />
        
          <Route path="/evaluacion" element={<EvaluationForm />} />

          {/* El paciente ve su historial sin pasar ID */}
          <Route path="/historial" element={<Historial />} />
          
          <Route path="/evaluacion/detalle/:id" element={<EvaluacionDetalle />} />
        </Route>


        {/* Rutas exclusivas del Administrador */}
        <Route element={<ProtectedRoute requiredRole="Administrador" />}>
          <Route path="/admin/pacientes" element={<AdminPacientes />} />

          {/* El admin ve el historial pasando el ID en la URL */}
          <Route path="/admin/historial/:pacienteId" element={<Historial />} />
          
          <Route path="/admin/evaluacion/detalle/:id" element={<EvaluacionDetalle />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;