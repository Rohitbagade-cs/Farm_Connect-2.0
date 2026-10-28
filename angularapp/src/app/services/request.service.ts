
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Request } from '../models/request.model';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  private baseUrl = 'http://localhost:8080/api/request';

  constructor(private http: HttpClient) {}

  // Common method to get Authorization headers
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }


  getAllRequests(): Observable<Request[]> {
    return this.http.get<Request[]>(
      `${this.baseUrl}`,
      { headers: this.getAuthHeaders() }
    );
  }

  addRequest(request: Request): Observable<Request> {
    return this.http.post<Request>(
      `${this.baseUrl}`,
      request,
      { headers: this.getAuthHeaders(), responseType: 'text' as 'json' }
    );
  }


  getRequestsByUserId(userId: string): Observable<Request[]> {
    return this.http.get<Request[]>(
      `${this.baseUrl}/user/${userId}`,
      { headers: this.getAuthHeaders() }
    );
  }


  deleteRequest(requestId: string): Observable<any> {
    return this.http.delete(
      `${this.baseUrl}/${requestId}`,
      { headers: this.getAuthHeaders() }
    );
  }

  getRequestByMedicineOrFeedUserId(userId: number): Observable<Request[]> {
    return this.http.get<Request[]>(
      `${this.baseUrl}/user/${userId}/medicines-or-feeds`,
      { headers: this.getAuthHeaders() }
    );
  }

  updateRequestStatus(requestId: number, payload: any): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/${requestId}`,
      payload,
      { headers: this.getAuthHeaders(), responseType: 'text' as 'json'  }
    );
  }
}