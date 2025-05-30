using Api.EndPoints;
using Api.Middleware;
using Core;
using Infrastructure;
using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);

// Enregistrement des services
builder.Services.AddCoreServices();
builder.Services.AddInfrastructureServices();

#region Cors
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalhost",
        policy =>
        {
            policy.SetIsOriginAllowed(origin => new Uri(origin).Host == "localhost")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});
#endregion

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseCors("AllowLocalhost");
}

app.UseHttpsRedirection();

app.UseMiddleware<GlobalExceptionHandlerMiddleware>();

#region Endpoints
app.AddUserRoutes();
app.AddMovieRoutes();
app.AddCommentRoutes();
app.AddUserListRoutes();
app.AddGenreRoutes();
#endregion

app.Run();