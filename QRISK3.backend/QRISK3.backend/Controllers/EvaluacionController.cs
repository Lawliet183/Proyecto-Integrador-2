using System;
using System.Net.Cache;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QRISK3.backend.Data;
using QRISK3.backend.Entities;
using QRISK3.backend.Models;
using QRISK3.backend.Services;

namespace QRISK3.backend.Controllers;

[ApiController]
[Route("api/pacientes/{expedienteId}/[controller]")]
public class EvaluacionController : ControllerBase
{
	private readonly AppDbContext _dbContext;
	private readonly DataImputationService _imputationService;
	private readonly QDiabetesRiskEngine _riskEngine;

	// Inyectamos el DbContext y los servicios del algoritmo
	public EvaluacionController(
		AppDbContext dbContext,
		DataImputationService imputationService,
		QDiabetesRiskEngine riskEngine)
	{
		_dbContext = dbContext;
		_imputationService = imputationService;
		_riskEngine = riskEngine;
	}

	[HttpPost]
	[Authorize]
	public async Task<IActionResult> CrearEvaluacion(int expedienteId, [FromBody] PatientData rawData)
	{
		try
		{
			// 1. Obtener el expediente y los datos del paciente unidos desde MySQL
			var expediente = await _dbContext.ExpedientesClinicos
				.Include(e => e.Paciente) // Navegamos la llave foránea hacia el Paciente
				.FirstOrDefaultAsync(e => e.Id == expedienteId);

			if (expediente == null || expediente.Paciente == null)
			{
				return NotFound(new { Success = false, Message = "El expediente clínico no existe o no tiene paciente asociado." });
			}

			var paciente = expediente.Paciente;

			// 2. Calcular la edad exacta al día de hoy
			var hoy = DateTime.UtcNow.Date;
			var edad = hoy.Year - paciente.FechaNacimiento.Year;
			// Restar un año si aún no ha cumplido años en el año en curso
			if (paciente.FechaNacimiento.Date > hoy.AddYears(-edad))
			{
				edad--;
			}

			// 3. Inyectar de forma segura los valores demográficos en el payload
			rawData = rawData with
			{
				Age = edad,
				IsMale = ( paciente.SexoBiologico == "Masculino" )
			};

			// 4. Procesar reglas de negocio (Limpieza y Cálculo de QDiabetes/QRISK3)
			PatientData cleanData = _imputationService.PreparePatientData(rawData);
			double riskPercentage = _riskEngine.Calculate10YearRisk(cleanData);

			// 5. Construir la entidad
			EvaluacionRiesgo nuevaEvaluacion = MapearAEvaluacion(expedienteId, cleanData, riskPercentage);

			// 6. Persistir
			_dbContext.EvaluacionesRiesgo.Add(nuevaEvaluacion);
			await _dbContext.SaveChangesAsync();

			return Ok(new
			{
				Success = true,
				EvaluacionId = nuevaEvaluacion.Id,
				RiskScore = riskPercentage,
				Message = $"Evaluación registrada correctamente."
			});
		}
		catch (Exception ex)
		{
			return StatusCode(500, new { Success = false, Error = ex.Message });
		}
	}


	// Método privado cuya única responsabilidad es construir el objeto de BD
	private EvaluacionRiesgo MapearAEvaluacion(int expedienteId, PatientData cleanData, double riskPercentage)
	{
		return new EvaluacionRiesgo
		{
			ExpedienteId = expedienteId,
			FechaEvaluacion = DateTime.UtcNow,

			// Bloque Demográfico / Físico
			EdadAlEvaluar = (int) cleanData.Age,
			Peso = (decimal?) cleanData.Weight, // Guardará NULL si el paciente no lo digitó
			Altura = (decimal?) cleanData.Height, // Guardará NULL si el paciente no lo digitó
			Imc = (decimal) cleanData.Bmi.Value,
			ImcImputado = cleanData.IsBmiImputed, // La bandera de trazabilidad que diseñamos

			OrigenEtnico = cleanData.EthnicityCode,
			CategoriaTabaquismo = cleanData.SmokeCategory,
			IndiceTownsend = (decimal) cleanData.TownsendDeprivationScore,

			// Bloque Clínico y Banderas
			PresionSistolica = (decimal) cleanData.SystolicBloodPressure.Value,
			PresionSistolicaImputada = cleanData.IsSysBpImputed,
			DesviacionStdPresion = (decimal) cleanData.SystolicBloodPressureStdDev,

			RatioColesterolHdl = (decimal) cleanData.CholesterolHdlRatio.Value,
			RatioColesterolImputado = cleanData.IsCholesterolImputed,

			// Bloque de Comorbilidades
			TratamientoHipertension = cleanData.IsTreatedForHypertension,
			FibrilacionAuricular = cleanData.HasAtrialFibrillation,
			DiabetesTipo1 = cleanData.HasType1Diabetes,
			DiabetesTipo2 = cleanData.HasType2Diabetes,
			HistorialFamiliarCvd = cleanData.HasFamilyHistoryCvd,
			AntipsicoticosAtipicos = cleanData.HasAtypicalAntipsychotics,
			Corticosteroides = cleanData.HasCorticosteroids,
			Migrana = cleanData.HasMigraine,
			ArtritisReumatoide = cleanData.HasRheumatoidArthritis,
			EnfermedadRenalCronica = cleanData.HasChronicKidneyDisease,
			EnfermedadMentalGrave = cleanData.HasSevereMentalIllness,
			Lupus = cleanData.HasSLE,
			DisfuncionErectil = cleanData.HasErectileDysfunction,
			BajonPesoInvoluntario = cleanData.HasInvoluntaryWeightLoss,

			// Resultado de la predicción
			RiesgoPorcentaje = (decimal) riskPercentage
		};
	}
}