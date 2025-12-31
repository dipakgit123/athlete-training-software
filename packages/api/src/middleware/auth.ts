/**
 * Authentication Middleware
 * JWT-based authentication for protected routes
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError, ForbiddenError } from './errorHandler';

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: 'ADMIN' | 'COACH' | 'ATHLETE' | 'PARENT' | 'MEDICAL';
      };
    }
  }
}

// JWT payload interface
interface JwtPayload {
  id: string;
  email: string;
  role: 'ADMIN' | 'COACH' | 'ATHLETE' | 'PARENT' | 'MEDICAL';
  iat: number;
  exp: number;
}

// Get JWT secret
const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  return secret;
};

/**
 * Authenticate JWT token
 */
export function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw UnauthorizedError('No token provided');
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, getJwtSecret()) as JwtPayload;

    // Attach user to request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(UnauthorizedError('Invalid token'));
    } else if (error instanceof jwt.TokenExpiredError) {
      next(UnauthorizedError('Token expired'));
    } else {
      next(error);
    }
  }
}

/**
 * Require specific roles
 */
export function requireRole(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(UnauthorizedError('Not authenticated'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        ForbiddenError(
          `Access denied. Required roles: ${allowedRoles.join(', ')}`
        )
      );
    }

    next();
  };
}

/**
 * Require admin role
 */
export const requireAdmin = requireRole('ADMIN');

/**
 * Require coach role or higher
 */
export const requireCoach = requireRole('ADMIN', 'COACH');

/**
 * Require athlete or their coach
 */
export function requireAthleteOrCoach(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.user) {
    return next(UnauthorizedError('Not authenticated'));
  }

  const athleteId = req.params.athleteId || req.params.id;

  // Admin and coaches have access to all athletes
  if (req.user.role === 'ADMIN' || req.user.role === 'COACH') {
    return next();
  }

  // Athletes can only access their own data
  if (req.user.role === 'ATHLETE' && req.user.id === athleteId) {
    return next();
  }

  return next(ForbiddenError('Access denied'));
}

/**
 * Optional authentication - sets user if token exists
 */
export function optionalAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, getJwtSecret()) as JwtPayload;

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };
  } catch (error) {
    // Ignore invalid tokens for optional auth
  }

  next();
}

/**
 * Generate JWT token
 */
export function generateToken(payload: {
  id: string;
  email: string;
  role: string;
}): string {
  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: 60 * 60 * 24 * 7, // 7 days in seconds
  });
}

/**
 * Generate refresh token
 */
export function generateRefreshToken(userId: string): string {
  return jwt.sign({ id: userId, type: 'refresh' }, getJwtSecret(), {
    expiresIn: 60 * 60 * 24 * 30, // 30 days in seconds
  });
}

// AuthRequest type for controllers - extends Express.Request with user info
export interface AuthRequest extends Request {
  userId?: string;
  userRole?: string;
}

// Middleware to populate userId and userRole from req.user
export function populateAuthRequest(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.user) {
    (req as AuthRequest).userId = req.user.id;
    (req as AuthRequest).userRole = req.user.role;
  }
  next();
}

// Middleware to add userId and userRole
export function authorize(roles: string[]) {
  return requireRole(...roles);
}

export default {
  authenticate,
  requireRole,
  requireAdmin,
  requireCoach,
  requireAthleteOrCoach,
  optionalAuth,
  generateToken,
  generateRefreshToken,
  populateAuthRequest,
};
