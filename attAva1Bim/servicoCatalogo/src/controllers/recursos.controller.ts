import { Request, Response } from 'express';
import { AppError } from '../errors/AppError';

type Recurso = {
  id: number;
  nome: string;
  tipo: "laboratorio" | "equipamento";
  local: string;
  status: "disponivel" | "manutencao" | "indisponivel";
};

let recursos: Recurso[] = [
  { id: 1, nome: "Laboratório 1", tipo: "laboratorio", local: "Bloco A", status: "disponivel" },
  { id: 2, nome: "Kit Arduino", tipo: "equipamento", local: "Armário 3", status: "manutencao" }
];
let proximoId = 3;

export class RecursosController {
  listar(req: Request, res: Response) {
    const { status, tipo } = req.query;
    let resultado = [...recursos];

    if (status) resultado = resultado.filter(r => r.status === status);
    if (tipo) resultado = resultado.filter(r => r.tipo === tipo);

    return res.status(200).json(resultado);
  }

  buscarPorId(req: Request, res: Response) {
    const recurso = recursos.find(r => r.id === Number(req.params.id));
    if (!recurso) throw new AppError("Recurso não encontrado", 404, "servico-catalogo");
    return res.status(200).json(recurso);
  }

  criar(req: Request, res: Response) {
    const { nome, tipo, local, status } = req.body;
    const novoRecurso: Recurso = { id: proximoId++, nome, tipo, local, status };
    recursos.push(novoRecurso);
    return res.status(201).json(novoRecurso);
  }

  atualizarStatus(req: Request, res: Response) {
    const { status } = req.body;
    const recurso = recursos.find(r => r.id === Number(req.params.id));
    
    if (!recurso) throw new AppError("Recurso não encontrado", 404, "servico-catalogo");
    if (!["disponivel", "manutencao", "indisponivel"].includes(status)) {
      throw new AppError("Status inválido", 400, "servico-catalogo");
    }

    recurso.status = status;
    return res.status(200).json(recurso);
  }
}