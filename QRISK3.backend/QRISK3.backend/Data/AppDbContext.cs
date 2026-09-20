using Microsoft.EntityFrameworkCore;
using QRISK3.backend.Entities;

namespace QRISK3.backend.Data;

public class AppDbContext : DbContext
{
	public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
	{
	}

	// Registramos las tablas
	public DbSet<Usuario> Usuarios { get; set; }
	public DbSet<Paciente> Pacientes { get; set; }
	public DbSet<ExpedienteClinico> ExpedientesClinicos { get; set; }
	public DbSet<EvaluacionRiesgo> EvaluacionesRiesgo { get; set; }

	protected override void OnModelCreating(ModelBuilder modelBuilder)
	{
		base.OnModelCreating(modelBuilder);

		// 1. Configuración de la relación 1 a 1: Usuario <-> Paciente
		modelBuilder.Entity<Usuario>()
			.HasOne(u => u.Paciente)
			.WithOne(p => p.Usuario)
			.HasForeignKey<Paciente>(p => p.UsuarioId)
			.OnDelete(DeleteBehavior.Cascade); // Si se borra el usuario, se borra el paciente

		// 2. Configuración de la relación 1 a 1: Paciente <-> ExpedienteClinico
		modelBuilder.Entity<Paciente>()
			.HasOne(p => p.Expediente)
			.WithOne(e => e.Paciente)
			.HasForeignKey<ExpedienteClinico>(e => e.PacienteId)
			.OnDelete(DeleteBehavior.Cascade); // Si se borra el paciente, se borra su expediente

		// 3. Configuración de la relación 1 a Muchos: ExpedienteClinico <-> EvaluacionRiesgo
		modelBuilder.Entity<ExpedienteClinico>()
			.HasMany(e => e.Evaluaciones)
			.WithOne(ev => ev.Expediente)
			.HasForeignKey(ev => ev.ExpedienteId)
			.OnDelete(DeleteBehavior.Cascade); // Si se borra el expediente, se borran sus evaluaciones
	}
}