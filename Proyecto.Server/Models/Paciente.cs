using Proyecto.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Proyecto.Models
{
	[Table("Paciente")]
	public class Paciente
	{
		[Key]
		[Column("id")]
		public int Id { get; set; }

		[Required]
		[Column("nombres")]
		[MaxLength(100)]
		public string Nombres { get; set; } = string.Empty;

		[Required]
		[Column("apellidos")]
		[MaxLength(100)]
		public string Apellidos { get; set; } = string.Empty;

		[Required]
		[Column("fecha_nacimiento")]
		public DateTime FechaNacimiento { get; set; }

		[Required]
		[Column("sexo")]
		public string Sexo { get; set; } = string.Empty; // Mapearemos el ENUM como string

		[Column("fecha_registro")]
		public DateTime FechaRegistro { get; set; }

		// Propiedad de navegación (Relación 1 a 1)
		public ExpedienteClinico? ExpedienteClinico { get; set; }
	}
}