import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ImageSliderComponent } from '../../shared/image-slider/image-slider.component';
import { LegalModalComponent } from "./legal-modal/legal-modal.component";

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [CommonModule, ImageSliderComponent, LegalModalComponent],
})
export class HomeComponent implements OnInit, OnDestroy {
  isMenuOpen: boolean = false;
  currentSection: string = '';

  showModal: boolean = false;
  modalContent: 'privacy' | 'terms' | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    window.addEventListener('scroll', this.onScroll);
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.onScroll);
  }

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      this.currentSection = sectionId;
    }
  }

  onScroll = () => {
    const sections = ['benefits', 'about', 'contact', 'services'];
    let current = '';

    sections.forEach((section) => {
      const el = document.getElementById(section);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= 150 && rect.bottom >= 150) {
          current = section;
        }
      }
    });

    this.currentSection = current;
  };

  navigatetosignup() {
    this.router.navigate(['signup']);
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  setOAuthIntent(intent: 'login' | 'signup') {
    sessionStorage.setItem('oauthIntent', intent);
  }

  openModal(content: 'privacy' | 'terms') {
    this.modalContent = content;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }
}
