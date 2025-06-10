using System.Data;
using Dapper;
using Core.Models;
using Infrastructure.Repositories.Abstractions;
using Microsoft.Extensions.Configuration;
using MySql.Data.MySqlClient;

namespace Infrastructure.Repositories;

public class UserListRepository(IConfiguration configuration) : IUserListRepository
{
    private readonly string _connectionString = configuration.GetConnectionString("DefaultConnection")
        ?? throw new ArgumentNullException(nameof(configuration), "Database connection string 'DefaultConnection' not found.");

    private IDbConnection CreateConnection() => new MySqlConnection(_connectionString);

    public IEnumerable<UserList> GetByUserId(int userId)
    {
        const string sql = @"
            SELECT 
                ul.id AS Id,
                ul.user_id AS UserId,          
                ul.movie_id AS MovieId,        
                ul.status AS Status,
                m.id AS Id,
                m.title AS Title,
                m.adult AS Adult,
                m.backdrop_path AS BackdropPath,
                m.original_language AS OriginalLanguage,
                m.original_title AS OriginalTitle,
                m.overview AS Overview,
                m.popularity AS Popularity,
                m.poster_path AS PosterPath,
                m.release_date AS ReleaseDate,
                m.vote_average_top_rated AS VoteAverageTopRated,
                m.vote_count AS VoteCount,
                m.revenue AS Revenue,
                m.runtime AS Runtime,
                m.tagline AS Tagline,
                m.youtube_url AS YoutubeUrl
            FROM user_list ul
            JOIN movies m ON ul.movie_id = m.id
            WHERE ul.user_id = @UserId;";
        using var connection = CreateConnection();
        return connection.Query<UserList, Movie, UserList>(
            sql,
            (userList, movie) =>
            {
                userList.Movie = movie;
                return userList;
            },
            new { UserId = userId },
            splitOn: "id"
        );
    }

    public UserList? GetById(int id)
    {
        const string sql = @"
            SELECT 
                ul.id AS Id,
                ul.user_id AS UserId,          
                ul.movie_id AS MovieId,        
                ul.status AS Status,
                m.id AS Id,
                m.title AS Title,
                m.adult AS Adult,
                m.backdrop_path AS BackdropPath,
                m.original_language AS OriginalLanguage,
                m.original_title AS OriginalTitle,
                m.overview AS Overview,
                m.popularity AS Popularity,
                m.poster_path AS PosterPath,
                m.release_date AS ReleaseDate,
                m.vote_average_top_rated AS VoteAverageTopRated,
                m.vote_count AS VoteCount,
                m.revenue AS Revenue,
                m.runtime AS Runtime,
                m.tagline AS Tagline,
                m.youtube_url AS YoutubeUrl
            FROM user_list ul
            JOIN movies m ON ul.movie_id = m.id
            WHERE ul.id = @Id;";
        using var connection = CreateConnection();
        return connection.Query<UserList, Movie, UserList>(
            sql,
            (userList, movie) =>
            {
                userList.Movie = movie;
                return userList;
            },
            new { Id = id },
            splitOn: "id"
        ).FirstOrDefault();
    }

    public int Create(UserList userList)
    {
        const string sql = @"
            INSERT INTO user_list (user_id, movie_id, status) 
            VALUES (@UserId, @MovieId, @Status);
            SELECT LAST_INSERT_ID();";
        using var connection = CreateConnection();
        return connection.ExecuteScalar<int>(sql, userList);
    }

    public int Update(UserList userList)
    {
        const string sql = @"
            UPDATE user_list 
            SET status = @Status 
            WHERE id = @Id;";
        using var connection = CreateConnection();
        return connection.Execute(sql, userList);
    }

    public int Delete(int id)
    {
        const string sql = "DELETE FROM user_list WHERE id = @Id;";
        using var connection = CreateConnection();
        return connection.Execute(sql, new { Id = id });
    }
}