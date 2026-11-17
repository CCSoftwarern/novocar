import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { CarrosService } from '../../service/carros.service';
import { Carro } from '../../interfaces/carro';
import { FileUploadModule, FileSelectEvent } from 'primeng/fileupload';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-veiculos',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    TagModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    SelectModule,
    TextareaModule,
    ToastModule,
    FileUploadModule
  ],
  providers: [MessageService],
  templateUrl: './veiculos.component.html',
  styleUrl: './veiculos.component.css'
})
export class VeiculosComponent implements OnInit {
  private carrosService = inject(CarrosService);
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);

  carros: Carro[] = [];

  visible = false;
  salvando = false;
  arquivoSelecionado: File | null = null;
  previewUrl: string | null = null;

  readonly combustiveis = [
    { label: 'Gasolina', value: 'GASOLINA' },
    { label: 'Etanol', value: 'ETANOL' },
    { label: 'Flex', value: 'FLEX' },
    { label: 'Diesel', value: 'DIESEL' },
    { label: 'Híbrido', value: 'HIBRIDO' },
    { label: 'Elétrico', value: 'ELETRICO' }
  ];

  readonly transmissoes = [
    { label: 'Manual', value: 'MANUAL' },
    { label: 'Automática', value: 'AUTOMATICA' },
    { label: 'Automatizada', value: 'AUTOMATIZADA' },
    { label: 'CVT', value: 'CVT' }
  ];

  readonly situacoes = [
    { label: 'Disponível', value: 'DISPONIVEL' },
    { label: 'Vendido', value: 'VENDIDO' },
    { label: 'Reservado', value: 'RESERVADO' }
  ];

  carroForm = this.fb.group({
    marca: ['', Validators.required],
    modelo: ['', Validators.required],
    anofabricacao: [null as number | null, Validators.required],
    ano: [null as number | null, Validators.required],
    cor: ['', Validators.required],
    quilometragem: [0 as number | null, [Validators.required, Validators.min(0)]],
    tipoCombustivel: [null as string | null, Validators.required],
    tipoTransmissao: [null as string | null, Validators.required],
    preco: [null as number | null, [Validators.required, Validators.min(0)]],
    descricao: [''],
    situacao: ['DISPONIVEL', Validators.required],
    fotografiaPrincipal: ['']
  });

  ngOnInit(): void {
    this.getListaCarros();
  }

  getListaCarros(): void {
    this.carrosService.getCarros().subscribe({
      next: (data: Carro[]) => (this.carros = data),
      error: () =>
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível carregar os veículos.'
        })
    });
  }

  showDialog(): void {
    this.carroForm.reset({ situacao: 'DISPONIVEL', quilometragem: 0 });
    this.visible = true;
  }

salvar(): void {
  if (this.carroForm.invalid) {
    this.carroForm.markAllAsTouched();
    return;
  }

  this.salvando = true;

  if (this.arquivoSelecionado) {
   this.carrosService.uploadImagem(this.arquivoSelecionado).subscribe({
  next: (mensagem) => {
    const nomeArquivo = mensagem.replace('Imagem salva com sucesso:', '').trim();
    this.enviarCarro(`${environment.apiUrl}/uploads/${nomeArquivo}`);
  },
  error: (erro) => {
    this.salvando = false;
    console.error('Erro no upload:', erro);
    this.messageService.add({
      severity: 'error',
      summary: 'Erro',
      detail: 'Falha ao enviar a imagem.'
    });
  }
});
  }
}

private enviarCarro(urlImagem?: string): void {
  const carro = this.carroForm.getRawValue() as Omit<Carro, 'id'>;

  if (urlImagem) {
    carro.fotografiaPrincipal = urlImagem;
  }

  this.carrosService.postCarro(carro).subscribe({
    next: () => {
      this.salvando = false;
      this.visible = false;
      this.arquivoSelecionado = null;
      this.limparPreview();
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Veículo cadastrado com sucesso!'
      });
      this.getListaCarros();
    },
    error: (erro) => {
      this.salvando = false;
      console.error('Erro ao cadastrar carro:', erro);
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Falha ao cadastrar o veículo.'
      });
    }
  });
}
  invalido(campo: string): boolean {
    const control = this.carroForm.get(campo);
    return !!control && control.invalid && control.touched;
  }

  onArquivoSelecionado(event: FileSelectEvent): void {
  const arquivo = event.files?.[0];
  if (!arquivo) return;

  if (!arquivo.type.startsWith('image/')) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Arquivo inválido',
      detail: 'Selecione um arquivo de imagem.'
    });
    return;
  }

  const limiteMb = 5;
  if (arquivo.size > limiteMb * 1024 * 1024) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Arquivo grande',
      detail: `O limite é ${limiteMb} MB.`
    });
    return;
  }

  this.arquivoSelecionado = arquivo;
  this.limparPreview();
  this.previewUrl = URL.createObjectURL(arquivo); // prévia instantânea
}

limparPreview(): void {
  if (this.previewUrl) {
    URL.revokeObjectURL(this.previewUrl); // libera memória
    this.previewUrl = null;
  }
}


}
