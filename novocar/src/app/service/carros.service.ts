import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CarrosService {
  private apiUrl = `${environment.apiUrl}/carro`;

  constructor(private http: HttpClient ) { }

  // para listar todos os carros cadastrados
  getCarros(): Observable<any> {
    return this.http.get(this.apiUrl+'/listarCarros').pipe(
      map((response: any) => response),
      catchError((error: any) => {
        console.error('Erro ao obter carros:', error);
        throw error;
      })
    );
  }
}
