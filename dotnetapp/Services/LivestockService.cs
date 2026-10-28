
using Microsoft.EntityFrameworkCore;
using dotnetapp.Models;
using dotnetapp.Exceptions;
using System.Collections.Generic;
using dotnetapp.Data;
using System.Linq;

using System.Threading.Tasks;

namespace dotnetapp.Services

{

    public class LivestockService

    {

        private readonly ApplicationDbContext _context;

        public LivestockService(ApplicationDbContext context)

        {

            _context = context;

        }

        public async Task<Livestock> GetLivestockById(int livestockId)

        {

            return await _context.Livestocks

            .FirstOrDefaultAsync(l => l.LivestockId == livestockId);

        }

        public async Task<IEnumerable<Livestock>> GetAllLivestocks()

        {

            return await _context.Livestocks

            .ToListAsync();

        }

        public async Task<IEnumerable<Livestock>> GetLivestocksByUserId(int userId)

        {

            return await _context.Livestocks

            .Where(l => l.UserId == userId)

            .ToListAsync();

        }

        public async Task<bool> AddLivestock(Livestock livestock)

        {

            bool exists = await _context.Livestocks.AnyAsync(l =>

            l.Name == livestock.Name &&

            l.Breed == livestock.Breed &&

            l.Species == livestock.Species

            );

            if (exists)

            {

                throw new LivestockException(

                "Livestock with the same name, breed, and species already exists"

                );

            }

            await _context.Livestocks.AddAsync(livestock);

            await _context.SaveChangesAsync();

            return true;

        }

        public async Task<bool> UpdateLivestock(int livestockId, Livestock livestock)

        {

            var existingLivestock = await _context.Livestocks

            .FirstOrDefaultAsync(l => l.LivestockId == livestockId);

            if (existingLivestock == null)

            {

                return false;

            }

            bool exists = await _context.Livestocks.AnyAsync(l =>

            l.LivestockId != livestockId &&

            l.Name == livestock.Name &&

            l.Breed == livestock.Breed &&

            l.Species == livestock.Species

            );

            if (exists)

            {

                throw new LivestockException(

                "Livestock with the same name, breed, and species already exists"

                );

            }

            existingLivestock.Name = livestock.Name;

            existingLivestock.Species = livestock.Species;

            existingLivestock.Age = livestock.Age;

            existingLivestock.Breed = livestock.Breed;

            existingLivestock.HealthCondition = livestock.HealthCondition;

            existingLivestock.Location = livestock.Location;

            existingLivestock.VaccinationStatus = livestock.VaccinationStatus;

            existingLivestock.UserId = livestock.UserId;

            await _context.SaveChangesAsync();

            return true;

        }

        public async Task<bool> DeleteLivestock(int livestockId)

        {

            var livestock = await _context.Livestocks

            .FirstOrDefaultAsync(l => l.LivestockId == livestockId);

            if (livestock == null)

            {

                return false;

            }

            bool referenced = await _context.Requests

            .AnyAsync(r => r.LivestockId == livestockId);

            if (referenced)

            {

                throw new LivestockException(

                "Livestock cannot be deleted, it is referenced in requests"

                );

            }

            _context.Livestocks.Remove(livestock);

            await _context.SaveChangesAsync();

            return true;

        }

    }

}
