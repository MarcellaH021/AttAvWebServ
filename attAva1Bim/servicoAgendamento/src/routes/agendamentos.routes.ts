import { Router } from 'express';
import { AgendamentosController } from '../controllers/agendamentos.controller';
import { verificarToken } from '../middlewares/verificarToken';
import { validarAgendamento } from '../middlewares/validarAgendamento';

export const agendamentosRoutes = Router();
const controller = new AgendamentosController();

agendamentosRoutes.get('/', controller.listar);
agendamentosRoutes.get('/:id', controller.buscarPorId);
agendamentosRoutes.post('/', validarAgendamento, controller.criar);
agendamentosRoutes.patch('/:id/status', verificarToken, controller.atualizarStatus);
agendamentosRoutes.delete('/:id', verificarToken, controller.remover);