using Microsoft.AspNetCore.Mvc;
using dotnetapp.Services;
using System;
using System.Threading.Tasks;

namespace dotnetapp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WeatherController : ControllerBase
    {
        private readonly WeatherService _weather;

        public WeatherController(WeatherService weather)
        {
            _weather = weather;
        }

        /// <summary>MonsoonGuard alerts. Query: userId, lat, lon, location (optional name)</summary>
        [HttpGet("alerts")]
        public async Task<IActionResult> GetAlerts([FromQuery] int userId, [FromQuery] double lat,
                                                  [FromQuery] double lon, [FromQuery] string location = "")
        {
            try
            {
                var res = await _weather.GetAlertsAsync(userId, lat, lon, location ?? "");
                return Ok(res);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
    }
}
