import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

import { AuthService } from '../../services/auth.service';
import { RegisterRequest } from '../../models/auth/register-request.model';

@Component({
  selector: 'app-signup',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;

  selectedRole: 'ROLE_STUDENT' | 'ROLE_TEACHER' = 'ROLE_STUDENT';
  hasLength: boolean = false;
  hasUpper: boolean = false;
  hasLower: boolean = false;
  hasNumber: boolean = false;
  hasSpecial: boolean = false;

  // Password validation
  passwordsMatch: boolean = true;
  showPasswordStrength: boolean = false;
  startPasswordMatchCheck: boolean = false;
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.selectedRole = params['role'] === 'TEACHER' ? 'ROLE_TEACHER' : 'ROLE_STUDENT';
    });

    this.signupForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      classe: ['', Validators.required],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(16)
      ]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });

    this.setupPasswordListeners();
  }

  private passwordMatchValidator(form: AbstractControl) {
    return form.get('password')?.value === form.get('confirmPassword')?.value 
      ? null 
      : { mismatch: true };
  }

  private setupPasswordListeners() {
    this.signupForm.get('password')?.valueChanges.subscribe(password => {
      if (password) {
        this.showPasswordStrength = true;
        this.checkPasswordStrength(password);
      } else {
        this.showPasswordStrength = false;
      }
      this.checkPasswordsMatch();
    });

    this.signupForm.get('confirmPassword')?.valueChanges.subscribe(() => {
      this.startPasswordMatchCheck = true;
      this.checkPasswordsMatch();
    });
  }

  checkPasswordStrength(password: string) {
    this.hasLength = password.length >= 8 && password.length <= 16;
    this.hasUpper = /[A-Z]/.test(password);
    this.hasLower = /[a-z]/.test(password);
    this.hasNumber = /\d/.test(password);
    this.hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  }

  checkPasswordsMatch() {
    const password = this.signupForm.get('password')?.value;
    const confirmPassword = this.signupForm.get('confirmPassword')?.value;
    this.passwordsMatch = password === confirmPassword;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit() {
    const isPasswordValid = this.hasLength && this.hasUpper && 
                           this.hasLower && this.hasNumber && this.hasSpecial;

    if (this.signupForm.invalid || !this.passwordsMatch || !isPasswordValid) {
      let errorMessage = 'Veuillez corriger les erreurs avant de soumettre.';
      if (!isPasswordValid) errorMessage = 'Le mot de passe ne répond pas à tous les critères de sécurité.';
      if (!this.passwordsMatch) errorMessage = 'Les mots de passe ne correspondent pas.';

      Swal.fire({
        icon: 'warning',
        title: 'Formulaire invalide',
        text: errorMessage,
      });
      return;
    }

    const formValue = this.signupForm.value;
    const payload: RegisterRequest = {
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      email: formValue.email,
      classe: formValue.classe,
      password: formValue.password,
      role: this.selectedRole
    };

    this.authService.register(payload).subscribe({
      next: (response) => this.handleSuccess(response),
      error: (error) => this.handleError(error)
    });
  }

  private handleSuccess(response: any) {
    Swal.fire({
      icon: 'success',
      title: 'Inscription réussie',
      text: response.message,
    }).then(() => this.router.navigate(['/login']));
  }

  private handleError(error: any) {
    let errorMessage = 'Une erreur est survenue lors de l\'inscription.';
  
    if (error.status === 0) {
      errorMessage = 'Impossible de contacter le serveur. Vérifiez votre connexion.';
    } else if (error.status === 409) {
      errorMessage = 'Cet email est déjà enregistré. Veuillez en utiliser un autre.';
    } else if (error.status === 400) {
      errorMessage = 'Merci de remplir tous les champs obligatoires.';
    } else if (error.status === 500) {
      errorMessage = 'Erreur interne du serveur. Veuillez réessayer plus tard.';
    } else if (typeof error.error === 'string') {
      errorMessage = error.error;
    } else if (error.error?.message) {
      errorMessage = error.error.message;
    }
  
    Swal.fire({
      icon: 'error',
      title: 'Échec de l\'inscription',
      text: errorMessage,
    });
  }      
}