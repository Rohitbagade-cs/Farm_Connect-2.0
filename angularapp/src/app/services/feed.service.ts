import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Feed } from '../models/feed.model';
 
@Injectable({
  providedIn: 'root'
})
export class FeedService {
 
  public apiUrl = 'http://localhost:8080';
 
  constructor(private http: HttpClient) {}
 
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }
 
  // Add new feed
addFeed(requestObject: Feed): Observable<string> {
  return this.http.post(
    `${this.apiUrl}/api/feed`,
    requestObject,
    {
      headers: this.getHeaders(),
      responseType: 'text'
    }
  );
}
 
  // Get feed by user ID
  getFeedByUserID(id: number): Observable<Feed> {
    return this.http.get<Feed>(
      `${this.apiUrl}/api/feed/user/${id}`,
      { headers: this.getHeaders() }
    );
  }
 
  // Get feed by feed ID
  getFeedById(id: string): Observable<Feed> {
    return this.http.get<Feed>(
      `${this.apiUrl}/api/feed/${id}`,
      { headers: this.getHeaders() }
    );
  }
 
  // Get all feeds
  getAllFeed(): Observable<Feed[]> {
    return this.http.get<Feed[]>(
      `${this.apiUrl}/api/feed`,
      { headers: this.getHeaders() }
    );
  }

  // How many requests reference a feed (to explain blocked deletes)
  getFeedRequestCount(feedId: number): Observable<number> {
    return this.http.get<{ feedId: number; requestCount: number }>(
      `${this.apiUrl}/api/feed/${feedId}/request-count`,
      { headers: this.getHeaders() }
    ).pipe(map(res => res?.requestCount ?? 0));
  }
 
  
  deleteFeed(feedId: string): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/api/feed/${feedId}`,
      {
        headers: this.getHeaders(),
        responseType: 'text' as 'json'
      }
    );
  }

 
  // Update feed
  updateFeed(id: string, requestObject: Feed): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/api/feed/${id}`,
      requestObject,
      { headers: this.getHeaders(), responseType: 'text' as 'json' }
    );
  }

}