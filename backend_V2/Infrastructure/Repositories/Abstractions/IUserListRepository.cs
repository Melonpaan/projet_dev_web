using Core.Models;

namespace Infrastructure.Repositories.Abstractions;

public interface IUserListRepository
{
    IEnumerable<UserList> GetByUserId(int userId);
    UserList? GetById(int id);
    int Create(UserList userList);
    int Update(UserList userList);
    int Delete(int id);
}