using Core.IGateways;
using Core.Models;
using Core.UseCases.Abstractions;

namespace Core.UseCases;

public class UserListUseCases(IUserListGateway userListGateway) : IUserListUseCases
{
    private readonly IUserListGateway _userListGateway = userListGateway;

    public IEnumerable<UserList> GetUserLists(int userId)
    {
        if (userId <= 0)
        {
            throw new ArgumentException("Invalid user ID", nameof(userId));
        }
        return _userListGateway.GetUserLists(userId);
    }

    public UserList? GetUserListById(int id)
    {
        if (id <= 0)
        {
            throw new ArgumentException("Invalid user list ID", nameof(id));
        }
        return _userListGateway.GetUserListById(id);
    }

    public void AddToUserList(UserList userList)
    {
        if (userList == null)
        {
            throw new ArgumentNullException(nameof(userList));
        }
        _userListGateway.AddToUserList(userList);
    }

    public void UpdateUserList(UserList userList)
    {
        if (userList == null)
        {
            throw new ArgumentNullException(nameof(userList));
        }
        _userListGateway.UpdateUserList(userList);
    }

    public void RemoveFromUserList(int id)
    {
        if (id <= 0)
        {
            throw new ArgumentException("Invalid user list ID", nameof(id));
        }
        _userListGateway.RemoveFromUserList(id);
    }
}