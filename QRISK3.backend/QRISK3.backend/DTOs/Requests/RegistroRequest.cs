namespace QRISK3.backend.DTOs.Requests
{
	public record RegistroRequest(
		string Nombres,
		string Apellidos,
		DateTime FechaNacimiento,
		string SexoBiologico,
		string Correo,
		string Password
	);
}
