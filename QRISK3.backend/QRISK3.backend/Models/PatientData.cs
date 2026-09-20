namespace QRISK3.backend.Models;

/// <summary>
/// Representa todos los datos clínicos y demográficos necesarios para 
/// la calculadora de riesgo. Utiliza 'double?' para los campos de laboratorio 
/// que pueden ser imputados si el paciente los desconoce.
/// </summary>
public record PatientData(
	// Demográficos
	double Age,
	bool IsMale,
	int EthnicityCode,
	int SmokeCategory,
	double TownsendDeprivationScore,

	// Métricas Físicas (El peso y altura pueden ser nulos y llegar así a MySQL)
	double? Weight,
	double? Height,

	// Variables Clínicas con sus respectivas banderas de trazabilidad
	double? Bmi,
	double? SystolicBloodPressure,
	double? CholesterolHdlRatio,

	bool IsBmiImputed = false,
	bool IsSysBpImputed = false,
	bool IsCholesterolImputed = false,

	double SystolicBloodPressureStdDev = 0.0,

	// Historial Médico Cardiovascular y Metabólico
	bool IsTreatedForHypertension = false,
	bool HasAtrialFibrillation = false,
	bool HasType1Diabetes = false,
	bool HasType2Diabetes = false,
	bool HasFamilyHistoryCvd = false,

	// Condiciones Comórbidas
	bool HasAtypicalAntipsychotics = false,
	bool HasCorticosteroids = false,
	bool HasMigraine = false,
	bool HasRheumatoidArthritis = false,
	bool HasChronicKidneyDisease = false,
	bool HasSevereMentalIllness = false,
	bool HasSLE = false,
	bool HasErectileDysfunction = false,

	// Alerta Clínica Crítica (Exclusiva de tu proyecto)
	bool HasInvoluntaryWeightLoss = false
);