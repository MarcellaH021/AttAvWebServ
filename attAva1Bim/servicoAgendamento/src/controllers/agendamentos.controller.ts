import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';
import { criarAgendamentoService } from '../services/agendamentos.service';

export type Agendamento = {
  id: number;
  solicitante: string;
  curso: string;
  recursoId: number;
  data: string;
  horario: string;
  finalidade: string;
  status: "pendente" | "confirmado" | "cancelado";
};

let agendamentos: Agendamento[] = [];
let proximoId = 1;

export class AgendamentosController {
  listar(req: Request, res: Response) {
    const { curso, status } = req.query;
    let resultado = [...agendamentos];

    if (curso) resultado = resultado.filter(a => a.curso === curso);
    if (status) resultado = resultado.filter(a => a.status === status);

    return res.status(200).json(resultado);
  }

  buscarPorId(req: Request, res: Response) {
    const agendamento = agendamentos.find(a => a.id === Number(req.params.id));
    if (!agendamento) throw new AppError("Agendamento não encontrado", 404, "servico-agendamentos");
    return res.status(200).json(agendamento);
  }

  async criar(req: Request, res: Response, next: NextFunction) {
    try {
      //serviço trata a integração com o Catálogo
      const resultadoFinal = await criarAgendamentoService(req.body, proximoId);
      
      agendamentos.push(resultadoFinal.agendamentoInterno);
      proximoId++;

      return res.status(201).json(resultadoFinal.respostaCliente);
    } catch (error) {
      next(error); //encaminha o erro para o errorHandler processar
    }
  }

  atualizarStatus(req: Request, res: Response) {
    const { status } = req.body;
    const agendamento = agendamentos.find(a => a.id === Number(req.params.id));
    
    if (!agendamento) throw new AppError("Agendamento não encontrado", 404, "servico-agendamentos");
    if (!["pendente", "confirmado", "cancelado"].includes(status)) {
      throw new AppError("Status inválido", 400, "servico-agendamentos");
    }

    agendamento.status = status;
    return res.status(200).json(agendamento);
  }

  remover(req: Request, res: Response) {
    const index = agendamentos.findIndex(a => a.id === Number(req.params.id));
    if (index === -1) throw new AppError("Agendamento não encontrado", 404, "servico-agendamentos");
    
    agendamentos.splice(index, 1);
    return res.status(204).send();
  }
}