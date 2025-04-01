import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { DocumentDto } from '../models/etudiant/document.model';


@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private baseUrl = 'http://localhost:8080/api/documents';

  constructor(private http: HttpClient) {}

  uploadDocument(file: File, tags: string[], description: string, userId: number, matiere: string, type: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('description', description);
    formData.append('userId', userId.toString());
    formData.append('matiere', matiere);
    formData.append('type', type);
    tags.forEach(tag => formData.append('tags', tag));
    return this.http.post(`${this.baseUrl}/upload`, formData);
  }

  getAllDocuments(): Observable<DocumentDto[]> {
    return this.http.get<DocumentDto[]>(this.baseUrl);
  }

  deleteDocument(id: number): Observable<any> { 
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  downloadDocument(id: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/download/${id}`, { responseType: 'blob' });
  }
  
  
}
