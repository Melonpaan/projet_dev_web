// backend_V2/Api/EndPoints/CommentRoutes.cs
using Core.Models;
using Core.UseCases.Abstractions;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

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

        group.MapPost("", ([FromBody] Comment comment, HttpContext context, ICommentUseCases commentUseCases) =>
        {
            var userId = int.Parse(context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            comment.UserId = userId;
            commentUseCases.AddComment(comment);
            return Results.Ok(new { message = "Commentaire ajouté avec succès" });
        })
        .RequireAuthorization()
        .WithName("AddComment")
        .Produces<object>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status401Unauthorized)
        .Produces(StatusCodes.Status500InternalServerError);
        
       group.MapPut("/{id}", (int id, [FromBody] Comment comment, HttpContext context, ICommentUseCases commentUseCases) =>
        {
            var userId = int.Parse(context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            Console.WriteLine($"🔍 User ID from token: {userId}");
            Console.WriteLine($"🔍 Comment ID from URL: {id}");
            
            var existingComment = commentUseCases.GetCommentById(id);
            Console.WriteLine($"🔍 Existing comment found: {existingComment != null}");
            
            if (existingComment == null)
            {
                Console.WriteLine("❌ Comment not found");
                return Results.NotFound(new { message = "Commentaire non trouvé" });
            }
            
            Console.WriteLine($"🔍 Existing comment userId: {existingComment.UserId}");
            Console.WriteLine($"🔍 Token userId: {userId}");
            Console.WriteLine($"🔍 Are they equal? {existingComment.UserId == userId}");
                
            if (existingComment.UserId != userId)
            {
                Console.WriteLine("❌ Authorization failed - returning 403");
                return Results.Forbid();
            }

            Console.WriteLine("✅ Authorization successful - updating comment");
            comment.Id = id;
            comment.UserId = userId;
            commentUseCases.UpdateComment(comment);
            return Results.Ok(new { message = "Commentaire mis à jour avec succès" });
        })
                .RequireAuthorization()
                .WithName("UpdateComment")
                .Produces<object>(StatusCodes.Status200OK)
                .Produces(StatusCodes.Status401Unauthorized)
                .Produces(StatusCodes.Status403Forbidden)
                .Produces(StatusCodes.Status404NotFound);

        group.MapDelete("/{id}", (int id, HttpContext context, ICommentUseCases commentUseCases) =>
        {
            var userId = int.Parse(context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var existingComment = commentUseCases.GetCommentById(id);
            
            if (existingComment == null)
                return Results.NotFound(new { message = "Commentaire non trouvé" });
                
            if (existingComment.UserId != userId)
                return Results.Forbid();

            commentUseCases.DeleteComment(id);
            return Results.Ok(new { message = "Commentaire supprimé avec succès" });
        })
        .RequireAuthorization()
        .WithName("DeleteComment")
        .Produces<object>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status401Unauthorized)
        .Produces(StatusCodes.Status403Forbidden)
        .Produces(StatusCodes.Status404NotFound);

        return app;
    }
}