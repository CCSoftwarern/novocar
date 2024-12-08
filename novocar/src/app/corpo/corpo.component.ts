import { Component } from '@angular/core';

@Component({
  selector: 'app-corpo',
  standalone: true,
  imports: [],
  templateUrl: './corpo.component.html',
  styleUrl: './corpo.component.css'
})
export class CorpoComponent {
  //imagens carrosel
  imagensCarrocel: string[]= ['./assets/imagens/01.JPG','./assets/imagens/02.JPG','./assets/imagens/03.JPG'];

  confirmar: boolean = true;

  // Criando um array com os meus cards de carros 

  cardCarros: Array<{urlImagem:string, titulo:string, valor:number, breveDescricao:string}>=[
    {urlImagem:'https://nxboats.com.br/wp-content/uploads/2023/11/Lamborghini.jpg', titulo: 'Lamborghini', valor:100255.00, breveDescricao: 'A Lamborghini é sinônimo de potência, design inovador e exclusividade. Fundada em 1963 na Itália, a marca é conhecida por seus carros esportivos de alto desempenho, que combinam uma estética agressiva e futurista com uma engenharia de ponta.'},
    {urlImagem:'https://nxboats.com.br/wp-content/uploads/2023/11/aston-martin.jpg', titulo: 'Aston Martin', valor:500255.00, breveDescricao: ''},
    {urlImagem:'https://nxboats.com.br/wp-content/uploads/2023/11/ferrari.jpg', titulo: 'Ferrari', valor:800255.00, breveDescricao: ''}
  ];

  cardServicos: Array<{urlImagem:string, titulo:string}>=[
    {urlImagem: 'https://assets.static-gm.com/Assets/642e8290-946c-450e-9225-537890d03fd4/0f0aad35-fa24-4014-ad09-f258a37df7cf/v-1628642228/Desktop.webp', titulo: 'Faça seu agendamento do serviço online'},
    {urlImagem: 'https://assets.static-gm.com/Assets/642e8290-946c-450e-9225-537890d03fd4/3b8d7ffc-0d4f-4d9d-99d1-ee99a833cd5d/v-1628642429/Desktop.webp', titulo: 'Revisão'},
    {urlImagem: 'https://assets.static-gm.com/Assets/642e8290-946c-450e-9225-537890d03fd4/62fc73aa-e57f-4ef3-9b80-80082150e4ca/v-1628642408/Desktop.webp', titulo: 'Assistência remota'}
  ];


  constructor() { };

  verConfirmar(){
    this.confirmar = true;
  }



}
