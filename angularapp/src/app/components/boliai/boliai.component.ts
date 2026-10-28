import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AiService } from '../../services/ai.service';

interface BoliTurn { question: string; answer: string; }
interface BoliLang { id: string; label: string; recog: string; tts: string; }

@Component({
  selector: 'app-boliai',
  templateUrl: './boliai.component.html',
  styleUrls: ['./boliai.component.css']
})
export class BoliaiComponent implements OnDestroy {
  langs: BoliLang[] = [
    { id: 'hindi',    label: 'हिंदी',   recog: 'hi-IN', tts: 'hi-IN' },
    { id: 'marathi',  label: 'मराठी',   recog: 'mr-IN', tts: 'mr-IN' },
    { id: 'hinglish', label: 'Hinglish', recog: 'hi-IN', tts: 'hi-IN' },
  ];
  lang: BoliLang = this.langs[0];

  supported = typeof window !== 'undefined' &&
    (!!(window as any).SpeechRecognition || !!(window as any).webkitSpeechRecognition);
  ttsSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  state: 'idle' | 'listening' | 'thinking' | 'speaking' = 'idle';
  interim = '';
  errorMsg = '';
  turns: BoliTurn[] = [];

  private recog: any = null;
  private pending: Subscription | null = null;
  private voices: SpeechSynthesisVoice[] = [];

  constructor(private ai: AiService) {
    if (this.ttsSupported) {
      this.loadVoices();
      speechSynthesis.onvoiceschanged = () => this.loadVoices();
    }
  }

  ngOnDestroy(): void { this.stopAll(); }

  get statusText(): string {
    switch (this.state) {
      case 'listening': return '🎙️ Listening… speak now / बोलिए';
      case 'thinking':  return '🤔 Thinking… / सोच रही हूँ';
      case 'speaking':  return '🔊 Speaking… / जवाब सुनिए';
      default:          return 'Tap the mic and speak / माइक दबाकर बोलिए';
    }
  }

  selectLang(l: BoliLang): void {
    if (this.lang.id === l.id) return;
    this.stopAll();
    this.lang = l;
  }

  toggleMic(): void {
    if (this.state === 'thinking') return;
    if (this.state === 'listening') { this.stopListening(); return; }
    this.startListening();
  }

  private loadVoices(): void {
    try { this.voices = speechSynthesis.getVoices(); } catch { this.voices = []; }
  }

  private startListening(): void {
    this.stopSpeaking();
    this.errorMsg = '';
    this.interim = '';
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { this.errorMsg = 'Voice input is not supported in this browser.'; return; }
    this.recog = new SR();
    this.recog.lang = this.lang.recog;
    this.recog.interimResults = true;
    this.recog.continuous = false;
    this.recog.maxAlternatives = 1;

    this.recog.onresult = (e: any) => {
      let interimTxt = '';
      let finalTxt = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) finalTxt += t; else interimTxt += t;
      }
      this.interim = (finalTxt || interimTxt).trim();
      if (finalTxt.trim()) {
        this.stopListening();
        this.askBoli(finalTxt.trim());
      }
    };
    this.recog.onerror = (e: any) => {
      this.state = 'idle';
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed')
        this.errorMsg = 'Microphone is blocked — allow mic access in the browser address bar and try again.';
      else if (e.error === 'no-speech')
        this.errorMsg = 'Could not hear you — speak a little louder and closer to the mic.';
      else
        this.errorMsg = 'Listening failed. Please try again.';
    };
    this.recog.onend = () => { if (this.state === 'listening') this.state = 'idle'; };

    try {
      this.recog.start();
      this.state = 'listening';
    } catch {
      this.state = 'idle';
    }
  }

  private stopListening(): void {
    try { this.recog?.stop(); } catch { /* noop */ }
    this.recog = null;
    if (this.state === 'listening') this.state = 'idle';
  }

  private askBoli(text: string): void {
    this.state = 'thinking';
    this.errorMsg = '';
    this.pending?.unsubscribe();
    this.pending = this.ai.voiceChat(text, this.lang.id).subscribe({
      next: (res) => {
        const answer = (res?.reply || '').trim() || 'Sorry, I could not think of an answer.';
        this.turns.unshift({ question: text, answer });
        this.interim = '';
        this.speak(answer);
      },
      error: (err) => {
        console.error('Boli AI failed', err);
        this.state = 'idle';
        this.errorMsg = err?.error?.error || 'Boli AI is unavailable right now. Please try again.';
      }
    });
  }

  private speak(text: string): void {
    if (!this.ttsSupported) { this.state = 'idle'; return; }
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = this.lang.tts;
    const v = this.pickVoice();
    if (v) u.voice = v;
    u.rate = 0.95;
    u.onstart = () => { this.state = 'speaking'; };
    u.onend = () => { if (this.state === 'speaking') this.state = 'idle'; };
    u.onerror = () => { if (this.state === 'speaking') this.state = 'idle'; };
    speechSynthesis.speak(u);
  }

  private pickVoice(): SpeechSynthesisVoice | null {
    const prefix = this.lang.tts.split('-')[0].toLowerCase();
    return this.voices.find(v => (v.lang || '').toLowerCase().startsWith(prefix)) || null;
  }

  stopSpeaking(): void {
    if (this.ttsSupported) { try { speechSynthesis.cancel(); } catch { /* noop */ } }
    if (this.state === 'speaking') this.state = 'idle';
  }

  private stopAll(): void {
    this.pending?.unsubscribe();
    this.pending = null;
    this.stopListening();
    this.stopSpeaking();
    this.state = 'idle';
  }
}
