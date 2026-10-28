import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Feedback } from '../models/feedback.model';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  private baseUrl = 'http://localhost:8080/api/feedback';

  constructor(private http: HttpClient) { }

  //Common method to add Authorization header
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // POST: /api/feedback
  addFeedback(feedback: Feedback): Observable<any> {
    return this.http.post(
      this.baseUrl,
      feedback,
      {
        headers: this.getHeaders(),
        responseType: 'text'
      }
    );
  }

  // GET: /api/feedback
  getFeedbacks(): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(
      this.baseUrl,
      { headers: this.getHeaders() }
    );
  }

  // GET: /api/feedback/user/{userId}
  getFeedbacksByUserId(userId: number): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(
      `${this.baseUrl}/user/${userId}`,
      { headers: this.getHeaders() }
    );
  }

  // DELETE: /api/feedback/{feedbackId}
  deleteFeedback(feedbackId: number): Observable<any> {
    return this.http.delete(
      `${this.baseUrl}/${feedbackId}`,
      { headers: this.getHeaders(), responseType: 'text' as 'json' }
    );
  }
}