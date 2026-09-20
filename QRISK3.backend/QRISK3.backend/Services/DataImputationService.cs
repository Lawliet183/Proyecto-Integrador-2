using QRISK3.backend.Models;

namespace QRISK3.backend.Services;

public class DataImputationService
{
	public PatientData PreparePatientData(PatientData rawData)
	{
		// 1. Evaluación e Imputación de la Presión Arterial
		bool sysBpImputed = !rawData.SystolicBloodPressure.HasValue;
		double finalSysBp = rawData.SystolicBloodPressure ??
							CalculateDefaultSysBp(rawData.Age, rawData.IsMale, rawData.IsTreatedForHypertension);

		// 2. Evaluación e Imputación del Colesterol
		bool cholImputed = !rawData.CholesterolHdlRatio.HasValue;
		double finalChol = rawData.CholesterolHdlRatio ?? ( rawData.IsMale ? 4.5 : 4.0 );

		// 3. Evaluación, Cálculo e Imputación del IMC
		double? bmiCalculado = rawData.Bmi;

		// Si no enviaron el BMI pre-calculado pero sí tenemos peso y altura válidos
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
		if (isTreated) bp += 15.0;
		return bp;
	}
}