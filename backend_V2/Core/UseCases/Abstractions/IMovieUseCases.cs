using Core.Models;

namespace Core.UseCases.Abstractions;

public interface IMovieUseCases
{
    IEnumerable<Movie> GetAllMovies();
    Movie? GetMovieById(int id);
    IEnumerable<Movie> SearchMovies(string searchTerm);
    void AddMovie(Movie movie);
    void UpdateMovie(Movie movie);
    Task SyncMoviesFromTMDB(int pages);
}