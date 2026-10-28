using Microsoft.AspNetCore.Mvc;
using dotnetapp.Models;
using dotnetapp.Services;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.AspNetCore.Authorization;

namespace dotnetapp.Controllers

{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class FeedController : ControllerBase
    {
        private readonly FeedService _feedService;
        public FeedController(FeedService feedService)
        {
            _feedService = feedService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Feed>>> GetAllFeeds()
        {
            try
            {
                var feeds = await _feedService.GetAllFeeds();
                return Ok(feeds);
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("{feedId}")]
        public async Task<ActionResult<Feed>> GetFeedById(int feedId)
        {
            try
            {
                var feed = await _feedService.GetFeedById(feedId);
                if (feed == null)
                    return NotFound("Cannot find any feed");
                return Ok(feed);
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<Feed>>> GetFeedsByUserId(int userId)
        {
            try
            {
                var feeds = await _feedService.GetFeedsByUserId(userId);
                if (feeds == null || !feeds.Any())
                    return NotFound("Cannot find any feeds for this user");
                return Ok(feeds);
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost]
        public async Task<ActionResult> AddFeed([FromBody] Feed feed)
        {
            try
            {
                bool result = await _feedService.AddFeed(feed);
                if (result)
                    return Ok("Feed added successfully");
                return StatusCode(500, "Failed to add feed");
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, ex.Message);
            }

        }

        [HttpPut("{feedId}")]
        public async Task<ActionResult> UpdateFeed(int feedId, [FromBody] Feed feed)
        {
            try
            {
                bool result = await _feedService.UpdateFeed(feedId, feed);
                if (!result)
                    return NotFound("Cannot find any feed");
                return Ok("Feed updated successfully");
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpDelete("{feedId}")]
        public async Task<ActionResult> DeleteFeed(int feedId)
        {
            try
            {
                bool result = await _feedService.DeleteFeed(feedId);
                if (!result)
                    return NotFound("Cannot find any feed");
                return Ok("Feed deleted successfully");
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("{feedId}/request-count")]
        public async Task<ActionResult> GetFeedRequestCount(int feedId)
        {
            try
            {
                var count = await _feedService.GetRequestCountAsync(feedId);
                return Ok(new { feedId, requestCount = count });
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}