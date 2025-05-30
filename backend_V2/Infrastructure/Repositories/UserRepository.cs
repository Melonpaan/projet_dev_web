using System.Data;
using Dapper;
using Core.Models;
using Infrastructure.Repositories.Abstractions;
using Microsoft.Extensions.Configuration;
using MySql.Data.MySqlClient;

namespace Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    private readonly string _connectionString;

    public UserRepository(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? throw new ArgumentNullException(nameof(configuration), "Database connection string 'DefaultConnection' not found.");
    }

    private IDbConnection CreateConnection() => new MySqlConnection(_connectionString);

    public User? GetById(int id)
    {
        const string sql = @"
            SELECT 
                id, 
                username, 
                email, 
                password_hash AS PasswordHash, 
                first_name AS FirstName, 
                last_name AS LastName, 
                date_of_birth AS DateOfBirth
            FROM users
            WHERE id = @Id;";
        using var connection = CreateConnection();
        return connection.QuerySingleOrDefault<User>(sql, new { Id = id });
    }

    public User? GetByUsername(string username)
    {
        const string sql = @"
            SELECT 
                id, 
                username, 
                email, 
                password_hash AS PasswordHash, 
                first_name AS FirstName, 
                last_name AS LastName, 
                date_of_birth AS DateOfBirth
            FROM users
            WHERE username = @Username;";
        using var connection = CreateConnection();
        return connection.QuerySingleOrDefault<User>(sql, new { Username = username });
    }

    public int Create(User user)
    {
        const string sql = @"
            INSERT INTO users (username, email, password_hash, first_name, last_name, date_of_birth)
            VALUES (@Username, @Email, @PasswordHash, @FirstName, @LastName, @DateOfBirth);";
                using var connection = CreateConnection();
        return connection.ExecuteScalar<int>(sql, new
        {
            Username = user.Username,
            Email = user.Email,
            PasswordHash = user.PasswordHash,
            FirstName = user.FirstName,
            LastName = user.LastName,
            DateOfBirth = user.DateOfBirth
        });
    }

    public int Update(User user)
    {
        const string sql = @"
            UPDATE users 
            SET email = @Email,
                first_name = @FirstName,
                last_name = @LastName,
                date_of_birth = @DateOfBirth
            WHERE id = @Id;";
        using var connection = CreateConnection();
        return connection.Execute(sql, user);
    }

    public string? GetPasswordHash(string username)
    {
        const string sql = "SELECT password_hash FROM users WHERE username = @Username;";
        using var connection = CreateConnection();
        return connection.QuerySingleOrDefault<string>(sql, new { Username = username });
    }

    public IEnumerable<User> GetAll()
    {
        const string sql = @"
            SELECT 
                id, 
                username, 
                email, 
                password_hash AS PasswordHash, 
                first_name AS FirstName, 
                last_name AS LastName, 
                date_of_birth AS DateOfBirth
            FROM users;";
        using var connection = CreateConnection();
        return connection.Query<User>(sql);
    }
}