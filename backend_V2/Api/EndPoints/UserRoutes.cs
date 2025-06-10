using Core.Models;
using Core.UseCases.Abstractions;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace Api.EndPoints;

public static class UserRoutes
{
    public static WebApplication AddUserRoutes(this WebApplication app)
    {
        var group = app.MapGroup("api/users")
            .RequireAuthorization()
            .WithTags("Users");

        group.MapPost("/auth", ([FromBody] AuthenticationRequest request, IUserUseCases userUseCases, IConfiguration configuration) =>
        {
            var user = userUseCases.AuthenticateAndGetUser(request);

            if (user != null)
            {
                var issuer = configuration["Jwt:Issuer"];
                var audience = configuration["Jwt:Audience"];
                var key = Encoding.ASCII.GetBytes(configuration["Jwt:Key"]!);
                var expireTime = configuration["Jwt:ExpireTimeInMinutes"];
                var expiration = DateTime.UtcNow.AddMinutes(Convert.ToDouble(expireTime ?? "5"));

                var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(JwtRegisteredClaimNames.Name, user.Username)
                };

                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(claims),
                    Expires = expiration,
                    Issuer = issuer,
                    Audience = audience,
                    SigningCredentials = new SigningCredentials(
                        new SymmetricSecurityKey(key), 
                        SecurityAlgorithms.HmacSha512Signature)
                };

                var tokenHandler = new JwtSecurityTokenHandler();
                var token = tokenHandler.CreateToken(tokenDescriptor);
                var jwtToken = tokenHandler.WriteToken(token);

                return Results.Ok(new { token = jwtToken });
            }

            return Results.Unauthorized();
        })
        .AllowAnonymous()
        .WithName("Auth");

        group.MapPost("/register", ([FromBody] RegisterRequest request, IUserUseCases userUseCases) =>
        {
            userUseCases.Register(request);
            return Results.Ok(new { message = "Utilisateur enregistré avec succès" });
        })
        .AllowAnonymous()
        .WithName("Register");

        group.MapGet("", (IUserUseCases userUseCases) =>
        {
            var users = userUseCases.GetAllUsers();
            return Results.Ok(users);
        })
        .WithName("GetAllUsers")
        .Produces<IEnumerable<User>>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status500InternalServerError);

        return app;
    }
}