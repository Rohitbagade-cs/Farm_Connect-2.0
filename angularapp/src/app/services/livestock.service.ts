
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Livestock } from '../models/livestock.model';

@Injectable({
  providedIn: 'root'
})
export class LivestockService {
  private apiUrl = 'http://localhost:8080/api/livestock';

  constructor(private http: HttpClient) { }


  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (token) headers = headers.set('Authorization', `Bearer ${token}`);
    return headers;
  }

  getLivestockByUserID(id: number): Observable<Livestock> {
    return this.http.get<Livestock>(`${this.apiUrl}/user/${id}`, { headers: this.getHeaders() });
  }
  getAllLivestocks(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  getLivestockByID(id: number): Observable<Livestock> {
    return this.http.get<Livestock>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  addLivestock(livestock: Livestock): Observable<Livestock> {
    console.log(livestock);
    return this.http.post<Livestock>(this.apiUrl, livestock, { headers: this.getHeaders(), responseType: 'text' as 'json' });
  }


  updateLivestock(id: number, livestock: any): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/${id}`,
      livestock,
      {
        headers: this.getHeaders(),
        responseType: 'text'
      }
    );
  }

  deleteLivestock(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders(), responseType: 'text' as 'json' });
  }
}
