import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmationService, MessageService } from 'primeng/api';

import { AgendamentoService } from '../../service/agendamento.service';
import { Agendamento, StatusAgendamento } from '../../interfaces/agendamento';

@Component({
  selector: 'app-consulta',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    TagModule,
    ButtonModule,
    TooltipModule,
    ToastModule,
    ConfirmDialogModule,
    InputTextModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './consulta.component.html',
  styleUrl: './consulta.component.css'
})
export class ConsultaComponent implements OnInit {
  private agendamentoService = inject(AgendamentoService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  agendamentos: Agendamento[] = [];
  carregando = true;

  ngOnInit(): void {
    this.carregar();
  }

  get pendentes(): number {
    return this.agendamentos.filter((a) => a.status === 'PENDENTE').length;
  }

  get confirmados(): number {
    return this.agendamentos.filter((a) => a.status === 'CONFIRMADO').length;
  }

  get finalizados(): number {
    return this.agendamentos.filter((a) => a.status === 'CONCLUIDO' || a.status === 'CANCELADO').length;
  }

  carregar(): void {
    this.carregando = true;

    this.agendamentoService.todos().subscribe({
      next: (agendamentos) => {
        this.agendamentos = agendamentos;
        this.carregando = false;
      },
      error: (erro) => {
        console.error('Erro ao carregar agendamentos:', erro);
        this.carregando = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível carregar os agendamentos.'
        });
      }
    });
  }

  confirmar(agendamento: Agendamento): void {
    this.mudarStatus(agendamento, 'CONFIRMADO', 'Agendamento confirmado');
  }

  concluir(agendamento: Agendamento): void {
    this.mudarStatus(agendamento, 'CONCLUIDO', 'Test drive concluído');
  }

  cancelar(agendamento: Agendamento): void {
    this.confirmationService.confirm({
      header: 'Cancelar agendamento',
      message: `Cancelar o test drive de ${agendamento.cliente} no ${agendamento.veiculo}?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim, cancelar',
      rejectLabel: 'Não',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.mudarStatus(agendamento, 'CANCELADO', 'Agendamento cancelado')
    });
  }

  rotuloStatus(status: StatusAgendamento): string {
    switch (status) {
      case 'PENDENTE': return 'Pendente';
      case 'CONFIRMADO': return 'Confirmado';
      case 'CONCLUIDO': return 'Concluído';
      case 'CANCELADO': return 'Cancelado';
      default: return status;
    }
  }

  severidadeStatus(status: StatusAgendamento): 'warn' | 'success' | 'info' | 'danger' | 'secondary' {
    switch (status) {
      case 'PENDENTE': return 'warn';
      case 'CONFIRMADO': return 'success';
      case 'CONCLUIDO': return 'info';
      case 'CANCELADO': return 'danger';
      default: return 'secondary';
    }
  }

  private mudarStatus(agendamento: Agendamento, status: StatusAgendamento, mensagem: string): void {
    this.agendamentoService.alterarStatus(agendamento.id, status).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: mensagem, detail: agendamento.veiculo ?? '' });
        this.carregar();
      },
      error: (erro) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: erro?.error?.erro ?? erro?.error?.message ?? 'Tente novamente em instantes.'
        });
      }
    });
  }
}
