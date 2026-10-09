import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const PacienteDashboard = () => {
  const navigate = useNavigate();

  const handleCerrarSesion = () => {
    // Eliminamos el token de seguridad
    localStorage.removeItem('token');
    // Redirigimos al login
    navigate('/login');
  };

  return (
    <DashboardContainer>
      <WelcomeCard>
        <Header>
          <Title>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1a73e8" strokeWidth="2" style={{ marginRight: '10px' }}>
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            Portal del Paciente
          </Title>
        </Header>

        <Description>
          Bienvenido a tu panel de control. Desde aquí puedes gestionar tus evaluaciones de riesgo cardiovascular y consultar tu progreso histórico.
        </Description>

        <ButtonGroup>
          <PrimaryButton onClick={() => navigate('/evaluacion')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px' }}>
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Realizar Nueva Evaluación
          </PrimaryButton>

          <SecondaryButton onClick={() => navigate('/historial')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px' }}>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            Ver Mi Historial
          </SecondaryButton>
        </ButtonGroup>

        <LogoutContainer>
          <LogoutButton onClick={handleCerrarSesion}>
            Cerrar Sesión
          </LogoutButton>
        </LogoutContainer>
      </WelcomeCard>
    </DashboardContainer>
  );
};

// --- Estilos ---
const DashboardContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f4f7f6;
  padding: 20px;
  font-family: Arial, sans-serif;
`;

const WelcomeCard = styled.div`
  background: white;
  width: 100%;
  max-width: 500px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  padding: 40px;
`;

const Header = styled.div`
  border-bottom: 2px solid #eaeaea;
  padding-bottom: 15px;
  margin-bottom: 25px;
`;

const Title = styled.h2`
  display: flex;
  align-items: center;
  color: #333;
  margin: 0;
  font-size: 24px;
`;

const Description = styled.p`
  color: #555;
  line-height: 1.6;
  margin-bottom: 30px;
  font-size: 16px;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 30px;
`;

const PrimaryButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #1a73e8;
  color: white;
  border: none;
  padding: 14px;
  border-radius: 6px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover { background-color: #1557b0; }
`;

const SecondaryButton = styled(PrimaryButton)`
  background-color: white;
  color: #1a73e8;
  border: 2px solid #1a73e8;

  &:hover { background-color: #f8fbff; }
`;

const LogoutContainer = styled.div`
  margin-top: 10px;
  text-align: center;
`;

const LogoutButton = styled.button`
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 15px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover { 
    background-color: #c82333; 
  }
`;

export default PacienteDashboard;