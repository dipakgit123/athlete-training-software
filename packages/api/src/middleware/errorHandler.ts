/**
 * Error Handler Middleware
 * Centralized error handling for the API
 */

import { Request, Response, NextFunction } from 'express';

// Custom API Error class
export class ApiError extends Error {
  statusCode: number;
  isOperational: boolean;
  details?: any;

  constructor(
    statusCode: number,
    message: string,
    isOperational = true,
    details?: any
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Common error factory functions
export const BadRequestError = (message: string, details?: any) =>
  new ApiError(400, message, true, details);

export const UnauthorizedError = (message = 'Unauthorized') =>
  new ApiError(401, message);

export const ForbiddenError = (message = 'Forbidden') =>
  new ApiError(403, message);

export const NotFoundError = (resource = 'Resource') =>
  new ApiError(404, `${resource} not found`);

export const ConflictError = (message: string) =>
  new ApiError(409, message);

export const ValidationError = (details: any) =>
  new ApiError(422, 'Validation failed', true, details);

export const InternalError = (message = 'Internal server error') =>
  new ApiError(500, message, false);

// ApiError static methods for convenience
export const ApiErrorHelpers = {
  badRequest: (message: string, details?: any) => new ApiError(400, message, true, details),
  unauthorized: (message = 'Unauthorized') => new ApiError(401, message),
  forbidden: (message = 'Forbidden') => new ApiError(403, message),
  notFound: (resource = 'Resource') => new ApiError(404, `${resource} not found`),
  conflict: (message: string) => new ApiError(409, message),
  validation: (details: any) => new ApiError(422, 'Validation failed', true, details),
  internal: (message = 'Internal server error') => new ApiError(500, message, false),
};

// Attach static methods to ApiError class
(ApiError as any).badRequest = ApiErrorHelpers.badRequest;
(ApiError as any).unauthorized = ApiErrorHelpers.unauthorized;
(ApiError as any).forbidden = ApiErrorHelpers.forbidden;
(ApiError as any).notFound = ApiErrorHelpers.notFound;
(ApiError as any).conflict = ApiErrorHelpers.conflict;
(ApiError as any).validation = ApiErrorHelpers.validation;
(ApiError as any).internal = ApiErrorHelpers.internal;

// Error response interface
interface ErrorResponse {
  success: false;
  error: {
    message: string;
    code: number;
    details?: any;
  };
  timestamp: string;
  path: string;
}

// Error handler middleware
export function errorHandler(
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Log error
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    body: req.body,
    timestamp: new Date().toISOString(),
  });

  // Default error values
  let statusCode = 500;
  let message = 'Internal server error';
  let details: any = undefined;

  // Handle ApiError
  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    details = err.details;
  }

  // Handle Zod validation errors
  if (err.name === 'ZodError') {
    statusCode = 422;
    message = 'Validation failed';
    details = (err as any).errors;
  }

  // Handle Prisma errors
  if (err.name === 'PrismaClientKnownRequestError') {
    const prismaError = err as any;
    switch (prismaError.code) {
      case 'P2002':
        statusCode = 409;
        message = 'Unique constraint violation';
        details = { field: prismaError.meta?.target };
        break;
      case 'P2025':
        statusCode = 404;
        message = 'Record not found';
        break;
      default:
        statusCode = 400;
        message = 'Database error';
    }
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  // Build error response
  const errorResponse: ErrorResponse = {
    success: false,
    error: {
      message,
      code: statusCode,
      ...(details && { details }),
    },
    timestamp: new Date().toISOString(),
    path: req.path,
  };

  // Don't leak stack traces in production
  if (process.env.NODE_ENV === 'development' && err.stack) {
    (errorResponse.error as any).stack = err.stack;
  }

  res.status(statusCode).json(errorResponse);
}

export default errorHandler;
