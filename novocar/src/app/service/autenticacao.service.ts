import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AutenticacaoService {

  constructor(private http: HttpClient) { }
  private apiUrl = 'http://localhost:8080/auth/login'; // Substitua pela URL da sua API

  login(nome: string, senha: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { nome, senha };

    return this.http.post(this.apiUrl, body, { headers });
  }
}
