using System.Data;
using Core.Models;
using Dapper;
using Infrastructure.Repositories.Abstractions;
using Microsoft.Extensions.Configuration;
using MySql.Data.MySqlClient;

namespace Infrastructure.Repositories;

public class GenreRepository(IConfiguration configuration) : IGenreRepository
{
    private readonly string _connectionString = configuration.GetConnectionString("DefaultConnection")
        ?? throw new ArgumentNullException(nameof(configuration), "Database connection string 'DefaultConnection' not found.");

    private IDbConnection CreateConnection() => new MySqlConnection(_connectionString);

    public IEnumerable<Genre> GetAll()
    {
        const string sql = "SELECT * FROM genres;";
        using var connection = CreateConnection();
        return connection.Query<Genre>(sql);
    }

    public Genre? GetById(int id)
    {
        const string sql = "SELECT * FROM genres WHERE id = @Id;";
        using var connection = CreateConnection();
        return connection.QuerySingleOrDefault<Genre>(sql, new { Id = id });
    }

    public int Insert(Genre genre)
    {
        const string sql = "INSERT INTO genres (id, name) VALUES (@Id, @Name);";
        using var connection = CreateConnection();
        return connection.Execute(sql, genre);
    }

    public int Update(Genre genre)
    {
        const string sql = "UPDATE genres SET name = @Name WHERE id = @Id;";
        using var connection = CreateConnection();
        return connection.Execute(sql, genre);
    }

    public void AddGenre(Genre genre)
    {
        const string sql = @"
            INSERT IGNORE INTO genres (id, name)
            VALUES (@Id, @Name);";
        
        using var connection = CreateConnection();
        connection.Open();
        try
        {
            connection.Execute(sql, genre);
        }
        catch (Exception ex)
        {
            // Log l'erreur mais ne pas la propager
            Console.WriteLine($"Erreur lors de l'ajout du genre {genre.Id}: {ex.Message}");
        }
    }
}