using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QRISK3.backend.Entities;

[Table("Evaluacion_Riesgo")]
public class EvaluacionRiesgo
{
	[Key]
	[Column("id")]
	public int Id { get; set; }

	[Required]
	[Column("expediente_id")]
	public int ExpedienteId { get; set; }

	[Column("fecha_evaluacion")]
	public DateTime FechaEvaluacion { get; set; } = DateTime.UtcNow;

	// --- Bloque Demográfico / Físico ---
	[Required]
	[Column("edad_al_evaluar")]
	public int EdadAlEvaluar { get; set; }

	[Column("peso", TypeName = "decimal(5,2)")]
	public decimal? Peso { get; set; }

	[Column("altura", TypeName = "decimal(3,2)")]
	public decimal? Altura { get; set; }

	[Required]
	[Column("imc", TypeName = "decimal(4,2)")]
	public decimal Imc { get; set; }

	[Required]
	[Column("imc_imputado")]
	public bool ImcImputado { get; set; }

	// --- Variables Demográficas Adicionales ---
	[Required]
	[Column("origen_etnico")]
	public int OrigenEtnico { get; set; }

	[Required]
	[Column("categoria_tabaquismo")]
	public int CategoriaTabaquismo { get; set; }

	[Required]
	[Column("indice_townsend", TypeName = "decimal(5,2)")]
	public decimal IndiceTownsend { get; set; }

	// --- Bloque Clínico con Trazabilidad ---
	[Required]
	[Column("presion_sistolica", TypeName = "decimal(5,2)")]
	public decimal PresionSistolica { get; set; }

	[Required]
	[Column("presion_sistolica_imputada")]
	public bool PresionSistolicaImputada { get; set; }

	[Required]
	[Column("desviacion_std_presion", TypeName = "decimal(5,2)")]
	public decimal DesviacionStdPresion { get; set; }

	[Required]
	[Column("ratio_colesterol_hdl", TypeName = "decimal(5,2)")]
	public decimal RatioColesterolHdl { get; set; }

	[Required]
	[Column("ratio_colesterol_imputado")]
	public bool RatioColesterolImputado { get; set; }

	// --- Bloque de Comorbilidades ---
	[Required]
	[Column("tratamiento_hipertension")]
	public bool TratamientoHipertension { get; set; }

	[Required]
	[Column("fibrilacion_auricular")]
	public bool FibrilacionAuricular { get; set; }

	[Required]
	[Column("diabetes_tipo_1")]
	public bool DiabetesTipo1 { get; set; }

	[Required]
	[Column("diabetes_tipo_2")]
	public bool DiabetesTipo2 { get; set; }

	[Required]
	[Column("historial_familiar_cvd")]
	public bool HistorialFamiliarCvd { get; set; }

	[Required]
	[Column("antipsicoticos_atipicos")]
	public bool AntipsicoticosAtipicos { get; set; }

	[Required]
	[Column("corticosteroides")]
	public bool Corticosteroides { get; set; }

	[Required]
	[Column("migrana")]
	public bool Migrana { get; set; }

	[Required]
	[Column("artritis_reumatoide")]
	public bool ArtritisReumatoide { get; set; }

	[Required]
	[Column("enfermedad_renal_cronica")]
	public bool EnfermedadRenalCronica { get; set; }

	[Required]
	[Column("enfermedad_mental_grave")]
	public bool EnfermedadMentalGrave { get; set; }

	[Required]
	[Column("lupus")]
	public bool Lupus { get; set; }

	[Required]
	[Column("disfuncion_erectil")]
	public bool DisfuncionErectil { get; set; }

	[Required]
	[Column("bajon_peso_involuntario")]
	public bool BajonPesoInvoluntario { get; set; }

	// --- Bloque de Resultado Final ---
	[Required]
	[Column("riesgo_porcentaje", TypeName = "decimal(5,2)")]
	public decimal RiesgoPorcentaje { get; set; }

	// --- Propiedades de Navegación ---
	// Esto le permite a EF Core entender las relaciones (Foreign Keys)
	[ForeignKey("ExpedienteId")]
	public virtual ExpedienteClinico Expediente { get; set; }
}