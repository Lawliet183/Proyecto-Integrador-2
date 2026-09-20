using QRISK3.backend.Models;

namespace QRISK3.backend.Interfaces;

public interface IQDiabetesModel
{
	double BaselineSurvival { get; }
	double CalculateLinearPredictor(PatientData patient);
}