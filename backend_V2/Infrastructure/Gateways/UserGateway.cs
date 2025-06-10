using Core.IGateways;
using Core.Models;
using Infrastructure.Repositories.Abstractions;

namespace Infrastructure.Gateways;

public class UserGateway(IUserRepository userRepository) : IUserGateway
{
    private readonly IUserRepository _userRepository = userRepository;

    public User? GetUserByUsername(string username)
    {
        return _userRepository.GetByUsername(username);
    }
    public User? GetUserByEmail(string email)
    {
        return _userRepository.GetByEmail(email);
    }

    public IEnumerable<User> GetAllUsers()
    {
        return _userRepository.GetAll();
    }

    public void AddUser(User user)
    {
        _userRepository.Create(user);
    }
}