import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  // Não manda token na rota de login (nem se houver um token velho)
  if (!token || req.url.includes('/auth/login')) {
    return next(req);
  }

  const requisicaoComToken = req.clone({
    setHeaders: { Authorization: `Bearer ${token}` }
  });

  return next(requisicaoComToken).pipe(
    catchError((erro: HttpErrorResponse) => {
      // Token expirado/inválido → volta para o login
      if (erro.status === 401 || erro.status === 403) {
        localStorage.removeItem('token');
        localStorage.removeItem('perfil');
        router.navigate(['/login']);
      }
      return throwError(() => erro);
    })
  );
};
