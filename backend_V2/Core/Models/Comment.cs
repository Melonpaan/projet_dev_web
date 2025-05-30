namespace Core.Models;

public class Comment
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int MovieId { get; set; }
    public string Content { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public long? ParentCommentId { get; set; }
    public int LikesCount { get; set; }
    public string Username { get; set; }
}