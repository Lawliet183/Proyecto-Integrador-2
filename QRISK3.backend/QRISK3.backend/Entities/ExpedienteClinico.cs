using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QRISK3.backend.Entities;

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
	public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;

	// --- Propiedades de Navegación ---

	// Relación hacia atrás (1:1 con Paciente)
	[ForeignKey("PacienteId")]
	public virtual Paciente Paciente { get; set; }

	// Relación hacia adelante (1 a Muchos con EvaluacionRiesgo)
	// Un expediente puede tener múltiples evaluaciones a lo largo de los años
	public virtual ICollection<EvaluacionRiesgo> Evaluaciones { get; set; } = new List<EvaluacionRiesgo>();
}