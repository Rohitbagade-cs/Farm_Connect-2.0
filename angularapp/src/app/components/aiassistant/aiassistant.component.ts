import { Component } from '@angular/core';
import { AiService, ChatMessage } from '../../services/ai.service';

@Component({
  selector: 'app-aiassistant',
  templateUrl: './aiassistant.component.html',
  styleUrls: ['./aiassistant.component.css']
})
export class AiassistantComponent {
  activeTab: 'chat' | 'symptom' | 'feed' | 'describe' = 'chat';

  // Description Writer is a supplier tool (suppliers add feeds/medicines),
  // so the tab is only shown on the supplier dashboard.
  isSupplierUser = ['supplier', 'admin']
    .includes((localStorage.getItem('userRole') || '').toLowerCase());

  // ---- 1. Chat ----
  chatMessages: ChatMessage[] = [
    { role: 'assistant', content: 'Hello! I\'m your FarmConnect AI assistant. Ask me anything about livestock care, feeding, health or farm management.' }
  ];
  chatInput = '';
  chatLoading = false;

  // ---- 2. Symptom checker ----
  symptomSpecies = '';
  symptomText = '';
  symptomResult = '';
  symptomLoading = false;

  // ---- 3. Feed recommender ----
  feedSpecies = '';
  feedAge: number | null = null;
  feedBreed = '';
  feedGoal = '';
  feedResult = '';
  feedLoading = false;

  // ---- 4. Description generator ----
  productName = '';
  productCategory = 'Feed';
  keyPoints = '';
  descriptionResult = '';
  descriptionLoading = false;

  constructor(private ai: AiService) { }

  setTab(tab: 'chat' | 'symptom' | 'feed' | 'describe') {
    if (tab === 'describe' && !this.isSupplierUser) return; // supplier-only tab
    this.activeTab = tab;
  }

  // ---------- Chat ----------
  sendChat() {
    const text = this.chatInput.trim();
    if (!text || this.chatLoading) return;
    this.chatMessages.push({ role: 'user', content: text });
    this.chatInput = '';
    this.chatLoading = true;
    this.ai.chat(this.chatMessages).subscribe({
      next: res => {
        this.chatMessages.push({ role: 'assistant', content: res.reply });
        this.chatLoading = false;
      },
      error: () => {
        this.chatMessages.push({ role: 'assistant', content: 'Sorry, something went wrong. Please try again.' });
        this.chatLoading = false;
      }
    });
  }

  // ---------- Symptom checker ----------
  checkSymptoms() {
    if (!this.symptomSpecies.trim() || !this.symptomText.trim() || this.symptomLoading) return;
    this.symptomLoading = true;
    this.symptomResult = '';
    this.ai.symptomCheck(this.symptomSpecies.trim(), this.symptomText.trim()).subscribe({
      next: res => { this.symptomResult = res.result; this.symptomLoading = false; },
      error: () => { this.symptomResult = 'Something went wrong. Please try again.'; this.symptomLoading = false; }
    });
  }

  // ---------- Feed recommender ----------
  recommendFeed() {
    if (!this.feedSpecies.trim() || this.feedAge === null || this.feedLoading) return;
    this.feedLoading = true;
    this.feedResult = '';
    this.ai.feedRecommend(
      this.feedSpecies.trim(), this.feedAge, this.feedBreed.trim(), this.feedGoal.trim()
    ).subscribe({
      next: res => { this.feedResult = res.result; this.feedLoading = false; },
      error: () => { this.feedResult = 'Something went wrong. Please try again.'; this.feedLoading = false; }
    });
  }

  // ---------- Description generator ----------
  generateDescription() {
    if (!this.productName.trim() || this.descriptionLoading) return;
    this.descriptionLoading = true;
    this.descriptionResult = '';
    this.ai.generateDescription(
      this.productName.trim(), this.productCategory, this.keyPoints.trim()
    ).subscribe({
      next: res => { this.descriptionResult = res.description; this.descriptionLoading = false; },
      error: () => { this.descriptionResult = 'Something went wrong. Please try again.'; this.descriptionLoading = false; }
    });
  }

  copyDescription() {
    if (this.descriptionResult) {
      navigator.clipboard.writeText(this.descriptionResult);
    }
  }
}
