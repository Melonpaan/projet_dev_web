using Core.Models;

namespace Core.UseCases.Abstractions;

public interface IUserListUseCases
{
    IEnumerable<UserList> GetUserLists(int userId);
    UserList? GetUserListById(int id);
    void AddToUserList(UserList userList);
    void UpdateUserList(UserList userList);
    void RemoveFromUserList(int id);
}
