export type StatusAgendamento = 'PENDENTE' | 'CONFIRMADO' | 'CONCLUIDO' | 'CANCELADO';

export interface Agendamento {
  id: number;
  idCarro: number | null;
  veiculo: string | null;
  fotografia: string | null;
  cliente: string | null;
  /** ISO local, ex.: 2026-11-20T14:30:00 */
  dataHora: string;
  observacao: string | null;
  status: StatusAgendamento;
  criadoEm: string;
}

export interface NovoAgendamento {
  /** só o ADMIN envia: cliente para quem o test drive está sendo agendado */
  idCliente?: number | null;
  idCarro: number;
  /** ISO local sem timezone, ex.: 2026-11-20T14:30:00 */
  dataHora: string;
  observacao?: string | null;
}
