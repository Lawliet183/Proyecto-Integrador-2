import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const devServerUrl = import.meta.env.VITE_DEV_SERVER_URL;

const Historial = () => {
  // Detecta si hay un ID en la URL (Modo Admin)
  const { pacienteId } = useParams();
  const navigate = useNavigate();

  const [evaluaciones, setEvaluaciones] = useState([]);
  const [nombrePaciente, setNombrePaciente] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isAdminMode = !!pacienteId;

  useEffect(() => {
    const fetchHistorial = async () => {
      const token = localStorage.getItem('token');

      // Si es admin, usa el endpoint con ID. Si es paciente, usa el endpoint protegido por token.
      const endpoint = isAdminMode
        ? `${devServerUrl}/api/admin/historial/${pacienteId}`
        : `${devServerUrl}/api/evaluacion/historial`;

      try {
        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const result = await response.json().catch(() => null);

        if (response.ok && result?.success) {
          setEvaluaciones(result.data);
          if (result.nombrePaciente) {
            setNombrePaciente(result.nombrePaciente);
          }
        } else {
          // Usamos el mensaje seguro de C#, o uno genérico amigable si no hay JSON
          setError(result?.message || 'No se pudo cargar la información de tu historial. Intenta recargar la página.');
        }
      } catch (err) {
        // Mensaje empático en caso de desconexión total
        setError('No pudimos conectar con el servidor médico. Por favor, verifica tu conexión a internet o intenta más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchHistorial();
  }, [pacienteId, isAdminMode]);

  // Función para determinar el color según el porcentaje de riesgo QRISK3
  const getRiskColor = (riesgo) => {
    if (riesgo < 10) return '#28a745'; // Bajo (Verde)
    if (riesgo >= 10 && riesgo < 20) return '#ffc107'; // Moderado (Amarillo)
    return '#dc3545'; // Alto (Rojo)
  };

  return (
    <HistorialContainer>
      <Header>
        <div>
          <h2>Historial de Evaluaciones Predictivas</h2>
          {isAdminMode && nombrePaciente && <Subtitle>Paciente: {nombrePaciente}</Subtitle>}
          {!isAdminMode && <Subtitle>Tus resultados previos</Subtitle>}
        </div>
        <BackButton onClick={() => navigate(isAdminMode ? '/admin/pacientes' : '/dashboard')}>
          Volver
        </BackButton>
      </Header>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <GridContainer>
        {loading ? (
          <p>Cargando registros...</p>
        ) : evaluaciones.length === 0 ? (
          <p>No se encontraron evaluaciones registradas.</p>
        ) : (
          evaluaciones.map((ev) => (
            <RiskCard key={ev.id} borderColor={getRiskColor(ev.riesgoPorcentaje)}>
              <CardHeader>
                <strong>{new Date(ev.fechaEvaluacion).toLocaleDateString()}</strong>
              </CardHeader>
              <CardBody>
                <p><span>Edad:</span> {ev.edadAlEvaluar} años</p>
                <p><span>IMC:</span> {ev.imc.toFixed(1)}</p>
                <p><span>Presión Sistólica:</span> {ev.presionSistolica} mmHg</p>

                <RiskResult color={getRiskColor(ev.riesgoPorcentaje)}>
                  Riesgo a 10 años: {ev.riesgoPorcentaje.toFixed(1)}%
                </RiskResult>
                
                <button
                  onClick={() => navigate(isAdminMode ? `/admin/evaluacion/detalle/${ev.id}` : `/evaluacion/detalle/${ev.id}`)}
                  style={{ marginTop: '15px', width: '100%', padding: '10px', backgroundColor: '#f4f7f6', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  Ver Detalles Completos
                </button>
              </CardBody>
            </RiskCard>
          ))
        )}
      </GridContainer>
    </HistorialContainer>
  );
};

// --- Estilos ---
const HistorialContainer = styled.div`
  padding: 40px;
  max-width: 1000px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  border-bottom: 2px solid #eaeaea;
  padding-bottom: 15px;
`;

const Subtitle = styled.p`
  color: #666;
  margin: 5px 0 0 0;
  font-size: 16px;
`;

const ErrorMessage = styled.p`
  color: #d93025;
  background: #fce8e6;
  padding: 10px;
  border-radius: 4px;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
`;

const RiskCard = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  border-top: 5px solid ${(props) => props.borderColor};
  padding: 20px;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-3px);
  }
`;

const CardHeader = styled.div`
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
  margin-bottom: 15px;
  font-size: 18px;
  color: #333;
`;

const CardBody = styled.div`
  p {
    margin: 8px 0;
    color: #555;
  }
  span {
    font-weight: bold;
    color: #333;
  }
`;

const RiskResult = styled.div`
  margin-top: 15px;
  padding: 10px;
  background-color: ${(props) => props.color}20; /* 20 es transparencia hex */
  color: ${(props) => props.color};
  font-weight: bold;
  text-align: center;
  border-radius: 4px;
  font-size: 18px;
`;

const BackButton = styled.button`
  background-color: #6c757d;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  &:hover { background-color: #5a6268; }
`;

export default Historial;