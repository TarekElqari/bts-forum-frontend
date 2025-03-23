import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { LoginRequest } from '../models/auth/login-request.model';
import { LoginResponse } from '../models/auth/login-response.model';
import { RegisterRequest } from '../models/auth/register-request.model';
import { RegisterResponse } from '../models/auth/register-response.model';


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
        if (response.token) {
          sessionStorage.setItem('token', response.token);
        }
      }),
      catchError(error => {
        return throwError(() => error);
      })
    );
  }
  
  

  logout(): void {
    sessionStorage.removeItem('token');
  }

  isAuthenticated(): boolean {
    return !!sessionStorage.getItem('token');
  }

  getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  handleOAuth2Response(responseUrl: string): void {
    const urlParams = new URLSearchParams(responseUrl.split('?')[1]);
    const jwt = urlParams.get('jwt');

    if (jwt) {
      sessionStorage.setItem('authToken', jwt);
      Swal.fire({
        icon: 'success',
        title: 'Login Successful',
        text: 'Welcome back!',
      }).then(() => {
        this.router.navigate(['/dashboard']);
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: 'No authentication token found.',
      });
    }
  }
}
