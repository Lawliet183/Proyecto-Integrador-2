import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GlobalStyle } from './GlobalStyles';

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


const App = () => {
  return (
    <Router>
      <GlobalStyle />
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
          <Route path="/dashboard" element={<PacienteDashboard />} />

          <Route path="/evaluacion" element={<EvaluationForm />} />

          <Route path="/historial" element={<Historial />} />

          <Route path="/evaluacion/detalle/:id" element={<EvaluacionDetalle />} />
        </Route>


        {/* Rutas exclusivas del Administrador */}
        <Route element={<ProtectedRoute requiredRole="Administrador" />}>
          <Route path="/admin/pacientes" element={<AdminPacientes />} />

          <Route path="/admin/historial/:pacienteId" element={<Historial />} />

          <Route path="/admin/evaluacion/detalle/:id" element={<EvaluacionDetalle />} />
        </Route>
      </Routes>
    </Router>
  );
};


export default App;