using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Diagnostics;
using System.Net.Cache;
using System.Threading.Tasks;
using QRISK3.backend.Data;
using QRISK3.backend.Entities;
using QRISK3.backend.Models;
using QRISK3.backend.Services;

namespace QRISK3.backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class EvaluacionController : ControllerBase
{
	private readonly AppDbContext _context;
	private readonly DataImputationService _imputationService;
	private readonly QDiabetesRiskEngine _riskEngine;


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
	public async Task<IActionResult> CrearEvaluacion([FromBody] PatientData rawData)
	{
		try
		{
			// Extraer el ID de usuario del token
			var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

			// Si no se encuentra o esta vacio, retornamos el error al cliente
			if (string.IsNullOrEmpty(userId))
			{
				return Unauthorized(new
				{
					success = false,
					message = "Token inválido."
				});
			}

			// Obtener el expediente y los datos del paciente unidos desde la BD
			var expediente = await _context.ExpedientesClinicos
				.Include(e => e.Paciente)
				.FirstOrDefaultAsync(e => e.Paciente.UsuarioId.ToString() == userId);

			// Si el expediente no se encuentra, retornar un error al cliente
			if (expediente == null || expediente.Paciente == null)
			{
				return NotFound(new
				{
					success = false,
					message = "El expediente clínico no existe o no tiene paciente asociado."
				});
			}

			var paciente = expediente.Paciente;

			// Calcular la edad exacta al dia de hoy
			var hoy = DateTime.UtcNow.Date;
			var edad = hoy.Year - paciente.FechaNacimiento.Year;

			// Restar un año si aún no ha cumplido años en el año en curso
			if (hoy.DayOfYear < paciente.FechaNacimiento.DayOfYear)
				edad -= 1;

			// Inyectar de forma segura los valores demograficos en el payload
			rawData = rawData with
			{
				Age = edad,
				IsMale = ( paciente.SexoBiologico == "Masculino" )
			};

			// Procesar reglas de negocio (Limpieza y Calculo de QRISK3)
			PatientData cleanData = _imputationService.PreparePatientData(rawData);
			double riskPercentage = _riskEngine.Calculate10YearRisk(cleanData);

			// Construir la entidad
			EvaluacionRiesgo nuevaEvaluacion = MapearAEvaluacion(expediente.Id, cleanData, riskPercentage);

			// Guardar en la BD
			_context.EvaluacionesRiesgo.Add(nuevaEvaluacion);
			await _context.SaveChangesAsync();

			return Ok(new
			{
				success = true,
				evaluacionId = nuevaEvaluacion.Id,
				riskScore = riskPercentage,
				message = $"Evaluación registrada correctamente."
			});
		}
		catch (Exception ex)
		{
			Console.WriteLine($"[ERROR CRÍTICO] EvaluacionController: {ex.Message}");
			Console.WriteLine(ex.StackTrace);

			return StatusCode(500, new
			{
				success = false,
				message = "Ocurrió un problema inesperado al calcular el riesgo. Por favor, verifica tu conexión o inténtalo de nuevo en unos minutos."
			});
		}
	}

	[HttpGet("historial")]
	public async Task<IActionResult> ObtenerMiHistorial()
	{
		try
		{
			// Extraemos el ID del usuario directamente del token
			var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

			// Si no se encuentra o esta vacio, retornamos el error al cliente
			if (string.IsNullOrEmpty(userId))
			{
				return Unauthorized(new
				{
					success = false,
					message = "Token inválido."
				});
			}

			// Extraer las evaluaciones del usuario
			var evaluaciones = await _context.EvaluacionesRiesgo
				.Where(e => e.Expediente.Paciente.UsuarioId.ToString() == userId)
				.OrderByDescending(e => e.FechaEvaluacion)
				.Select(e => new
				{
					e.Id,
					e.FechaEvaluacion,
					e.EdadAlEvaluar,
					e.Imc,
					e.PresionSistolica,
					e.RiesgoPorcentaje
				})
				.ToListAsync();

			return Ok(new
			{
				success = true,
				data = evaluaciones
			});
		}
		catch (Exception ex)
		{
			Console.WriteLine($"[ERROR CRÍTICO] EvaluacionController: {ex.Message}");
			Console.WriteLine(ex.StackTrace);

			return StatusCode(500, new
			{
				success = false,
				message = "No fue posible cargar su historial médico. Por favor, intenta de nuevo más tarde."
			});
		}
	}

	[HttpGet("{evaluacionId}")]
	public async Task<IActionResult> ObtenerDetalle(int evaluacionId)
	{
		try
		{
			// Extraer el ID de usuario del token
			var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

			// Si no se encuentra o esta vacio, retornamos el error al cliente
			if (string.IsNullOrEmpty(userId))
			{
				return Unauthorized(new
				{
					success = false,
					message = "Token inválido."
				});
			}

			// Extraer la evaluacion que nos pidio el usuario
			var evaluacion = await _context.EvaluacionesRiesgo
				.Where(e => e.Id == evaluacionId && e.Expediente.Paciente.UsuarioId.ToString() == userId)
				.FirstOrDefaultAsync();

			// Si no se encuentra la evaluacion, retornar un error al cliente
			if (evaluacion == null)
			{
				return NotFound(new
				{
					success = false,
					message = "Evaluación no encontrada o no autorizada."
				});
			}

			return Ok(new
			{
				success = true,
				data = evaluacion
			});
		}
		catch (Exception ex)
		{
			Console.WriteLine($"[ERROR CRÍTICO] EvaluacionController: {ex.Message}");
			Console.WriteLine(ex.StackTrace);

			return StatusCode(500, new
			{
				success = false,
				message = "No fue posible cargar los detalles de tu evaluación médica en este momento. Por favor, intenta de nuevo más tarde."
			});
		}
	}


	// Utilizado para construir el objeto de EvaluacionRiesgo de la BD
	private EvaluacionRiesgo MapearAEvaluacion(int expedienteId, PatientData cleanData, double riskPercentage)
	{
		return new EvaluacionRiesgo
		{
			ExpedienteId = expedienteId,
			FechaEvaluacion = DateTime.UtcNow,

			// Bloque Demografico / Fisico
			EdadAlEvaluar = (int) cleanData.Age,
			Peso = (decimal?) cleanData.Weight, // Guardará NULL si el paciente no lo digitó
			Altura = (decimal?) cleanData.Height, // Guardará NULL si el paciente no lo digitó
			Imc = (decimal) cleanData.Bmi.Value,
			ImcImputado = cleanData.IsBmiImputed,

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

			// Resultado de la prediccion
			RiesgoPorcentaje = (decimal) riskPercentage
		};
	}
}