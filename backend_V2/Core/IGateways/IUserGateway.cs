using Core.Models;

namespace Core.IGateways;

public interface IUserGateway
{   
    User? GetUserByEmail(string email);
    User? GetUserByUsername(string username);
    IEnumerable<User> GetAllUsers();
    void AddUser(User user);
}