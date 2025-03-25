import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middlewares/authenticateToken';
import logger from '../utils/logger'; // <---- Winston logger import

const router = express.Router();
const prisma = new PrismaClient();

// GET tasks for the authenticated user (regular users)
router.get('/my-tasks', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any).id;
    logger.info(`GET /my-tasks called by userId=${userId}`);

    const tasks = await prisma.task.findMany({
      where: { userId },
    });

    logger.info(`Successfully fetched ${tasks.length} tasks for userId=${userId}`);
    res.json(tasks);
  } catch (err) {
    logger.error(`Failed to get tasks for /my-tasks: ${(err as Error).message}`, { error: err });
    res.status(500).json({ error: 'Failed to get tasks' });
  }
});

// GET tasks: If user role is ADMIN, get all tasks; else only their tasks
router.get('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const user = req.user as any;
    logger.info(`GET /tasks called by userId=${user.id}, role=${user.role}`);

    let tasks;
    if (user.role === 'ADMIN') {
      tasks = await prisma.task.findMany();
      logger.info(`ADMIN user fetched all tasks (count=${tasks.length})`);
    } else {
      tasks = await prisma.task.findMany({ where: { userId: user.id } });
      logger.info(`USER userId=${user.id} fetched ${tasks.length} tasks`);
    }

    res.json(tasks);
  } catch (err) {
    logger.error(`Failed to get tasks for /: ${(err as Error).message}`, { error: err });
    res.status(500).json({ error: 'Failed to get tasks' });
  }
});

// POST /api/tasks - Create a new task
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  const { title, description, status } = req.body as {
    title: string;
    description?: string;
    status: string;
  };

  try {
    const user = req.user as any;
    logger.info(`POST /tasks called by userId=${user.id} to create task: title="${title}"`);

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status,
        userId: user.id,
      },
    });

    logger.info(`Task (id=${task.id}) created successfully by userId=${user.id}`);
    res.status(201).json(task);
  } catch (err) {
    logger.error(`Failed to create task: ${(err as Error).message}`, { error: err });
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// PUT /api/tasks/:id - Update an existing task
router.put('/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { title, description, status } = req.body as {
    title: string;
    description?: string;
    status: string;
  };

  try {
    const user = req.user as any;
    logger.info(`PUT /tasks/${id} by userId=${user.id} with data={title:${title}, status:${status}}`);

    const result = await prisma.task.updateMany({
      where: {
        id: parseInt(id),
        userId: user.id,
      },
      data: { title, description, status },
    });

    if (result.count === 0) {
      logger.warn(`User userId=${user.id} attempted to update non-existent or unauthorized task id=${id}`);
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    const updatedTask = await prisma.task.findUnique({
      where: { id: parseInt(id) },
    });

    logger.info(`Task (id=${id}) updated successfully by userId=${user.id}`);
    res.json(updatedTask);
  } catch (err) {
    logger.error(`Failed to update task id=${id}: ${(err as Error).message}`, { error: err });
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// DELETE /api/tasks/:id - Delete a task
router.delete('/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const user = req.user as any;
    logger.info(`DELETE /tasks/${id} called by userId=${user.id}`);

    const result = await prisma.task.deleteMany({
      where: {
        id: parseInt(id),
        userId: user.id,
      },
    });

    if (result.count === 0) {
      logger.warn(`User userId=${user.id} attempted to delete non-existent or unauthorized task id=${id}`);
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    logger.info(`Task (id=${id}) deleted successfully by userId=${user.id}`);
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    logger.error(`Failed to delete task id=${id}: ${(err as Error).message}`, { error: err });
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

export default router;
