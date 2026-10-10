using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using QRISK3.backend.Data;
using QRISK3.backend.Entities;
using QRISK3.backend.DTOs.Requests;
using BC = BCrypt.Net.BCrypt; // Alias para poder acceder a los metodos de BCrypt


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
	}


	[HttpPost("login")]
	public async Task<IActionResult> Login([FromBody] LoginRequest request)
	{
		try
		{
			// Buscar usuario incluyendo su perfil de paciente vinculado
			var usuario = await _dbContext.Usuarios
				.Include(u => u.Paciente)
				.ThenInclude(p => p.Expediente)
				.FirstOrDefaultAsync(u => u.CorreoElectronico == request.Correo);

			// Validacion (si el usuario es nulo, o si las contraseñas no son iguales, retornamos un error al cliente)
			if (usuario == null || !BC.EnhancedVerify(request.Password, usuario.PasswordHash))
			{
				return Unauthorized(new
				{
					success = false,
					message = "Credenciales incorrectas."
				});
			}

			// Generar el token JWT
			var token = GenerarJwt(usuario);

			return Ok(new
			{
				success = true,
				token = token
			});
		}
		catch (Exception ex)
		{
			Console.WriteLine($"[ERROR CRÍTICO] AuthController: {ex.Message}");
			Console.WriteLine(ex.StackTrace);

			return StatusCode(500, new
			{
				success = false,
				message = "El servicio de autenticación no está disponible en este momento. Inténtalo de nuevo más tarde."
			});
		}
	}

	[HttpPost("registro")]
	public async Task<IActionResult> Registro([FromBody] RegistroRequest request)
	{
		try
		{
			// Buscar el correo en la BD para evitar duplicados
			if (await _dbContext.Usuarios.AnyAsync(u => u.CorreoElectronico == request.Correo))
			{
				return BadRequest(new
				{
					success = false,
					message = "El correo ya está registrado."
				});
			}

			// Construir un nuevo usuario junto con su respectiva jerarquía de entidades
			string passwordHasheada = BC.EnhancedHashPassword(request.Password);
			var nuevoUsuario = new Usuario
			{
				CorreoElectronico = request.Correo,
				PasswordHash = passwordHasheada,
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

			// Guardar en la BD
			_dbContext.Usuarios.Add(nuevoUsuario);
			await _dbContext.SaveChangesAsync();

			// Autenticar inmediatamente al usuario devolviendo un JWT
			var token = GenerarJwt(nuevoUsuario);

			return Ok(new
			{
				success = true,
				token = token
			});
		}
		catch (Exception ex)
		{
			Console.WriteLine($"[ERROR CRÍTICO] AuthController: {ex.Message}");
			Console.WriteLine(ex.StackTrace);

			return StatusCode(500, new
			{
				success = false,
				message = "El servicio de autenticación no está disponible en este momento. Inténtalo de nuevo más tarde."
			});
		}
	}


	// Utilizado para crear el token JWT
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