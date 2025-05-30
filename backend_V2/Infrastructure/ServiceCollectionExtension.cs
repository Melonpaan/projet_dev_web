using Core.IGateways;
using Infrastructure.Gateways;
using Infrastructure.Repositories;
using Infrastructure.Repositories.Abstractions;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace Infrastructure;

public static class ServiceCollectionExtension
{
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services)
    {
        // HttpClient pour TMDBGateway
        services.AddHttpClient<ITMDBGateway, TMDBGateway>();

        // Repositories
        services.AddTransient<IUserRepository, UserRepository>();
        services.AddTransient<IMovieRepository, MovieRepository>();
        services.AddTransient<ICommentRepository, CommentRepository>();
        services.AddTransient<IUserListRepository, UserListRepository>();
        services.AddTransient<IGenreRepository, GenreRepository>();

        // Gateways
        services.AddTransient<IUserGateway, UserGateway>();
        services.AddTransient<IMovieGateway, MovieGateway>();
        services.AddTransient<ICommentGateway, CommentGateway>();
        services.AddTransient<IUserListGateway, UserListGateway>();
        services.AddTransient<IGenreGateway, GenreGateway>();

        return services;
    }
}