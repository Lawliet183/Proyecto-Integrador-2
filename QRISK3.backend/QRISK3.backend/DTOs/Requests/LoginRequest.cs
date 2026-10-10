namespace QRISK3.backend.DTOs.Requests
{
	public record LoginRequest(
		string Correo,
		string Password
	);
}
