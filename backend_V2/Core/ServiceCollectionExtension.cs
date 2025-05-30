using Core.UseCases.Abstractions;
using Core.UseCases;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;

namespace Core;

public static class ServiceCollectionExtension
{
    public static IServiceCollection AddCoreServices(this IServiceCollection services)
    {
        services.AddTransient<IUserUseCases, UserUseCases>();
        services.AddTransient<IMovieUseCases, MovieUseCases>();
        services.AddTransient<ICommentUseCases, CommentUseCases>();
        services.AddTransient<IGenreUseCases, GenreUseCases>();
        services.AddTransient<IUserListUseCases, UserListUseCases>();

        return services;
    }
}