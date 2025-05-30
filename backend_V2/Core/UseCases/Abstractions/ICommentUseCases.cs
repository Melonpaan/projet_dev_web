using Core.Models;

namespace Core.UseCases.Abstractions;

public interface ICommentUseCases
{
    IEnumerable<Comment> GetAllComments();
    Comment? GetCommentById(int id);
    void AddComment(Comment comment);
    void UpdateComment(Comment comment);
    void DeleteComment(int id);
}