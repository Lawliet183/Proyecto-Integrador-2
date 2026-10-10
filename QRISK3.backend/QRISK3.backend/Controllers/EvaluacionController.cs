using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QRISK3.backend.Data;
using QRISK3.backend.Entities;
using QRISK3.backend.Models;
using QRISK3.backend.Services;
using System;
using System.Diagnostics;
using System.Net.Cache;
using System.Threading.Tasks;

namespace QRISK3.backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EvaluacionController : ControllerBase
{
	private readonly AppDbContext _context;
	private readonly DataImputationService _imputationService;
	private readonly QDiabetesRiskEngine _riskEngine;

	// Inyectamos el DbContext y los servicios del algoritmo
	public EvaluacionController(
		AppDbContext dbContext,
		DataImputationService imputationService,
		QDiabetesRiskEngine riskEngine)
	{
		_context = dbContext;
		_imputationService = imputationService;
		_riskEngine = riskEngine;
	}

	[HttpPost]
	[Authorize]
	public async Task<IActionResult> CrearEvaluacion([FromBody] PatientData rawData)
	{
		try
		{
			var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

			if (string.IsNullOrEmpty(userId))
				return Unauthorized(new { Success = false, Message = "Token inválido." });

			// 1. Obtener el expediente y los datos del paciente unidos desde MySQL
			var expediente = await _context.ExpedientesClinicos
				.Include(e => e.Paciente) // Navegamos la llave foránea hacia el Paciente
				.FirstOrDefaultAsync(e => e.Paciente.UsuarioId.ToString() == userId);

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
			EvaluacionRiesgo nuevaEvaluacion = MapearAEvaluacion(expediente.Id, cleanData, riskPercentage);

			// 6. Persistir
			_context.EvaluacionesRiesgo.Add(nuevaEvaluacion);
			await _context.SaveChangesAsync();

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
			// El error real se queda en el servidor (puedes verlo en la consola)
			Console.WriteLine($"[ERROR CRÍTICO] EvaluacionController: {ex.Message}");
			Console.WriteLine(ex.StackTrace);

			// Al frontend solo le enviamos un mensaje orientativo
			return StatusCode(500, new
			{
				success = false,
				message = "Ocurrió un problema inesperado al calcular el riesgo. Por favor, verifica tu conexión o inténtalo de nuevo en unos minutos."
			});
		}
	}

	[HttpGet("historial")]
	[Authorize] // Solo requiere estar logueado (el frontend controla que sea paciente)
	public async Task<IActionResult> ObtenerMiHistorial()
	{
		// Extraemos el ID del usuario directamente del token (NameIdentifier)
		var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

		var evaluaciones = await _context.EvaluacionesRiesgo
			.Where(e => e.Expediente.Paciente.UsuarioId.ToString() == userId)
			.OrderByDescending(e => e.FechaEvaluacion)
			.Select(e => new {
				e.Id,
				e.FechaEvaluacion,
				e.EdadAlEvaluar,
				e.Imc,
				e.PresionSistolica,
				e.RiesgoPorcentaje
			})
			.ToListAsync();

		return Ok(new { success = true, data = evaluaciones });
	}

	[HttpGet("{id}")]
	[Authorize]
	public async Task<IActionResult> ObtenerDetalle(int id)
	{
		try
		{
			var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

			var evaluacion = await _context.EvaluacionesRiesgo
				.Where(e => e.Id == id && e.Expediente.Paciente.UsuarioId.ToString() == userId)
				.FirstOrDefaultAsync();

			if (evaluacion == null)
				return NotFound(new { success = false, message = "Evaluación no encontrada o no autorizada." });

			return Ok(new { success = true, data = evaluacion });
		}
		catch (Exception ex)
		{
			Console.WriteLine($"[ERROR CRÍTICO] EvaluacionController (ObtenerDetalle): {ex.Message}");
			return StatusCode(500, new
			{
				success = false,
				message = "No fue posible cargar los detalles de tu evaluación médica en este momento. Por favor, intenta de nuevo más tarde."
			});
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