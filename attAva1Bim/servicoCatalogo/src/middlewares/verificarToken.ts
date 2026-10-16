import { Request, Response, NextFunction } from 'express';

export function verificarToken(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization;
  if (token !== "Bearer ifms2026") {
    return res.status(401).json({
      mensagem: "Token inválido ou ausente",
      status: 401
    });
  }
  next();
}