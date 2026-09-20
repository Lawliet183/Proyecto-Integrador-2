using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QRISK3.backend.Entities;

[Table("Usuario")]
public class Usuario
{
	[Key]
	[Column("id")]
	public int Id { get; set; }

	[Required]
	[MaxLength(150)]
	[Column("correo_electronico")]
	public string CorreoElectronico { get; set; }

	[Required]
	[MaxLength(255)]
	[Column("password_hash")]
	public string PasswordHash { get; set; }

	// En EF Core, usar un string para mapear un ENUM de MySQL es una práctica segura
	[Required]
	[Column("rol", TypeName = "enum('Paciente', 'Administrador')")]
	public string Rol { get; set; } = "Paciente";

	[Column("fecha_registro")]
	public DateTime FechaRegistro { get; set; } = DateTime.UtcNow;

	// --- Propiedad de Navegación ---
	// Representa la relación 1:1 hacia el paciente (un usuario tiene un solo perfil de paciente)
	public virtual Paciente Paciente { get; set; }
}