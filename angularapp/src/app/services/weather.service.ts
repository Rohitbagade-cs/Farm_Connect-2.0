import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface WeatherAlert {
  severity: 'critical' | 'warning' | 'info';
  type: string;
  title: string;
  message: string;
  date: string;
}

export interface DailyForecast {
  date: string;
  tMax: number;
  tMin: number;
  precip: number;
  rhMax: number;
  code: number;
}

export interface WeatherAlertsResponse {
  locationName: string;
  herdSummary: string;
  alerts: WeatherAlert[];
  forecast: DailyForecast[];
  checkedAt: string;
}

export interface GeoResult {
  name: string;
  latitude: number;
  longitude: number;
  admin1?: string;
  country?: string;
}

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiUrl = 'http://localhost:8080/api/weather';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (token) headers = headers.set('Authorization', `Bearer ${token}`);
    return headers;
  }

  /** MonsoonGuard alerts for the owner's herd at the given farm location */
  getAlerts(userId: number, lat: number, lon: number, location: string): Observable<WeatherAlertsResponse> {
    const params = new HttpParams()
      .set('userId', userId)
      .set('lat', lat)
      .set('lon', lon)
      .set('location', location);
    return this.http.get<WeatherAlertsResponse>(`${this.apiUrl}/alerts`,
      { headers: this.getHeaders(), params });
  }

  /** Free Open-Meteo geocoding — no API key needed */
  searchLocation(query: string): Observable<GeoResult[]> {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`;
    return this.http.get<{ results?: GeoResult[] }>(url)
      .pipe(map(res => res?.results ?? []));
  }

  /** Free reverse-geocode for the GPS "use my location" button — no API key needed */
  reverseGeocode(lat: number, lon: number): Observable<string> {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
    return this.http.get<{ city?: string; locality?: string }>(url).pipe(
      map(res => res?.city || res?.locality || 'Current location')
    );
  }

  /** Weather-code → emoji for the 7-day strip */
  codeEmoji(code: number): string {
    if (code === 0) return '☀️';
    if (code === 1) return '🌤️';
    if (code === 2) return '⛅';
    if (code === 3) return '☁️';
    if (code === 45 || code === 48) return '🌫️';
    if (code >= 51 && code <= 57) return '🌦️';
    if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return '🌧️';
    if ((code >= 71 && code <= 77) || code === 85 || code === 86) return '🌨️';
    if (code >= 95) return '⛈️';
    return '🌤️';
  }
}
