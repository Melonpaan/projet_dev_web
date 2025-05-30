using Core.Models;

namespace Infrastructure.Repositories.Abstractions;

public interface IMovieRepository
{
    IEnumerable<Movie> GetAll();
    Movie? GetById(int id);
    int Insert(Movie movie);
    int Update(Movie movie);
    void AddGenreToMovie(int movieId, int genreId);
    void RemoveAllGenresForMovie(int movieId);
    IEnumerable<Movie> SearchByTitle(string searchTerm);
}