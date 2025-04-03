import { Component, HostListener, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DocsHome } from './documents/docs-home/docs-home.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { UserProfileComponent } from '../../shared/settings/settings.component';
import { ChatbotComponent } from "../chatbot/chatbot.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule, DocsHome, CommonModule, ReactiveFormsModule, UserProfileComponent, ChatbotComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  firstName: string = '';
  lastName: string = '';
  currentView: string = 'home';
  isSidebarOpen: boolean = true;
  isLargeScreen: boolean = true;

  constructor(private authService: AuthService) {
    this.firstName = this.authService.getUserInfo('firstName');
    this.lastName = this.authService.getUserInfo('lastName');
  }

  ngOnInit() {
    this.checkScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isLargeScreen = window.innerWidth >= 768;
    this.isSidebarOpen = this.isLargeScreen;
  }

  setView(view: string) {
    this.currentView = view;
    if (!this.isLargeScreen) {
      this.isSidebarOpen = false;
    }
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  logout() {
    this.authService.logout();
    Swal.fire({
      title: 'À bientôt !',
      text: 'Vous avez été déconnecté avec succès.',
      icon: 'success',
      confirmButtonText: 'OK'
    });
  }
}
