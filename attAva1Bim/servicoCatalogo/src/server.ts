import express from 'express';
import cors from 'cors';
import { logger } from './middlewares/logger';
import { errorHandler } from './middlewares/errorHandler';
import { recursosRoutes } from './routes/recursos.routes';

const app = express();
app.use(cors());
app.use(express.json());
app.use(logger);

app.use('/recursos', recursosRoutes);

app.use(errorHandler);

app.listen(3001, () => {
  console.log('Catálogo a correr em http://localhost:3001');
});