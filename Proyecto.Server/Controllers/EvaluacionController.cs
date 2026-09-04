using Microsoft.AspNetCore.Mvc;
using Proyecto.Data;
using Proyecto.Models;
using System;
using System.Threading.Tasks;

namespace Proyecto.Controllers
{
	[ApiController]
	[Route("/api")]
	public class EvaluacionController : ControllerBase
	{
		private readonly ApplicationDbContext _context;

		public EvaluacionController(ApplicationDbContext context)
		{
			_context = context;
		}

		[Route("evaluacion")]
		[HttpPost]
		public async Task<IActionResult> GuardarEvaluacion([FromBody] EvaluacionRequestDto request)
		{
			// Valida que el JSON recibido coincida con la estructura esperada
			if (!ModelState.IsValid)
				return BadRequest(ModelState);

			try
			{
				// Cálculo del IMC (Peso / Altura al cuadrado)
				decimal imcCalculado = request.Peso / ( request.Altura * request.Altura );

				// Procesamiento del Algoritmo Predictivo (Test FINDRISK)
				int puntaje = CalcularPuntajeFindrisk(request, imcCalculado);
				string nivel = DeterminarNivelRiesgo(puntaje);

				// Mapeo de Datos a la Entidad
				// NOTA: Como en el formulario de React no pedimos el nombre del paciente,
				// estamos asignando un ExpedienteId = 1 temporalmente.
				var nuevaEvaluacion = new EvaluacionRiesgo
				{
					ExpedienteId = 1,
					EdadAlEvaluar = request.Edad,
					Peso = request.Peso,
					Altura = request.Altura,
					Imc = Math.Round(imcCalculado, 2),
					PerimetroAbdominal = request.Perimetro,
					RealizaActividadFisica = request.ActividadFisica == "Si",
					ConsumeFrutasVerduras = request.ConsumoFrutas == "Todos los dias",
					MedicacionHipertension = request.MedicacionHipertension == "Si",
					AntecedenteGlucosaAlta = request.AntecedenteGlucosaAlta == "Si",
					AntecedenteFamiliarDiabetes = request.AntecedenteFamiliar,
					BajonPesoInvoluntario = false,
					PuntajeTotal = puntaje,
					NivelRiesgo = nivel
				};

				// Guardar en MySQL
				_context.EvaluacionesRiesgo.Add(nuevaEvaluacion);
				await _context.SaveChangesAsync();

				// Respuesta exitosa hacia el frontend
				return Ok(new
				{
					mensaje = "Evaluación procesada y guardada exitosamente",
					puntaje = puntaje,
					nivelRiesgo = nivel
				});
			}
			catch (Exception ex)
			{
				return StatusCode(500, $"Error interno del servidor: {ex.Message}");
			}
		}


		private int CalcularPuntajeFindrisk(EvaluacionRequestDto req, decimal imc)
		{
			int puntos = 0;

			// Puntuación por Edad
			if (req.Edad >= 45 && req.Edad <= 54)
				puntos += 2;
			else if (req.Edad >= 55) 
				puntos += 3;

			// Puntuación por IMC
			if (imc >= 25 && imc <= 30)
				puntos += 1;
			else if (imc > 30)
				puntos += 3;

			// Actividad Física
			if (req.ActividadFisica == "No")
				puntos += 2;

			// Frutas y Verduras
			if (req.ConsumoFrutas == "No todos los dias")
				puntos += 1;

			// Medicación Hipertensión
			if (req.MedicacionHipertension == "Si")
				puntos += 2;

			// Glucosa Alta Histórica
			if (req.AntecedenteGlucosaAlta == "Si")
				puntos += 5;

			// Antecedentes Familiares
			if (req.AntecedenteFamiliar == "Si (2do Grado)")
				puntos += 3;
			else if (req.AntecedenteFamiliar == "Si (1er Grado)")
				puntos += 5;

			// Perímetro abdominal (Lógica estándar general simplificada)
			if (req.Perimetro >= 94 && req.Perimetro <= 102)
				puntos += 3;
			else if (req.Perimetro > 102)
				puntos += 4;

			return puntos;
		}

		private string DeterminarNivelRiesgo(int puntaje)
		{
			if (puntaje < 7)
				return "Bajo";
			if (puntaje <= 11)
				return "Ligeramente elevado";
			if (puntaje <= 14)
				return "Moderado";
			if (puntaje <= 20)
				return "Alto";

			return "Muy Alto";
		}
	}

	// Esta clase sirve exclusivamente para capturar el JSON de React con exactitud
	public class EvaluacionRequestDto
	{
		public int Edad { get; set; }
		public decimal Peso { get; set; }
		public decimal Altura { get; set; }
		public int Perimetro { get; set; }
		public string ActividadFisica { get; set; }
		public string ConsumoFrutas { get; set; }
		public string MedicacionHipertension { get; set; }
		public string AntecedenteGlucosaAlta { get; set; }
		public string AntecedenteFamiliar { get; set; }
	}
}