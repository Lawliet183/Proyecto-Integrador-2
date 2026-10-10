import { useState, useEffect } from 'react';
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
  
  const handleExportarExcel = async () => {
    // Validar que haya datos
    if (!pacientes || pacientes.length === 0) {
      alert("No hay pacientes para exportar");
      return;
    }

    // Importacion dinamica de la libreria
    const XLSX = await import('xlsx');

    // Crear el arreglo de objetos con los nombres exactos de las columnas
    const datos = pacientes.map(p => ({
      "ID Paciente": p.id,
      "Nombre Completo": `${p.nombres} ${p.apellidos}`,
      "Edad": p.edad,
      "Sexo Biológico": p.sexoBiologico,
      "Correo Electrónico": p.correo,
      "Fecha de Registro": p.fechaRegistro ? new Date(p.fechaRegistro).toLocaleDateString() : "N/A"
    }));

    // Convertir el JSON a una hoja de trabajo de Excel
    const worksheet = XLSX.utils.json_to_sheet(datos);

    // Auto expandir columnas: Definimos el ancho (en caracteres) de cada columna
    const anchosDeColumna = [
      { wch: 36 }, // A: ID Paciente
      { wch: 35 }, // B: Nombre Completo
      { wch: 10 }, // C: Edad
      { wch: 15 }, // D: Sexo Biológico
      { wch: 30 }, // E: Correo Electrónico
      { wch: 20 }  // F: Fecha de Registro
    ];
    worksheet['!cols'] = anchosDeColumna;

    // Crear el libro de Excel y añadir la hoja
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Directorio Pacientes");

    // Construir un timestamp local y seguro para nombres de archivo en Windows
    const ahora = new Date();
    const año = ahora.getFullYear();
    const mes = String(ahora.getMonth() + 1).padStart(2, '0');
    const dia = String(ahora.getDate()).padStart(2, '0');
    const horas = String(ahora.getHours()).padStart(2, '0');
    const minutos = String(ahora.getMinutes()).padStart(2, '0');
    const segundos = String(ahora.getSeconds()).padStart(2, '0');

    // Formato final: AAAA-MM-DD_hh-mm-ss
    const timestampLocal = `${año}-${mes}-${dia}_${horas}-${minutos}-${segundos}`;

    // Generar y descargar el archivo .xlsx
    XLSX.writeFile(workbook, `Directorio_Pacientes_${timestampLocal}.xlsx`);
  };

  
  return (
    <DashboardContainer>
      <Header>
        <h2>Panel de Control - Pacientes Registrados</h2>
        
        <ButtonGroup>
          <ExportButton onClick={handleExportarExcel}>
            Descargar Excel (.xlsx)
          </ExportButton>

          <LogoutButton onClick={handleCerrarSesion}>
            Cerrar Sesión
          </LogoutButton>
        </ButtonGroup>
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


// Estilos usando styled-components
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

const ExportButton = styled(ActionButton)`
  background-color: #28a745; /* Verde estilo Excel */
  
  &:hover {
    background-color: #218838;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;


export default AdminPacientes;