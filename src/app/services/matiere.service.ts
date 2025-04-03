import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Matiere } from '../models/shared-models/Matiere.model';


@Injectable({
  providedIn: 'root'
})
export class MatiereService {
  private readonly API_URL = 'http://localhost:8080/api/matieres';

  constructor(private http: HttpClient) {}

  getAllMatieres(): Observable<Matiere[]> {
    return this.http.get<Matiere[]>(this.API_URL);
  }

  getMatieresByNiveau(niveau: 'TC_1ERE_ANNEE' | 'TC_2EME_ANNEE'): Observable<Matiere[]> {
    return this.http.get<Matiere[]>(`${this.API_URL}/niveau/${niveau}`);
  }
}
