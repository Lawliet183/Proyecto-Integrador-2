import React from 'react';
import { FormGroup, Label, Input } from './AuthStyles';
import { OptionsGrid } from './WizardStyles';

const Step1Demographics = ({ formData, handleChange }) => {
  return (
    <div>
      <OptionsGrid>
        <FormGroup>
          <Label>Peso (kg) - Opcional</Label>
          <Input
            type="number"
            name="weight"
            placeholder="Ej. 75.5"
            value={formData.weight}
            onChange={handleChange}
            step="0.1"
          />
        </FormGroup>

        <FormGroup>
          <Label>Altura (metros) - Opcional</Label>
          <Input
            type="number"
            name="height"
            placeholder="Ej. 1.75"
            value={formData.height}
            onChange={handleChange}
            step="0.01"
          />
        </FormGroup>
      </OptionsGrid>

      <FormGroup>
        <Label>Origen Étnico</Label>
        <select
          name="ethnicityCode"
          value={formData.ethnicityCode}
          onChange={handleChange}
          style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #d1d5db' }}
        >
          <option value={1}>Blanco / Otro</option>
          <option value={2}>Indio</option>
          <option value={3}>Paquistaní</option>
          <option value={8}>Negro Africano</option>
          <option value={9}>Negro Caribeño</option>
        </select>
      </FormGroup>

      <FormGroup>
        <Label>Categoría de Tabaquismo</Label>
        <select
          name="smokeCategory"
          value={formData.smokeCategory}
          onChange={handleChange}
          style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #d1d5db' }}
        >
          <option value={1}>No fumador</option>
          <option value={2}>Ex fumador</option>
          <option value={3}>Fumador ligero (1-9/día)</option>
          <option value={4}>Fumador moderado (10-19/día)</option>
          <option value={5}>Fumador empedernido (20+/día)</option>
        </select>
      </FormGroup>
    </div>
  );
};

export default Step1Demographics;