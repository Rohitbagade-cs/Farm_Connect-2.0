namespace dotnetapp.Models
{
    public class ChatMessage
    {
        public string Role { get; set; } = "user";   // "user" or "assistant"
        public string Content { get; set; } = "";
    }

    public class ChatRequest
    {
        public List<ChatMessage> Messages { get; set; } = new();
    }

    public class SymptomCheckRequest
    {
        public string Species { get; set; } = "";
        public string Symptoms { get; set; } = "";
    }

    public class FeedRecommendRequest
    {
        public string Species { get; set; } = "";
        public int Age { get; set; }
        public string Breed { get; set; } = "";
        public string Goal { get; set; } = "";   // e.g. "milk production", "weight gain"
    }

    public class DescriptionRequest
    {
        public string ProductName { get; set; } = "";
        public string Category { get; set; } = "";   // "Feed" or "Medicine"
        public string KeyPoints { get; set; } = "";
    }

    public class VoiceChatRequest
    {
        public string Text { get; set; } = "";        // transcribed speech
        public string Language { get; set; } = "hindi"; // "hindi" | "marathi" | "hinglish"
    }
}
