import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AutenticacaoService } from '../../service/autenticacao.service';

/** Valida se "senha" e "confirmarSenha" são iguais. */
function senhasIguais(group: AbstractControl): ValidationErrors | null {
  const senha = group.get('senha')?.value;
  const confirmarSenha = group.get('confirmarSenha')?.value;

  return senha === confirmarSenha ? null : { senhasDiferentes: true };
}

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private autenticacaoService = inject(AutenticacaoService);
  private router = inject(Router);

  modo: 'login' | 'cadastro' = 'login';
  enviando = false;
  mensagem: { tipo: 'sucesso' | 'erro'; texto: string } | null = null;

  loginForm = this.fb.group({
    nome: ['', Validators.required],
    senha: ['', Validators.required]
  });

  cadastroForm = this.fb.group(
    {
      nome: ['', Validators.required],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      confirmarSenha: ['', Validators.required]
    },
    { validators: senhasIguais }
  );

  get senhasDiferentes(): boolean {
    const confirmar = this.cadastroForm.get('confirmarSenha');
    return !!this.cadastroForm.hasError('senhasDiferentes') && !!confirmar?.touched;
  }

  alternarModo(): void {
    this.modo = this.modo === 'login' ? 'cadastro' : 'login';
    this.mensagem = null;
    this.enviando = false;
    this.loginForm.reset();
    this.cadastroForm.reset();
  }

  entrar(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { nome, senha } = this.loginForm.getRawValue();
    if (!nome || !senha) return;

    this.enviando = true;
    this.mensagem = null;

    this.autenticacaoService.login(nome, senha).subscribe({
      next: (resposta) => {
        this.enviando = false;
        localStorage.setItem('token', resposta.token);
        localStorage.setItem('perfil', resposta.perfil);

        // ADMIN vê tudo; CLIENTE cai direto no agendamento (menu filtrado no MainComponent)
        this.router.navigate(['/main']);
      },
      error: (erro) => {
        this.enviando = false;
        console.error('Não foi possível fazer login:', erro);
        this.mensagem = {
          tipo: 'erro',
          texto:
            erro.status === 401
              ? 'Usuário ou senha inválidos.'
              : 'Não foi possível entrar. Verifique se o servidor está no ar.'
        };
      }
    });
  }

  cadastrar(): void {
    if (this.cadastroForm.invalid) {
      this.cadastroForm.markAllAsTouched();
      return;
    }

    const { nome, senha } = this.cadastroForm.getRawValue();
    if (!nome || !senha) return;

    this.enviando = true;
    this.mensagem = null;

    this.autenticacaoService.registrar(nome, senha).subscribe({
      next: () => {
        this.enviando = false;
        this.loginForm.patchValue({ nome });
        this.cadastroForm.reset();
        this.modo = 'login';
        this.mensagem = { tipo: 'sucesso', texto: 'Conta criada com sucesso! Faça login.' };
      },
      error: (erro) => {
        this.enviando = false;
        console.error('Não foi possível cadastrar:', erro);

        const detalhe =
          typeof erro?.error === 'string' && erro.error.trim() ? erro.error.trim() : null;

        this.mensagem = {
          tipo: 'erro',
          texto:
            detalhe ??
            (erro.status === 409
              ? 'Esse nome de usuário já está cadastrado.'
              : 'Não foi possível criar a conta. Tente novamente.')
        };
      }
    });
  }
}
