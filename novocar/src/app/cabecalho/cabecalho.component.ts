import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';

@Component({
    selector: 'app-cabecalho',
    imports: [RouterModule, RouterLink],
    templateUrl: './cabecalho.component.html',
    styleUrl: './cabecalho.component.css'
})
export class CabecalhoComponent {
  private router = inject(Router);

  // lido ao criar o componente (a home é recriada a cada navegação para "/")
  logado = !!localStorage.getItem('token');

  // items do menu Navibar
  itemsMenu = [
  { rotulo: 'Modelos',  secao: 'Modelos'  },
  { rotulo: 'Serviços', secao: 'Servicos' },
  { rotulo: 'Sobre',    secao: 'Sobre'    },
  { rotulo: 'Contato',  secao: 'Contato'  }, // criar a seção no corpo
];

  //Para rolar para sessão
  rolarPara(section: string)
  { document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' }); }

  sair(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('perfil');
    this.logado = false;
    this.router.navigate(['/login']);
  }
}
