using dotnetapp.Exceptions;
using dotnetapp.Models;
using dotnetapp.Data;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework;
using System.Linq;
using System.Reflection;
using dotnetapp.Services;
using System;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System.Net;
using System.Net.Http;
using System.Text;

namespace dotnetapp.Tests
{
    [TestFixture]
    public class Tests
    {

        private ApplicationDbContext _context; 
        private HttpClient _httpClient;

        [SetUp]
        public void Setup()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>().UseInMemoryDatabase(databaseName: "TestDatabase").Options;
            _context = new ApplicationDbContext(options);
           
             _httpClient = new HttpClient();
             _httpClient.BaseAddress = new Uri("http://localhost:8080");

        }

        [TearDown]
        public void TearDown()
        {
             _context.Dispose();
        }

   [Test, Order(1)]
    public async Task Backend_Test_Post_Method_Register_Owner_Returns_HttpStatusCode_OK()
    {
        ClearDatabase();
        string uniqueId = Guid.NewGuid().ToString();

        // Generate a unique userName based on a timestamp
        string uniqueUsername = $"abcd_{uniqueId}";
        string uniqueEmail = $"abcd{uniqueId}@gmail.com";

        string requestBody = $"{{\"Username\": \"{uniqueUsername}\", \"Password\": \"abc@123A\", \"Email\": \"{uniqueEmail}\", \"MobileNumber\": \"1234567890\", \"UserRole\": \"Owner\"}}";
        HttpResponseMessage response = await _httpClient.PostAsync("/api/register", new StringContent(requestBody, Encoding.UTF8, "application/json"));

        Console.WriteLine(response.StatusCode);
        string responseString = await response.Content.ReadAsStringAsync();

        Console.WriteLine(responseString);
        Assert.AreEqual(HttpStatusCode.OK, response.StatusCode);
    }
  
   [Test, Order(2)]
    public async Task Backend_Test_Post_Method_Login_Owner_Returns_HttpStatusCode_OK()
    {
        ClearDatabase();

        string uniqueId = Guid.NewGuid().ToString();

        // Generate a unique userName based on a timestamp
        string uniqueUsername = $"abcd_{uniqueId}";
        string uniqueEmail = $"abcd{uniqueId}@gmail.com";

        string requestBody = $"{{\"Username\": \"{uniqueUsername}\", \"Password\": \"abc@123A\", \"Email\": \"{uniqueEmail}\", \"MobileNumber\": \"1234567890\", \"UserRole\": \"Owner\"}}";
        HttpResponseMessage response = await _httpClient.PostAsync("/api/register", new StringContent(requestBody, Encoding.UTF8, "application/json"));

        // Print registration response
        string registerResponseBody = await response.Content.ReadAsStringAsync();
        Console.WriteLine("Registration Response: " + registerResponseBody);

        // Login with the registered user
        string loginRequestBody = $"{{\"Email\" : \"{uniqueEmail}\",\"Password\" : \"abc@123A\"}}"; // Updated variable names
        HttpResponseMessage loginResponse = await _httpClient.PostAsync("/api/login", new StringContent(loginRequestBody, Encoding.UTF8, "application/json"));

        // Print login response
        string loginResponseBody = await loginResponse.Content.ReadAsStringAsync();
        Console.WriteLine("Login Response: " + loginResponseBody);

        Assert.AreEqual(HttpStatusCode.OK, loginResponse.StatusCode);
    }
[Test, Order(3)]
public async Task Backend_Test_Get_All_Feedbacks_With_Token_By_Owner_Returns_HttpStatusCode_OK()
{
    ClearDatabase();
    string uniqueId = Guid.NewGuid().ToString();

    // Generate a unique userName based on a timestamp
    string uniqueUsername = $"abcd_{uniqueId}";
    string uniqueEmail = $"abcd{uniqueId}@gmail.com";

    string requestBody = $"{{\"Username\": \"{uniqueUsername}\", \"Password\": \"abc@123A\", \"Email\": \"{uniqueEmail}\", \"MobileNumber\": \"1234567890\", \"UserRole\": \"Owner\"}}";
    HttpResponseMessage response = await _httpClient.PostAsync("/api/register", new StringContent(requestBody, Encoding.UTF8, "application/json"));

    // Print registration response
    string registerResponseBody = await response.Content.ReadAsStringAsync();
    Console.WriteLine("Registration Response: " + registerResponseBody);

    // Login with the registered user
    string loginRequestBody = $"{{\"Email\" : \"{uniqueEmail}\",\"Password\" : \"abc@123A\"}}"; // Updated variable names
    HttpResponseMessage loginResponse = await _httpClient.PostAsync("/api/login", new StringContent(loginRequestBody, Encoding.UTF8, "application/json"));

    // Print login response
    string loginResponseBody = await loginResponse.Content.ReadAsStringAsync();
    Console.WriteLine("Login Response: " + loginResponseBody);

    Assert.AreEqual(HttpStatusCode.OK, loginResponse.StatusCode);
    string responseBody = await loginResponse.Content.ReadAsStringAsync();

    dynamic responseMap = JsonConvert.DeserializeObject(responseBody);

    string token = responseMap.token;

    Assert.IsNotNull(token);

    // Use the token to get all feeds
    _httpClient.DefaultRequestHeaders.Add("Authorization", "Bearer " + token);
    HttpResponseMessage feedResponse = await _httpClient.GetAsync("/api/feedback");

    // Print feed response
    string feedResponseBody = await feedResponse.Content.ReadAsStringAsync();
    Console.WriteLine("Feed Response: " + feedResponseBody);

    Assert.AreEqual(HttpStatusCode.OK, feedResponse.StatusCode);
}

[Test, Order(4)]
public async Task Backend_Test_Get_All_Feeds_Without_Token_By_Owner_Returns_HttpStatusCode_Unauthorized()
{
    ClearDatabase();
    string uniqueId = Guid.NewGuid().ToString();

    // Generate a unique userName based on a timestamp
    string uniqueUsername = $"abcd_{uniqueId}";
    string uniqueEmail = $"abcd{uniqueId}@gmail.com";

    string requestBody = $"{{\"Username\": \"{uniqueUsername}\", \"Password\": \"abc@123A\", \"Email\": \"{uniqueEmail}\", \"MobileNumber\": \"1234567890\", \"UserRole\": \"Owner\"}}";
    HttpResponseMessage response = await _httpClient.PostAsync("/api/register", new StringContent(requestBody, Encoding.UTF8, "application/json"));

    // Print registration response
    string registerResponseBody = await response.Content.ReadAsStringAsync();
    Console.WriteLine("Registration Response: " + registerResponseBody);

    // Login with the registered user
    string loginRequestBody = $"{{\"Email\" : \"{uniqueEmail}\",\"Password\" : \"abc@123A\"}}"; // Updated variable names
    HttpResponseMessage loginResponse = await _httpClient.PostAsync("/api/login", new StringContent(loginRequestBody, Encoding.UTF8, "application/json"));

    // Print login response
    string loginResponseBody = await loginResponse.Content.ReadAsStringAsync();
    Console.WriteLine("Login Response: " + loginResponseBody);

    Assert.AreEqual(HttpStatusCode.OK, loginResponse.StatusCode);
    string responseBody = await loginResponse.Content.ReadAsStringAsync();

    HttpResponseMessage feedResponse = await _httpClient.GetAsync("/api/feed");

    // Print feed response
    string feedResponseBody = await feedResponse.Content.ReadAsStringAsync();
    Console.WriteLine("Feed Response: " + feedResponseBody);

    Assert.AreEqual(HttpStatusCode.Unauthorized, feedResponse.StatusCode);
}


[Test, Order(5)]
public async Task Backend_Test_Get_Method_Get_FeedById_In_Feed_Service_Fetches_Feed_Successfully()
{
    ClearDatabase();

     var userData = new Dictionary<string, object>
    {
        { "UserId", 400 },
        { "Username", "testuser" },
        { "Password", "testpassword" },
        { "Email", "test@example.com" },
        { "MobileNumber", "1234567890" },
        { "UserRole", "Supplier" }
    };

    var user = new User();
    foreach (var kvp in userData)
    {
        var propertyInfo = typeof(User).GetProperty(kvp.Key);
        if (propertyInfo != null)
        {
            propertyInfo.SetValue(user, kvp.Value);
        }
    }
    _context.Users.Add(user);
    _context.SaveChanges();

    // Set up feed data
    var feedData = new Dictionary<string, object>
    {
        { "FeedId", 1 },
        { "FeedName", "Quality Hay" },
        { "Type", "Hay" },
        { "Description", "High quality hay for livestock" },
        { "Quantity", 100 },
        { "Unit", "kg" },
        { "PricePerUnit", 20m },
        { "Image", "https://8080-bcdefebcafaeaaacddadaeccbddfeefbddadace.premiumproject.examly.io/feed.jpg" },
        { "UserId", 400 },

    };

    // Create feed instance and set properties
    var feed = new Feed();
    foreach (var kvp in feedData)
    {
        var propertyInfo = typeof(Feed).GetProperty(kvp.Key);
        if (propertyInfo != null)
        {
            propertyInfo.SetValue(feed, kvp.Value);
        }
    }

    // Add feed to the context and save changes
    _context.Feeds.Add(feed);
    _context.SaveChanges();

    // Load assembly and types
    string assemblyName = "dotnetapp";
    Assembly assembly = Assembly.Load(assemblyName);
    string serviceName = "dotnetapp.Services.FeedService";
    string modelName = "dotnetapp.Models.Feed";

    Type serviceType = assembly.GetType(serviceName);
    Type modelType = assembly.GetType(modelName);

    // Get the GetFeedById method
    MethodInfo getFeedMethod = serviceType.GetMethod("GetFeedById");

    // Check if method exists
    if (getFeedMethod != null)
    {
        var service = Activator.CreateInstance(serviceType, _context);
        var retrievedFeed = (Task<Feed>)getFeedMethod.Invoke(service, new object[] { 1 });

        // Assert the retrieved feed is not null and properties match
        Assert.IsNotNull(retrievedFeed);
        Assert.AreEqual(feed.FeedName, retrievedFeed.Result.FeedName);
    }
    else
    {
        Assert.Fail();
    }
}


[Test, Order(6)]
public async Task Backend_Test_Put_Method_UpdateFeed_In_Feed_Service_Updates_Feed_Successfully()
{
    ClearDatabase();

 var userData = new Dictionary<string, object>
    {
        { "UserId", 400 },
        { "Username", "testuser" },
        { "Password", "testpassword" },
        { "Email", "test@example.com" },
        { "MobileNumber", "1234567890" },
        { "UserRole", "Supplier" }
    };

    var user = new User();
    foreach (var kvp in userData)
    {
        var propertyInfo = typeof(User).GetProperty(kvp.Key);
        if (propertyInfo != null)
        {
            propertyInfo.SetValue(user, kvp.Value);
        }
    }
    _context.Users.Add(user);
    _context.SaveChanges();
    // Set up initial feed data
    var initialFeedData = new Dictionary<string, object>
    {
        { "FeedId", 1 },
        { "FeedName", "Quality Hay" },
        { "Type", "Hay" },
        { "Description", "High quality hay for livestock" },
        { "Quantity", 100 },
        { "Unit", "kg" },
        { "PricePerUnit", 20m },
        { "Image", "https://8080-bcdefebcafaeaaacddadaeccbddfeefbddadace.premiumproject.examly.io/feed.jpg" },
        { "UserId", 400 }

    };

    // Create and add initial feed to context
    var initialFeed = new Feed();
    foreach (var kvp in initialFeedData)
    {
        var propertyInfo = typeof(Feed).GetProperty(kvp.Key);
        if (propertyInfo != null)
        {
            propertyInfo.SetValue(initialFeed, kvp.Value);
        }
    }
    _context.Feeds.Add(initialFeed);
    _context.SaveChanges();

    // Load assembly and types
    string assemblyName = "dotnetapp";
    Assembly assembly = Assembly.Load(assemblyName);
    string serviceName = "dotnetapp.Services.FeedService";
    string modelName = "dotnetapp.Models.Feed";

    Type serviceType = assembly.GetType(serviceName);
    Type modelType = assembly.GetType(modelName);

    // Get UpdateFeed method
    MethodInfo updateMethod = serviceType.GetMethod("UpdateFeed", new[] { typeof(int), modelType });

    if (updateMethod != null)
    {
        var service = Activator.CreateInstance(serviceType, _context);

        // Set up updated feed data
        var updatedFeedData = new Dictionary<string, object>
        {
            { "FeedId", 1 },
            { "FeedName", "Updated Quality Hay" },
            { "Type", "Hay" },
            { "Description", "Updated high quality hay for livestock" },
            { "Quantity", 150 },
            { "Unit", "kg" },
            { "PricePerUnit", 25m },
            { "Image", "https://8080-bcdefebcafaeaaacddadaeccbddfeefbddadace.premiumproject.examly.io/updated_feed.jpg" },
            { "UserId", 400 }

        };

        // Create updated feed instance and set properties
        var updatedFeed = Activator.CreateInstance(modelType);
        foreach (var kvp in updatedFeedData)
        {
            var propertyInfo = modelType.GetProperty(kvp.Key);
            if (propertyInfo != null)
            {
                propertyInfo.SetValue(updatedFeed, kvp.Value);
            }
        }

        // Invoke UpdateFeed method
        var updateResult = (Task<bool>)updateMethod.Invoke(service, new object[] { 1, updatedFeed });
        await updateResult;

        // Retrieve updated feed from database
        var updatedFeedFromDb = await _context.Feeds.FindAsync(1);

        // Assert the updated feed properties
        Assert.IsNotNull(updatedFeedFromDb);
        Assert.AreEqual("Updated Quality Hay", updatedFeedFromDb.FeedName);
    }
    else
    {
        Assert.Fail();
    }
}

[Test, Order(7)]
public async Task Backend_Test_Delete_Method_DeleteFeed_In_Feed_Service_Deletes_Feed_Successfully()
{
    ClearDatabase();
 var userData = new Dictionary<string, object>
    {
        { "UserId", 400 },
        { "Username", "testuser" },
        { "Password", "testpassword" },
        { "Email", "test@example.com" },
        { "MobileNumber", "1234567890" },
        { "UserRole", "Supplier" }
    };

    var user = new User();
    foreach (var kvp in userData)
    {
        var propertyInfo = typeof(User).GetProperty(kvp.Key);
        if (propertyInfo != null)
        {
            propertyInfo.SetValue(user, kvp.Value);
        }
    }
    _context.Users.Add(user);
    _context.SaveChanges();
    // Set up initial feed data
    var initialFeedData = new Dictionary<string, object>
    {
        { "FeedId", 1 },
        { "FeedName", "Quality Hay" },
        { "Type", "Hay" },
        { "Description", "High quality hay for livestock" },
        { "Quantity", 100 },
        { "Unit", "kg" },
        { "PricePerUnit", 20m },
        { "Image", "https://8080-bcdefebcafaeaaacddadaeccbddfeefbddadace.premiumproject.examly.io/feed.jpg" },
        { "UserId", 400 }

    };

    // Create and add initial feed to context
    var initialFeed = new Feed();
    foreach (var kvp in initialFeedData)
    {
        var propertyInfo = typeof(Feed).GetProperty(kvp.Key);
        if (propertyInfo != null)
        {
            propertyInfo.SetValue(initialFeed, kvp.Value);
        }
    }
    _context.Feeds.Add(initialFeed);
    _context.SaveChanges();

    // Load assembly and types
    string assemblyName = "dotnetapp";
    Assembly assembly = Assembly.Load(assemblyName);
    string serviceName = "dotnetapp.Services.FeedService";

    Type serviceType = assembly.GetType(serviceName);

    // Get DeleteFeed method
    MethodInfo deleteMethod = serviceType.GetMethod("DeleteFeed", new[] { typeof(int) });

    if (deleteMethod != null)
    {
        var service = Activator.CreateInstance(serviceType, _context);

        // Invoke DeleteFeed method
        var deleteResult = (Task<bool>)deleteMethod.Invoke(service, new object[] { 1 });
        await deleteResult;

        // Retrieve deleted feed from database
        var deletedFeedFromDb = await _context.Feeds.FindAsync(1);

        // Assert the feed is deleted
        Assert.IsNull(deletedFeedFromDb);
    }
    else
    {
        Assert.Fail();
    }
}

[Test, Order(8)]

public async Task Backend_Test_Get_Method_GetLivestocksByUserId_In_Livestock_Service_Fetches_Successfully()
{
    ClearDatabase();

    // Add user
    var userData = new Dictionary<string, object>
    {
        { "UserId", 330 },
        { "Username", "testuser" },
        { "Password", "testpassword" },
        { "Email", "test@example.com" },
        { "MobileNumber", "1234567890" },
        { "UserRole", "Owner" }
    };

    var user = new User();
    foreach (var kvp in userData)
    {
        var propertyInfo = typeof(User).GetProperty(kvp.Key);
        if (propertyInfo != null)
        {
            propertyInfo.SetValue(user, kvp.Value);
        }
    }
    _context.Users.Add(user);
    _context.SaveChanges();

    // Add livestock
    var livestockData = new Dictionary<string, object>
    {
        { "LivestockId", 13 },
        { "Name", "Bessie" },
        { "Species", "Cow" },
        { "Age", 5 },
        { "Breed", "Angus" },
        { "HealthCondition", "Healthy" },
        { "Location", "Barn 1" },
        { "VaccinationStatus", "Vaccinated" },
        { "UserId", 330 }
    };

    var livestock = new Livestock();
    foreach (var kvp in livestockData)
    {
        var propertyInfo = typeof(Livestock).GetProperty(kvp.Key);
        if (propertyInfo != null)
        {
            propertyInfo.SetValue(livestock, kvp.Value);
        }
    }
    _context.Livestocks.Add(livestock);
    _context.SaveChanges();

    // Load assembly and types
    string assemblyName = "dotnetapp";
    Assembly assembly = Assembly.Load(assemblyName);
    string serviceName = "dotnetapp.Services.LivestockService";

    Type serviceType = assembly.GetType(serviceName);

    // Get GetLivestocksByUserId method
    MethodInfo getLivestocksByUserIdMethod = serviceType.GetMethod("GetLivestocksByUserId");

    if (getLivestocksByUserIdMethod != null)
    {
        var service = Activator.CreateInstance(serviceType, _context);

        // Invoke GetLivestocksByUserId method
        var result = (Task<IEnumerable<Livestock>>)getLivestocksByUserIdMethod.Invoke(service, new object[] { 330 });
        Assert.IsNotNull(result);

        var check = true;
        foreach (var livestockItem in result.Result)
        {
            check = false;
            Assert.AreEqual("Bessie", livestockItem.Name);
            Assert.AreEqual("Cow", livestockItem.Species);
        }

        if (check)
        {
            Assert.Fail("No livestock found for the user ID");
        }
    }
    else
    {
        Assert.Fail("Method GetLivestocksByUserId not found in LivestockService");
    }
}
[Test, Order(9)]
public async Task Backend_Test_Delete_Method_DeleteLivestock_In_Livestock_Service_Deletes_Livestock_Successfully()
{
    ClearDatabase();

    var userData = new Dictionary<string, object>
    {
        { "UserId", 300 },
        { "Username", "testuser" },
        { "Password", "testpassword" },
        { "Email", "test@example.com" },
        { "MobileNumber", "1234567890" },
        { "UserRole", "Owner" }
    };

    var user = new User();
    foreach (var kvp in userData)
    {
        var propertyInfo = typeof(User).GetProperty(kvp.Key);
        if (propertyInfo != null)
        {
            propertyInfo.SetValue(user, kvp.Value);
        }
    }
    _context.Users.Add(user);
    _context.SaveChanges();

    // Set up initial livestock data
    var livestockData = new Dictionary<string, object>
    {
        { "LivestockId", 1 },
        { "Name", "Bessie" },
        { "Species", "Cow" },
        { "Age", 24 },
        { "Breed", "Angus" },
        { "HealthCondition", "Healthy" },
        { "Location", "Barn 1" },
        { "VaccinationStatus", "Vaccinated" },
        { "UserId", 300 }
    };

    var livestock = new Livestock();
    foreach (var kvp in livestockData)
    {
        var propertyInfo = typeof(Livestock).GetProperty(kvp.Key);
        if (propertyInfo != null)
        {
            propertyInfo.SetValue(livestock, kvp.Value);
        }
    }
    _context.Livestocks.Add(livestock);
    _context.SaveChanges();

    // Load assembly and types
    string assemblyName = "dotnetapp";
    Assembly assembly = Assembly.Load(assemblyName);
    string serviceName = "dotnetapp.Services.LivestockService";

    Type serviceType = assembly.GetType(serviceName);

    // Get DeleteLivestock method
    MethodInfo deleteLivestockMethod = serviceType.GetMethod("DeleteLivestock");

    if (deleteLivestockMethod != null)
    {
        var service = Activator.CreateInstance(serviceType, _context);

        // Invoke DeleteLivestock method
        var deleteResult = (Task<bool>)deleteLivestockMethod.Invoke(service, new object[] { 1 });
        var isDeleted = await deleteResult;

        // Assert the results
        Assert.IsTrue(isDeleted);

        var deletedLivestockFromDb = await _context.Livestocks.FindAsync(1);
        Assert.IsNull(deletedLivestockFromDb);
    }
    else
    {
        Assert.Fail("DeleteLivestock method not found.");
    }
}


[Test, Order(10)]
public async Task Backend_Test_Get_Method_GetAllMedicines_In_Medicine_Service_Returns_All_Medicines()
{
    ClearDatabase();

    var userData = new Dictionary<string, object>
    {
        { "UserId", 300 },
        { "Username", "testuser" },
        { "Password", "testpassword" },
        { "Email", "test@example.com" },
        { "MobileNumber", "1234567890" },
        { "UserRole", "Supplier" }
    };

    var user = new User();
    foreach (var kvp in userData)
    {
        var propertyInfo = typeof(User).GetProperty(kvp.Key);
        if (propertyInfo != null)
        {
            propertyInfo.SetValue(user, kvp.Value);
        }
    }
    _context.Users.Add(user);
    _context.SaveChanges();

    // Set up initial medicine data
    var initialMedicineData = new List<Dictionary<string, object>>
    {
        new Dictionary<string, object>
        {
            { "MedicineId", 1 },
            { "MedicineName", "Aspirin" },
            { "Brand", "Bayer" },
            { "Category", "Pain Reliever" },
            { "Description", "Used for pain relief" },
            { "Quantity", 100 },
            { "Unit", "Tablet" },
            { "PricePerUnit", 0.1m },
            { "Image", "http://example.com/aspirin.jpg" },
            { "UserId", 300 }
        },
        new Dictionary<string, object>
        {
            { "MedicineId", 2 },
            { "MedicineName", "Ibuprofen" },
            { "Brand", "Advil" },
            { "Category", "Pain Reliever" },
            { "Description", "Used for pain relief and anti-inflammatory" },
            { "Quantity", 200 },
            { "Unit", "Tablet" },
            { "PricePerUnit", 0.15m },
            { "Image", "http://example.com/ibuprofen.jpg" },
            { "UserId", 300 }
        }
    };

    // Create and add medicines to context
    foreach (var medicineData in initialMedicineData)
    {
        var medicine = new Medicine();
        foreach (var kvp in medicineData)
        {
            var propertyInfo = typeof(Medicine).GetProperty(kvp.Key);
            if (propertyInfo != null)
            {
                propertyInfo.SetValue(medicine, kvp.Value);
            }
        }
        _context.Medicines.Add(medicine);
    }
    _context.SaveChanges();

    // Load assembly and types
    string assemblyName = "dotnetapp";
    Assembly assembly = Assembly.Load(assemblyName);
    string serviceName = "dotnetapp.Services.MedicineService";

    Type serviceType = assembly.GetType(serviceName);

    // Get GetAllMedicines method
    MethodInfo getAllMedicinesMethod = serviceType.GetMethod("GetAllMedicines");

    if (getAllMedicinesMethod != null)
    {
        var service = Activator.CreateInstance(serviceType, _context);

        // Invoke GetAllMedicines method
        var getAllMedicinesResult = (Task<IEnumerable<Medicine>>)getAllMedicinesMethod.Invoke(service, null);
        var medicines = await getAllMedicinesResult;

        // Assert the results
        Assert.IsNotNull(medicines);
        Assert.AreEqual(2, medicines.Count());
        Assert.AreEqual("Aspirin", medicines.First().MedicineName);
        Assert.AreEqual("Ibuprofen", medicines.Last().MedicineName);
    }
    else
    {
        Assert.Fail("GetAllMedicines method not found.");
    }
}


[Test, Order(11)]
public async Task Backend_Test_Post_Method_AddMedicine_In_MedicineService_Occurs_MedicineException_For_Duplicate_Medicine()
{
    ClearDatabase();

    // Add user to context
    var userData = new Dictionary<string, object>
    {
        { "UserId", 300 },
        { "Username", "testuser" },
        { "Password", "testpassword" },
        { "Email", "test@example.com" },
        { "MobileNumber", "1234567890" },
        { "UserRole", "Supplier" }
    };

    var user = new User();
    foreach (var kvp in userData)
    {
        var propertyInfo = typeof(User).GetProperty(kvp.Key);
        if (propertyInfo != null)
        {
            propertyInfo.SetValue(user, kvp.Value);
        }
    }
    _context.Users.Add(user);
    _context.SaveChanges();

    // Load assembly and types
    string assemblyName = "dotnetapp";
    Assembly assembly = Assembly.Load(assemblyName);
    string serviceName = "dotnetapp.Services.MedicineService";
    string typeName = "dotnetapp.Models.Medicine";

    Type serviceType = assembly.GetType(serviceName);
    Type modelType = assembly.GetType(typeName);

    MethodInfo method = serviceType.GetMethod("AddMedicine", new[] { modelType });

    if (method != null)
    {
        var medicineData = new Dictionary<string, object>
        {
            { "MedicineId", 1 },
            { "MedicineName", "Aspirin" },
            { "Brand", "Bayer" },
            { "Category", "Pain Reliever" },
            { "Description", "Used for pain relief" },
            { "Quantity", 100 },
            { "Unit", "Tablet" },
            { "PricePerUnit", 0.1m },
            { "Image", "http://example.com/aspirin.jpg" },
            { "UserId", 300 }
        };

        var medicine = Activator.CreateInstance(modelType);
        foreach (var kvp in medicineData)
        {
            var propertyInfo = modelType.GetProperty(kvp.Key);
            if (propertyInfo != null)
            {
                propertyInfo.SetValue(medicine, kvp.Value);
            }
        }

        var service = Activator.CreateInstance(serviceType, _context);
        var result = (Task<bool>)method.Invoke(service, new object[] { medicine });
        var addedMedicine = await _context.Medicines.FindAsync(1);
        Assert.IsNotNull(addedMedicine);

        var duplicateMedicineData = new Dictionary<string, object>
        {
            { "MedicineId", 2 },
            { "MedicineName", "Aspirin" },
            { "Brand", "Bayer" },
            { "Category", "Pain Reliever" },
            { "Description", "Used for pain relief" },
            { "Quantity", 100 },
            { "Unit", "Tablet" },
            { "PricePerUnit", 0.1m },
            { "Image", "http://example.com/aspirin.jpg" },
            { "UserId", 300 }
        };

        var duplicateMedicine = Activator.CreateInstance(modelType);
        foreach (var kvp in duplicateMedicineData)
        {
            var propertyInfo = modelType.GetProperty(kvp.Key);
            if (propertyInfo != null)
            {
                propertyInfo.SetValue(duplicateMedicine, kvp.Value);
            }
        }

        try
        {
            var result1 = (Task<bool>)method.Invoke(service, new object[] { duplicateMedicine });
            Console.WriteLine("res" + result1.Result);
            Assert.Fail();
        }
        catch (Exception ex)
        {
            Assert.IsNotNull(ex.InnerException);
            Assert.IsTrue(ex.InnerException is MedicineException);
            Assert.AreEqual("Medicine with the same name and brand already exists", ex.InnerException.Message);
        }
    }
    else
    {
        Assert.Fail();
    }
}

[Test, Order(12)]
public async Task Backend_Test_Post_Method_AddFeedback_In_Feedback_Service_Posts_Successfully()
{
        ClearDatabase();

    // Add user
    var userData = new Dictionary<string, object>
    {
        { "UserId",42 },
        { "Username", "testuser" },
        { "Password", "testpassword" },
        { "Email", "test@example.com" },
        { "MobileNumber", "1234567890" },
        { "UserRole", "Owner" }
    };

    var user = new User();
    foreach (var kvp in userData)
    {
        var propertyInfo = typeof(User).GetProperty(kvp.Key);
        if (propertyInfo != null)
        {
            propertyInfo.SetValue(user, kvp.Value);
        }
    }
    _context.Users.Add(user);
    _context.SaveChanges();
    // Add loan application
    string assemblyName = "dotnetapp";
    Assembly assembly = Assembly.Load(assemblyName);
    string ServiceName = "dotnetapp.Services.FeedbackService";
    string typeName = "dotnetapp.Models.Feedback";

    Type serviceType = assembly.GetType(ServiceName);
    Type modelType = assembly.GetType(typeName);

    MethodInfo method = serviceType.GetMethod("AddFeedback", new[] { modelType });

    if (method != null)
    {
           var feedbackData = new Dictionary<string, object>
            {
                { "FeedbackId", 11 },
                { "UserId", 42 },
                { "FeedbackText", "Great experience!" },
                { "Date", DateTime.Now }
            };
        var feedback = new Feedback();
        foreach (var kvp in feedbackData)
        {
            var propertyInfo = typeof(Feedback).GetProperty(kvp.Key);
            if (propertyInfo != null)
            {
                propertyInfo.SetValue(feedback, kvp.Value);
            }
        }
        var service = Activator.CreateInstance(serviceType, _context);
        var result = (Task<bool>)method.Invoke(service, new object[] { feedback });
    
        var addedFeedback= await _context.Feedbacks.FindAsync(11);
        Assert.IsNotNull(addedFeedback);
        Assert.AreEqual("Great experience!",addedFeedback.FeedbackText);

    }
    else{
        Assert.Fail();
    }
}

[Test, Order(13)]
public async Task Backend_Test_Delete_Method_Feedback_In_Feeback_Service_Deletes_Successfully()
{
    // Add user
     ClearDatabase();

    var userData = new Dictionary<string, object>
    {
        { "UserId",42 },
        { "Username", "testuser" },
        { "Password", "testpassword" },
        { "Email", "test@example.com" },
        { "MobileNumber", "1234567890" },
        { "UserRole", "Owner" }
    };

    var user = new User();
    foreach (var kvp in userData)
    {
        var propertyInfo = typeof(User).GetProperty(kvp.Key);
        if (propertyInfo != null)
        {
            propertyInfo.SetValue(user, kvp.Value);
        }
    }
    _context.Users.Add(user);
    _context.SaveChanges();

           var feedbackData = new Dictionary<string, object>
            {
                { "FeedbackId", 11 },
                { "UserId", 42 },
                { "FeedbackText", "Great experience!" },
                { "Date", DateTime.Now }
            };
        var feedback = new Feedback();
        foreach (var kvp in feedbackData)
        {
            var propertyInfo = typeof(Feedback).GetProperty(kvp.Key);
            if (propertyInfo != null)
            {
                propertyInfo.SetValue(feedback, kvp.Value);
            }
        }
     _context.Feedbacks.Add(feedback);
    _context.SaveChanges();
    // Add loan application
    string assemblyName = "dotnetapp";
    Assembly assembly = Assembly.Load(assemblyName);
    string ServiceName = "dotnetapp.Services.FeedbackService";
    string typeName = "dotnetapp.Models.Feedback";

    Type serviceType = assembly.GetType(ServiceName);
    Type modelType = assembly.GetType(typeName);

  
    MethodInfo deletemethod = serviceType.GetMethod("DeleteFeedback", new[] { typeof(int) });

    if (deletemethod != null)
    {
        var service = Activator.CreateInstance(serviceType, _context);
        var deleteResult = (Task<bool>)deletemethod.Invoke(service, new object[] { 11 });

        var deletedFeedbackFromDb = await _context.Feedbacks.FindAsync(11);
        Assert.IsNull(deletedFeedbackFromDb);
    }
    else
    {
        Assert.Fail();
    }
}

[Test, Order(14)]
public async Task Backend_Test_Get_Method_GetFeedbacksByUserId_In_Feedback_Service_Fetches_Successfully()
{
    ClearDatabase();

    // Add user
    var userData = new Dictionary<string, object>
    {
        { "UserId", 330 },
        { "Username", "testuser" },
        { "Password", "testpassword" },
        { "Email", "test@example.com" },
        { "MobileNumber", "1234567890" },
        { "UserRole", "Owner" }
    };

    var user = new User();
    foreach (var kvp in userData)
    {
        var propertyInfo = typeof(User).GetProperty(kvp.Key);
        if (propertyInfo != null)
        {
            propertyInfo.SetValue(user, kvp.Value);
        }
    }
    _context.Users.Add(user);
    _context.SaveChanges();

    var feedbackData= new Dictionary<string, object>
    {
        { "FeedbackId", 13 },
        { "UserId", 330 },
        { "FeedbackText", "Great experience!" },
        { "Date", DateTime.Now }
    };

    var feedback = new Feedback();
    foreach (var kvp in feedbackData)
    {
        var propertyInfo = typeof(Feedback).GetProperty(kvp.Key);
        if (propertyInfo != null)
        {
            propertyInfo.SetValue(feedback, kvp.Value);
        }
    }
    _context.Feedbacks.Add(feedback);
    _context.SaveChanges();

    // Add loan application
    string assemblyName = "dotnetapp";
    Assembly assembly = Assembly.Load(assemblyName);
    string ServiceName = "dotnetapp.Services.FeedbackService";
    string typeName = "dotnetapp.Models.Feedback";

    Type serviceType = assembly.GetType(ServiceName);
    Type modelType = assembly.GetType(typeName);

    MethodInfo method = serviceType.GetMethod("GetFeedbacksByUserId");

    if (method != null)
    {
        var service = Activator.CreateInstance(serviceType, _context);
        var result = ( Task<IEnumerable<Feedback>>)method.Invoke(service, new object[] {330});
        Assert.IsNotNull(result);
         var check=true;
        foreach (var item in result.Result)
        {
            check=false;
            Assert.AreEqual("Great experience!", item.FeedbackText);
   
        }
        if(check==true)
        {
            Assert.Fail();

        }
    }
    else{
        Assert.Fail();
    }
}

private void ClearDatabase()
{
    _context.Database.EnsureDeleted();
    _context.Database.EnsureCreated();
}

}
}

