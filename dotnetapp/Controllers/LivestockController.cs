using Microsoft.AspNetCore.Mvc;
using dotnetapp.Models;
using dotnetapp.Services;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace dotnetapp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LivestockController : ControllerBase

    {

        private readonly LivestockService _livestockService;

        public LivestockController(LivestockService livestockService)

        {

            _livestockService = livestockService;

        }

        [HttpGet]

        public async Task<ActionResult<IEnumerable<Livestock>>> GetAllLivestocks()

        {

            try

            {

                var livestocks = await _livestockService.GetAllLivestocks();

                return Ok(livestocks);

            }

            catch (System.Exception ex)

            {

                return StatusCode(500, ex.Message);

            }

        }

        [HttpGet("{livestockId}")]

        public async Task<ActionResult<Livestock>> GetLivestockById(int livestockId)

        {

            try

            {

                var livestock = await _livestockService.GetLivestockById(livestockId);

                if (livestock == null)

                    return NotFound("Cannot find any livestock");

                return Ok(livestock);

            }

            catch (System.Exception ex)

            {

                return StatusCode(500, ex.Message);

            }

        }

        [HttpGet("user/{userId}")]

        public async Task<ActionResult<IEnumerable<Livestock>>> GetLivestocksByUserId(int userId)

        {

            try

            {

                var livestocks = await _livestockService.GetLivestocksByUserId(userId);

                if (livestocks == null || !livestocks.Any())

                    return NotFound("No livestock found for this user");

                return Ok(livestocks);

            }

            catch (System.Exception ex)

            {

                return StatusCode(500, ex.Message);

            }

        }

        [HttpPost]

        public async Task<ActionResult> AddLivestock([FromBody] Livestock livestock)

        {

            try

            {

                bool result = await _livestockService.AddLivestock(livestock);

                if (result)

                    return Ok("Livestock added successfully");

                return StatusCode(500, "Failed to add livestock");

            }

            catch (System.Exception ex)

            {

                return StatusCode(500, ex.Message);

            }

        }

        [HttpPut("{livestockId}")]

        public async Task<ActionResult> UpdateLivestock(int livestockId, [FromBody] Livestock livestock)

        {

            try

            {

                bool result = await _livestockService.UpdateLivestock(livestockId, livestock);

                if (!result)

                    return NotFound("Cannot find any livestock");

                return Ok("Livestock updated successfully");

            }

            catch (System.Exception ex)

            {

                return StatusCode(500, ex.Message);

            }

        }

        [HttpDelete("{livestockId}")]

        public async Task<ActionResult> DeleteLivestock(int livestockId)

        {

            try

            {

                bool result = await _livestockService.DeleteLivestock(livestockId);

                if (!result)

                    return NotFound("Cannot find any livestock");

                return Ok("Livestock deleted successfully");

            }

            catch (System.Exception ex)

            {

                return StatusCode(500, ex.Message);

            }

        }

    }

}