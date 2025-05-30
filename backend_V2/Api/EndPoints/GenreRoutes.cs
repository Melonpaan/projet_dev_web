// backend_V2/Api/EndPoints/GenreRoutes.cs
using Core.Models;
using Core.UseCases.Abstractions;
using Microsoft.AspNetCore.Mvc;

namespace Api.EndPoints;

public static class GenreRoutes
{
    public static WebApplication AddGenreRoutes(this WebApplication app)
    {
        var group = app.MapGroup("api/genres")
            .WithTags("Genres");

        group.MapGet("", (IGenreUseCases genreUseCases) =>
        {
            var genres = genreUseCases.GetAllGenres();
            return Results.Ok(genres);
        })
        .WithName("GetAllGenres")
        .Produces<IEnumerable<Genre>>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status500InternalServerError);

        return app;
    }
}