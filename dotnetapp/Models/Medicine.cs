using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json.Serialization;
using System.ComponentModel.DataAnnotations.Schema;

namespace dotnetapp.Models
{
    public class Medicine
    {
        public int MedicineId { get; set; }

        public string MedicineName { get; set; }

        public string Brand { get; set; }

        public string Category { get; set; }

        public string Description { get; set; }

        public int Quantity { get; set; }

        public string Unit { get; set; }

        public decimal PricePerUnit { get; set; }

        public string? Image { get; set; }

        public string? UserId { get; set; }

        [JsonIgnore]
        public User? User { get; set; }  
    }
}