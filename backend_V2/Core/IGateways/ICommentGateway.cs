using Core.Models;

namespace Core.IGateways;

public interface ICommentGateway
{
    IEnumerable<Comment> GetAllComments();
    Comment? GetCommentById(int id);
    void AddComment(Comment comment);
    void UpdateComment(Comment comment);
    void DeleteComment(int id);
}