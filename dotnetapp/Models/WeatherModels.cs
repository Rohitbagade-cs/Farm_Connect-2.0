using System.Collections.Generic;

namespace dotnetapp.Models
{
    public class WeatherAlert
    {
        public string Severity { get; set; } = "info"; // "critical" | "warning" | "info"
        public string Type { get; set; } = "";        // "heatwave" | "heat" | "rain" | "humidity" | "storm" | "cold" | "clear"
        public string Title { get; set; } = "";
        public string Message { get; set; } = "";
        public string Date { get; set; } = "";        // yyyy-MM-dd of the peak day
    }

    public class DailyForecast
    {
        public string Date { get; set; } = "";
        public double TMax { get; set; }
        public double TMin { get; set; }
        public double Precip { get; set; }
        public double RhMax { get; set; }
        public int Code { get; set; }
    }

    public class WeatherAlertsResponse
    {
        public string LocationName { get; set; } = "";
        public string HerdSummary { get; set; } = "";
        public List<WeatherAlert> Alerts { get; set; } = new();
        public List<DailyForecast> Forecast { get; set; } = new();
        public string CheckedAt { get; set; } = "";
    }
}
