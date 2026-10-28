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
    [Route("api/[controller]")]
    public class MedicineController : ControllerBase
    {
        private readonly MedicineService _medicineService;

        public MedicineController(MedicineService medicineService)
        {
            _medicineService = medicineService;
        }

        //  Get all medicines
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Medicine>>> GetAllMedicines()
        {
            try
            {
                var medicines = await _medicineService.GetAllMedicines();
                return Ok(medicines);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        //  Get medicine by ID
        [HttpGet("{medicineId}")]
        public async Task<ActionResult<Medicine>> GetMedicineById(int medicineId)
        {
            try
            {
                var medicine = await _medicineService.GetMedicineById(medicineId);

                if (medicine == null)
                {
                    return NotFound("Cannot find any medicine");
                }

                return Ok(medicine);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        //  Add medicine
        [HttpPost]
        public async Task<ActionResult> AddMedicine([FromBody] Medicine medicine)
        {
            try
            {
                bool result = await _medicineService.AddMedicine(medicine);

                if (result)
                {

                    return Ok("Medicine added successfully");
                }

                return StatusCode(500, "Failed to add medicine");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.InnerException?.Message);
                return StatusCode(500, ex.Message);
            }
        }

        //  Update medicine
        [HttpPut("{medicineId}")]
        public async Task<ActionResult> UpdateMedicine(int medicineId, [FromBody] Medicine medicine)
        {
            try
            {
                bool result = await _medicineService.UpdateMedicine(medicineId, medicine);

                if (!result)
                {
                    return NotFound("Cannot find any medicine");
                }

                return Ok("Medicine updated successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        //  Get medicines by UserId
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<Medicine>>> GetMedicinesByUserId(string userId)
        {
            try
            {
                var medicines = await _medicineService.GetMedicinesByUserId(userId);

                if (medicines == null || !medicines.Any())
                {
                    return NotFound("Cannot find any medicines for this user");
                }

                return Ok(medicines);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        //  Delete medicine
        [HttpDelete("{medicineId}")]
        public async Task<ActionResult> DeleteMedicine(int medicineId)
        {
            try
            {
                bool result = await _medicineService.DeleteMedicine(medicineId);

                if (!result)
                {
                    return NotFound("Cannot find any medicine");
                }

                return Ok("Medicine deleted successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("{medicineId}/request-count")]
        public async Task<ActionResult> GetMedicineRequestCount(int medicineId)
        {
            try
            {
                var count = await _medicineService.GetRequestCountAsync(medicineId);
                return Ok(new { medicineId, requestCount = count });
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}
