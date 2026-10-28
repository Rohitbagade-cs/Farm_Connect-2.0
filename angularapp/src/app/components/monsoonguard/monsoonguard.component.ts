import { Component, OnInit } from '@angular/core';
import { WeatherService, WeatherAlertsResponse, GeoResult } from '../../services/weather.service';

@Component({
  selector: 'app-monsoonguard',
  templateUrl: './monsoonguard.component.html',
  styleUrls: ['./monsoonguard.component.css']
})
export class MonsoonguardComponent implements OnInit {
  // farm location (persisted)
  hasLocation = false;
  locName = '';
  lat = 0;
  lon = 0;

  // setup state
  query = '';
  geoResults: GeoResult[] = [];
  searching = false;
  locating = false;

  // data state
  loading = false;
  errorMsg = '';
  data: WeatherAlertsResponse | null = null;

  constructor(private weather: WeatherService) { }

  ngOnInit(): void {
    const la = localStorage.getItem('mg_lat');
    const lo = localStorage.getItem('mg_lon');
    const nm = localStorage.getItem('mg_name');
    if (la && lo) {
      this.lat = parseFloat(la);
      this.lon = parseFloat(lo);
      this.locName = nm || 'My farm';
      this.hasLocation = true;
      this.loadAlerts();
    }
  }

  search(): void {
    const q = this.query.trim();
    if (q.length < 2) return;
    this.searching = true;
    this.geoResults = [];
    this.weather.searchLocation(q).subscribe({
      next: (res) => { this.geoResults = res; this.searching = false; },
      error: () => { this.searching = false; this.errorMsg = 'Place search failed. Check your internet and try again.'; }
    });
  }

  pick(r: GeoResult): void {
    const name = [r.name, r.admin1, r.country].filter(Boolean).join(', ');
    this.saveLocation(r.latitude, r.longitude, name);
  }

  useMyLocation(): void {
    if (!('geolocation' in navigator)) {
      this.errorMsg = 'GPS is not available on this device — search for your place instead.';
      return;
    }
    this.locating = true;
    this.errorMsg = '';
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const la = pos.coords.latitude, lo = pos.coords.longitude;
        this.weather.reverseGeocode(la, lo).subscribe({
          next: (name) => { this.locating = false; this.saveLocation(la, lo, name); },
          error: () => { this.locating = false; this.saveLocation(la, lo, 'Current location'); }
        });
      },
      () => {
        this.locating = false;
        this.errorMsg = 'Location permission denied — allow location access or search for your place.';
      },
      { timeout: 12000 }
    );
  }

  private saveLocation(la: number, lo: number, name: string): void {
    this.lat = la; this.lon = lo; this.locName = name;
    localStorage.setItem('mg_lat', String(la));
    localStorage.setItem('mg_lon', String(lo));
    localStorage.setItem('mg_name', name);
    this.hasLocation = true;
    this.geoResults = [];
    this.loadAlerts();
  }

  changeLocation(): void {
    this.hasLocation = false;
    this.data = null;
    this.query = '';
    this.geoResults = [];
  }

  refresh(): void {
    this.loadAlerts();
  }

  private loadAlerts(): void {
    const userId = parseInt(localStorage.getItem('userId') || '0', 10);
    if (!userId) {
      this.errorMsg = 'Could not identify the logged-in user. Please log in again.';
      return;
    }
    this.loading = true;
    this.errorMsg = '';
    this.weather.getAlerts(userId, this.lat, this.lon, this.locName).subscribe({
      next: (res) => { this.data = res; this.loading = false; },
      error: (err) => {
        console.error('MonsoonGuard failed', err);
        this.loading = false;
        this.errorMsg = err?.error?.error || 'Could not fetch the weather forecast. Please try again.';
      }
    });
  }

  emoji(code: number): string {
    return this.weather.codeEmoji(code);
  }

  dayLabel(date: string): string {
    const d = new Date(date + 'T00:00:00');
    if (isNaN(d.getTime())) return date;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const diff = Math.round((d.getTime() - today.getTime()) / 86400000);
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Tomorrow';
    return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' });
  }
}
