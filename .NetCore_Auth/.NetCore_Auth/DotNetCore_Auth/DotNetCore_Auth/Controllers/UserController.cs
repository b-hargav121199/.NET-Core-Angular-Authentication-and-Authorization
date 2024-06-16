using DotNetCore_Auth.Context;
using DotNetCore_Auth.Helpers;
using DotNetCore_Auth.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Reflection.Metadata.Ecma335;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;

namespace DotNetCore_Auth.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _authContext;
        public UserController(AppDbContext appDbContext)
        {
            this._authContext = appDbContext;

        }
        [HttpPost("authenticate")]
        public async Task<IActionResult> Authenticate([FromBody] User UserObj)
        {
            if (User == null)
                return BadRequest();
            var user = await _authContext.Users.FirstOrDefaultAsync(b => b.UserName == UserObj.UserName);
            if (user == null)
                return NotFound(new { Message = "User Not Found" });
            if (!PasswordHasher.VerifyPassword(UserObj.Password, user.Password))
                return BadRequest(new { Message = "Incorrect Password !!" });

            user.Token = CreateJWTToken(user);
            return Ok(new {Token=user.Token,     Message = "Login Success" });

        }
        [HttpPost("register")]
        public async Task<IActionResult> RegisterUser([FromBody] User UserObj)
        {
            if (UserObj == null)
                return BadRequest();

            //Check UserName
            if (await CheckUserNameExistAsync(UserObj.UserName))
                return BadRequest(new { Message = "UserName Already Exist!!" });

            //Check Email
            if (await CheckUserEmailExistAsync(UserObj.Email))
                return BadRequest(new { Message = "Email Already Exist!!" });

            //Check Password strength    

            var pass = await CheckPasswordStrenght(UserObj.Password);
            if (!string.IsNullOrEmpty(pass))
                return BadRequest(new { Message = $"{pass}" });

            UserObj.Password = PasswordHasher.HashPassword(UserObj.Password);
            UserObj.Role = "Admin";
            UserObj.Token = "";
            await _authContext.Users.AddAsync(UserObj);
            await _authContext.SaveChangesAsync();

            return Ok(new { Message = "User Registered!" });
        }
        private async Task<bool> CheckUserNameExistAsync(string UserName) =>
            await _authContext.Users.AnyAsync(b => b.UserName == UserName);

        private async Task<bool> CheckUserEmailExistAsync(string Email) =>
            await _authContext.Users.AnyAsync(b => b.Email == Email);
        private async Task<string> CheckPasswordStrenght(string Password)
        {
            StringBuilder stringBuilder = new StringBuilder();
            if (Password.Length < 8)
                stringBuilder.Append("Minimum Password length should be 8" + Environment.NewLine);
            if ((!(Regex.IsMatch(Password, "[a-z]")) && Regex.IsMatch(Password, "[A-Z]") && Regex.IsMatch(Password, "[0-9]")))
                stringBuilder.Append("Password should be alphanumeric" + Environment.NewLine);
            if (!(Regex.IsMatch(Password, "[<,>,@,#,$,%,^,&,*,(,)]")))
                stringBuilder.Append("Password should contain special character" + Environment.NewLine);

            return stringBuilder.ToString();


        }

        private  string CreateJWTToken(User user)
        {
            var key = Encoding.ASCII.GetBytes("This is the Bhargav Secrete Key.............");
            var Identity= new ClaimsIdentity(new Claim[] {
            new Claim(ClaimTypes.Role,user.Role),
            new Claim(ClaimTypes.Name,$"{user.FirstName} { user.LastName}")
            });
            var Credential = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256);
            var TokenDiscriptor = new SecurityTokenDescriptor()
            {
                SigningCredentials = Credential,
                Subject = Identity,
                Expires = DateTime.Now.AddDays(1)
            };
            var JWTTokenHandler = new JwtSecurityTokenHandler();
            var Token = JWTTokenHandler.CreateToken(TokenDiscriptor);
            return JWTTokenHandler.WriteToken(Token);
        }
        [Authorize ]
        [HttpGet]
        public async Task<ActionResult<User>> GetAllUsers()
        {
            return Ok(await _authContext.Users.ToListAsync());
        }
    }
}
