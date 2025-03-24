import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function authenticateToken(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Expected format: "Bearer TOKEN"

  if (!token) {
    res.status(401).json({ error: 'Login Invalid or Token missing' });
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
    if (err) {
      res.status(403).json({ error: 'Unauthorized', message: err.message });
      return;
    }
    req.user = user; // Attach the decoded user to the request
    req.userId = (user as any).id; // Set userId for convenience
    next();
  });
}
