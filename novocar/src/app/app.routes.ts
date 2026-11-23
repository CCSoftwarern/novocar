import { Routes } from '@angular/router';
import { LoginComponent } from './adm/login/login.component';
import { HomeComponent } from './home/home.component';
import { MainComponent } from './adm/main/main.component';
import { VeiculoDetalheComponent } from './veiculo-detalhe/veiculo-detalhe.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'veiculo/:id', component: VeiculoDetalheComponent },
  { path: 'main', component: MainComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];
