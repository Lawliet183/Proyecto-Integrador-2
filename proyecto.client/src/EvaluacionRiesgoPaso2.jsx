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

const IndicadorPaso = styled.p`
  color: #555;
  margin-bottom: 2rem;
`;

const PreguntaContainer = styled.div`
  width: 100%;
  margin-bottom: 2rem;
  text-align: center;
`;

const TextoPregunta = styled.p`
  font-size: 1rem;
  color: #333;
  margin-bottom: 1.5rem;
  line-height: 1.4;
`;

const OpcionesGrid = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
`;

const LabelOpcion = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.95rem;
`;

const Botonera = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const Boton = styled.button`
  padding: 0.75rem 2rem;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  
  ${props => props.$primario ? `
    background-color: #222;
    color: white;
    border: none;
    &:hover { background-color: #000; }
  ` : `
    background-color: #e0e0e0;
    color: #333;
    border: 1px solid #ccc;
    &:hover { background-color: #d0d0d0; }
  `}
`;


const Paso2 = ({ respuestas, handleChange, siguientePaso, pasoAnterior }) => {
  return (
    <Contenedor>
      <IndicadorPaso>Paso 2 de 3</IndicadorPaso>

      <PreguntaContainer>
        <TextoPregunta>
          ¿Realiza habitualmente al menos 30 minutos de actividad física en el trabajo o en su tiempo libre?
        </TextoPregunta>
        <OpcionesGrid>
          <LabelOpcion>
            <input
              type="radio"
              name="actividadFisica"
              value="Si"
              checked={respuestas.actividadFisica === 'Si'}
              onChange={handleChange}
            /> Si
          </LabelOpcion>
          <LabelOpcion>
            <input
              type="radio"
              name="actividadFisica"
              value="No"
              checked={respuestas.actividadFisica === 'No'}
              onChange={handleChange}
            /> No
          </LabelOpcion>
        </OpcionesGrid>
      </PreguntaContainer>

      <PreguntaContainer>
        <TextoPregunta>
          ¿Con qué frecuencia come verduras o frutas?
        </TextoPregunta>
        <OpcionesGrid>
          <LabelOpcion>
            <input
              type="radio"
              name="consumoFrutas"
              value="Todos los dias"
              checked={respuestas.consumoFrutas === 'Todos los dias'}
              onChange={handleChange}
            /> Todos los dias
          </LabelOpcion>
          <LabelOpcion>
            <input
              type="radio"
              name="consumoFrutas"
              value="No todos los dias"
              checked={respuestas.consumoFrutas === 'No todos los dias'}
              onChange={handleChange}
            /> No todos los dias
          </LabelOpcion>
        </OpcionesGrid>
      </PreguntaContainer>

      <Botonera>
        <Boton onClick={pasoAnterior}>Atras</Boton>
        <Boton $primario onClick={siguientePaso}>Siguiente</Boton>
      </Botonera>
    </Contenedor>
  );
};

export default Paso2;