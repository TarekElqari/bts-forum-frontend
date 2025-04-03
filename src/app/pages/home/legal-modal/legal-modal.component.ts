import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-legal-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './legal-modal.component.html',
  styleUrls: ['./legal-modal.component.css'],
})
export class LegalModalComponent {
  @Input() content: 'privacy' | 'terms' | null = null;
  @Output() close = new EventEmitter<void>();
}
