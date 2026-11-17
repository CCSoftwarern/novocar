import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Carro } from '../interfaces/carro';

export interface UploadResponse {
  url: string; // ex.: http://localhost:8080/uploads/abc123.jpg
}

@Injectable({ providedIn: 'root' })
export class CarrosService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/carro`;

  getCarros(): Observable<Carro[]> {
    return this.http.get<Carro[]>(`${this.apiUrl}/listarCarros`);
  }

  postCarro(carro: Omit<Carro, 'id'>): Observable<Carro> {
    return this.http.post<Carro>(`${this.apiUrl}/salvar`, carro);
  }
uploadImagem(arquivo: File): Observable<string> {
  const formData = new FormData();
  formData.append('arquivo', arquivo, arquivo.name);

  // responseType 'text' evita o JSON.parse
  return this.http.post(`${this.apiUrl}/upload`, formData, { responseType: 'text' });
}

  // remove um carro pelo id (backend responde 204 No Content)
  deleteCarro(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // atualiza um carro existente
  putCarro(id: number, carro: Omit<Carro, 'id'>): Observable<Carro> {
    return this.http.put<Carro>(`${this.apiUrl}/${id}`, carro);
  }
}
