import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';
import { Prisma } from '@prisma/client';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Operational / known errors
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
      },
    });
    return;
  }

  // Prisma unique constraint
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      res.status(409).json({
        success: false,
        error: {
          code: 'CONFLICT',
          message: `Duplicate value on field: ${(err.meta?.target as string[])?.join(', ')}`,
        },
      });
      return;
    }
    if (err.code === 'P2025') {
      res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Record not found' },
      });
      return;
    }
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    res.status(401).json({
      success: false,
      error: { code: 'INVALID_TOKEN', message: 'Invalid token' },
    });
    return;
  }
  if (err.name === 'TokenExpiredError') {
    res.status(401).json({
      success: false,
      error: { code: 'TOKEN_EXPIRED', message: 'Token expired' },
    });
    return;
  }

  // Unknown / programming errors
  console.error('💥 Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
    },
  });
};
