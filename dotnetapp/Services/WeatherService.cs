using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using dotnetapp.Data;
using dotnetapp.Models;

namespace dotnetapp.Services
{
    /// <summary>
    /// MonsoonGuard: pulls the 7-day forecast from Open-Meteo (free, no API key)
    /// and cross-references it with the owner's livestock to produce herd alerts.
    /// </summary>
    public class WeatherService
    {
        private readonly ApplicationDbContext _context;
        private readonly HttpClient _http;

        public WeatherService(ApplicationDbContext context, HttpClient http)
        {
            _context = context;
            _http = http;
        }

        public async Task<WeatherAlertsResponse> GetAlertsAsync(int userId, double lat, double lon, string locationName)
        {
            var url = $"https://api.open-meteo.com/v1/forecast?latitude={lat.ToString(CultureInfo.InvariantCulture)}" +
                      $"&longitude={lon.ToString(CultureInfo.InvariantCulture)}" +
                      "&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,relative_humidity_2m_max,weathercode" +
                      "&timezone=auto&forecast_days=7";

            string body;
            try
            {
                body = await _http.GetStringAsync(url);
            }
            catch (Exception)
            {
                throw new Exception("Weather service is temporarily unavailable. Please try again later.");
            }

            string[] dates; double[] tmax, tmin, precip, rh; int[] code;
            try
            {
                using var doc = JsonDocument.Parse(body);
                var daily = doc.RootElement.GetProperty("daily");
                dates  = StrArr(daily, "time");
                tmax   = NumArr(daily, "temperature_2m_max");
                tmin   = NumArr(daily, "temperature_2m_min");
                precip = NumArr(daily, "precipitation_sum");
                rh     = NumArr(daily, "relative_humidity_2m_max");
                code   = daily.GetProperty("weathercode").EnumerateArray()
                             .Select(e => e.ValueKind == JsonValueKind.Null ? 0 : e.GetInt32()).ToArray();
            }
            catch (Exception)
            {
                throw new Exception("Could not read the weather forecast. Please try again later.");
            }

            // ---- herd context ----
            var herd = await _context.Livestocks.Where(l => l.UserId == userId).ToListAsync();
            int dairy = herd.Count(l => IsDairy(l.Species));
            int young = herd.Count(l => l.Age <= 1);
            string herdSummary = herd.Count == 0
                ? "No livestock registered yet — add animals to get herd-specific advice."
                : $"{herd.Count} animal{(herd.Count == 1 ? "" : "s")}" +
                  (dairy > 0 ? $", {dairy} dairy" : "") +
                  (young > 0 ? $", {young} young (≤1 yr)" : "");

            var alerts = new List<WeatherAlert>();

            // ---- 1. heatwave / heat stress (next 3 days) ----
            int heatIdx = PeakIndex(tmax, 3);
            if (heatIdx >= 0 && tmax[heatIdx] >= 40)
            {
                alerts.Add(new WeatherAlert
                {
                    Severity = "critical", Type = "heatwave", Date = dates[heatIdx],
                    Title = $"🔥 Heatwave {When(heatIdx)} — {tmax[heatIdx]:F0}°C",
                    Message = $"Peak of {tmax[heatIdx]:F0}°C expected {PrettyDate(dates[heatIdx])}. " +
                              "Provide extra drinking water, shift feeding to early morning/evening, and ensure shade. " +
                              (dairy > 0 ? $"Watch your {dairy} dairy animal(s) for heat stress — panting, drooling or a drop in milk. " : "") +
                              "Avoid transporting animals during midday heat."
                });
            }
            else if (heatIdx >= 0 && tmax[heatIdx] >= 35)
            {
                alerts.Add(new WeatherAlert
                {
                    Severity = "warning", Type = "heat", Date = dates[heatIdx],
                    Title = $"🌡️ High heat {When(heatIdx)} — {tmax[heatIdx]:F0}°C",
                    Message = $"Temperature reaching {tmax[heatIdx]:F0}°C {PrettyDate(dates[heatIdx])}. " +
                              "Keep fresh water available all day and watch for early signs of heat stress, " +
                              (young > 0 ? "especially in young animals. " : "particularly at midday. ")
                });
            }

            // ---- 2. heavy rain → foot-rot risk (next 4 days) ----
            int rainIdx = PeakIndex(precip, 4);
            if (rainIdx >= 0 && precip[rainIdx] >= 30)
            {
                alerts.Add(new WeatherAlert
                {
                    Severity = "warning", Type = "rain", Date = dates[rainIdx],
                    Title = $"🌧️ Heavy rain {When(rainIdx)} — {precip[rainIdx]:F0} mm",
                    Message = $"About {precip[rainIdx]:F0} mm of rain expected {PrettyDate(dates[rainIdx])}. " +
                              "Foot-rot risk rises in wet, muddy sheds: ensure drainage, keep bedding dry, " +
                              "and check hooves in the days after the rain."
                });
            }
            else if (rainIdx >= 0 && precip[rainIdx] >= 10)
            {
                alerts.Add(new WeatherAlert
                {
                    Severity = "info", Type = "rain", Date = dates[rainIdx],
                    Title = $"🌦️ Moderate rain {When(rainIdx)} — {precip[rainIdx]:F0} mm",
                    Message = $"Around {precip[rainIdx]:F0} mm expected {PrettyDate(dates[rainIdx])}. " +
                              "Make sure sheds don't get waterlogged."
                });
            }

            // ---- 3. humidity spike → disease-conducive conditions ----
            int humidDays = 0;
            for (int i = 0; i < 7 && rh[i] >= 85; i++) humidDays++;
            if (humidDays >= 2)
            {
                alerts.Add(new WeatherAlert
                {
                    Severity = "warning", Type = "humidity", Date = dates[0],
                    Title = $"💧 Humid spell — {humidDays} days above 85% humidity",
                    Message = "Prolonged high humidity breeds foot-rot, mastitis and skin infections. " +
                              "Keep sheds ventilated and dry, change bedding often, " +
                              "and inspect udders and hooves daily during this spell."
                });
            }

            // ---- 4. thunderstorm (next 3 days) ----
            int stormIdx = -1;
            for (int i = 0; i < 3; i++)
                if (code[i] == 95 || code[i] == 96 || code[i] == 99) { stormIdx = i; break; }
            if (stormIdx >= 0)
            {
                alerts.Add(new WeatherAlert
                {
                    Severity = "critical", Type = "storm", Date = dates[stormIdx],
                    Title = $"⛈️ Thunderstorm {When(stormIdx)}",
                    Message = $"Thunderstorms forecast {PrettyDate(dates[stormIdx])}. " +
                              "Keep animals indoors/secured, check shed roofing and fencing, " +
                              "and stay clear of open fields and tall trees with the herd."
                });
            }

            // ---- 5. cold snap (next 3 days) ----
            int coldIdx = -1;
            for (int i = 0; i < 3; i++)
                if (!double.IsNaN(tmin[i]) && tmin[i] <= 5) { coldIdx = i; break; }
            if (coldIdx >= 0)
            {
                alerts.Add(new WeatherAlert
                {
                    Severity = "warning", Type = "cold", Date = dates[coldIdx],
                    Title = $"🥶 Cold snap {When(coldIdx)} — {tmin[coldIdx]:F0}°C",
                    Message = $"Night temperature dropping to {tmin[coldIdx]:F0}°C {PrettyDate(dates[coldIdx])}. " +
                              "Provide warm, draft-free bedding" +
                              (young > 0 ? $" — your {young} young animal(s) are most vulnerable to cold stress. " : ". ") +
                              "Increase evening feed slightly to help animals stay warm."
                });
            }

            // ---- all clear ----
            if (alerts.Count == 0)
            {
                alerts.Add(new WeatherAlert
                {
                    Severity = "info", Type = "clear", Date = dates[0],
                    Title = "✅ No weather threats for your herd",
                    Message = "The next 7 days look safe — no heatwave, heavy rain, storms or cold snaps in the forecast. Normal routine is fine."
                });
            }

            var order = new Dictionary<string, int> { ["critical"] = 0, ["warning"] = 1, ["info"] = 2 };
            alerts = alerts.OrderBy(a => order[a.Severity]).ToList();

            var forecast = new List<DailyForecast>();
            for (int i = 0; i < dates.Length; i++)
                forecast.Add(new DailyForecast
                {
                    Date = dates[i], TMax = tmax[i], TMin = tmin[i],
                    Precip = precip[i], RhMax = rh[i], Code = code[i]
                });

            return new WeatherAlertsResponse
            {
                LocationName = string.IsNullOrWhiteSpace(locationName) ? "My farm" : locationName,
                HerdSummary = herdSummary,
                Alerts = alerts,
                Forecast = forecast,
                CheckedAt = DateTime.Now.ToString("dd MMM yyyy, hh:mm tt")
            };
        }

        // ---------- helpers ----------

        private static bool IsDairy(string? species)
        {
            var s = (species ?? "").ToLower();
            return s.Contains("cow") || s.Contains("buffalo") || s.Contains("गाय") || s.Contains("म्हैस");
        }

        private static string[] StrArr(JsonElement daily, string name) =>
            daily.GetProperty(name).EnumerateArray()
                 .Select(e => e.ValueKind == JsonValueKind.Null ? "" : e.GetString() ?? "").ToArray();

        private static double[] NumArr(JsonElement daily, string name) =>
            daily.GetProperty(name).EnumerateArray()
                 .Select(e => e.ValueKind == JsonValueKind.Null ? double.NaN : e.GetDouble()).ToArray();

        private static int PeakIndex(double[] arr, int days)
        {
            int idx = -1; double best = double.NaN;
            for (int i = 0; i < Math.Min(days, arr.Length); i++)
                if (!double.IsNaN(arr[i]) && (idx < 0 || arr[i] > best)) { best = arr[i]; idx = i; }
            return idx;
        }

        private static string When(int idx) =>
            idx == 0 ? "today" : idx == 1 ? "tomorrow" : $"in {idx} days";

        private static string PrettyDate(string yyyyMMdd)
        {
            if (DateTime.TryParse(yyyyMMdd, out var d))
            {
                var today = DateTime.Today;
                if (d.Date == today) return "today";
                if (d.Date == today.AddDays(1)) return "tomorrow";
                return "on " + d.ToString("dddd, d MMM");
            }
            return "on " + yyyyMMdd;
        }
    }
}
