using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

using dotnetapp.Models;
using dotnetapp.Services;

namespace dotnetapp.Controllers
{
    [ApiController]
    [Route("api/request")]
    public class RequestController : ControllerBase
    {
        private readonly RequestService _requestService;

        public RequestController(RequestService requestService)
        {
            _requestService = requestService;
        }

        //  Get all requests
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Request>>> GetAllRequests()
        {
            try
            {
                var requests = await _requestService.GetAllRequests();
                return Ok(requests);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        //  Get request by ID
        [HttpGet("{requestId}")]
        public async Task<ActionResult<Request>> GetRequestById(int requestId)
        {
            try
            {
                var request = await _requestService.GetRequestById(requestId);

                if (request == null)
                {
                    return NotFound("No request found");
                }

                return Ok(request);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        //  Get requests by user ID
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<Request>>> GetRequestsByUserId(int userId)
        {
            try
            {
                var requests = await _requestService.GetRequestsByUserId(userId);

                if (!requests.Any())
                {
                    return NotFound("No requests found");
                }

                return Ok(requests);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }


        [HttpGet("user/{userId}/medicines-or-feeds")]
        public async Task<ActionResult<IEnumerable<Request>>> GetRequestsByUserIdInMedicineOrFeed(int userId)
        {
            try
            {
                var requests = await _requestService.GetRequestsByUserIdInMedicineOrFeed(userId);
                return Ok(requests); //  always return array (even empty)
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }


        //  Add a request
        [HttpPost]
        public async Task<ActionResult> AddRequest([FromBody] Request request)
        {
            try
            {
                var result = await _requestService.AddRequest(request);

                if (result)
                {
                    return Ok("Request added successfully");
                }

                return StatusCode(500, "Failed to add request");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        //  Update a request
        [HttpPut("{requestId}")]
        public async Task<ActionResult> UpdateRequest(int requestId, [FromBody] Request request)
        {
            try
            {
                var result = await _requestService.UpdateRequest(requestId, request);

                if (!result)
                {
                    return NotFound("No request found");
                }

                return Ok("Request updated successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        //  Delete a request
        [HttpDelete("{requestId}")]
        public async Task<ActionResult> DeleteRequest(int requestId)
        {
            try
            {
                var result = await _requestService.DeleteRequest(requestId);

                if (!result)
                {
                    return NotFound("No request found");
                }

                return Ok("Request deleted successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}