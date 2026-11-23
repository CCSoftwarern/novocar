import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService, MessageService } from 'primeng/api';

import { CarrosService } from '../../service/carros.service';
import { AgendamentoService } from '../../service/agendamento.service';
import { ClienteService } from '../../service/cliente.service';
import { Carro } from '../../interfaces/carro';
import { Cliente } from '../../interfaces/cliente';
import { Agendamento, StatusAgendamento } from '../../interfaces/agendamento';

/** exige uma data/hora no futuro (com 30 min de folga, igual ao backend) */
function dataFutura(control: AbstractControl): ValidationErrors | null {
  const valor = control.value as Date | null;
  if (!valor) {
    return null;
  }
  const minimo = Date.now() + 30 * 60 * 1000;
  return valor.getTime() >= minimo ? null : { dataNoPassado: true };
}

interface OpcaoVeiculo {
  label: string;
  value: number;
  detalhe: string;
  foto: string | null;
}

@Component({
  selector: 'app-agendar',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SelectModule,
    DatePickerModule,
    TextareaModule,
    ButtonModule,
    ToastModule,
    TagModule,
    ConfirmDialogModule,
    TooltipModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './agendar.component.html',
  styleUrl: './agendar.component.css'
})
export class AgendarComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private carrosService = inject(CarrosService);
  private agendamentoService = inject(AgendamentoService);
  private clienteService = inject(ClienteService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  readonly hoje = new Date();

  /** o ADMIN também agenda, mas só vê os próprios aqui (gerencia todos em "Consultar") */
  readonly isAdmin = localStorage.getItem('perfil') === 'ADMIN';

  opcoesVeiculos: OpcaoVeiculo[] = [];
  clientes: Cliente[] = [];
  agendamentos: Agendamento[] = [];

  carregandoVeiculos = true;
  carregandoClientes = false;
  carregandoAgendamentos = true;
  salvando = false;

  form = this.fb.group({
    idCliente: this.fb.control<number | null>(null),
    idCarro: this.fb.control<number | null>(null, [Validators.required]),
    dataHora: this.fb.control<Date | null>(null, [Validators.required, dataFutura]),
    observacao: this.fb.control<string>('', [Validators.maxLength(500)])
  });

  get c() {
    return this.form.controls;
  }

  ngOnInit(): void {
    this.carregarVeiculos();
    this.carregarAgendamentos();

    // o ADMIN agenda em nome de um cliente: a escolha é obrigatória
    if (this.isAdmin) {
      this.c.idCliente.addValidators(Validators.required);
      this.c.idCliente.updateValueAndValidity();
      this.carregarClientes();
    }

    // veio da home com ?carro=12
    const carroId = Number(this.route.snapshot.queryParamMap.get('carro'));
    if (carroId) {
      this.form.patchValue({ idCarro: carroId });
    }
  }

  carregarClientes(): void {
    this.carregandoClientes = true;

    this.clienteService.listar().subscribe({
      next: (clientes) => {
        this.clientes = clientes;
        this.carregandoClientes = false;
      },
      error: (erro) => {
        console.error('Erro ao carregar clientes:', erro);
        this.carregandoClientes = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível carregar a lista de clientes.'
        });
      }
    });
  }

  carregarVeiculos(): void {
    this.carregandoVeiculos = true;

    this.carrosService.getCarros().subscribe({
      next: (carros) => {
        this.opcoesVeiculos = carros
          .filter((carro) => carro.situacao === 'DISPONIVEL')
          .map((carro) => this.paraOpcao(carro));
        this.carregandoVeiculos = false;
      },
      error: (erro) => {
        console.error('Erro ao carregar veículos:', erro);
        this.carregandoVeiculos = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível carregar a lista de veículos.'
        });
      }
    });
  }

  carregarAgendamentos(): void {
    this.carregandoAgendamentos = true;

    this.agendamentoService.meus().subscribe({
      next: (agendamentos) => {
        this.agendamentos = agendamentos;
        this.carregandoAgendamentos = false;
      },
      error: (erro) => {
        console.error('Erro ao carregar agendamentos:', erro);
        this.carregandoAgendamentos = false;
      }
    });
  }

  agendar(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    const { idCliente, idCarro, dataHora, observacao } = this.form.getRawValue();

    if (idCarro === null || dataHora === null) {
      return;
    }

    const clienteEscolhido = this.isAdmin
      ? this.clientes.find((cliente) => cliente.id === idCliente) ?? null
      : null;

    this.salvando = true;

    this.agendamentoService
      .criar({
        idCliente: this.isAdmin ? idCliente : null,
        idCarro,
        dataHora: this.paraLocalDateTime(dataHora),
        observacao: observacao?.trim() || null
      })
      .subscribe({
        next: () => {
          this.salvando = false;
          this.form.reset({ idCliente: null, idCarro: null, dataHora: null, observacao: '' });

          this.messageService.add(
            clienteEscolhido
              ? {
                  severity: 'success',
                  summary: 'Agendamento criado',
                  detail: `Test drive de ${clienteEscolhido.nome}. Acompanhe em Test drive → Consultar.`
                }
              : {
                  severity: 'success',
                  summary: 'Agendamento enviado',
                  detail: 'Aguarde a confirmação da nossa equipe.'
                }
          );

          this.carregarAgendamentos();
        },
        error: (erro) => {
          this.salvando = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Não foi possível agendar',
            detail: this.mensagemErro(erro)
          });
        }
      });
  }

  cancelar(agendamento: Agendamento): void {
    this.confirmationService.confirm({
      header: 'Cancelar agendamento',
      message: `Deseja cancelar o test drive do ${agendamento.veiculo}?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim, cancelar',
      rejectLabel: 'Não',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.agendamentoService.cancelar(agendamento.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Agendamento cancelado',
              detail: 'Você pode agendar outro horário quando quiser.'
            });
            this.carregarAgendamentos();
          },
          error: (erro) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: this.mensagemErro(erro)
            });
          }
        });
      }
    });
  }

  podeCancelar(agendamento: Agendamento): boolean {
    return agendamento.status === 'PENDENTE' || agendamento.status === 'CONFIRMADO';
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

  private paraOpcao(carro: Carro): OpcaoVeiculo {
    return {
      label: `${carro.marca} ${carro.modelo}`,
      value: carro.id,
      detalhe: `${carro.anofabricacao}/${carro.ano} · ${carro.cor}`,
      foto: carro.fotografiaPrincipal || null
    };
  }

  /** o backend usa LocalDateTime: manda "2026-11-20T14:30:00" (sem timezone) */
  private paraLocalDateTime(data: Date): string {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${data.getFullYear()}-${pad(data.getMonth() + 1)}-${pad(data.getDate())}T${pad(data.getHours())}:${pad(data.getMinutes())}:00`;
  }

  private mensagemErro(erro: any): string {
    return erro?.error?.erro ?? erro?.error?.message ?? 'Tente novamente em instantes.';
  }
}
