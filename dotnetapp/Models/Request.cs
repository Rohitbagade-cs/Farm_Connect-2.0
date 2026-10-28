using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json.Serialization;

namespace dotnetapp.Models
{
    public class Request
    {
        public int RequestId{get;set;}
        public string RequestType{get;set;}
        public int? FeedId{get;set;}
        [JsonIgnore]
        public Feed? Feed{get;set;}
        public int? MedicineId{get;set;}
        [JsonIgnore]
        public Medicine? Medicine{get;set;}
        public int UserId{get;set;}
        [JsonIgnore]
        public User? User{get;set;}
        public int LivestockId{get;set;}
        [JsonIgnore]
        public Livestock? Livestock{get;set;}
        public int Quantity{get;set;}
        public string Status{get;set;}
        public DateTime RequestDate{get;set;}
    }
}