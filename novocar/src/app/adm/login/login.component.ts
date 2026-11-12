import { AutenticacaoService } from './../../service/autenticacao.service';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private autenticacaoService = inject(AutenticacaoService);
  private router = inject(Router);

  loginForm = this.fb.group({
    nome: ['', Validators.required],
    senha: ['', Validators.required]
  });

  entrar(): void {
  if (this.loginForm.invalid) {
    this.loginForm.markAllAsTouched();
    return;
  }

  const { nome, senha } = this.loginForm.getRawValue();

  if (nome === null || senha === null) return;

  this.autenticacaoService.login(nome, senha).subscribe({
   next: (resposta) => {
        localStorage.setItem('token', resposta.token);
        localStorage.setItem('perfil', resposta.perfil);   // útil pra guardar o perfil
        this.router.navigate(['/main']);                   // <<< redireciona
      },
      error: (erro) => {
        console.error('Não foi possível fazer login:', erro);
      }
  })

}
}
