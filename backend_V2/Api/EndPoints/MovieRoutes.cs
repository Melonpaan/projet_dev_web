// backend_V2/Api/EndPoints/MovieRoutes.cs
using Core.Models;
using Core.UseCases.Abstractions;
using Microsoft.AspNetCore.Mvc;

namespace Api.EndPoints;

public static class MovieRoutes
{
    public static WebApplication AddMovieRoutes(this WebApplication app)
    {
        var group = app.MapGroup("api/movies")
            .WithTags("Movies");

        group.MapGet("", (IMovieUseCases movieUseCases) =>
        {
            var movies = movieUseCases.GetAllMovies();
            return Results.Ok(movies);
        })
        .WithName("GetAllMovies")
        .Produces<IEnumerable<Movie>>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status500InternalServerError);

        group.MapGet("{id}", (int id, IMovieUseCases movieUseCases) =>
        {
            var movie = movieUseCases.GetMovieById(id);
            if (movie == null)
                return Results.NotFound();
            return Results.Ok(movie);
        })
        .WithName("GetMovieById")
        .Produces<Movie>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status404NotFound)
        .Produces(StatusCodes.Status500InternalServerError);

        group.MapGet("search/{searchTerm}", (string searchTerm, IMovieUseCases movieUseCases) =>
        {
            var movies = movieUseCases.SearchMovies(searchTerm);
            return Results.Ok(movies);
        })
        .WithName("SearchMovies")
        .Produces<IEnumerable<Movie>>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status400BadRequest)
        .Produces(StatusCodes.Status500InternalServerError);

        group.MapPut("{id}", (int id, [FromBody] Movie movie, IMovieUseCases movieUseCases) =>
        {
            if (id != movie.Id)
                return Results.BadRequest(new { message = "L'ID dans l'URL ne correspond pas à l'ID du film" });
            
            movieUseCases.UpdateMovie(movie);
            return Results.Ok(new { message = "Film mis à jour avec succès" });
        })
        .WithName("UpdateMovie")
        .Produces<object>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status400BadRequest)
        .Produces(StatusCodes.Status404NotFound)
        .Produces(StatusCodes.Status500InternalServerError);

        group.MapPost("sync-from-tmdb", async (int pages, IMovieUseCases movieUseCases) =>
        {
            await movieUseCases.SyncMoviesFromTMDB(pages);
            return Results.Ok(new { message = "Synchronisation des films depuis TMDB réussie" });
        })
        .WithName("SyncFromTMDB")
        .Produces<object>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status500InternalServerError);

        return app;
    }
}