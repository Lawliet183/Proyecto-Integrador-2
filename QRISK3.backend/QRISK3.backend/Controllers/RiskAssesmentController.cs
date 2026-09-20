using Microsoft.AspNetCore.Mvc;
using QRISK3.backend.Models;
using QRISK3.backend.Services;
using System.Runtime.InteropServices;

namespace QRISK3.backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RiskAssessmentController : ControllerBase
{
	private readonly DataImputationService _imputationService;
	private readonly QDiabetesRiskEngine _riskEngine;

	// El controlador pide los servicios; .NET se los entrega listos para usar
	public RiskAssessmentController(
		DataImputationService imputationService,
		QDiabetesRiskEngine riskEngine)
	{
		_imputationService = imputationService;
		_riskEngine = riskEngine;
	}

	[HttpPost("calculate")]
	public ActionResult<object> CalculateRisk([FromBody] PatientData incomingData)
	{
		try
		{
			// 1. Pasar los datos por el servicio de imputación (Limpieza y llenado de vacíos)
			PatientData cleanData = _imputationService.PreparePatientData(incomingData);

			// 2. Ejecutar el cálculo pesado
			double riskPercentage = _riskEngine.Calculate10YearRisk(cleanData);

			// 3. Retornar una respuesta JSON estructurada
			return Ok(new
			{
				Success = true,
				RiskScore = riskPercentage,
				Message = $"El riesgo estimado a 10 años es del {riskPercentage}%",
				ImputedValuesUsed = new
				{
					cleanData.Bmi,
					cleanData.SystolicBloodPressure,
					CholesterolRatio = cleanData.CholesterolHdlRatio
				}
			});
		}
		catch (Exception ex)
		{
			// Manejo básico de errores para evitar que la API colapse
			return StatusCode(500, new { Success = false, Error = ex.Message });
		}
	}
}