using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QRISK3.backend.Entities;

[Table("Paciente")]
public class Paciente
{
	[Key]
	[Column("id")]
	public int Id { get; set; }

	[Required]
	[Column("usuario_id")]
	public int UsuarioId { get; set; }


	[Required]
	[MaxLength(100)]
	[Column("nombres")]
	public string Nombres { get; set; }

	[Required]
	[MaxLength(100)]
	[Column("apellidos")]
	public string Apellidos { get; set; }

	[Required]
	[Column("fecha_nacimiento", TypeName = "date")]
	public DateTime FechaNacimiento { get; set; }

	[Required]
	[Column("sexo_biologico", TypeName = "enum('Masculino', 'Femenino')")]
	public string SexoBiologico { get; set; }


	// Propiedades de Navegación

	// Relacion hacia atras con Usuario (1:1)
	[ForeignKey("UsuarioId")]
	public virtual Usuario Usuario { get; set; }

	// Relacion hacia adelante con su Expediente Clinico (1:1)
	public virtual ExpedienteClinico Expediente { get; set; }
}