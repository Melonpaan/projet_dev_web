// backend_V2/Api/EndPoints/CommentRoutes.cs
using Core.Models;
using Core.UseCases.Abstractions;
using Microsoft.AspNetCore.Mvc;

namespace Api.EndPoints;

public static class CommentRoutes
{
    public static WebApplication AddCommentRoutes(this WebApplication app)
    {
        var group = app.MapGroup("api/comments")
            .WithTags("Comments");

        group.MapGet("", (ICommentUseCases commentUseCases) =>
        {
            var comments = commentUseCases.GetAllComments();
            return Results.Ok(comments);
        })
        .WithName("GetAllComments")
        .Produces<IEnumerable<Comment>>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status500InternalServerError);

        group.MapPost("", ([FromBody] Comment comment, ICommentUseCases commentUseCases) =>
        {
            commentUseCases.AddComment(comment);
            return Results.Ok(new { message = "Commentaire ajouté avec succès" });
        })
        .WithName("AddComment")
        .Produces<object>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status400BadRequest)
        .Produces(StatusCodes.Status500InternalServerError);
        
        group.MapPut("{id}", (int id, [FromBody] Comment comment, ICommentUseCases commentUseCases) =>
        {
            if (id != comment.Id)
                return Results.BadRequest(new { message = "L'ID dans l'URL ne correspond pas à l'ID du commentaire" });
            
            commentUseCases.UpdateComment(comment);
            return Results.Ok(new { message = "Commentaire mis à jour avec succès" });
        })
        .WithName("UpdateComment")
        .Produces<object>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status400BadRequest)
        .Produces(StatusCodes.Status404NotFound)
        .Produces(StatusCodes.Status500InternalServerError);


        group.MapDelete("{id}", (int id, ICommentUseCases commentUseCases) =>
        {
            commentUseCases.DeleteComment(id);
            return Results.Ok(new { message = "Commentaire supprimé avec succès" });
        })
        .WithName("DeleteComment")
        .Produces<object>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status404NotFound)
        .Produces(StatusCodes.Status500InternalServerError);

        return app;
    }
}