using Core.Models;
using Core.UseCases.Abstractions;
using Microsoft.AspNetCore.Mvc;

namespace Api.EndPoints;

public static class UserListRoutes
{
    public static WebApplication AddUserListRoutes(this WebApplication app)
    {
        var group = app.MapGroup("api/userlist")
            .WithTags("UserList");

        // GET : Tous les films à regarder d'un user
        group.MapGet("to_watch/{userId}", (int userId, IUserListUseCases userListUseCases) =>
        {
            var list = userListUseCases.GetUserLists(userId)
                .Where(ul => ul.Status == "to_watch")
                .ToList();
            return Results.Ok(list);
        })
        .WithName("GetToWatchList")
        .Produces<IEnumerable<UserList>>(StatusCodes.Status200OK);

        // GET : Tous les films déjà regardés d'un user
        group.MapGet("watched/{userId}", (int userId, IUserListUseCases userListUseCases) =>
        {
            var list = userListUseCases.GetUserLists(userId)
                .Where(ul => ul.Status == "watched")
                .ToList();
            return Results.Ok(list);
        })
        .WithName("GetWatchedList")
        .Produces<IEnumerable<UserList>>(StatusCodes.Status200OK);

        // POST : Ajouter un film à "à regarder"
        group.MapPost("to_watch", ([FromBody] UserList userList, IUserListUseCases userListUseCases) =>
        {
            userList.Status = "to_watch";
            userListUseCases.AddToUserList(userList);
            return Results.Ok(new { message = "Film ajouté à la liste à regarder" });
        })
        .WithName("AddToWatch")
        .Produces<object>(StatusCodes.Status200OK);

        // POST : Ajouter un film à "déjà regardé"
        group.MapPost("watched", ([FromBody] UserList userList, IUserListUseCases userListUseCases) =>
        {
            userList.Status = "watched";
            userListUseCases.AddToUserList(userList);
            return Results.Ok(new { message = "Film ajouté à la liste déjà regardée" });
        })
        .WithName("AddWatched")
        .Produces<object>(StatusCodes.Status200OK);

        // PUT : Modifier le status d'un film dans la liste
        group.MapPut("", ([FromBody] UserList userList, IUserListUseCases userListUseCases) =>
        {
            if (userList.Status != "to_watch" && userList.Status != "watched")
            {
                return Results.BadRequest(new { message = "Le status doit être 'to_watch' ou 'watched'." });
            }
            userListUseCases.UpdateUserList(userList);
            return Results.Ok(new { message = "Statut du film modifié avec succès" });
        })
        .WithName("UpdateUserList")
        .Produces<object>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status400BadRequest);

        // DELETE : Supprimer un film de la liste
        group.MapDelete("{id}", (int id, IUserListUseCases userListUseCases) =>
        {
            userListUseCases.RemoveFromUserList(id);
            return Results.Ok(new { message = "Film retiré de la liste de l'utilisateur" });
        })
        .WithName("RemoveFromUserList")
        .Produces<object>(StatusCodes.Status200OK);

        return app;
    }
}