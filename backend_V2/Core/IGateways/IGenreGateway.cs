using Core.Models;

namespace Core.IGateways;

public interface IGenreGateway
{
    IEnumerable<Genre> GetAllGenres();
    Genre? GetGenreById(int id);
    void AddGenre(Genre genre);
    void UpdateGenre(Genre genre);
}