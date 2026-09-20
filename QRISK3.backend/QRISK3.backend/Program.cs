using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using QRISK3.backend.Data;
using QRISK3.backend.Interfaces;
using QRISK3.backend.Models.Strategies;
using QRISK3.backend.Services;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

/* Add CORS support */
builder.Services.AddCors(options =>
{
	options.AddDefaultPolicy(
		builder =>
		{
			builder.AllowAnyOrigin() // Not recommended for production
				   .AllowAnyHeader()
				   .AllowAnyMethod();
		});
});

/* Configuracion de Pomelo Entity Framework */

// Read connection string from appsettings.json
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// Replace with your server version and type.
// Use 'MariaDbServerVersion' for MariaDB.
// Alternatively, use 'ServerVersion.AutoDetect(connectionString)'.
// For common usages, see pull request #1233.
var serverVersion = new MySqlServerVersion(ServerVersion.AutoDetect(connectionString));

// Replace 'YourDbContext' with the name of your own DbContext derived class.
builder.Services.AddDbContext<AppDbContext>(
	dbContextOptions => dbContextOptions
		.UseMySql(connectionString, serverVersion)
		// The following three options help with debugging, but should
		// be changed or removed for production.
		.LogTo(Console.WriteLine, LogLevel.Information)
		.EnableSensitiveDataLogging()
		.EnableDetailedErrors()
);

/****/

// Extraer configuración
var jwtSettings = builder.Configuration.GetSection("Jwt");
var key = Encoding.UTF8.GetBytes(jwtSettings["Key"]!);

// Registrar JWT
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
	.AddJwtBearer(options =>
	{
		options.TokenValidationParameters = new TokenValidationParameters
		{
			ValidateIssuerSigningKey = true,
			IssuerSigningKey = new SymmetricSecurityKey(key),
			ValidateIssuer = true,
			ValidIssuer = jwtSettings["Issuer"],
			ValidateAudience = true,
			ValidAudience = jwtSettings["Audience"],
			ValidateLifetime = true,
			ClockSkew = TimeSpan.Zero
		};
	});

// Add services to the container.

builder.Services.AddControllers();

// Registrar los Modelos Estratégicos bajo su Interfaz
builder.Services.AddSingleton<IQDiabetesModel, MaleQDiabetesModel>();
builder.Services.AddSingleton<IQDiabetesModel, FemaleQDiabetesModel>();

// Registrar los Servicios
builder.Services.AddSingleton<DataImputationService>();
builder.Services.AddSingleton<QDiabetesRiskEngine>();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
