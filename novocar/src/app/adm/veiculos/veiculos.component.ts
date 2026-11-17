import { Component, OnInit, ViewChild, inject } from '@angular/core';
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
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService, MessageService } from 'primeng/api';

import { CarrosService } from '../../service/carros.service';
import { Carro } from '../../interfaces/carro';
import { FileUploadModule, FileSelectEvent, FileUpload } from 'primeng/fileupload';
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
    ConfirmDialogModule,
    TooltipModule,
    FileUploadModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './veiculos.component.html',
  styleUrl: './veiculos.component.css'
})
export class VeiculosComponent implements OnInit {
  private carrosService = inject(CarrosService);
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  carros: Carro[] = [];

  // perfil vem do login; CLIENTE só visualiza
  readonly isAdmin = localStorage.getItem('perfil') === 'ADMIN';

  visible = false;
  salvando = false;
  editando = false;
  idEditando: number | null = null;
  arquivoSelecionado: File | null = null;
  previewUrl: string | null = null;

  // popup de detalhes (somente leitura)
  visibleDetalhes = false;
  detalhes: Carro | null = null;

  @ViewChild('uploader') uploader?: FileUpload;

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

  showDialog(veiculo?: Carro): void {
    this.editando = !!veiculo;
    this.idEditando = veiculo?.id ?? null;
    this.arquivoSelecionado = null;
    this.limparPreview();

    this.carroForm.reset({ situacao: 'DISPONIVEL', quilometragem: 0 });

    if (veiculo) {
      this.carroForm.patchValue({
        marca: veiculo.marca,
        modelo: veiculo.modelo,
        anofabricacao: veiculo.anofabricacao,
        ano: veiculo.ano,
        cor: veiculo.cor,
        quilometragem: veiculo.quilometragem,
        tipoCombustivel: veiculo.tipoCombustivel,
        tipoTransmissao: veiculo.tipoTransmissao,
        preco: veiculo.preco,
        descricao: veiculo.descricao,
        situacao: veiculo.situacao,
        fotografiaPrincipal: veiculo.fotografiaPrincipal ?? ''
      });

      // mostra a foto atual até o usuário escolher outra
      this.previewUrl = veiculo.fotografiaPrincipal || null;
    }

    this.visible = true;

    // limpa o input de arquivo depois que o diálogo é renderizado
    setTimeout(() => this.uploader?.clear());
  }

  abrirDetalhes(veiculo: Carro): void {
    this.detalhes = veiculo;
    this.visibleDetalhes = true;
  }

  editarDoDetalhe(): void {
    const veiculo = this.detalhes;
    this.visibleDetalhes = false;
    if (veiculo) {
      // espera o diálogo de detalhes fechar antes de abrir o de edição
      setTimeout(() => this.showDialog(veiculo));
    }
  }

  excluir(veiculo: Carro): void {
    this.confirmationService.confirm({
      header: 'Excluir veículo',
      message: `Deseja excluir "${veiculo.marca} ${veiculo.modelo}"? Essa ação não pode ser desfeita.`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Excluir',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.carrosService.deleteCarro(veiculo.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Excluído',
              detail: `Veículo "${veiculo.marca} ${veiculo.modelo}" removido.`
            });
            this.getListaCarros();
          },
          error: (erro) => {
            console.error('Erro ao excluir veículo:', erro);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Não foi possível excluir o veículo.'
            });
          }
        });
      }
    });
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
    return;
  }

  this.enviarCarro();
}

private enviarCarro(urlImagem?: string): void {
  const carro = this.carroForm.getRawValue() as Omit<Carro, 'id'>;

  if (urlImagem) {
    carro.fotografiaPrincipal = urlImagem;
  }

  const requisicao =
    this.editando && this.idEditando
      ? this.carrosService.putCarro(this.idEditando, carro)
      : this.carrosService.postCarro(carro);

  requisicao.subscribe({
    next: () => {
      this.salvando = false;
      this.visible = false;
      this.arquivoSelecionado = null;
      this.limparPreview();
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: this.editando
          ? 'Veículo atualizado com sucesso!'
          : 'Veículo cadastrado com sucesso!'
      });
      this.getListaCarros();
    },
    error: (erro) => {
      this.salvando = false;
      console.error('Erro ao salvar carro:', erro);
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: this.editando
          ? 'Falha ao atualizar o veículo.'
          : 'Falha ao cadastrar o veículo.'
      });
    }
  });
}

  invalido(campo: string): boolean {
    const control = this.carroForm.get(campo);
    return !!control && control.invalid && control.touched;
  }

  rotuloSituacao(situacao: string): string {
    switch (situacao) {
      case 'DISPONIVEL': return 'Disponível';
      case 'RESERVADO': return 'Reservado';
      case 'VENDIDO': return 'Vendido';
      default: return situacao;
    }
  }

  severidadeSituacao(situacao: string): 'success' | 'warn' | 'danger' | 'secondary' {
    switch (situacao) {
      case 'DISPONIVEL': return 'success';
      case 'RESERVADO': return 'warn';
      case 'VENDIDO': return 'danger';
      default: return 'secondary';
    }
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
    // só revoga URLs criadas por createObjectURL; a URL do servidor não deve ser revogada
    if (this.previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(this.previewUrl);
    }
    this.previewUrl = null;
  }
}

removerArquivo(): void {
  this.arquivoSelecionado = null;
  this.limparPreview();
  this.carroForm.patchValue({ fotografiaPrincipal: '' });
  this.uploader?.clear();
}


}
