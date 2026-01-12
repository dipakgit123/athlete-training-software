/**
 * Validation Middleware
 * Request validation using Zod schemas
 */

import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema } from 'zod';
import { ValidationError } from './errorHandler';

type RequestLocation = 'body' | 'query' | 'params';

/**
 * Validate request data against a Zod schema
 */
export function validate(
  schema: ZodSchema,
  location: RequestLocation = 'body'
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req[location];
      const validated = await schema.parseAsync(data);

      // Replace request data with validated & transformed data
      req[location] = validated;

      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code,
        }));

        next(ValidationError(formattedErrors));
      } else {
        next(error);
      }
    }
  };
}

/**
 * Validate multiple locations
 */
export function validateRequest(schemas: {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors: any[] = [];

      // Validate each location
      for (const [location, schema] of Object.entries(schemas)) {
        if (schema) {
          try {
            const data = req[location as RequestLocation];
            const validated = await schema.parseAsync(data);
            req[location as RequestLocation] = validated;
          } catch (error) {
            if (error instanceof z.ZodError) {
              errors.push(
                ...error.errors.map((err) => ({
                  location,
                  field: err.path.join('.'),
                  message: err.message,
                  code: err.code,
                }))
              );
            } else {
              throw error;
            }
          }
        }
      }

      if (errors.length > 0) {
        next(ValidationError(errors));
      } else {
        next();
      }
    } catch (error) {
      next(error);
    }
  };
}

// Common validation schemas
export const commonSchemas = {
  // Pagination
  pagination: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
  }),

  // ID parameter
  idParam: z.object({
    id: z.string().min(1, 'ID is required'),
  }),

  // Date range
  dateRange: z.object({
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
  }).refine((data) => data.startDate <= data.endDate, {
    message: 'Start date must be before end date',
    path: ['startDate'],
  }),

  // Athlete ID parameter
  athleteIdParam: z.object({
    athleteId: z.string().uuid('Invalid athlete ID format'),
  }),
};

export default validate;
