import React from 'react';
import { FormGroup, Label } from './AuthStyles';
import { OptionsGrid, RadioLabel } from './WizardStyles';

const Step3Comorbidities = ({ formData, handleChange }) => {

  // Función auxiliar para mantener el código limpio y no repetir la misma estructura HTML
  const renderCheckbox = (name, label, isAlert = false) => (
    <RadioLabel style={isAlert ? { color: '#d93025', fontWeight: '600' } : {}}>
      <input
        type="checkbox"
        name={name}
        checked={formData[name] === true}
        onChange={handleChange}
      />
      {label}
    </RadioLabel>
  );

  return (
    <div>
      <p style={{ fontSize: '13px', color: '#666', marginBottom: '20px', textAlign: 'left' }}>
        Por favor, marque las casillas de las condiciones médicas que le hayan sido diagnosticadas por un profesional de la salud. Si no padece ninguna, deje esta sección en blanco.
      </p>

      <FormGroup>
        <Label>Antecedentes y Metabolismo</Label>
        <OptionsGrid>
          {renderCheckbox('hasType1Diabetes', 'Diabetes Tipo 1')}
          {renderCheckbox('hasType2Diabetes', 'Diabetes Tipo 2')}
          {renderCheckbox('hasFamilyHistoryCvd', 'Historial Familiar Cardíaco')}
        </OptionsGrid>
      </FormGroup>

      <FormGroup style={{ marginTop: '20px' }}>
        <Label>Otras Condiciones Clínicas</Label>
        <OptionsGrid>
          {renderCheckbox('hasChronicKidneyDisease', 'Enfermedad Renal Crónica')}
          {renderCheckbox('hasMigraine', 'Migraña')}
          {renderCheckbox('hasRheumatoidArthritis', 'Artritis Reumatoide')}
          {renderCheckbox('hasSevereMentalIllness', 'Enfermedad Mental Grave')}
          {renderCheckbox('hasSLE', 'Lupus (SLE)')}
        </OptionsGrid>
      </FormGroup>

      {/* Bloque especial destacado para tu variable de alerta temprana */}
      <div style={{
        marginTop: '25px',
        padding: '15px',
        backgroundColor: '#fdf3f2',
        borderRadius: '6px',
        border: '1px solid #f2b7b5'
      }}>
        <FormGroup style={{ marginBottom: 0 }}>
          <Label style={{ color: '#b3261e' }}>Signos de Alerta Temprana</Label>
          <div style={{ marginTop: '10px' }}>
            {renderCheckbox(
              'hasInvoluntaryWeightLoss',
              'He experimentado un bajón de peso involuntario o inexplicable recientemente',
              true
            )}
          </div>
        </FormGroup>
      </div>
    </div>
  );
};

export default Step3Comorbidities;