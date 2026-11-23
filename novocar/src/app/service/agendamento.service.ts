import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Agendamento, NovoAgendamento, StatusAgendamento } from '../interfaces/agendamento';

@Injectable({ providedIn: 'root' })
export class AgendamentoService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/agendamento`;

  /** CLIENTE agenda o test drive de um veículo. */
  criar(dados: NovoAgendamento): Observable<Agendamento> {
    return this.http.post<Agendamento>(this.apiUrl, dados);
  }

  /** Agendamentos do usuário logado. */
  meus(): Observable<Agendamento[]> {
    return this.http.get<Agendamento[]>(`${this.apiUrl}/meus`);
  }

  /** ADMIN: todos os agendamentos. */
  todos(): Observable<Agendamento[]> {
    return this.http.get<Agendamento[]>(this.apiUrl);
  }

  /** ADMIN: confirma, conclui ou cancela. */
  alterarStatus(id: number, status: StatusAgendamento): Observable<Agendamento> {
    return this.http.patch<Agendamento>(`${this.apiUrl}/${id}/status`, { status });
  }

  /** CLIENTE cancela o próprio agendamento. */
  cancelar(id: number): Observable<Agendamento> {
    return this.http.patch<Agendamento>(`${this.apiUrl}/${id}/cancelar`, {});
  }
}
