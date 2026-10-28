using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using dotnetapp.Data;
using dotnetapp.Models;
using dotnetapp.Exceptions;
using Microsoft.EntityFrameworkCore;

namespace dotnetapp.Services
{
    public class MedicineService
    {
        private readonly ApplicationDbContext _context;
        public MedicineService(ApplicationDbContext context){
            _context=context;
        }
        public async Task<IEnumerable<Medicine>> GetAllMedicines(){
            return await _context.Medicines.ToListAsync();
        }
        public async Task<Medicine?>GetMedicineById(int medicineId){
            return await _context.Medicines.FirstOrDefaultAsync(m=>m.MedicineId==medicineId);
        }
        public async Task<IEnumerable<Medicine>>GetMedicinesByUserId(string userId){
            return await _context.Medicines.Where(m=>m.UserId==userId).ToListAsync();
        }
        public async Task<bool> AddMedicine(Medicine medicine){
            bool exists=await _context.Medicines.AnyAsync(m=>m.MedicineName==medicine.MedicineName && m.Brand==medicine.Brand);
            if(exists){
                throw new MedicineException("Medicine with the same name and brand already exists");
            }
            _context.Medicines.Add(medicine);
            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<bool> UpdateMedicine(int medicineId, Medicine medicine){
            var existingMedicine=await _context.Medicines.FirstOrDefaultAsync(m=>m.MedicineId==medicineId);
            if(existingMedicine==null){
                return false;
            }
            bool duplicate= await _context.Medicines.AnyAsync(m=>m.MedicineName==medicine.MedicineName && m.Brand==medicine.Brand && m.MedicineId!=medicineId);
            if(duplicate){
                throw new MedicineException("Medicine with the same name and brand already exists");
            }
            existingMedicine.MedicineName=medicine.MedicineName;
            existingMedicine.Brand=medicine.Brand;
            existingMedicine.Category=medicine.Category;
            existingMedicine.Description=medicine.Description;
            existingMedicine.Quantity=medicine.Quantity;
            existingMedicine.Unit=medicine.Unit;
            existingMedicine.PricePerUnit=medicine.PricePerUnit;
            existingMedicine.Image=medicine.Image;
            existingMedicine.UserId=medicine.UserId;

            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<bool> DeleteMedicine(int medicineId){
            var medicine=await _context.Medicines.FirstOrDefaultAsync(m=>m.MedicineId==medicineId);
            if(medicine==null){
                return false;
            }
            int requestCount = await _context.Requests.CountAsync(r=>r.MedicineId==medicineId);
            if(requestCount > 0){
                throw new MedicineException($"Medicine cannot be deleted: it is referenced by {requestCount} request(s). Resolve or remove the requests first.");
            }
            _context.Medicines.Remove(medicine);
            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<int> GetRequestCountAsync(int medicineId){
            return await _context.Requests.CountAsync(r=>r.MedicineId==medicineId);
        }
    }
}