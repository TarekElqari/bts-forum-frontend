import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LoginRequest } from '../models/auth/login-request.model';
import { LoginResponse } from '../models/auth/login-response.model';
import { RegisterRequest } from '../models/auth/register-request.model';
import { RegisterResponse } from '../models/auth/register-response.model';
import { jwtDecode } from 'jwt-decode';
import { JwtPayload } from '../models/auth/jwt-payload.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient, private router: Router) {}

  register(data: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.API_URL}/register`, data).pipe(
      catchError(error => {
        console.error('Registration error:', error);
        return throwError(() => error);
      })
    );
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/normal-login`, credentials).pipe(
      tap(response => {
        if (response.accessToken) {
          sessionStorage.setItem('authToken', response.accessToken);
          sessionStorage.setItem('refreshToken', response.refreshToken);
        }
      }),
      catchError(error => throwError(() => error))
    );
  }

  refreshToken(): Observable<LoginResponse> {
    const refreshToken = sessionStorage.getItem('refreshToken');
    if (!refreshToken) {
      this.logout();
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post<LoginResponse>(`${this.API_URL}/refresh-token`, null, {
      headers: { Authorization: `Bearer ${refreshToken}` }
    }).pipe(
      tap(response => {
        sessionStorage.setItem('authToken', response.accessToken);
        sessionStorage.setItem('refreshToken', response.refreshToken);
      }),
      catchError(error => {
        this.logout();
        return throwError(() => error);
      })
    );
  }

  logout(): void {
    const refreshToken = sessionStorage.getItem('refreshToken');
  
    if (refreshToken) {
      this.http.post(`${this.API_URL}/logout`, refreshToken, {
        headers: { Authorization: `Bearer ${refreshToken}` },
        responseType: 'text'
      }).subscribe({
        next: () => {
          console.log('Déconnexion réussie', refreshToken);
          this.clearSession();
        },
        error: (err) => {
          console.warn('Erreur durant la déconnexion :', err);
          this.clearSession();
        }
      });
    } else {
      this.clearSession();
    }
  }
  
  private clearSession(): void {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('refreshToken');
    this.router.navigate(['/login']);
  }
  
  

  isAuthenticated(): boolean {
    return !!sessionStorage.getItem('authToken');
  }

  getToken(): string | null {
    return sessionStorage.getItem('authToken');
  }

  getUserInfo(key: keyof JwtPayload): any {
    const token = this.getToken();
    if (token) {
      try {
        return jwtDecode<JwtPayload>(token)[key];
      } catch (e) {
        console.error('Erreur lors du décodage du token', e);
        return null;
      }
    }
    return null;
  }
}
