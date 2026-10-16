import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';

export function validarRecurso(req: Request, res: Response, next: NextFunction) {
  const { nome, tipo, local, status } = req.body;

  if (!nome || !tipo || !local || !status) {
    throw new AppError("Campos obrigatórios ausentes", 400, "servico-catalogo");
  }
  if (!["laboratorio", "equipamento"].includes(tipo)) {
    throw new AppError("Tipo inválido", 400, "servico-catalogo");
  }
  if (!["disponivel", "manutencao", "indisponivel"].includes(status)) {
    throw new AppError("Status inválido", 400, "servico-catalogo");
  }
  next();
}