using Core.IGateways;
using Core.Models;
using Core.UseCases.Abstractions;

namespace Core.UseCases;

public class GenreUseCases(IGenreGateway genreGateway) : IGenreUseCases
{
    private readonly IGenreGateway _genreGateway = genreGateway;

    public IEnumerable<Genre> GetAllGenres()
    {
        return _genreGateway.GetAllGenres();
    }

    public Genre? GetGenreById(int id)
    {
        if (id <= 0)
        {
            throw new ArgumentException("Invalid genre ID", nameof(id));
        }
        return _genreGateway.GetGenreById(id);
    }
}