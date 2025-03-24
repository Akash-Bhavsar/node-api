import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middlewares/authenticateToken';

const router = express.Router();
const prisma = new PrismaClient();

// GET tasks for the authenticated user (regular users)
router.get('/my-tasks', authenticateToken, async (req: Request, res: Response) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { userId: (req.user as any).id },
    });
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get tasks' });
  }
});

// GET tasks: If user role is ADMIN, get all tasks; else only their tasks
router.get('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const user = req.user as any;
    const tasks = user.role === 'ADMIN'
      ? await prisma.task.findMany()
      : await prisma.task.findMany({ where: { userId: user.id } });
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get tasks' });
  }
});

// POST /api/tasks - Create a new task for the authenticated user
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  const { title, description, status } = req.body as { title: string; description?: string; status: string };
  try {
    const user = req.user as any;
    const task = await prisma.task.create({
      data: {
        title,
        description,
        status,
        userId: user.id,
      },
    });
    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// PUT /api/tasks/:id - Update an existing task
router.put('/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { title, description, status } = req.body as { title: string; description?: string; status: string };
  try {
    const user = req.user as any;
    const result = await prisma.task.updateMany({
      where: {
        id: parseInt(id),
        userId: user.id,
      },
      data: {
        title,
        description,
        status,
      },
    });

    if (result.count === 0) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    const updatedTask = await prisma.task.findUnique({
      where: { id: parseInt(id) },
    });

    res.json(updatedTask);
    return;
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update task' });
    return;
  }
});


// DELETE /api/tasks/:id - Delete a task
router.delete('/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const user = req.user as any;
    const result = await prisma.task.deleteMany({
      where: {
        id: parseInt(id),
        userId: user.id,
      },
    });

    if (result.count === 0) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    res.json({ message: 'Task deleted successfully' });
    return;
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete task' });
    return;
  }
});


export default router;
