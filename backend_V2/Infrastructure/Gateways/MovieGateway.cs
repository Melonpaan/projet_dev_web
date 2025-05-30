using Core.IGateways;
using Core.Models;
using Infrastructure.Repositories.Abstractions;

namespace Infrastructure.Gateways;

public class MovieGateway(
    IMovieRepository movieRepository,
    IGenreRepository genreRepository) : IMovieGateway
{
    private readonly IMovieRepository _movieRepository = movieRepository;
    private readonly IGenreRepository _genreRepository = genreRepository;

    public IEnumerable<Movie> GetAllMovies()
    {
        return _movieRepository.GetAll();
    }

    public Movie? GetMovieById(int id)
    {
        return _movieRepository.GetById(id);
    }

    public void AddMovie(Movie movie)
    {
        var movieId = _movieRepository.Insert(movie);  // Changé de Create à Insert

        if (movie.Genres != null)
        {
            foreach (var genre in movie.Genres)
            {
                _movieRepository.AddGenreToMovie(movieId, genre.Id);
            }
        }
    }

    public void UpdateMovie(Movie movie)
    {
        _movieRepository.Update(movie);

        if (movie.Genres != null)
        {
            _movieRepository.RemoveAllGenresForMovie(movie.Id);
            foreach (var genre in movie.Genres)
            {
                _movieRepository.AddGenreToMovie(movie.Id, genre.Id);
            }
        }
    }

    public IEnumerable<Movie> SearchMovies(string searchTerm)
    {
        return _movieRepository.SearchByTitle(searchTerm);
    }
}