import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { UserDto } from '../../models/shared-models/user.model';
import { UserService } from '../../services/users.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class UserProfileComponent implements OnInit {
  user: UserDto = {} as UserDto;
  originalUser: UserDto = {} as UserDto;
  hasChanges = false;
  isLoading = false;
  lastUpdated: string = '';

   // New properties for password change
   showPasswordModal = false;
   currentPassword = '';
   newPassword = '';
   confirmPassword = '';
   showCurrentPassword = false;
   showNewPassword = false;
   showConfirmPassword = false;
   
   // Password strength properties
   hasLength = false;
   hasUpper = false;
   hasLower = false;
   hasNumber = false;
   hasSpecial = false;
   passwordsMatch = false;
   openPasswordModal(): void {
    this.showPasswordModal = true;
  }

  closePasswordModal(): void {
    this.showPasswordModal = false;
    this.resetPasswordFields();
  }

  resetPasswordFields(): void {
    this.currentPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.showCurrentPassword = false;
    this.showNewPassword = false;
    this.showConfirmPassword = false;
    this.resetPasswordStrength();
    this.passwordsMatch = false;
  }

  checkPasswordStrength(): void {
    this.hasLength = this.newPassword.length >= 8 && this.newPassword.length <= 16;
    this.hasUpper = /[A-Z]/.test(this.newPassword);
    this.hasLower = /[a-z]/.test(this.newPassword);
    this.hasNumber = /\d/.test(this.newPassword);
    this.hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(this.newPassword);
  }

  checkPasswordsMatch(): void {
    this.passwordsMatch = this.newPassword === this.confirmPassword && this.newPassword.length > 0;
  }

  resetPasswordStrength(): void {
    this.hasLength = false;
    this.hasUpper = false;
    this.hasLower = false;
    this.hasNumber = false;
    this.hasSpecial = false;
  }

  canSubmitPasswordChange(): boolean {
    return this.currentPassword.length > 0 && 
           this.newPassword.length > 0 && 
           this.passwordsMatch && 
           this.hasLength && 
           this.hasUpper && 
           this.hasLower && 
           this.hasNumber && 
           this.hasSpecial;
  }

  changePassword(): void {
    if (!this.canSubmitPasswordChange()) return;

    this.userService.changePassword(
      this.user.id,
      this.currentPassword,
      this.newPassword
    ).subscribe({
      next: () => {
        Swal.fire('Succès', 'Votre mot de passe a été modifié avec succès', 'success');
        this.closePasswordModal();
      },
      error: (error) => {
        let errorMessage = 'Une erreur est survenue lors du changement de mot de passe';
        if (error.status === 401) {
          errorMessage = 'Mot de passe actuel incorrect';
        } else if (error.status === 400) {
          errorMessage = 'Le nouveau mot de passe ne respecte pas les exigences de sécurité';
        }
        Swal.fire('Erreur', errorMessage, 'error');
      }
    });
  }
  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getUserInfo('userId');
    this.isLoading = true;
    this.userService.getUserById(userId).subscribe({
      next: (data) => {
        this.user = { ...data };
        this.originalUser = { ...data };
        this.lastUpdated = data.lastUpdated;
        this.isLoading = false;
      },
      error: () => {
        Swal.fire('Erreur', 'Impossible de charger les informations.', 'error');
        this.isLoading = false;
      }
    });
  }

  detectChanges(): void {
    this.hasChanges = JSON.stringify(this.user) !== JSON.stringify(this.originalUser);
  }

  saveChanges(): void {
    if (!this.hasChanges) return;

    this.userService.updateUser(this.user.id, this.user).subscribe({
      next: (data) => {
        this.originalUser = { ...data };
        this.hasChanges = false;
        this.lastUpdated = data.lastUpdated;
        Swal.fire('Succès', 'Vos informations ont été mises à jour.', 'success');
      },
      error: () => {
        Swal.fire('Erreur', 'Échec de la mise à jour.', 'error');
      }
    });
  }

  cancelChanges(): void {
    this.user = { ...this.originalUser };
    this.hasChanges = false;
  }
}