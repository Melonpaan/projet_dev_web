using Core.IGateways;
using Core.Models;
using Microsoft.Extensions.Configuration;
using System.Net.Http.Json;
using System.Text.Json.Serialization;


namespace Infrastructure.Gateways;

    public class TMDBGateway(IConfiguration configuration, HttpClient httpClient) : ITMDBGateway
    {
        private readonly HttpClient _httpClient = httpClient;
        private readonly string _apiKey = configuration["TMDBSettings:ApiKey"] 
            ?? throw new ArgumentNullException(nameof(configuration), "TMDB API key not found");
        private readonly string _baseUrl = configuration["TMDBSettings:BaseUrl"] 
            ?? throw new ArgumentNullException(nameof(configuration), "TMDB base URL not found");

        public async Task<IEnumerable<Movie>> GetTopRatedMovies(int page)
    {
        var response = await _httpClient.GetFromJsonAsync<TMDBResponse>($"{_baseUrl}/movie/top_rated?api_key={_apiKey}&page={page}");
        if (response?.Results == null)
            return Enumerable.Empty<Movie>();

        var movies = new List<Movie>();
        foreach (var movie in response.Results)
        {
            // Pour les films de la liste top rated, nous devons aussi récupérer les détails complets
            var details = await GetMovieDetails(movie.Id);

            
            // Tenter de parser la date de sortie de l'objet TMDBMovie initial
            DateTime? releaseDate = null;
            if (!string.IsNullOrEmpty(movie.ReleaseDate))
            {
                if (DateTime.TryParse(movie.ReleaseDate, out DateTime parsedDate))
                {
                    releaseDate = parsedDate;
                }
            }

            // Combiner les informations de top rated avec les détails
            var combinedMovie = new Movie
            {
                Id = movie.Id,
                Title = movie.Title,
                Adult = movie.Adult,
                BackdropPath = !string.IsNullOrEmpty(movie.BackdropPath) ? $"https://image.tmdb.org/t/p/original{movie.BackdropPath}" : null,
                OriginalLanguage = movie.OriginalLanguage,
                OriginalTitle = movie.OriginalTitle,
                Overview = movie.Overview,
                Popularity = movie.Popularity,
                PosterPath = !string.IsNullOrEmpty(movie.PosterPath) ? $"https://image.tmdb.org/t/p/original{movie.PosterPath}" : null,
                ReleaseDate = releaseDate ?? DateTime.MinValue, // Utiliser la date parsée, ou MinValue si null
                VoteAverageTopRated = movie.VoteAverage,
                VoteCount = movie.VoteCount,
                // Informations supplémentaires des détails
                Revenue = details.Revenue,
                Runtime = details.Runtime,
                Tagline = details.Tagline,
                YoutubeUrl = details.YoutubeUrl,
                Genres = details.Genres // Les genres viennent des détails car plus complets
            };

            movies.Add(combinedMovie);

        }

        return movies;
    }


    public async Task<Movie> GetMovieDetails(int movieId)
    {
        var response = await _httpClient.GetFromJsonAsync<TMDBMovieDetails>($"{_baseUrl}/movie/{movieId}?api_key={_apiKey}");
        if (response == null)
            throw new Exception($"Movie with ID {movieId} not found");
        
        
        // Récupérer l'URL YouTube
        var youtubeUrl = await GetMovieTrailerUrl(movieId);

        // Construire les URLs complètes pour les images
        var baseImageUrl = "https://image.tmdb.org/t/p/original";
        var posterPath = !string.IsNullOrEmpty(response.PosterPath) ? $"{baseImageUrl}{response.PosterPath}" : null;
        var backdropPath = !string.IsNullOrEmpty(response.BackdropPath) ? $"{baseImageUrl}{response.BackdropPath}" : null;

        // Gestion de la date de sortie
        DateTime releaseDate;
        if (!string.IsNullOrEmpty(response.ReleaseDate))
        {
            if (!DateTime.TryParse(response.ReleaseDate, out releaseDate))
            {
                releaseDate = DateTime.MinValue;
            }
        }
        else
        {
            releaseDate = DateTime.MinValue;
        }

        var movie = new Movie
    {
        Id = response.Id,
        Title = response.Title ?? string.Empty,
        Adult = response.Adult,
        BackdropPath = backdropPath,
        OriginalLanguage = response.OriginalLanguage ?? string.Empty,
        OriginalTitle = response.OriginalTitle ?? string.Empty,
        Overview = response.Overview ?? string.Empty,
        Popularity = response.Popularity,
        PosterPath = posterPath,
        ReleaseDate = releaseDate,
        VoteAverageTopRated = response.VoteAverage,
        VoteCount = response.VoteCount,
        Revenue = response.Revenue,
        Runtime = response.Runtime,
        Tagline = response.Tagline ?? string.Empty,
        YoutubeUrl = youtubeUrl,
        Genres = response.Genres?.Select(g => new Genre { Id = g.Id, Name = g.Name ?? string.Empty }).ToList() ?? new List<Genre>()
    };

    return movie;
    }

    public async Task<IEnumerable<Genre>> GetAllGenres()
    {
        var response = await _httpClient.GetFromJsonAsync<TMDBGenresResponse>($"{_baseUrl}/genre/movie/list?api_key={_apiKey}");
        if (response?.Genres == null)
            return Enumerable.Empty<Genre>();

        return response.Genres.Select(g => new Genre { Id = g.Id, Name = g.Name });
    }

    public async Task<string> GetMovieTrailerUrl(int movieId)
    {
        var response = await _httpClient.GetFromJsonAsync<TMDBVideosResponse>($"{_baseUrl}/movie/{movieId}/videos?api_key={_apiKey}");
        if (response?.Results == null)
            return string.Empty;

        var trailer = response.Results.FirstOrDefault(v => v.Type == "Trailer" && v.Site == "YouTube");
        return trailer?.Key != null ? $"https://www.youtube.com/watch?v={trailer.Key}" : string.Empty;
    }
}

// Classes pour la désérialisation des réponses TMDB
public class TMDBResponse
{
    [JsonPropertyName("results")]
    public List<TMDBMovie> Results { get; set; }
}

public class TMDBMovie
{
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("title")]
    public string Title { get; set; }

    [JsonPropertyName("adult")]
    public bool Adult { get; set; }

    [JsonPropertyName("backdrop_path")]
    public string BackdropPath { get; set; }

    [JsonPropertyName("original_language")]
    public string OriginalLanguage { get; set; }

    [JsonPropertyName("original_title")]
    public string OriginalTitle { get; set; }

    [JsonPropertyName("overview")]
    public string Overview { get; set; }

    [JsonPropertyName("popularity")]
    public float Popularity { get; set; }

    [JsonPropertyName("poster_path")]
    public string PosterPath { get; set; }

    [JsonPropertyName("release_date")]
    public string ReleaseDate { get; set; }

    [JsonPropertyName("vote_average")]
    public float VoteAverage { get; set; }

    [JsonPropertyName("vote_count")]
    public int VoteCount { get; set; }

    [JsonPropertyName("genre_ids")]
    public List<int> GenreIds { get; set; }
}

public class TMDBMovieDetails : TMDBMovie
{
    [JsonPropertyName("revenue")]
    public long Revenue { get; set; }

    [JsonPropertyName("runtime")]
    public int Runtime { get; set; }

    [JsonPropertyName("tagline")]
    public string Tagline { get; set; }

    [JsonPropertyName("genres")]
    public List<TMDBGenre> Genres { get; set; }
}

public class TMDBGenre
{
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("name")]
    public string Name { get; set; }
}

public class TMDBGenresResponse
{
    [JsonPropertyName("genres")]
    public List<TMDBGenre> Genres { get; set; }
}

public class TMDBVideosResponse
{
    [JsonPropertyName("results")]
    public List<TMDBVideo> Results { get; set; }
}

public class TMDBVideo
{
    [JsonPropertyName("key")]
    public string Key { get; set; }

    [JsonPropertyName("type")]
    public string Type { get; set; }

    [JsonPropertyName("site")]
    public string Site { get; set; }
}
