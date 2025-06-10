using System.Data;
using Dapper;
using Core.Models;
using Infrastructure.Repositories.Abstractions;
using Microsoft.Extensions.Configuration;
using MySql.Data.MySqlClient;

namespace Infrastructure.Repositories;

public class CommentRepository(IConfiguration configuration) : ICommentRepository
{
    private readonly string _connectionString = configuration.GetConnectionString("DefaultConnection")
        ?? throw new ArgumentNullException(nameof(configuration), "Database connection string 'DefaultConnection' not found.");

    private IDbConnection CreateConnection() => new MySqlConnection(_connectionString);

    public IEnumerable<Comment> GetAll()
    {
        const string sql = @"
        SELECT
            c.id AS Id,
            c.user_id AS UserId,
            c.movie_id AS MovieId,
            c.content AS Content,
            c.created_at AS CreatedAt,
            c.updated_at AS UpdatedAt,
            c.parent_comment_id AS ParentCommentId,
            c.likes_count AS LikesCount,
            u.username AS Username
        FROM comments c
        JOIN users u ON c.user_id = u.id;";
        using var connection = CreateConnection();
        return connection.Query<Comment>(sql);
    }

    public Comment? GetById(int id)
    {
        const string sql = @"
            SELECT
                c.id AS Id,
                c.user_id AS UserId,
                c.movie_id AS MovieId,
                c.content AS Content,
                c.created_at AS CreatedAt,
                c.updated_at AS UpdatedAt,
                c.parent_comment_id AS ParentCommentId,
                c.likes_count AS LikesCount,
                u.username AS Username
            FROM comments c
            JOIN users u ON c.user_id = u.id
            WHERE c.id = @Id;";
        using var connection = CreateConnection();
        return connection.QuerySingleOrDefault<Comment>(sql, new { Id = id });
    }

    public int Create(Comment comment)
    {
        const string sql = @"
            INSERT INTO comments (user_id, movie_id, content, created_at, updated_at, parent_comment_id, likes_count) 
            VALUES (@UserId, @MovieId, @Content, @CreatedAt, @UpdatedAt, @ParentCommentId, @LikesCount);
            SELECT LAST_INSERT_ID();";
        using var connection = CreateConnection();
        connection.Open();
        using var transaction = connection.BeginTransaction();
        try
        {
            var id = connection.ExecuteScalar<int>(sql, comment, transaction);
            transaction.Commit();
            return id;
        }
        catch
        {
            transaction.Rollback();
            throw;
        }
    }

    public int Update(Comment comment)
    {
        const string sql = @"
            UPDATE comments 
            SET content = @Content, 
                updated_at = @UpdatedAt, 
                parent_comment_id = @ParentCommentId, 
                likes_count = @LikesCount 
            WHERE id = @Id;";
        using var connection = CreateConnection();
        return connection.Execute(sql, comment);
    }

    public int Delete(int id)
    {
        const string sql = "DELETE FROM comments WHERE id = @Id;";
        using var connection = CreateConnection();
        return connection.Execute(sql, new { Id = id });
    }
}