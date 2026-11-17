import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AutenticacaoService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/auth/login`;

  login(nome: string, senha: string): Observable<{ token: string; perfil: string }> {
    return this.http.post<{ token: string; perfil: string }>(this.apiUrl, { nome, senha });
  }
}
