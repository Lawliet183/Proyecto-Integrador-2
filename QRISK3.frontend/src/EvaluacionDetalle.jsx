import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const devServerUrl = import.meta.env.VITE_DEV_SERVER_URL;

const EvaluacionDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Detectar si venimos de la ruta de admin
  const isAdminMode = location.pathname.includes('/admin/');

  const [detalle, setDetalle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDetalle = async () => {
      const token = localStorage.getItem('token');
      const endpoint = isAdminMode
        ? `${devServerUrl}/api/admin/evaluacion/${id}`
        : `${devServerUrl}/api/evaluacion/${id}`;

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
          setDetalle(result.data);
        } else {
          setError(result?.message || 'No se pudieron cargar los detalles de esta evaluación.');
        }
      } catch (err) {
        setError('Parece que hay un problema de conexión. No pudimos descargar los detalles en este momento.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetalle();
  }, [id, isAdminMode]);

  const getRiskColor = (riesgo) => {
    if (riesgo < 10) return '#28a745';
    if (riesgo >= 10 && riesgo < 20) return '#ffc107';
    return '#dc3545';
  };

  const renderBool = (value) => value ? <Badge type="yes">Sí</Badge> : <Badge type="no">No</Badge>;
  const renderImputed = (isImputed) => isImputed ? <ImputedTag>Valor imputado estadísticamente</ImputedTag> : null;

  if (loading) return <Container><p>Cargando detalles...</p></Container>;
  if (error) return <Container><ErrorMessage>{error}</ErrorMessage><BackButton onClick={() => navigate(-1)}>Volver</BackButton></Container>;
  if (!detalle) return null;

  return (
    <Container>
      <Header>
        <h2>Detalle de la Evaluación</h2>
        <BackButton onClick={() => navigate(-1)}>Volver al Historial</BackButton>
      </Header>

      <RiskBanner color={getRiskColor(detalle.riesgoPorcentaje)}>
        <h3>Riesgo Cardiovascular a 10 años: {detalle.riesgoPorcentaje.toFixed(1)}%</h3>
        <p>Evaluación realizada el: {new Date(detalle.fechaEvaluacion).toLocaleDateString()} a las {new Date(detalle.fechaEvaluacion).toLocaleTimeString()}</p>
      </RiskBanner>

      <Grid>
        {/* Panel Demográfico y Físico */}
        <Card>
          <CardTitle>Datos Demográficos y Físicos</CardTitle>
          <DataRow><span>Edad al evaluar:</span> {detalle.edadAlEvaluar} años</DataRow>
          <DataRow><span>Peso ingresado:</span> {detalle.peso ? `${detalle.peso} kg` : 'N/A'}</DataRow>
          <DataRow><span>Altura ingresada:</span> {detalle.altura ? `${detalle.altura.toFixed(2)} m` : 'N/A'}</DataRow>
          <DataRow>
            <span>IMC Utilizado:</span> {detalle.imc.toFixed(2)}
            {renderImputed(detalle.imcImputado)}
          </DataRow>
          <DataRow><span>Categoría Tabaquismo (Código):</span> {detalle.categoriaTabaquismo}</DataRow>
          <DataRow><span>Origen Étnico (Código):</span> {detalle.origenEtnico}</DataRow>
        </Card>

        {/* Panel Clínico */}
        <Card>
          <CardTitle>Datos Clínicos y Laboratorio</CardTitle>
          <DataRow>
            <span>Presión Sistólica:</span> {detalle.presionSistolica} mmHg
            {renderImputed(detalle.presionSistolicaImputada)}
          </DataRow>
          <DataRow>
            <span>Ratio Colesterol HDL:</span> {detalle.ratioColesterolHdl}
            {renderImputed(detalle.ratioColesterolImputado)}
          </DataRow>
          <DataRow><span>Tratamiento Hipertensión:</span> {renderBool(detalle.tratamientoHipertension)}</DataRow>
        </Card>

        {/* Panel Comorbilidades */}
        <Card style={{ gridColumn: '1 / -1' }}>
          <CardTitle>Comorbilidades Registradas</CardTitle>
          <ComorbiditiesGrid>
            <DataRow><span>Diabetes Tipo 1:</span> {renderBool(detalle.diabetesTipo1)}</DataRow>
            <DataRow><span>Diabetes Tipo 2:</span> {renderBool(detalle.diabetesTipo2)}</DataRow>
            <DataRow><span>Historial Familiar enf. Cardíaca:</span> {renderBool(detalle.historialFamiliarCvd)}</DataRow>
            <DataRow><span>Fibrilación Auricular:</span> {renderBool(detalle.fibrilacionAuricular)}</DataRow>
            <DataRow><span>Artritis Reumatoide:</span> {renderBool(detalle.artritisReumatoide)}</DataRow>
            <DataRow><span>Lupus (SLE):</span> {renderBool(detalle.lupus)}</DataRow>
            <DataRow><span>Migraña:</span> {renderBool(detalle.migrana)}</DataRow>
            <DataRow><span>Enfermedad Renal Crónica:</span> {renderBool(detalle.enfermedadRenalCronica)}</DataRow>
            <DataRow><span>Enfermedad Mental Grave:</span> {renderBool(detalle.enfermedadMentalGrave)}</DataRow>
            <DataRow><span>Toma Antipsicóticos Atípicos:</span> {renderBool(detalle.antipsicoticosAtipicos)}</DataRow>
            <DataRow><span>Toma Corticosteroides:</span> {renderBool(detalle.corticosteroides)}</DataRow>
            <DataRow><span>Pérdida de Peso Involuntaria:</span> {renderBool(detalle.bajonPesoInvoluntario)}</DataRow>
            <DataRow><span>Disfunción Eréctil:</span> {renderBool(detalle.disfuncionErectil)}</DataRow>
          </ComorbiditiesGrid>
        </Card>
      </Grid>
    </Container>
  );
};

// --- Estilos ---
const Container = styled.div`
  padding: 40px;
  max-width: 1000px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
`;
const Header = styled.div`
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;
`;
const BackButton = styled.button`
  background-color: #6c757d; color: white; border: none; padding: 10px 15px; border-radius: 4px; cursor: pointer; font-weight: bold;
  &:hover { background-color: #5a6268; }
`;
const ErrorMessage = styled.p` color: #d93025; background: #fce8e6; padding: 10px; border-radius: 4px; margin-bottom: 20px; `;
const RiskBanner = styled.div`
  background-color: ${(props) => props.color}15; border-left: 6px solid ${(props) => props.color}; padding: 20px; border-radius: 8px; margin-bottom: 30px;
  h3 { color: ${(props) => props.color}; margin: 0 0 10px 0; font-size: 24px; }
  p { margin: 0; color: #555; font-size: 14px; }
`;
const Grid = styled.div` display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 20px; `;
const Card = styled.div` background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); `;
const CardTitle = styled.h4` margin-top: 0; border-bottom: 1px solid #eee; padding-bottom: 10px; color: #333; font-size: 18px; `;
const DataRow = styled.div`
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; font-size: 15px;
  span { font-weight: bold; color: #555; }
`;
const ComorbiditiesGrid = styled.div` display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); column-gap: 40px; row-gap: 5px; `;
const Badge = styled.span`
  background-color: ${(props) => props.type === 'yes' ? '#28a745' : '#e9ecef'};
  color: ${(props) => props.type === 'yes' ? 'white' : '#6c757d'};
  padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: bold;
`;
const ImputedTag = styled.small`
  background-color: #17a2b8; color: white; padding: 2px 6px; border-radius: 4px; font-size: 11px; margin-left: 10px;
`;

export default EvaluacionDetalle;