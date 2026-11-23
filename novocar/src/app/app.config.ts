import { ApplicationConfig, LOCALE_ID, provideZoneChangeDetection } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth.interceptor';

// deixa moeda, números e datas no padrão brasileiro
registerLocaleData(localePt);

// textos e nomes de meses/dias em português nos componentes PrimeNG
const traducaoPtBr = {
  firstDayOfWeek: 0,
  dayNames: ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'],
  dayNamesShort: ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'],
  dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
  monthNames: [
    'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
    'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
  ],
  monthNamesShort: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'],
  dateFormat: 'dd/mm/yy',
  today: 'Hoje',
  clear: 'Limpar',
  weekHeader: 'Sem',
  apply: 'Aplicar',
  accept: 'Sim',
  reject: 'Não',
  cancel: 'Cancelar',
  choose: 'Escolher',
  upload: 'Enviar',
  pending: 'Pendente',
  emptyMessage: 'Nenhum resultado encontrado',
  emptyFilterMessage: 'Nenhum resultado encontrado',
  emptySearchMessage: 'Nenhum resultado encontrado',
  chooseDate: 'Escolher data',
  chooseMonth: 'Escolher mês',
  chooseYear: 'Escolher ano',
  prevMonth: 'Mês anterior',
  nextMonth: 'Próximo mês',
  prevYear: 'Ano anterior',
  nextYear: 'Próximo ano',
  prevDecade: 'Década anterior',
  nextDecade: 'Próxima década',
  prevHour: 'Hora anterior',
  nextHour: 'Próxima hora',
  prevMinute: 'Minuto anterior',
  nextMinute: 'Próximo minuto',
  prevSecond: 'Segundo anterior',
  nextSecond: 'Próximo segundo',
  am: 'AM',
  pm: 'PM',
  searchMessage: '{0} resultados disponíveis',
  selectionMessage: '{0} itens selecionados',
  emptySelectionMessage: 'Nenhum item selecionado',
  fileChosenMessage: '{0} arquivos',
  noFileChosenMessage: 'Nenhum arquivo escolhido'
};

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
     provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimationsAsync(),
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    providePrimeNG({
          theme: {
              preset: Aura,
              options: {
              prefix: 'p',
              darkModeSelector: 'system',
              cssLayer: false
            }
          },
          translation: traducaoPtBr
      })
    ]
};
