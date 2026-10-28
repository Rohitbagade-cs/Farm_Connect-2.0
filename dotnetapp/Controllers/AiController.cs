using Microsoft.AspNetCore.Mvc;
using dotnetapp.Models;
using dotnetapp.Services;

namespace dotnetapp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AiController : ControllerBase
    {
        private readonly AiService _aiService;

        public AiController(AiService aiService)
        {
            _aiService = aiService;
        }

        /// <summary>Conversational farm assistant. Body: { messages: [{ role, content }] }</summary>
        [HttpPost("chat")]
        public async Task<IActionResult> Chat([FromBody] ChatRequest request)
        {
            try
            {
                var reply = await _aiService.ChatAsync(request.Messages ?? new List<ChatMessage>());
                return Ok(new { reply });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        /// <summary>Boli AI voice chat. Body: { text, language: "hindi" | "marathi" | "hinglish" }</summary>
        [HttpPost("voice-chat")]
        public async Task<IActionResult> VoiceChat([FromBody] VoiceChatRequest request)
        {
            try
            {
                var reply = await _aiService.VoiceChatAsync(request.Text ?? "", request.Language ?? "hindi");
                return Ok(new { reply });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        /// <summary>Symptom checker. Body: { species, symptoms }</summary>
        [HttpPost("symptom-check")]
        public async Task<IActionResult> SymptomCheck([FromBody] SymptomCheckRequest request)
        {
            try
            {
                var result = await _aiService.CheckSymptomsAsync(request.Species, request.Symptoms);
                return Ok(new { result });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        /// <summary>Feed recommender. Body: { species, age, breed, goal }</summary>
        [HttpPost("feed-recommend")]
        public async Task<IActionResult> FeedRecommend([FromBody] FeedRecommendRequest request)
        {
            try
            {
                var result = await _aiService.RecommendFeedAsync(
                    request.Species, request.Age, request.Breed, request.Goal);
                return Ok(new { result });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        /// <summary>Product description generator. Body: { productName, category, keyPoints }</summary>
        [HttpPost("generate-description")]
        public async Task<IActionResult> GenerateDescription([FromBody] DescriptionRequest request)
        {
            try
            {
                var description = await _aiService.GenerateDescriptionAsync(
                    request.ProductName, request.Category, request.KeyPoints);
                return Ok(new { description });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
    }
}
