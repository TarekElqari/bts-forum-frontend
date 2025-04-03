import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GeminiService } from '../../services/gemini.service';
import { PromptMode, PROMPTS } from '../../chat/prompts';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.css'
})
export class ChatbotComponent implements OnInit, OnDestroy {
  userMessage = '';
  selectedMode: PromptMode = 'default';
  isGenerating = false;
  typingInterval: any;
  lastUserMessage: string | null = null;
  temperature: number = 0.7;
  topP: number = 0.8;
  maxOutputTokens: number = 200;
  stopSequences: string[] = [];
  availableModes = Object.keys(PROMPTS) as PromptMode[];
  private ngUnsubscribe = new Subject<void>();

  messages: any[] = [
    {
      sender: 'bot',
      content: PROMPTS['default'].split('\n')[1].trim(), // Utilisez la première phrase du prompt par défaut
      displayedContent: PROMPTS['default'].split('\n')[1].trim()
    }
  ];

  constructor(private geminiService: GeminiService) {}

  ngOnInit(): void {
    this.scrollToBottom();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    if (this.typingInterval) {
      clearInterval(this.typingInterval);
    }
  }

  sendMessage() {
    if (!this.userMessage.trim() || this.isGenerating) return;

    this.messages.push({ sender: 'user', content: this.userMessage, displayedContent: this.userMessage });
    const message = this.userMessage;
    this.lastUserMessage = message;
    this.userMessage = '';
    this.isGenerating = true;

    this.geminiService.sendMessage(message, this.selectedMode, this.temperature, this.topP, this.maxOutputTokens, this.stopSequences)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (reply) => {
          this.simulateTyping(reply);
        },
        error: (err) => {
          this.isGenerating = false;
          this.messages.push({
            sender: 'bot',
            content: '⚠️ Erreur API : ' + err.message,
            displayedContent: '⚠️ Erreur API : ' + err.message
          });
          this.scrollToBottom();
        }
      });
  }

  simulateTyping(fullText: string) {
    let index = 0;
    const speed = 20; // Ajustez la vitesse de frappe ici
    const botMessage = { sender: 'bot', content: fullText, displayedContent: '' };
    this.messages.push(botMessage);

    this.typingInterval = setInterval(() => {
      if (index < fullText.length) {
        botMessage.displayedContent += fullText.charAt(index);
        index++;
        this.scrollToBottom();
      } else {
        clearInterval(this.typingInterval);
        this.isGenerating = false;
        this.scrollToBottom();
      }
    }, speed);
  }

  stopGeneration() {
    if (this.typingInterval) {
      clearInterval(this.typingInterval);
      this.isGenerating = false;
      const lastBotMessage = [...this.messages].reverse().find(m => m.sender === 'bot');
      if (lastBotMessage) {
        lastBotMessage.displayedContent = lastBotMessage.content;
      }
      this.scrollToBottom();
    }
  }

  regenerate() {
    if (this.lastUserMessage) {
      this.userMessage = this.lastUserMessage;
      this.sendMessage();
    }
  }

  clearConversation() {
    this.messages = [
      {
        sender: 'bot',
        content: PROMPTS['default'].split('\n')[1].trim(),
        displayedContent: PROMPTS['default'].split('\n')[1].trim()
      }
    ];
  }

  copyMessage(message: string) {
    navigator.clipboard.writeText(message).then(() => {
      console.log('Réponse copiée dans le presse-papiers');
    }).catch(err => {
      console.error('Erreur lors de la copie dans le presse-papiers : ', err);
    });
  }

  scrollToBottom() {
    setTimeout(() => {
      const chatContainer = document.querySelector('#chatContainer');
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }, 50); // Réduisez légèrement le délai si nécessaire
  }
}