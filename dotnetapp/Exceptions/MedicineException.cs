using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace dotnetapp.Exceptions
{
    public class MedicineException : Exception
    {
        public MedicineException(string message) : base(message) { }

    }
}