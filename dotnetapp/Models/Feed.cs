using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json.Serialization;

namespace dotnetapp.Models
{
    public class Feed
    {
        public int FeedId { get; set; }

        public string FeedName { get; set; }

        public string? Feedback { get; set; }
        public string Type { get; set; }
        public string Description { get; set; }
        public string Unit { get; set; }
        public int Quantity {get;set;}
        public decimal PricePerUnit {get;set;}
        public int UserId {get;set;}
        [JsonIgnore]
        public User? User {get;set;}
        public string Image { get; set; }
    }
}