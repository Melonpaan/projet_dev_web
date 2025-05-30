using Core.Models;

namespace Core.IGateways;

public interface IUserGateway
{
    User? GetUserByUsername(string username);
    IEnumerable<User> GetAllUsers();
    void AddUser(User user);
}