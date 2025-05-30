using Core.IGateways;
using Core.Models;
using Infrastructure.Repositories.Abstractions;

namespace Infrastructure.Gateways;

public class UserListGateway(IUserListRepository userListRepository) : IUserListGateway
{
    private readonly IUserListRepository _userListRepository = userListRepository;

    public IEnumerable<UserList> GetUserLists(int userId)
    {
        return _userListRepository.GetByUserId(userId);
    }

    public UserList? GetUserListById(int id)
    {
        return _userListRepository.GetById(id);
    }

    public void AddToUserList(UserList userList)
    {
        _userListRepository.Create(userList);
    }

    public void UpdateUserList(UserList userList)
    {
        _userListRepository.Update(userList);
    }

    public void RemoveFromUserList(int id)
    {
        _userListRepository.Delete(id);
    }
}