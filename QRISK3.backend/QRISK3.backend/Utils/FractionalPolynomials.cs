using System;

namespace QRISK3.backend.Utils;

public static class FractionalPolynomials
{
	// Función base para elevar a potencias fraccionarias
	public static double Transform(double value, double power, double scale = 10.0)
	{
		double scaledValue = value / scale;
		if (Math.Abs(power) < 0.0001) return Math.Log(scaledValue);
		return Math.Pow(scaledValue, power);
	}

	// Función para el término de interacción con el logaritmo
	public static double TransformRepeated(double value, double power, double scale = 10.0)
	{
		double scaledValue = value / scale;
		return Transform(value, power, scale) * Math.Log(scaledValue);
	}
}