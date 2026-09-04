using Proyecto.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Proyecto.Models
{
	[Table("Expediente_Clinico")]
	public class ExpedienteClinico
	{
		[Key]
		[Column("id")]
		public int Id { get; set; }

		[Required]
		[Column("paciente_id")]
		public int PacienteId { get; set; }

		[Column("fecha_creacion")]
		public DateTime FechaCreacion { get; set; }

		// Propiedad de navegación (Relación 1 a 1 con Paciente)
		[ForeignKey("PacienteId")]
		public Paciente? Paciente { get; set; }

		// Propiedad de navegación (Relación 1 a N con Evaluaciones)
		public List<EvaluacionRiesgo> Evaluaciones { get; set; } = new List<EvaluacionRiesgo>();
	}
}