import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../models/auth/login-request.model';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  showPassword = false;
  currentSlide = 0;
  autoSlideInterval: any;

  slides = [
    { image: '/students-discussion.jpg', alt: 'Discussion', caption: 'Partagez vos connaissances' },
    { image: '/upload-documents.jpg', alt: 'Ressources', caption: 'Accédez aux documents utiles' },
    { image: '/chatbot-assistance.jpg', alt: 'Assistance IA', caption: 'Posez vos questions au chatbot' },
    { image: '/internship-report.jpg', alt: 'Rapports de stage', caption: 'Consultez des exemples' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private http: HttpClient
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.autoSlideInterval = setInterval(() => this.nextSlide(), 4000);
  }

  ngOnDestroy(): void {
    clearInterval(this.autoSlideInterval);
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Champs invalides',
        text: 'Veuillez remplir tous les champs correctement.'
      });
      return;
    }

    const credentials: LoginRequest = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };

    this.authService.login(credentials).subscribe({
      next: (res) => {
        Swal.fire({
          icon: 'success',
          title: 'Connexion réussie',
          text: 'Bienvenue sur le forum TC !'
        }).then(() => this.router.navigate(['/dashboard']));
      },
      error: (error) => {
        let errorMessage = '';
        console.log(error.status
        );

        if (error.status === 410) {
          errorMessage = 'Email ou mot de passe incorrect.';
        } else if (error.status === 404) {
          errorMessage = 'Aucun compte trouvé avec cet email.';
        } else if (error.status === 500) {
          errorMessage = 'Erreur interne du serveur.';
        } else if (typeof error.error === 'string') {
          errorMessage = error.error;
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        }

        Swal.fire({
          icon: 'error',
          title: 'Échec de la connexion',
          text: errorMessage
        });
      }
    });
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }
}



