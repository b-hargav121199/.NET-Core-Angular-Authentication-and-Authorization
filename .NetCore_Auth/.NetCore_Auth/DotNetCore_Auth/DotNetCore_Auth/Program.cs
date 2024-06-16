using DotNetCore_Auth.Context;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<AppDbContext>(option => option.UseSqlServer(builder.Configuration.GetConnectionString("AuthDb")));
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;

}).AddJwtBearer(option => { 
option.RequireHttpsMetadata = false;
option.SaveToken=true;
    option.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey= new SymmetricSecurityKey(Encoding.UTF8.GetBytes("This is the Bhargav Secrete Key.............")),
        ValidateIssuer = false,
        ValidateAudience=false,
        ClockSkew =TimeSpan.Zero
    };      
});

builder.Services.AddCors(option =>
    option.AddPolicy("AngualrPolicy", builder =>
    builder.AllowAnyMethod().AllowAnyHeader().AllowAnyOrigin()
    )); 
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AngualrPolicy");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
