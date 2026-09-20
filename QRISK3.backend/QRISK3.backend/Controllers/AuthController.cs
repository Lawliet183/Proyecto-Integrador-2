using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using QRISK3.backend.Data;
using QRISK3.backend.Entities;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace QRISK3.backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
	private readonly AppDbContext _dbContext;
	private readonly IConfiguration _config;

	public AuthController(AppDbContext dbContext, IConfiguration config)
	{
		_dbContext = dbContext;
		_config = config;

		_dbContext.Database.CanConnect();
	}


	[HttpPost("login")]
	public async Task<IActionResult> Login([FromBody] LoginRequest request)
	{
		// 1. Buscar usuario incluyendo su perfil de paciente vinculado
		var usuario = await _dbContext.Usuarios
			.Include(u => u.Paciente)
				.ThenInclude(p => p.Expediente)
			.FirstOrDefaultAsync(u => u.CorreoElectronico == request.Correo);

		// 2. Validación (Asumiendo que guardaste contraseñas en texto plano por ahora, 
		// o usando BCrypt.Verify si ya las hasheaste en el registro)
		if (usuario == null || usuario.PasswordHash != request.Password)
		{
			return Unauthorized(new { Success = false, Message = "Credenciales incorrectas." });
		}

		// 3. Construir los Claims (la carga útil del JWT)
		var claims = new[]
		{
			new Claim(JwtRegisteredClaimNames.Sub, usuario.Id.ToString()),
			new Claim(JwtRegisteredClaimNames.Email, usuario.CorreoElectronico),
			new Claim("rol", usuario.Rol),
			new Claim("pacienteId", usuario.Paciente?.Id.ToString() ?? ""),
			new Claim("expedienteId", usuario.Paciente?.Expediente?.Id.ToString() ?? "")
		};

		// 4. Firmar el Token
		var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
		var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

		var token = new JwtSecurityToken(
			issuer: _config["Jwt:Issuer"],
			audience: _config["Jwt:Audience"],
			claims: claims,
			expires: DateTime.UtcNow.AddHours(2), // Expira en 2 horas
			signingCredentials: creds
		);

		return Ok(new
		{
			Success = true,
			Token = new JwtSecurityTokenHandler().WriteToken(token)
		});
	}

	[HttpPost("registro")]
	public async Task<IActionResult> Registro([FromBody] RegistroRequest request)
	{
		try
		{
			// 1. Evitar duplicados
			if (await _dbContext.Usuarios.AnyAsync(u => u.CorreoElectronico == request.Correo))
			{
				return BadRequest(new { Success = false, Message = "El correo ya está registrado." });
			}

			// 2. Construir la jerarquía completa de entidades
			// Entity Framework Core se encarga de insertar las llaves foráneas automáticamente
			var nuevoUsuario = new Usuario
			{
				CorreoElectronico = request.Correo,
				PasswordHash = request.Password, // Nota: En producción, recuerda hashear con BCrypt
				Rol = "Paciente",
				FechaRegistro = DateTime.UtcNow,

				Paciente = new Paciente
				{
					Nombres = request.Nombres,
					Apellidos = request.Apellidos,
					FechaNacimiento = request.FechaNacimiento,
					SexoBiologico = request.SexoBiologico,

					Expediente = new ExpedienteClinico
					{
						FechaCreacion = DateTime.UtcNow
					}
				}
			};

			// 3. Guardar en MySQL
			_dbContext.Usuarios.Add(nuevoUsuario);
			await _dbContext.SaveChangesAsync(); // Aquí se generan los IDs (Id, PacienteId, ExpedienteId)

			// 4. Autenticar inmediatamente al usuario devolviendo un JWT
			var token = GenerarJwt(nuevoUsuario);

			return Ok(new { Success = true, Token = token });
		}
		catch (Exception ex)
		{
			return StatusCode(500, new { Success = false, Error = ex.Message });
		}
	}

	[HttpGet("ping")]
	public ActionResult Ping()
	{
		return Ok();
	}

	// Método privado reutilizable para crear el token
	private string GenerarJwt(Usuario usuario)
	{
		var claims = new[]
		{
			new Claim(JwtRegisteredClaimNames.Sub, usuario.Id.ToString()),
			new Claim(JwtRegisteredClaimNames.Email, usuario.CorreoElectronico),
			new Claim("rol", usuario.Rol),
			new Claim("pacienteId", usuario.Paciente?.Id.ToString() ?? ""),
			new Claim("expedienteId", usuario.Paciente?.Expediente?.Id.ToString() ?? "")
		};

		var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
		var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

		var token = new JwtSecurityToken(
			issuer: _config["Jwt:Issuer"],
			audience: _config["Jwt:Audience"],
			claims: claims,
			expires: DateTime.UtcNow.AddHours(2),
			signingCredentials: creds
		);

		return new JwtSecurityTokenHandler().WriteToken(token);
	}
}

// DTOs para estructurar la entrada de datos
public record LoginRequest(string Correo, string Password);
public record RegistroRequest(
	string Nombres,
	string Apellidos,
	DateTime FechaNacimiento,
	string SexoBiologico,
	string Correo,
	string Password
);