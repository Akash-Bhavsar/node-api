import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/users';
import taskRoutes from './routes/tasks';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the Task Manager API.');
});

export default app;
