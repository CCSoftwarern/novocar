import { Component } from '@angular/core';
import { CabecalhoComponent } from "../cabecalho/cabecalho.component";
import { CorpoComponent } from "../corpo/corpo.component";
import { RodapeComponent } from "../rodape/rodape.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CabecalhoComponent, CorpoComponent, RodapeComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
