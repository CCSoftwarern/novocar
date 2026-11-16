import { Component, OnInit, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { PanelMenuModule } from 'primeng/panelmenu';
import { TabViewModule } from 'primeng/tabview';
import { VeiculosComponent } from '../veiculos/veiculos.component';
import { ClientesComponent } from '../clientes/clientes.component';
import { AgendarComponent } from '../agendar/agendar.component';
import { ConsultaComponent } from '../consulta/consulta.component';

interface Aba {
  id: string;
  titulo: string;
  componente: Type<unknown>;  
}


@Component({
    selector: 'app-main',
    standalone: true,
    imports: [CommonModule, PanelMenuModule, TabViewModule, VeiculosComponent, ClientesComponent, AgendarComponent, ConsultaComponent],
    templateUrl: './main.component.html',
    styleUrl: './main.component.css'
})
export class MainComponent implements OnInit {
  itensMenu: MenuItem[] = [];
  abasAbertas: Aba[] = [];
  indiceAbaAtiva: number = 0;

  ngOnInit() {
    this.itensMenu = [
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
        icon: 'pi pi-wallet',
        items: [
          {
            label: 'Agendar',
            icon: 'pi pi-car',
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

  abrirAba(id: string, titulo: string, componente: Type<unknown>): void {
    const indiceExistente = this.abasAbertas.findIndex(aba => aba.id === id);

    if (indiceExistente !== -1) {
      this.indiceAbaAtiva = indiceExistente;
      return;
    }

    this.abasAbertas.push({ id, titulo, componente });
setTimeout(() => (this.indiceAbaAtiva = this.abasAbertas.length - 1));
    // this.indiceAbaAtiva = this.abasAbertas.length - 1; // não precisa de setTimeout
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