using Core.Models;
using Core.IGateways;
using Core.UseCases.Abstractions;
using BCrypt.Net;

namespace Core.UseCases;

public class UserUseCases : IUserUseCases
{
    private readonly IUserGateway _userGateway;

    public UserUseCases(IUserGateway userGateway)
    {
        _userGateway = userGateway;
    }

    public User AuthenticateAndGetUser(AuthenticationRequest request)
    {
        if (request == null)
        {
            throw new InvalidOperationException("Utilisateur non trouvé");
        }

        var user = _userGateway.GetUserByUsername(request.Username);
        if (user == null)
        {
            throw new InvalidOperationException("Utilisateur non trouvé");
        }

        if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            throw new InvalidOperationException("Utilisateur non trouvé");
        }

        return user;
    }

    public IEnumerable<User> GetAllUsers()
    {
        return _userGateway.GetAllUsers();
    }

    public void Register(RegisterRequest request)
    {
        if (request == null)
        {
            throw new ArgumentNullException(nameof(request));
        }

        if (request.Password != request.ConfirmPassword)
        {
            throw new ArgumentException("Les mots de passe ne correspondent pas");
        }

        var user = new User
        {
            Username = request.Username,
            Email = request.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            FirstName = request.FirstName,
            LastName = request.LastName,
            DateOfBirth = request.DateOfBirth 
        };

        _userGateway.AddUser(user);
    }
}