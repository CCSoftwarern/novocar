import { Component, OnInit, Type, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { PanelMenuModule } from 'primeng/panelmenu';
import { TabViewModule } from 'primeng/tabview';
import { ButtonModule } from 'primeng/button';
import { VeiculosComponent } from '../veiculos/veiculos.component';
import { ClientesComponent } from '../clientes/clientes.component';
import { AgendarComponent } from '../agendar/agendar.component';
import { ConsultaComponent } from '../consulta/consulta.component';

interface Aba {
  id: string;
  titulo: string;
  componente: Type<unknown>;
}

/** abas que cada perfil pode abrir */
const ABAS_POR_PERFIL: Record<string, string[]> = {
  ADMIN: ['clientes', 'veiculos', 'agendar', 'consulta'],
  CLIENTE: ['agendar']
};

@Component({
    selector: 'app-main',
    standalone: true,
    imports: [CommonModule, PanelMenuModule, TabViewModule, ButtonModule, VeiculosComponent, ClientesComponent, AgendarComponent, ConsultaComponent],
    templateUrl: './main.component.html',
    styleUrl: './main.component.css'
})
export class MainComponent implements OnInit {
  private router = inject(Router);

  readonly perfil = localStorage.getItem('perfil') ?? 'CLIENTE';
  readonly isAdmin = this.perfil === 'ADMIN';

  itensMenu: MenuItem[] = [];
  abasAbertas: Aba[] = [];
  indiceAbaAtiva: number = 0;

  ngOnInit() {
    this.itensMenu = this.isAdmin ? this.menuAdministrador() : this.menuCliente();

    // o cliente cai direto no agendamento
    if (!this.isAdmin) {
      this.abrirAba('agendar', 'Agendar Test Drive', AgendarComponent);
    }
  }

  /** ADMIN: acesso completo */
  private menuAdministrador(): MenuItem[] {
    return [
      {
        label: 'Cadastros',
        icon: 'pi pi-folder',
        expanded: true,
        items: [
          {
            label: 'Clientes',
            icon: 'pi pi-users',
            command: () => this.abrirAba('clientes', 'Clientes', ClientesComponent)
          },
          {
            label: 'Veículos',
            icon: 'pi pi-car',
            command: () => this.abrirAba('veiculos', 'Veículos', VeiculosComponent)
          }
        ]
      },
      {
        label: 'Test drive',
        icon: 'pi pi-calendar',
        expanded: true,
        items: [
          {
            label: 'Agendar',
            icon: 'pi pi-calendar-plus',
            command: () => this.abrirAba('agendar', 'Agendar Test Drive', AgendarComponent)
          },
          {
            label: 'Consultar',
            icon: 'pi pi-search',
            command: () => this.abrirAba('consulta', 'Consultar testes', ConsultaComponent)
          }
        ]
      }
    ];
  }

  /** CLIENTE: só agendamento */
  private menuCliente(): MenuItem[] {
    return [
      {
        label: 'Test drive',
        icon: 'pi pi-calendar',
        expanded: true,
        items: [
          {
            label: 'Agendar',
            icon: 'pi pi-calendar-plus',
            command: () => this.abrirAba('agendar', 'Agendar Test Drive', AgendarComponent)
          }
        ]
      }
    ];
  }

  abrirAba(id: string, titulo: string, componente: Type<unknown>): void {
    // segunda barreira: mesmo que alguém force a chamada, o perfil precisa permitir
    const permitidas = ABAS_POR_PERFIL[this.perfil] ?? [];
    if (!permitidas.includes(id)) return;

    const indiceExistente = this.abasAbertas.findIndex(aba => aba.id === id);

    if (indiceExistente !== -1) {
      this.indiceAbaAtiva = indiceExistente;
      return;
    }

    this.abasAbertas.push({ id, titulo, componente });
    setTimeout(() => (this.indiceAbaAtiva = this.abasAbertas.length - 1));
  }

  sair(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('perfil');
    this.router.navigate(['/login']);
  }

  fecharAba(event: { index: number }): void {
    const { index } = event;
    this.abasAbertas.splice(index, 1);

    if (this.abasAbertas.length === 0) {
      this.indiceAbaAtiva = 0;
    } else if (this.indiceAbaAtiva >= index) {
      this.indiceAbaAtiva = Math.max(0, this.indiceAbaAtiva - 1);
    }
  }
}
