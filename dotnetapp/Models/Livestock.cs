using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace dotnetapp.Models
{
    public class Livestock
    {
        public int LivestockId{get;set;}
        public string Name{get;set;}
        public string Species{get;set;}
        public int Age{get;set;}
        public string Breed{get;set;}
        public string HealthCondition{get;set;}
        public string Location{get;set;}
        public string VaccinationStatus{get;set;}
        public int UserId{get;set;}
        public User? User{get;set;}
    }
}