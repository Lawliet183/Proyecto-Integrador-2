import React, { useState } from 'react';
import Paso1 from './EvaluacionRiesgoPaso1';
import Paso2 from './EvaluacionRiesgoPaso2';
import Paso3 from './EvaluacionRiesgoPaso3';
import Resultados from './Resultados';

const api = (path, options = {}) =>
  fetch(path, { credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, ...options });

const devServerUrl = import.meta.env.VITE_DEV_SERVER_URL;

const App = () => {
  const [pasoActual, setPasoActual] = useState(1);

  // Estado para capturar los inputs del usuario
  const [respuestas, setRespuestas] = useState({
    edad: '',
    peso: '',
    altura: '',
    perimetro: '',
    actividadFisica: '',
    consumoFrutas: '',
    medicacionHipertension: '',
    antecedenteGlucosaAlta: '',
    antecedenteFamiliar: ''
  });

  // Estado para almacenar el resultado que devuelve la API
  const [datosResultado, setDatosResultado] = useState(null);

  const handleChange = (e) => {
    setRespuestas({
      ...respuestas,
      [e.target.name]: e.target.value
    });
  };

  const siguientePaso = () => setPasoActual((prev) => prev + 1);
  const pasoAnterior = () => setPasoActual((prev) => prev - 1);

  // Función para resetear el formulario y volver al inicio
  const reiniciarEvaluacion = () => {
    setRespuestas({
      edad: '', peso: '', altura: '', perimetro: '',
      actividadFisica: '', consumoFrutas: '',
      medicacionHipertension: '', antecedenteGlucosaAlta: '', antecedenteFamiliar: ''
    });
    setDatosResultado(null);
    setPasoActual(1);
  };

  // Función de envío de datos
  const enviarDatos = async (e) => {
    e.preventDefault();

    try {
      const respuestaServidor = await api(`${devServerUrl}/api/evaluacion`, {
        method: 'POST',
        body: JSON.stringify(respuestas)
      });

      if (respuestaServidor.ok) {
        const resultado = await respuestaServidor.json();

        // Calculamos el IMC aquí para pasárselo a la vista de resultados
        const pesoFloat = parseFloat(respuestas.peso);
        const alturaFloat = parseFloat(respuestas.altura);
        const imcCalculado = pesoFloat / (alturaFloat * alturaFloat);

        // Guardamos los datos del diagnóstico
        setDatosResultado({
          puntaje: resultado.puntaje,
          nivelRiesgo: resultado.nivelRiesgo,
          imc: imcCalculado
        });

        // Transición a la pantalla de resultados
        setPasoActual(4);

      } else {
        console.error("Error al procesar la evaluación en el servidor");
        alert("Ocurrió un error al guardar los datos. Inténtalo de nuevo.");
      }
    } catch (error) {
      console.error("Error de conexión con la API:", error);
      alert("Error de conexión. Asegúrate de que el backend esté corriendo.");
    }
  };

  return (
    <div>
      {pasoActual === 1 && (
        <Paso1
          respuestas={respuestas}
          handleChange={handleChange}
          siguientePaso={siguientePaso}
        />
      )}
      {pasoActual === 2 && (
        <Paso2
          respuestas={respuestas}
          handleChange={handleChange}
          siguientePaso={siguientePaso}
          pasoAnterior={pasoAnterior}
        />
      )}
      {pasoActual === 3 && (
        <Paso3
          respuestas={respuestas}
          handleChange={handleChange}
          pasoAnterior={pasoAnterior}
          enviarDatos={enviarDatos}
        />
      )}
      {pasoActual === 4 && (
        <Resultados
          datosResultado={datosResultado}
          reiniciarEvaluacion={reiniciarEvaluacion}
        />
      )}
    </div>
  );
};

export default App;