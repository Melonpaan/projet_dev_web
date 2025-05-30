using System.Data;
using Core.Models;
using Dapper;
using Infrastructure.Repositories.Abstractions;
using Microsoft.Extensions.Configuration;
using MySql.Data.MySqlClient;

namespace Infrastructure.Repositories;

public class MovieRepository(IConfiguration configuration) : IMovieRepository
{
    private readonly string _connectionString = configuration.GetConnectionString("DefaultConnection")
        ?? throw new ArgumentNullException(nameof(configuration), "Database connection string 'DefaultConnection' not found.");

    private IDbConnection CreateConnection() => new MySqlConnection(_connectionString);

    public IEnumerable<Movie> GetAll()
    {
        const string sql = @"
        SELECT 
            id AS Id,
            title AS Title,
            adult AS Adult,
            backdrop_path AS BackdropPath,
            original_language AS OriginalLanguage,
            original_title AS OriginalTitle,
            overview AS Overview,
            popularity AS Popularity,
            poster_path AS PosterPath,
            release_date AS ReleaseDate,
            vote_average_top_rated AS VoteAverageTopRated,
            vote_count AS VoteCount,
            revenue AS Revenue,
            runtime AS Runtime,
            tagline AS Tagline,
            youtube_url AS YoutubeUrl
        FROM movies;";
        using var connection = CreateConnection();
        var movies = connection.Query<Movie>(sql).ToList();
        
        // Charger les genres pour chaque film
        foreach (var movie in movies)
        {
            movie.Genres = GetMovieGenres(movie.Id).ToList();
        }
        
        return movies;
    }

    public Movie? GetById(int id)
    {
        const string sql = @"
        SELECT 
            id AS Id,
            title AS Title,
            adult AS Adult,
            backdrop_path AS BackdropPath,
            original_language AS OriginalLanguage,
            original_title AS OriginalTitle,
            overview AS Overview,
            popularity AS Popularity,
            poster_path AS PosterPath,
            release_date AS ReleaseDate,
            vote_average_top_rated AS VoteAverageTopRated,
            vote_count AS VoteCount,
            revenue AS Revenue,
            runtime AS Runtime,
            tagline AS Tagline,
            youtube_url AS YoutubeUrl
        FROM movies
        WHERE id = @Id;";
        using var connection = CreateConnection();
        var movie = connection.QuerySingleOrDefault<Movie>(sql, new { Id = id });
        
        if (movie != null)
        {
            movie.Genres = GetMovieGenres(id).ToList();
        }
        
        return movie;
    }

    public int Insert(Movie movie)
    {
        const string sql = @"
            INSERT INTO movies (
                id, title, adult, backdrop_path, original_language, original_title,
                overview, popularity, poster_path, release_date, vote_average_top_rated,
                vote_count, revenue, runtime, tagline, youtube_url
            ) VALUES (
                @Id, @Title, @Adult, @BackdropPath, @OriginalLanguage, @OriginalTitle,
                @Overview, @Popularity, @PosterPath, @ReleaseDate, @VoteAverageTopRated,
                @VoteCount, @Revenue, @Runtime, @Tagline, @YoutubeUrl
            );";
        
        using var connection = CreateConnection();
        connection.Open();
        using var transaction = connection.BeginTransaction();
        try
        {
            var result = connection.Execute(sql, movie, transaction);
            
            // Ajouter les genres si présents
            if (movie.Genres != null && movie.Genres.Any())
            {
                AddGenresToMovie(movie.Id, movie.Genres.Select(g => g.Id), transaction);
            }
            
            transaction.Commit();
            return movie.Id;
        }
        catch
        {
            transaction.Rollback();
            throw;
        }
    }

    public int Update(Movie movie)
    {
        const string sql = @"
            UPDATE movies 
            SET title = @Title,
                adult = @Adult,
                backdrop_path = @BackdropPath,
                original_language = @OriginalLanguage,
                original_title = @OriginalTitle,
                overview = @Overview,
                popularity = @Popularity,
                poster_path = @PosterPath,
                release_date = @ReleaseDate,
                vote_average_top_rated = @VoteAverageTopRated,
                vote_count = @VoteCount,
                revenue = @Revenue,
                runtime = @Runtime,
                tagline = @Tagline,
                youtube_url = @YoutubeUrl
            WHERE id = @Id;";
        
        using var connection = CreateConnection();
        connection.Open(); // Ajout de cette ligne
        using var transaction = connection.BeginTransaction();
        try
        {
            var result = connection.Execute(sql, movie, transaction);
            
            // Mettre à jour les genres si présents
            if (movie.Genres != null)
            {
                UpdateMovieGenres(movie.Id, movie.Genres.Select(g => g.Id), transaction);
            }
            
            transaction.Commit();
            return result;
        }
        catch
        {
            transaction.Rollback();
            throw;
        }
    }

    public IEnumerable<Movie> SearchByTitle(string searchTerm)
    {
        const string sql = @"
            SELECT m.* 
            FROM movies m 
            WHERE m.title LIKE @SearchTerm;";
        using var connection = CreateConnection();
        var movies = connection.Query<Movie>(sql, new { SearchTerm = $"%{searchTerm}%" }).ToList();
        
        // Charger les genres pour chaque film
        foreach (var movie in movies)
        {
            movie.Genres = GetMovieGenres(movie.Id).ToList();
        }
        
        return movies;
    }

    public void AddGenreToMovie(int movieId, int genreId)
    {
        const string sql = @"
            INSERT IGNORE INTO movie_genres (movie_id, genre_id)
            VALUES (@MovieId, @GenreId);";
        using var connection = CreateConnection();
        connection.Execute(sql, new { MovieId = movieId, GenreId = genreId });
    }

    public void RemoveAllGenresForMovie(int movieId)
    {
        const string sql = "DELETE FROM movie_genres WHERE movie_id = @MovieId;";
        using var connection = CreateConnection();
        connection.Execute(sql, new { MovieId = movieId });
    }

    // Méthodes privées
    private IEnumerable<Genre> GetMovieGenres(int movieId)
    {
        const string sql = @"
            SELECT g.* 
            FROM genres g
            INNER JOIN movie_genres mg ON g.id = mg.genre_id
            WHERE mg.movie_id = @MovieId;";
        using var connection = CreateConnection();
        return connection.Query<Genre>(sql, new { MovieId = movieId });
    }

    private void AddGenresToMovie(int movieId, IEnumerable<int> genreIds, IDbTransaction? transaction = null)
    {
        const string sql = @"
            INSERT IGNORE INTO movie_genres (movie_id, genre_id)
            VALUES (@MovieId, @GenreId);";
        
        var connection = transaction?.Connection ?? CreateConnection();
        foreach (var genreId in genreIds)
        {
            connection.Execute(sql, new { MovieId = movieId, GenreId = genreId }, transaction);
        }
    }

    private void UpdateMovieGenres(int movieId, IEnumerable<int> newGenreIds, IDbTransaction? transaction = null)
    {
        RemoveAllGenresForMovie(movieId);
        AddGenresToMovie(movieId, newGenreIds, transaction);
    }
}