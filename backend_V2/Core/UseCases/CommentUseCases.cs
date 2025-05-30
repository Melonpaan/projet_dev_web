using Core.Models;
using Core.IGateways;
using Core.UseCases.Abstractions;

namespace Core.UseCases;

public class CommentUseCases : ICommentUseCases
{
    private readonly ICommentGateway _commentGateway;

    public CommentUseCases(ICommentGateway commentGateway)
    {
        _commentGateway = commentGateway;
    }

    public IEnumerable<Comment> GetAllComments()
    {
        return _commentGateway.GetAllComments();
    }

    public Comment? GetCommentById(int id)
    {
        if (id <= 0)
        {
            throw new ArgumentException("Invalid comment ID", nameof(id));
        }
        return _commentGateway.GetCommentById(id);
    }

    public void AddComment(Comment comment)
    {
        if (comment == null)
        {
            throw new ArgumentNullException(nameof(comment));
        }
        comment.CreatedAt = DateTime.UtcNow;
        comment.UpdatedAt = DateTime.UtcNow;

        _commentGateway.AddComment(comment);
    }

    public void UpdateComment(Comment comment)
    {
        if (comment == null)
        {
            throw new ArgumentNullException(nameof(comment));
        }

        comment.UpdatedAt = DateTime.UtcNow;

        _commentGateway.UpdateComment(comment);
    }

    public void DeleteComment(int id)
    {
        if (id <= 0)
        {
            throw new ArgumentException("Invalid comment ID", nameof(id));
        }
        _commentGateway.DeleteComment(id);
    }
}