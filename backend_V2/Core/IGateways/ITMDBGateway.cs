using Core.Models;

namespace Core.IGateways;

public interface ITMDBGateway
{
    Task<IEnumerable<Movie>> GetTopRatedMovies(int page);
    Task<Movie> GetMovieDetails(int movieId);
    Task<IEnumerable<Genre>> GetAllGenres();
    Task<string> GetMovieTrailerUrl(int movieId);
}