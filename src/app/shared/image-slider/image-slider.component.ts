import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-image-slider',
  templateUrl: './image-slider.component.html',
  styleUrls: ['./image-slider.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class ImageSliderComponent implements OnInit, OnDestroy {
  @Input() images: string[] = [];
  currentIndex: number = 0;
  intervalId: any;

  ngOnInit(): void {
    this.startSlider();
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  startSlider(): void {
    this.intervalId = setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
    }, 3000); // Slide every 3 seconds
  }

  goToSlide(index: number): void {
    this.currentIndex = index;
    clearInterval(this.intervalId); // Reset timer on manual navigation
    this.startSlider(); // Restart the auto slider
  }
}
