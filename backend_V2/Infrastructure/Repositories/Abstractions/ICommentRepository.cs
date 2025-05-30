using Core.Models;

namespace Infrastructure.Repositories.Abstractions;

public interface ICommentRepository
{
    IEnumerable<Comment> GetAll();
    Comment? GetById(int id);
    int Create(Comment comment);
    int Update(Comment comment);
    int Delete(int id);
}
