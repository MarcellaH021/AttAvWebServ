import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';

export function errorHandler(err: Error, request: Request, response: Response, next: NextFunction) {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      mensagem: err.message,
      status: err.statusCode,
      origem: err.origem
    });
  }

  console.error(err);
  return response.status(500).json({
    mensagem: "Erro interno do servidor",
    status: 500,
    origem: "desconhecida"
  });
}