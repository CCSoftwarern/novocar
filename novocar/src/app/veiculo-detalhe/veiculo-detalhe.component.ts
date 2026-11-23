import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { CabecalhoComponent } from '../cabecalho/cabecalho.component';
import { RodapeComponent } from '../rodape/rodape.component';
import { CarrosService } from '../service/carros.service';
import { Carro } from '../interfaces/carro';

@Component({
  selector: 'app-veiculo-detalhe',
  imports: [CommonModule, RouterLink, CabecalhoComponent, RodapeComponent],
  templateUrl: './veiculo-detalhe.component.html',
  styleUrl: './veiculo-detalhe.component.css'
})
export class VeiculoDetalheComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private title = inject(Title);
  private carrosService = inject(CarrosService);

  veiculo: Carro | null = null;
  semelhantes: Carro[] = [];
  carregando = true;
  naoEncontrado = false;
  erro = '';

  ngOnInit(): void {
    // paramMap (e não snapshot): permite trocar de veículo clicando em "semelhantes"
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));

      if (!id) {
        this.carregando = false;
        this.naoEncontrado = true;
        return;
      }

      this.carregar(id);
    });
  }

  carregar(id: number): void {
    this.carregando = true;
    this.naoEncontrado = false;
    this.erro = '';
    this.veiculo = null;
    this.semelhantes = [];

    this.carrosService.getCarro(id).subscribe({
      next: (carro) => {
        this.veiculo = carro;
        this.carregando = false;
        this.title.setTitle(`${carro.marca} ${carro.modelo} | NovoCar`);
        window.scrollTo({ top: 0 });
        this.carregarSemelhantes(carro);
      },
      error: (erro) => {
        this.carregando = false;

        if (erro?.status === 404) {
          this.naoEncontrado = true;
          this.title.setTitle('Veículo não encontrado | NovoCar');
          return;
        }

        this.erro = 'Não foi possível carregar este veículo. Verifique sua conexão e tente novamente.';
        this.title.setTitle('Veículo | NovoCar');
      }
    });
  }

  carregarSemelhantes(veiculo: Carro): void {
    this.carrosService.getCarros().subscribe({
      next: (carros) => {
        this.semelhantes = carros
          .filter((carro) => carro.id !== veiculo.id && this.estaDisponivel(carro))
          .sort((a, b) => {
            // mesma marca primeiro
            const mesmaMarcaA = a.marca?.toLowerCase() === veiculo.marca?.toLowerCase() ? 0 : 1;
            const mesmaMarcaB = b.marca?.toLowerCase() === veiculo.marca?.toLowerCase() ? 0 : 1;
            return mesmaMarcaA - mesmaMarcaB;
          })
          .slice(0, 3);
      },
      error: () => {
        // sem sugestões não quebra a página
        this.semelhantes = [];
      }
    });
  }

  estaDisponivel(veiculo: Carro): boolean {
    return veiculo.situacao === 'DISPONIVEL';
  }

  rotuloSituacao(situacao: string): string {
    switch (situacao) {
      case 'DISPONIVEL': return 'Disponível';
      case 'RESERVADO': return 'Reservado';
      case 'VENDIDO': return 'Vendido';
      default: return situacao || 'Indefinida';
    }
  }

  classeSituacao(situacao: string): string {
    const valor = (situacao ?? '').toLowerCase();
    return 'badge-situacao badge-' + (valor || 'indefinida');
  }

  tentarNovamente(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.carregar(id);
    }
  }

  /** Leva o veículo escolhido para o formulário de agendamento (exige login). */
  agendar(): void {
    if (!this.veiculo) {
      return;
    }

    if (!localStorage.getItem('token')) {
      this.router.navigate(['/login']);
      return;
    }

    this.router.navigate(['/main'], { queryParams: { carro: this.veiculo.id } });
  }
}
