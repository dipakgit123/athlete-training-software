/**
 * Not Found Middleware
 * Handles 404 errors for undefined routes
 */

import { Request, Response } from 'express';

export function notFound(req: Request, res: Response) {
  res.status(404).json({
    success: false,
    error: {
      message: `Route not found: ${req.method} ${req.originalUrl}`,
      code: 404,
    },
    timestamp: new Date().toISOString(),
    path: req.path,
  });
}

export default notFound;
