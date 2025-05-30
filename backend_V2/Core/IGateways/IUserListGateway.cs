using Core.Models;

namespace Core.IGateways;

public interface IUserListGateway
{
    IEnumerable<UserList> GetUserLists(int userId);
    UserList? GetUserListById(int id);
    void AddToUserList(UserList userList);
    void UpdateUserList(UserList userList);
    void RemoveFromUserList(int id);
}