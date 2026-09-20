using QRISK3.backend.Interfaces;
using QRISK3.backend.Models;
using QRISK3.backend.Utils;

namespace QRISK3.backend.Models.Strategies;

public class FemaleQDiabetesModel : IQDiabetesModel
{
	// Supervivencia base a 10 años para mujeres de la cohorte QResearch
	public double BaselineSurvival => 0.988876402378082;

	// Matrices de riesgo condicional (índice directo basado en la categoría)
	private readonly double[] _ethnicityRisk = {
		0, 0,
		0.28040314332995425,  0.56298994142075398, 0.29590000851116516,
		0.072785379877982545, -0.17072135508857317, -0.39371043314874971,
		-0.32632495283530272, -0.17127056883241784
	};

	private readonly double[] _smokeRisk = {
		0,
		0.13386833786546262, 0.56200858012438537,
		0.66749593377502547, 0.84948177644830847
	};

	public double CalculateLinearPredictor(PatientData patient)
	{
		// 1. Transformación con Polinomios Fraccionarios
		// En las mujeres, las potencias de la edad son -2 y 1
		double age_1 = FractionalPolynomials.Transform(patient.Age, -2);
		double age_2 = FractionalPolynomials.Transform(patient.Age, 1);

		// En las mujeres, las potencias del IMC son -2 y -2 con logaritmo
		double bmi_1 = FractionalPolynomials.Transform(patient.Bmi.Value, -2);
		double bmi_2 = FractionalPolynomials.TransformRepeated(patient.Bmi.Value, -2);

		// 2. Centrado de variables continuas (Restar la media poblacional)
		age_1 -= 0.053274843841791;
		age_2 -= 4.332503318786621;
		bmi_1 -= 0.154946178197861;
		bmi_2 -= 0.144462317228317;

		double rati = patient.CholesterolHdlRatio.Value - 3.476326465606690;
		double sbp = patient.SystolicBloodPressure.Value - 123.130012512207030;
		double sbps5 = patient.SystolicBloodPressureStdDev - 9.002537727355957;
		double town = patient.TownsendDeprivationScore - 0.392308831214905;

		// 3. Inicio del Predictor Lineal
		double a = 0;

		// Sumas Condicionales (Matrices)
		a += _ethnicityRisk[patient.EthnicityCode];
		a += _smokeRisk[patient.SmokeCategory];

		// Sumas de Variables Continuas
		a += age_1 * -8.1388109247726188;
		a += age_2 * 0.79733376689699098;
		a += bmi_1 * 0.29236092275460052;
		a += bmi_2 * -4.1513300213837665;
		a += rati * 0.15338035820802554;
		a += sbp * 0.013131488407103424;
		a += sbps5 * 0.0078894541014586095;
		a += town * 0.077223790588590108;

		// Sumas de Variables Booleanas
		// Se utiliza la convención ternaria para transformar `true` en 1 y `false` en 0
		a += ( patient.HasAtrialFibrillation ? 1 : 0 ) * 1.5923354969269663;
		a += ( patient.HasAtypicalAntipsychotics ? 1 : 0 ) * 0.25237642070115557;
		a += ( patient.HasCorticosteroids ? 1 : 0 ) * 0.59520725304601851;
		a += ( patient.HasMigraine ? 1 : 0 ) * 0.301267260870345;
		a += ( patient.HasRheumatoidArthritis ? 1 : 0 ) * 0.21364803435181942;
		a += ( patient.HasChronicKidneyDisease ? 1 : 0 ) * 0.65194569493845833;
		a += ( patient.HasSevereMentalIllness ? 1 : 0 ) * 0.12555308058820178;
		a += ( patient.HasSLE ? 1 : 0 ) * 0.75880938654267693;
		a += ( patient.IsTreatedForHypertension ? 1 : 0 ) * 0.50931593683423004;
		a += ( patient.HasType1Diabetes ? 1 : 0 ) * 1.7267977510537347;
		a += ( patient.HasType2Diabetes ? 1 : 0 ) * 1.0688773244615468;
		a += ( patient.HasFamilyHistoryCvd ? 1 : 0 ) * 0.45445319020896213;

		// Sumas de Términos de Interacción (Cruces de variables)
		a += age_1 * ( patient.SmokeCategory == 1 ? 1 : 0 ) * -4.7057161785851891;
		a += age_1 * ( patient.SmokeCategory == 2 ? 1 : 0 ) * -2.7430383403573337;
		a += age_1 * ( patient.SmokeCategory == 3 ? 1 : 0 ) * -0.86608088829392182;
		a += age_1 * ( patient.SmokeCategory == 4 ? 1 : 0 ) * 0.90241562369710648;
		a += age_1 * ( patient.HasAtrialFibrillation ? 1 : 0 ) * 19.938034889546561;
		a += age_1 * ( patient.HasCorticosteroids ? 1 : 0 ) * -0.98408045235936281;
		a += age_1 * ( patient.HasMigraine ? 1 : 0 ) * 1.7634979587872999;
		a += age_1 * ( patient.HasChronicKidneyDisease ? 1 : 0 ) * -3.5874047731694114;
		a += age_1 * ( patient.HasSLE ? 1 : 0 ) * 19.690303738638292;
		a += age_1 * ( patient.IsTreatedForHypertension ? 1 : 0 ) * 11.872809733921812;
		a += age_1 * ( patient.HasType1Diabetes ? 1 : 0 ) * -1.2444332714320747;
		a += age_1 * ( patient.HasType2Diabetes ? 1 : 0 ) * 6.8652342000009599;
		a += age_1 * bmi_1 * 23.802623412141742;
		a += age_1 * bmi_2 * -71.184947692087007;
		a += age_1 * ( patient.HasFamilyHistoryCvd ? 1 : 0 ) * 0.99467807940435127;
		a += age_1 * sbp * 0.034131842338615485;
		a += age_1 * town * -1.0301180802035639;

		a += age_2 * ( patient.SmokeCategory == 1 ? 1 : 0 ) * -0.075589244643193026;
		a += age_2 * ( patient.SmokeCategory == 2 ? 1 : 0 ) * -0.11951192874867074;
		a += age_2 * ( patient.SmokeCategory == 3 ? 1 : 0 ) * -0.10366306397571923;
		a += age_2 * ( patient.SmokeCategory == 4 ? 1 : 0 ) * -0.13991853591718389;
		a += age_2 * ( patient.HasAtrialFibrillation ? 1 : 0 ) * -0.076182651011162505;
		a += age_2 * ( patient.HasCorticosteroids ? 1 : 0 ) * -0.12005364946742472;
		a += age_2 * ( patient.HasMigraine ? 1 : 0 ) * -0.065586917898699859;
		a += age_2 * ( patient.HasChronicKidneyDisease ? 1 : 0 ) * -0.22688873086442507;
		a += age_2 * ( patient.HasSLE ? 1 : 0 ) * 0.077347949679016273;
		a += age_2 * ( patient.IsTreatedForHypertension ? 1 : 0 ) * 0.00096857823588174436;
		a += age_2 * ( patient.HasType1Diabetes ? 1 : 0 ) * -0.28724064624488949;
		a += age_2 * ( patient.HasType2Diabetes ? 1 : 0 ) * -0.097112252590695489;
		a += age_2 * bmi_1 * 0.52369958933664429;
		a += age_2 * bmi_2 * 0.045744190122323759;
		a += age_2 * ( patient.HasFamilyHistoryCvd ? 1 : 0 ) * -0.076885051698423038;
		a += age_2 * sbp * -0.0015082501423272358;
		a += age_2 * town * -0.031593414674962329;

		return a;
	}
}