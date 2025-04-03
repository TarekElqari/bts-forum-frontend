import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { PROMPTS, PromptMode } from '../chat/prompts';

interface GeminiResponse {
  candidates?: [{
    content?: {
      parts?: [{
        text?: string;
      }];
    };
  }];
}

interface GeminiRequest {
  contents: [{ parts: [{ text: string }] }];
  generationConfig?: {
    temperature?: number;
    topP?: number;
    topK?: number;
    maxOutputTokens?: number;
    stopSequences?: string[];
  };
}

@Injectable({
  providedIn: 'root',
})
export class GeminiService {
  private API_URL =
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
  //private API_KEY = 'AIzaSyCpQcIm1S2iI31rdtSDG0erDov0QkztHY0';

  constructor(private http: HttpClient) {}

  sendMessage(
    userMessage: string,
    mode: PromptMode = 'default',
    temperature: number = 0.7,
    topP: number = 0.8,
    maxOutputTokens: number = 200,
    stopSequences: string[] = []
  ): Observable<string> {
    const fullPrompt = PROMPTS[mode] + '\n\nQuestion : ' + userMessage;

    const requestBody: GeminiRequest = {
      contents: [{ parts: [{ text: fullPrompt }] }],
      generationConfig: {
        temperature: temperature,
        topP: topP,
        maxOutputTokens: maxOutputTokens,
        stopSequences: stopSequences,
      },
    };

    return this.http.post<GeminiResponse>(this.API_URL, requestBody, {
      headers: {
        'Content-Type': 'application/json',
      },
    }).pipe(
      map((response: GeminiResponse) => { // Ajout du type GeminiResponse ici
        const text = response.candidates?.[0]?.content?.parts?.[0]?.text;
        return text ? this.cleanResponse(text) : '';
      })
    );
  }

  cleanResponse(text: string): string {
    return text
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove **
      .replace(/\*(.*?)\*/g, '$1')   // Remove *
      .replace(/#+\s?/g, '')         // Remove Markdown titles
      .trim();
  }
}