import { Routes } from '@angular/router';
import { LoginComponent } from './adm/login/login.component';
import { HomeComponent } from './home/home.component';
import { MainComponent } from './adm/main/main.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'main', component: MainComponent },
  { path: '**', redirectTo: '' }
];
