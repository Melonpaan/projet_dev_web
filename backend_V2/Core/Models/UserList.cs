namespace Core.Models;

public class UserList
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int MovieId { get; set; }
    public string Status { get; set; }
    public Movie Movie { get; set; }
}