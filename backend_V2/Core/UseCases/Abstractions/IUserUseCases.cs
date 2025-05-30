using Core.Models;

namespace Core.UseCases.Abstractions;

public interface IUserUseCases
{
    User AuthenticateAndGetUser(AuthenticationRequest request);
    IEnumerable<User> GetAllUsers();
    void Register(RegisterRequest request);
}