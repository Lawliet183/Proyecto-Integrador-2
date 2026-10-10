import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContainer, AuthTitle, PrimaryButton } from './AuthStyles';
import { WizardCard, StepIndicator, ButtonGroup, SecondaryButton } from './WizardStyles';

// Importamos los sub-componentes
import Step1Demographics from './Step1Demographics';
import Step2Clinical from './Step2Clinical';
import Step3Comorbidities from './Step3Comorbidities';
import DiagnosticResult from './DiagnosticResult';


const devServerUrl = import.meta.env.VITE_DEV_SERVER_URL;


const EvaluationForm = () => {
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  // Estado para manejar la vista de resultados
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resultData, setResultData] = useState(null);

  const [formError, setFormError] = useState('');
  
  // Estado global del formulario (PatientData)
  const [formData, setFormData] = useState({
    // Paso 1: Demográficos y Físicos
    weight: '',
    height: '',
    ethnicityCode: 1,
    smokeCategory: 1,

    // Paso 2: Clínicos y Laboratorio
    systolicBloodPressure: '',
    cholesterolHdlRatio: '',
    isTreatedForHypertension: false,

    // Paso 3: Comorbilidades
    hasType1Diabetes: false,
    hasType2Diabetes: false,
    hasFamilyHistoryCvd: false,
    hasChronicKidneyDisease: false,
    hasMigraine: false,
    hasRheumatoidArthritis: false,
    hasSevereMentalIllness: false,
    hasSLE: false,
    hasInvoluntaryWeightLoss: false, // Variable de alerta clinica
    hasErectileDysfunction: false
  });

  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Convertimos los valores numericos de los selects/inputs
    let finalValue = value;
    if (type === 'number') {
      finalValue = value !== '' ? parseFloat(value) : '';
    } else if (name === 'ethnicityCode' || name === 'smokeCategory') {
      finalValue = parseInt(value, 10);
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : finalValue
    }));
  };

  const nextStep = () => {
    setFormError('');

    // Validaciones del Paso 1 (Demograficos y Fisicos)
    if (currentStep === 1) {
      if (formData.weight !== null && formData.weight !== '') {
        if (formData.weight < 20 || formData.weight > 300) {
          setFormError('Por favor, ingresa un peso válido en kilogramos (ej. 75.5).');
          return;
        }
      }

      if (formData.height !== null && formData.height !== '') {
        // Si el usuario digita algo mayor a 3 (ej. 178), asumimos que uso centímetros
        if (formData.height < 0.5 || formData.height > 3.0) {
          setFormError('Por favor, ingresa una altura válida en metros (ej. 1.70).');
          return;
        }
      }
    }
    // Validaciones del Paso 2 (Laboratorio y Clinico)
    else if (currentStep === 2) {
      if (formData.systolicBloodPressure !== null && formData.systolicBloodPressure !== '') {
        if (formData.systolicBloodPressure < 70 || formData.systolicBloodPressure > 250) {
          setFormError('Por favor, ingresa un valor de presión sistólica válido (entre 70 y 250 mmHg).');
          return;
        }
      }

      if (formData.cholesterolHdlRatio !== null && formData.cholesterolHdlRatio !== '') {
        if (formData.cholesterolHdlRatio < 1.0 || formData.cholesterolHdlRatio > 15.0) {
          setFormError('Por favor, ingresa un ratio de colesterol válido (entre 1.0 y 15.0).');
          return;
        }
      }
    }

    // Si pasa las validaciones, avanza
    setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  };
  
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      // Limpieza del Payload
      // Clonamos el estado para no mutar directamente formData
      const cleanedPayload = { ...formData };

      // Recorremos las propiedades y convertimos los textos vacíos a null
      Object.keys(cleanedPayload).forEach(key => {
        if (cleanedPayload[key] === '') {
          cleanedPayload[key] = null;
        }
      });

      const response = await fetch(`${devServerUrl}/api/evaluacion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        // Enviamos el payload limpio, no el formData original
        body: JSON.stringify(cleanedPayload)
      });

      const data = await response.json().catch(() => null);

      if (response.ok && data?.success) {
        const calcImc = formData.weight && formData.height
          ? formData.weight / (formData.height * formData.height)
          : 27.0;

        setResultData({
          riskPercentage: data.riskScore,
          imc: calcImc
        });
      } else {
        setFormError(data?.message || 'Ocurrió un problema al procesar los datos de tu evaluación. Por favor, intenta de nuevo.');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error) {
      setFormError('Parece que perdimos la conexión con el sistema médico. Por favor, revisa tu internet o inténtalo más tarde.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setResultData(null);
    navigate('/dashboard');
  };

  // Función renderizadora del Wizard
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1Demographics formData={formData} handleChange={handleChange} />;
      case 2:
        return <Step2Clinical formData={formData} handleChange={handleChange} />;
      case 3:
        return <Step3Comorbidities formData={formData} handleChange={handleChange} />;
      default:
        return null;
    }
  };
  
  
  // Si ya tenemos resultados, renderizamos el componente de Diagnóstico
  if (resultData) {
    return (
      <DiagnosticResult
        riskPercentage={resultData.riskPercentage}
        imc={resultData.imc}
        onGoToDashboard={handleReset}
      />
    );
  }
  

  return (
    <AuthContainer>
      <WizardCard>
        <AuthTitle>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
          </svg>
          Evaluación de Riesgo
        </AuthTitle>
        <StepIndicator>Paso {currentStep} de {totalSteps}</StepIndicator>
        
        {/* Bloque visual para errores de validación */}
        {formError && (
          <div style={{
            backgroundColor: '#fdf3f2',
            color: '#b3261e',
            padding: '10px 15px',
            borderRadius: '6px',
            marginBottom: '20px',
            fontSize: '14px',
            border: '1px solid #f2b7b5'
          }}>
            {formError}
          </div>
        )}

        {/* Inyectamos el paso actual */}
        {renderStep()}

        <ButtonGroup>
          {currentStep > 1 ? (
            <SecondaryButton onClick={prevStep} type="button" disabled={isSubmitting}>
              Atrás
            </SecondaryButton>
          ) : (
            <div></div> /* Espaciador */
          )}

          {currentStep < totalSteps ? (
            <PrimaryButton onClick={nextStep} type="button">
              Siguiente
            </PrimaryButton>
          ) : (
            <PrimaryButton onClick={handleSubmit} type="button" disabled={isSubmitting}>
              {isSubmitting ? 'Calculando...' : 'Finalizar Evaluación'}
            </PrimaryButton>
          )}
        </ButtonGroup>
      </WizardCard>
    </AuthContainer>
  );
};


export default EvaluationForm;