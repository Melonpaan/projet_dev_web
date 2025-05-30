namespace Core.Models;

public class Movie
{
    public int Id { get; set; }
    public string Title { get; set; }
    public bool Adult { get; set; }
    public string BackdropPath { get; set; }
    public string OriginalLanguage { get; set; }
    public string OriginalTitle { get; set; }
    public string Overview { get; set; }
    public float Popularity { get; set; }
    public string PosterPath { get; set; }
    public DateTime? ReleaseDate { get; set; }
    public float VoteAverageTopRated { get; set; }
    public int VoteCount { get; set; }
    public long Revenue { get; set; }
    public int Runtime { get; set; }
    public string Tagline { get; set; }
    public string YoutubeUrl { get; set; }
    public ICollection<Genre> Genres { get; set; } = new List<Genre>();
}