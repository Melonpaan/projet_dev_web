using Core.IGateways;
using Core.Models;
using Infrastructure.Repositories.Abstractions;

namespace Infrastructure.Gateways;

public class GenreGateway(IGenreRepository genreRepository) : IGenreGateway
{
    private readonly IGenreRepository _genreRepository = genreRepository;

    public IEnumerable<Genre> GetAllGenres()
    {
        return _genreRepository.GetAll();
    }

    public Genre? GetGenreById(int id)
    {
        if (id <= 0)
        {
            throw new ArgumentException("Invalid genre ID", nameof(id));
        }
        return _genreRepository.GetById(id);
    }

    public void AddGenre(Genre genre)
    {
        if (genre == null)
        {
            throw new ArgumentNullException(nameof(genre));
        }
        _genreRepository.Insert(genre);  // Changé de Create à Insert
    }

    public void UpdateGenre(Genre genre)
    {
        if (genre == null)
        {
            throw new ArgumentNullException(nameof(genre));
        }
        _genreRepository.Update(genre);
    }
}