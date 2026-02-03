using Microsoft.AspNetCore.Mvc;
using FaceAuthPOC.Models;
using System.Text.Json;

namespace FaceAuthPOC.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FaceAuthController : ControllerBase
    {
        private const double MATCH_THRESHOLD = 0.4; // Stricter threshold for better accuracy
        private readonly string _dataFilePath;

        public FaceAuthController(IWebHostEnvironment env)
        {
            _dataFilePath = Path.Combine(env.WebRootPath, "data", "users.json");
            Directory.CreateDirectory(Path.GetDirectoryName(_dataFilePath)!);
        }

        private List<FaceUser> LoadUsers()
        {
            try
            {
                if (!System.IO.File.Exists(_dataFilePath))
                    return new List<FaceUser>();
                
                var json = System.IO.File.ReadAllText(_dataFilePath);
                return JsonSerializer.Deserialize<List<FaceUser>>(json) ?? new List<FaceUser>();
            }
            catch
            {
                return new List<FaceUser>();
            }
        }

        private void SaveUsers(List<FaceUser> users)
        {
            try
            {
                var directory = Path.GetDirectoryName(_dataFilePath);
                if (!Directory.Exists(directory))
                    Directory.CreateDirectory(directory!);
                    
                var json = JsonSerializer.Serialize(users, new JsonSerializerOptions { WriteIndented = true });
                System.IO.File.WriteAllText(_dataFilePath, json);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error saving users: {ex.Message}");
            }
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] RegisterRequest request)
        {
            if (request.Descriptor == null || request.Descriptor.Length != 128)
            {
                return BadRequest(new { message = "Invalid face descriptor" });
            }

            var users = LoadUsers();
            users.Clear(); // Single user POC

            var user = new FaceUser
            {
                Username = request.Username,
                Descriptor = request.Descriptor
            };

            users.Add(user);
            SaveUsers(users);

            return Ok(new
            {
                success = true,
                message = "Face registered successfully!",
                username = user.Username
            });
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            if (request.Descriptor == null || request.Descriptor.Length != 128)
            {
                return BadRequest(new { message = "Invalid face descriptor" });
            }

            var users = LoadUsers();
            if (users.Count == 0)
            {
                return Unauthorized(new LoginResponse
                {
                    Success = false,
                    Message = "No registered users. Please register first."
                });
            }

            // Compare with registered user (single user for POC)
            var registeredUser = users[0];
            double distance = CalculateEuclideanDistance(request.Descriptor, registeredUser.Descriptor);

            if (distance < MATCH_THRESHOLD)
            {
                // Match found - cap confidence at 100%
                double confidence = Math.Min(100, Math.Round((1 - distance) * 100, 2));
                return Ok(new LoginResponse
                {
                    Success = true,
                    Message = "Login successful!",
                    Confidence = confidence,
                    Username = registeredUser.Username
                });
            }
            else
            {
                // No match
                return Unauthorized(new LoginResponse
                {
                    Success = false,
                    Message = "Face not recognized. Please try again.",
                    Confidence = Math.Round((1 - distance) * 100, 2)
                });
            }
        }

        [HttpGet("status")]
        public IActionResult GetStatus()
        {
            var users = LoadUsers();
            return Ok(new
            {
                registered = users.Count > 0,
                userCount = users.Count,
                username = users.Count > 0 ? users[0].Username : null
            });
        }

        // Calculate Euclidean distance between two face descriptors
        private double CalculateEuclideanDistance(float[] descriptor1, float[] descriptor2)
        {
            if (descriptor1.Length != descriptor2.Length)
            {
                throw new ArgumentException("Descriptors must have the same length");
            }

            double sum = 0;
            for (int i = 0; i < descriptor1.Length; i++)
            {
                double diff = descriptor1[i] - descriptor2[i];
                sum += diff * diff;
            }

            return Math.Sqrt(sum);
        }
    }
}
