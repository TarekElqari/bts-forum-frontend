import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/sign-up/sign-up.component';
import { StudOrTeachComponent } from './pages/stud-or-teach/stud-or-teach.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent},
    { path: '', component: HomeComponent},
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'stud-or-teach', component: StudOrTeachComponent },
    { path: 'dashboard', component: DashboardComponent },

];
