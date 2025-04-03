import { Component, OnInit } from '@angular/core';
import { DocumentListComponent } from '../document-list/document-list.component';
import { DocumentUploadComponent } from '../document-upload-modal/document-upload-modal.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Matiere } from '../../../../models/shared-models/Matiere.model';
import { MatiereService } from '../../../../services/matiere.service';

@Component({
  selector: 'app-document',
  standalone: true,
  imports: [DocumentListComponent, DocumentUploadComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './docs-home.component.html',
  styleUrl: './docs-home.component.css'
})
export class DocsHome implements OnInit {
  activeView: 'list' | 'upload' | null = null;
  matieres: Matiere[] = [];

  constructor(private matiereService: MatiereService) {}

  ngOnInit(): void {
    this.loadMatieres();
  }

  loadMatieres() {
    this.matiereService.getAllMatieres().subscribe({
      next: (data) => {
        this.matieres = data.sort((a, b) => {
          if (a.niveau !== b.niveau) {
            return a.niveau.localeCompare(b.niveau);
          }
          return a.name.localeCompare(b.name);
        });
      },
      error: (err) => console.error('Erreur chargement matières', err)
    });
  }

  setActiveView(view: 'list' | 'upload') {
    this.activeView = view;
  }
}
