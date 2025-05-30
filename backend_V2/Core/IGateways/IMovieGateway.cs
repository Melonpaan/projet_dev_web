using Core.Models;

namespace Core.IGateways;

public interface IMovieGateway
{
    IEnumerable<Movie> GetAllMovies();
    Movie? GetMovieById(int id);
    void AddMovie(Movie movie);
    void UpdateMovie(Movie movie);
    IEnumerable<Movie> SearchMovies(string searchTerm);
}