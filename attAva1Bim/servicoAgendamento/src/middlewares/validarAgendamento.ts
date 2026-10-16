import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';

export function validarAgendamento(req: Request, res: Response, next: NextFunction) {
  const { solicitante, curso, recursoId, data, horario, finalidade } = req.body;

  if (!solicitante || !curso || recursoId === undefined || !data || !horario || !finalidade) {
    throw new AppError("Campos obrigatórios ausentes", 400, "servico-agendamentos");
  }
  if (typeof recursoId !== 'number') {
    throw new AppError("O recursoId precisa ser um número", 400, "servico-agendamentos");
  }
  next();
}