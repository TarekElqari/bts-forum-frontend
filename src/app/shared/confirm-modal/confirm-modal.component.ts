import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports:[CommonModule, ReactiveFormsModule],
  template: `
    <div *ngIf="visible" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-300 bg-opacity-50">
      <div class="relative p-4 w-full max-w-md">
        <div class="relative bg-white rounded-lg shadow">
          <button type="button" 
                  (click)="onCancel()"
                  class="absolute top-3 end-2.5 text-gray-400 hover:text-gray-900 rounded-lg text-sm w-8 h-8 flex justify-center items-center">
            <i class="fas fa-times"></i>
          </button>
          <div class="p-4 md:p-5 text-center">
            <i class="fas fa-exclamation-triangle text-4xl text-yellow-500 mb-4"></i>
            <h3 class="text-lg font-normal text-gray-500 mb-5">{{ message }}</h3>
            <div class="flex justify-center gap-4">
              <button (click)="onConfirm()" 
                      class="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5">
                Oui, confirmer
              </button>
              <button (click)="onCancel()" 
                      class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900">
                Non, annuler
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class ConfirmModalComponent {
  @Input() visible = false;
  @Input() message = 'Êtes-vous sûr de vouloir effectuer cette action ?';
  @Output() confirmed = new EventEmitter<boolean>();

  onConfirm() {
    this.confirmed.emit(true);
    this.visible = false;
  }

  onCancel() {
    this.confirmed.emit(false);
    this.visible = false;
  }
}