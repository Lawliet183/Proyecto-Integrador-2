import React from 'react';
import styled from 'styled-components';
import { AuthContainer, AuthCard, PrimaryButton } from './AuthStyles';
import { SecondaryButton } from './WizardStyles';

// --- Estilos Específicos del Resultado ---

const ResultTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 30px;
`;

const ChartContainer = styled.div`
  position: relative;
  width: 180px;
  height: 180px;
  margin: 0 auto 20px auto;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SvgRing = styled.svg`
  transform: rotate(-90deg);
  width: 100%;
  height: 100%;
`;

const CircleTrack = styled.circle`
  fill: transparent;
  stroke: #ede7f6; /* Morado muy claro para el fondo del anillo */
  stroke-width: 14;
`;

const CircleProgress = styled.circle`
  fill: transparent;
  stroke: #6750a4; /* Morado principal de tu diseño */
  stroke-width: 14;
  stroke-linecap: round;
  transition: stroke-dashoffset 1s ease-in-out;
`;

const ChartText = styled.div`
  position: absolute;
  font-size: 22px;
  font-weight: 600;
  color: #333;
`;

const RiskLabel = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
  /* El color se inyectará dinámicamente según la gravedad */
  color: ${props => props.color || '#333'};
`;

const ImcText = styled.p`
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 15px;
`;

const Description = styled.p`
  font-size: 14px;
  font-style: italic;
  color: #555;
  line-height: 1.5;
  margin-bottom: 35px;
  padding: 0 15px;
`;

const ButtonStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 250px;
  margin: 0 auto;
`;

// --- Componente Principal ---

const DiagnosticResult = ({ riskPercentage, imc, onSave, onNewEvaluation }) => {

  // 1. Lógica matemática para el SVG
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  // Limitamos el progreso visual al 100% como máximo
  const progressOffset = circumference - (circumference * Math.min(riskPercentage, 100)) / 100;

  // 2. Lógica clínica para los textos y colores
  let riskLevel = "Riesgo Bajo";
  let riskColor = "#2e7d32"; // Verde

  if (riskPercentage >= 20) {
    riskLevel = "Riesgo Alto";
    riskColor = "#d93025"; // Rojo (como en tu mockup)
  } else if (riskPercentage >= 10) {
    riskLevel = "Riesgo Moderado";
    riskColor = "#f29900"; // Naranja
  }

  // Lógica básica para categorizar el IMC
  let imcCategory = "Peso normal";
  if (imc >= 30) imcCategory = "Obesidad";
  else if (imc >= 25) imcCategory = "Sobrepeso";
  else if (imc < 18.5) imcCategory = "Bajo peso";

  return (
    <AuthContainer>
      <AuthCard>
        <ResultTitle>Tu diagnostico</ResultTitle>

        <ChartContainer>
          <SvgRing>
            <CircleTrack cx="90" cy="90" r={radius} />
            <CircleProgress
              cx="90"
              cy="90"
              r={radius}
              strokeDasharray={circumference}
              strokeDashoffset={progressOffset}
            />
          </SvgRing>
          <ChartText>{riskPercentage.toFixed(2)}%</ChartText>
        </ChartContainer>

        <RiskLabel color={riskColor}>{riskLevel}</RiskLabel>

        <ImcText>
          Tu IMC es {imc.toFixed(2)} - {imcCategory}
        </ImcText>

        <Description>
          Según tu evaluación, tienes un {riskPercentage.toFixed(2)}% de probabilidad de
          desarrollar diabetes tipo 2 en los próximos 10 años. Te recomendamos consultar
          a un médico y mantener una actividad física constante.
        </Description>

        <ButtonStack>
          {/* El botón oscuro principal */}
          <PrimaryButton onClick={onSave} type="button">
            Guardar resultados
          </PrimaryButton>

          {/* El botón claro secundario */}
          <SecondaryButton onClick={onNewEvaluation} type="button">
            Nueva evaluacion
          </SecondaryButton>
        </ButtonStack>

      </AuthCard>
    </AuthContainer>
  );
};

export default DiagnosticResult;