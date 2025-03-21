const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Authentication middleware to verify JWT tokens
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user; // Attach user data to request
    next();
  });
}


// Regular users only see their own tasks (as an example)
router.get('/my-tasks', authenticateToken, async (req, res) => {
  const tasks = await prisma.task.findMany({
    where: { userId: req.user.id },
  });
  res.json(tasks);
});

// GET /api/tasks - Get all tasks for the authenticated user
router.get('/', authenticateToken, async (req, res) => {
  try {
    let tasks;
    if (req.user.role === 'ADMIN') {
      // If the user is an admin, fetch all tasks
      tasks = await prisma.task.findMany();
    } else {
      // If the user is not an admin, fetch only their tasks
      tasks = await prisma.task.findMany({
        where: {
          userId: req.user.id,
        },
      });
    }
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get tasks' });
  }
});


// POST /api/tasks - Create a new task for the authenticated user
router.post('/', authenticateToken, async (req, res) => {
  const { title, description, status } = req.body;
  try {
    const task = await prisma.task.create({
      data: {
        title,
        description,
        status,
        userId: req.user.id,
      },
    });
    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// PUT /api/tasks/:id - Update an existing task
router.put('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;
  try {
    const task = await prisma.task.updateMany({
      where: {
        id: parseInt(id),
        userId: req.user.id,
      },
      data: {
        title,
        description,
        status,
      },
    });

    if (task.count === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const updatedTask = await prisma.task.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    res.json(updatedTask);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// DELETE /api/tasks/:id - Delete a task
router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const task = await prisma.task.deleteMany({
      where: {
        id: parseInt(id),
        userId: req.user.id,
      },
    });

    if (task.count === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

module.exports = router;
