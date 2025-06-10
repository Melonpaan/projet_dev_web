using Core.Models;
using Core.UseCases.Abstractions;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Api.EndPoints;

public static class UserListRoutes
{
    public static WebApplication AddUserListRoutes(this WebApplication app)
    {
        var group = app.MapGroup("api/userlist")
            .RequireAuthorization()
            .WithTags("UserList");

        // GET : Tous les films à regarder d'un user
        group.MapGet("/to_watch", (HttpContext context, IUserListUseCases userListUseCases) =>
        {
            var userId = int.Parse(context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var list = userListUseCases.GetUserLists(userId)
                .Where(ul => ul.Status == "to_watch")
                .ToList();
            return Results.Ok(list);
        })
        .WithName("GetToWatchList");

        // GET : Tous les films déjà regardés d'un user
        group.MapGet("/watched", (HttpContext context, IUserListUseCases userListUseCases) =>
        {
            var userId = int.Parse(context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var list = userListUseCases.GetUserLists(userId)
                .Where(ul => ul.Status == "watched")
                .ToList();
            return Results.Ok(list);
        })
        .WithName("GetWatchedList");

        // POST : Ajouter un film à "à regarder"
        group.MapPost("to_watch", ([FromBody] UserList userList, HttpContext context, IUserListUseCases userListUseCases) =>
        {
            var userId = int.Parse(context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            userList.UserId = userId;
            userList.Status = "to_watch";
            userListUseCases.AddToUserList(userList);
            return Results.Ok(new { message = "Film ajouté à la liste à regarder" });
        })
        .WithName("AddToWatch")
        .Produces<object>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status401Unauthorized);

        // POST : Ajouter un film à "déjà regardé"
        group.MapPost("watched", ([FromBody] UserList userList, HttpContext context, IUserListUseCases userListUseCases) =>
        {
            var userId = int.Parse(context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            userList.UserId = userId;
            userList.Status = "watched";
            userListUseCases.AddToUserList(userList);
            return Results.Ok(new { message = "Film ajouté à la liste déjà regardée" });
        })
        .WithName("AddWatched")
        .Produces<object>(StatusCodes.Status200OK);

        // PUT : Modifier le status d'un film dans la liste
        group.MapPut("/{id}", (int id, [FromBody] UserList userList, HttpContext context, IUserListUseCases userListUseCases) =>
        {
            var userId = int.Parse(context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var existingList = userListUseCases.GetUserListById(id);
            
            if (existingList == null)
                return Results.NotFound(new { message = "Liste non trouvée" });
        
            if (existingList.UserId != userId)
                return Results.Forbid();

            if (userList.Status != "to_watch" && userList.Status != "watched")
            {
                return Results.BadRequest(new { message = "Le status doit être 'to_watch' ou 'watched'." });
            }
            existingList.Status = userList.Status;
            existingList.UserId = userId;
            userListUseCases.UpdateUserList(existingList);
            return Results.Ok(new { message = "Statut du film modifié avec succès" });
        })
        .WithName("UpdateUserList")
        .Produces<object>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status400BadRequest);

        // DELETE : Supprimer un film de la liste
        group.MapDelete("{id}", (int id, HttpContext context, IUserListUseCases userListUseCases) =>
        {
            var userId = int.Parse(context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var existingList = userListUseCases.GetUserListById(id);
            
            if (existingList == null)
                return Results.NotFound(new { message = "Liste non trouvée" });
        
            if (existingList.UserId != userId)
                return Results.Forbid();

            userListUseCases.RemoveFromUserList(id);
            return Results.Ok(new { message = "Film retiré de la liste de l'utilisateur" });
        })
        .WithName("RemoveFromUserList")
        .Produces<object>(StatusCodes.Status200OK);

        return app;
    }
}