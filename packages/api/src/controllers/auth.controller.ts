/**
 * Auth Controller
 * Handle authentication logic
 */

import { Request, Response, NextFunction } from 'express';
import * as bcrypt from 'bcryptjs';
import { sign, verify } from 'jsonwebtoken';
import { prisma } from '../lib/prisma';
import { NotFoundError, BadRequestError, UnauthorizedError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'athlete-system-secret-key-2024';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Register a new user
 */
export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password, firstName, lastName, role } = req.body;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw BadRequestError('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        firstName,
        lastName,
        role: role || 'ATHLETE',
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
      },
    });

    // Generate token
    const token = sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: { user, token },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Login user
 */
export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw UnauthorizedError('Invalid credentials');
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw UnauthorizedError('Invalid credentials');
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    // Generate token
    const token = sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Logout user
 */
export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    res.json({
      success: true,
      message: 'Logout successful',
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get current user profile
 */
export async function getMe(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      throw UnauthorizedError('Not authenticated');
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        profileImage: true,
        createdAt: true,
        lastLogin: true,
      },
    });

    if (!user) {
      throw NotFoundError('User');
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Update current user profile
 */
export async function updateMe(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;
    const { firstName, lastName, phone, profileImage } = req.body;

    if (!userId) {
      throw UnauthorizedError('Not authenticated');
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { firstName, lastName, phone, profileImage },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        profileImage: true,
      },
    });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Change password
 */
export async function changePassword(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;
    const { currentPassword, newPassword } = req.body;

    if (!userId) {
      throw UnauthorizedError('Not authenticated');
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw NotFoundError('User');
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isPasswordValid) {
      throw BadRequestError('Current password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: hashedPassword },
    });

    res.json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Forgot password
 */
export async function forgotPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Always return success to prevent email enumeration
    res.json({
      success: true,
      message: 'If an account exists, a reset email will be sent',
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Reset password
 */
export async function resetPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const { token, newPassword } = req.body;

    // Verify token
    let decoded: any;
    try {
      decoded = verify(token, JWT_SECRET);
    } catch (err) {
      throw BadRequestError('Invalid or expired reset token');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id: decoded.id },
      data: { passwordHash: hashedPassword },
    });

    res.json({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Refresh token
 */
export async function refreshToken(req: Request, res: Response, next: NextFunction) {
  try {
    const { token } = req.body;

    if (!token) {
      throw BadRequestError('Token is required');
    }

    let decoded: any;
    try {
      decoded = verify(token, JWT_SECRET);
    } catch (err) {
      throw UnauthorizedError('Invalid token');
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, role: true },
    });

    if (!user) {
      throw UnauthorizedError('User not found');
    }

    const newToken = sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      success: true,
      data: { token: newToken },
    });
  } catch (error) {
    next(error);
  }
}

