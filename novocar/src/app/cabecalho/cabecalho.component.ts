import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-cabecalho',
  standalone: true,
  imports: [RouterModule, RouterLink],
  templateUrl: './cabecalho.component.html',
  styleUrl: './cabecalho.component.css'
})
export class CabecalhoComponent {


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




}
