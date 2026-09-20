using QRISK3.backend.Interfaces;
using QRISK3.backend.Models;
using QRISK3.backend.Utils;

namespace QRISK3.backend.Models.Strategies;

public class MaleQDiabetesModel : IQDiabetesModel
{
	// Supervivencia base a 10 años para hombres
	public double BaselineSurvival => 0.977268040180206;

	// Matrices de riesgo condicional para hombres
	private readonly double[] _ethnicityRisk = {
		0, 0,
		0.27719248760308279, 0.47446360714931268, 0.52961729919689371,
		0.035100159186299017, -0.35807899669327919, -0.4005648523216514,
		-0.41522792889830173, -0.26321348134749967
	};

	private readonly double[] _smokeRisk = {
		0,
		0.19128222863388983, 0.55241588192645552,
		0.63835053027506072, 0.78983819881858019
	};

	public double CalculateLinearPredictor(PatientData patient)
	{
		// 1. Transformación con Polinomios Fraccionarios
		// En los hombres, las potencias de la edad son -1 y 3 (muy distintas a las mujeres)
		double age_1 = FractionalPolynomials.Transform(patient.Age, -1);
		double age_2 = FractionalPolynomials.Transform(patient.Age, 3);

		// Las potencias del IMC para hombres
		double bmi_1 = FractionalPolynomials.Transform(patient.Bmi.Value, -2);
		double bmi_2 = FractionalPolynomials.TransformRepeated(patient.Bmi.Value, -2);

		// 2. Centrado de variables continuas (Restar la media poblacional)
		age_1 -= 0.234766781330109;
		age_2 -= 77.284080505371094;
		bmi_1 -= 0.149176135659218;
		bmi_2 -= 0.141913309693336;

		double rati = patient.CholesterolHdlRatio.Value - 4.300998687744141;
		double sbp = patient.SystolicBloodPressure.Value - 128.571578979492190;
		double sbps5 = patient.SystolicBloodPressureStdDev - 8.756621360778809;
		double town = patient.TownsendDeprivationScore - 0.526304900646210;

		// 3. Inicio del Predictor Lineal
		double a = 0;

		// Sumas Condicionales (Matrices)
		a += _ethnicityRisk[patient.EthnicityCode];
		a += _smokeRisk[patient.SmokeCategory];

		// Sumas de Variables Continuas
		a += age_1 * -17.839781666005575;
		a += age_2 * 0.0022964880605765492;
		a += bmi_1 * 2.4562776660536358;
		a += bmi_2 * -8.3011122314711354;
		a += rati * 0.17340196856327111;
		a += sbp * 0.012910126542553305;
		a += sbps5 * 0.010251914291290456;
		a += town * 0.033268201277287295;

		// Sumas de Variables Booleanas
		a += ( patient.HasAtrialFibrillation ? 1 : 0 ) * 0.88209236928054657;
		a += ( patient.HasAtypicalAntipsychotics ? 1 : 0 ) * 0.13046879855173513;
		a += ( patient.HasCorticosteroids ? 1 : 0 ) * 0.45485399750445543;
		a += ( patient.HasErectileDysfunction ? 1 : 0 ) * 0.22251859086705383; // Exclusivo hombres
		a += ( patient.HasMigraine ? 1 : 0 ) * 0.25584178074159913;
		a += ( patient.HasRheumatoidArthritis ? 1 : 0 ) * 0.20970658013956567;
		a += ( patient.HasChronicKidneyDisease ? 1 : 0 ) * 0.71853261288274384;
		a += ( patient.HasSevereMentalIllness ? 1 : 0 ) * 0.12133039882047164;
		a += ( patient.HasSLE ? 1 : 0 ) * 0.4401572174457522;
		a += ( patient.IsTreatedForHypertension ? 1 : 0 ) * 0.51659871082695474;
		a += ( patient.HasType1Diabetes ? 1 : 0 ) * 1.2343425521675175;
		a += ( patient.HasType2Diabetes ? 1 : 0 ) * 0.85942071430932221;
		a += ( patient.HasFamilyHistoryCvd ? 1 : 0 ) * 0.54055469009390156;

		// Sumas de Términos de Interacción (Cruces de variables)
		a += age_1 * ( patient.SmokeCategory == 1 ? 1 : 0 ) * -0.21011133933516346;
		a += age_1 * ( patient.SmokeCategory == 2 ? 1 : 0 ) * 0.75268676447503191;
		a += age_1 * ( patient.SmokeCategory == 3 ? 1 : 0 ) * 0.99315887556405791;
		a += age_1 * ( patient.SmokeCategory == 4 ? 1 : 0 ) * 2.1331163414389076;
		a += age_1 * ( patient.HasAtrialFibrillation ? 1 : 0 ) * 3.4896675530623207;
		a += age_1 * ( patient.HasCorticosteroids ? 1 : 0 ) * 1.1708133653489108;
		a += age_1 * ( patient.HasErectileDysfunction ? 1 : 0 ) * -1.506400985745431;
		a += age_1 * ( patient.HasMigraine ? 1 : 0 ) * 2.3491159871402441;
		a += age_1 * ( patient.HasChronicKidneyDisease ? 1 : 0 ) * -0.50656716327223694;
		a += age_1 * ( patient.IsTreatedForHypertension ? 1 : 0 ) * 6.5114581098532671;
		a += age_1 * ( patient.HasType1Diabetes ? 1 : 0 ) * 5.3379864878006531;
		a += age_1 * ( patient.HasType2Diabetes ? 1 : 0 ) * 3.6461817406221311;
		a += age_1 * bmi_1 * 31.004952956033886;
		a += age_1 * bmi_2 * -111.29157184391643;
		a += age_1 * ( patient.HasFamilyHistoryCvd ? 1 : 0 ) * 2.7808628508531887;
		a += age_1 * sbp * 0.018858524469865853;
		a += age_1 * town * -0.1007554870063731;

		a += age_2 * ( patient.SmokeCategory == 1 ? 1 : 0 ) * -0.00049854870275326121;
		a += age_2 * ( patient.SmokeCategory == 2 ? 1 : 0 ) * -0.00079875633317385414;
		a += age_2 * ( patient.SmokeCategory == 3 ? 1 : 0 ) * -0.00083706184266251296;
		a += age_2 * ( patient.SmokeCategory == 4 ? 1 : 0 ) * -0.00078400319155637289;
		a += age_2 * ( patient.HasAtrialFibrillation ? 1 : 0 ) * -0.00034995608340636049;
		a += age_2 * ( patient.HasCorticosteroids ? 1 : 0 ) * -0.0002496045095297166;
		a += age_2 * ( patient.HasErectileDysfunction ? 1 : 0 ) * -0.0011058218441227373;
		a += age_2 * ( patient.HasMigraine ? 1 : 0 ) * 0.00019896446041478631;
		a += age_2 * ( patient.HasChronicKidneyDisease ? 1 : 0 ) * -0.0018325930166498813;
		a += age_2 * ( patient.IsTreatedForHypertension ? 1 : 0 ) * 0.00063838053104165013;
		a += age_2 * ( patient.HasType1Diabetes ? 1 : 0 ) * 0.0006409780808752897;
		a += age_2 * ( patient.HasType2Diabetes ? 1 : 0 ) * -0.00024695695588868315;
		a += age_2 * bmi_1 * 0.0050380102356322029;
		a += age_2 * bmi_2 * -0.013074483002524319;
		a += age_2 * ( patient.HasFamilyHistoryCvd ? 1 : 0 ) * -0.00024791809907396037;
		a += age_2 * sbp * -0.00001271874191588457;
		a += age_2 * town * -0.000093299642323272888;

		return a;
	}
}