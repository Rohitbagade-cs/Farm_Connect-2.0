using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace dotnetapp.Exceptions
{
   
 public class LivestockException : Exception

    {

    public LivestockException(string message) : base(message)

    {

    }

    }
}