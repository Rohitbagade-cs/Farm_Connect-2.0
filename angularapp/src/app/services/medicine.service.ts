
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Medicine } from '../models/medicine.model';

@Injectable({
  providedIn: 'root'
})
export class MedicineService {

  public apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  // Add medicine 
  addMedicine(requestObject: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/api/Medicine`,
      requestObject,
      {
        headers: this.getHeaders(),
        responseType: 'text' as 'json'
      }
    );
  }

  // Get all medicines
  getAllMedicine(): Observable<Medicine[]> {
    return this.http.get<Medicine[]>(
      `${this.apiUrl}/api/Medicine`,
      { headers: this.getHeaders() }
    );
  }

  // Get medicines by userId
  getMedicineByUserID(id: number): Observable<Medicine[]> {
    return this.http.get<Medicine[]>(
      `${this.apiUrl}/api/Medicine/user/${id}`,
      { headers: this.getHeaders() }
    );
  }

  // Get medicine by id (NUMBER)
  getMedicineById(id: number): Observable<Medicine> {
    return this.http.get<Medicine>(
      `${this.apiUrl}/api/Medicine/${id}`,
      { headers: this.getHeaders() }
    );
  }

  // Update medicine
  updateMedicine(id: number, requestObject: any): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/api/Medicine/${id}`,
      requestObject,
      {
        headers: this.getHeaders(),
        responseType: 'text' as 'json'
      }
    );
  }

  // Delete medicine 
  deleteMedicine(id: number): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/api/Medicine/${id}`,
      {
        headers: this.getHeaders(),
        responseType: 'text' as 'json'
      }
    );
  }

  // How many requests reference a medicine (to explain blocked deletes)
  getMedicineRequestCount(medicineId: number): Observable<number> {
    return this.http.get<{ medicineId: number; requestCount: number }>(
      `${this.apiUrl}/api/Medicine/${medicineId}/request-count`,
      { headers: this.getHeaders() }
    ).pipe(map(res => res?.requestCount ?? 0));
  }
}
