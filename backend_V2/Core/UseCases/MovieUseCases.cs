using Core.IGateways;
using Core.Models;
using Core.UseCases.Abstractions;

namespace Core.UseCases;

public class MovieUseCases(IMovieGateway movieGateway, ITMDBGateway tmdbGateway, IGenreGateway genreGateway ) : IMovieUseCases
{
    private readonly IMovieGateway _movieGateway = movieGateway;
    private readonly ITMDBGateway _tmdbGateway = tmdbGateway;
    private readonly IGenreGateway _genreGateway = genreGateway;


    public IEnumerable<Movie> GetAllMovies()
    {
        return _movieGateway.GetAllMovies();
    }

    public Movie? GetMovieById(int id)
    {
        if (id <= 0)
        {
            throw new ArgumentException("Invalid movie ID", nameof(id));
        }
        return _movieGateway.GetMovieById(id);
    }

    public IEnumerable<Movie> SearchMovies(string searchTerm)
    {
        if (string.IsNullOrWhiteSpace(searchTerm))
        {
            throw new ArgumentException("Search term cannot be empty", nameof(searchTerm));
        }
        return _movieGateway.SearchMovies(searchTerm);
    }

    public void AddMovie(Movie movie)
    {
        if (movie == null)
        {
            throw new ArgumentNullException(nameof(movie));
        }
        _movieGateway.AddMovie(movie);
    }

    public void UpdateMovie(Movie movie)
    {
        if (movie == null)
        {
            throw new ArgumentNullException(nameof(movie));
        }
        _movieGateway.UpdateMovie(movie);
    }

    public async Task SyncMoviesFromTMDB(int pages)
    {
        if (pages <= 0)
        {
            throw new ArgumentException("Number of pages must be greater than 0", nameof(pages));
        }

        try
        {
            // Synchroniser d'abord les genres
            var genres = await _tmdbGateway.GetAllGenres();
            foreach (var genre in genres)
            {
                try
                {
                    _genreGateway.AddGenre(genre);
                }
                catch (Exception ex)
                {
                    // Log l'erreur mais continue avec le prochain genre
                    Console.WriteLine($"Erreur lors de l'ajout du genre {genre.Id}: {ex.Message}");
                }
            }

            // Synchroniser les films page par page
            for (int page = 1; page <= pages; page++)
            {
                var movies = await _tmdbGateway.GetTopRatedMovies(page);
                
                foreach (var movie in movies)
                {
                    try
                    {
                        // Vérifier si le film existe déjà
                        var existingMovie = _movieGateway.GetMovieById(movie.Id);
                        if (existingMovie == null)
                        {
                            _movieGateway.AddMovie(movie);
                        }
                        else
                        {
                            _movieGateway.UpdateMovie(movie);
                        }
                    }
                    catch (Exception ex)
                    {
                        // Log l'erreur mais continue avec le prochain film
                        Console.WriteLine($"Erreur lors du traitement du film {movie.Id}: {ex.Message}");
                    }
                }
            }
        }
        catch (Exception ex)
        {
            throw new Exception($"Erreur lors de la synchronisation : {ex.Message}", ex);
        }
    }
}