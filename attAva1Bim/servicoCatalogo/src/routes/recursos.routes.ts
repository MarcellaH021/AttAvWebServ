import { Router } from 'express';
import { RecursosController } from '../controllers/recursos.controller';
import { verificarToken } from '../middlewares/verificarToken';
import { validarRecurso } from '../middlewares/validarRecurso';

export const recursosRoutes = Router();
const controller = new RecursosController();

recursosRoutes.get('/', controller.listar);
recursosRoutes.get('/:id', controller.buscarPorId);
recursosRoutes.post('/', validarRecurso, controller.criar);
recursosRoutes.patch('/:id/status', verificarToken, controller.atualizarStatus);