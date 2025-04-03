import { Component, ViewChild, ElementRef, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { DocumentService } from '../../../../services/document.service';
import { AuthService } from '../../../../services/auth.service';
import { Matiere } from '../../../../models/shared-models/Matiere.model';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-document-upload',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgSelectModule],
  templateUrl: './document-upload-modal.component.html',
})
export class DocumentUploadComponent {
  @Input() matieres: Matiere[] = [];
  file?: File;
  tagsInput: string = '';
  description: string = '';
  matiere: string = '';
  type: string = '';
  customMatiere: string = '';
  customType: string = '';
  showCustomMatiere: boolean = false;
  showCustomType: boolean = false;
  niveaux: string[] = ['TC_1ERE_ANNEE', 'TC_2EME_ANNEE'];
  selectedNiveau: string = '';
  filteredMatieres: Matiere[] = [];
  selectedMatiereId: string = '';

  onNiveauChange() {
    this.filteredMatieres = this.matieres.filter(m => m.niveau === this.selectedNiveau);
    this.selectedMatiereId = '';
    this.customMatiere = '';
    this.showCustomMatiere = false;
  }
  types: string[] = [
    'Cours',
    'Examen',
    'Exercice corrigé',
    'Rapport de stage',
    'TD',
    'TP',
    'Autre',
  ].sort((a, b) => {
    if (a === 'Autre') return 1;
    if (b === 'Autre') return -1;
    return a.localeCompare(b);
  });

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(
    private documentService: DocumentService,
    private authService: AuthService
  ) {}

  onMatiereChange() {
    this.showCustomMatiere = this.matiere === 'Autre';
    if (!this.showCustomMatiere) this.customMatiere = '';
  }

  onTypeChange() {
    this.showCustomType = this.type === 'Autre';
    if (!this.showCustomType) this.customType = '';
  }

  // DRAG & DROP EVENTS
  onDragOver(event: DragEvent) {
    event.preventDefault();
    const target = event.currentTarget as HTMLElement;
    target.classList.add('border-teal-600', 'bg-teal-50');
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    const target = event.currentTarget as HTMLElement;
    target.classList.remove('border-teal-600', 'bg-teal-50');
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    const target = event.currentTarget as HTMLElement;
    target.classList.remove('border-teal-600', 'bg-teal-50');

    if (event.dataTransfer?.files.length) {
      this.file = event.dataTransfer.files[0];
    }
  }

  // CLICK TO SELECT
  triggerFileSelect(): void {
    this.fileInput?.nativeElement?.click();
  }

  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length) {
      this.file = target.files[0];
    }
  }

  // REMOVE FILE
  removeFile() {
    this.file = undefined;
    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
  }

  // UPLOAD DOCUMENT
  upload(): void {
    const userId = this.authService.getUserInfo('userId');
    const tags = this.tagsInput.split(',').map(t => t.trim()).filter(t => !!t);
    const finalType = this.showCustomType ? this.customType : this.type;
    
    let finalMatiere = '';
    let niveau = '';
  
    if (this.showCustomMatiere) {
      finalMatiere = this.customMatiere;
      niveau = this.selectedNiveau;
    } else {
      const selectedMatiere = this.filteredMatieres.find(m => m.id === +this.selectedMatiereId);
      if (selectedMatiere) {
        finalMatiere = selectedMatiere.name;
        niveau = selectedMatiere.niveau;
      }
    }
  
    if (!this.file || !userId || !tags.length || !finalMatiere || !finalType || !niveau) {
      Swal.fire({
        icon: 'error',
        title: 'Champs manquants',
        text: 'Veuillez remplir tous les champs obligatoires',
        confirmButtonColor: '#0e7490',
      });
      return;
    }
  
    this.documentService.uploadDocument(
      this.file, 
      tags, 
      this.description, 
      userId.toString(), 
      finalMatiere, 
      finalType,
      niveau
    ).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Document uploadé!',
          text: 'Votre document a été ajouté avec succès',
          confirmButtonColor: '#0e7490',
        });
        this.resetForm();
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Une erreur est survenue lors de l\'upload',
          confirmButtonColor: '#0e7490',
        });
      }
    });
  }
  

  private resetForm() {
    this.file = undefined;
    this.tagsInput = '';
    this.description = '';
    this.matiere = '';
    this.type = '';
    this.customMatiere = '';
    this.customType = '';
    this.showCustomMatiere = false;
    this.showCustomType = false;
    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
  }
}
