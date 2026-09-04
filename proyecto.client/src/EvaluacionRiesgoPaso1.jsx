import React from 'react';
import styled from 'styled-components';


const Contenedor = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: sans-serif;
  max-width: 500px;
  margin: 2rem auto;
  padding: 2rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
`;

const Cabecera = styled.header`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 1.5rem;
`;

const Titulo = styled.h2`
  font-size: 1.2rem;
  margin: 0;
  color: #000;
`;

const IndicadorPaso = styled.p`
  color: #555;
  margin-bottom: 2rem;
`;

const Formulario = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  gap: 1.5rem;
`;

const GrupoInput = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const Label = styled.label`
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
  color: #333;
`;

const Input = styled.input`
  padding: 0.6rem 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  width: 60%;
  text-align: center;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: #000;
  }
  
  /* Ocultar las flechas de los inputs numéricos */
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  &[type=number] {
    -moz-appearance: textfield;
  }
`;

const BotonSiguiente = styled.button`
  margin-top: 1rem;
  padding: 0.75rem 2.5rem;
  background-color: #222;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #000;
  }
`;


const Paso1 = ({ respuestas, handleChange, siguientePaso }) => {

  // Usamos onSubmit en el formulario para aprovechar la validación nativa de HTML (required, min, max)
  const handleSubmit = (e) => {
    e.preventDefault();
    siguientePaso();
  };

  return (
    <Contenedor>
      <Cabecera>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
        </svg>
        <Titulo>Evaluacion de Riesgo de Diabetes</Titulo>
      </Cabecera>

      <IndicadorPaso>Paso 1 de 3</IndicadorPaso>

      <Formulario onSubmit={handleSubmit}>
        <GrupoInput>
          <Label htmlFor="edad">Edad</Label>
          <Input
            type="number"
            id="edad"
            name="edad"
            placeholder="25-60 años"
            value={respuestas.edad || ''}
            onChange={handleChange}
            required
            min="25"
            max="60"
          />
        </GrupoInput>

        <GrupoInput>
          <Label htmlFor="peso">Peso</Label>
          <Input
            type="number"
            id="peso"
            name="peso"
            placeholder="kg"
            value={respuestas.peso || ''}
            onChange={handleChange}
            step="0.1"
            required
            min="30"
            max="200"
          />
        </GrupoInput>

        <GrupoInput>
          <Label htmlFor="altura">Altura</Label>
          <Input
            type="number"
            id="altura"
            name="altura"
            placeholder="metros"
            value={respuestas.altura || ''}
            onChange={handleChange}
            step="0.01"
            required
            min="1.00"
            max="2.50"
          />
        </GrupoInput>

        <GrupoInput>
          <Label htmlFor="perimetro">Perimetro de la cintura</Label>
          <Input
            type="number"
            id="perimetro"
            name="perimetro"
            placeholder="cm"
            value={respuestas.perimetro || ''}
            onChange={handleChange}
            required
            min="40"
            max="140"
          />
        </GrupoInput>

        <BotonSiguiente type="submit">Siguiente</BotonSiguiente>
      </Formulario>
    </Contenedor>
  );
};

export default Paso1;