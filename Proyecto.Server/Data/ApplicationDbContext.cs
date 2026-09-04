using Microsoft.EntityFrameworkCore;
using Proyecto.Models;

namespace Proyecto.Data
{
	public class ApplicationDbContext : DbContext
	{
		public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
			: base(options)
		{
		}

		// DbSets representan las tablas en la base de datos
		public DbSet<Paciente> Pacientes { get; set; }
		public DbSet<ExpedienteClinico> ExpedientesClinicos { get; set; }
		public DbSet<EvaluacionRiesgo> EvaluacionesRiesgo { get; set; }

		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			base.OnModelCreating(modelBuilder);

			// 1. Configuración de la Relación 1 a 1 (Paciente - ExpedienteClinico)
			modelBuilder.Entity<Paciente>()
				.HasOne(p => p.ExpedienteClinico)
				.WithOne(e => e.Paciente)
				.HasForeignKey<ExpedienteClinico>(e => e.PacienteId)
				.OnDelete(DeleteBehavior.Cascade);

			// 2. Configuración de la Relación 1 a N (ExpedienteClinico - EvaluacionRiesgo)
			modelBuilder.Entity<ExpedienteClinico>()
				.HasMany(e => e.Evaluaciones)
				.WithOne(er => er.Expediente)
				.HasForeignKey(er => er.ExpedienteId)
				.OnDelete(DeleteBehavior.Cascade);

			// 3. Mapeo específico para los tipos ENUM de MySQL
			// Esto asegura que al hacer migraciones o validaciones, EF respete la estructura nativa de tu DB
			modelBuilder.Entity<Paciente>()
				.Property(p => p.Sexo)
				.HasColumnType("enum('Masculino', 'Femenino', 'Otro')");

			modelBuilder.Entity<EvaluacionRiesgo>()
				.Property(e => e.AntecedenteFamiliarDiabetes)
				.HasColumnType("enum('No', 'Si (2do Grado)', 'Si (1er Grado)')");

			// 4. Configuración de Timestamps
			// Le indicamos a EF que MySQL se encarga de generar estas fechas automáticamente al insertar (DEFAULT CURRENT_TIMESTAMP)
			modelBuilder.Entity<Paciente>()
				.Property(p => p.FechaRegistro)
				.ValueGeneratedOnAdd();

			modelBuilder.Entity<ExpedienteClinico>()
				.Property(e => e.FechaCreacion)
				.ValueGeneratedOnAdd();

			modelBuilder.Entity<EvaluacionRiesgo>()
				.Property(e => e.FechaEvaluacion)
				.ValueGeneratedOnAdd();
		}
	}
}