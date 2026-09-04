using Proyecto.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Proyecto.Models
{
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
		public DateTime FechaEvaluacion { get; set; }

		[Required]
		[Column("edad_al_evaluar")]
		public int EdadAlEvaluar { get; set; }

		[Required]
		[Column("peso")]
		public decimal Peso { get; set; }

		[Required]
		[Column("altura")]
		public decimal Altura { get; set; }

		[Required]
		[Column("imc")]
		public decimal Imc { get; set; }

		[Required]
		[Column("perimetro_abdominal")]
		public int PerimetroAbdominal { get; set; }

		[Required]
		[Column("realiza_actividad_fisica")]
		public bool RealizaActividadFisica { get; set; }

		[Required]
		[Column("consume_frutas_verduras")]
		public bool ConsumeFrutasVerduras { get; set; }

		[Required]
		[Column("medicacion_hipertension")]
		public bool MedicacionHipertension { get; set; }

		[Required]
		[Column("antecedente_glucosa_alta")]
		public bool AntecedenteGlucosaAlta { get; set; }

		[Required]
		[Column("antecedente_familiar_diabetes")]
		public string AntecedenteFamiliarDiabetes { get; set; } = string.Empty;

		[Required]
		[Column("bajon_peso_involuntario")]
		public bool BajonPesoInvoluntario { get; set; }

		[Required]
		[Column("puntaje_total")]
		public int PuntajeTotal { get; set; }

		[Column("nivel_riesgo")]
		[MaxLength(50)]
		public string? NivelRiesgo { get; set; }

		// Propiedad de navegación
		[ForeignKey("ExpedienteId")]
		public ExpedienteClinico? Expediente { get; set; }
	}
}