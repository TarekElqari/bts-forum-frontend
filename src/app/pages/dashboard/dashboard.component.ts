import { Component, HostListener, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { jwtDecode } from 'jwt-decode';
import { DocsHome } from './documents/docs-home/docs-home.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule, DocsHome, CommonModule, ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  firstName: string = '';
  lastName: string = '';
  currentView: string = 'home';
  isSidebarOpen: boolean = true;
  window = window; // Add this to make window available in template

  constructor(private authService: AuthService) {
    this.firstName = this.authService.getUserInfo('firstName');
    this.lastName = this.authService.getUserInfo('lastName');
    this.checkScreenSize();
  }

  ngOnInit() {
    this.checkScreenSize();
  }
  isMobileScreen(): boolean {
    return window.innerWidth < 768;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkScreenSize();
  }

  checkScreenSize() {
    if (window.innerWidth < 768) {
      this.isSidebarOpen = false;
    } else {
      this.isSidebarOpen = true;
    }
  }

  setView(view: string) {
    this.currentView = view;
    if (window.innerWidth < 768) {
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