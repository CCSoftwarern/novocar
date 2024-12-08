import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-corpo-filho',
  standalone: true,
  imports: [],
  templateUrl: './corpo-filho.component.html',
  styleUrl: './corpo-filho.component.css'
})
export class CorpoFilhoComponent {
  
  @Input() titulo1: string = '';
  @Input() detalhes: string = '';
  @Output() acaoAlerta: EventEmitter<void> = new EventEmitter<void>();

  botaoClique(){
    this.acaoAlerta.emit();
  }
}
