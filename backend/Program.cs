using EmotionChat.API.Data;
using EmotionChat.API.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configuration de la base de données
builder.Services.AddDbContext<ChatDbContext>(options =>
{
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    if (string.IsNullOrEmpty(connectionString) || connectionString.Contains("emotionchat.db"))
    {
        // Utiliser SQLite par défaut
        options.UseSqlite("Data Source=emotionchat.db");
    }
    else
    {
        // Utiliser la chaîne de connexion configurée (PostgreSQL pour Render)
        options.UseNpgsql(connectionString);
    }
});

// Configuration des services - Utiliser le service simple qui fonctionne
builder.Services.AddScoped<IAnalysisService, SimpleAnalysisService>();

// Configuration CORS pour permettre les requêtes depuis le frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
                "http://localhost:3000", // React dev server (port par défaut)
                "http://localhost:3002", // React dev server (port alternatif)
                "http://192.168.1.105:3002", // Votre adresse IP locale
                "http://192.168.1.105:3000", // Votre adresse IP locale (port alternatif)
                "https://your-app.vercel.app", // Vercel deployment
                "http://localhost:19006" // React Native web
            )
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// Configuration du logging
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Utiliser CORS
app.UseCors("AllowFrontend");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

// Créer la base de données si elle n'existe pas
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ChatDbContext>();
    context.Database.EnsureCreated();
}

app.Run();
