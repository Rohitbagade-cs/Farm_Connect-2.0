using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using dotnetapp.Data;
using dotnetapp.Models;
using Microsoft.EntityFrameworkCore;

namespace dotnetapp.Services
{
    /// <summary>
    /// Talks to any OpenAI-compatible chat-completions API (OpenAI, Gemini, etc.).
    /// Credentials come ONLY from environment variables - never hardcode keys.
    ///   LLM_API_KEY   - your API key (required)
    ///   LLM_BASE_URL  - base URL of the API (default: Gemini OpenAI-compatible endpoint)
    ///   LLM_MODEL     - model name (default: gemini-2.5-flash)
    /// </summary>
    public class AiService
    {
        private readonly HttpClient _http;
        private readonly ApplicationDbContext _context;
        private readonly string _apiKey;
        private readonly string _baseUrl;
        private readonly string _model;

        public AiService(HttpClient http, ApplicationDbContext context)
        {
            _http = http;
            _context = context;
            _apiKey = Environment.GetEnvironmentVariable("LLM_API_KEY") ?? "";
            _baseUrl = Environment.GetEnvironmentVariable("LLM_BASE_URL")
                       ?? "https://generativelanguage.googleapis.com/v1beta/openai/";
            _model = Environment.GetEnvironmentVariable("LLM_MODEL") ?? "gemini-2.5-flash";
        }

        public bool IsConfigured => !string.IsNullOrWhiteSpace(_apiKey);

        // ---------------- Core LLM call ----------------

        // Sends one chat-completions request. Returns the reply text and the
        // API's finish reason ("stop", "length", ...).
        private async Task<(string Text, string FinishReason)> SendChatAsync(
            IEnumerable<object> messages, int maxTokens)
        {
            var payload = new
            {
                model = _model,
                messages = messages,
                temperature = 0.7,
                max_tokens = maxTokens
            };

            using var req = new HttpRequestMessage(
                HttpMethod.Post, _baseUrl.TrimEnd('/') + "/chat/completions");
            req.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _apiKey);
            req.Content = new StringContent(
                JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");

            var resp = await _http.SendAsync(req);
            var body = await resp.Content.ReadAsStringAsync();

            if (!resp.IsSuccessStatusCode)
                throw new HttpRequestException(((int)resp.StatusCode).ToString());

            using var doc = JsonDocument.Parse(body);
            var choice = doc.RootElement.GetProperty("choices")[0];
            var text = choice.GetProperty("message").GetProperty("content").GetString()?.Trim() ?? "";
            var finishReason = choice.TryGetProperty("finish_reason", out var fr)
                ? (fr.GetString() ?? "") : "";

            return (text, finishReason);
        }

        // True when the text ends without sentence-ending punctuation,
        // which usually means the model stopped mid-sentence.
        private static bool EndsMidSentence(string text)
        {
            if (string.IsNullOrWhiteSpace(text)) return false;
            char last = text.TrimEnd().Last();
            return last != '.' && last != '!' && last != '?';
        }

        private async Task<string> CompleteAsync(IEnumerable<object> messageList, int maxTokens = 1200)
        {
            if (!IsConfigured)
                return "AI is not configured on the server yet. Please set the LLM_API_KEY " +
                       "environment variable (in the .env file) and restart the backend.";

            try
            {
                var messages = messageList.ToList();
                var (text, finishReason) = await SendChatAsync(messages, maxTokens);

                // Safety net: if the answer was cut off (hit the token limit or
                // stopped mid-sentence), ask the model to continue once and stitch
                // the parts together. Single attempt keeps quota usage low.
                int attempts = 0;
                while (attempts < 1 && !string.IsNullOrWhiteSpace(text) &&
                       (finishReason == "length" || EndsMidSentence(text)))
                {
                    attempts++;
                    var continued = new List<object>(messages)
                    {
                        new { role = "assistant", content = text },
                        new { role = "user", content = "Continue from the exact point where the previous text stopped. Output ONLY the missing remainder - do not repeat any section headers or sentences already written." }
                    };
                    var (more, reason) = await SendChatAsync(continued, maxTokens);
                    if (string.IsNullOrWhiteSpace(more)) break;
                    text = (text + " " + more.Trim()).Trim();
                    finishReason = reason;
                    messages = continued;
                }

                return string.IsNullOrWhiteSpace(text)
                    ? "The AI returned an empty response. Please try again."
                    : text;
            }
            catch (HttpRequestException ex) when (ex.Message == "503" || ex.Message == "502" || ex.Message == "504")
            {
                return "The AI service is temporarily unavailable (error " + ex.Message + "). " +
                       "This is on Google's side - please wait a few minutes and try again.";
            }
            catch (HttpRequestException ex) when (ex.Message == "429")
            {
                return "Too many requests to the AI service right now (rate limit). " +
                       "Please wait a minute and try again.";
            }
            catch (HttpRequestException ex) when (ex.Message == "401")
            {
                return "The AI service rejected the API key (401). " +
                       "Please check LLM_API_KEY in the .env file and restart the backend.";
            }
            catch (HttpRequestException ex) when (ex.Message == "404")
            {
                return "The AI model was not found (404). " +
                       "Please check LLM_MODEL in the .env file (use gemini-2.5-flash) and restart the backend.";
            }
            catch (HttpRequestException ex)
            {
                return $"The AI service returned an error ({ex.Message}). " +
                       "Please check the API key / model name and try again.";
            }
            catch (Exception)
            {
                return "Could not reach the AI service. Please check your internet " +
                       "connection and try again.";
            }
        }

        // ---------------- 1. Farm assistant chat ----------------

        public Task<string> ChatAsync(List<ChatMessage> history)
        {
            var messages = new List<object>
            {
                new
                {
                    role = "system",
                    content = "You are FarmConnect's friendly AI farm assistant. You help farm owners " +
                              "with practical questions about livestock care, feeding, health, breeding and " +
                              "farm management. Keep answers concise, practical and easy to follow. " +
                              "Use plain text only - no markdown formatting (no **, ##, or similar). " +
                              "Use short paragraphs or simple dash lists. " +
                              "If a question is about a serious animal illness, advise consulting a veterinarian."
                }
            };
            foreach (var m in history.TakeLast(12))
                messages.Add(new { role = m.Role, content = m.Content });

            return CompleteAsync(messages);
        }

        // ---------------- 1b. Boli AI voice chat (spoken, same-language replies) ----------------

        public Task<string> VoiceChatAsync(string text, string language)
        {
            string langName = language?.ToLower() switch
            {
                "marathi" => "Marathi",
                "hinglish" => "Hinglish",
                _ => "Hindi"
            };
            string scriptRule = language?.ToLower() switch
            {
                "marathi" => "Reply in Marathi written in Devanagari script.",
                "hinglish" => "Reply in Hinglish: Hindi written in Roman (English) script, mixed with simple English words, exactly how people speak it.",
                _ => "Reply in Hindi written in Devanagari script."
            };

            var messages = new List<object>
            {
                new
                {
                    role = "system",
                    content = $"You are Boli AI, FarmConnect's voice-first farm assistant. A farmer is TALKING to you " +
                              $"in {langName}, and your answer will be READ ALOUD to them, so write for the ear, not the eye. " +
                              scriptRule + " " +
                              "Keep it SHORT: 2 to 4 sentences, spoken style, like talking to a friend. " +
                              "Plain text only - no markdown, no bullet or numbered lists, no special characters or emojis. " +
                              "Give practical advice about livestock care, feeding, health, breeding and farm management. " +
                              "If it sounds like a serious animal illness, say they should consult a veterinarian (pashu chikitsak)."
                },
                new { role = "user", content = text }
            };

            // Short answers for speech: smaller token budget, no continuation needed.
            return CompleteAsync(messages, 500);
        }

        // ---------------- 2. Symptom checker (grounded in medicine catalog) ----------------

        public async Task<string> CheckSymptomsAsync(string species, string symptoms)
        {
            var meds = await _context.Medicines.Take(50).ToListAsync();
            var catalog = meds.Any()
                ? string.Join("\n", meds.Select(m =>
                    $"- {m.MedicineName} ({m.Brand}, {m.Category}): {m.Description} | Price: {m.PricePerUnit}/{m.Unit}"))
                : "(The medicine catalog is currently empty.)";

            var messages = new List<object>
            {
                new
                {
                    role = "system",
                    content = "You are a veterinary triage assistant for the FarmConnect app. " +
                              "Given an animal's species and symptoms, list the most likely conditions, " +
                              "suggest immediate care steps, and recommend matching medicines ONLY from the " +
                              "catalog provided (never invent products). End with a clear note that this is " +
                              "not a diagnosis and the owner should consult a veterinarian for serious cases. " +
                              "Rules: use plain text only, no markdown formatting (no **, ##). " +
                              "Structure the answer with these sections: POSSIBLE CONDITIONS, IMMEDIATE CARE, " +
                              "RECOMMENDED MEDICINES, NOTE. " +
                              "If the catalog is empty, say so and give general care guidance instead. " +
                              "Always finish the answer completely - never stop mid-sentence."
                },
                new
                {
                    role = "user",
                    content = $"Species: {species}\nSymptoms: {symptoms}\n\nAvailable medicine catalog:\n{catalog}"
                }
            };
            return await CompleteAsync(messages);
        }

        // ---------------- 3. Feed recommender (grounded in feed catalog) ----------------

        public async Task<string> RecommendFeedAsync(string species, int age, string breed, string goal)
        {
            var feeds = await _context.Feeds.Take(50).ToListAsync();
            var catalog = feeds.Any()
                ? string.Join("\n", feeds.Select(f =>
                    $"- {f.FeedName} ({f.Type}): {f.Description} | Price: {f.PricePerUnit}/{f.Unit}"))
                : "(The feed catalog is currently empty.)";

            var messages = new List<object>
            {
                new
                {
                    role = "system",
                    content = "You are a livestock nutrition advisor for the FarmConnect app. " +
                              "Given the animal's species, age, breed and the owner's goal, write a COMPLETE feeding plan. " +
                              "Rules: use plain text only, no markdown formatting (no **, ##). " +
                              "Structure the answer with these sections: GOAL, DAILY RATION, " +
                              "FEEDING SCHEDULE, RECOMMENDED PRODUCTS, NOTES. " +
                              "Under RECOMMENDED PRODUCTS, pick only from the catalog provided below " +
                              "(never invent products). If the catalog is empty, say so clearly and give " +
                              "general feeding guidance instead. " +
                              "Include rough daily quantities in kg where sensible. " +
                              "Always finish the answer completely - never stop mid-sentence."
                },
                new
                {
                    role = "user",
                    content = $"Species: {species}\nAge: {age} years\nBreed: {breed}\nGoal: {goal}\n\nAvailable feed catalog:\n{catalog}"
                }
            };
            return await CompleteAsync(messages);
        }

        // ---------------- 4. Product description generator (for suppliers) ----------------

        public Task<string> GenerateDescriptionAsync(string productName, string category, string keyPoints)
        {
            var messages = new List<object>
            {
                new
                {
                    role = "system",
                    content = "You write short, appealing product descriptions for an online farm-supply " +
                              "marketplace. Write 3-5 sentences plus 3 key benefits as simple dash lists. " +
                              "Tone: professional and trustworthy. Do not make medical guarantees. " +
                              "Use plain text only - no markdown formatting (no **, ##)."
                },
                new
                {
                    role = "user",
                    content = $"Product name: {productName}\nCategory: {category}\nKey points: {keyPoints}\n\nWrite the product description."
                }
            };
            return CompleteAsync(messages, maxTokens: 800);
        }
    }
}
