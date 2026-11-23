import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { CorpoFilhoComponent } from '../corpo-filho/corpo-filho.component';
import { CarrosService } from '../service/carros.service';
import { Carro } from '../interfaces/carro';

@Component({
  selector: 'app-corpo',
  imports: [CommonModule, CorpoFilhoComponent, RouterLink],
  templateUrl: './corpo.component.html',
  styleUrl: './corpo.component.css'
})
export class CorpoComponent implements OnInit {
  private carrosService = inject(CarrosService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  carros: Carro[] = [];
  carregando = true;
  veiculoSelecionado: Carro | null = null;

  // imagens do carrossel
  imagensCarrocell: Array<{ imagem: string; titulo: string; paragrafo: string; classe: string }> = [
    {
      imagem: './assets/imagens/01.gif',
      titulo: 'Carros Esportivos',
      paragrafo: 'Os melhores carros você só encontra aqui!',
      classe: 'carousel-item active'
    },
    {
      imagem: './assets/imagens/02.gif',
      titulo: 'Máquinas Incríveis',
      paragrafo: 'Temos carros incríveis para você que busca excelência e desempenho!',
      classe: 'carousel-item'
    },
    {
      imagem: './assets/imagens/03.gif',
      titulo: 'Você merece',
      paragrafo: 'Venha conhecer nossa coleção exclusiva e descubra um novo mundo.',
      classe: 'carousel-item'
    }
  ];

  // cards de serviços
  cardServicos: Array<{ urlImagem: string; titulo: string; descricao: string; icone: string }> = [
    {
      urlImagem:
        './assets/imagens/servico.jpeg',
      titulo: 'Agende seu serviço online',
      descricao: 'Escolha o dia e o horário direto pelo site, sem fila e sem ligação.',
      icone: 'bi-calendar-check'
    },
    {
      urlImagem:
        './assets/imagens/revisao.jpg',
      titulo: 'Revisão',
      descricao: 'Revisões com peças originais e mecânicos certificados pela fábrica.',
      icone: 'bi-wrench-adjustable'
    },
    {
      urlImagem:
        './assets/imagens/remoto.jpg',
      titulo: 'Assistência remota',
      descricao: 'Suporte 24h para você nunca ficar na mão, onde estiver.',
      icone: 'bi-headset'
    }
  ];

  // faixa de diferenciais abaixo do carrossel
  diferenciais: Array<{ icone: string; titulo: string; texto: string }> = [
    { icone: 'bi-patch-check', titulo: 'Procedência garantida', texto: 'Laudo cautelar em todos os veículos' },
    { icone: 'bi-credit-card', titulo: 'Financiamento', texto: 'Simulação em até 60 meses' },
    { icone: 'bi-calendar-check', titulo: 'Test drive', texto: 'Agende online e dirija' },
    { icone: 'bi-shield-check', titulo: 'Garantia', texto: '3 meses de cobertura inclusa' }
  ];

  // números da seção "Sobre"
  numeros: Array<{ valor: string; rotulo: string }> = [
    { valor: '12+', rotulo: 'anos de mercado' },
    { valor: '4.800', rotulo: 'veículos entregues' },
    { valor: '98%', rotulo: 'clientes satisfeitos' }
  ];

  ngOnInit(): void {
    this.onGetCarros();

    // veio de outra página com "/#Modelos" (ex.: "Ver todos os modelos")
    this.route.fragment.subscribe((fragmento) => {
      if (!fragmento) {
        return;
      }

      setTimeout(() => {
        document.getElementById(fragmento)?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    });
  }

  onGetCarros(): void {
    this.carregando = true;

    this.carrosService.getCarros().subscribe({
      next: (response) => {
        this.carros = response;
        this.carregando = false;
      },
      error: (error) => {
        console.error('Erro ao obter carros:', error);
        this.carregando = false;
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
      default: return situacao;
    }
  }

  // classe css do selo de situação (nunca quebra se vier nulo)
  classeSituacao(situacao: string): string {
    const valor = (situacao ?? '').toLowerCase();
    return 'badge-situacao badge-' + (valor || 'indefinida');
  }

  abrirInteresse(veiculo: Carro): void {
    this.veiculoSelecionado = veiculo;
  }

  irParaAgendamento(veiculo?: Carro | null): void {
    if (!localStorage.getItem('token')) {
      this.router.navigate(['/login']);
      return;
    }

    // leva o veículo escolhido na home para o formulário de agendamento
    this.router.navigate(['/main'], veiculo?.id ? { queryParams: { carro: veiculo.id } } : {});
  }

  // chamado pelo banner do corpo-filho
  evento(): void {
    this.rolarPara('Modelos');
  }

  topFunction(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  rolarPara(section: string): void {
    document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
  }
}
