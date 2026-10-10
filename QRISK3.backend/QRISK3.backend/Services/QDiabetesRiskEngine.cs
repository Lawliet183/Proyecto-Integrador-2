using QRISK3.backend.Interfaces;
using QRISK3.backend.Models;
using QRISK3.backend.Models.Strategies;
using System;

namespace QRISK3.backend.Services;

public class QDiabetesRiskEngine
{
	// Almacenamos todas las estrategias registradas
	private readonly IEnumerable<IQDiabetesModel> _models;

	public QDiabetesRiskEngine(IEnumerable<IQDiabetesModel> models)
	{
		_models = models;
	}

	public double Calculate10YearRisk(PatientData cleanedPatientData)
	{
		// Filtrar la coleccion para obtener la estrategia correcta
		IQDiabetesModel activeModel = cleanedPatientData.IsMale
			? _models.OfType<MaleQDiabetesModel>().First()
			: _models.OfType<FemaleQDiabetesModel>().First();

		// Obtener el predictor lineal ('a' en el codigo C original)
		double linearPredictor = activeModel.CalculateLinearPredictor(cleanedPatientData);

		// Ecuacion matemática final 
		double hazardMultiplier = Math.Exp(linearPredictor);
		double survivalProbability = Math.Pow(activeModel.BaselineSurvival, hazardMultiplier);

		double riskPercentage = ( 1 - survivalProbability ) * 100;

		return Math.Round(riskPercentage, 2);
	}
}