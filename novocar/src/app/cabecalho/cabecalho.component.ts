import { Component } from '@angular/core';

@Component({
  selector: 'app-cabecalho',
  standalone: true,
  imports: [],
  templateUrl: './cabecalho.component.html',
  styleUrl: './cabecalho.component.css'
})
export class CabecalhoComponent {
  // items do menu Navibar
  itemsMenu:string[] = ['Modelos', 'Servicos', 'Sobre', 'Contato'];
  
  //Para rolar para sessão 
  rolarPara(section: string) 
  { document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' }); }
}
