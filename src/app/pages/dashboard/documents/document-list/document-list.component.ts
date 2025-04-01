import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { DocumentDto } from '../../../../models/etudiant/document.model';
import { AuthService } from '../../../../services/auth.service';
import { DocumentService } from '../../../../services/document.service';
import { ConfirmModalComponent } from '../../../../shared/confirm-modal/confirm-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-document-list',
  standalone: true,
  imports: [CommonModule, ConfirmModalComponent, ReactiveFormsModule, FormsModule],
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit {
  allDocuments: DocumentDto[] = [];
  filteredDocuments: DocumentDto[] = [];
  searchQuery = '';
  selectedType = '';
  selectedMatiere = '';
  selectedTags: string[] = [];
  availableTypes: string[] = [];
  availableMatieres: string[] = [];
  availableTags: string[] = [];
  currentUserId: number | null = null;
  showDeleteModal = false;
  isDownloading = false;
  
  documentToDelete: number | null = null;
  

  constructor(
    private documentService: DocumentService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadDocuments();
    this.currentUserId = this.authService.getUserInfo('userId');
  }

  loadDocuments(): void {
    this.documentService.getAllDocuments().subscribe({
      next: (docs) => {
        this.allDocuments = docs;
        this.filteredDocuments = [...docs];
        this.extractFilterOptions();
      },
      error: (err) => console.error('Error loading documents', err)
    });
  }
  extractFilterOptions(): void {
    // Extract unique types
    this.availableTypes = [...new Set(this.allDocuments.map(doc => doc.type))].filter(t => t);
    
    // Extract unique matieres
    this.availableMatieres = [...new Set(this.allDocuments.map(doc => doc.matiere))].filter(m => m);
    
    // Extract unique tags
    const allTags = this.allDocuments.flatMap(doc => doc.tags);
    this.availableTags = [...new Set(allTags)].filter(t => t);
  }

  applyFilters(): void {
    this.filteredDocuments = this.allDocuments.filter(doc => {
      // Search filter
      const matchesSearch = !this.searchQuery || 
        doc.filename.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
        doc.description.toLowerCase().includes(this.searchQuery.toLowerCase());
      
      // Type filter
      const matchesType = !this.selectedType || doc.type === this.selectedType;
      
      // Matière filter
      const matchesMatiere = !this.selectedMatiere || doc.matiere === this.selectedMatiere;
      
      // Tags filter
      const matchesTags = this.selectedTags.length === 0 || 
        this.selectedTags.every(tag => doc.tags.includes(tag));
      
      return matchesSearch && matchesType && matchesMatiere && matchesTags;
    });
  }

  toggleTagFilter(tag: string): void {
    if (this.selectedTags.includes(tag)) {
      this.selectedTags = this.selectedTags.filter(t => t !== tag);
    } else {
      this.selectedTags = [...this.selectedTags, tag];
    }
    this.applyFilters();
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.selectedType = '';
    this.selectedMatiere = '';
    this.selectedTags = [];
    this.applyFilters();
  }

  downloadDocument(id: number): void {
    const doc = this.allDocuments.find(d => d.id === id);
    if (!doc) {
      this.showError('Erreur', 'Document introuvable.');
      return;
    }
  
    Swal.fire({
      title: 'Téléchargement en cours...',
      text: `Le document "${doc.filename}" est en cours de téléchargement`,
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  
    this.documentService.downloadDocument(id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = doc.filename;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
  

        setTimeout(() => {
          Swal.fire({
            icon: 'success',
            title: 'Téléchargement réussi',
            text: `Le document "${doc.filename}" a été téléchargé.`,
            timer: 1800,
            showConfirmButton: false
          });
        }, 1800);
      },
      error: (err) => {
        if (err.status !== 0) {
          this.showError('Téléchargement échoué', 'Impossible de télécharger le document. Il a peut-être été supprimé.');
        }
        Swal.close();
      },
      complete: () => {
        // Optionnel si tu veux fermer après un minimum de temps
        setTimeout(() => Swal.close(), 2000);
      }
    });
  }
  
  
  




  confirmDelete(id: number): void {
    this.documentToDelete = id;
    this.showDeleteModal = true;
  }

  handleDeleteConfirmation(confirmed: boolean): void {
    this.showDeleteModal = false;
    if (confirmed && this.documentToDelete) {
      this.deleteDocument(this.documentToDelete);
    }
    this.documentToDelete = null;
  }

  deleteDocument(id: number): void {
    this.documentService.deleteDocument(id).subscribe({
      next: () => {
        this.allDocuments = this.allDocuments.filter(doc => doc.id !== id);
        Swal.fire({
          icon: 'success',
          title: 'Supprimé!',
          text: 'Le document a été supprimé avec succès.',
          confirmButtonColor: '#0e7490',
        });
      },
      error: (err) => {
        this.showError('Suppression échouée', 'Vous ne pouvez pas supprimer ce document ou il a déjà été supprimé.');
      }
    });
  }

  isOwner(document: DocumentDto): boolean {
    return this.currentUserId === document.uploadedBy.id;
  }

  private showError(title: string, message: string): void {
    Swal.fire({
      icon: 'error',
      title,
      text: message,
      confirmButtonColor: '#0e7490',
    });
  }
}