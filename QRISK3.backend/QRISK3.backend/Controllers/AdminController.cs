using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QRISK3.backend.Data;

namespace QRISK3.backend.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize(Roles = "Administrador")] // Protección estricta basada en roles
public class AdminController : ControllerBase
{
	private readonly AppDbContext _context;


	public AdminController(AppDbContext context)
	{
		_context = context;
	}


	[HttpGet("pacientes")]
	public async Task<IActionResult> ObtenerPacientes()
	{
		try
		{
			// Seleccionamos solo los datos necesarios para la vista general
			var pacientes = await _context.Pacientes
				.Include(p => p.Usuario)
				.Select(p => new
				{
					p.Id,
					p.Nombres,
					p.Apellidos,
					p.SexoBiologico,
					// Calculamos la edad en tiempo de ejecucion para la tabla
					Edad = DateTime.Today.Year - p.FechaNacimiento.Year -
							( DateTime.Today.DayOfYear < p.FechaNacimiento.DayOfYear ? 1 : 0 ),
					Correo = p.Usuario.CorreoElectronico,
					p.Usuario.FechaRegistro
				})
				.OrderByDescending(p => p.FechaRegistro)
				.ToListAsync();

			return Ok(new 
			{
				success = true,
				data = pacientes
			});
		}
		catch (Exception ex)
		{
			Console.WriteLine($"[ERROR CRÍTICO] AdminController: {ex.Message}");
			Console.WriteLine(ex.StackTrace);

			return StatusCode(500, new
			{
				success = false,
				message = "No se pudo cargar la información del sistema. Contacte a soporte técnico si el problema persiste."
			});
		}
	}

	[HttpGet("historial/{pacienteId}")]
	public async Task<IActionResult> ObtenerHistorialPorPaciente(int pacienteId)
	{
		try
		{
			// Buscar al paciente por ID
			var paciente = await _context.Pacientes.FindAsync(pacienteId);

			// Si no se encuentra, indicarselo al cliente
			if (paciente == null)
			{
				return NotFound(new
				{
					success = false,
					message = "Paciente no encontrado"
				});
			}

			var evaluaciones = await _context.EvaluacionesRiesgo
				// Navegamos por la relación: Evaluacion -> Expediente -> Paciente
				.Where(e => e.Expediente.PacienteId == pacienteId)
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

			return Ok(new
			{
				success = true,
				nombrePaciente = $"{paciente.Nombres} {paciente.Apellidos}",
				data = evaluaciones
			});
		}
		catch (Exception ex)
		{
			Console.WriteLine($"[ERROR CRÍTICO] AdminController: {ex.Message}");
			Console.WriteLine(ex.StackTrace);

			return StatusCode(500, new
			{
				success = false,
				message = "No se pudo cargar la información del sistema. Contacte a soporte técnico si el problema persiste."
			});
		}
	}

	[HttpGet("evaluacion/{evaluacionId}")]
	public async Task<IActionResult> ObtenerDetalleAdmin(int evaluacionId)
	{
		try
		{
			// Buscar la evaluacion de riesgo por ID
			var evaluacion = await _context.EvaluacionesRiesgo.FirstOrDefaultAsync(e => e.Id == evaluacionId);

			// Si la evaluacion no se encuentra, indicarselo al cliente
			if (evaluacion == null)
			{
				return NotFound(new
				{
					success = false,
					message = "Evaluación no encontrada."
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
			Console.WriteLine($"[ERROR CRÍTICO] AdminController: {ex.Message}");
			Console.WriteLine(ex.StackTrace);

			return StatusCode(500, new
			{
				success = false,
				message = "No se pudo cargar la información del sistema. Contacte a soporte técnico si el problema persiste."
			});
		}
	}
}

