using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using dotnetapp.Data;
using dotnetapp.Models;
using Microsoft.EntityFrameworkCore;

namespace dotnetapp.Services
{
    public class RequestService
    {
        private readonly ApplicationDbContext _context;

        public RequestService(ApplicationDbContext context)
        {
            _context = context;
        }

        //  Get request by ID
        public async Task<Request?> GetRequestById(int requestId)
        {
            return await _context.Requests.FindAsync(requestId);
        }

        //  Add request
        public async Task<bool> AddRequest(Request request)
        {
            
            //  Set created/submission date on server
                request.RequestDate = DateTime.UtcNow;

            //  Default status if not provided
                if (string.IsNullOrWhiteSpace(request.Status))
                request.Status = "Pending";

            _context.Requests.Add(request);
            await _context.SaveChangesAsync();
            return true;
        }

        //  Update request
        public async Task<bool> UpdateRequest(int requestId, Request request)
        {
            var existingRequest = await _context.Requests.FindAsync(requestId);
            if (existingRequest == null)
            {
                return false;
            }

            _context.Entry(existingRequest).CurrentValues.SetValues(request);
            await _context.SaveChangesAsync();
            return true;
        }

        //  Get requests by user ID
        public async Task<IEnumerable<Request>> GetRequestsByUserId(int userId)
        {
            return await _context.Requests
                .Where(r => r.UserId == userId)
                .ToListAsync();
        }
        public async Task<IEnumerable<Request>> GetRequestsByUserIdInMedicineOrFeed(int supplierId)
        {
            string supplierIdStr = supplierId.ToString();

            // Get supplier’s medicine ids (Medicine.UserId is string)
            var supplierMedicineIds = await _context.Medicines
                .Where(m => m.UserId == supplierIdStr)
                .Select(m => m.MedicineId)
                .ToListAsync();

            var supplierFeedIds = await _context.Feeds
                .Where(f => f.UserId.ToString() == supplierIdStr)
                .Select(f => f.FeedId)
                .ToListAsync();

            // Return requests that match supplier’s medicines OR supplier’s feeds
            var requests = await _context.Requests
                .Where(r =>
                    (r.MedicineId != null && supplierMedicineIds.Contains(r.MedicineId.Value)) ||
                    (r.FeedId != null && supplierFeedIds.Contains(r.FeedId.Value))
                )
                .OrderByDescending(r => r.RequestDate)
                .ToListAsync();

            return requests;
        }


        // Delete request
        public async Task<bool> DeleteRequest(int requestId)
        {
            var request = await _context.Requests.FindAsync(requestId);
            if (request == null)
            {
                return false;
            }

            _context.Requests.Remove(request);
            await _context.SaveChangesAsync();
            return true;
        }

        // Get all requests
        public async Task<IEnumerable<Request>> GetAllRequests()
        {
            return await _context.Requests.ToListAsync();
        }
    }
}