using QRISK3.backend.Interfaces;
using QRISK3.backend.Models;
using QRISK3.backend.Models.Strategies;
using System;

namespace QRISK3.backend.Services;

public class QDiabetesRiskEngine
{
	// Almacenamos todas las estrategias registradas
	private readonly IEnumerable<IQDiabetesModel> _models;

	// .NET inyectará automáticamente TODAS las clases que implementen IQDiabetesModel
	public QDiabetesRiskEngine(IEnumerable<IQDiabetesModel> models)
	{
		_models = models;
	}

	public double Calculate10YearRisk(PatientData cleanedPatientData)
	{
		// 1. Filtrar la colección para obtener la estrategia correcta (Polimorfismo limpio)
		IQDiabetesModel activeModel = cleanedPatientData.IsMale
			? _models.OfType<MaleQDiabetesModel>().First()
			: _models.OfType<FemaleQDiabetesModel>().First();

		// 2. Obtener el predictor lineal ('a' en el código C)
		double linearPredictor = activeModel.CalculateLinearPredictor(cleanedPatientData);

		// 3. Ecuación matemática final 
		double hazardMultiplier = Math.Exp(linearPredictor);
		double survivalProbability = Math.Pow(activeModel.BaselineSurvival, hazardMultiplier);

		double riskPercentage = ( 1 - survivalProbability ) * 100;

		return Math.Round(riskPercentage, 2);
	}
}