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
  private BACKEND_API_URL = 'http://localhost:8080/api/chatbot/gemini';
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

    const requestBody = {
      contents: [{ parts: [{ text: fullPrompt }] }],
      generationConfig: {
        temperature,
        topP,
        maxOutputTokens,
        stopSequences,
      },
    };
    return this.http.post<any>(this.BACKEND_API_URL, requestBody).pipe(
      map((response) => {
        const text = response?.candidates?.[0]?.content?.parts?.[0]?.text;
        return text ? this.cleanResponse(text) : '';
      })
    );
  }

  cleanResponse(text: string): string {
    return text
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/#+\s?/g, '')
      .trim();
  }
}
