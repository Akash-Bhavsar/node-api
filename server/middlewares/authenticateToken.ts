import { Request, Response, NextFunction } from 'express';
import jwt, { VerifyErrors, JwtPayload } from 'jsonwebtoken';
import { Role } from '@prisma/client';

interface DecodedUser extends JwtPayload {
  id: number;
  username: string;
  role?: Role;
}

declare global {
  namespace Express {
    interface Request {
      user?: DecodedUser;
      userId?: number; // strictly a number, no null
    }
  }
}

export function authenticateToken(req: Request, res: Response, next: NextFunction): void {
  const token = req.cookies?.accessToken;
  if (!token) {
    res.status(401).json({ error: 'Login Invalid or Token missing' });
    return
  }

  // Provide either no options or an explicit empty object as the third arg:
  jwt.verify(token, process.env.JWT_SECRET as string, (err: VerifyErrors | null, decoded: unknown) => {
    if (err || !decoded) {
      return res.status(403).json({ error: 'Unauthorized', message: err?.message });
    }

    // If you’re sure your payload always has `id`, `username`, etc., you can cast
    const decodedUser = decoded as DecodedUser;
    req.user = decodedUser;
    req.userId = decodedUser.id;
    next();
  });
}
