import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ChatMessage {
  role: string;   // 'user' | 'assistant'
  content: string;
}

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private apiUrl = 'http://localhost:8080/api/ai';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (token) headers = headers.set('Authorization', `Bearer ${token}`);
    return headers;
  }

  /** 1. Conversational farm assistant */
  chat(messages: ChatMessage[]): Observable<{ reply: string }> {
    return this.http.post<{ reply: string }>(
      `${this.apiUrl}/chat`, { messages }, { headers: this.getHeaders() });
  }

  /** 2. Symptom checker */
  symptomCheck(species: string, symptoms: string): Observable<{ result: string }> {
    return this.http.post<{ result: string }>(
      `${this.apiUrl}/symptom-check`, { species, symptoms }, { headers: this.getHeaders() });
  }

  /** 3. Feed recommender */
  feedRecommend(species: string, age: number, breed: string, goal: string): Observable<{ result: string }> {
    return this.http.post<{ result: string }>(
      `${this.apiUrl}/feed-recommend`, { species, age, breed, goal }, { headers: this.getHeaders() });
  }

  /** 4. Product description generator (for suppliers) */
  generateDescription(productName: string, category: string, keyPoints: string): Observable<{ description: string }> {
    return this.http.post<{ description: string }>(
      `${this.apiUrl}/generate-description`, { productName, category, keyPoints }, { headers: this.getHeaders() });
  }

  /** 5. Boli AI voice chat — spoken-style reply in the farmer's language */
  voiceChat(text: string, language: string): Observable<{ reply: string }> {
    return this.http.post<{ reply: string }>(
      `${this.apiUrl}/voice-chat`, { text, language }, { headers: this.getHeaders() });
  }
}
