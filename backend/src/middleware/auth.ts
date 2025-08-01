import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload as DefaultJwtPayload } from 'jsonwebtoken';
import config from '../config/config';
import User from '../models/User';
import { createError } from './errorHandler';

// Định nghĩa kiểu Payload riêng (bổ sung nếu muốn mở rộng)
interface CustomJwtPayload extends DefaultJwtPayload {
  id: string;
  role: string;
}

// Mở rộng lại Express Request để thêm `user`
declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      id: string;
      role: string;
    };
  }
}

/**
 * Xác thực người dùng từ JWT
 */
export async function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return next(createError('Access token is missing or invalid', 401));
  }

  const token = authHeader.split(' ')[1];

  let decoded: CustomJwtPayload;

  try {
    decoded = jwt.verify(token, config.jwtSecret) as CustomJwtPayload;
  } catch {
    return next(createError('Token is invalid or expired', 401));
  }

  try {
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return next(createError('User not found or deleted', 401));
    }

    req.user = {
      id: decoded.id,
      role: decoded.role
    };

    next();
  } catch (err) {
    console.error('Auth error:', err);
    return next(createError('Authentication failed internally', 500));
  }
}

/**
 * Phân quyền theo vai trò
 */
export function authorize(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(createError('User not authenticated', 401));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(createError('Permission denied', 403));
    }

    next();
  };
}
