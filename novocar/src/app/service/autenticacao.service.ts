import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface RespostaLogin {
  token: string;
  tipo: string;
  perfil: string;
}

@Injectable({ providedIn: 'root' })
export class AutenticacaoService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/auth`;

  login(nome: string, senha: string): Observable<RespostaLogin> {
    return this.http.post<RespostaLogin>(`${this.apiUrl}/login`, { nome, senha });
  }

  // cadastro público: o backend sempre cria com perfil CLIENTE
  // e responde texto puro ("Cliente cadastrado.")
  registrar(nome: string, senha: string): Observable<string> {
    return this.http.post(`${this.apiUrl}/register`, { nome, senha }, { responseType: 'text' });
  }
}
