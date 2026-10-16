import express from 'express';
import cors from 'cors';
import { logger } from './middlewares/logger';
import { errorHandler } from './middlewares/errorHandler';
import { agendamentosRoutes } from './routes/agendamentos.routes';

const app = express();
app.use(cors());
app.use(express.json());
app.use(logger);

app.use('/agendamentos', agendamentosRoutes);

app.use(errorHandler);

app.listen(3000, () => {
  console.log('Agendamentos a correr em http://localhost:3000');
});