import React from 'react';
import styled from 'styled-components';


const Contenedor = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: sans-serif;
  max-width: 500px;
  margin: 2rem auto;
  padding: 3rem 2rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
`;

const Titulo = styled.h2`
  font-size: 1.5rem;
  color: #111;
  margin-bottom: 2rem;
  text-align: center;
`;

const GraficoContainer = styled.div`
  position: relative;
  width: 150px;
  height: 150px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SvgCirculo = styled.svg`
  transform: rotate(-90deg);
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
`;

const CirculoFondo = styled.circle`
  fill: none;
  stroke: #EAE0F5; /* Color morado claro */
  stroke-width: 8;
`;

const CirculoProgreso = styled.circle`
  fill: none;
  stroke: #5E4B9C; /* Color morado oscuro */
  stroke-width: 8;
  stroke-linecap: round;
  transition: stroke-dashoffset 1s ease-in-out;
  stroke-dasharray: ${props => props.$circunferencia};
  stroke-dashoffset: ${props => props.$offset};
`;

const TextoPuntos = styled.div`
  font-size: 1.1rem;
  color: #333;
  z-index: 1;
`;

const NivelRiesgo = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  font-weight: 500;
  /* El color cambia dinámicamente según el nivel de riesgo */
  color: ${props => {
    switch (props.$nivel) {
      case 'Bajo': return '#2e7d32'; // Verde
      case 'Moderado': return '#ed6c02'; // Naranja
      case 'Alto':
      case 'Muy Alto': return '#d32f2f'; // Rojo
      default: return '#333';
    }
  }};
`;

const InfoAdicional = styled.p`
  font-size: 1rem;
  color: #444;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const Recomendacion = styled.p`
  font-size: 0.95rem;
  color: #555;
  font-style: italic;
  text-align: center;
  line-height: 1.5;
  margin-bottom: 2.5rem;
`;

const Botonera = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 250px;
`;

const Boton = styled.button`
  padding: 0.85rem;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
  
  ${props => props.$primario ? `
    background-color: #2a2a2a;
    color: white;
    border: none;
    &:hover { background-color: #111; }
  ` : `
    background-color: #f5f5f5;
    color: #333;
    border: 1px solid #999;
    &:hover { background-color: #e0e0e0; }
  `}
`;


const Resultados = ({ datosResultado, reiniciarEvaluacion }) => {
  // Extraemos los datos calculados
  const { puntaje = 0, nivelRiesgo = 'Desconocido', imc = 0 } = datosResultado || {};

  // Lógica matemática para el anillo del gráfico (Radio 60 = Circunferencia 377)
  const radio = 60;
  const circunferencia = 2 * Math.PI * radio;
  const puntajeMaximo = 26; // Máximo puntaje posible del Test FINDRISK
  const porcentaje = (puntaje / puntajeMaximo);
  const offset = circunferencia - (porcentaje * circunferencia);

  // Funciones auxiliares para determinar los textos clínicos
  const determinarCategoriaIMC = (valorImc) => {
    if (valorImc < 18.5) return "Bajo peso";
    if (valorImc <= 24.9) return "Peso normal";
    if (valorImc <= 29.9) return "Sobrepeso";
    return "Obesidad";
  };

  const determinarMensaje = (nivel) => {
    if (nivel === "Bajo") return "Tienes un 1% de probabilidad de desarrollar diabetes tipo 2 en los próximos 10 años. ¡Sigue manteniendo tus buenos hábitos!";
    if (nivel === "Moderado") return "Tienes un 17% de probabilidad de desarrollar diabetes tipo 2. Te sugerimos mejorar tus hábitos alimenticios y actividad física.";
    if (nivel === "Alto" || nivel === "Muy Alto") return "Según tu puntaje, tienes entre un 33% y 50% de probabilidad de desarrollar diabetes tipo 2 en los próximos 10 años. Te recomendamos consultar a un médico y aumentar tu actividad física.";
    return "Consulte con un especialista para evaluar sus resultados.";
  };

  return (
    <Contenedor>
      <Titulo>Tu diagnostico</Titulo>

      <GraficoContainer>
        <SvgCirculo viewBox="0 0 140 140">
          <CirculoFondo cx="70" cy="70" r={radio} />
          <CirculoProgreso
            cx="70" cy="70" r={radio}
            $circunferencia={circunferencia}
            $offset={offset}
          />
        </SvgCirculo>
        <TextoPuntos>{puntaje} puntos</TextoPuntos>
      </GraficoContainer>

      <NivelRiesgo $nivel={nivelRiesgo}>Riesgo {nivelRiesgo.toLowerCase()}</NivelRiesgo>

      <InfoAdicional>
        Tu IMC es {imc.toFixed(1)} - {determinarCategoriaIMC(imc)}
      </InfoAdicional>

      <Recomendacion>
        {determinarMensaje(nivelRiesgo)}
      </Recomendacion>

      <Botonera>
        <Boton $primario>Exportar resultados</Boton>
        <Boton onClick={reiniciarEvaluacion}>Nueva evaluacion</Boton>
      </Botonera>
    </Contenedor>
  );
};

export default Resultados;