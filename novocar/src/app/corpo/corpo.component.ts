import { Component, HostListener } from '@angular/core';
import { CorpoFilhoComponent } from "../corpo-filho/corpo-filho.component";

@Component({
  selector: 'app-corpo',
  standalone: true,
  imports: [CorpoFilhoComponent,],
  templateUrl: './corpo.component.html',
  styleUrl: './corpo.component.css'
})
export class CorpoComponent {

  titulo= ''
  showButton: boolean = false;

  //imagens carrosel

  imagensCarrocell: Array<{imagem:string, titulo:string, paragrafo:string, rotavermais:string, classe:string, tempo:number}>=[
    {imagem:'./assets/imagens/01.JPG', titulo: 'Carros Esportivos', paragrafo: 'Os melhores carros você só encontra aqui!', rotavermais:'', classe:'carousel-item active', tempo: 10000},
    {imagem:'./assets/imagens/02.JPG', titulo: 'Máquinas Incríveis', paragrafo: 'Temos carros incríveis para você que busca excelência e desempenho! ', rotavermais:'', classe:'carousel-item', tempo: 20000},
    {imagem:'./assets/imagens/03.JPG', titulo: 'Você merece', paragrafo: 'Venha conhecer nossa coleção exclusiva e descubra um novo mundo"', rotavermais:'', classe:'carousel-item', tempo:500}

  ]

  confirmar: boolean = true;

  // Criando um array com os meus cards de carros 

  cardCarros: Array<{urlImagem:string, titulo:string, valor:number, breveDescricao:string, disponivel:number}>=[
    {urlImagem:'https://nxboats.com.br/wp-content/uploads/2023/11/Lamborghini.jpg', titulo: 'Lamborghini', valor:1300000.00, breveDescricao: 'LAMBORGHINI GALLARDO SUPERLEGGERA LP 570-4 5.2 V10',disponivel:1},
    {urlImagem:'https://nxboats.com.br/wp-content/uploads/2023/11/aston-martin.jpg', titulo: 'Aston Martin', valor:445000.00, breveDescricao: '5.2 V12 TURBO GASOLINA 770 ULTIMATE COUPE AUTOMÁTICO',disponivel:1},
    {urlImagem:'https://nxboats.com.br/wp-content/uploads/2023/11/ferrari.jpg', titulo: 'Ferrari', valor:800255.00, breveDescricao: 'Ferrari 296 GTS 2024, supercarro híbrido de última geração, combinando um potente motor V6 biturbo',disponivel:1},
    {urlImagem:'https://fotos-jornaldocarro-estadao.nyc3.cdn.digitaloceanspaces.com/wp-content/uploads/2024/04/23154842/Mercedes-AMG-GT-63S-E-Performance-e-hibrido-plug-in-mais-rapido-da-historia-da-Mercedes.png', titulo: 'Mercedes-AMG GT 63S', valor:1635000.00, breveDescricao: 'Novo GT 63S E Performance é o Mercedes-AMG mais rápido da história',disponivel:0}
  ];

  // criando um array com os meus serviços
  cardServicos: Array<{urlImagem:string, titulo:string}>=[
    {urlImagem: 'https://assets.static-gm.com/Assets/642e8290-946c-450e-9225-537890d03fd4/0f0aad35-fa24-4014-ad09-f258a37df7cf/v-1628642228/Desktop.webp', titulo: 'Faça seu agendamento do serviço online'},
    {urlImagem: 'https://assets.static-gm.com/Assets/642e8290-946c-450e-9225-537890d03fd4/3b8d7ffc-0d4f-4d9d-99d1-ee99a833cd5d/v-1628642429/Desktop.webp', titulo: 'Revisão'},
    {urlImagem: 'https://assets.static-gm.com/Assets/642e8290-946c-450e-9225-537890d03fd4/62fc73aa-e57f-4ef3-9b80-80082150e4ca/v-1628642408/Desktop.webp', titulo: 'Assistência remota'}
  ];



  constructor() { };

  // pra confirmar a compra 

  verConfirmar(){
    this.confirmar = true;
  }


  // uma função para formatar moeda 

  formatarMoeda(valor: number): string { 
    const formatoMoeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }); 
    return formatoMoeda.format(valor); }

evento(){
  alert("Apartir daqui implementamos um simulador")
}

@HostListener('window:scroll', [])
onWindowScroll() {
 // Mostrar o botão após rolar 300px
    this.showButton = true;

}

topFunction() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

rolarPara(section: string) 
  { document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' }); }


}
