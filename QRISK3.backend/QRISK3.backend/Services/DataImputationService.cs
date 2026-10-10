using QRISK3.backend.Models;

namespace QRISK3.backend.Services;

public class DataImputationService
{
	public PatientData PreparePatientData(PatientData rawData)
	{
		// Evaluacion e Imputacion de la Presión Arterial
		bool sysBpImputed = !rawData.SystolicBloodPressure.HasValue;
		double finalSysBp = rawData.SystolicBloodPressure ??
							CalculateDefaultSysBp(rawData.Age, rawData.IsMale, rawData.IsTreatedForHypertension);

		// Evaluacion e Imputacion del Colesterol
		bool cholImputed = !rawData.CholesterolHdlRatio.HasValue;
		double finalChol = rawData.CholesterolHdlRatio ?? ( rawData.IsMale ? 4.5 : 4.0 );

		// Evaluacion, Calculo e Imputacion del IMC
		double? bmiCalculado = rawData.Bmi;

		// Si no enviaron el BMI pre-calculado pero si tenemos peso y altura validos, lo calculamos a partir del peso y la altura
		if (!bmiCalculado.HasValue && rawData.Weight.HasValue && rawData.Height.HasValue && rawData.Height.Value > 0)
		{
			bmiCalculado = rawData.Weight.Value / ( rawData.Height.Value * rawData.Height.Value );
		}

		// Determinamos si finalmente tuvimos que imputar por falta de datos
		bool bmiImputed = !bmiCalculado.HasValue;
		double finalBmi = bmiCalculado ?? ( rawData.IsMale ? 27.0 : 26.5 );

		return rawData with
		{
			SystolicBloodPressure = finalSysBp,
			IsSysBpImputed = sysBpImputed,

			CholesterolHdlRatio = finalChol,
			IsCholesterolImputed = cholImputed,

			Bmi = finalBmi,
			IsBmiImputed = bmiImputed
		};
	}


	private double CalculateDefaultSysBp(double age, bool isMale, bool isTreated)
	{
		double bp = isMale ? 119.85 + ( 0.22 * age ) : 113.84 + ( 0.32 * age );

		// Si es tratado por hipertension lo penalizamos (aumentamos su riesgo)
		if (isTreated)
			bp += 15.0;

		return bp;
	}
}