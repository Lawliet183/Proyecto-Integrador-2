import React from 'react';
import styled from 'styled-components';


const Contenedor = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: sans-serif;
  max-width: 550px; /* Un poco más ancho para las preguntas largas */
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
  gap: 4rem; /* Separación amplia para Si / No */
`;

const OpcionesColumna = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: flex-start;
  max-width: 450px;
  margin: 0 auto;
  text-align: left;
`;

const LabelOpcion = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  cursor: pointer;
  font-size: 0.95rem;
  line-height: 1.3;

  input[type="radio"] {
    margin-top: 0.15rem; /* Alinea el radio button con la primera línea del texto */
  }
`;

const Botonera = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
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


const Paso3 = ({ respuestas, handleChange, pasoAnterior, enviarDatos }) => {
  return (
    <Contenedor>
      <IndicadorPaso>Paso 3 de 3</IndicadorPaso>

      {/* Pregunta 1 */}
      <PreguntaContainer>
        <TextoPregunta>
          ¿Toma o ha tomado alguna vez medicación para la presión arterial alta?
        </TextoPregunta>
        <OpcionesGrid>
          <LabelOpcion>
            <input
              type="radio"
              name="medicacionHipertension"
              value="Si"
              checked={respuestas.medicacionHipertension === 'Si'}
              onChange={handleChange}
            /> Si
          </LabelOpcion>
          <LabelOpcion>
            <input
              type="radio"
              name="medicacionHipertension"
              value="No"
              checked={respuestas.medicacionHipertension === 'No'}
              onChange={handleChange}
            /> No
          </LabelOpcion>
        </OpcionesGrid>
      </PreguntaContainer>

      {/* Pregunta 2 */}
      <PreguntaContainer>
        <TextoPregunta>
          ¿Le han encontrado alguna vez valores altos de glucosa en la sangre?
        </TextoPregunta>
        <OpcionesGrid>
          <LabelOpcion>
            <input
              type="radio"
              name="antecedenteGlucosaAlta"
              value="Si"
              checked={respuestas.antecedenteGlucosaAlta === 'Si'}
              onChange={handleChange}
            /> Si
          </LabelOpcion>
          <LabelOpcion>
            <input
              type="radio"
              name="antecedenteGlucosaAlta"
              value="No"
              checked={respuestas.antecedenteGlucosaAlta === 'No'}
              onChange={handleChange}
            /> No
          </LabelOpcion>
        </OpcionesGrid>
      </PreguntaContainer>

      {/* Pregunta 3 */}
      <PreguntaContainer>
        <TextoPregunta>
          ¿Se le ha diagnosticado diabetes (tipo 1 o 2) a alguno de sus familiares?
        </TextoPregunta>
        <OpcionesColumna>
          <LabelOpcion>
            <input
              type="radio"
              name="antecedenteFamiliar"
              value="No"
              checked={respuestas.antecedenteFamiliar === 'No'}
              onChange={handleChange}
            /> No
          </LabelOpcion>
          <LabelOpcion>
            <input
              type="radio"
              name="antecedenteFamiliar"
              value="Si (2do Grado)"
              checked={respuestas.antecedenteFamiliar === 'Si (2do Grado)'}
              onChange={handleChange}
            /> Si: abuelos, tia, tio o primo-hermano (segundo grado).
          </LabelOpcion>
          <LabelOpcion>
            <input
              type="radio"
              name="antecedenteFamiliar"
              value="Si (1er Grado)"
              checked={respuestas.antecedenteFamiliar === 'Si (1er Grado)'}
              onChange={handleChange}
            /> Si: padres, hermano, hermana o hijo (primer grado).
          </LabelOpcion>
        </OpcionesColumna>
      </PreguntaContainer>

      <Botonera>
        <Boton onClick={pasoAnterior}>Atras</Boton>
        <Boton $primario onClick={enviarDatos}>Siguiente</Boton>
      </Botonera>
    </Contenedor>
  );
};

export default Paso3;