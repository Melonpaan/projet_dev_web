using Core.Models;
using Core.UseCases.Abstractions;
using Microsoft.AspNetCore.Mvc;


namespace Api.EndPoints;

public static class UserRoutes
{
    public static WebApplication AddUserRoutes(this WebApplication app)
    {
        var group = app.MapGroup("api/users")
            .WithTags("Users");

        group.MapPost("register", ([FromBody] RegisterRequest request, IUserUseCases userUseCases) =>
        {
            userUseCases.Register(request);
            return Results.Ok(new { message = "Utilisateur enregistré avec succès" });
        })
        .WithName("Register")
        .Produces<object>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status400BadRequest)
        .Produces(StatusCodes.Status500InternalServerError);

        group.MapPost("auth", ([FromBody] AuthenticationRequest request, IUserUseCases userUseCases) =>
        {
            var user = userUseCases.AuthenticateAndGetUser(request);
            if (user != null)
            {
                return Results.Ok(user);
            }
            return Results.Unauthorized();
        })
        .WithName("Auth")
        .Produces<User>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status400BadRequest)
        .Produces(StatusCodes.Status401Unauthorized)
        .Produces(StatusCodes.Status500InternalServerError);

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