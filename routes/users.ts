import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient, Role } from '@prisma/client';
import { authenticateToken } from '../middlewares/authenticateToken';

const router = express.Router();
const prisma = new PrismaClient();

declare global {
  namespace Express {
    interface Request {
      user?: any;
      userId?: number;
    }
  }
}

// REGISTER endpoint: Create a new user
router.post('/register', async (req: Request, res: Response) => {
  const { username, password } = req.body as { username: string; password: string };
  try {
    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        username: username,
        password: hashedPassword,
      },
      select: {
        id: true,
        username: true,
      },
    });
    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// GET endpoint: List all users (requires authentication)
router.get('/users', authenticateToken, async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
      },
    });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to list users' });
  }
});

// PUT endpoint: Update a user (requires authentication)
router.put('/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  const userId = parseInt(req.params.id);
  const { username, password, role } = req.body as { username: string; password?: string; role?: Role };

  // Check if the user id from token matches the user id from params
  if (req.userId !== userId) {
    res.status(403).json({ error: 'Unauthorized: You can only update your own profile.' });
    return;
  }

  try {
    // Hash the password if it's being updated
    let hashedPassword: string | undefined;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        username: username,
        password: hashedPassword ? hashedPassword : undefined,
        role: role,
      },
      select: {
        id: true,
        username: true,
        role: true,
      },
    });
    res.json(updatedUser);
    return;
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update user' });
    return;
  }
});


// LOGIN endpoint: Authenticate user and return a JWT token
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body as { username: string; password: string };
  try {
    const user = await prisma.user.findUnique({
      where: { username: username },
    });
    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }
    // Generate a JWT token valid for 1 hour
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    );
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// DELETE endpoint: Delete a user (requires authentication)
router.delete('/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  const userId = parseInt(req.params.id);

  // Check if the user id from token matches the user id from params or if the user is an ADMIN
  const currentUser = await prisma.user.findUnique({
    where: { id: req.userId },
  });

  if (req.userId !== userId && currentUser?.role !== 'ADMIN') {
    res.status(403).json({ error: 'Unauthorized: You can only delete your own profile.' });
    return;
  }

  try {
    await prisma.user.delete({
      where: { id: userId },
    });
    res.status(200).json({ message: 'User deleted successfully' });
    return;
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete user' });
    return;
  }
});

export default router;
