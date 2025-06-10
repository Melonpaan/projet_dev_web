using Core.Models;

namespace Infrastructure.Repositories.Abstractions;

public interface IUserRepository
{
    User? GetById(int id);
    User? GetByUsername(string username);
    User? GetByEmail(string email);
    int Create(User user);
    int Update(User user);
    string? GetPasswordHash(string username);
    IEnumerable<User> GetAll();
}