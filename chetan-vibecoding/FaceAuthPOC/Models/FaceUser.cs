namespace FaceAuthPOC.Models
{
    public class FaceUser
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string Username { get; set; } = "User";
        public float[] Descriptor { get; set; } = Array.Empty<float>();
        public DateTime RegisteredAt { get; set; } = DateTime.UtcNow;
    }

    // Request models for API
    public class RegisterRequest
    {
        public string Username { get; set; } = "User";
        public float[] Descriptor { get; set; } = Array.Empty<float>();
    }

    public class LoginRequest
    {
        public float[] Descriptor { get; set; } = Array.Empty<float>();
    }

    public class LoginResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public double? Confidence { get; set; }
        public string? Username { get; set; }
    }
}
