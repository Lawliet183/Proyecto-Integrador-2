import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const devServerUrl = import.meta.env.VITE_DEV_SERVER_URL;

const AdminPacientes = () => {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPacientes = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`${devServerUrl}/api/admin/pacientes`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const result = await response.json().catch(() => null);

        if (response.ok && result.success) {
          setPacientes(result.data);
        } else {
          setError(result?.message || 'No se pudieron cargar los registros. Verifica que tengas los permisos necesarios.');
        }
      } catch (err) {
        setError('Error de conexión. Verifica que el servidor principal esté en línea y vuelve a intentarlo.');
      } finally {
        setLoading(false);
      }
    };

    fetchPacientes();
  }, []);

  const handleCerrarSesion = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <DashboardContainer>
      <Header>
        <h2>Panel de Control - Pacientes Registrados</h2>
        <LogoutButton onClick={handleCerrarSesion}>Cerrar Sesión</LogoutButton>
      </Header>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <TableContainer>
        {loading ? (
          <p>Cargando pacientes...</p>
        ) : (
          <Table>
            <thead>
              <tr>
                <th>Nombre Completo</th>
                <th>Edad</th>
                <th>Sexo Biológico</th>
                <th>Correo</th>
                <th>Fecha de Registro</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pacientes.map(p => (
                <tr key={p.id}>
                  <td>{p.nombres} {p.apellidos}</td>
                  <td>{p.edad} años</td>
                  <td>{p.sexoBiologico}</td>
                  <td>{p.correo}</td>
                  <td>{new Date(p.fechaRegistro).toLocaleDateString()}</td>
                  <td>
                    {/* Este botón enviará el ID del paciente a la ruta del historial cuando la construyamos */}
                    <ActionButton onClick={() => navigate(`/admin/historial/${p.id}`)}>
                      Ver Evaluaciones
                    </ActionButton>
                  </td>
                </tr>
              ))}
              {pacientes.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center' }}>No hay pacientes registrados aún.</td>
                </tr>
              )}
            </tbody>
          </Table>
        )}
      </TableContainer>
    </DashboardContainer>
  );
};

// --- Estilos usando styled-components ---
const DashboardContainer = styled.div`
  padding: 40px;
  max-width: 1200px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  border-bottom: 2px solid #eaeaea;
  padding-bottom: 10px;
`;

const ErrorMessage = styled.p`
  color: #d93025;
  background: #fce8e6;
  padding: 10px;
  border-radius: 4px;
`;

const TableContainer = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th, td {
    padding: 15px;
    text-align: left;
    border-bottom: 1px solid #eaeaea;
  }

  th {
    background-color: #f8f9fa;
    color: #333;
    font-weight: 600;
  }

  tr:hover {
    background-color: #f1f3f5;
  }
`;

const ActionButton = styled.button`
  background-color: #1a73e8;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  transition: background 0.2s;

  &:hover {
    background-color: #1557b0;
  }
`;

const LogoutButton = styled(ActionButton)`
  background-color: #dc3545;
  &:hover { background-color: #c82333; }
`;

export default AdminPacientes;