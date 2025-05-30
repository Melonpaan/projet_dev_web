using Core.Models;

namespace Infrastructure.Repositories.Abstractions;

public interface IGenreRepository
{
    IEnumerable<Genre> GetAll();
    Genre? GetById(int id);
    int Insert(Genre genre);
    int Update(Genre genre);
}