import React from 'react';
import { FormGroup, Label, Input } from './AuthStyles';
import { OptionsGrid, RadioLabel } from './WizardStyles';

const Step2Clinical = ({ formData, handleChange }) => {
  return (
    <div>
      <p style={{ fontSize: '13px', color: '#666', marginBottom: '20px', textAlign: 'left' }}>
        Nota: Si desconoce sus valores de laboratorio, déjelos en blanco. El sistema utilizará valores estadísticos estándar para su perfil.
      </p>

      <OptionsGrid>
        <FormGroup>
          <Label>Presión Sistólica (mmHg)</Label>
          <Input
            type="number"
            name="systolicBloodPressure"
            placeholder="Ej. 120"
            value={formData.systolicBloodPressure}
            onChange={handleChange}
            step="0.1"
          />
        </FormGroup>

        <FormGroup>
          <Label>Ratio de Colesterol (Total/HDL)</Label>
          <Input
            type="number"
            name="cholesterolHdlRatio"
            placeholder="Ej. 4.2"
            value={formData.cholesterolHdlRatio}
            onChange={handleChange}
            step="0.1"
          />
        </FormGroup>
      </OptionsGrid>

      <FormGroup style={{ marginTop: '15px' }}>
        <Label>¿Toma medicación para la presión arterial?</Label>
        <OptionsGrid style={{ marginTop: '8px' }}>
          <RadioLabel>
            <input
              type="radio"
              name="isTreatedForHypertension"
              value="true"
              checked={formData.isTreatedForHypertension === true}
              onChange={() => handleChange({ target: { name: 'isTreatedForHypertension', value: true, type: 'checkbox', checked: true } })}
            />
            Sí
          </RadioLabel>
          <RadioLabel>
            <input
              type="radio"
              name="isTreatedForHypertension"
              value="false"
              checked={formData.isTreatedForHypertension === false}
              onChange={() => handleChange({ target: { name: 'isTreatedForHypertension', value: false, type: 'checkbox', checked: false } })}
            />
            No
          </RadioLabel>
        </OptionsGrid>
      </FormGroup>
    </div>
  );
};

export default Step2Clinical;