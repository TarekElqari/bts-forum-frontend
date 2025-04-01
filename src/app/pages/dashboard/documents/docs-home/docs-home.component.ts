import { Component } from '@angular/core';
import { DocumentListComponent } from '../document-list/document-list.component';
import { DocumentUploadComponent } from '../document-upload-modal/document-upload-modal.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-document',
  standalone: true,
  imports: [DocumentListComponent, DocumentUploadComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './docs-home.component.html',
  styleUrl: './docs-home.component.css'
})
export class DocsHome {
  activeView: 'list' | 'upload' | null = null;

  setActiveView(view: 'list' | 'upload') {
    this.activeView = view;
  }
  
}
