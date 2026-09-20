import styled from 'styled-components';
import { AuthCard, PrimaryButton } from './AuthStyles'; // Reutilizamos la tarjeta base

export const WizardCard = styled(AuthCard)`
  max-width: 650px; /* Un poco más ancho para las preguntas médicas */
`;

export const StepIndicator = styled.p`
  color: #666;
  font-size: 14px;
  margin-bottom: 25px;
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 15px;
  margin-top: 30px;
`;

export const SecondaryButton = styled(PrimaryButton)`
  background-color: #e5e7eb;
  color: #374151;

  &:hover {
    background-color: #d1d5db;
  }
`;

export const OptionsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-top: 10px;
`;

export const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  
  input[type="radio"], input[type="checkbox"] {
    accent-color: #212121;
    width: 16px;
    height: 16px;
    cursor: pointer;
  }
`;