using Core.IGateways;
using Core.Models;
using Infrastructure.Repositories.Abstractions;

namespace Infrastructure.Gateways;

public class CommentGateway(ICommentRepository commentRepository) : ICommentGateway
{
    private readonly ICommentRepository _commentRepository = commentRepository;

    public IEnumerable<Comment> GetAllComments()
    {
        return _commentRepository.GetAll();
    }

    public Comment? GetCommentById(int id)
    {
        return _commentRepository.GetById(id);
    }

    public void AddComment(Comment comment)
    {
        _commentRepository.Create(comment);
    }

    public void UpdateComment(Comment comment)
    {
        _commentRepository.Update(comment);
    }

    public void DeleteComment(int id)
    {
        _commentRepository.Delete(id);
    }
}