import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { DocumentDto } from '../models/shared-models/document.model';


@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private API_URL = 'http://localhost:8080/api/documents';

  constructor(private http: HttpClient) {}

  uploadDocument(file: File, tags: string[], description: string, userId: number, matiere: string, type: string, niveau: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('description', description);
    formData.append('userId', userId.toString());
    formData.append('matiere', matiere);
    formData.append('type', type);
    formData.append('niveau', niveau);
    tags.forEach(tag => formData.append('tags', tag));
    return this.http.post(`${this.API_URL}/upload`, formData);
  }
  

  getAllDocuments(page: number = 0, size: number = 10, search?: string, type?: string, matiere?: string, tags?: string[]): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (search) params = params.set('search', search);
    if (type) params = params.set('type', type);
    if (matiere) params = params.set('matiere', matiere);
    if (tags && tags.length > 0) params = params.set('tags', tags.join(','));

    return this.http.get(`${this.API_URL}`, { params });
  }
  deleteDocument(id: number): Observable<any> { 
    return this.http.delete(`${this.API_URL}/${id}`);
  }

  downloadDocument(id: number): Observable<Blob> {
    return this.http.get(`${this.API_URL}/download/${id}`, { responseType: 'blob' });
  }
  
  
}
