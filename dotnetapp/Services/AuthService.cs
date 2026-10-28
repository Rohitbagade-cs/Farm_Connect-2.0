using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using dotnetapp.Data;
using dotnetapp.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;

namespace dotnetapp.Services
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<ApplicationUser> userManager;
        private readonly RoleManager<IdentityRole> roleManager;
        private readonly IConfiguration _configuration;
        private readonly ApplicationDbContext _context;

        public AuthService(
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager,
            IConfiguration configuration,
            ApplicationDbContext context)
        {
            this.userManager = userManager;
            this.roleManager = roleManager;
            _configuration = configuration;
            _context = context;
        }

        // Registration
        public async Task<(int, string)> Registration(User model, string role)
        {
            var existingUser = await userManager.FindByEmailAsync(model.Email);
            if (existingUser != null)
            {
                return (0, "User already exists");
            }

            var applicationUser = new ApplicationUser
            {
                UserName = model.Email,
                Email = model.Email,
                Name = model.Username
            };

            var result = await userManager.CreateAsync(applicationUser, model.Password);
            if (!result.Succeeded)
            {
                return (0, "User creation failed! Please check user details and try again");
            }

            if (!await roleManager.RoleExistsAsync(role))
            {
                await roleManager.CreateAsync(new IdentityRole(role));
            }

            await userManager.AddToRoleAsync(applicationUser, role);

            _context.Users.Add(model);
            await _context.SaveChangesAsync();

            return (1, "User created successfully!");
        }

        // Login
        public async Task<(int, string, string)> Login(LoginModel model)
        {
            var user = await userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                return (0, "Invalid email","");
            }

            if (!await userManager.CheckPasswordAsync(user, model.Password))
            {
                return (0, "Invalid password","");
            }

            var roles = await userManager.GetRolesAsync(user);

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            var token = GenerateToken(claims);
            var dbUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == model.Email);
            return (1, token, dbUser.UserId.ToString());
        }

        // Generate JWT Token
        private string GenerateToken(IEnumerable<Claim> claims)
        {
            var key = new SymmetricSecurityKey(
    Encoding.UTF8.GetBytes("THIS_IS_A_VERY_STRONG_SECRET_KEY_12345")
);

            var token = new JwtSecurityToken(
                issuer: _configuration["JWT:ValidIssuer"],
                audience: _configuration["JWT:ValidAudience"],
                expires: DateTime.Now.AddHours(3),
                claims: claims,
                signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}