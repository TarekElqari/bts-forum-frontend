import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-stud-or-teach',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './stud-or-teach.component.html',
  styleUrls: ['./stud-or-teach.component.css']
})
export class StudOrTeachComponent {
  constructor(private router: Router) {}

  selectRole(role: 'STUDENT' | 'TEACHER') {
    const intent = sessionStorage.getItem('oauthIntent') || 'signup';
    if (intent === 'login') {
      this.router.navigate(['/login']);
    } else {
      this.router.navigate(['/signup'], { queryParams: { role } });
    }
  }
}
