using Core.Models;

namespace Core.UseCases.Abstractions;

public interface IGenreUseCases
{
    IEnumerable<Genre> GetAllGenres();
    Genre? GetGenreById(int id);
}