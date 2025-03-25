import express, {Request, Response } from 'express';
import morgan from 'morgan';
import logger from './utils/logger';
import dotenv from 'dotenv';
import userRoutes from './routes/users';
import taskRoutes from './routes/tasks';
import cors from 'cors';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use(
  morgan('combined', {
    stream: {
      write: (message: string) => {
        logger.info(message.trim());
      },
    },
  })
);
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

app.get('/', (req: Request, res: Response) => {
  logger.info('Handling GET / request'); // Winston app-level log
  res.send('Welcome to the Task Manager API.');
});

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

export default app;
